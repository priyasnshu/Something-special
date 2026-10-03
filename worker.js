/* Cloudflare Worker: receives feedback from the GitHub Pages site and forwards it to Telegram.
   Secrets (never in frontend files):
     wrangler secret put TELEGRAM_BOT_TOKEN
     wrangler secret put TELEGRAM_CHAT_ID
   Required variable:
     ALLOWED_ORIGIN = the exact site origin, e.g. https://YOURNAME.github.io
*/
const MAX_PHOTO = 5 * 1024 * 1024;
const MAX_FEEDBACK = 800;
const MAX_CAPTION = 1024;
const truncate = (value, max) => Array.from(String(value || "")).slice(0, max).join("");
const jsonHeaders = { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" };

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = !!env.ALLOWED_ORIGIN && origin === env.ALLOWED_ORIGIN;
    const cors = {
      ...jsonHeaders,
      "Access-Control-Allow-Origin": allowed ? origin : "null",
      "Access-Control-Allow-Methods":"POST, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type",
      "Vary":"Origin"
    };
    const out = (status, ok, code) => new Response(JSON.stringify({ ok, code }), { status, headers:cors });

    if(req.method === "OPTIONS") return new Response(null, { status:204, headers:cors });
    if(req.method !== "POST") return out(405,false,"method");
    if(!allowed) return out(403,false,"origin");
    if(!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return out(500,false,"not_configured");

    let fd;
    try{ fd = await req.formData(); }catch(_){ return out(400,false,"bad_request"); }

    const ratingRaw = String(fd.get("rating") || "").trim();
    const rating = /^\d+$/.test(ratingRaw) ? Number(ratingRaw) : 0;
    const feedback = truncate(String(fd.get("feedback") || "").trim(), MAX_FEEDBACK);
    const session = truncate(String(fd.get("session") || "").trim(), 32).replace(/[^a-zA-Z0-9_-]/g, "");
    const attachPhoto = String(fd.get("attach_photo") || "") === "1";
    const photo = fd.get("photo");
    const hasPhoto = photo && typeof photo !== "string";

    if(!Number.isInteger(rating) || rating < 0 || rating > 5 || (!rating && !feedback)) return out(400,false,"invalid");
    if(attachPhoto && !hasPhoto) return out(400,false,"missing_photo");
    if(hasPhoto && photo.size > MAX_PHOTO) return out(413,false,"photo_too_big");
    if(hasPhoto && !/^image\/(jpeg|png)$/.test(photo.type || "")) return out(415,false,"photo_type");

    let caption =
      "🐰 New Bunny Feedback\n\n" +
      "⭐ Rating: " + (rating ? rating + "/5" : "not rated") + "\n\n" +
      "💬 Feedback:\n" + (feedback || "(no text)") + "\n\n" +
      "📅 Time:\n" + new Date().toISOString();
    if(session) caption += "\n\n🧩 Session: " + session;
    caption = truncate(caption, MAX_CAPTION);

    const body = new FormData();
    body.append("chat_id", env.TELEGRAM_CHAT_ID);
    if(hasPhoto){
      body.append("photo", photo, "bunny-pic.jpg");
      body.append("caption", caption);
    }else{
      body.append("text", caption);
    }

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15000);
    try{
      const endpoint = "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/" + (hasPhoto ? "sendPhoto" : "sendMessage");
      const response = await fetch(endpoint, { method:"POST", body, signal:ctl.signal });
      if(response.ok) return out(200,true,"sent");
      if(response.status === 429) return out(429,false,"telegram_rate_limited");
      return out(502,false,"telegram_error");
    }catch(_){
      return out(504,false,"timeout");
    }finally{
      clearTimeout(timer);
    }
  }
};
