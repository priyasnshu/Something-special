/*
  Cloudflare Worker: receives feedback from the static site and forwards it to Telegram.

  Required secrets / variables:
    wrangler secret put TELEGRAM_BOT_TOKEN
    wrangler secret put TELEGRAM_CHAT_ID
    wrangler deploy

  Required variable:
    ALLOWED_ORIGIN = the exact public origin, e.g. https://yourname.github.io

  Optional:
    ALLOWED_ORIGINS = comma-separated public origins if you use more than one host.

  IMPORTANT: the bot token must stay in Worker secrets. Never put it in index.html,
  feedback-config.js, GitHub Pages, or any other browser-delivered file.
*/
const MAX_PHOTO = 5 * 1024 * 1024;
const MAX_FEEDBACK = 800;
const MAX_CAPTION = 1024;
const truncate = (value, max) => Array.from(String(value || "")).slice(0, max).join("");
const jsonHeaders = { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" };

function originAllowed(req, env){
  const origin = req.headers.get("Origin") || "";
  const list = String(env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  return !!origin && list.includes(origin);
}

function corsHeaders(req, env){
  const origin = req.headers.get("Origin") || "";
  const allowed = originAllowed(req, env);
  return {
    ...jsonHeaders,
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Methods":"POST, OPTIONS, GET",
    "Access-Control-Allow-Headers":"Content-Type",
    "Vary":"Origin"
  };
}

function out(req, env, status, ok, code, extra = {}){
  return new Response(JSON.stringify({ ok, code, ...extra }), { status, headers: corsHeaders(req, env) });
}

async function telegramSend(env, method, body, signal){
  const url = "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/" + method;
  const r = await fetch(url, { method:"POST", body, signal });
  let data = null;
  try{ data = await r.json(); }catch(_){}
  return { response:r, data };
}

export async function handleFeedback(req, env){
  if(req.method === "OPTIONS") return new Response(null, { status:204, headers:corsHeaders(req, env) });
  if(req.method === "GET"){
    const configured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && (env.ALLOWED_ORIGIN || env.ALLOWED_ORIGINS));
    return out(req, env, 200, true, "health", { configured });
  }
  if(req.method !== "POST") return out(req, env, 405, false, "method");
  if(!originAllowed(req, env)) return out(req, env, 403, false, "origin");
  if(!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return out(req, env, 500, false, "not_configured");

  let fd;
  try{ fd = await req.formData(); }catch(_){ return out(req, env, 400, false, "bad_request"); }

  const ratingRaw = String(fd.get("rating") || "").trim();
  const rating = /^\d+$/.test(ratingRaw) ? Number(ratingRaw) : 0;
  const feedback = truncate(String(fd.get("feedback") || "").trim(), MAX_FEEDBACK);
  const session = truncate(String(fd.get("session") || "").trim(), 32).replace(/[^a-zA-Z0-9_-]/g, "");
  const attachPhoto = String(fd.get("attach_photo") || "") === "1";
  const photo = fd.get("photo");
  const hasPhoto = photo && typeof photo !== "string";

  if(!Number.isInteger(rating) || rating < 0 || rating > 5 || (!rating && !feedback)) return out(req, env, 400, false, "invalid");
  if(attachPhoto && !hasPhoto) return out(req, env, 400, false, "missing_photo");
  if(hasPhoto && !attachPhoto) return out(req, env, 400, false, "photo_not_requested");
  if(hasPhoto && photo.size > MAX_PHOTO) return out(req, env, 413, false, "photo_too_big");
  if(hasPhoto && !/^image\/(jpeg|png)$/.test(photo.type || "")) return out(req, env, 415, false, "photo_type");

  let caption =
    "🐰 New Bunny Feedback\n\n" +
    "⭐ Rating: " + (rating ? rating + "/5" : "not rated") + "\n\n" +
    "💬 Feedback:\n" + (feedback || "(no text)") + "\n\n" +
    "📅 Time:\n" + new Date().toISOString();
  if(session) caption += "\n\n🧩 Session: " + session;
  caption = truncate(caption, MAX_CAPTION);

  const body = new FormData();
  body.append("chat_id", String(env.TELEGRAM_CHAT_ID));
  if(hasPhoto){
    body.append("photo", photo, "bunny-pic.jpg");
    body.append("caption", caption);
  }else{
    body.append("text", caption);
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try{
    const method = hasPhoto ? "sendPhoto" : "sendMessage";
    const { response, data } = await telegramSend(env, method, body, ctl.signal);
    if(response.ok) return out(req, env, 200, true, "sent");
    if(response.status === 429) return out(req, env, 429, false, "telegram_rate_limited");
    const apiCode = data && data.description ? truncate(data.description, 180) : "telegram_error";
    return out(req, env, 502, false, "telegram_error", { detail: apiCode });
  }catch(err){
    return out(req, env, 504, false, err && err.name === "AbortError" ? "timeout" : "telegram_network");
  }finally{ clearTimeout(timer); }
}

export default { fetch(req, env){ return handleFeedback(req, env); } };
