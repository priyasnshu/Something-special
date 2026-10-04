/* =====================================================================
   ✏️ MEDIA MAP — every photo / gif / video / song on the page comes from the
   lists right below. Change them HERE and nowhere else.

   Put the files in the SAME folder as this index.html:

     your-folder/
       index.html
       1978.jpg  2033.jpg  2034.jpg        ← PHOTOS
       gifs/2691.gif … 2696.gif            ← NO_GIFS
       videos/memory.mp4   (optional)      ← COACHES  (a video inside a coach)
       songs/kaise-hua.mp3 (optional)      ← SONGS    f:"…"  (audio file)

   WHERE EACH LIST IS USED
     PHOTOS  → photo inside the front card (#final-slot) · the 6 boxes on page 1 ·
               photos that pop out of the 3 gift boxes · train windows (fallback)
     NO_GIFS → the round bubbles on the first page (one new bubble per "No" tap)
     COACHES → the 3 windows of every train coach + the pop-up when a coach is
               tapped (photos AND videos: .mp4 / .webm / .mov)
     SONGS   → the music player on the "A Note For You" page
               (audio file  f  is tried first, YouTube  yt  is the backup)

   ⚠ A missing file never breaks the page: a pink 💗 is shown instead of the
     picture. To see exactly which files were not found, open the page with
     ?debug=1 (or tap "Smile!" five times on the camera screen).

   ⚠ Files next to the page only load when the page is opened from a real folder
     or website (file:// or https://). If it is opened from a "content://…" link
     (Android Files / Downloads / WhatsApp / Drive preview) the browser cannot see
     the other files → every picture shows 💗 and YouTube shows "Error 153".
     Best: put the whole folder on GitHub Pages / Netlify and send her the https
     link. The camera and YouTube also need https to work.
===================================================================== */

// IMAGE SRC ▸ PHOTOS
// Used on: front-card photo, the 6 boxes, photos popping out of the gifts, train windows
const PHOTOS = ["1978.jpg", "2033.jpg", "2034.jpg"];

// IMAGE SRC ▸ NO_GIFS  (the round bubbles on the first page)
// Order = order of the "No" taps: tap 1 shows the first, tap 2 the second … tap 6 the last.
// Keep these files inside a folder named "gifs" beside index.html.
const NO_GIFS = [
  "3ec6221c670981178064ca829d213c20.gif",
  "ba57f1b034c0031ffe66fb83ed7ca89c.gif",
  "f96bce328d8056fd6ade9627450f1d1d.gif",
  "bubu-dudu.gif",
  "bubududu-panda.gif",
  "bubu-dudu-bubu.gif",
  "72cbbea047ade8c718ad824765569682.gif",

   
];

// IMAGE + VIDEO SRC ▸ COACHES  (tap a coach on the train)
// Photos or videos (.mp4 / .webm / .mov). A video that can't be found is simply left out.
const COACHES = [
  ["1978.jpg", "2033.jpg"],   // Coach 1
  ["2034.jpg", "1978.jpg"],   // Coach 2
  ["2033.jpg", "2034.jpg"],   // Coach 3
  ["1978.jpg", "2034.jpg"],   // Coach 4
  ["2033.jpg", "1978.jpg"],   // Coach 5
  ["2034.jpg", "2033.jpg"],   // Coach 6
  ["1978.jpg", "2033.jpg", "2034.jpg", "videos/memory.mp4"]  // Coach 7 — VIDEO SRC is the last item; delete it if you have no video
];

// AUDIO + YOUTUBE SRC ▸ SONGS  (the player on "A Note For You")
//   t  = the name shown on screen (nothing else is written: no "our favourite", no "tap to play")
//   yt = YouTube video ID (the part after  v=  in the YouTube link)
//   f  = optional audio file, e.g. "songs/my-song.mp3". It plays without YouTube and is
//        tried first; if the file is missing the page uses the YouTube video instead.
//   a  = optional small grey line under the name (leave it out to show only the name)
const SONGS = [
  // LIST 1 — ✏️ WRITE THE SONG NAME between the quotes of  t:
  { t: "Song 1", f: "", yt: "0IIJxkDtkHY" },

  // LIST 2 — Kaise Hua  (spare YouTube ID if the first one won't embed: "WKv07mnKVEE")
  { t: "Kaise Hua", f: "songs/kaise-hua.mp3", yt: "nfaa6lh9xH4" }
];

/* ===================================================================== */
const $ = id => document.getElementById(id);
const isVid = s => /\.(mp4|webm|mov|m4v)$/i.test(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" }[c]));
const messages = [
  "I'm truly sorry, Abhu. Please forgive me. 💕","I'm still saying sorry gently. 🥺","I really hope we're okay again. 🌸",
  "I'm asking nicely... please forgive me. 💗","Still sorry, Abhu. 🌷","One more little please... forgive me? 💞",
  "You mean a lot to me. Please forgive me. 💖"
];
let noClicks = 0, noLocked = false, noFinished = false, currentPage = 0, trainStarted = false, trainDone = false;
const bubbles = [];

const FALLBACK = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe2eb"/><stop offset="1" stop-color="#ffc3d4"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="62" font-size="34" text-anchor="middle">💗</text></svg>`);

const MISSING = window.__missingMedia = [];            /* files the browser could not find (shown in the ?debug=1 panel) */
function image(src){                                   /* ← every picture on the page is created here */
  const img = new Image();
  img.alt = ""; img.draggable = false;
  img.onerror = () => {
    img.onerror = null;
    if(src && !MISSING.includes(src)){ MISSING.push(src); console.warn("[sorry] file not found: " + src); }
    img.src = FALLBACK;                                /* pink 💗 stand-in */
  };
  img.src = src;
  return img;
}
const viewport = () => ({ w: window.visualViewport ? window.visualViewport.width : innerWidth, h: window.visualViewport ? window.visualViewport.height : innerHeight });
function toast(t){ const e = $("toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1600); }

$("final-slot").appendChild(image(PHOTOS[0]));   /* IMAGE SRC ▸ PHOTOS[0] (round photo in the front card, shown after the last "No") */

/* ---------- front particles ---------- */
for(let i = 0; i < 25; i++){
  const d = document.createElement("span");
  d.className = "main-dot";
  d.style.left = Math.random()*100 + "%";
  d.style.top = Math.random()*100 + "%";
  d.style.setProperty("--d", 3 + Math.random()*5 + "s");
  d.style.setProperty("--x", (Math.random()*40-20) + "px");
  d.style.animationDelay = -Math.random()*6 + "s";
  $("main-particles").appendChild(d);
}

/* ---------- dodging NO button ---------- */
const hit = (a,b,pad=0) => a.left < b.right+pad && a.right > b.left-pad && a.top < b.bottom+pad && a.bottom > b.top-pad;

function releaseNo(){
  const btn = $("no");
  if(btn.dataset.free) return;
  const r = btn.getBoundingClientRect();
  document.body.appendChild(btn);
  Object.assign(btn.style, { position:"fixed", left:r.left+"px", top:r.top+"px", margin:"0" });
  btn.dataset.free = "1";
}
function moveNo(){
  if(noFinished) return;
  const btn = $("no"); releaseNo();
  const v = viewport(), r = btn.getBoundingClientRect(), m = 12;
  const maxX = Math.max(m, v.w-r.width-m), maxY = Math.max(m, v.h-r.height-m);
  const avoid = [$("card"), $("yes"), $("message")].map(e => e.getBoundingClientRect());
  let x = m, y = m;
  for(let i = 0; i < 80; i++){
    x = m + Math.random()*Math.max(1, maxX-m);
    y = m + Math.random()*Math.max(1, maxY-m);
    const box = { left:x, top:y, right:x+r.width, bottom:y+r.height };
    if(!avoid.some((a,k) => hit(box, a, k===1 ? 26 : 10))) break;
  }
  btn.style.left = x+"px"; btn.style.top = y+"px";
}

/* ---------- photo bubbles ---------- */
function placeBubble(b, others){
  const v = viewport(), card = $("card").getBoundingClientRect(), size = b.offsetWidth;
  const pad = 26;                                      /* bubbles float ±25px, so keep that gap from the card */
  const zones = [
    [10,10,card.left-pad,v.h-10], [card.right+pad,10,v.w-10,v.h-10],
    [10,10,v.w-10,card.top-pad], [10,card.bottom+pad,v.w-10,v.h-10]
  ].filter(z => z[2]-z[0] >= size && z[3]-z[1] >= size);
  if(!zones.length) return;
  let x = 10, y = 10;
  for(let i = 0; i < 50; i++){
    const z = zones[Math.floor(Math.random()*zones.length)];
    x = z[0] + Math.random()*Math.max(1, z[2]-z[0]-size);
    y = z[1] + Math.random()*Math.max(1, z[3]-z[1]-size);
    if(!others.some(o => Math.hypot(o.x-x, o.y-y) < size*1.08)) break;
  }
  b.x = x; b.y = y; b.style.left = x+"px"; b.style.top = y+"px";
}
const bubbleSize = () => Math.min(110, Math.max(64, viewport().w*.17));
/* IMAGE SRC ▸ the picture inside each round bubble is `src` = NO_GIFS[tap number - 1] */
function addBubble(src){
  const b = document.createElement("div");
  b.className = "photo-bubble";
  const size = bubbleSize();
  b.style.width = b.style.height = size+"px";
  b.style.setProperty("--dx", (Math.random() > .5 ? 1 : -1)*(10+Math.random()*18) + "px");
  b.style.setProperty("--dur", 4+Math.random()*2 + "s");
  b.appendChild(image(src));
  $("bubble-layer").appendChild(b);
  placeBubble(b, bubbles);
  bubbles.push(b);
}
/* the card grows when the final photo appears (or the window changes size):
   move any bubble that now sits under the card or off-screen */
function fixBubbles(){
  if(!$("card").offsetWidth) return;
  const c = $("card").getBoundingClientRect(), v = viewport(), size = bubbleSize(), placed = [];
  bubbles.forEach(b => {
    b.style.width = b.style.height = size+"px";
    const box = { left:b.x, top:b.y, right:b.x+size, bottom:b.y+size };
    if(!(b.x >= 0) || box.right > v.w || box.bottom > v.h || hit(box, c, 14)) placeBubble(b, placed);
    placed.push(b);
  });
}
let fixT = 0;
addEventListener("resize", () => { clearTimeout(fixT); fixT = setTimeout(fixBubbles, 150); });
function say(t){ const s = document.createElement("span"); s.textContent = t; $("message").replaceChildren(s); }

$("no").addEventListener("click", e => {
  e.preventDefault();
  if(noLocked || noFinished) return;
  noLocked = true; noClicks++;
  say(messages[Math.min(noClicks-1, messages.length-1)]);

  // No taps 1–6 add one GIF bubble each (NO_GIFS, in order). Tap 7 adds nothing: the photo appears in the card.
  if(noClicks <= NO_GIFS.length) addBubble(NO_GIFS[noClicks - 1]);

  $("yes").style.setProperty("--yes-scale", Math.min(1+noClicks*.06, 1.4));
  if(noClicks < 8){ setTimeout(() => { moveNo(); noLocked = false; }, 120); return; }
  $("final-photo").classList.add("show");
  setTimeout(fixBubbles, 650);                          /* card just got taller */
  noFinished = true;
  const btn = $("no"), r = btn.getBoundingClientRect(), cx = r.left+r.width/2, cy = r.top+r.height/2;
  for(let i = 0; i < 42; i++){
    const p = document.createElement("span");
    p.className = "burst"; p.style.left = cx+"px"; p.style.top = cy+"px";
    const a = Math.random()*Math.PI*2, d = 45+Math.random()*170;
    p.style.setProperty("--x", Math.cos(a)*d + "px");
    p.style.setProperty("--y", Math.sin(a)*d + "px");
    p.style.background = ["#ff7697","#ffb2c5","#ffd4df","#fff"][i%4];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 850);
  }
  setTimeout(() => { btn.style.display = "none"; noLocked = false; }, 350);
});

/* ---------- experience pages ---------- */
const experience = $("experience");
const pages = [...document.querySelectorAll(".exp-page")];
const dots = [...document.querySelectorAll(".progress-dot")];
function showPage(i){
  currentPage = Math.max(0, Math.min(pages.length-1, i));
  pages.forEach((p,k) => p.classList.toggle("active", k === currentPage));
  dots.forEach((d,k) => d.classList.toggle("active", k === currentPage));
}
[...document.querySelectorAll(".photo-tile")].forEach((tile,i) => {
  tile.insertBefore(image(PHOTOS[i % PHOTOS.length]), tile.firstChild);   /* IMAGE SRC ▸ PHOTOS (box 1,2,3,4… use photo 1,2,3,1…) */
  tile.addEventListener("click", () => {
    tile.classList.add("revealed");
    if(!document.querySelector(".photo-tile:not(.revealed)")) $("page1Next").classList.add("glow");
  });
});
$("yes").addEventListener("click", () => {
  if(noLocked) return;
  $("main-screen").style.display = "none";
  experience.classList.add("active", "bloom");
  showPage(0);
  startBlossom(() => experience.classList.remove("bloom"));
});
$("page1Next").onclick = () => showPage(1);
$("page2Next").onclick = () => showPage(2);
$("page3Next").onclick = () => showPage(3);

/* ---------- song player ----------
   AUDIO SRC   ▸ SONGS[i].f   (file)    — tried first when it is set
   YOUTUBE SRC ▸ SONGS[i].yt  (video ID) — used when there is no file, or the file is missing
   If YouTube itself refuses (Error 153 on content:// / file:// pages), the page shows
   a friendly "open on YouTube" button instead of the black error box. */
const aud = $("aud"), plr = $("player");
let si = 0, yt = null, ytPending = null, useYtNow = false, wantPlay = false;
$("plist").innerHTML = SONGS.map((s,i) => `<button class="song" data-i="${i}"><b>${i+1}</b><span>${esc(s.t)}</span><i>${esc(s.a || "")}</i></button>`).join("");
$("eq").innerHTML = "<i></i>".repeat(13);
const setPlaying = on => { plr.classList.toggle("playing", on); $("pplay").textContent = on ? "❚❚" : "▶"; };
function ytBad(on, why){
  plr.classList.toggle("ytbad", on);
  if(on){ setPlaying(false); console.warn("[sorry] YouTube can't play inside this page (" + why + ")"); }
}
function ytLoad(id, play){
  $("ytlink").href = "https://youtu.be/" + id;
  ytBad(false);
  if(yt && yt.loadVideoById){ play ? yt.loadVideoById(id) : yt.cueVideoById(id); return; }
  ytPending = [id, play];
  if(document.getElementById("yt-api")) return;
  window.onYouTubeIframeAPIReady = () => {
    const vars = { playsinline: 1, rel: 0, autoplay: ytPending[1] ? 1 : 0 };
    if(/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    yt = new YT.Player("ytbox", { videoId: ytPending[0], width: "100%", height: "100%", playerVars: vars,
      events: {
        onReady: e => { ytBad(false); const p = ytPending; if(p){ p[1] ? e.target.loadVideoById(p[0]) : e.target.cueVideoById(p[0]); } },
        onStateChange: e => { setPlaying(e.data === 1); if(e.data === 0) loadSong(si+1, true); },
        onError: e => ytBad(true, "error " + e.data)
      } });
  };
  const sc = document.createElement("script");
  sc.id = "yt-api"; sc.src = "https://www.youtube.com/iframe_api";
  let gaveUp = false;
  const giveUp = why => { if(yt || gaveUp) return; gaveUp = true; sc.remove(); ytBad(true, why); };   /* script removed so the next song tries again */
  sc.onerror = () => giveUp("YouTube script blocked or offline");
  setTimeout(() => giveUp("YouTube took too long to load"), 10000);
  document.head.appendChild(sc);
}
function playFile(s, play){
  useYtNow = false; plr.classList.remove("yt");
  if(yt && yt.pauseVideo) yt.pauseVideo();
  aud.src = s.f;
  if(play) aud.play().catch(() => {});                 /* a missing file is handled by aud.onerror below */
}
function playYT(s, play){
  useYtNow = true; plr.classList.add("yt");
  setPlaying(false);                                   /* YouTube's own state events switch it back on */
  aud.pause();
  if(aud.getAttribute("src")){ aud.removeAttribute("src"); aud.load(); }
  ytLoad(s.yt, play);
}
function loadSong(i, play){
  si = (i + SONGS.length) % SONGS.length;
  const s = SONGS[si];
  wantPlay = !!play;
  $("ptitle").textContent = s.t; $("partist").textContent = s.a || "";
  $("pprog").style.width = "0";
  [...$("plist").children].forEach((e,k) => e.classList.toggle("on", k === si));
  setPlaying(false); ytBad(false);
  if(s.f) playFile(s, play); else if(s.yt) playYT(s, play);
}
aud.onerror = () => {
  const s = SONGS[si];
  if(!aud.getAttribute("src")) return;
  console.warn("[sorry] audio file not found: " + s.f);
  if(!MISSING.includes(s.f)) MISSING.push(s.f);
  if(s.yt) playYT(s, wantPlay);
  else $("partist").textContent = "Put " + s.f + " next to this page 🎵";
};
$("plist").addEventListener("click", e => { const b = e.target.closest(".song"); if(b) loadSong(+b.dataset.i, true); });
$("pplay").onclick = () => {
  if(useYtNow){
    if(!yt || !yt.getPlayerState) return loadSong(si, true);
    return yt.getPlayerState() === 1 ? yt.pauseVideo() : yt.playVideo();
  }
  if(aud.paused){ wantPlay = true; aud.play().catch(() => {}); } else aud.pause();
};
$("pprev").onclick = () => loadSong(si-1, true);
$("pnext").onclick = () => loadSong(si+1, true);
aud.onplay = () => setPlaying(true);
aud.onpause = () => setPlaying(false);
aud.onended = () => loadSong(si+1, true);
aud.ontimeupdate = () => { if(aud.duration) $("pprog").style.width = aud.currentTime/aud.duration*100 + "%"; };
$("pline").onclick = e => { if(aud.duration){ const r = $("pline").getBoundingClientRect(); aud.currentTime = (e.clientX-r.left)/r.width*aud.duration; } };
loadSong(0, false);

/* ---------- gifts: lid opens, photos + hearts jump out ---------- */
[...document.querySelectorAll(".gift")].forEach((g,gi) => {
  g.addEventListener("click", () => {
    g.classList.add("shake");
    setTimeout(() => {
      g.classList.remove("shake"); g.classList.add("open");
      if(!document.querySelector(".gift:not(.open)")) $("page3Next").classList.add("glow");
      g.querySelector(".gift-label").textContent = "Again 💗";
      const r = g.getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + 22;
      for(let k = 0; k < 8; k++){
        const el = document.createElement("div");
        el.className = "pop";
        el.style.left = cx-27 + "px"; el.style.top = cy + "px";
        if(k < 4) el.appendChild(image(PHOTOS[(gi+k) % PHOTOS.length]));   /* IMAGE SRC ▸ PHOTOS (pops out of the gift) */
        else { el.classList.add("em"); el.textContent = ["💖","✨","🌸","💗"][k-4]; }
        const dx = (k-3.5)*(Math.min(innerWidth,460)/10) + (Math.random()*14-7);
        const up = -(110 + Math.random()*90), rot = Math.random()*40-20;
        el.animate([
          { transform:"translate(0,0) scale(.2) rotate(0deg)", opacity:0 },
          { transform:`translate(${dx*.7}px,${up}px) scale(1.2) rotate(${rot}deg)`, opacity:1, offset:.35 },
          { transform:`translate(${dx}px,${up+16}px) scale(1) rotate(${rot}deg)`, opacity:1, offset:.75 },
          { transform:`translate(${dx}px,${up-24}px) scale(.9) rotate(${rot}deg)`, opacity:0 }
        ], { duration:2800, delay:k*70, easing:"ease-out", fill:"both" }).onfinish = () => el.remove();
        experience.appendChild(el);
      }
    }, 420);
  });
});

/* ---------- train ---------- */
const trainScene = $("train-scene"), transition = $("train-transition"), train = $("train"), railSvg = $("rail-svg");
const rails = ["rail-bed","rail-ties","rail-metal","rail-highlight"].map($);
let trainCars = [], trainFrame = 0, dist = 0, paused = false;
const PALETTE = [["#ffb3c9","#ff7aa2"],["#b8f0d8","#6fd3ab"],["#fff0a8","#ffd24d"],["#b9dcff","#7fb6f5"],["#e3c7ff","#b98af0"],["#ffd0b0","#ff9f73"],["#ffc2e2","#f57fba"]];
const syncPause = () => { paused = $("coach-modal").classList.contains("show"); };

function createTrainStars(){
  const host = $("train-stars"); host.replaceChildren();
  for(let i = 0; i < 70; i++){
    const s = document.createElement("span");
    s.className = "train-star";
    s.style.left = Math.random()*100 + "%"; s.style.top = Math.random()*55 + "%";
    s.style.setProperty("--td", 2+Math.random()*4 + "s");
    s.style.animationDelay = -Math.random()*5 + "s";
    host.appendChild(s);
  }
}
function createLights(){
  const host = $("lights"); host.replaceChildren();
  for(let i = 0; i < 16; i++){
    const l = document.createElement("span");
    l.className = "float-light";
    l.style.left = 3+Math.random()*94 + "%";
    l.style.setProperty("--ld", 10+Math.random()*10 + "s");
    l.style.setProperty("--delay", -Math.random()*15 + "s");
    l.style.setProperty("--lx", (Math.random()*120-60) + "px");
    host.appendChild(l);
  }
}
const wheels = `<div class="undercarriage"><div class="bogie left"><i class="wheel"></i><i class="wheel"></i></div><div class="bogie right"><i class="wheel"></i><i class="wheel"></i></div></div>`;

function createCoach(n){
  const car = document.createElement("div");
  car.className = "train-car coach";
  car.style.setProperty("--i", n);
  car.style.setProperty("--c1", PALETTE[n-1][0]);
  car.style.setProperty("--c2", PALETTE[n-1][1]);
  car.innerHTML = `<div class="car-shell"><div class="train-roof"></div><b class="num">${n}</b><div class="coach-body"><div class="train-windows"></div><div class="train-door"></div></div>${wheels}</div>`;
  const imgs = COACHES[n-1].filter(s => !isVid(s));
  for(let k = 0; k < 3; k++){
    const w = document.createElement("div");
    w.className = "train-window";
    w.appendChild(image(imgs.length ? imgs[k % imgs.length] : PHOTOS[k % PHOTOS.length]));   /* IMAGE SRC ▸ COACHES[n] photos (train window) */
    car.querySelector(".train-windows").appendChild(w);
  }
  return car;
}
function createEngine(){
  const car = document.createElement("div");
  car.className = "train-car engine";
  car.style.setProperty("--c1", "#ff9fbd");
  car.style.setProperty("--c2", "#e8527e");
  car.innerHTML = `<div class="car-shell"><div class="engine-roof"></div><div class="engine-body"><div class="engine-glass"><i></i><i></i></div><div class="face"><i></i><i></i><b></b></div></div><div class="engine-nose"></div><div class="engine-light"></div>${wheels}</div>`;
  return car;
}
function buildTrain(){
  train.replaceChildren();
  trainCars = [createEngine()];
  for(let i = 1; i <= 7; i++) trainCars.push(createCoach(i));
  trainCars.forEach(c => train.appendChild(c));
}
function buildPath(){
  const v = viewport(), startX = -v.w*.2, endX = v.w*1.16, startY = v.h*.17, groundY = v.h*.7, width = endX-startX;
  const pts = [];
  for(let x = startX; x <= endX; x += 6){
    const t = Math.min(1, Math.max(0, (x-startX)/width)), sm = t*t*(3-2*t);
    const wave = Math.sin(t*Math.PI*3.4)*Math.min(52, v.h*.055)*(1-t*.75);
    pts.push({ x, y: startY + (groundY-startY)*sm + wave });
  }
  return { d: "M" + pts.map(p => p.x.toFixed(1)+" "+p.y.toFixed(1)).join(" L"), pts };
}

/* the train rides in, then keeps looping so any coach can be tapped */
function playTrain(keep){
  cancelAnimationFrame(trainFrame);
  if(!keep){ dist = 0; trainDone = false; trainScene.classList.remove("train-done"); }
  const v = viewport(), path = buildPath();
  const W = Math.max(105, Math.min(145, v.w*.2));
  trainScene.style.setProperty("--train-w", W+"px");
  trainScene.style.setProperty("--train-h", W*.62+"px");
  trainScene.style.setProperty("--rail-path", `path("${path.d}")`);
  railSvg.setAttribute("viewBox", `0 0 ${v.w} ${v.h}`);
  rails.forEach(r => r.setAttribute("d", path.d));
  if(!keep || !trainCars.length) buildTrain();
  const len = path.pts.reduce((s,p,i) => i ? s + Math.hypot(p.x-path.pts[i-1].x, p.y-path.pts[i-1].y) : 0, 0);
  const gap = W*.72, period = len + 8*gap, speed = Math.max(120, v.w*.2);
  let last = performance.now(), puffT = 0;
  const tick = now => {
    const dt = Math.min(.05, (now-last)/1000); last = now;
    if(!paused){ dist += dt*speed; puffT += dt; }
    trainCars.forEach((c,i) => {
      const raw = dist - i*gap, o = ((raw % period) + period) % period, vis = raw >= 0 && o <= len;
      c.style.opacity = vis ? 1 : 0;
      c.style.pointerEvents = vis ? "auto" : "none";
      c.style.offsetDistance = o + "px";
    });
    if(!trainDone && dist - 7*gap > len){ trainDone = true; trainScene.classList.add("train-done"); celebrate(); }
    if(puffT > .8){ puffT = 0; const r = trainCars[0].getBoundingClientRect();
      if(trainCars[0].style.opacity === "1" && r.left > 0 && r.left < v.w){
        const p = document.createElement("span"); p.className = "puff"; p.textContent = ["💗","☁️","✨"][Math.floor(Math.random()*3)];
        p.style.left = r.left + r.width*.2 + "px"; p.style.top = r.top + "px";
        trainScene.appendChild(p); setTimeout(() => p.remove(), 2300);
      } }
    trainFrame = requestAnimationFrame(tick);
  };
  trainFrame = requestAnimationFrame(tick);
}

function celebrate(){
  const v = viewport();
  for(let i = 0; i < 26; i++){
    const e = document.createElement("span");
    e.className = "puff"; e.style.animation = "none";
    e.textContent = ["💖","✨","🌸","💗","🎀"][i%5];
    e.style.left = Math.random()*v.w + "px"; e.style.top = v.h + "px";
    e.style.fontSize = (1 + Math.random()) + "rem";
    trainScene.appendChild(e);
    e.animate([
      { transform:"translateY(0) rotate(0deg)", opacity:1 },
      { transform:`translateY(${-(v.h*.5 + Math.random()*v.h*.4)}px) rotate(${Math.random()*80-40}deg)`, opacity:0 }
    ], { duration:2600 + Math.random()*1800, delay:Math.random()*600, easing:"ease-out", fill:"both" }).onfinish = () => e.remove();
  }
}

/* tap a coach -> inside photos / videos */
let downCar = null, downT = 0;
train.addEventListener("pointerdown", e => { downCar = e.target.closest(".train-car"); downT = performance.now(); });
train.addEventListener("click", e => {
  const car = e.target.closest(".train-car") || (performance.now() - downT < 700 ? downCar : null);
  if(!car) return;
  const n = trainCars.indexOf(car);
  if(n === 0){ toast("Toot toot! 🚂💕"); return; }
  $("cm-title").textContent = "Coach " + n + " 🚃";
  const box = $("cm-slides"); box.replaceChildren();
  COACHES[n-1].forEach(src => {
    const s = document.createElement("div"); s.className = "slide";
    if(isVid(src)){
      const vd = document.createElement("video");
      vd.src = src; vd.controls = true; vd.playsInline = true; vd.preload = "metadata";
      /* VIDEO SRC ▸ COACHES[n] (.mp4 / .webm / .mov). If it can't be found the slide is removed (or a 💗 if it was the only one) */
      vd.onerror = () => { console.warn("[sorry] video not found: " + src); if(!MISSING.includes(src)) MISSING.push(src); if(box.children.length > 1) s.remove(); else vd.replaceWith(image(src)); };
      s.appendChild(vd);
    } else s.appendChild(image(src));   /* IMAGE SRC ▸ COACHES[n] (pop-up when a coach is tapped) */
    box.appendChild(s);
  });
  box.scrollLeft = 0;
  $("coach-modal").classList.add("show");
  syncPause();
});
function closeCoach(){ $("coach-modal").classList.remove("show"); $("cm-slides").replaceChildren(); syncPause(); }
$("cm-close").onclick = closeCoach;
$("coach-modal").addEventListener("click", e => { if(e.target.id === "coach-modal") closeCoach(); });

$("launchTrain").onclick = () => {
  if(trainStarted) return;
  trainStarted = true;
  transition.classList.add("show");
  setTimeout(() => {
    pages.forEach(p => p.style.display = "none");
    transition.classList.remove("show");
    trainScene.classList.add("show");
    createTrainStars(); createLights(); 
    setTimeout(() => playTrain(false), 650);
  }, 950);
};

$("replay").onclick = () => {
  cancelAnimationFrame(trainFrame);
  closeCoach();
  syncPause();
  trainScene.classList.remove("show", "train-done");
  trainStarted = false;
  pages.forEach(p => p.style.display = "");
  showPage(0);
};

addEventListener("pointerdown", e => {
  const h = document.createElement("span");
  h.textContent = ["💗","✨","💖"][Math.floor(Math.random()*3)];
  h.style.cssText = `position:fixed;left:${e.clientX-8}px;top:${e.clientY-8}px;z-index:99999;pointer-events:none;font-size:1rem`;
  document.body.appendChild(h);
  h.animate([{ transform:"translateY(0) scale(.6)", opacity:1 }, { transform:"translateY(-46px) scale(1.4)", opacity:0 }], { duration:800, easing:"ease-out" }).onfinish = () => h.remove();
});

const onResize = () => { if(trainScene.classList.contains("show")) playTrain(true); };
addEventListener("resize", onResize);
if(window.visualViewport) visualViewport.addEventListener("resize", onResize);
/* ---------- sparkle trail + tap hearts (canvas) ---------- */
const fx = $("fx"), fxc = fx.getContext("2d"), parts = [];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
function fitFx(){ const d = devicePixelRatio || 1; fx.width = innerWidth*d; fx.height = innerHeight*d; fxc.setTransform(d,0,0,d,0,0); }
fitFx(); addEventListener("resize", fitFx);
function spark(x, y, n, big){
  for(let i = 0; i < n && parts.length < 320; i++){
    const a = Math.random()*6.283, sp = big ? 1.5 + Math.random()*3.5 : .3 + Math.random();
    parts.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp - (big ? 1.5 : .5), l:1, r:big ? 4 + Math.random()*5 : 2 + Math.random()*3, c:["#ff7697","#ffb2c5","#ffd4df","#fff","#ffe3a3"][i%5], h:Math.random() < .5 });
  }
}
addEventListener("pointermove", e => {
  if(!calm) spark(e.clientX, e.clientY, 1, false);
  const g = document.querySelector(".exp-glow");
  g.style.translate = ((e.clientX/innerWidth - .5)*40) + "px " + ((e.clientY/innerHeight - .5)*40) + "px";
});
addEventListener("pointerdown", e => { if(!calm) spark(e.clientX, e.clientY, 12, true); });
(function loop(){
  fxc.clearRect(0, 0, innerWidth, innerHeight);
  for(let i = parts.length-1; i >= 0; i--){
    const p = parts[i];
    p.x += p.vx; p.y += p.vy; p.vy += .04; p.l -= .022;
    if(p.l <= 0){ parts.splice(i,1); continue; }
    const r = p.r*p.l;
    fxc.globalAlpha = p.l; fxc.fillStyle = p.c; fxc.beginPath();
    if(p.h){ fxc.moveTo(p.x, p.y+r*.9); fxc.bezierCurveTo(p.x-r*2, p.y-r*.2, p.x-r, p.y-r*1.6, p.x, p.y-r*.6); fxc.bezierCurveTo(p.x+r, p.y-r*1.6, p.x+r*2, p.y-r*.2, p.x, p.y+r*.9); }
    else fxc.arc(p.x, p.y, r, 0, 6.283);
    fxc.fill();
  }
  requestAnimationFrame(loop);
})();

/* =====================================================================
   BLOSSOM BACKGROUND — flowers bloom one by one behind the gift / music
   pages and stay there until the train scene takes over.
===================================================================== */
const BLOSSOM_SRC = "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n  <title>Blossom<\/title>\n\n  <!-- Google Fonts -->\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link\n    href=\"https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap\"\n    rel=\"stylesheet\"\n  >\n\n  <style>* {\n    box-sizing: border-box;\n}\n\n:root {\n    --glow-red: rgba(255, 12, 70, 0.85);\n}\n\nbody {\n    background: radial-gradient(circle at 50% 40%, #2b000d 0%, #140006 50%, #050002 100%);\n    margin: 0;\n    padding: 0;\n    height: 100vh;\n    width: 100vw;\n    overflow: hidden;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n/* Background Canvas */\n#hearts-canvas {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    z-index: 0;\n}\n\n/* Ambient Radial Glow */\n.romantic-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: radial-gradient(circle at 50% 50%, rgba(255, 12, 70, 0.14) 0%, transparent 70%);\n    pointer-events: none;\n    z-index: 1;\n    animation: ambient-pulse 6s ease-in-out infinite alternate;\n}\n\n@keyframes ambient-pulse {\n    0% { opacity: 0.5; transform: scale(1); }\n    100% { opacity: 1; transform: scale(1.08); }\n}\n\n/* Ground & Flower Layout */\n.ground {\n    width: 100vmin;\n    aspect-ratio: 1.5;\n    overflow: visible;\n    position: relative;\n    transform-origin: center center;\n    transform: scale(2);\n    animation: shrink 1.5s ease-in forwards 4s;\n    z-index: 2;\n}\n\n.flower-container {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 10%;\n    aspect-ratio: 16;\n    container-type: inline-size;\n    filter: drop-shadow(0 0 25cqi var(--glow-red));\n    justify-items: center;\n    align-content: center;\n    transform-origin: bottom center;\n    cursor: pointer;\n    transition: filter 0.3s ease;\n}\n\n.flower-container:hover {\n    filter: drop-shadow(0 0 38cqi rgba(255, 77, 121, 1));\n}\n\n.flower-container:first-child {\n    top: 50%;\n    left: 50%;\n}\n.flower-container:nth-child(2) {\n    top: 45%;\n    left: 30%;\n    width: 8%;\n}\n.flower-container:nth-child(3) {\n    top: 45%;\n    left: 70%;\n    width: 8%;\n}\n.flower-container:nth-child(4) {\n    top: 85%;\n    left: 95%;\n    width: 20%;\n}\n.flower-container:nth-child(5) {\n    top: 130%;\n    left: 30%;\n    width: 30%;\n}\n.flower-container:nth-child(6) {\n    top: 60%;\n    left: 10%;\n    width: 12%;\n}\n.flower-container:nth-child(7) {\n    top: 20%;\n    left: 15%;\n    width: 6%;\n}\n.flower-container:nth-child(8) {\n    top: 15%;\n    left: 35%;\n    width: 5%;\n}\n.flower-container:nth-child(9) {\n    top: 26%;\n    left: 85%;\n    width: 7%;\n}\n.flower-container:nth-child(10) {\n    top: 22%;\n    left: 60%;\n    width: 6.5%;\n}\n.flower-container:nth-child(11) {\n    top: 35%;\n    left: 20%;\n    width: 7.5%;\n}\n.flower-container:nth-child(12) {\n    top: 38%;\n    left: 80%;\n    width: 7.5%;\n}\n\n/* Flower Top & Petals */\n.flower-top {\n    width: 50cqi;\n    aspect-ratio: 1.5;\n    position: absolute;\n    bottom: 100%;\n    left: 50%;\n    transform: translate(-50%, 50%);\n    z-index: 1;\n}\n\n.flower-circle {\n    width: 30cqi;\n    aspect-ratio: 1.5;\n    border-radius: 50%;\n    background: radial-gradient(circle, #ffccd5 0%, #ff0c46 60%, #80001a 100%);\n    box-shadow: inset 0px -3cqi 5cqi rgba(128, 0, 26, 0.8), 0 0 20cqi #ff0c46;\n    position: absolute;\n    scale: 0;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    border-radius: 100% 100% 100% 100%/90% 90% 90% 90%;\n    filter: drop-shadow(0 0 15cqi #ff0c46);\n    transform-origin: top left;\n}\n\n.flower-petal {\n    width: 80%;\n    aspect-ratio: 1;\n    background-color: #ff0c46;\n    background-image: linear-gradient(135deg, #ff0040 0%, #ff4d6d 45%, #b3002d 100%);\n    box-shadow: inset 0 0 10cqi rgba(255, 204, 213, 0.4), 0 0 15cqi rgba(255, 12, 70, 0.6);\n    position: absolute;\n    opacity: 0;\n}\n\n.flower-petal__1 {\n    bottom: 42%;\n    right: 65%;\n    border-radius: 0px 100% 5% 100%/0px 100% 5% 100%;\n    transform: rotate(-10deg) scale(0.82);\n}\n\n.flower-petal__2 {\n    bottom: 42%;\n    left: 65%;\n    border-radius: 0px 100% 5% 100%/0px 100% 5% 100%;\n    transform: rotate(100deg) scale(0.82);\n}\n\n.flower-petal__3 {\n    bottom: 40%;\n    left: 10%;\n    border-radius: 0px 100% 50% 100%/0px 100% 50% 100%;\n    transform: rotate(45deg) scale(0.8);\n}\n\n.flower-petal__4 {\n    top: -10%;\n    left: 80%;\n    border-radius: 0px 100% 0% 100%/0px 100% 0% 100%;\n    transform: rotate(135deg) scale(0.9);\n}\n\n.flower-petal__5 {\n    top: -10%;\n    right: 70%;\n    border-radius: 0px 100% 0% 100%/0px 100% 0% 100%;\n    transform: rotate(315deg) scale(0.9);\n}\n\n.flower-petal__6 {\n    top: 50%;\n    right: 65%;\n    border-radius: 0px 100% 10% 100%/0px 100% 5% 100%;\n    transform: rotate(270deg) scale(1.1);\n}\n\n.flower-petal__7 {\n    top: 50%;\n    left: 65%;\n    border-radius: 0px 100% 10% 100%/0px 100% 5% 100%;\n    transform: rotate(180deg) scale(1.1);\n}\n\n.flower-petal__8 {\n    top: 50%;\n    left: 10%;\n    border-radius: 0px 100% 50% 100%/0px 100% 30% 100%;\n    transform: rotate(225deg) scale(1);\n}\n\n/* Red Glowing Light Particles */\n.flower-light {\n    width: 3.5cqi;\n    aspect-ratio: 1;\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n\n    &:nth-child(odd) {\n        background-color: #ffccd5;\n        filter: blur(1.5cqi) drop-shadow(0 0 8cqi #ff0c46);\n    }\n\n    &:nth-child(even) {\n        background-color: #ff0c46;\n        filter: blur(1.5cqi) drop-shadow(0 0 8cqi #ff4d6d);\n    }\n}\n\n.flower-light__1 { top: 10%; left: 20%; scale: 0.8; }\n.flower-light__2 { top: 20%; left: 80%; scale: 1.2; }\n.flower-light__3 { top: 30%; left: 50%; scale: 1.5; }\n.flower-light__4 { top: 40%; left: 10%; }\n.flower-light__5 { top: 50%; left: 90%; scale: 2; }\n.flower-light__6 { top: 60%; left: 30%; }\n.flower-light__7 { top: 70%; left: 40%; scale: 0.5; }\n.flower-light__8 { top: 60%; left: 60%; }\n\n/* Stems, Leaves & Grass */\n.flower-bottom {\n    width: 6%;\n    aspect-ratio: 0.02;\n    left: 47%;\n    top: 50%;\n}\n\n.flower-grass__3 {\n    left: 70% !important;\n    width: 75cqi;\n    height: 100cqi;\n}\n\n.flower-grass__4 {\n    right: 70% !important;\n    width: 75cqi;\n    height: 90cqi;\n}\n\n.flower-stem {\n    width: 100%;\n    height: 100%;\n    transform: scaleY(0);\n    background-image: linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent, rgba(128, 0, 32, 0.4)),\n                      linear-gradient(to top, transparent 10%, #7a0c2e, #b3002d);\n    border-radius: 50px 50px 0 0;\n    transform-origin: bottom center;\n    box-shadow: 0 0 10px rgba(255, 12, 70, 0.3);\n}\n\n.flower-leaf {\n    width: 40%;\n    aspect-ratio: 2.5;\n    position: absolute;\n    scale: 0;\n    opacity: 0;\n\n    &:nth-child(even) {\n        right: 55%;\n        background-image: linear-gradient(120deg, #990026cc 0%, #4a001300 90%);\n        border-radius: 0% 100% 0% 100%/0% 100% 0% 100%;\n        transform-origin: bottom right;\n    }\n\n    &:nth-child(odd) {\n        left: 55%;\n        background-image: linear-gradient(300deg, #990026cc 0%, #4a001300 90%);\n        border-radius: 100% 0% 100% 0%/100% 0% 100% 0%;\n        transform-origin: bottom left;\n    }\n}\n\n.flower-leaf__2 { top: 25%; transform: rotate(-15deg) scale(1); }\n.flower-leaf__1 { top: 31%; transform: rotate(15deg) scale(1); }\n.flower-leaf__4 { top: 37%; transform: rotate(-15deg) scale(1.2); }\n.flower-leaf__3 { top: 43%; transform: rotate(15deg) scale(1.2); }\n.flower-leaf__6 { top: 50%; transform: rotate(-15deg) scale(1.5); }\n.flower-leaf__5 { top: 56%; transform: rotate(15deg) scale(1.5); }\n\n.flower-grass {\n    position: absolute;\n    bottom: -20cqi;\n    width: 80cqi;\n    height: 120cqi;\n    opacity: 0;\n    scale: 0;\n    mask-image: linear-gradient(to top, transparent 15%, #fff 50%);\n\n    &:nth-child(odd) {\n        right: 55%;\n        border-top-right-radius: 100%;\n        border-right: 5cqi solid #b3002daa;\n        transform-origin: bottom right;\n    }\n\n    &:nth-child(even) {\n        left: 55%;\n        border-top-left-radius: 100%;\n        border-left: 5cqi solid #b3002daa;\n        transform-origin: bottom left;\n    }\n}\n\n\n\n/* Animations */\n.animate {\n    &.flower-container {\n        animation: flower-rotate 12s linear infinite;\n    }\n\n    .flower-circle {\n        animation: grass-grow 0.25s ease-in forwards 3s;\n    }\n\n    .flower-petal {\n        animation: petal-grow 0.5s ease-in forwards,\n                    flower-rotate 3s linear infinite;\n    }\n\n    .flower-petal__3 { animation-delay: 3.2s; }\n    .flower-petal__2 { animation-delay: 3.3s; }\n    .flower-petal__4 { animation-delay: 3.4s; }\n    .flower-petal__7 { animation-delay: 3.5s; }\n    .flower-petal__8 { animation-delay: 3.6s; }\n    .flower-petal__6 { animation-delay: 3.7s; }\n    .flower-petal__5 { animation-delay: 3.8s; }\n    .flower-petal__1 { animation-delay: 3.9s; }\n\n    .flower-stem {\n        animation: stem-grow 3s ease-in forwards;\n    }\n\n    .flower-grass {\n        animation: grass-grow 1s ease-in forwards 1.5s,\n                   flower-rotate 6s linear infinite;\n    }\n\n    .flower-leaf {\n        animation: grass-grow 0.75s ease-in forwards, \n                   flower-rotate 6s linear infinite;\n    }\n\n    .flower-leaf__2 { animation-delay: 2s; }\n    .flower-leaf__1 { animation-delay: 1.9s; }\n    .flower-leaf__4 { animation-delay: 1.8s; }\n    .flower-leaf__3 { animation-delay: 1.65s; }\n    .flower-leaf__6 { animation-delay: 1.5s; }\n    .flower-leaf__5 { animation-delay: 1.25s; }\n\n    .flower-light {\n        animation: light-float 5s ease-in-out infinite;\n    }\n\n    .flower-light__1 { animation-delay: 4.7s; }\n    .flower-light__2 { animation-delay: 5.2s; }\n    .flower-light__3 { animation-delay: 5.7s; }\n    .flower-light__4 { animation-delay: 6.2s; }\n    .flower-light__5 { animation-delay: 6.7s; }\n    .flower-light__6 { animation-delay: 7.2s; }\n    .flower-light__7 { animation-delay: 7.7s; }\n    .flower-light__8 { animation-delay: 8.2s; }\n}\n\n@keyframes petal-grow {\n    0% { scale: 0; opacity: 0.9; }\n    50% { scale: 1; opacity: 0.9; }\n    75% { scale: 1.1; opacity: 0.95; }\n    90% { scale: 0.95; opacity: 0.95; }\n    100% { scale: 1; opacity: 1; }\n}\n\n@keyframes grass-grow {\n    100% { opacity: 1; scale: 1; }\n}\n\n@keyframes stem-grow {\n    0% { border-radius: 10%; }\n    100% { transform: scaleY(1); }\n}\n\n@keyframes flower-rotate {\n    0%, 100% { rotate: 0deg; }\n    25% { rotate: 5deg; }\n    75% { rotate: -5deg; }\n}\n\n@keyframes shrink {\n    100% { transform: scale(1); }\n}\n\n@keyframes light-float {\n    0% { opacity: 0; transform: translate(0, 0); }\n    25% { opacity: 1; transform: translate(20cqi, -25cqi); }\n    50% { opacity: 1; transform: translate(0, -50cqi); }\n    75% { opacity: 1; transform: translate(-20cqi, -75cqi); }\n    100% { opacity: 0; transform: translate(0, -100cqi); }\n}\n\n@keyframes fadeInDown {\n    from { opacity: 0; transform: translate(-50%, -30px); }\n    to { opacity: 1; transform: translate(-50%, 0); }\n}\n<\/style>\n<\/head>\n\n<body>\n\n  <!-- Floating Hearts & Sparkles Background Canvas -->\n  <canvas id=\"hearts-canvas\"><\/canvas>\n\n  <!-- Ambient Glow Overlay -->\n  <div class=\"romantic-overlay\"><\/div>\n\n  <!-- Ground & Flowers Container -->\n  <div class=\"ground\">\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n    <div class=\"flower-container\"><\/div>\n  <\/div>\n\n  <script>document.querySelectorAll('.flower-container').forEach((el) => {\n  el.innerHTML = `<div class=\"flower-top\">\n                  <div class=\"flower-petal flower-petal__1\"><\/div>\n                  <div class=\"flower-petal flower-petal__2\"><\/div>\n                  <div class=\"flower-petal flower-petal__3\"><\/div>\n                  <div class=\"flower-petal flower-petal__4\"><\/div>\n                  <div class=\"flower-petal flower-petal__5\"><\/div>\n                  <div class=\"flower-petal flower-petal__6\"><\/div>\n                  <div class=\"flower-petal flower-petal__7\"><\/div>\n                  <div class=\"flower-petal flower-petal__8\"><\/div>\n                  <div class=\"flower-circle\"><\/div>\n                  <div class=\"flower-light flower-light__1\"><\/div>\n                  <div class=\"flower-light flower-light__2\"><\/div>\n                  <div class=\"flower-light flower-light__3\"><\/div>\n                  <div class=\"flower-light flower-light__4\"><\/div>\n                  <div class=\"flower-light flower-light__5\"><\/div>\n                  <div class=\"flower-light flower-light__6\"><\/div>\n                  <div class=\"flower-light flower-light__7\"><\/div>\n                  <div class=\"flower-light flower-light__8\"><\/div>\n                  <\/div>\n\n                  <div class=\"flower-bottom\">\n                  <div class=\"flower-stem\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__1\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__2\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__3\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__4\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__5\"><\/div>\n                  <div class=\"flower-leaf flower-leaf__6\"><\/div>\n\n                  <div class=\"flower-grass flower-grass__1\"><\/div>\n                  <div class=\"flower-grass flower-grass__2\"><\/div>\n                  <div class=\"flower-grass flower-grass__3\"><\/div>\n                  <div class=\"flower-grass flower-grass__4\"><\/div>\n                  <\/div>`;\n});\n\n// Staggered Flower Blooming\nconst flowers = Array.from(document.querySelectorAll('.flower-container'));\nconst animatedClass = 'animate';\n\nflowers[0].classList.add(animatedClass);\n\nsetTimeout(() => {\n  for (let i = 1; i <= 2 && i < flowers.length; i++) {\n    flowers[i].classList.add(animatedClass);\n  }\n\n  let remaining = flowers.slice(3);\n  const interval = setInterval(() => {\n    if (remaining.length === 0) {\n      clearInterval(interval);\n      return;\n    }\n\n    const randomIndex = Math.floor(Math.random() * remaining.length);\n    const el = remaining.splice(randomIndex, 1)[0];\n    el.classList.add(animatedClass);\n  }, 400);\n}, 2500);\n\n/* ========================================================\n   Floating Hearts & Sparkles Canvas Animation\n   ======================================================== */\nconst canvas = document.getElementById('hearts-canvas');\nconst ctx = canvas.getContext('2d');\n\nlet width = (canvas.width = window.innerWidth);\nlet height = (canvas.height = window.innerHeight);\n\nwindow.addEventListener('resize', () => {\n  width = canvas.width = window.innerWidth;\n  height = canvas.height = window.innerHeight;\n});\n\nconst particles = [];\nconst heartColors = ['#ff0c46', '#ff4d79', '#ff80bf', '#ff0033', '#e60039'];\n\nclass HeartParticle {\n  constructor(x, y, isBurst = false) {\n    this.x = x !== undefined ? x : Math.random() * width;\n    this.y = y !== undefined ? y : height + Math.random() * 20;\n    this.size = Math.random() * 14 + 6;\n    this.color = heartColors[Math.floor(Math.random() * heartColors.length)];\n    this.alpha = isBurst ? 1 : Math.random() * 0.7 + 0.3;\n    this.speedY = isBurst ? (Math.random() - 0.7) * 4 : Math.random() * 1.5 + 0.8;\n    this.speedX = isBurst ? (Math.random() - 0.5) * 4 : Math.sin(Math.random() * Math.PI) * 0.8;\n    this.wobble = Math.random() * Math.PI * 2;\n    this.wobbleSpeed = Math.random() * 0.05 + 0.02;\n    this.isBurst = isBurst;\n  }\n\n  update() {\n    this.y -= this.speedY;\n    this.wobble += this.wobbleSpeed;\n    this.x += this.speedX + Math.sin(this.wobble) * 0.5;\n\n    if (this.isBurst) {\n      this.alpha -= 0.015;\n    } else if (this.y < -30) {\n      this.y = height + 20;\n      this.x = Math.random() * width;\n      this.alpha = Math.random() * 0.7 + 0.3;\n    }\n  }\n\n  draw() {\n    if (this.alpha <= 0) return;\n    ctx.save();\n    ctx.globalAlpha = this.alpha;\n    ctx.fillStyle = this.color;\n    ctx.shadowColor = this.color;\n    ctx.shadowBlur = 12;\n\n    const s = this.size;\n    ctx.beginPath();\n    ctx.moveTo(this.x, this.y + s * 0.3);\n    ctx.bezierCurveTo(this.x, this.y, this.x - s / 2, this.y, this.x - s / 2, this.y + s * 0.3);\n    ctx.bezierCurveTo(this.x - s / 2, this.y + (s + s * 0.3) / 2, this.x, this.y + s, this.x, this.y + s);\n    ctx.bezierCurveTo(this.x, this.y + s, this.x + s / 2, this.y + (s + s * 0.3) / 2, this.x + s / 2, this.y + s * 0.3);\n    ctx.bezierCurveTo(this.x + s / 2, this.y, this.x, this.y, this.x, this.y + s * 0.3);\n    ctx.closePath();\n    ctx.fill();\n    ctx.restore();\n  }\n}\n\n// Initial Ambient Floating Hearts\nfor (let i = 0; i < 35; i++) {\n  particles.push(new HeartParticle(Math.random() * width, Math.random() * height));\n}\n\nfunction spawnBurst(x, y, count = 20) {\n  for (let i = 0; i < count; i++) {\n    particles.push(new HeartParticle(x, y, true));\n  }\n}\n\nfunction animateCanvas() {\n  ctx.clearRect(0, 0, width, height);\n\n  for (let i = particles.length - 1; i >= 0; i--) {\n    const p = particles[i];\n    p.update();\n    p.draw();\n\n    if (p.isBurst && p.alpha <= 0) {\n      particles.splice(i, 1);\n    }\n  }\n\n  requestAnimationFrame(animateCanvas);\n}\n\nanimateCanvas();\n\n// Click Burst Interactions\nwindow.addEventListener('click', (e) => {\n  // Avoid bursting if clicking buttons or modal\n  if (e.target.closest('.glass-btn') || e.target.closest('.glass-modal')) return;\n  spawnBurst(e.clientX, e.clientY, 18);\n});\n\n<\/script>\n\n<\/body>\n\n<\/html>";
const BLOOM_MS = 11500; /* time for all 12 flowers to finish opening */
function startBlossom(done){
  const f = $("blossom-bg");
  f.classList.remove("on");
  let started = false;
  const go = () => { if(started) return; started = true; f.classList.add("on"); setTimeout(done, BLOOM_MS); };
  f.onload = go;
  setTimeout(go, 5000);
  f.srcdoc = BLOSSOM_SRC;
}

/* =====================================================================
   ENDING:  train -> 🏹 Continue -> bow & arrow film -> "I'm Truly Sorry"
   -> blossom tree -> apology written sentence by sentence
===================================================================== */
(() => {
const E = $("ending");
const FILM_SRC = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, viewport-fit=cover\" />\n  <title>I'm Truly Sorry ♥<\/title>\n  <meta name=\"description\" content=\"A cinematic birthday film in four acts: a beating heart you open with a tap, a rush of colour, a kinetic wish, and a tree that blooms into a heart of petals.\" />\n  <meta name=\"theme-color\" content=\"#f7e7dc\" />\n  \n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&display=swap\" rel=\"stylesheet\" />\n\n  <script>document.documentElement.classList.add('js')<\/script>\n  <style>/* ============================================================\n   HAPPY BIRTHDAY — a birthday film in four acts\n   Vanilla + GSAP. One page, one continuous piece:\n     1. a beating heart you open with a tap\n     2. it falls, and bursts into a flood of rose\n     3. a kinetic wish hinges up out of that colour\n     4. a gold light blooms, and a tree grows into a heart\n   One grain + vignette lens sits over all of it.\n   ============================================================ */\n\n:root{\n  /* --- warm paper (Act 1 + the tree's dawn) --- */\n  --paper-0:  #fff6ee;\n  --paper-1:  #f9e2d2;\n  --paper-2:  #f2c9b8;\n\n  /* --- rose flood (Acts 2–3) --- */\n  --rose-deep: #a80f43;\n  --rose:      #d4235c;\n  --rose-lift: #ff5f86;\n  --wine:      #6e0a31;\n\n  /* --- accents / ink --- */\n  --gold-1:    #ffcf6a;\n  --gold-2:    #e8a23d;\n  --ink:       #7a4a55;   /* dusty rose ink        */\n  --ink-soft:  #a9808a;   /* muted eyebrow / sub   */\n  --cream:     #fff3ea;\n\n  --ease-out:  cubic-bezier(.2,.7,.2,1);\n}\n\n*{ box-sizing:border-box; margin:0; padding:0; }\nhtml, body{ height:100%; }\n\nbody{\n  background:#12060c;                 /* seam colour under everything */\n  overflow:hidden;\n  -webkit-font-smoothing:antialiased;\n  text-rendering:optimizeLegibility;\n  cursor:auto;\n}\n\n.scene{ position:fixed; inset:0; overflow:hidden; }\n\n.sr-only{\n  position:absolute; width:1px; height:1px; padding:0; margin:-1px;\n  overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;\n}\n\n/* ============================================================\n   THE TREE CANVAS (Act 4) — z0, transparent until it plays\n   ============================================================ */\n.tree{\n  position:absolute; inset:0;\n  width:100%; height:100%;\n  display:block;\n  z-index:1;\n}\n\n/* ============================================================\n   ACT 1 — THE INVITATION\n   ============================================================ */\n.hero{\n  position:absolute; inset:0;\n  z-index:3;\n  overflow:hidden;\n}\n/* the warm field the heart sits on */\n.hero__bg{\n  position:absolute; inset:0;\n  background:\n    radial-gradient(120% 88% at 50% 24%, #fff8f1 0%, var(--paper-0) 38%, var(--paper-1) 74%, var(--paper-2) 100%);\n}\n.hero__bg::after{               /* a soft warm pool of light behind the heart */\n  content:\"\"; position:absolute; left:50%; top:44%;\n  width:min(78vw,720px); aspect-ratio:1; transform:translate(-50%,-50%);\n  background:radial-gradient(circle, rgba(255,190,150,.55), rgba(255,150,170,.16) 46%, transparent 70%);\n  filter:blur(6px);\n}\n\n/* drifting light motes (JS fills this with a few spans) */\n.hero__motes{ position:absolute; inset:0; pointer-events:none; }\n.mote{\n  position:absolute; border-radius:50%;\n  background:radial-gradient(circle, rgba(255,236,214,.9), rgba(255,206,180,.15) 55%, transparent 72%);\n  will-change:transform, opacity;\n}\n\n.hero__eyebrow{\n  position:absolute; top:13%; left:0; right:0;\n  text-align:center;\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-style:italic; font-weight:600;\n  font-size:clamp(15px, 3.6vw, 26px);\n  letter-spacing:.06em;\n  color:#a85069;\n  text-shadow:0 1px 10px rgba(255,248,241,.9);\n  opacity:0;                          /* GSAP reveals */\n}\n\n/* ---- the target heart (GSAP animates .target on the hit → fall → burst) ---- */\n.targetWrap{\n  position:absolute; top:33%; left:0; right:0;\n  display:flex; justify-content:center;\n  transform:translateY(-50%);         /* centre at 33% — wrap is NOT animated */\n  pointer-events:none;\n}\n.target{\n  position:relative;\n  width:clamp(120px, 27vw, 208px);\n  aspect-ratio:100/92;\n  will-change:transform;\n  transform-origin:50% 60%;\n}\n.target__heart{ position:absolute; inset:0; display:block; }\n\n/* radial bloom behind the heart — swells on the beat */\n.heart__glow{\n  position:absolute; left:50%; top:52%;\n  width:230%; aspect-ratio:1; transform:translate(-50%,-50%) scale(1);\n  border-radius:50%;\n  background:radial-gradient(circle, rgba(255,120,150,.55), rgba(255,90,130,.18) 42%, transparent 68%);\n  filter:blur(4px);\n  pointer-events:none;\n  will-change:transform, opacity;\n}\n.heart__svg{\n  width:100%; height:100%; display:block;\n  transform-origin:50% 60%;           /* the beat scales THIS, not the wrapper */\n  filter:\n    drop-shadow(0 10px 22px rgba(168,15,64,.34))\n    drop-shadow(0 3px 6px rgba(120,10,48,.30));\n  will-change:transform;\n}\n\n/* ---- the bow + arrow rig ----\n   Placed lower-left and rotated by JS to aim at the heart, so the shot travels\n   on a DIAGONAL. The whole rig (left/top + rotation around the grip) is set in\n   JS from measured geometry; everything below is in the rig's own space. */\n.archery{\n  position:absolute; top:0; left:0;    /* JS sets left/top so the grip anchors */\n  width:clamp(100px, 18vw, 168px);     /* smaller, daintier bow — delicate against the heart */\n  cursor:grab;\n  -webkit-tap-highlight-color:transparent;\n  touch-action:none;                   /* we own the drag gesture */\n  will-change:transform;\n}\n.archery:active{ cursor:grabbing; }\n.archery:focus-visible{ outline:none; }\n.archery:focus-visible .bow{ filter:drop-shadow(0 0 0 3px rgba(255,255,255,.85)) drop-shadow(0 10px 18px rgba(120,50,20,.4)); }\n.bow{\n  display:block; width:100%; height:auto;\n  filter:drop-shadow(0 12px 18px rgba(90,40,15,.3));\n  overflow:visible;\n}\n\n/* the aim line rides inside the rig, so it points straight at the heart */\n.aim{\n  position:absolute; left:50%; bottom:32%;\n  width:2px; height:190%; margin-left:-1px;\n  transform-origin:bottom center;\n  background:linear-gradient(0deg, rgba(255,214,150,.6) 0%, rgba(255,150,170,.22) 52%, transparent 78%);\n  opacity:0; pointer-events:none;\n}\n\n/* the arrow overlaps the bow at the nock and flies to the heart */\n.arrow{\n  position:absolute; left:0; right:0; margin-inline:auto;\n  bottom:36%;                          /* JS re-anchors the tail to the nock */\n  width:17.5%; height:auto;\n  overflow:visible;\n  will-change:transform;\n  filter:drop-shadow(0 5px 7px rgba(90,40,15,.36));\n}\n.arrow__wings{ transform-box:fill-box; transform-origin:50% 90%; }\n.arrow__wings .wingL,\n.arrow__wings .wingR{ transform-box:fill-box; }\n.wingL{ transform-origin:88% 60%; animation:flapL 2.6s ease-in-out infinite; }\n.wingR{ transform-origin:12% 60%; animation:flapR 2.6s ease-in-out infinite; }\n@keyframes flapL{ 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(-11deg); } }\n@keyframes flapR{ 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(11deg); } }\n\n/* ---- the draw / release hint ---- */\n.hero__hint{\n  position:absolute; bottom:8.5%; left:0; right:0;\n  text-align:center;\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-weight:600; font-style:italic;\n  font-size:clamp(13px, 3.1vw, 19px);\n  letter-spacing:.16em; text-transform:uppercase;\n  color:#b06a7c;\n  opacity:0;                          /* GSAP reveals */\n}\n.hero__ring{ display:none; }\n\n/* ============================================================\n   ACT 2 — THE FLOOD (the burst circle)\n   ============================================================ */\n.flood{\n  position:absolute; left:50%; top:50%;\n  width:140px; height:140px; margin:-70px 0 0 -70px;\n  border-radius:50%;\n  background:radial-gradient(circle at 40% 34%, var(--rose-lift), var(--rose) 46%, var(--rose-deep) 100%);\n  z-index:5;\n  opacity:0; transform:scale(.001);\n  will-change:transform, opacity;\n  pointer-events:none;\n}\n\n/* ============================================================\n   ACT 3 — THE WISH FIELD (rose world + kinetic type)\n   ============================================================ */\n.field{\n  position:absolute; inset:0;\n  z-index:4;                          /* below the flood; revealed once it covers */\n  opacity:0;\n  /* purely decorative — must never intercept the tap on the heart beneath it.\n     An opacity:0 element is still hit-testable, so without this the invisible\n     field (z4, above the hero z3) swallows every Act-1 tap. */\n  pointer-events:none;\n  overflow:hidden;\n  background:\n    radial-gradient(120% 100% at 50% 8%, #d5265f 0%, var(--rose) 42%, var(--rose-deep) 78%, var(--wine) 100%);\n  color:#fff;\n}\n.blob{\n  position:absolute; border-radius:50%;\n  filter:blur(46px); opacity:0;\n  mix-blend-mode:screen;\n  will-change:transform, opacity;\n}\n.blob--1{ width:58vmax; height:58vmax; left:-18vmax; top:-16vmax;\n  background:radial-gradient(circle, rgba(255,130,160,.9), transparent 62%); }\n.blob--2{ width:46vmax; height:46vmax; right:-14vmax; top:22vmax;\n  background:radial-gradient(circle, rgba(255,90,120,.75), transparent 64%); }\n.blob--3{ width:52vmax; height:52vmax; left:24vmax; bottom:-22vmax;\n  background:radial-gradient(circle, rgba(180,20,70,.8), transparent 66%); }\n\n/* faint grid — a hair of parallax gives the flood depth, not flatness */\n.fgrid{\n  position:absolute; inset:-6%;\n  background-image:\n    linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);\n  background-size:clamp(38px,7vw,74px) clamp(38px,7vw,74px);\n  will-change:transform;\n}\n.fvignette{\n  position:absolute; inset:0;\n  background:radial-gradient(128% 96% at 50% 44%, transparent 50%, rgba(70,6,28,.5) 100%);\n}\n\n/* the camera — everything on the flood rides a slow continuous push */\n.camera{\n  position:absolute; inset:0;\n  display:flex; flex-direction:column; justify-content:center; align-items:center;\n  gap:clamp(4px,1.2vh,12px);\n  padding:0 6vw; text-align:center;\n  will-change:transform;\n}\n.kEyebrow{\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-style:italic; font-weight:500;\n  font-size:clamp(15px, 3.6vw, 27px);\n  letter-spacing:.08em;\n  color:#ffd7c8;\n  opacity:0; transform:translateY(10px);\n  margin-bottom:clamp(2px,1vh,10px);\n}\n\n.headline{ font-family:\"Fraunces\", Georgia, serif; line-height:.92; }\n.hl__line{ display:block; }\n/* the mask each headline word hinges out of. Padded to clear ascenders +\n   descenders so glyphs never peek past the clip edge when parked. */\n.mask{\n  display:inline-block; overflow:hidden;\n  padding:.14em .06em;\n  margin:-.14em -.06em;\n}\n.hl__word{\n  display:inline-block;\n  font-weight:900;\n  font-size:clamp(52px, 15vw, 168px);\n  letter-spacing:-.02em;\n  color:#fff6f1;\n  text-shadow:0 6px 34px rgba(60,4,24,.34), 0 2px 3px rgba(90,8,36,.42);\n}\n/* each glyph hinges up on its own bottom edge, under its own perspective */\n.hl__ch{ display:inline-block; will-change:transform; }\n\n/* gold hand-drawn underline under the second word */\n.uline{\n  width:clamp(150px, 40vw, 380px); height:auto;\n  margin-top:clamp(4px,1.4vh,14px);\n  color:var(--gold-1);\n  filter:drop-shadow(0 2px 8px rgba(255,180,90,.5));\n}\n.kSub{\n  margin-top:clamp(12px,2.4vh,26px);\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-weight:500; font-style:italic;\n  font-size:clamp(14px, 3.4vw, 24px);\n  letter-spacing:.05em;\n  color:#ffdfd2;\n  opacity:0; transform:translateY(10px);\n}\n\n/* cinema bars — closed = black, they open as the wish lands */\n.bar{\n  position:absolute; left:0; right:0; height:16vh;\n  background:#12040b; z-index:3; will-change:transform; pointer-events:none;\n}\n.bar--top{ top:0; }\n.bar--bot{ bottom:0; }\n\n/* ============================================================\n   THE HANDOFF BLOOM (rose wish → dawn of the tree)\n   ============================================================ */\n.bloom{\n  position:absolute; left:50%; top:50%;\n  width:60px; height:60px; margin:-30px 0 0 -30px;\n  border-radius:50%;\n  background:radial-gradient(circle, #fff 0%, #fff2d6 30%, rgba(255,214,150,.85) 55%, rgba(255,190,150,0) 74%);\n  z-index:8; opacity:0; transform:scale(.001);\n  will-change:transform, opacity; pointer-events:none;\n}\n\n/* ============================================================\n   ACT 4 — THE HAND-LETTERED WISH (over the tree)\n   ============================================================ */\n.wish{\n  position:absolute;\n  left:5.5%; bottom:10%;\n  max-width:46%;\n  z-index:6;\n  pointer-events:none;\n  color:var(--ink);\n  /* hard gate: wish__hero keeps opacity:1 (its clip-path drives the write-on),\n     so without this its clipped sliver + drop-shadow would leak into Acts 1–3. */\n  visibility:hidden;\n}\n.wish.is-in{ visibility:visible; }\n.wish::before{\n  content:\"\"; position:absolute; inset:-18% -24% -24% -16%;\n  background:radial-gradient(84% 98% at 34% 52%, rgba(255,250,243,.94), rgba(255,250,243,.6) 48%, rgba(255,250,243,0) 80%);\n  z-index:-1; opacity:0; transition:opacity 1s ease;\n}\n.wish.is-in::before{ opacity:1; }\n.wish__eyebrow{\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-style:italic; font-weight:600;\n  font-size:clamp(13px, 3.2vw, 24px);\n  letter-spacing:.05em; color:#9c4f63;\n  text-shadow:0 1px 2px #fff8f1, 0 0 8px rgba(255,248,241,.95);\n}\n.wish__heroWrap{ position:relative; display:inline-block; }\n.wish__heroWrap::before{\n  content:\"\"; position:absolute; left:-12%; right:-12%; top:-26%; bottom:-22%;\n  background:radial-gradient(60% 70% at 46% 52%, rgba(255,214,168,.5), rgba(255,150,150,.2) 52%, transparent 74%);\n  filter:blur(14px); z-index:-1; opacity:0; pointer-events:none;\n}\n.wish__heroWrap::after{\n  content:\"\\2726\";\n  position:absolute; right:-1%; top:-14%;\n  font-size:clamp(15px, 3.6vw, 32px);\n  color:#ffe1a0; text-shadow:0 0 12px rgba(255,205,120,.95);\n  opacity:0; pointer-events:none;\n}\n.wish__hero{\n  font-family:\"Great Vibes\", cursive; font-weight:400;\n  font-size:clamp(40px, 9.6vw, 86px);\n  line-height:.98; margin:-.02em 0 .06em;\n  /* one consistent rose, top-lit — every letter reads the same (no per-glyph\n     colour shift, which is what made the old rose→gold version look messy).\n     Deep enough to hold up against the tree's bright bloom behind it. */\n  background:linear-gradient(180deg, #e85a83 0%, #c41f52 50%, #9c0f42 100%);\n  -webkit-background-clip:text; background-clip:text; color:transparent;\n  /* a crisp cream edge for legibility over the tree + one soft drop */\n  filter:\n    drop-shadow(0 1px 1px rgba(255,252,248,.98))\n    drop-shadow(0 2px 6px rgba(130,18,55,.45));\n  clip-path:inset(0 100% -28% -10%);\n  transform-origin:8% 60%;             /* breathe from the start of the line */\n}\n.wish__rule{\n  display:block; width:clamp(46px, 13vw, 110px); height:2px;\n  margin:.12em 0 .48em;\n  background:linear-gradient(90deg, var(--gold-2), rgba(232,162,61,0));\n  box-shadow:0 0 8px rgba(255,247,240,.9);\n  transform-origin:left center;\n}\n.wish__sub{\n  font-family:\"Cormorant Garamond\", Georgia, serif;\n  font-weight:600; font-size:clamp(12px, 2.9vw, 20px);\n  letter-spacing:.03em; color:#6e3f4a;\n  text-shadow:0 1px 2px #fff8f1, 0 0 8px rgba(255,248,241,.98);\n}\n.wish__eyebrow, .wish__rule, .wish__sub{\n  opacity:0; transform:translateY(12px); filter:blur(5px);\n  transition:opacity .8s ease, transform .9s var(--ease-out), filter .8s ease;\n}\n.wish__rule{ transform:translateY(12px) scaleX(.3); }\n.wish.is-in .wish__eyebrow,\n.wish.is-in .wish__sub{ opacity:1; transform:translateY(0); filter:blur(0); }\n.wish.is-in .wish__rule{ opacity:1; transform:translateY(0) scaleX(1); }\n.wish.is-in .wish__rule{ transition-delay:1.35s; }\n.wish.is-in .wish__sub{  transition-delay:1.55s; }\n.wish.is-in .wish__hero{\n  animation:write 1.2s cubic-bezier(.62,.04,.24,1) .35s forwards,\n            wishBreath 4s ease-in-out 1.9s infinite;\n}\n/* a gentle living breath — transform only, so it can never wash the fill out */\n@keyframes wishBreath{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.02); } }\n.wish.is-in .wish__heroWrap::before{ animation:hlin .8s ease .3s forwards, hlpulse 3.4s ease-in-out 1.7s infinite; }\n.wish.is-in .wish__heroWrap::after{ animation:twk 2.6s ease-in-out 1.6s infinite; }\n@keyframes write{ from{ clip-path:inset(0 100% -28% -10%); } to{ clip-path:inset(0 -10% -28% -10%); } }\n@keyframes sheen{ 0%,18%{ background-position:0% 50%; } 60%,100%{ background-position:100% 50%; } }\n@keyframes hlin{ from{ opacity:0; transform:scale(.86); } to{ opacity:.92; transform:scale(1); } }\n@keyframes hlpulse{ 0%,100%{ opacity:.72; } 50%{ opacity:1; } }\n@keyframes twk{ 0%,100%{ opacity:0; transform:scale(.5) rotate(-12deg); } 45%{ opacity:1; transform:scale(1.05) rotate(16deg); } }\n\n/* ============================================================\n   REPLAY\n   ============================================================ */\n.replay{\n  position:absolute; right:20px; bottom:18px; z-index:7;\n  display:inline-flex; align-items:center; gap:7px;\n  padding:9px 15px 9px 12px; border-radius:999px;\n  font:600 12.5px/1 \"Cormorant Garamond\", Georgia, serif; letter-spacing:.12em; text-transform:uppercase;\n  color:#8a4a5a; background:rgba(255,248,242,.72);\n  border:1px solid rgba(150,60,80,.18);\n  box-shadow:0 6px 20px -8px rgba(120,20,50,.4);\n  backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);\n  cursor:pointer; opacity:0; transform:translateY(8px);\n  transition:opacity .5s ease, transform .5s var(--ease-out), background .3s ease;\n}\n.replay.is-shown{ opacity:1; transform:translateY(0); }\n.replay:hover{ background:rgba(255,252,248,.92); }\n.replay svg{ opacity:.8; }\n\n/* ============================================================\n   THE LENS — grain + vignette over every act\n   ============================================================ */\n.grade{ position:absolute; inset:0; z-index:9; pointer-events:none; }\n.grade__vignette{\n  position:absolute; inset:0;\n  background:radial-gradient(125% 95% at 50% 42%, transparent 54%, rgba(60,18,30,.14) 84%, rgba(40,12,22,.3) 100%);\n  mix-blend-mode:multiply;\n}\n.grade__grain{\n  position:absolute; inset:0;\n  background:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><\/filter><rect width='100%' height='100%' filter='url(%23n)'/><\/svg>\") repeat;\n  background-size:300px; opacity:.05; mix-blend-mode:overlay;\n}\n\n/* ============================================================\n   REDUCED MOTION — skip the film, hand over the finished tree\n   ============================================================ */\n@media (prefers-reduced-motion: reduce){\n  .hero, .flood, .field, .bloom, .hero__ring{ display:none !important; }\n  .wish__eyebrow, .wish__rule, .wish__sub{ opacity:1; transform:none; filter:none; transition:none; }\n  .wish__hero{ clip-path:none; filter:drop-shadow(0 0 5px rgba(255,252,248,.98)) drop-shadow(0 2px 4px rgba(130,18,55,.5)) drop-shadow(0 4px 14px rgba(150,28,70,.32)); }\n  .wish.is-in .wish__hero{ animation:none; }\n  .wish.is-in .wish__heroWrap::before{ animation:none; opacity:.9; }\n  .wish.is-in .wish__heroWrap::after{ animation:none; opacity:0; }\n}\n\n.wish__hero{ white-space:nowrap; padding-right:.28em; }\n@media (max-aspect-ratio:1/1){ .wish{ max-width:90%; } }\n.wish{ transition:opacity .9s ease; }\n.wish.is-gone{ opacity:0; }\n.replay{ display:none !important; }\n.story{ position:absolute; left:50%; bottom:max(7%, 40px); z-index:8; width:min(90vw, 640px); transform:translateX(-50%);\n  padding:clamp(16px,4vw,26px) clamp(18px,5vw,34px); border-radius:22px; text-align:center;\n  background:rgba(255,248,242,.78); border:1px solid rgba(150,60,80,.16); box-shadow:0 14px 40px -16px rgba(120,20,50,.45);\n  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);\n  opacity:0; visibility:hidden; transition:opacity .9s ease, visibility .9s; }\n.story.is-in{ opacity:1; visibility:visible; }\n.story__say{ min-height:5.6em; display:grid; place-items:center; margin:0;\n  font:italic 600 clamp(17px, 4.4vw, 26px)/1.45 \"Cormorant Garamond\", Georgia, serif; color:#7a2c44; transition:opacity .55s ease; }\n.story__say.is-out{ opacity:0; }\n.story__cur{ display:inline-block; width:2px; height:1em; margin-left:3px; vertical-align:-.12em; background:#c41f52; animation:sCur .8s steps(1) infinite; }\n@keyframes sCur{ 50%{ opacity:0; } }\n.story__btn{ position:relative; z-index:2; margin-top:14px; border:0; padding:11px 22px; border-radius:999px; cursor:pointer;\n  font:600 15px/1 \"Cormorant Garamond\", Georgia, serif; letter-spacing:.06em; color:#fff;\n  background:linear-gradient(135deg,#e85a83,#c41f52); box-shadow:0 8px 20px -8px rgba(196,31,82,.7);\n  opacity:0; pointer-events:none; transition:opacity .8s ease; }\n.story__btn.is-in{ opacity:1; pointer-events:auto; }\n<\/style>\n<\/head>\n<body>\n  <main class=\"scene\">\n\n    <!-- The tree world (Act 4). One canvas; it stays transparent until the\n         intro hands off, then it draws its own warm sky + blossom tree. -->\n    <canvas id=\"tree\" class=\"tree\" aria-label=\"A blossom tree grows and blooms into a heart made of petals\" role=\"img\"><\/canvas>\n\n    <!-- ACT 1 — THE INVITATION ------------------------------------------------\n         A single beating heart on a warm field. It is the only thing the\n         visitor has to do: tap it. Real <button> so it is tappable + keyboard\n         focusable; everything decorative around it is aria-hidden. -->\n    <section class=\"hero\" id=\"hero\" aria-label=\"Draw the bow to open my apology\">\n      <div class=\"hero__bg\" aria-hidden=\"true\"><\/div>\n      <div class=\"hero__motes\" id=\"motes\" aria-hidden=\"true\"><\/div>\n\n      <p class=\"hero__eyebrow\" id=\"eyebrow\">a little apology, just for you<\/p>\n\n      <!-- THE TARGET — the heart the arrow flies to (GSAP animates .target) -->\n      <div class=\"targetWrap\" aria-hidden=\"true\">\n        <div class=\"target\" id=\"target\">\n          <span class=\"heart__glow\" aria-hidden=\"true\"><\/span>\n          <span class=\"target__heart\" id=\"targetHeart\">\n            <svg class=\"heart__svg\" viewBox=\"0 0 100 92\" aria-hidden=\"true\">\n              <defs>\n                <radialGradient id=\"hg\" cx=\"38%\" cy=\"30%\" r=\"80%\">\n                  <stop offset=\"0%\"  stop-color=\"#ffd9e4\" />\n                  <stop offset=\"42%\" stop-color=\"#ff6f97\" />\n                  <stop offset=\"82%\" stop-color=\"#d81e57\" />\n                  <stop offset=\"100%\" stop-color=\"#9d0f3e\" />\n                <\/radialGradient>\n                <linearGradient id=\"hsheen\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                  <stop offset=\"0%\"  stop-color=\"rgba(255,255,255,.85)\" />\n                  <stop offset=\"34%\" stop-color=\"rgba(255,255,255,0)\" />\n                <\/linearGradient>\n              <\/defs>\n              <path d=\"M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z\" fill=\"url(#hg)\" />\n              <path d=\"M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z\" fill=\"url(#hsheen)\" opacity=\".7\" />\n              <ellipse cx=\"34\" cy=\"30\" rx=\"8.5\" ry=\"5.4\" fill=\"#fff\" opacity=\".72\" style=\"mix-blend-mode:screen\" />\n            <\/svg>\n          <\/span>\n        <\/div>\n      <\/div>\n\n      <!-- THE BOW + ARROW — draw the string back, release to fire. The rig is\n           placed lower-left and rotated by JS to aim at the heart, so the shot\n           travels on a diagonal. A real control: role=button + keyboard drag. -->\n      <div class=\"archery\" id=\"archery\" role=\"button\" tabindex=\"0\"\n           aria-label=\"Draw the bow and release to send the arrow to the heart\">\n\n          <!-- aim line, inside the rig so it points straight at the heart -->\n          <div class=\"aim\" id=\"aim\" aria-hidden=\"true\"><\/div>\n\n          <!-- realistic recurve bow: wooden limbs, leather grip, a live string -->\n          <svg class=\"bow\" id=\"bow\" viewBox=\"0 0 460 300\" aria-hidden=\"true\">\n            <defs>\n              <linearGradient id=\"limb\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n                <stop offset=\"0\"   stop-color=\"#4a2a1a\" />\n                <stop offset=\".18\" stop-color=\"#6b3f24\" />\n                <stop offset=\".5\"  stop-color=\"#8a5127\" />\n                <stop offset=\".82\" stop-color=\"#6b3f24\" />\n                <stop offset=\"1\"   stop-color=\"#4a2a1a\" />\n              <\/linearGradient>\n              <linearGradient id=\"limbHi\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stop-color=\"rgba(255,214,160,.8)\" />\n                <stop offset=\"1\" stop-color=\"rgba(255,214,160,0)\" />\n              <\/linearGradient>\n              <linearGradient id=\"grip\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n                <stop offset=\"0\" stop-color=\"#2a1a10\" />\n                <stop offset=\".5\" stop-color=\"#5a3822\" />\n                <stop offset=\"1\" stop-color=\"#2a1a10\" />\n              <\/linearGradient>\n            <\/defs>\n            <!-- limb body (taper faked with two stacked strokes) -->\n            <path class=\"bow__limb\" d=\"M34 96 C 118 168, 168 240, 230 252 C 292 240, 342 168, 426 96\"\n                  fill=\"none\" stroke=\"url(#limb)\" stroke-width=\"13\" stroke-linecap=\"round\" />\n            <path class=\"bow__limbHi\" d=\"M34 96 C 118 168, 168 240, 230 252 C 292 240, 342 168, 426 96\"\n                  fill=\"none\" stroke=\"url(#limbHi)\" stroke-width=\"3\" stroke-linecap=\"round\" opacity=\".7\" />\n            <!-- recurve tip hooks -->\n            <path d=\"M34 96 C 22 82, 26 70, 40 66\" fill=\"none\" stroke=\"url(#limb)\" stroke-width=\"8\" stroke-linecap=\"round\" />\n            <path d=\"M426 96 C 438 82, 434 70, 420 66\" fill=\"none\" stroke=\"url(#limb)\" stroke-width=\"8\" stroke-linecap=\"round\" />\n            <!-- leather grip over the belly -->\n            <rect x=\"216\" y=\"206\" width=\"28\" height=\"70\" rx=\"9\" fill=\"url(#grip)\" />\n            <path d=\"M219 220h22 M219 236h22 M219 252h22\" stroke=\"rgba(0,0,0,.35)\" stroke-width=\"2\" />\n            <!-- the string: two segments meeting at the nock (JS animates the nock).\n                 A warm taupe so the taut string actually reads against the cream. -->\n            <line class=\"bow__str\" id=\"strL\" x1=\"40\" y1=\"70\" x2=\"230\" y2=\"96\" stroke=\"#9a8068\" stroke-width=\"2.2\" stroke-linecap=\"round\" />\n            <line class=\"bow__str\" id=\"strR\" x1=\"420\" y1=\"70\" x2=\"230\" y2=\"96\" stroke=\"#9a8068\" stroke-width=\"2.2\" stroke-linecap=\"round\" />\n            <circle class=\"bow__serving\" id=\"serving\" cx=\"230\" cy=\"96\" r=\"4.5\" fill=\"#6f5137\" />\n          <\/svg>\n\n          <!-- the arrow: winged golden heart tip (Cupid), gold feather fletching -->\n          <svg class=\"arrow\" id=\"arrow\" viewBox=\"0 0 64 220\" aria-hidden=\"true\">\n            <defs>\n              <linearGradient id=\"shaft\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n                <stop offset=\"0\" stop-color=\"#4a2c14\" />\n                <stop offset=\".5\" stop-color=\"#8a5a2c\" />\n                <stop offset=\"1\" stop-color=\"#3e2410\" />\n              <\/linearGradient>\n              <linearGradient id=\"gold\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n                <stop offset=\"0\" stop-color=\"#ffe38c\" />\n                <stop offset=\".45\" stop-color=\"#f4a626\" />\n                <stop offset=\"1\" stop-color=\"#a85f0e\" />\n              <\/linearGradient>\n              <linearGradient id=\"feath\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n                <stop offset=\"0\" stop-color=\"#ff7f9c\" />\n                <stop offset=\".5\" stop-color=\"#e6396a\" />\n                <stop offset=\"1\" stop-color=\"#a8154a\" />\n              <\/linearGradient>\n              <linearGradient id=\"wing\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stop-color=\"#ffffff\" />\n                <stop offset=\"1\" stop-color=\"#ffe0c4\" />\n              <\/linearGradient>\n            <\/defs>\n\n            <!-- shaft (dark wood so it reads against the cream) -->\n            <rect x=\"29.4\" y=\"30\" width=\"5.2\" height=\"168\" rx=\"2.6\" fill=\"url(#shaft)\" />\n\n            <!-- angel wings flanking the heart tip -->\n            <g class=\"arrow__wings\">\n              <path class=\"wingL\" d=\"M31 30 C 10 16, 2 20, 4 34 C 12 30, 20 32, 31 40 Z\" fill=\"url(#wing)\" stroke=\"rgba(196,132,58,.72)\" stroke-width=\"1.2\"/>\n              <path class=\"wingR\" d=\"M33 30 C 54 16, 62 20, 60 34 C 52 30, 44 32, 33 40 Z\" fill=\"url(#wing)\" stroke=\"rgba(196,132,58,.72)\" stroke-width=\"1.2\"/>\n            <\/g>\n\n            <!-- golden heart arrowhead (Cupid's love arrow) -->\n            <path class=\"arrow__head\" d=\"M32 12 C 30 7, 22 6.5, 21.5 13 C 21 18, 27 22, 32 27 C 37 22, 43 18, 42.5 13 C 42 6.5, 34 7, 32 12 Z\" fill=\"url(#gold)\" stroke=\"#a5701a\" stroke-width=\".8\" />\n            <ellipse cx=\"27\" cy=\"13\" rx=\"2.6\" ry=\"1.7\" fill=\"#fff\" opacity=\".8\" style=\"mix-blend-mode:screen\" />\n\n            <!-- gold feather fletching -->\n            <g class=\"arrow__fletch\">\n              <path d=\"M32 150 C 16 156, 10 178, 15 200 C 24 194, 30 184, 32 176 Z\" fill=\"url(#feath)\" />\n              <path d=\"M32 150 C 48 156, 54 178, 49 200 C 40 194, 34 184, 32 176 Z\" fill=\"url(#feath)\" opacity=\".92\" />\n              <path d=\"M28 160l4 3 M26 170l6 3 M25 180l7 3\" stroke=\"rgba(130,12,48,.45)\" stroke-width=\"1\" />\n              <path d=\"M36 160l-4 3 M38 170l-6 3 M39 180l-7 3\" stroke=\"rgba(130,12,48,.45)\" stroke-width=\"1\" />\n            <\/g>\n            <!-- nock -->\n            <path d=\"M29 200 L32 205 L35 200\" fill=\"none\" stroke=\"#c9a25a\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <!-- invisible tip marker: JS measures it to land the head on the heart -->\n            <circle id=\"tip\" cx=\"32\" cy=\"9\" r=\"0.6\" fill=\"none\" />\n          <\/svg>\n      <\/div>\n\n      <p class=\"hero__hint\" id=\"hint\">pull &amp; release<\/p>\n    <\/section>\n\n    <!-- ACT 2 — THE FLOOD -----------------------------------------------------\n         The heart bursts into this circle at its landing point, and it swallows\n         the frame in rose. Same trick as the intro dot: no cross-fade anywhere,\n         the colour just arrives. -->\n    <div class=\"flood\" id=\"flood\" aria-hidden=\"true\"><\/div>\n\n    <!-- ACT 3 — THE WISH (kinetic type on the flood) --------------------------\n         Lives inside the flood's own colour, revealed by it. Every glyph hinges\n         up out of its mask — nothing fades. -->\n    <div class=\"field\" id=\"field\" aria-hidden=\"true\">\n      <div class=\"blob blob--1\"><\/div>\n      <div class=\"blob blob--2\"><\/div>\n      <div class=\"blob blob--3\"><\/div>\n      <div class=\"fgrid\" id=\"fgrid\"><\/div>\n      <div class=\"fvignette\"><\/div>\n\n      <div class=\"camera\" id=\"camera\">\n        <p class=\"kEyebrow\" id=\"kEyebrow\">from the bottom of my heart&hellip;<\/p>\n        <h2 class=\"headline\" id=\"headline\">\n          <span class=\"hl__line\"><span class=\"mask\"><span class=\"hl__word\" id=\"wLine1\">I&rsquo;m Truly<\/span><\/span><\/span>\n          <span class=\"hl__line\"><span class=\"mask\"><span class=\"hl__word\" id=\"wLine2\">Sorry<\/span><\/span><\/span>\n        <\/h2>\n        <svg class=\"uline\" id=\"uline\" viewBox=\"0 0 300 26\" fill=\"none\" aria-hidden=\"true\">\n          <path class=\"uline__path\" d=\"M8 16C56 7 132 4 178 6c30 1 78 5 114 12-40 3-108 4-176 3\"\n                stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n        <\/svg>\n        <p class=\"kSub\" id=\"kSub\">for every moment I made you feel hurt<\/p>\n      <\/div>\n\n      <div class=\"bar bar--top\" id=\"barTop\"><\/div>\n      <div class=\"bar bar--bot\" id=\"barBot\"><\/div>\n    <\/div>\n\n    <!-- The gold light that bridges the rose wish into the dawn of the tree. -->\n    <div class=\"bloom\" id=\"bloom\" aria-hidden=\"true\"><\/div>\n\n    <!-- ACT 4 — THE HAND-LETTERED WISH (over the tree) ------------------------ -->\n    <div class=\"wish\" id=\"wish\" aria-hidden=\"true\">\n      <p class=\"wish__eyebrow\" id=\"wEyebrow\">and&hellip; I hope one day you can<\/p>\n      <div class=\"wish__heroWrap\"><h1 class=\"wish__hero\" id=\"wHero\">Forgive Me<\/h1><\/div>\n      <span class=\"wish__rule\" id=\"wRule\"><\/span>\n      <p class=\"wish__sub\" id=\"wSub\">I promise I&rsquo;ll do better, Abhu<\/p>\n    <\/div>\n\n    <!-- Play the film again once it has settled. -->\n    <button class=\"replay\" id=\"replay\" type=\"button\" hidden>\n      <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"15\" height=\"15\">\n        <path d=\"M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z\" fill=\"currentColor\" />\n      <\/svg>\n      Again\n    <\/button>\n\n    <!-- One lens over the whole film: vignette + fine grain. -->\n    <div class=\"grade\" aria-hidden=\"true\">\n      <div class=\"grade__vignette\"><\/div>\n      <div class=\"grade__grain\"><\/div>\n    <\/div>\n  <\/main>\n\n  <!-- Accessible equivalent for reduced-motion + screen readers. -->\n  <p class=\"sr-only\">I&rsquo;m truly sorry. Please forgive me.<\/p>\n\n  <script>/*!\n * GSAP 3.13.0\n * https://gsap.com\n * \n * @license Copyright 2025, GreenSock. All rights reserved.\n * Subject to the terms at https://gsap.com/standard-license.\n * @author: Jack Doyle, jack@greensock.com\n */\n\n!function(t,e){\"object\"==typeof exports&&\"undefined\"!=typeof module?e(exports):\"function\"==typeof define&&define.amd?define([\"exports\"],e):e((t=t||self).window=t.window||{})}(this,function(e){\"use strict\";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return t}function r(t){return\"string\"==typeof t}function s(t){return\"function\"==typeof t}function t(t){return\"number\"==typeof t}function u(t){return void 0===t}function v(t){return\"object\"==typeof t}function w(t){return!1!==t}function x(){return\"undefined\"!=typeof window}function y(t){return s(t)||r(t)}function P(t){return(i=yt(t,ot))&&ze}function Q(t,e){return console.warn(\"Invalid property\",t,\"set to\",e,\"Missing plugin? gsap.registerPlugin()\")}function R(t,e){return!e&&console.warn(t)}function S(t,e){return t&&(ot[t]=e)&&i&&(i[t]=e)||ot}function T(){return 0}function ea(t){var e,r,i=t[0];if(v(i)||s(i)||(t=[t]),!(e=(i._gsap||{}).harness)){for(r=gt.length;r--&&!gt[r].targetTest(i););e=gt[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new Zt(t[r],e)))||t.splice(r,1);return t}function fa(t){return t._gsap||ea(Ot(t))[0]._gsap}function ga(t,e,r){return(r=t[e])&&s(r)?t[e]():u(r)&&t.getAttribute&&t.getAttribute(e)||r}function ha(t,e){return(t=t.split(\",\")).forEach(e)||t}function ia(t){return Math.round(1e5*t)/1e5||0}function ja(t){return Math.round(1e7*t)/1e7||0}function ka(t,e){var r=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),\"+\"===r?t+i:\"-\"===r?t-i:\"*\"===r?t*i:t/i}function la(t,e){for(var r=e.length,i=0;t.indexOf(e[i])<0&&++i<r;);return i<r}function ma(){var t,e,r=dt.length,i=dt.slice(0);for(ct={},t=dt.length=0;t<r;t++)(e=i[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function na(t){return!!(t._initted||t._startAt||t.add)}function oa(t,e,r,i){dt.length&&!L&&ma(),t.render(e,r,i||!!(L&&e<0&&na(t))),dt.length&&!L&&ma()}function pa(t){var e=parseFloat(t);return(e||0===e)&&(t+\"\").match(at).length<2?e:r(t)?t.trim():t}function qa(t){return t}function ra(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function ua(t,e){for(var r in e)\"__proto__\"!==r&&\"constructor\"!==r&&\"prototype\"!==r&&(t[r]=v(e[r])?ua(t[r]||(t[r]={}),e[r]):e[r]);return t}function va(t,e){var r,i={};for(r in t)r in e||(i[r]=t[r]);return i}function wa(t){var e=t.parent||I,r=t.keyframes?function _setKeyframeDefaults(i){return function(t,e){for(var r in e)r in t||\"duration\"===r&&i||\"ease\"===r||(t[r]=e[r])}}($(t.keyframes)):ra;if(w(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent||e._dp;return t}function ya(t,e,r,i,n){void 0===r&&(r=\"_first\"),void 0===i&&(i=\"_last\");var a,s=t[i];if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[i]=e,e._prev=s,e.parent=e._dp=t,e}function za(t,e,r,i){void 0===r&&(r=\"_first\"),void 0===i&&(i=\"_last\");var n=e._prev,a=e._next;n?n._next=a:t[r]===e&&(t[r]=a),a?a._prev=n:t[i]===e&&(t[i]=n),e._next=e._prev=e.parent=null}function Aa(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0}function Ba(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var r=t;r;)r._dirty=1,r=r.parent;return t}function Da(t,e,r,i){return t._startAt&&(L?t._startAt.revert(ht):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))}function Fa(t){return t._repeat?Tt(t._tTime,t=t.duration()+t._rDelay)*t:0}function Ha(t,e){return(t-e._start)*e._ts+(0<=e._ts?0:e._dirty?e.totalDuration():e._tDur)}function Ia(t){return t._end=ja(t._start+(t._tDur/Math.abs(t._ts||t._rts||U)||0))}function Ja(t,e){var r=t._dp;return r&&r.smoothChildTiming&&t._ts&&(t._start=ja(r._time-(0<t._ts?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ia(t),r._dirty||Ba(r,t)),t}function Ka(t,e){var r;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(r=Ha(t.rawTime(),e),(!e._dur||Mt(0,e.totalDuration(),r)-e._tTime>U)&&e.render(r,!0)),Ba(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(r=t;r._dp;)0<=r.rawTime()&&r.totalTime(r._tTime),r=r._dp;t._zTime=-U}}function La(e,r,i,n){return r.parent&&Aa(r),r._start=ja((t(i)?i:i||e!==I?xt(e,i,r):e._time)+r._delay),r._end=ja(r._start+(r.totalDuration()/Math.abs(r.timeScale())||0)),ya(e,r,\"_first\",\"_last\",e._sort?\"_start\":0),bt(r)||(e._recent=r),n||Ka(e,r),e._ts<0&&Ja(e,e._tTime),e}function Ma(t,e){return(ot.ScrollTrigger||Q(\"scrollTrigger\",e))&&ot.ScrollTrigger.create(e,t)}function Na(t,e,r,i,n){return Wt(t,e,n),t._initted?!r&&t._pt&&!L&&(t._dur&&!1!==t.vars.lazy||!t._dur&&t.vars.lazy)&&f!==Rt.frame?(dt.push(t),t._lazy=[n,i],1):void 0:1}function Sa(t,e,r,i){var n=t._repeat,a=ja(e)||0,s=t._tTime/t._tDur;return s&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=n?n<0?1e10:ja(a*(n+1)+t._rDelay*n):a,0<s&&!i&&Ja(t,t._tTime=t._tDur*s),t.parent&&Ia(t),r||Ba(t.parent,t),t}function Ta(t){return t instanceof Qt?Ba(t):Sa(t,t._dur)}function Wa(e,r,i){var n,a,s=t(r[1]),o=(s?2:1)+(e<2?0:1),u=r[o];if(s&&(u.duration=r[1]),u.parent=i,e){for(n=u,a=i;a&&!(\"immediateRender\"in n);)n=a.vars.defaults||{},a=w(a.vars.inherit)&&a.parent;u.immediateRender=w(n.immediateRender),e<2?u.runBackwards=1:u.startAt=r[o-1]}return new Jt(r[0],u,r[1+o])}function Xa(t,e){return t||0===t?e(t):e}function Za(t,e){return r(t)&&(e=st.exec(t))?e[1]:\"\"}function ab(t,e){return t&&v(t)&&\"length\"in t&&(!e&&!t.length||t.length-1 in t&&v(t[0]))&&!t.nodeType&&t!==h}function db(r){return r=Ot(r)[0]||R(\"Invalid scope\")||{},function(t){var e=r.current||r.nativeElement||r;return Ot(t,e.querySelectorAll?e:e===r?R(\"Invalid scope\")||a.createElement(\"div\"):r)}}function eb(t){return t.sort(function(){return.5-Math.random()})}function fb(t){if(s(t))return t;var p=v(t)?t:{each:t},_=Yt(p.ease),m=p.from||0,g=parseFloat(p.base)||0,y={},e=0<m&&m<1,T=isNaN(m)||e,b=p.axis,w=m,x=m;return r(m)?w=x={center:.5,edges:.5,end:1}[m]||0:!e&&T&&(w=m[0],x=m[1]),function(t,e,r){var i,n,a,s,o,u,h,l,f,d=(r||p).length,c=y[d];if(!c){if(!(f=\"auto\"===p.grid?0:(p.grid||[1,N])[1])){for(h=-N;h<(h=r[f++].getBoundingClientRect().left)&&f<d;);f<d&&f--}for(c=y[d]=[],i=T?Math.min(f,d)*w-.5:m%f,n=f===N?0:T?d*x/f-.5:m/f|0,l=N,u=h=0;u<d;u++)a=u%f-i,s=n-(u/f|0),c[u]=o=b?Math.abs(\"y\"===b?s:a):G(a*a+s*s),h<o&&(h=o),o<l&&(l=o);\"random\"===m&&eb(c),c.max=h-l,c.min=l,c.v=d=(parseFloat(p.amount)||parseFloat(p.each)*(d<f?d-1:b?\"y\"===b?d/f:f:Math.max(f,d/f))||0)*(\"edges\"===m?-1:1),c.b=d<0?g-d:g,c.u=Za(p.amount||p.each)||0,_=_&&d<0?jt(_):_}return d=(c[t]-c.min)/c.max||0,ja(c.b+(_?_(d):d)*c.v)+c.u}}function gb(i){var n=Math.pow(10,((i+\"\").split(\".\")[1]||\"\").length);return function(e){var r=ja(Math.round(parseFloat(e)/i)*i*n);return(r-r%1)/n+(t(e)?0:Za(e))}}function hb(h,e){var l,f,r=$(h);return!r&&v(h)&&(l=r=h.radius||N,h.values?(h=Ot(h.values),(f=!t(h[0]))&&(l*=l)):h=gb(h.increment)),Xa(e,r?s(h)?function(t){return f=h(t),Math.abs(f-t)<=l?f:t}:function(e){for(var r,i,n=parseFloat(f?e.x:e),a=parseFloat(f?e.y:0),s=N,o=0,u=h.length;u--;)(r=f?(r=h[u].x-n)*r+(i=h[u].y-a)*i:Math.abs(h[u]-n))<s&&(s=r,o=u);return o=!l||s<=l?h[o]:e,f||o===e||t(e)?o:o+Za(e)}:gb(h))}function ib(t,e,r,i){return Xa($(t)?!e:!0===r?!!(r=0):!i,function(){return $(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(i=r<1?Math.pow(10,(r+\"\").length-2):1)&&Math.floor(Math.round((t-r/2+Math.random()*(e-t+.99*r))/r)*r*i)/i})}function mb(e,r,t){return Xa(t,function(t){return e[~~r(t)]})}function pb(t){for(var e,r,i,n,a=0,s=\"\";~(e=t.indexOf(\"random(\",a));)i=t.indexOf(\")\",e),n=\"[\"===t.charAt(e+7),r=t.substr(e+7,i-e-7).match(n?at:tt),s+=t.substr(a,e-a)+ib(n?r:+r[0],n?0:+r[1],+r[2]||1e-5),a=i+1;return s+t.substr(a,t.length-a)}function sb(t,e,r){var i,n,a,s=t.labels,o=N;for(i in s)(n=s[i]-e)<0==!!r&&n&&o>(n=Math.abs(n))&&(a=i,o=n);return a}function ub(t){return Aa(t),t.scrollTrigger&&t.scrollTrigger.kill(!!L),t.progress()<1&&Pt(t,\"onInterrupt\"),t}function xb(t){if(t)if(t=!t.name&&t.default||t,x()||t.headless){var e=t.name,r=s(t),i=e&&!r&&t.init?function(){this._props=[]}:t,n={init:T,render:ue,add:Vt,kill:de,modifier:he,rawVars:0},a={targetTest:0,get:0,getSetter:ie,aliases:{},register:0};if(Ft(),t!==i){if(pt[e])return;ra(i,ra(va(t,n),a)),yt(i.prototype,yt(n,va(t,a))),pt[i.prop=e]=i,t.targetTest&&(gt.push(i),ft[e]=1),e=(\"css\"===e?\"CSS\":e.charAt(0).toUpperCase()+e.substr(1))+\"Plugin\"}S(e,i),t.register&&t.register(ze,i,ge)}else Ct.push(t)}function Ab(t,e,r){return(6*(t+=t<0?1:1<t?-1:0)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*St+.5|0}function Bb(e,r,i){var n,a,s,o,u,h,l,f,d,c,p=e?t(e)?[e>>16,e>>8&St,e&St]:0:Dt.black;if(!p){if(\",\"===e.substr(-1)&&(e=e.substr(0,e.length-1)),Dt[e])p=Dt[e];else if(\"#\"===e.charAt(0)){if(e.length<6&&(e=\"#\"+(n=e.charAt(1))+n+(a=e.charAt(2))+a+(s=e.charAt(3))+s+(5===e.length?e.charAt(4)+e.charAt(4):\"\")),9===e.length)return[(p=parseInt(e.substr(1,6),16))>>16,p>>8&St,p&St,parseInt(e.substr(7),16)/255];p=[(e=parseInt(e.substr(1),16))>>16,e>>8&St,e&St]}else if(\"hsl\"===e.substr(0,3))if(p=c=e.match(tt),r){if(~e.indexOf(\"=\"))return p=e.match(et),i&&p.length<4&&(p[3]=1),p}else o=+p[0]%360/360,u=p[1]/100,n=2*(h=p[2]/100)-(a=h<=.5?h*(u+1):h+u-h*u),3<p.length&&(p[3]*=1),p[0]=Ab(o+1/3,n,a),p[1]=Ab(o,n,a),p[2]=Ab(o-1/3,n,a);else p=e.match(tt)||Dt.transparent;p=p.map(Number)}return r&&!c&&(n=p[0]/St,a=p[1]/St,s=p[2]/St,h=((l=Math.max(n,a,s))+(f=Math.min(n,a,s)))/2,l===f?o=u=0:(d=l-f,u=.5<h?d/(2-l-f):d/(l+f),o=l===n?(a-s)/d+(a<s?6:0):l===a?(s-n)/d+2:(n-a)/d+4,o*=60),p[0]=~~(o+.5),p[1]=~~(100*u+.5),p[2]=~~(100*h+.5)),i&&p.length<4&&(p[3]=1),p}function Cb(t){var r=[],i=[],n=-1;return t.split(zt).forEach(function(t){var e=t.match(rt)||[];r.push.apply(r,e),i.push(n+=e.length+1)}),r.c=i,r}function Db(t,e,r){var i,n,a,s,o=\"\",u=(t+o).match(zt),h=e?\"hsla(\":\"rgba(\",l=0;if(!u)return t;if(u=u.map(function(t){return(t=Bb(t,e,1))&&h+(e?t[0]+\",\"+t[1]+\"%,\"+t[2]+\"%,\"+t[3]:t.join(\",\"))+\")\"}),r&&(a=Cb(t),(i=r.c).join(o)!==a.c.join(o)))for(s=(n=t.replace(zt,\"1\").split(rt)).length-1;l<s;l++)o+=n[l]+(~i.indexOf(l)?u.shift()||h+\"0,0,0,0)\":(a.length?a:u.length?u:r).shift());if(!n)for(s=(n=t.split(zt)).length-1;l<s;l++)o+=n[l]+u[l];return o+n[s]}function Gb(t){var e,r=t.join(\" \");if(zt.lastIndex=0,zt.test(r))return e=Et.test(r),t[1]=Db(t[1],e),t[0]=Db(t[0],e,Cb(t[1])),!0}function Pb(t){var e=(t+\"\").split(\"(\"),r=Lt[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf(\"{\")?[function _parseObjectInString(t){for(var e,r,i,n={},a=t.substr(1,t.length-3).split(\":\"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(\",\"):r.length,i=r.substr(0,e),n[s]=isNaN(i)?i.replace(Bt,\"\").trim():+i,s=r.substr(e+1).trim();return n}(e[1])]:function _valueInParentheses(t){var e=t.indexOf(\"(\")+1,r=t.indexOf(\")\"),i=t.indexOf(\"(\",e);return t.substring(e,~i&&i<r?t.indexOf(\")\",r+1):r)}(t).split(\",\").map(pa)):Lt._CE&&It.test(t)?Lt._CE(\"\",t):r}function Rb(t,e){for(var r,i=t._first;i;)i instanceof Qt?Rb(i,e):!i.vars.yoyoEase||i._yoyo&&i._repeat||i._yoyo===e||(i.timeline?Rb(i.timeline,e):(r=i._ease,i._ease=i._yEase,i._yEase=r,i._yoyo=e)),i=i._next}function Tb(t,e,r,i){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===i&&(i=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var n,a={easeIn:e,easeOut:r,easeInOut:i};return ha(t,function(t){for(var e in Lt[t]=ot[t]=a,Lt[n=t.toLowerCase()]=r,a)Lt[n+(\"easeIn\"===e?\".in\":\"easeOut\"===e?\".out\":\".inOut\")]=Lt[t+\".\"+e]=a[e]}),a}function Ub(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function Vb(r,t,e){function Lm(t){return 1===t?1:i*Math.pow(2,-10*t)*K((t-a)*n)+1}var i=1<=t?t:1,n=(e||(r?.3:.45))/(t<1?t:1),a=n/q*(Math.asin(1/i)||0),s=\"out\"===r?Lm:\"in\"===r?function(t){return 1-Lm(1-t)}:Ub(Lm);return n=q/n,s.config=function(t,e){return Vb(r,t,e)},s}function Wb(e,r){function Tm(t){return t?--t*t*((r+1)*t+r)+1:0}void 0===r&&(r=1.70158);var t=\"out\"===e?Tm:\"in\"===e?function(t){return 1-Tm(1-t)}:Ub(Tm);return t.config=function(t){return Wb(e,t)},t}var F,L,l,I,h,n,a,i,o,f,d,c,p,_,m,g,b,M,k,O,A,C,D,z,E,B,j,Y,X={autoSleep:120,force3D:\"auto\",nullTargetWarn:1,units:{lineHeight:\"\"}},Z={duration:.5,overwrite:!1,delay:0},N=1e8,U=1/N,q=2*Math.PI,V=q/4,W=0,G=Math.sqrt,H=Math.cos,K=Math.sin,J=\"function\"==typeof ArrayBuffer&&ArrayBuffer.isView||function(){},$=Array.isArray,tt=/(?:-?\\.?\\d|\\.)+/gi,et=/[-+=.]*\\d+[.e\\-+]*\\d*[e\\-+]*\\d*/g,rt=/[-+=.]*\\d+[.e-]*\\d*[a-z%]*/g,it=/[-+=.]*\\d+\\.?\\d*(?:e-|e\\+)?\\d*/gi,nt=/[+-]=-?[.\\d]+/,at=/[^,'\"\\[\\]\\s]+/gi,st=/^[+\\-=e\\s\\d]*\\d+[.\\d]*([a-z]*|%)\\s*$/i,ot={},ut={suppressEvents:!0,isStart:!0,kill:!1},ht={suppressEvents:!0,kill:!1},lt={suppressEvents:!0},ft={},dt=[],ct={},pt={},_t={},mt=30,gt=[],vt=\"\",yt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},Tt=function _animationCycle(t,e){var r=Math.floor(t=ja(t/e));return t&&r===t?r-1:r},bt=function _isFromOrFromStart(t){var e=t.data;return\"isFromStart\"===e||\"isStart\"===e},wt={_start:0,endTime:T,totalDuration:T},xt=function _parsePosition(t,e,i){var n,a,s,o=t.labels,u=t._recent||wt,h=t.duration()>=N?u.endTime(!1):t._dur;return r(e)&&(isNaN(e)||e in o)?(a=e.charAt(0),s=\"%\"===e.substr(-1),n=e.indexOf(\"=\"),\"<\"===a||\">\"===a?(0<=n&&(e=e.replace(/=/,\"\")),(\"<\"===a?u._start:u.endTime(0<=u._repeat))+(parseFloat(e.substr(1))||0)*(s?(n<0?u:i).totalDuration()/100:1)):n<0?(e in o||(o[e]=h),o[e]):(a=parseFloat(e.charAt(n-1)+e.substr(n+1)),s&&i&&(a=a/100*($(i)?i[0]:i).totalDuration()),1<n?_parsePosition(t,e.substr(0,n-1),i)+a:h+a)):null==e?h:+e},Mt=function _clamp(t,e,r){return r<t?t:e<r?e:r},kt=[].slice,Ot=function toArray(t,e,i){return l&&!e&&l.selector?l.selector(t):!r(t)||i||!n&&Ft()?$(t)?function _flatten(t,e,i){return void 0===i&&(i=[]),t.forEach(function(t){return r(t)&&!e||ab(t,1)?i.push.apply(i,Ot(t)):i.push(t)})||i}(t,i):ab(t)?kt.call(t,0):t?[t]:[]:kt.call((e||a).querySelectorAll(t),0)},At=function mapRange(e,t,r,i,n){var a=t-e,s=i-r;return Xa(n,function(t){return r+((t-e)/a*s||0)})},Pt=function _callback(t,e,r){var i,n,a,s=t.vars,o=s[e],u=l,h=t._ctx;if(o)return i=s[e+\"Params\"],n=s.callbackScope||t,r&&dt.length&&ma(),h&&(l=h),a=i?o.apply(n,i):o.call(n),l=u,a},Ct=[],St=255,Dt={aqua:[0,St,St],lime:[0,St,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,St],navy:[0,0,128],white:[St,St,St],olive:[128,128,0],yellow:[St,St,0],orange:[St,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[St,0,0],pink:[St,192,203],cyan:[0,St,St],transparent:[St,St,St,0]},zt=function(){var t,e=\"(?:\\\\b(?:(?:rgb|rgba|hsl|hsla)\\\\(.+?\\\\))|\\\\B#(?:[0-9a-f]{3,4}){1,2}\\\\b\";for(t in Dt)e+=\"|\"+t+\"\\\\b\";return new RegExp(e+\")\",\"gi\")}(),Et=/hsl[a]?\\(/,Rt=(k=Date.now,O=500,A=33,C=k(),D=C,E=z=1e3/240,g={time:0,frame:0,tick:function tick(){Al(!0)},deltaRatio:function deltaRatio(t){return b/(1e3/(t||60))},wake:function wake(){o&&(!n&&x()&&(h=n=window,a=h.document||{},ot.gsap=ze,(h.gsapVersions||(h.gsapVersions=[])).push(ze.version),P(i||h.GreenSockGlobals||!h.gsap&&h||{}),Ct.forEach(xb)),m=\"undefined\"!=typeof requestAnimationFrame&&requestAnimationFrame,p&&g.sleep(),_=m||function(t){return setTimeout(t,E-1e3*g.time+1|0)},c=1,Al(2))},sleep:function sleep(){(m?cancelAnimationFrame:clearTimeout)(p),c=0,_=T},lagSmoothing:function lagSmoothing(t,e){O=t||1/0,A=Math.min(e||33,O)},fps:function fps(t){z=1e3/(t||240),E=1e3*g.time+z},add:function add(n,t,e){var a=t?function(t,e,r,i){n(t,e,r,i),g.remove(a)}:n;return g.remove(n),B[e?\"unshift\":\"push\"](a),Ft(),a},remove:function remove(t,e){~(e=B.indexOf(t))&&B.splice(e,1)&&e<=M&&M--},_listeners:B=[]}),Ft=function _wake(){return!c&&Rt.wake()},Lt={},It=/^[\\d.\\-M][\\d.\\-,\\s]/,Bt=/[\"']/g,jt=function _invertEase(e){return function(t){return 1-e(1-t)}},Yt=function _parseEase(t,e){return t&&(s(t)?t:Lt[t]||Pb(t))||e};function Al(t){var e,r,i,n,a=k()-D,s=!0===t;if((O<a||a<0)&&(C+=a-A),(0<(e=(i=(D+=a)-C)-E)||s)&&(n=++g.frame,b=i-1e3*g.time,g.time=i/=1e3,E+=e+(z<=e?4:z-e),r=1),s||(p=_(Al)),r)for(M=0;M<B.length;M++)B[M](i,b,n,t)}function jn(t){return t<Y?j*t*t:t<.7272727272727273?j*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?j*(t-=2.25/2.75)*t+.9375:j*Math.pow(t-2.625/2.75,2)+.984375}ha(\"Linear,Quad,Cubic,Quart,Quint,Strong\",function(t,e){var r=e<5?e+1:e;Tb(t+\",Power\"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Lt.Linear.easeNone=Lt.none=Lt.Linear.easeIn,Tb(\"Elastic\",Vb(\"in\"),Vb(\"out\"),Vb()),j=7.5625,Y=1/2.75,Tb(\"Bounce\",function(t){return 1-jn(1-t)},jn),Tb(\"Expo\",function(t){return Math.pow(2,10*(t-1))*t+t*t*t*t*t*t*(1-t)}),Tb(\"Circ\",function(t){return-(G(1-t*t)-1)}),Tb(\"Sine\",function(t){return 1===t?1:1-H(t*V)}),Tb(\"Back\",Wb(\"in\"),Wb(\"out\"),Wb()),Lt.SteppedEase=Lt.steps=ot.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,i=t+(e?0:1),n=e?1:0;return function(t){return((i*Mt(0,.99999999,t)|0)+n)*r}}},Z.ease=Lt[\"quad.out\"],ha(\"onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt\",function(t){return vt+=t+\",\"+t+\"Params,\"});var Xt,Zt=function GSCache(t,e){this.id=W++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:ga,this.set=e?e.getSetter:ie},Nt=((Xt=Animation.prototype).delay=function delay(t){return t||0===t?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+t-this._delay),this._delay=t,this):this._delay},Xt.duration=function duration(t){return arguments.length?this.totalDuration(0<this._repeat?t+(t+this._rDelay)*this._repeat:t):this.totalDuration()&&this._dur},Xt.totalDuration=function totalDuration(t){return arguments.length?(this._dirty=0,Sa(this,this._repeat<0?t:(t-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},Xt.totalTime=function totalTime(t,e){if(Ft(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(Ja(this,t),!r._dp||r.parent||Ka(r,this);r&&r.parent;)r.parent._time!==r._start+(0<=r._ts?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(0<this._ts&&t<this._tDur||this._ts<0&&0<t||!this._tDur&&!t)&&La(this._dp,this,this._start-this._delay)}return(this._tTime!==t||!this._dur&&!e||this._initted&&Math.abs(this._zTime)===U||!t&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=t),oa(this,t,e)),this},Xt.time=function time(t,e){return arguments.length?this.totalTime(Math.min(this.totalDuration(),t+Fa(this))%(this._dur+this._rDelay)||(t?this._dur:0),e):this._time},Xt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this.totalDuration()?Math.min(1,this._tTime/this._tDur):0<=this.rawTime()&&this._initted?1:0},Xt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*(!this._yoyo||1&this.iteration()?t:1-t)+Fa(this),e):this.duration()?Math.min(1,this._time/this._dur):0<this.rawTime()?1:0},Xt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?Tt(this._tTime,r)+1:1},Xt.timeScale=function timeScale(t,e){if(!arguments.length)return this._rts===-U?0:this._rts;if(this._rts===t)return this;var r=this.parent&&this._ts?Ha(this.parent._time,this):this._tTime;return this._rts=+t||0,this._ts=this._ps||t===-U?0:this._rts,this.totalTime(Mt(-Math.abs(this._delay),this.totalDuration(),r),!1!==e),Ia(this),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this)},Xt.paused=function paused(t){return arguments.length?(this._ps!==t&&((this._ps=t)?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Ft(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,1===this.progress()&&Math.abs(this._zTime)!==U&&(this._tTime-=U)))),this):this._ps},Xt.startTime=function startTime(t){if(arguments.length){this._start=t;var e=this.parent||this._dp;return!e||!e._sort&&this.parent||La(e,this,t-this._delay),this}return this._start},Xt.endTime=function endTime(t){return this._start+(w(t)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},Xt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ha(e.rawTime(t),this):this._tTime:this._tTime},Xt.revert=function revert(t){void 0===t&&(t=lt);var e=L;return L=t,na(this)&&(this.timeline&&this.timeline.revert(t),this.totalTime(-.01,t.suppressEvents)),\"nested\"!==this.data&&!1!==t.kill&&this.kill(),L=e,this},Xt.globalTime=function globalTime(t){for(var e=this,r=arguments.length?t:e.rawTime();e;)r=e._start+r/(Math.abs(e._ts)||1),e=e._dp;return!this.parent&&this._sat?this._sat.globalTime(t):r},Xt.repeat=function repeat(t){return arguments.length?(this._repeat=t===1/0?-2:t,Ta(this)):-2===this._repeat?1/0:this._repeat},Xt.repeatDelay=function repeatDelay(t){if(arguments.length){var e=this._time;return this._rDelay=t,Ta(this),e?this.time(e):this}return this._rDelay},Xt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},Xt.seek=function seek(t,e){return this.totalTime(xt(this,t),w(e))},Xt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,w(e)),this._dur||(this._zTime=-U),this},Xt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},Xt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},Xt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},Xt.resume=function resume(){return this.paused(!1)},Xt.reversed=function reversed(t){return arguments.length?(!!t!==this.reversed()&&this.timeScale(-this._rts||(t?-U:0)),this):this._rts<0},Xt.invalidate=function invalidate(){return this._initted=this._act=0,this._zTime=-U,this},Xt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!(e&&!(this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-U))},Xt.eventCallback=function eventCallback(t,e,r){var i=this.vars;return 1<arguments.length?(e?(i[t]=e,r&&(i[t+\"Params\"]=r),\"onUpdate\"===t&&(this._onUpdate=e)):delete i[t],this):i[t]},Xt.then=function then(t){var i=this;return new Promise(function(e){function Eo(){var t=i.then;i.then=null,s(r)&&(r=r(i))&&(r.then||r===i)&&(i.then=t),e(r),i.then=t}var r=s(t)?t:qa;i._initted&&1===i.totalProgress()&&0<=i._ts||!i._tTime&&i._ts<0?Eo():i._prom=Eo})},Xt.kill=function kill(){ub(this)},Animation);function Animation(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Sa(this,+t.duration,1,1),this.data=t.data,l&&(this._ctx=l).data.push(this),c||Rt.wake()}ra(Nt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-U,_prom:0,_ps:!1,_rts:1});var Qt=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t)||this).labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=w(t.sortChildren),I&&La(t.parent||I,_assertThisInitialized(r),e),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&Ma(_assertThisInitialized(r),t.scrollTrigger),r}_inheritsLoose(Timeline,i);var e=Timeline.prototype;return e.to=function to(t,e,r){return Wa(0,arguments,this),this},e.from=function from(t,e,r){return Wa(1,arguments,this),this},e.fromTo=function fromTo(t,e,r,i){return Wa(2,arguments,this),this},e.set=function set(t,e,r){return e.duration=0,e.parent=this,wa(e).repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new Jt(t,e,xt(this,r),1),this},e.call=function call(t,e,r){return La(this,Jt.delayedCall(0,t,e),r)},e.staggerTo=function staggerTo(t,e,r,i,n,a,s){return r.duration=e,r.stagger=r.stagger||i,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new Jt(t,r,xt(this,n)),this},e.staggerFrom=function staggerFrom(t,e,r,i,n,a,s){return r.runBackwards=1,wa(r).immediateRender=w(r.immediateRender),this.staggerTo(t,e,r,i,n,a,s)},e.staggerFromTo=function staggerFromTo(t,e,r,i,n,a,s,o){return i.startAt=r,wa(i).immediateRender=w(i.immediateRender),this.staggerTo(t,e,i,n,a,s,o)},e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,d,c,p,_=this._time,m=this._dirty?this.totalDuration():this._tDur,g=this._dur,v=t<=0?0:ja(t),y=this._zTime<0!=t<0&&(this._initted||!g);if(this!==I&&m<v&&0<=t&&(v=m),v!==this._tTime||r||y){if(_!==this._time&&g&&(v+=this._time-_,t+=this._time-_),i=v,f=this._start,u=!(l=this._ts),y&&(g||(_=this._zTime),!t&&e||(this._zTime=t)),this._repeat){if(c=this._yoyo,o=g+this._rDelay,this._repeat<-1&&t<0)return this.totalTime(100*o+t,e,r);if(i=ja(v%o),v===m?(s=this._repeat,i=g):((s=~~(d=ja(v/o)))&&s===d&&(i=g,s--),g<i&&(i=g)),d=Tt(this._tTime,o),!_&&this._tTime&&d!==s&&this._tTime-d*o-this._dur<=0&&(d=s),c&&1&s&&(i=g-i,p=1),s!==d&&!this._lock){var T=c&&1&d,b=T===(c&&1&s);if(s<d&&(T=!T),_=T?0:v%g?g:v,this._lock=1,this.render(_||(p?0:ja(s*o)),e,!g)._lock=0,this._tTime=v,!e&&this.parent&&Pt(this,\"onRepeat\"),this.vars.repeatRefresh&&!p&&(this.invalidate()._lock=1),_&&_!==this._time||u!=!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(g=this._dur,m=this._tDur,b&&(this._lock=2,_=T?g:-1e-4,this.render(_,!0),this.vars.repeatRefresh&&!p&&this.invalidate()),this._lock=0,!this._ts&&!u)return this;Rb(this,p)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var i;if(e<r)for(i=t._first;i&&i._start<=r;){if(\"isPause\"===i.data&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=r;){if(\"isPause\"===i.data&&i._start<e)return i;i=i._prev}}(this,ja(_),ja(i)))&&(v-=i-(i=h._start)),this._tTime=v,this._time=i,this._act=!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=t,_=0),!_&&v&&!e&&!d&&(Pt(this,\"onStart\"),this._tTime!==v))return this;if(_<=i&&0<=t)for(n=this._first;n;){if(a=n._next,(n._act||i>=n._start)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(i-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(i-n._start)*n._ts,e,r),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=-U);break}}n=a}else{n=this._last;for(var w=t<0?t:i;n;){if(a=n._prev,(n._act||w<=n._end)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(w-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(w-n._start)*n._ts,e,r||L&&na(n)),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=w?-U:U);break}}n=a}}if(h&&!e&&(this.pause(),h.render(_<=i?0:-U)._zTime=_<=i?1:-1,this._ts))return this._start=f,Ia(this),this.render(t,e,r);this._onUpdate&&!e&&Pt(this,\"onUpdate\",!0),(v===m&&this._tTime>=this.totalDuration()||!v&&_)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||this._lock||(!t&&g||!(v===m&&0<this._ts||!v&&this._ts<0)||Aa(this,1),e||t<0&&!_||!v&&!_&&m||(Pt(this,v===m&&0<=t?\"onComplete\":\"onReverseComplete\",!0),!this._prom||v<m&&0<this.timeScale()||this._prom())))}return this},e.add=function add(e,i){var n=this;if(t(i)||(i=xt(this,i,e)),!(e instanceof Nt)){if($(e))return e.forEach(function(t){return n.add(t,i)}),this;if(r(e))return this.addLabel(e,i);if(!s(e))return this;e=Jt.delayedCall(0,e)}return this!==e?La(this,e,i):this},e.getChildren=function getChildren(t,e,r,i){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===i&&(i=-N);for(var n=[],a=this._first;a;)a._start>=i&&(a instanceof Jt?e&&n.push(a):(r&&n.push(a),t&&n.push.apply(n,a.getChildren(!0,e,r)))),a=a._next;return n},e.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},e.remove=function remove(t){return r(t)?this.removeLabel(t):s(t)?this.killTweensOf(t):(t.parent===this&&za(this,t),t===this._recent&&(this._recent=this._last),Ba(this))},e.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ja(Rt.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts))),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},e.addLabel=function addLabel(t,e){return this.labels[t]=xt(this,e),this},e.removeLabel=function removeLabel(t){return delete this.labels[t],this},e.addPause=function addPause(t,e,r){var i=Jt.delayedCall(0,e||T,r);return i.data=\"isPause\",this._hasPause=1,La(this,i,xt(this,t))},e.removePause=function removePause(t){var e=this._first;for(t=xt(this,t);e;)e._start===t&&\"isPause\"===e.data&&Aa(e),e=e._next},e.killTweensOf=function killTweensOf(t,e,r){for(var i=this.getTweensOf(t,r),n=i.length;n--;)Ut!==i[n]&&i[n].kill(t,e);return this},e.getTweensOf=function getTweensOf(e,r){for(var i,n=[],a=Ot(e),s=this._first,o=t(r);s;)s instanceof Jt?la(s._targets,a)&&(o?(!Ut||s._initted&&s._ts)&&s.globalTime(0)<=r&&s.globalTime(s.totalDuration())>r:!r||s.isActive())&&n.push(s):(i=s.getTweensOf(a,r)).length&&n.push.apply(n,i),s=s._next;return n},e.tweenTo=function tweenTo(t,e){e=e||{};var r,i=this,n=xt(i,t),a=e.startAt,s=e.onStart,o=e.onStartParams,u=e.immediateRender,h=Jt.to(i,ra({ease:e.ease||\"none\",lazy:!1,immediateRender:!1,time:n,overwrite:\"auto\",duration:e.duration||Math.abs((n-(a&&\"time\"in a?a.time:i._time))/i.timeScale())||U,onStart:function onStart(){if(i.pause(),!r){var t=e.duration||Math.abs((n-(a&&\"time\"in a?a.time:i._time))/i.timeScale());h._dur!==t&&Sa(h,t,0,1).render(h._time,!0,!0),r=1}s&&s.apply(h,o||[])}},e));return u?h.render(0):h},e.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,ra({startAt:{time:xt(this,t)}},r))},e.recent=function recent(){return this._recent},e.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),sb(this,xt(this,t))},e.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),sb(this,xt(this,t),1)},e.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+U)},e.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);for(var i,n=this._first,a=this.labels;n;)n._start>=r&&(n._start+=t,n._end+=t),n=n._next;if(e)for(i in a)a[i]>=r&&(a[i]+=t);return Ba(this)},e.invalidate=function invalidate(t){var e=this._first;for(this._lock=0;e;)e.invalidate(t),e=e._next;return i.prototype.invalidate.call(this,t)},e.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._dp&&(this._time=this._tTime=this._pTime=0),t&&(this.labels={}),Ba(this)},e.totalDuration=function totalDuration(t){var e,r,i,n=0,a=this,s=a._last,o=N;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-t:t));if(a._dirty){for(i=a.parent;s;)e=s._prev,s._dirty&&s.totalDuration(),o<(r=s._start)&&a._sort&&s._ts&&!a._lock?(a._lock=1,La(a,s,r-s._delay,1)._lock=0):o=r,r<0&&s._ts&&(n-=r,(!i&&!a._dp||i&&i.smoothChildTiming)&&(a._start+=r/a._ts,a._time-=r,a._tTime-=r),a.shiftChildren(-r,!1,-Infinity),o=0),s._end>n&&s._ts&&(n=s._end),s=e;Sa(a,a===I&&a._time>n?a._time:n,1,1),a._dirty=0}return a._tDur},Timeline.updateRoot=function updateRoot(t){if(I._ts&&(oa(I,Ha(t,I)),f=Rt.frame),Rt.frame>=mt){mt+=X.autoSleep||120;var e=I._first;if((!e||!e._ts)&&X.autoSleep&&Rt._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||Rt.sleep()}}},Timeline}(Nt);ra(Qt.prototype,{_lock:0,_hasPause:0,_forcing:0});function bc(t,e,i,n,a,o){var u,h,l,f;if(pt[t]&&!1!==(u=new pt[t]).init(a,u.rawVars?e[t]:function _processVars(t,e,i,n,a){if(s(t)&&(t=Gt(t,a,e,i,n)),!v(t)||t.style&&t.nodeType||$(t)||J(t))return r(t)?Gt(t,a,e,i,n):t;var o,u={};for(o in t)u[o]=Gt(t[o],a,e,i,n);return u}(e[t],n,a,o,i),i,n,o)&&(i._pt=h=new ge(i._pt,a,t,0,1,u.render,u,0,u.priority),i!==d))for(l=i._ptLookup[i._targets.indexOf(a)],f=u._props.length;f--;)l[u._props[f]]=h;return u}function hc(t,r,e,i){var n,a,s=r.ease||i||\"power1.inOut\";if($(r))a=e[t]||(e[t]=[]),r.forEach(function(t,e){return a.push({t:e/(r.length-1)*100,v:t,e:s})});else for(n in r)a=e[n]||(e[n]=[]),\"ease\"===n||a.push({t:parseFloat(t),v:r[n],e:s})}var Ut,qt,Vt=function _addPropTween(t,e,i,n,a,o,u,h,l,f){s(n)&&(n=n(a||0,t,o));var d,c=t[e],p=\"get\"!==i?i:s(c)?l?t[e.indexOf(\"set\")||!s(t[\"get\"+e.substr(3)])?e:\"get\"+e.substr(3)](l):t[e]():c,_=s(c)?l?re:te:$t;if(r(n)&&(~n.indexOf(\"random(\")&&(n=pb(n)),\"=\"===n.charAt(1)&&(!(d=ka(p,n)+(Za(p)||0))&&0!==d||(n=d))),!f||p!==n||qt)return isNaN(p*n)||\"\"===n?(c||e in t||Q(e,n),function _addComplexStringPropTween(t,e,r,i,n,a,s){var o,u,h,l,f,d,c,p,_=new ge(this._pt,t,e,0,1,oe,null,n),m=0,g=0;for(_.b=r,_.e=i,r+=\"\",(c=~(i+=\"\").indexOf(\"random(\"))&&(i=pb(i)),a&&(a(p=[r,i],t,e),r=p[0],i=p[1]),u=r.match(it)||[];o=it.exec(i);)l=o[0],f=i.substring(m,o.index),h?h=(h+1)%5:\"rgba(\"===f.substr(-5)&&(h=1),l!==u[g++]&&(d=parseFloat(u[g-1])||0,_._pt={_next:_._pt,p:f||1===g?f:\",\",s:d,c:\"=\"===l.charAt(1)?ka(d,l)-d:parseFloat(l)-d,m:h&&h<4?Math.round:0},m=it.lastIndex);return _.c=m<i.length?i.substring(m,i.length):\"\",_.fp=s,(nt.test(i)||c)&&(_.e=0),this._pt=_}.call(this,t,e,p,n,_,h||X.stringFilter,l)):(d=new ge(this._pt,t,e,+p||0,n-(p||0),\"boolean\"==typeof c?se:ne,0,_),l&&(d.fp=l),u&&d.modifier(u,this,t),this._pt=d)},Wt=function _initTween(t,e,r){var i,n,a,s,o,u,h,l,f,d,c,p,_,m=t.vars,g=m.ease,v=m.startAt,y=m.immediateRender,T=m.lazy,b=m.onUpdate,x=m.runBackwards,M=m.yoyoEase,k=m.keyframes,O=m.autoRevert,A=t._dur,P=t._startAt,C=t._targets,S=t.parent,D=S&&\"nested\"===S.data?S.vars.targets:C,z=\"auto\"===t._overwrite&&!F,E=t.timeline;if(!E||k&&g||(g=\"none\"),t._ease=Yt(g,Z.ease),t._yEase=M?jt(Yt(!0===M?g:M,Z.ease)):0,M&&t._yoyo&&!t._repeat&&(M=t._yEase,t._yEase=t._ease,t._ease=M),t._from=!E&&!!m.runBackwards,!E||k&&!m.stagger){if(p=(l=C[0]?fa(C[0]).harness:0)&&m[l.prop],i=va(m,ft),P&&(P._zTime<0&&P.progress(1),e<0&&x&&y&&!O?P.render(-1,!0):P.revert(x&&A?ht:ut),P._lazy=0),v){if(Aa(t._startAt=Jt.set(C,ra({data:\"isStart\",overwrite:!1,parent:S,immediateRender:!0,lazy:!P&&w(T),startAt:null,delay:0,onUpdate:b&&function(){return Pt(t,\"onUpdate\")},stagger:0},v))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(L||!y&&!O)&&t._startAt.revert(ht),y&&A&&e<=0&&r<=0)return void(e&&(t._zTime=e))}else if(x&&A&&!P)if(e&&(y=!1),a=ra({overwrite:!1,data:\"isFromStart\",lazy:y&&!P&&w(T),immediateRender:y,stagger:0,parent:S},i),p&&(a[l.prop]=p),Aa(t._startAt=Jt.set(C,a)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(L?t._startAt.revert(ht):t._startAt.render(-1,!0)),t._zTime=e,y){if(!e)return}else _initTween(t._startAt,U,U);for(t._pt=t._ptCache=0,T=A&&w(T)||T&&!A,n=0;n<C.length;n++){if(h=(o=C[n])._gsap||ea(C)[n]._gsap,t._ptLookup[n]=d={},ct[h.id]&&dt.length&&ma(),c=D===C?n:D.indexOf(o),l&&!1!==(f=new l).init(o,p||i,t,c,D)&&(t._pt=s=new ge(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){d[t]=s}),f.priority&&(u=1)),!l||p)for(a in i)pt[a]&&(f=bc(a,i,t,c,o,D))?f.priority&&(u=1):d[a]=s=Vt.call(t,o,a,\"get\",i[a],c,D,0,m.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),z&&t._pt&&(Ut=t,I.killTweensOf(o,d,t.globalTime(e)),_=!t.parent,Ut=0),t._pt&&T&&(ct[h.id]=1)}u&&_e(t),t._onInit&&t._onInit(t)}t._onUpdate=b,t._initted=(!t._op||t._pt)&&!_,k&&e<=0&&E.render(N,!0,!0)},Gt=function _parseFuncOrString(t,e,i,n,a){return s(t)?t.call(e,i,n,a):r(t)&&~t.indexOf(\"random(\")?pb(t):t},Ht=vt+\"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert\",Kt={};ha(Ht+\",id,stagger,delay,duration,paused,scrollTrigger\",function(t){return Kt[t]=1});var Jt=function(E){function Tween(e,r,i,n){var a;\"number\"==typeof r&&(i.duration=r,r=i,i=null);var s,o,u,h,l,f,d,c,p=(a=E.call(this,n?r:wa(r))||this).vars,_=p.duration,m=p.delay,g=p.immediateRender,T=p.stagger,b=p.overwrite,x=p.keyframes,M=p.defaults,k=p.scrollTrigger,O=p.yoyoEase,A=r.parent||I,P=($(e)||J(e)?t(e[0]):\"length\"in r)?[e]:Ot(e);if(a._targets=P.length?ea(P):R(\"GSAP target \"+e+\" not found. https://gsap.com\",!X.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=b,x||T||y(_)||y(m)){if(r=a.vars,(s=a.timeline=new Qt({data:\"nested\",defaults:M||{},targets:A&&\"nested\"===A.data?A.vars.targets:P})).kill(),s.parent=s._dp=_assertThisInitialized(a),s._start=0,T||y(_)||y(m)){if(h=P.length,d=T&&fb(T),v(T))for(l in T)~Ht.indexOf(l)&&((c=c||{})[l]=T[l]);for(o=0;o<h;o++)(u=va(r,Kt)).stagger=0,O&&(u.yoyoEase=O),c&&yt(u,c),f=P[o],u.duration=+Gt(_,_assertThisInitialized(a),o,f,P),u.delay=(+Gt(m,_assertThisInitialized(a),o,f,P)||0)-a._delay,!T&&1===h&&u.delay&&(a._delay=m=u.delay,a._start+=m,u.delay=0),s.to(f,u,d?d(o,f,P):0),s._ease=Lt.none;s.duration()?_=m=0:a.timeline=0}else if(x){wa(ra(s.vars.defaults,{ease:\"none\"})),s._ease=Yt(x.ease||r.ease||\"none\");var C,S,D,z=0;if($(x))x.forEach(function(t){return s.to(P,t,\">\")}),s.duration();else{for(l in u={},x)\"ease\"===l||\"easeEach\"===l||hc(l,x[l],u,x.easeEach);for(l in u)for(C=u[l].sort(function(t,e){return t.t-e.t}),o=z=0;o<C.length;o++)(D={ease:(S=C[o]).e,duration:(S.t-(o?C[o-1].t:0))/100*_})[l]=S.v,s.to(P,D,z),z+=D.duration;s.duration()<_&&s.to({},{duration:_-s.duration()})}}_||a.duration(_=s.duration())}else a.timeline=0;return!0!==b||F||(Ut=_assertThisInitialized(a),I.killTweensOf(P),Ut=0),La(A,_assertThisInitialized(a),i),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(g||!_&&!x&&a._start===ja(A._time)&&w(g)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(a))&&\"nested\"!==A.data)&&(a._tTime=-U,a.render(Math.max(0,-m)||0)),k&&Ma(_assertThisInitialized(a),k),a}_inheritsLoose(Tween,E);var e=Tween.prototype;return e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,d=this._time,c=this._tDur,p=this._dur,_=t<0,m=c-U<t&&!_?c:t<U?0:t;if(p){if(m!==this._tTime||!t||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!=_||this._lazy){if(i=m,l=this.timeline,this._repeat){if(s=p+this._rDelay,this._repeat<-1&&_)return this.totalTime(100*s+t,e,r);if(i=ja(m%s),m===c?(a=this._repeat,i=p):(a=~~(o=ja(m/s)))&&a===o?(i=p,a--):p<i&&(i=p),(u=this._yoyo&&1&a)&&(f=this._yEase,i=p-i),o=Tt(this._tTime,s),i===d&&!r&&this._initted&&a===o)return this._tTime=m,this;a!==o&&(l&&this._yEase&&Rb(l,u),this.vars.repeatRefresh&&!u&&!this._lock&&i!==s&&this._initted&&(this._lock=r=1,this.render(ja(s*a),!0).invalidate()._lock=0))}if(!this._initted){if(Na(this,_?t:i,r,e,m))return this._tTime=0,this;if(!(d===this._time||r&&this.vars.repeatRefresh&&a!==o))return this;if(p!==this._dur)return this.render(t,e,r)}if(this._tTime=m,this._time=i,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=h=(f||this._ease)(i/p),this._from&&(this.ratio=h=1-h),!d&&m&&!e&&!o&&(Pt(this,\"onStart\"),this._tTime!==m))return this;for(n=this._pt;n;)n.r(h,n.d),n=n._next;l&&l.render(t<0?t:l._dur*l._ease(i/this._dur),e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(_&&Da(this,t,0,r),Pt(this,\"onUpdate\")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&Pt(this,\"onRepeat\"),m!==this._tDur&&m||this._tTime!==m||(_&&!this._onUpdate&&Da(this,t,0,!0),!t&&p||!(m===this._tDur&&0<this._ts||!m&&this._ts<0)||Aa(this,1),e||_&&!d||!(m||d||u)||(Pt(this,m===c?\"onComplete\":\"onReverseComplete\",!0),!this._prom||m<c&&0<this.timeScale()||this._prom()))}}else!function _renderZeroDurationTween(t,e,r,i){var n,a,s,o=t.ratio,u=e<0||!e&&(!t._start&&function _parentPlayheadIsBeforeStart(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||_parentPlayheadIsBeforeStart(e))}(t)&&(t._initted||!bt(t))||(t._ts<0||t._dp._ts<0)&&!bt(t))?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&(l=Mt(0,t._tDur,e),a=Tt(l,h),t._yoyo&&1&a&&(u=1-u),a!==Tt(t._tTime,h)&&(o=1-u,t.vars.repeatRefresh&&t._initted&&t.invalidate())),u!==o||L||i||t._zTime===U||!e&&t._zTime){if(!t._initted&&Na(t,e,i,r,l))return;for(s=t._zTime,t._zTime=e||(r?U:0),r=r||e&&!s,t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,n=t._pt;n;)n.r(u,n.d),n=n._next;e<0&&Da(t,e,0,!0),t._onUpdate&&!r&&Pt(t,\"onUpdate\"),l&&t._repeat&&!r&&t.parent&&Pt(t,\"onRepeat\"),(e>=t._tDur||e<0)&&t.ratio===u&&(u&&Aa(t,1),r||L||(Pt(t,u?\"onComplete\":\"onReverseComplete\",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)}(this,t,e,r);return this},e.targets=function targets(){return this._targets},e.invalidate=function invalidate(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),E.prototype.invalidate.call(this,t)},e.resetTo=function resetTo(t,e,r,i,n){c||Rt.wake(),this._ts||this.play();var a,s=Math.min(this._dur,(this._dp._time-this._start)*this._ts);return this._initted||Wt(this,s),a=this._ease(s/this._dur),function _updatePropTweens(t,e,r,i,n,a,s,o){var u,h,l,f,d=(t._pt&&t._ptCache||(t._ptCache={}))[e];if(!d)for(d=t._ptCache[e]=[],l=t._ptLookup,f=t._targets.length;f--;){if((u=l[f][e])&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return qt=1,t.vars[e]=\"+=0\",Wt(t,s),qt=0,o?R(e+\" not eligible for reset\"):1;d.push(u)}for(f=d.length;f--;)(u=(h=d[f])._pt||h).s=!i&&0!==i||n?u.s+(i||0)+a*u.c:i,u.c=r-u.s,h.e&&(h.e=ia(r)+Za(h.e)),h.b&&(h.b=u.s+Za(h.b))}(this,t,e,r,i,a,s,n)?this.resetTo(t,e,r,i,1):(Ja(this,0),this.parent||ya(this._dp,this,\"_first\",\"_last\",this._dp._sort?\"_start\":0),this.render(0))},e.kill=function kill(t,e){if(void 0===e&&(e=\"all\"),!(t||e&&\"all\"!==e))return this._lazy=this._pt=0,this.parent?ub(this):this.scrollTrigger&&this.scrollTrigger.kill(!!L),this;if(this.timeline){var i=this.timeline.totalDuration();return this.timeline.killTweensOf(t,e,Ut&&!0!==Ut.vars.overwrite)._first||ub(this),this.parent&&i!==this.timeline.totalDuration()&&Sa(this,this._dur*this.timeline._tDur/i,0,1),this}var n,a,s,o,u,h,l,f=this._targets,d=t?Ot(t):f,c=this._ptLookup,p=this._pt;if((!e||\"all\"===e)&&function _arraysMatch(t,e){for(var r=t.length,i=r===e.length;i&&r--&&t[r]===e[r];);return r<0}(f,d))return\"all\"===e&&(this._pt=0),ub(this);for(n=this._op=this._op||[],\"all\"!==e&&(r(e)&&(u={},ha(e,function(t){return u[t]=1}),e=u),e=function _addAliasesToVars(t,e){var r,i,n,a,s=t[0]?fa(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(i in r=yt({},e),o)if(i in r)for(n=(a=o[i].split(\",\")).length;n--;)r[a[n]]=r[i];return r}(f,e)),l=f.length;l--;)if(~d.indexOf(f[l]))for(u in a=c[l],\"all\"===e?(n[l]=e,o=a,s={}):(s=n[l]=n[l]||{},o=e),o)(h=a&&a[u])&&(\"kill\"in h.d&&!0!==h.d.kill(u)||za(this,h,\"_pt\"),delete a[u]),\"all\"!==s&&(s[u]=1);return this._initted&&!this._pt&&p&&ub(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return Wa(1,arguments)},Tween.delayedCall=function delayedCall(t,e,r,i){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},Tween.fromTo=function fromTo(t,e,r){return Wa(2,arguments)},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return I.killTweensOf(t,e,r)},Tween}(Nt);ra(Jt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),ha(\"staggerTo,staggerFrom,staggerFromTo\",function(r){Jt[r]=function(){var t=new Qt,e=kt.call(arguments,0);return e.splice(\"staggerFromTo\"===r?5:4,0,0),t[r].apply(t,e)}});function pc(t,e,r){return t.setAttribute(e,r)}function xc(t,e,r,i){i.mSet(t,e,i.m.call(i.tween,r,i.mt),i)}var $t=function _setterPlain(t,e,r){return t[e]=r},te=function _setterFunc(t,e,r){return t[e](r)},re=function _setterFuncWithParam(t,e,r,i){return t[e](i.fp,r)},ie=function _getSetter(t,e){return s(t[e])?te:u(t[e])&&t.setAttribute?pc:$t},ne=function _renderPlain(t,e){return e.set(e.t,e.p,Math.round(1e6*(e.s+e.c*t))/1e6,e)},se=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},oe=function _renderComplexString(t,e){var r=e._pt,i=\"\";if(!t&&e.b)i=e.b;else if(1===t&&e.e)i=e.e;else{for(;r;)i=r.p+(r.m?r.m(r.s+r.c*t):Math.round(1e4*(r.s+r.c*t))/1e4)+i,r=r._next;i+=e.c}e.set(e.t,e.p,i,e)},ue=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},he=function _addPluginModifier(t,e,r,i){for(var n,a=this._pt;a;)n=a._next,a.p===i&&a.modifier(t,e,r),a=n},de=function _killPropTweensOf(t){for(var e,r,i=this._pt;i;)r=i._next,i.p===t&&!i.op||i.op===t?za(this,i,\"_pt\"):i.dep||(e=1),i=r;return!e},_e=function _sortPropTweensByPriority(t){for(var e,r,i,n,a=t._pt;a;){for(e=a._next,r=i;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:n)?a._prev._next=a:i=a,(a._next=r)?r._prev=a:n=a,a=e}t._pt=i},ge=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=xc,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,i,n,a,s,o,u){this.t=e,this.s=i,this.c=n,this.p=r,this.r=a||ne,this.d=s||this,this.set=o||$t,this.pr=u||0,(this._next=t)&&(t._prev=this)}ha(vt+\"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger\",function(t){return ft[t]=1}),ot.TweenMax=ot.TweenLite=Jt,ot.TimelineLite=ot.TimelineMax=Qt,I=new Qt({sortChildren:!1,defaults:Z,autoRemoveChildren:!0,id:\"root\",smoothChildTiming:!0}),X.stringFilter=Gb;function Fc(t){return(be[t]||Me).map(function(t){return t()})}function Gc(){var t=Date.now(),o=[];2<t-Oe&&(Fc(\"matchMediaInit\"),Te.forEach(function(t){var e,r,i,n,a=t.queries,s=t.conditions;for(r in a)(e=h.matchMedia(a[r]).matches)&&(i=1),e!==s[r]&&(s[r]=e,n=1);n&&(t.revert(),i&&o.push(t))}),Fc(\"matchMediaRevert\"),o.forEach(function(e){return e.onMatch(e,function(t){return e.add(null,t)})}),Oe=t,Fc(\"matchMedia\"))}var ve,Te=[],be={},Me=[],Oe=0,Ae=0,Pe=((ve=Context.prototype).add=function add(t,i,n){function Iw(){var t,e=l,r=a.selector;return e&&e!==a&&e.data.push(a),n&&(a.selector=db(n)),l=a,t=i.apply(a,arguments),s(t)&&a._r.push(t),l=e,a.selector=r,a.isReverted=!1,t}s(t)&&(n=i,i=t,t=s);var a=this;return a.last=Iw,t===s?Iw(a,function(t){return a.add(null,t)}):t?a[t]=Iw:Iw},ve.ignore=function ignore(t){var e=l;l=null,t(this),l=e},ve.getTweens=function getTweens(){var e=[];return this.data.forEach(function(t){return t instanceof Context?e.push.apply(e,t.getTweens()):t instanceof Jt&&!(t.parent&&\"nested\"===t.parent.data)&&e.push(t)}),e},ve.clear=function clear(){this._r.length=this.data.length=0},ve.kill=function kill(i,t){var n=this;if(i?function(){for(var t,e=n.getTweens(),r=n.data.length;r--;)\"isFlip\"===(t=n.data[r]).data&&(t.revert(),t.getChildren(!0,!0,!1).forEach(function(t){return e.splice(e.indexOf(t),1)}));for(e.map(function(t){return{g:t._dur||t._delay||t._sat&&!t._sat.vars.immediateRender?t.globalTime(0):-1/0,t:t}}).sort(function(t,e){return e.g-t.g||-1/0}).forEach(function(t){return t.t.revert(i)}),r=n.data.length;r--;)(t=n.data[r])instanceof Qt?\"nested\"!==t.data&&(t.scrollTrigger&&t.scrollTrigger.revert(),t.kill()):t instanceof Jt||!t.revert||t.revert(i);n._r.forEach(function(t){return t(i,n)}),n.isReverted=!0}():this.data.forEach(function(t){return t.kill&&t.kill()}),this.clear(),t)for(var e=Te.length;e--;)Te[e].id===this.id&&Te.splice(e,1)},ve.revert=function revert(t){this.kill(t||{})},Context);function Context(t,e){this.selector=e&&db(e),this.data=[],this._r=[],this.isReverted=!1,this.id=Ae++,t&&this.add(t)}var Ce,Se=((Ce=MatchMedia.prototype).add=function add(t,e,r){v(t)||(t={matches:t});var i,n,a,s=new Pe(0,r||this.scope),o=s.conditions={};for(n in l&&!s.selector&&(s.selector=l.selector),this.contexts.push(s),e=s.add(\"onMatch\",e),s.queries=t)\"all\"===n?a=1:(i=h.matchMedia(t[n]))&&(Te.indexOf(s)<0&&Te.push(s),(o[n]=i.matches)&&(a=1),i.addListener?i.addListener(Gc):i.addEventListener(\"change\",Gc));return a&&e(s,function(t){return s.add(null,t)}),this},Ce.revert=function revert(t){this.kill(t||{})},Ce.kill=function kill(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},MatchMedia);function MatchMedia(t){this.contexts=[],this.scope=t,l&&l.data.push(this)}var De={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return xb(t)})},timeline:function timeline(t){return new Qt(t)},getTweensOf:function getTweensOf(t,e){return I.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,n){r(i)&&(i=Ot(i)[0]);var a=fa(i||{}).get,s=e?qa:pa;return\"native\"===e&&(e=\"\"),i?t?s((pt[t]&&pt[t].get||a)(i,t,e,n)):function(t,e,r){return s((pt[t]&&pt[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,i){if(1<(r=Ot(r)).length){var n=r.map(function(t){return ze.quickSetter(t,e,i)}),a=n.length;return function(t){for(var e=a;e--;)n[e](t)}}r=r[0]||{};var s=pt[e],o=fa(r),u=o.harness&&(o.harness.aliases||{})[e]||e,h=s?function(t){var e=new s;d._pt=0,e.init(r,i?t+i:t,d,0,[r]),e.render(1,e),d._pt&&ue(1,d)}:o.set(r,u);return s?h:function(t){return h(r,u,i?t+i:t,o,1)}},quickTo:function quickTo(t,i,e){function ay(t,e,r){return n.resetTo(i,t,e,r)}var r,n=ze.to(t,ra(((r={})[i]=\"+=0.1\",r.paused=!0,r.stagger=0,r),e||{}));return ay.tween=n,ay},isTweening:function isTweening(t){return 0<I.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=Yt(t.ease,Z.ease)),ua(Z,t||{})},config:function config(t){return ua(X,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,r=t.extendTimeline;(e||\"\").split(\",\").forEach(function(t){return t&&!pt[t]&&!ot[t]&&R(i+\" effect requires \"+t+\" plugin.\")}),_t[i]=function(t,e,r){return n(Ot(t),ra(e||{},a),r)},r&&(Qt.prototype[i]=function(t,e,r){return this.add(_t[i](t,v(e)?e:(r=e)&&{},this),r)})},registerEase:function registerEase(t,e){Lt[t]=Yt(e)},parseEase:function parseEase(t,e){return arguments.length?Yt(t,e):Lt},getById:function getById(t){return I.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,i,n=new Qt(t);for(n.smoothChildTiming=w(t.smoothChildTiming),I.remove(n),n._dp=0,n._time=n._tTime=I._time,r=I._first;r;)i=r._next,!e&&!r._dur&&r instanceof Jt&&r.vars.onComplete===r._targets[0]||La(n,r,r._start-r._delay),r=i;return La(I,n,0),n},context:function context(t,e){return t?new Pe(t,e):l},matchMedia:function matchMedia(t){return new Se(t)},matchMediaRefresh:function matchMediaRefresh(){return Te.forEach(function(t){var e,r,i=t.conditions;for(r in i)i[r]&&(i[r]=!1,e=1);e&&t.revert()})||Gc()},addEventListener:function addEventListener(t,e){var r=be[t]||(be[t]=[]);~r.indexOf(e)||r.push(e)},removeEventListener:function removeEventListener(t,e){var r=be[t],i=r&&r.indexOf(e);0<=i&&r.splice(i,1)},utils:{wrap:function wrap(e,t,r){var i=t-e;return $(e)?mb(e,wrap(0,e.length),t):Xa(r,function(t){return(i+(t-e)%i)%i+e})},wrapYoyo:function wrapYoyo(e,t,r){var i=t-e,n=2*i;return $(e)?mb(e,wrapYoyo(0,e.length-1),t):Xa(r,function(t){return e+(i<(t=(n+(t-e)%n)%n||0)?n-t:t)})},distribute:fb,random:ib,snap:hb,normalize:function normalize(t,e,r){return At(t,e,0,1,r)},getUnit:Za,clamp:function clamp(e,r,t){return Xa(t,function(t){return Mt(e,r,t)})},splitColor:Bb,toArray:Ot,selector:db,mapRange:At,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||Za(t))}},interpolate:function interpolate(e,i,t,n){var a=isNaN(e+i)?0:function(t){return(1-t)*e+t*i};if(!a){var s,o,u,h,l,f=r(e),d={};if(!0===t&&(n=1)&&(t=null),f)e={p:e},i={p:i};else if($(e)&&!$(i)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=i}else n||(e=yt($(e)?[]:{},e));if(!u){for(s in i)Vt.call(d,e,s,\"get\",i[s]);a=function func(t){return ue(t,d)||(f?e.p:e)}}}return Xa(t,a)},shuffle:eb},install:P,effects:_t,ticker:Rt,updateRoot:Qt.updateRoot,plugins:pt,globalTimeline:I,core:{PropTween:ge,globals:S,Tween:Jt,Timeline:Qt,Animation:Nt,getCache:fa,_removeLinkedListItem:za,reverting:function reverting(){return L},context:function context(t){return t&&l&&(l.data.push(t),t._ctx=l),l},suppressOverwrites:function suppressOverwrites(t){return F=t}}};ha(\"to,from,fromTo,delayedCall,set,killTweensOf\",function(t){return De[t]=Jt[t]}),Rt.add(Qt.updateRoot),d=De.to({},{duration:0});function Kc(t,e){for(var r=t._pt;r&&r.p!==e&&r.op!==e&&r.fp!==e;)r=r._next;return r}function Mc(t,a){return{name:t,headless:1,rawVars:1,init:function init(t,n,e){e._onInit=function(t){var e,i;if(r(n)&&(e={},ha(n,function(t){return e[t]=1}),n=e),a){for(i in e={},n)e[i]=a(n[i]);n=e}!function _addModifiers(t,e){var r,i,n,a=t._targets;for(r in e)for(i=a.length;i--;)(n=(n=t._ptLookup[i][r])&&n.d)&&(n._pt&&(n=Kc(n,r)),n&&n.modifier&&n.modifier(e[r],t,a[i],r))}(t,n)}}}}var ze=De.registerPlugin({name:\"attr\",init:function init(t,e,r,i,n){var a,s,o;for(a in this.tween=r,e)o=t.getAttribute(a)||\"\",(s=this.add(t,\"setAttribute\",(o||0)+\"\",e[a],i,n,0,0,a)).op=a,s.b=o,this._props.push(a)},render:function render(t,e){for(var r=e._pt;r;)L?r.set(r.t,r.p,r.b,r):r.r(t,r.d),r=r._next}},{name:\"endArray\",headless:1,init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r]||0,e[r],0,0,0,0,0,1)}},Mc(\"roundProps\",gb),Mc(\"modifiers\"),Mc(\"snap\",hb))||De;Jt.version=Qt.version=ze.version=\"3.13.0\",o=1,x()&&Ft();function wd(t,e){return e.set(e.t,e.p,Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function xd(t,e){return e.set(e.t,e.p,1===t?e.e:Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function yd(t,e){return e.set(e.t,e.p,t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function zd(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function Ad(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function Bd(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function Cd(t,e,r){return t.style[e]=r}function Dd(t,e,r){return t.style.setProperty(e,r)}function Ed(t,e,r){return t._gsap[e]=r}function Fd(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Gd(t,e,r,i,n){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(n,a)}function Hd(t,e,r,i,n){var a=t._gsap;a[e]=r,a.renderTransform(n,a)}function Kd(t,e){var r=this,i=this.target,n=i.style,a=i._gsap;if(t in sr&&n){if(this.tfm=this.tfm||{},\"transform\"===t)return cr.transform.split(\",\").forEach(function(t){return Kd.call(r,t,e)});if(~(t=cr[t]||t).indexOf(\",\")?t.split(\",\").forEach(function(t){return r.tfm[t]=Tr(i,t)}):this.tfm[t]=a.x?a[t]:Tr(i,t),t===_r&&(this.tfm.zOrigin=a.zOrigin),0<=this.props.indexOf(pr))return;a.svg&&(this.svgo=i.getAttribute(\"data-svg-origin\"),this.props.push(_r,e,\"\")),t=pr}(n||e)&&this.props.push(t,e,n[t])}function Ld(t){t.translate&&(t.removeProperty(\"translate\"),t.removeProperty(\"scale\"),t.removeProperty(\"rotate\"))}function Md(){var t,e,r=this.props,i=this.target,n=i.style,a=i._gsap;for(t=0;t<r.length;t+=3)r[t+1]?2===r[t+1]?i[r[t]](r[t+2]):i[r[t]]=r[t+2]:r[t+2]?n[r[t]]=r[t+2]:n.removeProperty(\"--\"===r[t].substr(0,2)?r[t]:r[t].replace(lr,\"-$1\").toLowerCase());if(this.tfm){for(e in this.tfm)a[e]=this.tfm[e];a.svg&&(a.renderTransform(),i.setAttribute(\"data-svg-origin\",this.svgo||\"\")),(t=Ye())&&t.isStart||n[pr]||(Ld(n),a.zOrigin&&n[_r]&&(n[_r]+=\" \"+a.zOrigin+\"px\",a.zOrigin=0,a.renderTransform()),a.uncache=1)}}function Nd(t,e){var r={target:t,props:[],revert:Md,save:Kd};return t._gsap||ze.core.getCache(t),e&&t.style&&t.nodeType&&e.split(\",\").forEach(function(t){return r.save(t)}),r}function Pd(t,e){var r=Re.createElementNS?Re.createElementNS((e||\"http://www.w3.org/1999/xhtml\").replace(/^https/,\"http\"),t):Re.createElement(t);return r&&r.style?r:Re.createElement(t)}function Qd(t,e,r){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(lr,\"-$1\").toLowerCase())||i.getPropertyValue(e)||!r&&Qd(t,gr(e)||e,1)||\"\"}function Td(){(function _windowExists(){return\"undefined\"!=typeof window})()&&window.document&&(Ee=window,Re=Ee.document,Fe=Re.documentElement,Ie=Pd(\"div\")||{style:{}},Pd(\"div\"),pr=gr(pr),_r=pr+\"Origin\",Ie.style.cssText=\"border-width:0;line-height:0;position:absolute;padding:0\",Xe=!!gr(\"perspective\"),Ye=ze.core.reverting,Le=1)}function Ud(t){var e,r=t.ownerSVGElement,i=Pd(\"svg\",r&&r.getAttribute(\"xmlns\")||\"http://www.w3.org/2000/svg\"),n=t.cloneNode(!0);n.style.display=\"block\",i.appendChild(n),Fe.appendChild(i);try{e=n.getBBox()}catch(t){}return i.removeChild(n),Fe.removeChild(i),e}function Vd(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function Wd(e){var r,i;try{r=e.getBBox()}catch(t){r=Ud(e),i=1}return r&&(r.width||r.height)||i||(r=Ud(e)),!r||r.width||r.x||r.y?r:{x:+Vd(e,[\"x\",\"cx\",\"x1\"])||0,y:+Vd(e,[\"y\",\"cy\",\"y1\"])||0,width:0,height:0}}function Xd(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!Wd(t))}function Yd(t,e){if(e){var r,i=t.style;e in sr&&e!==_r&&(e=pr),i.removeProperty?(\"ms\"!==(r=e.substr(0,2))&&\"webkit\"!==e.substr(0,6)||(e=\"-\"+e),i.removeProperty(\"--\"===r?e:e.replace(lr,\"-$1\").toLowerCase())):i.removeAttribute(e)}}function Zd(t,e,r,i,n,a){var s=new ge(t._pt,e,r,0,1,a?Bd:Ad);return(t._pt=s).b=i,s.e=n,t._props.push(r),s}function ae(t,e,r,i){var n,a,s,o,u=parseFloat(r)||0,h=(r+\"\").trim().substr((u+\"\").length)||\"px\",l=Ie.style,f=fr.test(e),d=\"svg\"===t.tagName.toLowerCase(),c=(d?\"client\":\"offset\")+(f?\"Width\":\"Height\"),p=\"px\"===i,_=\"%\"===i;if(i===h||!u||vr[i]||vr[h])return u;if(\"px\"===h||p||(u=ae(t,e,r,\"px\")),o=t.getCTM&&Xd(t),(_||\"%\"===h)&&(sr[e]||~e.indexOf(\"adius\")))return n=o?t.getBBox()[f?\"width\":\"height\"]:t[c],ia(_?u/n*100:u/100*n);if(l[f?\"width\":\"height\"]=100+(p?h:i),a=\"rem\"!==i&&~e.indexOf(\"adius\")||\"em\"===i&&t.appendChild&&!d?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==Re&&a.appendChild||(a=Re.body),(s=a._gsap)&&_&&s.width&&f&&s.time===Rt.time&&!s.uncache)return ia(u/s.width*100);if(!_||\"height\"!==e&&\"width\"!==e)!_&&\"%\"!==h||yr[Qd(a,\"display\")]||(l.position=Qd(t,\"position\")),a===t&&(l.position=\"static\"),a.appendChild(Ie),n=Ie[c],a.removeChild(Ie),l.position=\"absolute\";else{var m=t.style[e];t.style[e]=100+i,n=t[c],m?t.style[e]=m:Yd(t,e)}return f&&_&&((s=fa(a)).time=Rt.time,s.width=a[c]),ia(p?n*u/100:n&&u?100/n*u:0)}function ce(t,e,r,i){if(!r||\"none\"===r){var n=gr(e,t,1),a=n&&Qd(t,n,1);a&&a!==r?(e=n,r=a):\"borderColor\"===e&&(r=Qd(t,\"borderTopColor\"))}var s,o,u,h,l,f,d,c,p,_,m,g=new ge(this._pt,t.style,e,0,1,oe),v=0,y=0;if(g.b=r,g.e=i,r+=\"\",\"var(--\"===(i+=\"\").substring(0,6)&&(i=Qd(t,i.substring(4,i.indexOf(\")\")))),\"auto\"===i&&(f=t.style[e],t.style[e]=i,i=Qd(t,e)||i,f?t.style[e]=f:Yd(t,e)),Gb(s=[r,i]),i=s[1],u=(r=s[0]).match(rt)||[],(i.match(rt)||[]).length){for(;o=rt.exec(i);)d=o[0],p=i.substring(v,o.index),l?l=(l+1)%5:\"rgba(\"!==p.substr(-5)&&\"hsla(\"!==p.substr(-5)||(l=1),d!==(f=u[y++]||\"\")&&(h=parseFloat(f)||0,m=f.substr((h+\"\").length),\"=\"===d.charAt(1)&&(d=ka(h,d)+m),c=parseFloat(d),_=d.substr((c+\"\").length),v=rt.lastIndex-_.length,_||(_=_||X.units[e]||m,v===i.length&&(i+=_,g.e+=_)),m!==_&&(h=ae(t,e,f,_)||0),g._pt={_next:g._pt,p:p||1===y?p:\",\",s:h,c:c-h,m:l&&l<4||\"zIndex\"===e?Math.round:0});g.c=v<i.length?i.substring(v,i.length):\"\"}else g.r=\"display\"===e&&\"none\"===i?Bd:Ad;return nt.test(i)&&(g.e=0),this._pt=g}function ee(t){var e=t.split(\" \"),r=e[0],i=e[1]||\"50%\";return\"top\"!==r&&\"bottom\"!==r&&\"left\"!==i&&\"right\"!==i||(t=r,r=i,i=t),e[0]=br[r]||r,e[1]=br[i]||i,e.join(\" \")}function fe(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,i,n,a=e.t,s=a.style,o=e.u,u=a._gsap;if(\"all\"===o||!0===o)s.cssText=\"\",i=1;else for(n=(o=o.split(\",\")).length;-1<--n;)r=o[n],sr[r]&&(i=1,r=\"transformOrigin\"===r?_r:pr),Yd(a,r);i&&(Yd(a,pr),u&&(u.svg&&a.removeAttribute(\"transform\"),s.scale=s.rotate=s.translate=\"none\",kr(a,1),u.uncache=1,Ld(s)))}}function je(t){return\"matrix(1, 0, 0, 1, 0, 0)\"===t||\"none\"===t||!t}function ke(t){var e=Qd(t,pr);return je(e)?xr:e.substr(7).match(et).map(ia)}function le(t,e){var r,i,n,a,s=t._gsap||fa(t),o=t.style,u=ke(t);return s.svg&&t.getAttribute(\"transform\")?\"1,0,0,1,0,0\"===(u=[(n=t.transform.baseVal.consolidate().matrix).a,n.b,n.c,n.d,n.e,n.f]).join(\",\")?xr:u:(u!==xr||t.offsetParent||t===Fe||s.svg||(n=o.display,o.display=\"block\",(r=t.parentNode)&&(t.offsetParent||t.getBoundingClientRect().width)||(a=1,i=t.nextElementSibling,Fe.appendChild(t)),u=ke(t),n?o.display=n:Yd(t,\"display\"),a&&(i?r.insertBefore(t,i):r?r.appendChild(t):Fe.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function me(t,e,r,i,n,a){var s,o,u,h=t._gsap,l=n||le(t,!0),f=h.xOrigin||0,d=h.yOrigin||0,c=h.xOffset||0,p=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],T=l[5],b=e.split(\" \"),w=parseFloat(b[0])||0,x=parseFloat(b[1])||0;r?l!==xr&&(o=_*v-m*g)&&(u=w*(-m/o)+x*(_/o)-(_*T-m*y)/o,w=w*(v/o)+x*(-g/o)+(g*T-v*y)/o,x=u):(w=(s=Wd(t)).x+(~b[0].indexOf(\"%\")?w/100*s.width:w),x=s.y+(~(b[1]||b[0]).indexOf(\"%\")?x/100*s.height:x)),i||!1!==i&&h.smooth?(y=w-f,T=x-d,h.xOffset=c+(y*_+T*g)-y,h.yOffset=p+(y*m+T*v)-T):h.xOffset=h.yOffset=0,h.xOrigin=w,h.yOrigin=x,h.smooth=!!i,h.origin=e,h.originIsAbsolute=!!r,t.style[_r]=\"0px 0px\",a&&(Zd(a,h,\"xOrigin\",f,w),Zd(a,h,\"yOrigin\",d,x),Zd(a,h,\"xOffset\",c,h.xOffset),Zd(a,h,\"yOffset\",p,h.yOffset)),t.setAttribute(\"data-svg-origin\",w+\" \"+x)}function pe(t,e,r){var i=Za(e);return ia(parseFloat(e)+parseFloat(ae(t,\"x\",r+\"px\",i)))+i}function we(t,e,i,n,a){var s,o,u=360,h=r(a),l=parseFloat(a)*(h&&~a.indexOf(\"rad\")?or:1)-n,f=n+l+\"deg\";return h&&(\"short\"===(s=a.split(\"_\")[1])&&(l%=u)!==l%180&&(l+=l<0?u:-u),\"cw\"===s&&l<0?l=(l+36e9)%u-~~(l/u)*u:\"ccw\"===s&&0<l&&(l=(l-36e9)%u-~~(l/u)*u)),t._pt=o=new ge(t._pt,e,i,n,l,xd),o.e=f,o.u=\"deg\",t._props.push(i),o}function xe(t,e){for(var r in e)t[r]=e[r];return t}function ye(t,e,r){var i,n,a,s,o,u,h,l=xe({},r._gsap),f=r.style;for(n in l.svg?(a=r.getAttribute(\"transform\"),r.setAttribute(\"transform\",\"\"),f[pr]=e,i=kr(r,1),Yd(r,pr),r.setAttribute(\"transform\",a)):(a=getComputedStyle(r)[pr],f[pr]=e,i=kr(r,1),f[pr]=a),sr)(a=l[n])!==(s=i[n])&&\"perspective,force3D,transformOrigin,svgOrigin\".indexOf(n)<0&&(o=Za(a)!==(h=Za(s))?ae(r,n,a,h):parseFloat(a),u=parseFloat(s),t._pt=new ge(t._pt,i,n,o,u-o,wd),t._pt.u=h||0,t._props.push(n));xe(i,l)}var Ee,Re,Fe,Le,Ie,Be,Ye,Xe,Ze=Lt.Power0,Ne=Lt.Power1,Qe=Lt.Power2,Ue=Lt.Power3,qe=Lt.Power4,Ve=Lt.Linear,We=Lt.Quad,Ge=Lt.Cubic,He=Lt.Quart,Ke=Lt.Quint,Je=Lt.Strong,$e=Lt.Elastic,tr=Lt.Back,er=Lt.SteppedEase,rr=Lt.Bounce,ir=Lt.Sine,nr=Lt.Expo,ar=Lt.Circ,sr={},or=180/Math.PI,ur=Math.PI/180,hr=Math.atan2,lr=/([A-Z])/g,fr=/(left|right|width|margin|padding|x)/i,dr=/[\\s,\\(]\\S/,cr={autoAlpha:\"opacity,visibility\",scale:\"scaleX,scaleY\",alpha:\"opacity\"},pr=\"transform\",_r=pr+\"Origin\",mr=\"O,Moz,ms,Ms,Webkit\".split(\",\"),gr=function _checkPropPrefix(t,e,r){var i=(e||Ie).style,n=5;if(t in i&&!r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(mr[n]+t in i););return n<0?null:(3===n?\"ms\":0<=n?mr[n]:\"\")+t},vr={deg:1,rad:1,turn:1},yr={grid:1,flex:1},Tr=function _get(t,e,r,i){var n;return Le||Td(),e in cr&&\"transform\"!==e&&~(e=cr[e]).indexOf(\",\")&&(e=e.split(\",\")[0]),sr[e]&&\"transform\"!==e?(n=kr(t,i),n=\"transformOrigin\"!==e?n[e]:n.svg?n.origin:Or(Qd(t,_r))+\" \"+n.zOrigin+\"px\"):(n=t.style[e])&&\"auto\"!==n&&!i&&!~(n+\"\").indexOf(\"calc(\")||(n=wr[e]&&wr[e](t,e,r)||Qd(t,e)||ga(t,e)||(\"opacity\"===e?1:0)),r&&!~(n+\"\").trim().indexOf(\" \")?ae(t,e,n,r)+r:n},br={top:\"0%\",bottom:\"100%\",left:\"0%\",right:\"100%\",center:\"50%\"},wr={clearProps:function clearProps(t,e,r,i,n){if(\"isFromStart\"!==n.data){var a=t._pt=new ge(t._pt,e,r,0,0,fe);return a.u=i,a.pr=-10,a.tween=n,t._props.push(r),1}}},xr=[1,0,0,1,0,0],Mr={},kr=function _parseTransform(t,e){var r=t._gsap||new Zt(t);if(\"x\"in r&&!e&&!r.uncache)return r;var i,n,a,s,o,u,h,l,f,d,c,p,_,m,g,v,y,T,b,w,x,M,k,O,A,P,C,S,D,z,E,R,F=t.style,L=r.scaleX<0,I=\"deg\",B=getComputedStyle(t),j=Qd(t,_r)||\"0\";return i=n=a=u=h=l=f=d=c=0,s=o=1,r.svg=!(!t.getCTM||!Xd(t)),B.translate&&(\"none\"===B.translate&&\"none\"===B.scale&&\"none\"===B.rotate||(F[pr]=(\"none\"!==B.translate?\"translate3d(\"+(B.translate+\" 0 0\").split(\" \").slice(0,3).join(\", \")+\") \":\"\")+(\"none\"!==B.rotate?\"rotate(\"+B.rotate+\") \":\"\")+(\"none\"!==B.scale?\"scale(\"+B.scale.split(\" \").join(\",\")+\") \":\"\")+(\"none\"!==B[pr]?B[pr]:\"\")),F.scale=F.rotate=F.translate=\"none\"),m=le(t,r.svg),r.svg&&(O=r.uncache?(A=t.getBBox(),j=r.xOrigin-A.x+\"px \"+(r.yOrigin-A.y)+\"px\",\"\"):!e&&t.getAttribute(\"data-svg-origin\"),me(t,O||j,!!O||r.originIsAbsolute,!1!==r.smooth,m)),p=r.xOrigin||0,_=r.yOrigin||0,m!==xr&&(T=m[0],b=m[1],w=m[2],x=m[3],i=M=m[4],n=k=m[5],6===m.length?(s=Math.sqrt(T*T+b*b),o=Math.sqrt(x*x+w*w),u=T||b?hr(b,T)*or:0,(f=w||x?hr(w,x)*or+u:0)&&(o*=Math.abs(Math.cos(f*ur))),r.svg&&(i-=p-(p*T+_*w),n-=_-(p*b+_*x))):(R=m[6],z=m[7],C=m[8],S=m[9],D=m[10],E=m[11],i=m[12],n=m[13],a=m[14],h=(g=hr(R,D))*or,g&&(O=M*(v=Math.cos(-g))+C*(y=Math.sin(-g)),A=k*v+S*y,P=R*v+D*y,C=M*-y+C*v,S=k*-y+S*v,D=R*-y+D*v,E=z*-y+E*v,M=O,k=A,R=P),l=(g=hr(-w,D))*or,g&&(v=Math.cos(-g),E=x*(y=Math.sin(-g))+E*v,T=O=T*v-C*y,b=A=b*v-S*y,w=P=w*v-D*y),u=(g=hr(b,T))*or,g&&(O=T*(v=Math.cos(g))+b*(y=Math.sin(g)),A=M*v+k*y,b=b*v-T*y,k=k*v-M*y,T=O,M=A),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=ia(Math.sqrt(T*T+b*b+w*w)),o=ia(Math.sqrt(k*k+R*R)),g=hr(M,k),f=2e-4<Math.abs(g)?g*or:0,c=E?1/(E<0?-E:E):0),r.svg&&(O=t.getAttribute(\"transform\"),r.forceCSS=t.setAttribute(\"transform\",\"\")||!je(Qd(t,pr)),O&&t.setAttribute(\"transform\",O))),90<Math.abs(f)&&Math.abs(f)<270&&(L?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),e=e||r.uncache,r.x=i-((r.xPercent=i&&(!e&&r.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-i)?-50:0)))?t.offsetWidth*r.xPercent/100:0)+\"px\",r.y=n-((r.yPercent=n&&(!e&&r.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-n)?-50:0)))?t.offsetHeight*r.yPercent/100:0)+\"px\",r.z=a+\"px\",r.scaleX=ia(s),r.scaleY=ia(o),r.rotation=ia(u)+I,r.rotationX=ia(h)+I,r.rotationY=ia(l)+I,r.skewX=f+I,r.skewY=d+I,r.transformPerspective=c+\"px\",(r.zOrigin=parseFloat(j.split(\" \")[2])||!e&&r.zOrigin||0)&&(F[_r]=Or(j)),r.xOffset=r.yOffset=0,r.force3D=X.force3D,r.renderTransform=r.svg?zr:Xe?Dr:Ar,r.uncache=0,r},Or=function _firstTwoOnly(t){return(t=t.split(\" \"))[0]+\" \"+t[1]},Ar=function _renderNon3DTransforms(t,e){e.z=\"0px\",e.rotationY=e.rotationX=\"0deg\",e.force3D=0,Dr(t,e)},Pr=\"0deg\",Cr=\"0px\",Sr=\") \",Dr=function _renderCSSTransforms(t,e){var r=e||this,i=r.xPercent,n=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,d=r.skewY,c=r.scaleX,p=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y=\"\",T=\"auto\"===m&&t&&1!==t||!0===m;if(v&&(l!==Pr||h!==Pr)){var b,w=parseFloat(h)*ur,x=Math.sin(w),M=Math.cos(w);w=parseFloat(l)*ur,b=Math.cos(w),a=pe(g,a,x*b*-v),s=pe(g,s,-Math.sin(w)*-v),o=pe(g,o,M*b*-v+v)}_!==Cr&&(y+=\"perspective(\"+_+Sr),(i||n)&&(y+=\"translate(\"+i+\"%, \"+n+\"%) \"),!T&&a===Cr&&s===Cr&&o===Cr||(y+=o!==Cr||T?\"translate3d(\"+a+\", \"+s+\", \"+o+\") \":\"translate(\"+a+\", \"+s+Sr),u!==Pr&&(y+=\"rotate(\"+u+Sr),h!==Pr&&(y+=\"rotateY(\"+h+Sr),l!==Pr&&(y+=\"rotateX(\"+l+Sr),f===Pr&&d===Pr||(y+=\"skew(\"+f+\", \"+d+Sr),1===c&&1===p||(y+=\"scale(\"+c+\", \"+p+Sr),g.style[pr]=y||\"translate(0, 0)\"},zr=function _renderSVGTransforms(t,e){var r,i,n,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,d=o.rotation,c=o.skewX,p=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,T=o.xOffset,b=o.yOffset,w=o.forceCSS,x=parseFloat(l),M=parseFloat(f);d=parseFloat(d),c=parseFloat(c),(p=parseFloat(p))&&(c+=p=parseFloat(p),d+=p),d||c?(d*=ur,c*=ur,r=Math.cos(d)*_,i=Math.sin(d)*_,n=Math.sin(d-c)*-m,a=Math.cos(d-c)*m,c&&(p*=ur,s=Math.tan(c-p),n*=s=Math.sqrt(1+s*s),a*=s,p&&(s=Math.tan(p),r*=s=Math.sqrt(1+s*s),i*=s)),r=ia(r),i=ia(i),n=ia(n),a=ia(a)):(r=_,a=m,i=n=0),(x&&!~(l+\"\").indexOf(\"px\")||M&&!~(f+\"\").indexOf(\"px\"))&&(x=ae(g,\"x\",l,\"px\"),M=ae(g,\"y\",f,\"px\")),(v||y||T||b)&&(x=ia(x+v-(v*r+y*n)+T),M=ia(M+y-(v*i+y*a)+b)),(u||h)&&(s=g.getBBox(),x=ia(x+u/100*s.width),M=ia(M+h/100*s.height)),s=\"matrix(\"+r+\",\"+i+\",\"+n+\",\"+a+\",\"+x+\",\"+M+\")\",g.setAttribute(\"transform\",s),w&&(g.style[pr]=s)};ha(\"padding,margin,Width,Radius\",function(e,r){var t=\"Right\",i=\"Bottom\",n=\"Left\",o=(r<3?[\"Top\",t,i,n]:[\"Top\"+n,\"Top\"+t,i+t,i+n]).map(function(t){return r<2?e+t:\"border\"+t+e});wr[1<r?\"border\"+e:e]=function(e,t,r,i,n){var a,s;if(arguments.length<4)return a=o.map(function(t){return Tr(e,t,r)}),5===(s=a.join(\" \")).split(a[0]).length?a[0]:s;a=(i+\"\").split(\" \"),s={},o.forEach(function(t,e){return s[t]=a[e]=a[e]||a[(e-1)/2|0]}),e.init(t,s,n)}});var Er,Rr,Fr,Lr={name:\"css\",register:Td,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,i,n,a){var s,o,u,h,l,f,d,c,p,_,m,g,v,y,T,b,w=this._props,x=t.style,M=i.vars.startAt;for(d in Le||Td(),this.styles=this.styles||Nd(t),b=this.styles.props,this.tween=i,e)if(\"autoRound\"!==d&&(o=e[d],!pt[d]||!bc(d,e,i,n,t,a)))if(l=typeof o,f=wr[d],\"function\"===l&&(l=typeof(o=o.call(i,n,t,a))),\"string\"===l&&~o.indexOf(\"random(\")&&(o=pb(o)),f)f(this,t,d,o,i)&&(T=1);else if(\"--\"===d.substr(0,2))s=(getComputedStyle(t).getPropertyValue(d)+\"\").trim(),o+=\"\",zt.lastIndex=0,zt.test(s)||(c=Za(s),p=Za(o)),p?c!==p&&(s=ae(t,d,s,p)+p):c&&(o+=c),this.add(x,\"setProperty\",s,o,n,a,0,0,d),w.push(d),b.push(d,0,x[d]);else if(\"undefined\"!==l){if(M&&d in M?(s=\"function\"==typeof M[d]?M[d].call(i,n,t,a):M[d],r(s)&&~s.indexOf(\"random(\")&&(s=pb(s)),Za(s+\"\")||\"auto\"===s||(s+=X.units[d]||Za(Tr(t,d))||\"\"),\"=\"===(s+\"\").charAt(1)&&(s=Tr(t,d))):s=Tr(t,d),h=parseFloat(s),(_=\"string\"===l&&\"=\"===o.charAt(1)&&o.substr(0,2))&&(o=o.substr(2)),u=parseFloat(o),d in cr&&(\"autoAlpha\"===d&&(1===h&&\"hidden\"===Tr(t,\"visibility\")&&u&&(h=0),b.push(\"visibility\",0,x.visibility),Zd(this,x,\"visibility\",h?\"inherit\":\"hidden\",u?\"inherit\":\"hidden\",!u)),\"scale\"!==d&&\"transform\"!==d&&~(d=cr[d]).indexOf(\",\")&&(d=d.split(\",\")[0])),m=d in sr)if(this.styles.save(d),\"string\"===l&&\"var(--\"===o.substring(0,6)&&(o=Qd(t,o.substring(4,o.indexOf(\")\"))),u=parseFloat(o)),g||((v=t._gsap).renderTransform&&!e.parseTransform||kr(t,e.parseTransform),y=!1!==e.smoothOrigin&&v.smooth,(g=this._pt=new ge(this._pt,x,pr,0,1,v.renderTransform,v,0,-1)).dep=1),\"scale\"===d)this._pt=new ge(this._pt,v,\"scaleY\",v.scaleY,(_?ka(v.scaleY,_+u):u)-v.scaleY||0,wd),this._pt.u=0,w.push(\"scaleY\",d),d+=\"X\";else{if(\"transformOrigin\"===d){b.push(_r,0,x[_r]),o=ee(o),v.svg?me(t,o,0,y,0,this):((p=parseFloat(o.split(\" \")[2])||0)!==v.zOrigin&&Zd(this,v,\"zOrigin\",v.zOrigin,p),Zd(this,x,d,Or(s),Or(o)));continue}if(\"svgOrigin\"===d){me(t,o,1,y,0,this);continue}if(d in Mr){we(this,v,d,h,_?ka(h,_+o):o);continue}if(\"smoothOrigin\"===d){Zd(this,v,\"smooth\",v.smooth,o);continue}if(\"force3D\"===d){v[d]=o;continue}if(\"transform\"===d){ye(this,o,t);continue}}else d in x||(d=gr(d)||d);if(m||(u||0===u)&&(h||0===h)&&!dr.test(o)&&d in x)u=u||0,(c=(s+\"\").substr((h+\"\").length))!==(p=Za(o)||(d in X.units?X.units[d]:c))&&(h=ae(t,d,s,p)),this._pt=new ge(this._pt,m?v:x,d,h,(_?ka(h,_+u):u)-h,m||\"px\"!==p&&\"zIndex\"!==d||!1===e.autoRound?wd:zd),this._pt.u=p||0,c!==p&&\"%\"!==p&&(this._pt.b=s,this._pt.r=yd);else if(d in x)ce.call(this,t,d,s,_?_+o:o);else if(d in t)this.add(t,d,s||t[d],_?_+o:o,n,a);else if(\"parseTransform\"!==d){Q(d,o);continue}m||(d in x?b.push(d,0,x[d]):\"function\"==typeof t[d]?b.push(d,2,t[d]()):b.push(d,1,s||t[d])),w.push(d)}T&&_e(this)},render:function render(t,e){if(e.tween._time||!Ye())for(var r=e._pt;r;)r.r(t,r.d),r=r._next;else e.styles.revert()},get:Tr,aliases:cr,getSetter:function getSetter(t,e,r){var i=cr[e];return i&&i.indexOf(\",\")<0&&(e=i),e in sr&&e!==_r&&(t._gsap.x||Tr(t,\"x\"))?r&&Be===r?\"scale\"===e?Fd:Ed:(Be=r||{})&&(\"scale\"===e?Gd:Hd):t.style&&!u(t.style[e])?Cd:~e.indexOf(\"-\")?Dd:ie(t,e)},core:{_removeProperty:Yd,_getMatrix:le}};ze.utils.checkPrefix=gr,ze.core.getStyleSaver=Nd,Fr=ha((Er=\"x,y,z,scale,scaleX,scaleY,xPercent,yPercent\")+\",\"+(Rr=\"rotation,rotationX,rotationY,skewX,skewY\")+\",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective\",function(t){sr[t]=1}),ha(Rr,function(t){X.units[t]=\"deg\",Mr[t]=1}),cr[Fr[13]]=Er+\",\"+Rr,ha(\"0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY\",function(t){var e=t.split(\":\");cr[e[1]]=Fr[e[0]]}),ha(\"x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective\",function(t){X.units[t]=\"px\"}),ze.registerPlugin(Lr);var Ir=ze.registerPlugin(Lr)||ze,Br=Ir.core.Tween;e.Back=tr,e.Bounce=rr,e.CSSPlugin=Lr,e.Circ=ar,e.Cubic=Ge,e.Elastic=$e,e.Expo=nr,e.Linear=Ve,e.Power0=Ze,e.Power1=Ne,e.Power2=Qe,e.Power3=Ue,e.Power4=qe,e.Quad=We,e.Quart=He,e.Quint=Ke,e.Sine=ir,e.SteppedEase=er,e.Strong=Je,e.TimelineLite=Qt,e.TimelineMax=Qt,e.TweenLite=Jt,e.TweenMax=Br,e.default=Ir,e.gsap=Ir;if (typeof(window)===\"undefined\"||window!==e){Object.defineProperty(e,\"__esModule\",{value:!0})} else {delete e.default}});\n\n<\/script>\n<script type=\"module\">/* ============================================================\n   HAPPY BIRTHDAY — a birthday film in four acts\n   Vanilla canvas 2D for the tree + GSAP for the orchestration.\n\n   ACT 1  a real recurve bow with a Cupid's arrow nocked — you\n          DRAW the string down and RELEASE to fire (pointer drag,\n          or keyboard). A softly beating heart waits above as the\n          target.\n   ACT 2  the arrow flies up and strikes the heart; the heart\n          jolts, falls, and bursts into a flood of rose that\n          swallows the frame (no cross-fade).\n   ACT 3  a kinetic wish hinges up out of that colour, glyph by\n          glyph, under cinema bars and a slow camera push.\n   ACT 4  a gold light blooms, and the tree grows into one heart\n          of lit blossoms with the hand-lettered wish.\n\n   A GSAP master timeline runs the shot + Acts 2–3; at its end it\n   starts the canvas tree (Act 4), which owns its own rAF and\n   plays once, then holds — living, never looping.\n   ============================================================ */\n\n\n\n/* the pen-stroke plugin: a `drawn` 0..1 property for the underline */\ngsap.registerPlugin({\n  name: 'drawn',\n  init(target, value) {\n    const len = target.getTotalLength();\n    target.style.strokeDasharray = len;\n    this.target = target; this.len = len; this.value = value;\n  },\n  render(ratio, data) {\n    data.target.style.strokeDashoffset = data.len * (1 - data.value * ratio);\n  },\n});\n\nconst $ = (id) => document.getElementById(id);\n\nconst canvas = $('tree');\nconst ctx    = canvas.getContext('2d');\nconst wishEl = $('wish');\n\nconst hero       = $('hero');\nconst eyebrow    = $('eyebrow');\nconst hint       = $('hint');\nconst motes      = $('motes');\nconst target     = $('target');\nconst targetHeart= $('targetHeart');\nconst heartGlow  = target.querySelector('.heart__glow');\nconst aim        = $('aim');\n\nconst archery = $('archery');\nconst bow     = $('bow');\nconst arrow   = $('arrow');\nconst strL    = $('strL');\nconst strR    = $('strR');\nconst serving = $('serving');\n\nconst flood   = $('flood');\nconst field   = $('field');\nconst camera  = $('camera');\nconst fgrid   = $('fgrid');\nconst kEyebrow= $('kEyebrow');\nconst kSub    = $('kSub');\nconst barTop  = $('barTop');\nconst barBot  = $('barBot');\nconst uline   = $('uline').querySelector('.uline__path');\nconst bloom   = $('bloom');\nconst replay  = $('replay');\n\nconst reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\nconst isRecord     = new URLSearchParams(location.search).has('record');\n\n/* --- cue log for the recorder: the page stays muted, but it timestamps every\n   beat the film crosses, and the offline sound synth fires foley at those exact\n   times so the audio can never drift from the picture. --- */\nif (isRecord) window.bdayCues = [];\nlet recT0 = 0;\nfunction cue(name){ if (isRecord && recT0) window.bdayCues.push({ cue: name, t: (performance.now() - recT0) / 1000 }); }\n\n/* ============================================================\n   MATH HELPERS\n   ============================================================ */\nconst rand  = (a, b) => a + Math.random() * (b - a);\nconst pick  = (a)    => a[(Math.random() * a.length) | 0];\nconst clamp = (v, a, b) => (v < a ? a : v > b ? b : v);\nconst clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);\nconst lerp  = (a, b, t) => a + (b - a) * t;\nconst easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);\nconst easeOutBack  = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };\n\nfunction shade(hex, amt){\n  const n = parseInt(hex.slice(1), 16);\n  const r = clamp((n >> 16) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);\n  return `rgb(${r | 0},${g | 0},${b | 0})`;\n}\n\n/* ============================================================\n   TREE ENGINE (Act 4) — canvas\n   ============================================================ */\nconst BLOSSOM = [\n  { c0: '#ffe1ec', c1: '#ff80aa' },\n  { c0: '#ffd0e0', c1: '#f4577f' },\n  { c0: '#ffc4d2', c1: '#e23b67' },\n  { c0: '#ffd9c4', c1: '#ff8a5b' },\n  { c0: '#ffeec2', c1: '#f6b13e' },\n  { c0: '#ffd2e6', c1: '#e84d9a' },\n];\n\n/* timeline (seconds, relative to the tree's own start) — brisk */\nconst T = {\n  trunkStart: 0.10,\n  branchSpan: 1.80,\n  bloomT0:    1.25,\n  bloomSpan:  2.00,\n  petalT0:    2.45,\n  noteStart:  0.45,\n  done:       4.60,\n};\n\nconst SS = 168;\n\nfunction heartShape(c, x, top, w, h){\n  c.beginPath();\n  c.moveTo(x, top + h * 0.28);\n  c.bezierCurveTo(x, top, x - w * 0.5, top, x - w * 0.5, top + h * 0.28);\n  c.bezierCurveTo(x - w * 0.5, top + h * 0.60, x - w * 0.16, top + h * 0.80, x, top + h);\n  c.bezierCurveTo(x + w * 0.16, top + h * 0.80, x + w * 0.5, top + h * 0.60, x + w * 0.5, top + h * 0.28);\n  c.bezierCurveTo(x + w * 0.5, top, x, top, x, top + h * 0.28);\n  c.closePath();\n}\n\nfunction makeBlossom({ c0, c1 }, soft){\n  const cv = document.createElement('canvas'); cv.width = cv.height = SS;\n  const c = cv.getContext('2d');\n  const w = SS * 0.62, h = SS * 0.58, x = SS / 2, top = SS * 0.17;\n\n  c.save();\n  c.shadowColor = 'rgba(150,38,72,0.32)';\n  c.shadowBlur = SS * 0.085; c.shadowOffsetY = SS * 0.05;\n  c.fillStyle = c1; heartShape(c, x, top, w, h); c.fill();\n  c.restore();\n\n  const g = c.createRadialGradient(x - w * 0.20, top + h * 0.20, h * 0.04, x, top + h * 0.42, h * 0.92);\n  g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, shade(c1, -26));\n  heartShape(c, x, top, w, h); c.fillStyle = g; c.fill();\n\n  c.save(); heartShape(c, x, top, w, h); c.clip();\n  const g2 = c.createLinearGradient(0, top, 0, top + h);\n  g2.addColorStop(0, 'rgba(255,255,255,0)');\n  g2.addColorStop(0.65, 'rgba(110,16,46,0)');\n  g2.addColorStop(1, 'rgba(110,16,46,0.26)');\n  c.fillStyle = g2; c.fillRect(0, 0, SS, SS);\n  c.globalAlpha = 0.55; c.fillStyle = '#ffffff';\n  c.beginPath(); c.ellipse(x - w * 0.15, top + h * 0.24, w * 0.17, h * 0.11, -0.5, 0, Math.PI * 2); c.fill();\n  c.restore();\n\n  if (!soft) return cv;\n\n  const cv2 = document.createElement('canvas'); cv2.width = cv2.height = SS;\n  const c2 = cv2.getContext('2d');\n  c2.filter = 'blur(2.6px)'; c2.drawImage(cv, 0, 0); c2.filter = 'none';\n  c2.globalCompositeOperation = 'source-atop';\n  c2.globalAlpha = 0.42; c2.fillStyle = '#fff3ea'; c2.fillRect(0, 0, SS, SS);\n  return cv2;\n}\n\nfunction makeBokeh(rgb){\n  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;\n  const c = cv.getContext('2d');\n  const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);\n  g.addColorStop(0, `rgba(${rgb},0.9)`); g.addColorStop(0.45, `rgba(${rgb},0.22)`); g.addColorStop(1, `rgba(${rgb},0)`);\n  c.fillStyle = g; c.fillRect(0, 0, S, S);\n  return cv;\n}\n\nfunction makeSparkle(){\n  const S = 64, cv = document.createElement('canvas'); cv.width = cv.height = S;\n  const c = cv.getContext('2d'); const m = S / 2;\n  const g = c.createRadialGradient(m, m, 0, m, m, m);\n  g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.25, 'rgba(255,236,200,0.5)'); g.addColorStop(1, 'rgba(255,236,200,0)');\n  c.fillStyle = g; c.beginPath(); c.arc(m, m, m, 0, 6.2832); c.fill();\n  c.fillStyle = 'rgba(255,255,255,0.95)';\n  c.translate(m, m);\n  for (let k = 0; k < 2; k++){\n    c.beginPath();\n    c.moveTo(0, -m); c.quadraticCurveTo(0, 0, m, 0); c.quadraticCurveTo(0, 0, 0, m); c.quadraticCurveTo(0, 0, -m, 0); c.quadraticCurveTo(0, 0, 0, -m);\n    c.fill(); c.rotate(Math.PI / 4); c.scale(0.5, 0.5);\n  }\n  return cv;\n}\n\nlet SPR = { crisp: [], soft: [] }, BOKEH = [], SPARKLE = null;\nfunction buildSprites(){\n  SPR = { crisp: BLOSSOM.map((b) => makeBlossom(b, false)), soft: BLOSSOM.map((b) => makeBlossom(b, true)) };\n  BOKEH = [makeBokeh('255,224,188'), makeBokeh('255,196,214'), makeBokeh('255,238,210')];\n  SPARKLE = makeSparkle();\n}\n\nfunction drawSprite(sprite, x, y, size, rot, alpha){\n  ctx.save();\n  ctx.translate(x, y);\n  if (rot) ctx.rotate(rot);\n  ctx.globalAlpha = alpha;\n  ctx.drawImage(sprite, -size * 0.5, -size * 0.47, size, size);\n  ctx.restore();\n}\n\nlet heartPoly = null;\nfunction buildHeartPoly(){\n  const raw = []; let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;\n  for (let i = 0; i <= 160; i++){\n    const t = (i / 160) * Math.PI * 2;\n    const x = 16 * Math.pow(Math.sin(t), 3);\n    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);\n    raw.push([x, y]);\n    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;\n  }\n  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2, hw = (maxX - minX) / 2, hh = (maxY - minY) / 2;\n  heartPoly = raw.map(([x, y]) => [(x - midX) / hw, (y - midY) / hh]);\n}\nfunction pointInPoly(x, y){\n  let inside = false; const p = heartPoly;\n  for (let i = 0, j = p.length - 1; i < p.length; j = i++){\n    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];\n    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside;\n  }\n  return inside;\n}\n\nlet W = 0, H = 0, dpr = 1;\nlet cx = 0, cy = 0, rx = 0, ry = 0, groundY = 0;\nlet branches = [], hearts = [], petals = [], rested = [], orbs = [], floaters = [], twinkles = [];\nlet bgGrad = null, glowGrad = null, groundGrad = null;\n\nconst quad = (b, t) => { const m = 1 - t, a = m * m, k = 2 * m * t, d = t * t; return { x: a * b.x1 + k * b.cx + d * b.x2, y: a * b.y1 + k * b.cy + d * b.y2 }; };\n\nfunction barkGrad(x1, y1, x2, y2, depth){\n  const g = ctx.createLinearGradient(x1, y1, x2, y2);\n  g.addColorStop(0, `hsl(348 26% ${26 + depth * 3}%)`);\n  g.addColorStop(1, `hsl(346 24% ${40 + depth * 5}%)`);\n  return g;\n}\n\nfunction buildScene(){\n  branches = []; hearts = []; petals = []; rested = []; twinkles = []; orbs = []; floaters = [];\n  buildHeartPoly();\n\n  const wide = W / H > 1.2;\n  cx = W * (wide ? 0.57 : 0.5);\n  cy = H * (wide ? 0.37 : 0.38);\n  ry = Math.min(H * (wide ? 0.33 : 0.33), W * 0.34);\n  rx = ry * 1.16;\n  groundY = H * 0.93;\n\n  bgGrad = ctx.createLinearGradient(0, 0, 0, H);\n  bgGrad.addColorStop(0, '#fff3e9');\n  bgGrad.addColorStop(0.46, '#ffe7d6');\n  bgGrad.addColorStop(0.78, '#fcd9c4');\n  bgGrad.addColorStop(1, '#f3c4b5');\n  glowGrad = ctx.createRadialGradient(cx, cy, ry * 0.1, cx, cy, ry * 1.55);\n  glowGrad.addColorStop(0, 'rgba(255,219,170,0.6)');\n  glowGrad.addColorStop(0.5, 'rgba(255,170,150,0.2)');\n  glowGrad.addColorStop(1, 'rgba(255,170,150,0)');\n  groundGrad = ctx.createRadialGradient(cx, H * 1.02, ry * 0.2, cx, H * 1.02, ry * 1.6);\n  groundGrad.addColorStop(0, 'rgba(255,205,165,0.5)');\n  groundGrad.addColorStop(1, 'rgba(255,205,165,0)');\n\n  for (let i = 0; i < 11; i++){\n    orbs.push({ x: rand(0, W), y: rand(0, H), r: rand(W * 0.05, W * 0.17), vy: rand(-6, -16), drift: rand(-0.3, 0.3), phase: rand(0, 6.28), alpha: rand(0.05, 0.13), sprite: pick(BOKEH) });\n  }\n\n  const FN = wide ? 18 : 15;\n  for (let i = 0; i < FN; i++){\n    const depth = Math.random();\n    floaters.push({\n      x: rand(0, W), y: rand(-H * 0.1, H * 1.1), depth,\n      idx: (Math.random() * BLOSSOM.length) | 0,\n      box: lerp(Math.min(W, H) * 0.025, Math.min(W, H) * 0.075, depth),\n      vy: lerp(7, 20, depth), sway: rand(8, 22), phase: rand(0, 6.28),\n      rot: rand(-0.4, 0.4), vrot: rand(-0.5, 0.5),\n      baseA: lerp(0.16, 0.5, depth), soft: depth < 0.45,\n    });\n  }\n\n  const baseX = cx, baseY = H * 1.0;\n  const trunkTopY = cy + ry * 0.62;\n  const trunkW = Math.max(9, W * 0.024);\n  const limbLen = ry * 0.6;\n  const insidePx = (x, y, m = 0.9) => pointInPoly((x - cx) / (rx * m), (cy - y) / (ry * m));\n\n  function addBranch(x, y, ang, len, w0, depth, t0){\n    let ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, clipped = false;\n    if (!insidePx(ex, ey)){\n      let lo = 0, hi = 1;\n      for (let k = 0; k < 12; k++){ const mid = (lo + hi) / 2; (insidePx(x + Math.cos(ang) * len * mid, y + Math.sin(ang) * len * mid) ? lo = mid : hi = mid); }\n      ex = x + Math.cos(ang) * len * lo; ey = y + Math.sin(ang) * len * lo; clipped = true;\n    }\n    const mx = (x + ex) / 2, my = (y + ey) / 2, perp = ang + Math.PI / 2, bend = rand(-1, 1) * len * 0.12, w1 = w0 * 0.66;\n    branches.push({ x1: x, y1: y, cx: mx + Math.cos(perp) * bend, cy: my + Math.sin(perp) * bend, x2: ex, y2: ey, w0, w1, t0, dur: Math.max(0.14, 0.32 - depth * 0.03), depth, grad: barkGrad(x, y, ex, ey, depth) });\n    return { ex, ey, w1, clipped };\n  }\n  function grow(x, y, ang, len, w, depth, t0){\n    const r = addBranch(x, y, ang, len, w, depth, t0);\n    if (r.clipped || depth >= 6 || len < ry * 0.06) return;\n    const childT0 = t0 + (0.32 - depth * 0.03) * 0.6;\n    const n = Math.random() < 0.55 ? 2 : 3;\n    for (let i = 0; i < n; i++){\n      const spread = 0.6 * (i - (n - 1) / 2) + rand(-0.22, 0.22), lift = -0.06 + rand(-0.05, 0.05);\n      grow(r.ex, r.ey, ang + spread + lift, len * rand(0.74, 0.84), r.w1, depth + 1, childT0 + i * 0.03);\n    }\n  }\n  addBranch(baseX, baseY, -Math.PI / 2, baseY - trunkTopY, trunkW, 0, T.trunkStart);\n  branches[0].dur = 0.55;\n  const limbT0 = T.trunkStart + 0.36, L = 3;\n  for (let i = 0; i < L; i++){\n    const ang = -Math.PI / 2 + 0.62 * (i - (L - 1) / 2) + rand(-0.12, 0.12);\n    grow(baseX, trunkTopY, ang, limbLen, trunkW * 0.7, 1, limbT0 + i * 0.05);\n  }\n  const maxT0 = branches.reduce((m, b) => Math.max(m, b.t0 + b.dur), 0);\n  const sc = (T.branchSpan - T.trunkStart) / (maxT0 - T.trunkStart);\n  for (const b of branches) b.t0 = T.trunkStart + (b.t0 - T.trunkStart) * sc;\n\n  const COUNT = Math.round(clamp(rx * ry / 56, 250, 440));\n  const baseBox = clamp(Math.min(W, H) * 0.115, 30, 74);\n  let guard = 0;\n  while (hearts.length < COUNT && guard < COUNT * 50){\n    guard++;\n    const u = rand(-1.06, 1.06), v = rand(-1.06, 1.06);\n    if (!pointInPoly(u, v)) continue;\n    const x = cx + u * rx, y = cy - v * ry;\n    const d = clamp01(Math.hypot(u, v + 1) / 2.4);\n    const t0 = T.bloomT0 + d * (T.bloomSpan * 0.82) + rand(0, T.bloomSpan * 0.18);\n    const soft = Math.random() < 0.42;\n    hearts.push({ x, y, idx: (Math.random() * BLOSSOM.length) | 0, soft, box: baseBox * (soft ? rand(0.6, 0.85) : rand(0.78, 1.12)), rot: rand(-0.55, 0.55), sway: rand(0, 6.28), t0 });\n  }\n  hearts.sort((a, b) => (a.soft === b.soft ? a.y - b.y : a.soft ? -1 : 1));\n}\n\nfunction drawBackground(){\n  ctx.globalAlpha = 1;\n  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);\n  ctx.save(); ctx.globalCompositeOperation = 'lighter';\n  ctx.globalAlpha = 1; ctx.fillStyle = groundGrad; ctx.fillRect(0, 0, W, H);\n  ctx.restore();\n}\n\nfunction drawGodRays(t, intensity){\n  if (intensity <= 0) return;\n  ctx.save();\n  ctx.globalCompositeOperation = 'lighter';\n  const ox = cx, oy = cy - ry * 0.35, R = Math.hypot(W, H) * 1.1;\n  const rays = 9, sweep = Math.sin(t * 0.07) * 0.18;\n  for (let i = 0; i < rays; i++){\n    const a = -Math.PI / 2 + sweep + (i - (rays - 1) / 2) * 0.2;\n    const hw = 0.035 + 0.02 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 1.7));\n    const a1 = a - hw, a2 = a + hw;\n    const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(a) * R, oy + Math.sin(a) * R);\n    g.addColorStop(0, `rgba(255,232,190,${0.10 * intensity})`);\n    g.addColorStop(0.5, `rgba(255,214,170,${0.05 * intensity})`);\n    g.addColorStop(1, 'rgba(255,214,170,0)');\n    ctx.fillStyle = g;\n    ctx.beginPath();\n    ctx.moveTo(ox, oy);\n    ctx.lineTo(ox + Math.cos(a1) * R, oy + Math.sin(a1) * R);\n    ctx.lineTo(ox + Math.cos(a2) * R, oy + Math.sin(a2) * R);\n    ctx.closePath(); ctx.fill();\n  }\n  ctx.restore();\n}\n\nfunction drawGlow(t){\n  const gi = clamp01((t - T.bloomT0) / (T.bloomSpan * 0.9));\n  if (gi <= 0) return;\n  ctx.save(); ctx.globalAlpha = gi; ctx.globalCompositeOperation = 'lighter';\n  ctx.fillStyle = glowGrad; ctx.fillRect(0, 0, W, H);\n  ctx.restore();\n}\n\nfunction drawBokeh(t, dt){\n  ctx.save(); ctx.globalCompositeOperation = 'lighter';\n  for (const o of orbs){\n    o.y += o.vy * dt; o.x += Math.sin(t * 0.3 + o.phase) * o.drift;\n    if (o.y < -o.r){ o.y = H + o.r; o.x = rand(0, W); }\n    ctx.globalAlpha = o.alpha;\n    ctx.drawImage(o.sprite, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);\n  }\n  ctx.restore();\n}\n\nfunction drawFloaters(t, dt, front){\n  const appear = clamp01((t - 0.2) / 1.4);\n  if (appear <= 0) return;\n  for (const f of floaters){\n    if ((f.depth >= 0.6) !== front) continue;\n    f.y -= f.vy * dt;\n    f.x += Math.sin(t * 0.5 + f.phase) * f.sway * dt;\n    f.rot += f.vrot * dt;\n    if (f.y < -f.box){ f.y = H + f.box; f.x = rand(0, W); }\n    drawSprite((f.soft ? SPR.soft : SPR.crisp)[f.idx], f.x, f.y, f.box, f.rot, f.baseA * appear);\n  }\n}\n\nfunction drawBranches(t){\n  ctx.lineCap = 'round'; ctx.lineJoin = 'round';\n  for (const b of branches){\n    const f = clamp01((t - b.t0) / b.dur);\n    if (f <= 0) continue;\n    const e = easeOutCubic(f);\n    ctx.strokeStyle = b.grad;\n    const steps = 12, last = Math.max(1, Math.ceil(steps * e));\n    let prev = quad(b, 0);\n    for (let i = 1; i <= last; i++){\n      const tt = Math.min(e, i / steps), p = quad(b, tt);\n      ctx.lineWidth = lerp(b.w0, b.w1, tt);\n      ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();\n      prev = p;\n    }\n  }\n}\n\nfunction drawHearts(t){\n  const breathe = 1 + Math.sin(t * 0.8) * 0.012;\n  for (const h of hearts){\n    const p = clamp01((t - h.t0) / 0.6);\n    if (p <= 0) continue;\n    const scale = Math.max(0, easeOutBack(p));\n    let alpha = clamp01(p * 1.7); if (h.soft) alpha *= 0.8;\n    const settled = clamp01((t - h.t0 - 0.6) / 0.7);\n    const sway = settled * Math.sin(t * 1.5 + h.sway) * (h.box * 0.05);\n    const rise = (1 - easeOutCubic(p)) * h.box * 0.45;\n    const hx = cx + (h.x - cx) * breathe + sway;\n    const hy = cy + (h.y - cy) * breathe - rise;\n    drawSprite((h.soft ? SPR.soft : SPR.crisp)[h.idx], hx, hy, h.box * scale, h.rot + sway * 0.012, alpha);\n  }\n}\n\nfunction updateTwinkles(t, dt){\n  const active = t > T.bloomT0 + T.bloomSpan * 0.45;\n  if (active && twinkles.length < 9 && Math.random() < 0.5){\n    const h = hearts[(Math.random() * hearts.length) | 0];\n    if (h) twinkles.push({ x: h.x, y: h.y, size: rand(0.6, 1.3) * (Math.min(W, H) * 0.05), age: 0, life: rand(0.7, 1.2), rot: rand(0, 6.28) });\n  }\n  ctx.save(); ctx.globalCompositeOperation = 'lighter';\n  for (let i = twinkles.length - 1; i >= 0; i--){\n    const s = twinkles[i]; s.age += dt;\n    const k = s.age / s.life;\n    if (k >= 1){ twinkles.splice(i, 1); continue; }\n    const a = Math.sin(k * Math.PI);\n    drawSprite(SPARKLE, s.x, s.y, s.size * (0.6 + 0.4 * a), s.rot + k * 1.2, a);\n  }\n  ctx.restore();\n}\n\nfunction spawnPetal(){\n  const h = hearts[(Math.random() * hearts.length) | 0];\n  if (!h) return;\n  petals.push({ x: h.x + rand(-8, 8), y: h.y + rand(-8, 8), vy: rand(14, 30), vx: rand(-8, 8), sway: rand(0.6, 1.4), phase: rand(0, 6.28), box: h.box * rand(0.34, 0.6), idx: h.idx, rot: rand(0, 6.28), vrot: rand(-1.4, 1.4), age: 0, land: groundY + rand(-6, H * 0.05) });\n}\nfunction drawPetals(t, dt){\n  for (let i = petals.length - 1; i >= 0; i--){\n    const p = petals[i]; p.age += dt; p.vy += 8 * dt;\n    p.x += (p.vx + Math.sin(t * p.sway + p.phase) * 16) * dt;\n    p.y += p.vy * dt; p.rot += p.vrot * dt;\n    if (p.y >= p.land){\n      rested.push({ x: clamp(p.x, 6, W - 6), y: p.land, box: p.box, idx: p.idx, rot: p.rot, a: rand(0.7, 0.95) });\n      if (rested.length > 90) rested.shift();\n      petals.splice(i, 1); continue;\n    }\n    const a = p.age < 0.3 ? p.age / 0.3 : 1;\n    drawSprite(SPR.crisp[p.idx], p.x, p.y, p.box, p.rot, a);\n  }\n}\nfunction drawRested(){\n  for (const r of rested) drawSprite(SPR.crisp[r.idx], r.x, r.y, r.box, r.rot, r.a);\n}\n\nfunction showWish(on){ wishEl.classList.toggle('is-in', on); }\n\n/* the tree's own rAF: plays once from treeStart(), then holds, living */\nlet treeStartT = 0, treeLastT = 0, treeRAF = 0, lastPetal = 0, replayArmed = false;\nwindow.bdayDone = false;\n\nfunction treeFrame(now){\n  if (!treeStartT){ treeStartT = now; treeLastT = now; }\n  const t  = (now - treeStartT) / 1000;\n  const dt = Math.min(0.05, (now - treeLastT) / 1000); treeLastT = now;\n\n  const rays = clamp01((t - T.bloomT0) / T.bloomSpan);\n\n  drawBackground();\n  drawGodRays(t, rays);\n  drawGlow(t);\n  drawBokeh(t, dt);\n  drawFloaters(t, dt, false);\n  drawBranches(t);\n  drawHearts(t);\n  updateTwinkles(t, dt);\n  if (t > T.petalT0 && now - lastPetal > 150){ spawnPetal(); spawnPetal(); lastPetal = now; }\n  drawPetals(t, dt);\n  drawRested();\n  drawFloaters(t, dt, true);\n\n  showWish(t >= T.noteStart);\n\n  if (!window.bdayDone && t >= T.done) window.bdayDone = true;\n  if (!replayArmed && t >= T.done + 1.0){ replayArmed = true; armReplay(); }\n\n  treeRAF = requestAnimationFrame(treeFrame);\n}\n\nfunction treeStart(){\n  treeStartT = 0; treeLastT = 0; lastPetal = 0; replayArmed = false; window.bdayDone = false;\n  cue('grow');\n  buildScene();\n  if (!treeRAF) treeRAF = requestAnimationFrame(treeFrame);\n}\nfunction treeStop(){\n  if (treeRAF){ cancelAnimationFrame(treeRAF); treeRAF = 0; }\n  ctx.clearRect(0, 0, W, H);\n}\n\nfunction drawFinal(){\n  buildScene();\n  drawBackground(); drawGodRays(0, 1); drawGlow(T.done); drawBokeh(0, 0); drawFloaters(99, 0, false);\n  drawBranches(99); drawHearts(99);\n  for (let i = 0; i < 40; i++){ const h = hearts[(Math.random() * hearts.length) | 0]; if (h) rested.push({ x: clamp(h.x + rand(-W * 0.3, W * 0.3), 6, W - 6), y: groundY + rand(-6, H * 0.05), box: h.box * 0.5, idx: h.idx, rot: rand(0, 6.28), a: 0.85 }); }\n  drawRested(); drawFloaters(99, 0, true);\n  showWish(true);\n  window.bdayDone = true;\n}\n\n/* ============================================================\n   ACTS 1–3 (GSAP) — the bow, the shot, the wish\n   ============================================================ */\n\n/* the two headline words become per-glyph spans so each hinges up on its own */\nfunction splitWord(el){\n  const chars = [...el.textContent];\n  el.textContent = '';\n  return chars.map((c) => {\n    const s = document.createElement('span');\n    s.className = 'hl__ch';\n    s.textContent = c === ' ' ? '\\u00a0' : c;\n    el.appendChild(s);\n    return s;\n  });\n}\nconst line1Chars = splitWord($('wLine1'));\nconst line2Chars = splitWord($('wLine2'));\nconst kChars = [...line1Chars, ...line2Chars];\n\n/* drifting light motes behind the scene */\nfunction buildMotes(){\n  motes.innerHTML = '';\n  for (let i = 0; i < 12; i++){\n    const m = document.createElement('span');\n    m.className = 'mote';\n    const s = rand(4, 12);\n    m.style.width = m.style.height = `${s}px`;\n    m.style.left = `${rand(4, 96)}%`;\n    m.style.top  = `${rand(10, 96)}%`;\n    motes.appendChild(m);\n    gsap.set(m, { opacity: rand(0.25, 0.7) });\n    gsap.to(m, { y: -rand(40, 140), x: rand(-30, 30), duration: rand(7, 14), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: -rand(0, 8) });\n    gsap.to(m, { opacity: rand(0.1, 0.5), duration: rand(2.5, 5), repeat: -1, yoyo: true, ease: 'sine.inOut' });\n  }\n}\n\n/* --- bow geometry (measured; re-measured on resize) -------------------------\n   The rig lives lower-left and is rotated so its local \"up\" axis points at the\n   heart; the shot therefore travels on a diagonal. The draw + arrow math all\n   live in the rig's LOCAL space (offset geometry is transform-independent, so\n   rotation never corrupts it); only the aim ANGLE and the flight DISTANCE come\n   from screen measurements. */\nconst tip = $('tip');\nlet svgScale = 1, arrowBaseX = 0, arrowBaseY = 0, maxDraw = 120, curDraw = 0;\nlet pullUX = 0, pullUY = 1;                               // screen unit: string pull-back\nconst REST_NOCK = 96;                                    // string nock, in bow viewBox units\nconst nockProxy = { val: REST_NOCK };\n\nfunction applyNock(){\n  const y = nockProxy.val;\n  strL.setAttribute('y2', y); strR.setAttribute('y2', y); serving.setAttribute('cy', y);\n}\n\nfunction refreshRig(){\n  // the grip is anchored here, and the heart sits at its layout centre (33% down,\n  // centred) — using the layout point, not a live rect, keeps the aim steady even\n  // while the heart is scaling in.\n  const gripX = W * 0.24, gripY = H * 0.76;\n  const heartX = W * 0.5, heartY = H * 0.33;\n  // rotation so local \"up\" (0,-1) maps to the grip→heart direction\n  const aimRad = Math.atan2(heartX - gripX, gripY - heartY);\n  pullUX = -Math.sin(aimRad); pullUY = Math.cos(aimRad);  // opposite of aim = pull-back\n\n  // #bow / #arrow are SVG — no offset* — so measure rects in the rig's LOCAL\n  // frame: neutralise the rig transform first (getBBox-style, sync, no paint).\n  nockProxy.val = REST_NOCK; applyNock();\n  gsap.set(archery, { rotation: 0, scale: 1, x: 0, y: 0 });\n  archery.style.left = '0px'; archery.style.top = '0px';\n  gsap.set(arrow, { x: 0, y: 0 });\n  const aR = archery.getBoundingClientRect();\n  const bR = bow.getBoundingClientRect();\n  const sR = serving.getBoundingClientRect();\n  const rR = arrow.getBoundingClientRect();\n  svgScale = bR.width / 460;\n  const gripLX = (bR.left - aR.left) + 0.5 * bR.width;\n  const gripLY = (bR.top  - aR.top ) + (240 / 300) * bR.height;   // grip ~y240 in viewBox\n  const nockLX = (sR.left - aR.left) + 0.5 * sR.width;\n  const nockLY = (sR.top  - aR.top ) + 0.5 * sR.height;\n  arrowBaseX = nockLX - ((rR.left - aR.left) + 0.5 * rR.width);\n  arrowBaseY = nockLY - ((rR.top  - aR.top ) + (205 / 220) * rR.height);\n\n  // anchor the grip at (gripX,gripY) and rotate the rig around it\n  archery.style.left = (gripX - gripLX) + 'px';\n  archery.style.top  = (gripY - gripLY) + 'px';\n  gsap.set(archery, { transformOrigin: `${gripLX}px ${gripLY}px`, rotation: aimRad * 180 / Math.PI });\n  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY });\n  maxDraw = Math.min(bR.height * 0.72, H * 0.16, 132);\n  curDraw = 0;\n}\n\nfunction setDraw(d){\n  curDraw = clamp(d, 0, maxDraw);\n  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY + curDraw });   // local +Y = pull back\n  nockProxy.val = REST_NOCK + curDraw / svgScale; applyNock();\n  gsap.set(aim, { opacity: 0.55 * (curDraw / maxDraw) });\n}\n\n/* the target heart's beat — gentle, alive; killed the instant we fire */\nlet beatTL = null;\nfunction startBeat(){\n  gsap.set(targetHeart, { scale: 1 });\n  gsap.set(heartGlow, { scale: 1, opacity: 0.7 });\n  beatTL = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });\n  beatTL.to(targetHeart, { scale: 1.07, duration: 0.13, ease: 'power2.out' }, 0)\n        .to(heartGlow,   { scale: 1.15, opacity: 0.9, duration: 0.13, ease: 'power2.out' }, 0)\n        .to(targetHeart, { scale: 1.0, duration: 0.2, ease: 'power2.in' }, 0.13)\n        .to(targetHeart, { scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.3)\n        .to(targetHeart, { scale: 1.0, duration: 0.5, ease: 'power2.inOut' }, 0.42)\n        .to(heartGlow,   { scale: 1.0, opacity: 0.7, duration: 0.7, ease: 'power2.inOut' }, 0.3);\n}\nfunction stopBeat(){ if (beatTL){ beatTL.kill(); beatTL = null; } gsap.set(targetHeart, { scale: 1 }); }\n\n/* a little burst of hearts + sparks where the arrow strikes */\nfunction miniHeartSVG(fill){\n  return `<svg viewBox=\"0 0 24 22\" width=\"100%\" height=\"100%\"><path d=\"M12 20C5.5 15 1.5 11.4 1.5 6.9 1.5 3.6 4 1.5 7 1.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3 0 5.5 2.1 5.5 5.4C23.5 11.4 19.5 15 12 20Z\" fill=\"${fill}\"/><\/svg>`;\n}\nfunction burstHearts(){\n  const r = target.getBoundingClientRect();\n  const hr = hero.getBoundingClientRect();\n  const ox = r.left - hr.left + r.width / 2;\n  const oy = r.top - hr.top + r.height * 0.42;\n  const cols = ['#ff6f97', '#ffb14e', '#ff8fae', '#ffd36a', '#e23b67'];\n  const frag = document.createDocumentFragment();\n  const nodes = [];\n  for (let i = 0; i < 12; i++){\n    const heart = i < 8;\n    const el = document.createElement('span');\n    el.className = 'burst';\n    const s = heart ? rand(12, 22) : rand(4, 8);\n    el.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;pointer-events:none;z-index:4;`;\n    if (heart) el.innerHTML = miniHeartSVG(pick(cols));\n    else { el.style.borderRadius = '50%'; el.style.background = 'radial-gradient(circle,#fff,rgba(255,210,150,0) 70%)'; }\n    frag.appendChild(el); nodes.push({ el, heart });\n  }\n  hero.appendChild(frag);\n  nodes.forEach(({ el, heart }) => {\n    const ang = rand(-Math.PI, 0);                       // fan upward + out\n    const dist = rand(heart ? 70 : 40, heart ? 190 : 120);\n    gsap.to(el, {\n      x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - rand(10, 50),\n      rotation: rand(-120, 120), scale: heart ? rand(0.7, 1.2) : rand(0.4, 1),\n      duration: rand(0.7, 1.15), ease: 'power2.out',\n    });\n    gsap.to(el, { opacity: 0, duration: 0.5, delay: rand(0.35, 0.6), ease: 'power1.in', onComplete: () => el.remove() });\n  });\n}\n\n/* --- the shot + Acts 2–3 timeline ------------------------------------------ */\nfunction shotGeom(){\n  // flight distance = straight-line from the arrow tip to the heart (measured on\n  // screen, rotation-aware). Moving the arrow that far along its local \"up\" axis\n  // — which is aimed at the heart — lands the tip dead-centre on it.\n  const tipR = tip.getBoundingClientRect();\n  const tRect = target.getBoundingClientRect();\n  const tipX = tipR.left + tipR.width / 2, tipY = tipR.top + tipR.height / 2;\n  const tcx = tRect.left + tRect.width / 2, tcy = tRect.top + tRect.height / 2;\n  const flightDist = Math.hypot(tcx - tipX, tcy - tipY);\n  const fallPx = Math.min(H * 0.26, H - tcy - tRect.height * 0.4);\n  const impactX = tcx, impactY = tcy + fallPx;\n  const distC = Math.hypot(Math.max(impactX, W - impactX), Math.max(impactY, H - impactY));\n  const reach = Math.hypot(W / 2, H / 2);\n  return {\n    arrowStartY: arrowBaseY + curDraw,\n    arrowFlyY:   arrowBaseY + curDraw - flightDist,       // local -Y = toward the heart\n    drawnNock:   REST_NOCK + curDraw / svgScale,\n    fallPx, fx: impactX - W / 2, fy: impactY - H / 2,\n    floodScale: (distC * 1.12) / 70, bloomScale: (reach * 1.2) / 30,\n  };\n}\n\nlet filmTL = null;\nfunction buildFilm(m){\n  const t = gsap.timeline({\n    paused: true,\n    onComplete: () => {\n      gsap.set(field, { autoAlpha: 0 });\n      treeStart();\n      // fade promptly so the growing tree is revealed with no white hold\n      gsap.to(bloom, { autoAlpha: 0, duration: 1.15, ease: 'power2.out' });\n    },\n  });\n\n  // reset (t=0)\n  t.set(target, { y: 0, scaleX: 1, scaleY: 1, opacity: 1 })\n   .set(arrow, { opacity: 1, x: arrowBaseX, y: m.arrowStartY, scaleY: 1 })\n   .set([flood, bloom], { autoAlpha: 0, scale: 0.001, x: 0, y: 0 })\n   .set(flood, { x: m.fx, y: m.fy })\n   .set(field, { autoAlpha: 0 })\n   .set('.blob', { opacity: 0 })\n   .set(camera, { scale: 1, yPercent: 0 })\n   .set(fgrid, { xPercent: 0, yPercent: 0 })\n   .set(barTop, { yPercent: -100 })\n   .set(barBot, { yPercent: 100 })\n   .set(kEyebrow, { opacity: 0, y: 12 })\n   .set(kSub, { opacity: 0, y: 12 })\n   .set(kChars, { transformPerspective: 620, transformOrigin: '50% 100%', yPercent: 135, rotationX: -82 })\n   .set(uline, { drawn: 0 });\n\n  // --- the shot: string snaps (twang), arrow flies up into the heart --------\n  t.fromTo(nockProxy, { val: m.drawnNock }, { val: REST_NOCK, duration: 0.5, ease: 'elastic.out(1,0.34)', onUpdate: applyNock }, 0)\n   .to(arrow, { y: m.arrowFlyY, duration: 0.26, ease: 'power2.in' }, 0)\n   .to(arrow, { scaleY: 1.16, duration: 0.14, ease: 'power2.in' }, 0)\n   .to(arrow, { scaleY: 1.0, duration: 0.1, ease: 'power1.out' }, 0.16)\n   .to(aim, { opacity: 0, duration: 0.18 }, 0)\n   .to([eyebrow, hint], { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0);\n\n  // --- the strike: the arrow embeds, the heart recoils, then holds pierced --\n  t.add(burstHearts, 0.26)\n   // recoil along the arrow's line (up + right), springing back\n   .to(target, { x: 7, y: -9, duration: 0.06, ease: 'power2.out' }, 0.26)\n   .to(target, { x: 0, y: 0, duration: 0.32, ease: 'power2.out' }, 0.32)\n   .to(target, { scale: 1.14, duration: 0.06, ease: 'power2.out' }, 0.26)\n   .to(target, { scale: 1.0, duration: 0.26, ease: 'power2.inOut' }, 0.32)\n   // the arrow shudders in the wound, holds embedded so the hit reads, then sinks in\n   .to(arrow, { rotation: '+=4', duration: 0.05, yoyo: true, repeat: 4, ease: 'sine.inOut' }, 0.27)\n   .set(arrow, { rotation: 0 }, 0.52)\n   .to(arrow, { opacity: 0, duration: 0.16, ease: 'power1.out' }, 0.56);\n\n  // --- the fall + the burst / flood -----------------------------------------\n  t.to(target, { y: m.fallPx, scaleX: 0.84, scaleY: 1.3, duration: 0.34, ease: 'power1.in' }, 0.64)\n   .to(target, { scaleX: 1.4, scaleY: 0.6, duration: 0.07, ease: 'power2.out' }, 0.98)\n   .set(flood, { autoAlpha: 1 }, 1.00)\n   .fromTo(flood, { scale: 0.02 }, { scale: m.floodScale, duration: 0.34, ease: 'power2.in' }, 1.00)\n   .to(target, { opacity: 0, duration: 0.12, ease: 'power1.out' }, 1.06);\n\n  // seam: the field is the same rose as the flood\n  t.set(field, { autoAlpha: 1 }, 1.32)\n   .set(hero, { autoAlpha: 0 }, 1.33)\n   .to('.blob', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.34)\n   .set(flood, { autoAlpha: 0 }, 1.36);\n\n  // --- the camera push -------------------------------------------------------\n  // duration matched to when the bloom covers (3.98) — a longer push used to\n  // keep the timeline (and a white bloom) alive after the tree should already\n  // be growing, which read as dead time before the tree appeared.\n  t.fromTo(camera, { scale: 1.0, yPercent: 0 }, { scale: 1.07, yPercent: -1.3, duration: 2.6, ease: 'none' }, 1.38)\n   .fromTo(fgrid, { xPercent: 0, yPercent: 0 }, { xPercent: -1.5, yPercent: -1.0, duration: 2.6, ease: 'none' }, 1.38);\n\n  // beat markers for the recorder's soundtrack (no-ops off ?record)\n  t.call(cue, ['hit'], 0.26)\n   .call(cue, ['flood'], 1.00)\n   .call(cue, ['wish'], 1.68)\n   .call(cue, ['wish2'], 2.06)\n   .call(cue, ['bloom'], 3.42);\n\n  // cinema bars ease into a letterbox\n  t.to(barTop, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, 1.5)\n   .to(barBot, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, 1.5);\n\n  // --- the kinetic wish ------------------------------------------------------\n  t.to(kEyebrow, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.54)\n   .to(line1Chars, { yPercent: 0, rotationX: 0, duration: 0.55, ease: 'power3.out', stagger: 0.033 }, 1.68)\n   .to(line2Chars, { yPercent: 0, rotationX: 0, duration: 0.55, ease: 'power3.out', stagger: 0.033 }, 2.06)\n   .to(uline, { drawn: 1, duration: 0.45, ease: 'power2.inOut' }, 2.54)\n   .to(kSub, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 2.74);\n\n  // --- the handoff bloom -----------------------------------------------------\n  t.to(barTop, { yPercent: -100, duration: 0.5, ease: 'power2.in' }, 3.32)\n   .to(barBot, { yPercent: 100, duration: 0.5, ease: 'power2.in' }, 3.32)\n   .set(bloom, { autoAlpha: 1 }, 3.42)\n   .fromTo(bloom, { scale: 0.02 }, { scale: m.bloomScale, duration: 0.58, ease: 'power2.in' }, 3.42);\n\n  return t;\n}\n\n/* --- draw / release interaction -------------------------------------------- */\nlet played = false, drawing = false, startPX = 0, startPY = 0, startDraw = 0;\n\nfunction fire(){\n  if (played) return;\n  played = true;\n  drawing = false;\n  stopBeat();\n  cue('release'); cue('whoosh');\n  filmTL = buildFilm(shotGeom());\n  filmTL.play(0);\n}\n\nfunction springBack(){\n  const from = curDraw;\n  gsap.to({ d: from }, { d: 0, duration: 0.55, ease: 'elastic.out(1,0.4)', onUpdate() { setDraw(this.targets()[0].d); } });\n}\n\nfunction autoFire(){\n  if (played) return;\n  recT0 = performance.now(); cue('draw');       // t=0 of the soundtrack\n  gsap.to({ d: curDraw }, {\n    d: maxDraw * 0.94, duration: 0.62, ease: 'power2.inOut',\n    onUpdate() { setDraw(this.targets()[0].d); },\n    onComplete: () => gsap.delayedCall(0.16, fire),\n  });\n}\n\narchery.addEventListener('pointerdown', (e) => {\n  if (played) return;\n  drawing = true;\n  try { archery.setPointerCapture(e.pointerId); } catch (_) {}\n  startPX = e.clientX; startPY = e.clientY; startDraw = curDraw;\n  e.preventDefault();\n});\narchery.addEventListener('pointermove', (e) => {\n  if (!drawing) return;\n  // project the drag onto the pull-back axis, so dragging back along the aim\n  // (down + away from the heart) draws the string — on any shot angle.\n  const proj = (e.clientX - startPX) * pullUX + (e.clientY - startPY) * pullUY;\n  setDraw(startDraw + proj);\n});\nfunction endDraw(){\n  if (!drawing) return;\n  drawing = false;\n  if (curDraw > maxDraw * 0.26) fire(); else springBack();\n}\narchery.addEventListener('pointerup', endDraw);\narchery.addEventListener('pointercancel', endDraw);\narchery.addEventListener('keydown', (e) => {\n  if (played) return;\n  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); autoFire(); }\n});\n\n/* boot Act 1: reveal the target + bow + hint, then start the beat */\nfunction enter(){\n  gsap.set(hero, { autoAlpha: 1 });\n  refreshRig();\n  setDraw(0);\n  gsap.set([eyebrow, hint], { opacity: 0, y: 14 });\n  gsap.set(target, { opacity: 0, y: 10, scaleX: 0.9, scaleY: 0.9 });\n  gsap.set(archery, { opacity: 0, scale: 0.85 });        // scale from the grip; keeps rotation\n  gsap.set(heartGlow, { opacity: 0, scale: 1 });\n  gsap.set(arrow, { opacity: 1 });\n\n  const tl = gsap.timeline({ onComplete: startBeat });\n  tl.to(target,   { opacity: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.8, ease: 'power3.out' }, 0.1)\n    .to(heartGlow,{ opacity: 0.7, duration: 0.8, ease: 'power2.out' }, 0.2)\n    .to(archery,  { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.28)\n    .to(eyebrow,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4)\n    .to(hint,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.7);\n}\n\nfunction armReplay(){ if (window.sorryStory) return window.sorryStory();\n  replay.hidden = false;\n  requestAnimationFrame(() => replay.classList.add('is-shown'));\n}\n\n/* back to Act 1, ready to be drawn again */\nfunction resetAll(){\n  treeStop();\n  showWish(false);\n  window.bdayDone = false; replayArmed = false;\n  replay.classList.remove('is-shown'); replay.hidden = true;\n  if (filmTL){ filmTL.pause(0); }\n  gsap.set([flood, bloom], { autoAlpha: 0 });\n  gsap.set(field, { autoAlpha: 0 });\n  gsap.set(arrow, { opacity: 1, scaleY: 1 });\n  played = false;\n  enter();\n}\n\n/* ============================================================\n   SIZING + BOOT\n   ============================================================ */\nfunction resize(){\n  dpr = Math.min(window.devicePixelRatio || 1, 2);\n  W = canvas.clientWidth; H = canvas.clientHeight;\n  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);\n  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);\n  buildSprites();\n  buildScene();\n  if (reduceMotion){ drawFinal(); return; }\n  if (played && filmTL){\n    const at = filmTL.time(); const active = filmTL.isActive();\n    filmTL = buildFilm(shotGeom());\n    filmTL.pause(at);\n    if (active) filmTL.play(at);\n  } else {\n    refreshRig(); setDraw(0);\n  }\n}\nlet resizeRAF = 0;\nwindow.addEventListener('resize', () => { if (resizeRAF) return; resizeRAF = requestAnimationFrame(() => { resizeRAF = 0; resize(); }); });\n\nresize();\n\nif (reduceMotion){\n  drawFinal();\n} else {\n  buildMotes();\n  document.fonts && document.fonts.ready.then(() => { refreshRig(); setDraw(0); });\n  enter();\n  replay.addEventListener('click', resetAll);\n}\n\n/* ============================================================\n   RECORDING HOOK — the rig draws + fires after its pre-roll\n   ============================================================ */\nif (isRecord){\n  window.bdayAPI = {\n    start(){ autoFire(); },\n    replay(){ resetAll(); },\n  };\n}\n\nconst storyEl = document.createElement('div');\nstoryEl.className = 'story';\nstoryEl.innerHTML = '<p class=\"story__say\" id=\"storySay\"><\/p><button class=\"story__btn\" id=\"storyBtn\" type=\"button\">Continue 💌<\/button>';\ndocument.querySelector('.scene').appendChild(storyEl);\nconst storySay = $('storySay'), storyBtn = $('storyBtn');\nstoryBtn.addEventListener('click', () => parent.postMessage('sorry-continue', '*'));\nconst STORY = (() => { const d = document.createElement('div'); d.innerHTML = window.SORRY_PARAS || '';\n  return d.textContent.replace(/\\s+/g, ' ').trim().split(/(?<=[.!?])\\s+(?=\\S)/)\n    .reduce((o, l) => (/\\p{L}/u.test(l) || !o.length ? o.push(l) : o[o.length - 1] += ' ' + l, o), []); })();\nlet storyRun = false;\nwindow.sorryStory = () => {\n  if (storyRun || !STORY.length) return; storyRun = true;\n  setTimeout(() => {\n    wishEl.classList.add('is-gone'); storyEl.classList.add('is-in');\n    const type = (i) => {\n      const ch = Array.from(STORY[i]), txt = document.createElement('span'), cur = document.createElement('i');\n      cur.className = 'story__cur'; storySay.classList.remove('is-out');\n      const wrap = document.createElement('span'); wrap.append(txt, cur); storySay.replaceChildren(wrap);\n      let n = 0;\n      const iv = setInterval(() => {\n        txt.textContent = ch.slice(0, ++n).join('');\n        if (n < ch.length) return;\n        clearInterval(iv);\n        if (i === STORY.length - 1){ setTimeout(() => { cur.remove(); storyBtn.classList.add('is-in'); }, 700); return; }\n        setTimeout(() => { storySay.classList.add('is-out'); setTimeout(() => type(i + 1), 450); }, 900 + ch.length * 13);\n      }, 28);\n    };\n    setTimeout(() => type(0), 600);\n  }, 1800);\n};\n<\/script>\n<\/body>\n<\/html>\n";
function reset(){ E.classList.remove("on"); E.innerHTML = ""; }
function start(){
  reset();
  cancelAnimationFrame(trainFrame);
  trainScene.classList.remove("show");
  const paras = $("full").querySelector("p").innerHTML;
  const f = document.createElement("iframe");
  f.title = "I'm Truly Sorry";
  f.srcdoc = FILM_SRC.replace("<script>", "<script>window.SORRY_PARAS=" + JSON.stringify(paras).replace(/<\//g, "<\\/") + ";<\/script><script>");
  E.appendChild(f); E.classList.add("on");
  f.onload = () => f.focus();
}
addEventListener("message", e => { if(e.data === "sorry-replay" && E.classList.contains("on")) $("replay").click(); });
$("toBow").onclick = start;
$("replay").addEventListener("click", reset);
})();
/* =====================================================================
   FINALE  -  after the last paragraph:  Continue -> pic ask (Yes / No)
   -> camera button -> bunny ears + teeth filter -> thanks + feedback
===================================================================== */
(() => {
"use strict";

/* ✏️ WHERE SHOULD HER FEEDBACK GO?  (fill ONE of these, or leave both empty)
   WhatsApp: digits only with country code, e.g. "919876543210"
   Email:    e.g. "you@gmail.com"
   If both are empty, her phone's Share sheet opens (she picks WhatsApp etc.),
   and on a computer the feedback is copied so she can paste it to you.      */
const FEEDBACK_WHATSAPP = "";
const FEEDBACK_EMAIL = "";

const g = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const snap = g("snap");
const ids = ["sn-ask", "sn-open", "sn-cam", "sn-res", "sn-fb"];
const screens = ids.map(g);
function show(id){ screens.forEach(s => s.classList.toggle("on", s.id === id)); }

/* ---------- DEBUG: add ?debug=1 to the page link (or tap "Smile!" 5 times) for an on-screen log.
   Also: ?jump=ask or ?jump=camera opens the finale directly, so you can test it fast. ---------- */
const dbgEl = g("sn-debug"), dbgLines = [];
let DEBUG = /[?&]debug(=1|=true|&|$)/.test(location.search);
function dlog(m){
  const t = (performance.now() / 1000).toFixed(1);
  console.log("[sorry " + t + "s]", m);
  dbgLines.push(t + "  " + m); if(dbgLines.length > 60) dbgLines.shift();
  if(DEBUG){ dbgEl.textContent = dbgLines.slice(-18).join("\n"); dbgEl.scrollTop = dbgEl.scrollHeight; }
}
function setDebug(on){ DEBUG = on; dbgEl.classList.toggle("on", on); if(on) dbgEl.textContent = dbgLines.slice(-18).join("\n"); }
if(DEBUG) setDebug(true);
addEventListener("error", e => dlog("JS error: " + e.message + " @line " + (e.lineno || "?")));
addEventListener("unhandledrejection", e => dlog("Promise error: " + (e.reason && (e.reason.message || e.reason.name) || e.reason)));
async function envReport(){
  let perm = "n/a", cams = "?";
  try{ perm = (await navigator.permissions.query({ name: "camera" })).state; }catch(_){}
  try{ cams = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput").length; }catch(_){}
  if(/^(content|file):$/.test(location.protocol)) dlog("page opened from " + location.protocol + "// → photos/gifs/songs next to it usually can't load, and YouTube shows Error 153. Host the folder (https) instead.");
  if(window.__missingMedia && window.__missingMedia.length) dlog("files not found: " + window.__missingMedia.join(", "));
  dlog("env: secure=" + window.isSecureContext + " proto=" + location.protocol + " mediaDevices=" + !!navigator.mediaDevices + " permission=" + perm + " cameras=" + cams + " tracker=" + FaceTracker.state);
}
let titleTaps = 0, titleT = 0;
g("sn-title").addEventListener("click", () => { const n = performance.now(); titleTaps = n - titleT < 1500 ? titleTaps + 1 : 1; titleT = n; if(titleTaps >= 5){ titleTaps = 0; setDebug(!DEBUG); } });

/* ---------- little heart rain ---------- */
function heartRain(n){
  const set = ["💖", "💗", "💕", "🌸", "🐰"];
  for(let i = 0; i < (n || 26); i++){
    const d = document.createElement("span");
    d.className = "sn-heart";
    d.textContent = set[i % set.length];
    d.style.left = (Math.random() * 96) + "vw";
    d.style.fontSize = (16 + Math.random() * 22) + "px";
    d.style.setProperty("--r", (Math.random() * 360 - 180) + "deg");
    d.style.animationDuration = (2.4 + Math.random() * 2.2) + "s";
    d.style.animationDelay = (Math.random() * .8) + "s";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 6000);
  }
}

/* =====================================================================
   1) THE ASK  -  every "No" multiplies the Yes buttons x20 across the screen.
   4 waves: 20 -> 400 -> 8,000 -> 160,000. The badge shows the real maths; the screen
   draws a capped number (20 / 400 / 700 / a full-screen tile) so phones don't freeze.
   Every drawn button is a working Yes.
===================================================================== */
const yes = g("sn-yes"), no = g("sn-no"), askP = g("sn-ask-p");
const swarm = g("sn-swarm"), badge = g("sn-count"), askScr = g("sn-ask");
const MULT = 20, WAVES = 4;
const ASK_DEFAULT = "Can I please get one simple pic with you? 📸";
const NO_MSGS = [
  "Pleaseee, just one tiny pic? 🥺",
  "Oops... the Yes button had babies 😳",
  "Every No makes 20x more Yes 😌",
  "Okay... Yes is everywhere now 💖 Tap any one!"
];
const TARGET = [20, 400, 700];                       /* buttons on screen after waves 1-3 */
let noCount = 0, virt = 1, busy = false;

function resetAsk(){
  noCount = 0; virt = 1; busy = false;
  swarm.textContent = ""; badge.classList.remove("on"); badge.textContent = "";
  delete askScr.dataset.go;
  no.style.visibility = ""; no.disabled = false;
  askP.textContent = ASK_DEFAULT;
}
function spawnWave(n){
  const vw = innerWidth, vh = innerHeight;
  const u = Math.max(1, Math.min(2.3, Math.min(vw, 900) / 390));          /* bigger screens, bigger buttons */
  const w = [92, 58, 46, 40][n - 1] * u, h = [44, 30, 24, 22][n - 1] * u, fs = [15, 11, 10, 9][n - 1] * u;
  const old = [...swarm.children], yr = yes.getBoundingClientRect();
  const origins = old.length ? old.map(b => b._c) : [{ x: yr.left + yr.width / 2, y: yr.top + yr.height / 2 }];
  const cells = [];
  if(n === WAVES){                                                         /* last wave: tile the whole screen */
    const cols = Math.ceil(vw / w), rows = Math.ceil(vh / h), cw = vw / cols, ch = vh / rows;
    for(let r = 0; r < rows; r++) for(let c = 0; c < cols; c++) cells.push({ x: c * cw, y: r * ch, w: cw + 1, h: ch + 1 });
  }else{
    const k = TARGET[n - 1] - old.length;
    const cols = Math.ceil(Math.sqrt(k * vw / vh)), rows = Math.ceil(k / cols), cw = vw / cols, ch = vh / rows;
    const all = [];
    for(let r = 0; r < rows; r++) for(let c = 0; c < cols; c++) all.push([c, r]);
    all.sort(() => Math.random() - .5);
    all.slice(0, k).forEach(([c, r]) => cells.push({
      x: Math.min(vw - w, Math.max(0, c * cw + (cw - w) / 2 + (Math.random() - .5) * cw * .6)),
      y: Math.min(vh - h, Math.max(0, r * ch + (ch - h) / 2 + (Math.random() - .5) * ch * .6)), w: w, h: h }));
  }
  const frag = document.createDocumentFragment();
  cells.forEach((p, i) => {
    const b = document.createElement("button"), cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    const o = origins[(Math.random() * origins.length) | 0];
    const dl = n === WAVES ? Math.hypot(cx - vw / 2, cy - vh / 2) / Math.hypot(vw / 2, vh / 2) * .7 : i / cells.length * .6;
    b.type = "button"; b.className = "sw"; b.tabIndex = -1; b._c = { x: cx, y: cy };
    b.textContent = n === 1 ? "Yes 💖" : "Yes";
    b.style.cssText = "left:" + p.x + "px;top:" + p.y + "px;--w:" + p.w + "px;--h:" + p.h + "px;--fs:" + fs + "px;--fx:" + (o.x - cx) + "px;--fy:" + (o.y - cy) + "px;--dl:" + dl.toFixed(2) + "s";
    frag.appendChild(b);
  });
  swarm.appendChild(frag);
  if(n === WAVES) setTimeout(() => old.forEach(b => b.remove()), 1000);   /* hidden underneath now - free the memory */
  dlog("wave " + n + ": +" + cells.length + " buttons, on screen " + swarm.children.length + ", counter " + virt.toLocaleString("en-US"));
}
no.addEventListener("click", () => {
  if(busy || noCount >= WAVES) return;
  busy = true; setTimeout(() => { busy = false; }, 450);
  noCount++; virt *= MULT;
  askP.textContent = NO_MSGS[noCount - 1];
  badge.innerHTML = "<span>" + NO_MSGS[noCount - 1] + "</span><br>💖 " + virt.toLocaleString("en-US") + " Yes buttons";
  badge.classList.remove("on"); void badge.offsetWidth; badge.classList.add("on");
  spawnWave(noCount);
  if(noCount === WAVES){ no.disabled = true; setTimeout(() => { no.style.visibility = "hidden"; }, 700); }
});
function sayYes(){
  if(askScr.dataset.go) return;
  askScr.dataset.go = "1";
  heartRain(30);
  setTimeout(() => { show("sn-open"); delete askScr.dataset.go; }, 450);
}
yes.addEventListener("click", sayYes);
swarm.addEventListener("click", e => { if(e.target.closest(".sw")) sayYes(); });

/* =====================================================================
   ENTRY  -  the film's "Continue" button posts this message
===================================================================== */
function openSnap(){
  if(snap.classList.contains("on")) return;
  resetAsk();
  show("sn-ask");
  snap.classList.add("on");
  FaceTracker.load().catch(() => {});      /* warm up the face tracker early */
  AssetStore.loadAll().catch(() => {});
  const E = g("ending");
  setTimeout(() => { if(E){ E.classList.remove("on"); E.innerHTML = ""; } }, 900);
}
addEventListener("message", e => { if(e.data === "sorry-continue") openSnap(); });

/* =====================================================================
   ADVANCED BUNNY AR CAMERA
   Pipeline:  camera -> MediaPipe Face Landmarker -> validate -> face geometry -> head transform
              -> One-Euro smoothing -> ear spring physics -> mouth controller -> renderer.
   Everything is positioned from facial landmarks (never from the screen centre or fixed x/y).

   Modules in this block (search for the names):
     BUNNY_FILTER   tunable configuration            AssetStore     loads/mips the transparent WebP parts
     OneEuro/Spring math helpers                     FaceTracker    MediaPipe init + detection (swappable backend)
     FaceGeometry   landmarks -> face size/pose      FaceRig        smoothing, lost-face hold, one per tracked face
     EarPhysics     springs / inertia / tip bend     MouthController  mouth openness -> teeth
     Renderer       video + bunny parts + debug      CameraManager  getUserMedia lifecycle
     CaptureManager shutter -> filtered JPEG         FilterController  loop + orchestration

   COORDINATE CONVENTION (important for the mirrored selfie):
   every landmark is converted ONCE into DISPLAY space (the pixels you see on the canvas, already
   mirrored for the front camera). From then on "left" always means screen-left. Moving your head to
   the left of the screen therefore moves the bunny to the left of the screen.
===================================================================== */
const BUNNY_FILTER = {
  maxFaces: 1,                                   /* 1 = primary/closest face only; >1 tracks several faces */

  /* The parts are separate transparent images. Replace any file and nothing else needs to change.
     (An ear image only needs its "base" at the anchor below: default bottom-centre, 84% down, where the soft fade-out starts.) */
  assets: {
    leftEar:  "left-ear.webp",
    rightEar: "right-ear.webp",
    nose:     "nose.webp",
    teeth:    "teeth.webp",
    muzzle:   "muzzle.webp"
  },
  /* pivot of each image as a fraction of its own width/height */
  anchors: {
    leftEar:  { x: 0.50, y: 0.90 },
    rightEar: { x: 0.50, y: 0.90 },
    nose:     { x: 0.50, y: 0.47 },
    teeth:    { x: 0.50, y: 0.02 },
    muzzle:   { x: 0.50, y: 0.20 }
  },

  /* All offsets are in FACE-WIDTH units, measured in the face's own (rotated) frame:
     +X = towards the face's right (screen-right when upright), +Y = DOWN the face. */
  ears: {
    scale: 1.0,            /* both ears */
    height: 1.22,          /* ear image height = face width x this */
    segments: 14,          /* bend resolution (more = smoother, slightly slower) */
    baseLift: 0.01,       /* how far above the forehead landmark the ear base sits (x face height) */
    spread: 0.255,         /* sideways distance of each ear from the face midline (x face width) */
    left:  { offsetX: 0, offsetY: 0.02, scale: 1.02, rotation: -0.08, spring: 116, damping: 9.0, bendSpring: 66, bendDamping: 6.2, bend: 0.96, gain: 1.02, phase: 0.0 },
    right: { offsetX: 0, offsetY: 0.02, scale: 1.00, rotation:  0.08, spring: 142, damping: 10.4, bendSpring: 82, bendDamping: 7.6, bend: 0.80, gain: 0.88, phase: 2.1 }
  },
  nose:   { scale: 0.98, offsetX: 0, offsetY: -0.005, widthFactor: 1.70 },
  muzzle: { enabled: true, scale: 0.98, offsetX: 0, offsetY: 0, alpha: 0.62 },
  teeth:  { scale: 0.92, offsetX: 0, offsetY: -0.004, widthFactor: 0.46 },

  /* secondary motion for the ears ("physics.enabled = false" gives rigid ears) */
  physics: {
    enabled: true,
    intensity: 1.0,        /* 0 = none, 1 = default, 1.5 = cartoony */
    tiltGain: 0.9,         /* head acceleration -> ear swing (rad per face-width) */
    bendGain: 1.5,         /* head acceleration -> tip lag */
    bounceGain: 0.6,       /* vertical acceleration -> ear bounce */
    microMotion: 0.012,    /* tiny idle sway (rad). 0 = off */
    deadZone: 2.5,         /* ignore accelerations below this (face-widths/s^2) = no jitter at rest */
    maxTilt: 0.50, maxBend: 0.70
  },

  /* separate smoothing for each kind of signal. minCutoff = steadiness at rest (lower = steadier),
     beta = how fast the filter opens up while moving (higher = less lag). */
  smoothing: {
    position: { minCutoff: 2.2, beta: 10 },
    rotation: { minCutoff: 1.6, beta: 1.4 },
    scale:    { minCutoff: 1.2, beta: 8 },
    mouth:    { minCutoff: 3.2, beta: 14 },
    renderFollowHz: 48     /* render-rate interpolation between detections */
  },

  /* what happens when the face is lost for a moment */
  lostFace: { holdMs: 280, fadeMs: 320, fadeInMs: 150 },

  tracker: {
    bundleBase: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision",           /* self-host these two to run offline */
    versions: ["0.10.14", "0.10.21", "latest"],
    modelUrl: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    minConfidence: 0.48,
    maxFps: 30             /* detection rate cap (rendering stays at the screen refresh rate) */
  },
  camera: { facing: "user", maxFrameRate: 30 },
  render: { dprCap: 1.5, maxLongSide: 1280, debug: false }
};

let DEBUG_AR = BUNNY_FILTER.render.debug || /[?&]debugAR=(1|true)(&|$)/i.test(location.search) || DEBUG;
const ALOG = {
  info:  (m, ...a) => { console.log("[AR] " + m, ...a); dlog("[AR] " + m); },
  warn:  (m, ...a) => { console.warn("[AR] " + m, ...a); },
  error: (m, ...a) => { console.error("[AR ERROR] " + m, ...a); dlog("[AR ERROR] " + m); }
};

/* ---------- small math helpers ---------- */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const wrapPi = a => { a %= TAU; return a > Math.PI ? a - TAU : a < -Math.PI ? a + TAU : a; };
const expK = (hz, dt) => 1 - Math.exp(-hz * dt);              /* frame-rate independent exponential smoothing factor */
const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* One Euro filter (Casiez et al.): steady at rest, low lag when moving. `unit` normalises speed by face size. */
class OneEuro {
  constructor(cfg){ this.cfg = cfg; this.dCutoff = 1.4; this.reset(); }
  reset(){ this.has = false; this.x = 0; this.dx = 0; this.t = 0; }
  static alpha(cutoff, dt){ const tau = 1 / (TAU * cutoff); return 1 / (1 + tau / dt); }
  filter(x, t, unit = 1){
    if(!this.has){ this.has = true; this.x = x; this.dx = 0; this.t = t; return x; }
    const dt = Math.max(1e-3, t - this.t); this.t = t;
    this.dx += ((x - this.x) / dt - this.dx) * OneEuro.alpha(this.dCutoff, dt);
    const cutoff = this.cfg.minCutoff + this.cfg.beta * Math.abs(this.dx) / Math.max(1e-6, unit);
    this.x += (x - this.x) * OneEuro.alpha(cutoff, dt);
    return this.x;
  }
}

/* Damped spring, semi-implicit Euler with sub-steps so a slow frame can never explode it. */
class Spring {
  constructor(x0 = 0){ this.x = x0; this.v = 0; }
  step(target, k, c, force, dt){
    const n = Math.max(1, Math.ceil(dt * 180)), h = dt / n;
    for(let i = 0; i < n; i++){
      this.v += (k * (target - this.x) - c * this.v + force) * h;
      this.x += this.v * h;
    }
    if(!Number.isFinite(this.x) || !Number.isFinite(this.v)){ this.x = target; this.v = 0; }
  }
  reset(x = 0){ this.x = x; this.v = 0; }
}

/* ---------- AssetStore: transparent parts, with pre-scaled copies so downscaling stays crisp ---------- */
const AssetStore = {
  items: {},
  init(){
    for(const [key, src] of Object.entries(BUNNY_FILTER.assets))
      if(!this.items[key]) this.items[key] = { key, src, levels: null, ready: false, failed: false };
  },
  loadOne(a){
    if(a.ready) return Promise.resolve(a);
    return new Promise(resolve => {
      const img = new Image(), url = new URL(a.src, document.baseURI).href;
      const timer = setTimeout(() => { a.failed = true; ALOG.error("Asset load timeout: " + a.key + " (" + url + ")"); resolve(a); }, 10000);
      img.onload = () => {
        clearTimeout(timer);
        if(!img.naturalWidth){ a.failed = true; ALOG.error("Asset decoded with no size: " + a.key); return resolve(a); }
        a.levels = [{ img, s: 1 }];
        let w = img.naturalWidth, h = img.naturalHeight, prev = img, s = 1;
        while(w > 160 && h > 160 && a.levels.length < 4){        /* 1/2, 1/4, 1/8 copies */
          w = Math.round(w / 2); h = Math.round(h / 2); s /= 2;
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(prev, 0, 0, w, h);
          a.levels.push({ img: c, s }); prev = c;
        }
        a.ready = true; a.failed = false;
        resolve(a);
      };
      img.onerror = () => { clearTimeout(timer); a.failed = true; ALOG.error("Could not load bunny asset: " + a.key + " (" + url + ")"); resolve(a); };
      img.decoding = "async";
      img.src = url;
    });
  },
  async loadAll(){ this.init(); await Promise.all(Object.values(this.items).map(a => this.loadOne(a))); return Object.values(this.items).every(a => a.ready); },
  /* choose the pre-scaled copy whose size is closest to what we draw (k = destination px per original px) */
  pick(key, k){
    const a = this.items[key];
    if(!a || !a.ready) return null;
    let best = a.levels[0];
    for(const L of a.levels) if(L.s >= k * 0.9) best = L;      /* smallest copy that is still about as large as what we draw */
    return best.img;
  }
};
AssetStore.init();

const imgW = i => i.naturalWidth || i.width, imgH = i => i.naturalHeight || i.height;

/* ---------- landmark indices (MediaPipe Face Mesh topology) ----------
   pairs are [image-left, image-right] of the RAW camera frame; FaceGeometry swaps them when the preview is mirrored. */
const LM = {
  top: 10, chin: 152, nose: 1, noseUp: 4, noseBase: 2, lipUp: 13, lipLo: 14, lipTop: 0, lipBot: 17,
  cheek: [234, 454], eyeOut: [33, 263], eyeIn: [133, 362], mouth: [61, 291], fore: [67, 297], wing: [129, 358]
};
const KEYS = ["top", "chin", "cL", "cR", "eL", "eR", "nose", "noseUp", "noseBase", "lipUp", "lipLo", "lipTop", "mL", "mR", "wL", "wR", "fL", "fR"];

/* The current mapping from raw video/image coordinates to canvas pixels (set every frame by the Renderer). */
const VIEW = { W: 720, H: 960, vw: 1280, vh: 720, scale: 1, ox: 0, oy: 0, dw: 720, dh: 960, mirror: true };
function setView(sw, sh, mirror){
  VIEW.vw = sw; VIEW.vh = sh; VIEW.mirror = mirror;
  VIEW.scale = Math.max(VIEW.W / sw, VIEW.H / sh);          /* "cover": fills the preview without stretching the face */
  VIEW.dw = sw * VIEW.scale; VIEW.dh = sh * VIEW.scale;
  VIEW.ox = (VIEW.W - VIEW.dw) / 2; VIEW.oy = (VIEW.H - VIEW.dh) / 2;
}
function mapPoint(l, out){                                  /* normalised landmark -> display-space canvas pixel */
  const x = VIEW.ox + l.x * VIEW.dw;
  out.x = VIEW.mirror ? VIEW.W - x : x;
  out.y = VIEW.oy + l.y * VIEW.dh;
  out.z = l.z * VIEW.dw;
  return out;
}

/* ---------- FaceTracker (MediaPipe Face Landmarker) ----------
   The detector sits behind a tiny interface { detectVideo, detectImage, setMode, close } so it can be swapped or mocked. */
class MediaPipeBackend {
  constructor(landmarker){ this.lm = landmarker; this.mode = "VIDEO"; }
  detectVideo(video, ts){ return this.lm.detectForVideo(video, ts)?.faceLandmarks || []; }
  detectImage(img){ return this.lm.detect(img)?.faceLandmarks || []; }
  async setMode(mode){ if(mode !== this.mode){ await this.lm.setOptions({ runningMode: mode }); this.mode = mode; } }
  close(){ try{ this.lm.close(); }catch(_){} }
}
const FaceTracker = {
  state: "idle", backend: null, promise: null, epoch: 0, lastTs: 0,
  async load(){
    if(this.backend) return this.backend;
    if(this.promise) return this.promise;
    const epoch = ++this.epoch, cfg = BUNNY_FILTER.tracker;
    this.state = "loading";
    this.promise = (async () => {
      const t0 = performance.now();
      for(const version of cfg.versions){
        const base = cfg.bundleBase + (version === "latest" ? "" : "@" + version);
        try{
          const mod = await import(base + "/vision_bundle.mjs");
          const files = await mod.FilesetResolver.forVisionTasks(base + "/wasm");
          for(const delegate of ["GPU", "CPU"]){
            try{
              const lm = await mod.FaceLandmarker.createFromOptions(files, {
                baseOptions: { modelAssetPath: cfg.modelUrl, delegate },
                runningMode: "VIDEO",
                numFaces: BUNNY_FILTER.maxFaces,
                minFaceDetectionConfidence: cfg.minConfidence,
                minFacePresenceConfidence: cfg.minConfidence,
                minTrackingConfidence: cfg.minConfidence,
                outputFaceBlendshapes: false,
                outputFacialTransformationMatrixes: false
              });
              if(epoch !== this.epoch){ try{ lm.close(); }catch(_){} throw new Error("tracker closed while loading"); }
              this.backend = new MediaPipeBackend(lm); this.state = "ready";
              ALOG.info("Face tracker initialized", { version, delegate, ms: Math.round(performance.now() - t0) });
              return this.backend;
            }catch(err){
              if(epoch !== this.epoch) throw err;
              ALOG.warn("FaceLandmarker failed", version, delegate, err && err.message || err);
            }
          }
        }catch(err){
          if(epoch !== this.epoch) throw err;
          ALOG.warn("MediaPipe package failed", version, err && err.message || err);
        }
      }
      this.state = "failed";
      ALOG.error("Face tracker initialization failed");
      throw new Error("Face tracker initialization failed");
    })().finally(() => { this.promise = null; });
    return this.promise;
  },
  setBackend(b){ this.epoch++; this.backend = b; this.state = "ready"; },        /* tests / custom detectors */
  get ready(){ return !!this.backend; },
  detectVideo(video, nowMs){
    if(!this.backend) return [];
    this.lastTs = Math.max(this.lastTs + 1, Math.round(nowMs));           /* MediaPipe needs strictly increasing timestamps */
    return this.backend.detectVideo(video, this.lastTs);
  },
  detectImage(img){ return this.backend ? this.backend.detectImage(img) : []; },
  async setMode(mode){ if(this.backend && this.backend.setMode) await this.backend.setMode(mode); },
  close(){                                                                    /* release the detector (WASM/GPU memory) */
    this.epoch++;
    if(this.backend){ try{ this.backend.close && this.backend.close(); }catch(_){} ALOG.info("Face tracker released"); }
    this.backend = null; this.promise = null; this.state = "idle"; this.lastTs = 0;
  }
};

/* ---------- FaceGeometry: filtered key points -> face size, roll/yaw/pitch, anchors ---------- */
const FaceGeometry = {
  /* raw landmarks -> display-space key points (screen-left/right already resolved) */
  extract(lms, out){
    const m = VIEW.mirror ? 1 : 0;                         /* index of the screen-LEFT member of a [imageLeft, imageRight] pair */
    const P = i => lms[i];
    const mp = (name, i) => mapPoint(P(i), out[name]);
    mp("top", LM.top); mp("chin", LM.chin); mp("nose", LM.nose); mp("noseUp", LM.noseUp); mp("noseBase", LM.noseBase);
    mp("lipUp", LM.lipUp); mp("lipLo", LM.lipLo); mp("lipTop", LM.lipTop);
    mp("cL", LM.cheek[m]); mp("cR", LM.cheek[1 - m]);
    mp("mL", LM.mouth[m]); mp("mR", LM.mouth[1 - m]);
    mp("wL", LM.wing[m]);  mp("wR", LM.wing[1 - m]);
    mp("fL", LM.fore[m]);  mp("fR", LM.fore[1 - m]);
    const a = mapPoint(P(LM.eyeOut[m]), this._a), b = mapPoint(P(LM.eyeIn[m]), this._b);
    out.eL.x = (a.x + b.x) / 2; out.eL.y = (a.y + b.y) / 2; out.eL.z = (a.z + b.z) / 2;
    const c = mapPoint(P(LM.eyeOut[1 - m]), this._a), d = mapPoint(P(LM.eyeIn[1 - m]), this._b);
    out.eR.x = (c.x + d.x) / 2; out.eR.y = (c.y + d.y) / 2; out.eR.z = (c.z + d.z) / 2;
  },
  _a: { x: 0, y: 0, z: 0 }, _b: { x: 0, y: 0, z: 0 },

  /* validate: right count, finite numbers, a sensible face size */
  valid(lms){
    if(!lms || lms.length < 468) return false;
    for(const i of [LM.top, LM.chin, LM.nose, 234, 454, 13, 14]){
      const p = lms[i];
      if(!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return false;
    }
    const w = Math.hypot((lms[454].x - lms[234].x) * VIEW.dw, (lms[454].y - lms[234].y) * VIEW.dh);
    return w > 24 && w < Math.max(VIEW.W, VIEW.H) * 3;
  },

  /* K = filtered key points (display space). g = output measurements. All lengths in canvas pixels. */
  measure(K, g, pitchBase){
    const eDx = K.eR.x - K.eL.x, eDy = K.eR.y - K.eL.y, cDx = K.cR.x - K.cL.x, cDy = K.cR.y - K.cL.y;
    const rEye = Math.atan2(eDy, eDx), rCh = Math.atan2(cDy, cDx);
    g.roll = rEye + 0.4 * wrapPi(rCh - rEye);               /* head roll: + = clockwise on screen */
    const cr = Math.cos(g.roll), sr = Math.sin(g.roll);
    g.rx = cr; g.ry = sr;                                   /* face "right" axis on screen */
    g.ux = sr; g.uy = -cr;                                  /* face "up" axis on screen */
    const cheek2 = Math.hypot(cDx, cDy);
    const r3 = clamp(Math.hypot(cDx, cDy, K.cR.z - K.cL.z) / Math.max(1, cheek2), 1, 1.35);
    g.fw = cheek2 * (1 + 0.6 * (r3 - 1));                   /* face width (partly corrected for head turn) */
    g.fh = Math.max(1, dist2(K.top, K.chin));               /* face height */
    const cmx = (K.cL.x + K.cR.x) / 2, cmy = (K.cL.y + K.cR.y) / 2;
    g.yaw = Math.asin(clamp(((K.nose.x - cmx) * cr + (K.nose.y - cmy) * sr) / (0.21 * g.fw), -0.95, 0.95)); /* + = face turned to screen-right */
    const emx = (K.eL.x + K.eR.x) / 2, emy = (K.eL.y + K.eR.y) / 2;
    const mcx = (K.mL.x + K.mR.x) / 2, mcy = (K.mL.y + K.mR.y) / 2;
    const down = (x, y) => x * -g.ux + y * -g.uy;           /* component along face-down */
    const a = down(K.nose.x - emx, K.nose.y - emy), b = Math.max(1, down(mcx - emx, mcy - emy));
    g.pitchRatio = a / b;                                   /* nose height between eyes and mouth: changes when nodding */
    g.pitchRaw = clamp((pitchBase - g.pitchRatio) * 2.6, -0.7, 0.7);       /* + = looking up */
    g.openRaw = dist2(K.lipUp, K.lipLo) / g.fh;             /* mouthOpen = distance(upperLip, lowerLip) / faceHeight */
    g.mouthW = dist2(K.mL, K.mR);
    g.smileRaw = clamp((g.mouthW / g.fw - 0.36) / 0.13, 0, 1);
    g.noseW = Math.max(dist2(K.wL, K.wR), g.fw * 0.17);
    g.depth = 0.5 * VIEW.W / Math.max(1, g.fw);             /* relative camera distance: 1.0 = face is half the frame wide */
    g.cx = (emx + mcx) / 2; g.cy = (emy + mcy) / 2;
  },

  /* ear base anchor for screen side -1 (left) / +1 (right), from forehead landmark + face axes + config */
  earAnchor(side, T, cfgEar, out){
    const E = BUNNY_FILTER.ears;
    const lift = E.baseLift * T.fh * (1 - 0.9 * T.pitch);            /* looking up pulls the ears down a little, looking down raises them */
    const sx = side * E.spread * T.fw + cfgEar.offsetX * T.fw;
    const up = lift - cfgEar.offsetY * T.fw;
    out.x = T.topX + T.rx * sx + T.ux * up;
    out.y = T.topY + T.ry * sx + T.uy * up;
  }
};

/* ---------- EarPhysics: one per ear, fully independent ---------- */
class EarPhysics {
  constructor(side){
    this.side = side;
    this.tilt = new Spring(); this.bend = new Spring(); this.dy = new Spring(); this.dx = new Spring();
    this.px = 0; this.py = 0; this.vx = 0; this.vy = 0; this.ax = 0; this.ay = 0; this.has = false; this.t = 0;
    this.out = { tilt: 0, bend: 0, dx: 0, dy: 0, sx: 1, sy: 1 };
  }
  reset(){
    this.tilt.reset(); this.bend.reset(); this.dy.reset(); this.dx.reset();
    this.has = false; this.vx = this.vy = this.ax = this.ay = 0;
    const o = this.out; o.tilt = o.bend = o.dx = o.dy = 0; o.sx = o.sy = 1;
  }
  /* (x, y) = this frame's ear base position (px); axes = face right/up; fw = face width px */
  step(dt, x, y, rx, ry, ux, uy, fw, cfg, speed){
    const P = BUNNY_FILTER.physics;
    dt = Math.max(dt, 0.004);
    if(!this.has){ this.has = true; this.px = x; this.py = y; }
    /* anchor velocity & acceleration in face-widths per second, low-pass filtered (derivatives amplify noise) */
    const vxw = (x - this.px) / dt / fw, vyw = (y - this.py) / dt / fw;
    this.px = x; this.py = y;
    const kv = expK(14, dt), ka = expK(10, dt);
    const nvx = this.vx + (vxw - this.vx) * kv, nvy = this.vy + (vyw - this.vy) * kv;
    const rax = (nvx - this.vx) / dt, ray = (nvy - this.vy) / dt;
    this.vx = nvx; this.vy = nvy;
    this.ax += (rax - this.ax) * ka; this.ay += (ray - this.ay) * ka;
    const dz = v => { const a = Math.abs(v) - P.deadZone; return a > 0 ? Math.sign(v) * a : 0; };
    const sax = clamp(dz(this.ax * rx + this.ay * ry), -90, 90);             /* along face-right  (+ = accelerating right) */
    const say = clamp(dz(this.ax * ux + this.ay * uy), -60, 60);              /* along face-up     (+ = accelerating up)    */
    const I = P.enabled ? P.intensity : 0;

    /* inertia: when the base accelerates right the ear lags (tilts left), then swings back, overshoots, settles */
    this.tilt.step(0, cfg.spring, cfg.damping, -P.tiltGain * I * cfg.gain * sax, dt);
    this.bend.step(0, cfg.bendSpring, cfg.bendDamping, -P.bendGain * I * cfg.gain * sax * cfg.bend, dt);
    this.dy.step(0, 150, 10.5, -P.bounceGain * I * say, dt);                /* nod -> little bounce */
    this.dx.step(0, 120, 11, -0.08 * I * sax, dt);
    this.tilt.x = clamp(this.tilt.x, -P.maxTilt, P.maxTilt);
    this.bend.x = clamp(this.bend.x, -P.maxBend, P.maxBend);
    this.dy.x = clamp(this.dy.x, -0.06, 0.06);
    this.dx.x = clamp(this.dx.x, -0.04, 0.04);

    /* tiny idle sway, only when the head is calm; asymmetric by phase so the two ears never move in lockstep */
    this.t += dt;
    const calm = 1 - clamp(speed * 1.5, 0, 1);
    const micro = P.enabled ? P.microMotion * calm * Math.sin(this.t * TAU * (0.5 + 0.07 * this.side) + cfg.phase) : 0;

    const o = this.out;
    o.tilt = this.tilt.x + micro;
    o.bend = this.bend.x + micro * 1.4;
    o.dx = this.dx.x; o.dy = this.dy.x;
    o.sy = 1 + clamp(this.dy.x * 0.9, -0.04, 0.04);
    o.sx = 1 - clamp(this.dy.x * 0.5, -0.025, 0.025);
  }
}

/* position + offset expressed in the face's own frame (+X = face-right, +Y = face-down, in face-width units) */
function place(x, y, offX, offY, D, out){
  out.x = x + (D.rx * offX - D.ux * offY) * D.fw;
  out.y = y + (D.ry * offX - D.uy * offY) * D.fw;
  return out;
}
const _pl = { x: 0, y: 0 };

/* ---------- MouthController: mouth landmarks -> teeth transform ---------- */
const MouthController = {
  /* returns the teeth placement from the SMOOTHED pose D */
  teeth(D, cfg, out){
    const open = D.open, smile = D.smile;
    out.w = D.mouthW * cfg.widthFactor * cfg.scale * (1 + 0.10 * smile);        /* smile widens the grin, teeth follow */
    out.sy = 0.70 + 0.30 * open;                                                /* closed = compressed, open = full length */
    place(D.lipX, D.lipY, cfg.offsetX, cfg.offsetY + open * 0.012, D, _pl);     /* teeth hang a touch lower as the lip lifts */
    out.x = _pl.x; out.y = _pl.y;
  }
};

/* ---------- FaceRig: everything that belongs to ONE tracked face ---------- */
const DKEYS = ["fw", "fh", "roll", "yaw", "pitch", "open", "smile", "mouthW", "noseW", "topX", "topY", "noseX", "noseY",
               "muzzleX", "muzzleY", "lipX", "lipY", "alX", "alY", "arX", "arY"];
class FaceRig {
  constructor(index){
    this.index = index;
    this.K = {}; this.fx = {}; this.fy = {};
    for(const k of KEYS){ this.K[k] = { x: 0, y: 0, z: 0 }; this.fx[k] = new OneEuro(BUNNY_FILTER.smoothing.position); this.fy[k] = new OneEuro(BUNNY_FILTER.smoothing.position); }
    this.raw = {}; for(const k of KEYS) this.raw[k] = { x: 0, y: 0, z: 0 };
    this.g = {}; this.T = {}; this.D = {};
    for(const k of DKEYS){ this.T[k] = 0; this.D[k] = 0; }
    this.fRoll = new OneEuro(BUNNY_FILTER.smoothing.rotation); this.fYaw = new OneEuro(BUNNY_FILTER.smoothing.rotation); this.fPitch = new OneEuro(BUNNY_FILTER.smoothing.rotation);
    this.fFw = new OneEuro(BUNNY_FILTER.smoothing.scale); this.fFh = new OneEuro(BUNNY_FILTER.smoothing.scale);
    this.fOpen = new OneEuro(BUNNY_FILTER.smoothing.mouth); this.fSmile = new OneEuro(BUNNY_FILTER.smoothing.mouth);
    this.ears = [new EarPhysics(-1), new EarPhysics(1)];
    this.teeth = { x: 0, y: 0, w: 0, sy: 1, alpha: 1 };
    this.anchor = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    this.pitchBase = 0.55; this.pitchInit = false;
    this.lastSeen = -1e9; this.alpha = 0; this.visible = false; this.hold = false;
    this.rollU = 0; this.rawFace = null; this.speed = 0; this.prevCx = 0; this.prevCy = 0;
    this.detections = 0;
  }
  resetFilters(){
    for(const k of KEYS){ this.fx[k].reset(); this.fy[k].reset(); }
    for(const f of [this.fRoll, this.fYaw, this.fPitch, this.fFw, this.fFh, this.fOpen, this.fSmile]) f.reset();
    for(const e of this.ears) e.reset();
    this.pitchInit = false;
  }
  /* detection domain: new landmarks arrived at time tSec (seconds) / nowMs */
  ingest(lms, tSec, nowMs){
    const reacquire = !this.visible;
    if(reacquire) this.resetFilters();                      /* a face that re-appears never sweeps in from its old position */
    FaceGeometry.extract(lms, this.raw);
    const unit = this.T.fw > 1 ? this.T.fw : Math.max(1, dist2(this.raw.cL, this.raw.cR));
    for(const k of KEYS){
      const r = this.raw[k], f = this.K[k];
      f.x = this.fx[k].filter(r.x, tSec, unit); f.y = this.fy[k].filter(r.y, tSec, unit); f.z = r.z;
    }
    const g = this.g, K = this.K;
    FaceGeometry.measure(K, g, this.pitchBase);
    /* slow auto-calibration of the "neutral" nose height so pitch is relative to how this person sits */
    if(!this.pitchInit){ this.pitchBase = g.pitchRatio; g.pitchRaw = 0; this.pitchInit = true; }
    else if(Math.abs(g.yaw) < 0.3 && g.openRaw < 0.03) this.pitchBase += (g.pitchRatio - this.pitchBase) * 0.01;
    /* unwrap roll so it never jumps by 2*pi */
    if(reacquire) this.rollU = g.roll; else this.rollU += wrapPi(g.roll - this.rollU);
    const T = this.T;
    T.roll = this.fRoll.filter(this.rollU, tSec, 1);
    T.yaw = this.fYaw.filter(g.yaw, tSec, 1);
    T.pitch = this.fPitch.filter(g.pitchRaw, tSec, 1);
    T.fw = Math.exp(this.fFw.filter(Math.log(g.fw), tSec, 1));      /* filter in log space: zooming is multiplicative */
    T.fh = Math.exp(this.fFh.filter(Math.log(g.fh), tSec, 1));
    T.open = this.fOpen.filter(smoothstep(0.012, 0.115, g.openRaw), tSec, 1);
    T.smile = this.fSmile.filter(g.smileRaw, tSec, 1);
    T.mouthW = g.mouthW * (T.fw / Math.max(1, g.fw));
    T.noseW = g.noseW * (T.fw / Math.max(1, g.fw));
    T.topX = K.top.x; T.topY = K.top.y;
    /* nose sits on the real nose tip; the muzzle between nose base and upper lip; teeth on the upper lip */
    T.noseX = lerp(K.nose.x, K.noseUp.x, 0.2); T.noseY = lerp(K.nose.y, K.noseUp.y, 0.2);
    T.muzzleX = (K.noseBase.x + K.lipTop.x) / 2; T.muzzleY = (K.noseBase.y + K.lipTop.y) / 2;
    T.lipX = (K.lipUp.x + K.lipLo.x) / 2; T.lipY = K.lipUp.y;
    /* ear anchors need the (target) face axes */
    T.rx = Math.cos(T.roll); T.ry = Math.sin(T.roll); T.ux = Math.sin(T.roll); T.uy = -Math.cos(T.roll);
    FaceGeometry.earAnchor(-1, T, BUNNY_FILTER.ears.left, this.anchor[0]);
    FaceGeometry.earAnchor(1, T, BUNNY_FILTER.ears.right, this.anchor[1]);
    T.alX = this.anchor[0].x; T.alY = this.anchor[0].y; T.arX = this.anchor[1].x; T.arY = this.anchor[1].y;

    if(reacquire){ for(const k of DKEYS) this.D[k] = T[k]; this.alpha = 0; this.visible = true; this.speed = 0; this.prevCx = T.noseX; this.prevCy = T.noseY; ALOG.info("Face detected"); }
    this.lastSeen = nowMs; this.detections++;
  }
  /* frame domain: follow targets, handle lost-face fade, run physics */
  update(nowMs, dt){
    if(!this.visible) return;
    const D = this.D, T = this.T, k = expK(BUNNY_FILTER.smoothing.renderFollowHz, dt);
    for(const key of DKEYS) D[key] += (T[key] - D[key]) * k;
    D.rx = Math.cos(D.roll); D.ry = Math.sin(D.roll); D.ux = Math.sin(D.roll); D.uy = -Math.cos(D.roll);

    /* lost face: hold the last pose briefly, fade out, hide; fade in again when found */
    const L = BUNNY_FILTER.lostFace, age = nowMs - this.lastSeen;
    this.hold = age > 90;
    const want = age <= L.holdMs ? 1 : Math.max(0, 1 - (age - L.holdMs) / L.fadeMs);
    this.alpha = Math.min(want, this.alpha + dt * 1000 / L.fadeInMs);
    if(want <= 0 && this.alpha <= 0.001){ this.visible = false; this.alpha = 0; for(const e of this.ears) e.reset(); return; }

    /* overall head speed (face-widths / s) lets the idle sway fade out while moving */
    const sp = Math.hypot(D.noseX - this.prevCx, D.noseY - this.prevCy) / dt / Math.max(1, D.fw);
    this.speed += (sp - this.speed) * expK(8, dt); this.prevCx = D.noseX; this.prevCy = D.noseY;

    /* ear anchors from the smoothed pose, then independent physics per ear */
    const E = BUNNY_FILTER.ears;
    FaceGeometry.earAnchor(-1, D, E.left, this.anchor[0]);
    FaceGeometry.earAnchor(1, D, E.right, this.anchor[1]);
    this.ears[0].step(dt, this.anchor[0].x, this.anchor[0].y, D.rx, D.ry, D.ux, D.uy, D.fw, E.left, this.speed);
    this.ears[1].step(dt, this.anchor[1].x, this.anchor[1].y, D.rx, D.ry, D.ux, D.uy, D.fw, E.right, this.speed);
    MouthController.teeth(D, BUNNY_FILTER.teeth, this.teeth);
  }
}

/* ---------- Renderer ---------- */
const Renderer = {
  cvs: null, ctx: null, dpr: 1, dirty: true,
  /* sprite tint for transparent parts is baked in the images; nothing is recoloured at runtime */
  drawBackground(source, sw, sh, mirror){
    const c = this.ctx;
    setView(sw, sh, mirror);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = "#20151d"; c.fillRect(0, 0, VIEW.W, VIEW.H);
    c.save();
    if(mirror){ c.translate(VIEW.W, 0); c.scale(-1, 1); }                 /* draw mirrored; the cover box is centred so the same box works flipped */
    c.drawImage(source, VIEW.ox, VIEW.oy, VIEW.dw, VIEW.dh);
    c.restore();
  },
  /* An image drawn as a vertical chain of strips that bend towards the tip: the base stays put, the tip lags behind. */
  drawBent(key, pivot, x, y, H, rot, bend, sx, sy, segs, alpha){
    const probe = AssetStore.items[key]; if(!probe || !probe.ready) return;
    const img = AssetStore.pick(key, H / imgH(probe.levels[0].img));
    const iw = imgW(img), ih = imgH(img), k = H / ih, W = iw * k * sx;
    const py = ih * pivot.y, segH = py / segs, ext = Math.max(1.5, segH * 0.18);
    const c = this.ctx, dh = segH * k * sy, px = pivot.x * W;
    c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot);
    /* rigid root: the faded base below the pivot */
    c.drawImage(img, 0, py - ext, iw, ih - py + ext, -px, -ext * k * sy, W, (ih - py + ext) * k * sy);
    let jx = 0, jy = 0;
    for(let i = 0; i < segs; i++){
      const phi = bend * Math.pow((i + 0.5) / segs, 1.7);                  /* angle grows towards the tip */
      const srcTop = py - (i + 1) * segH;
      c.save(); c.translate(jx, jy); c.rotate(phi);
      c.drawImage(img, 0, srcTop, iw, segH + ext, -px, -dh, W, dh + ext * k * sy);   /* +ext overlaps the strip below: no seams */
      c.restore();
      jx += Math.sin(phi) * dh; jy -= Math.cos(phi) * dh;
    }
    c.restore();
  },
  drawSprite(key, anchor, x, y, w, rot, sx, sy, alpha){
    const probe = AssetStore.items[key]; if(!probe || !probe.ready || w < 1) return;
    const img = AssetStore.pick(key, w / imgW(probe.levels[0].img));
    const k = w / imgW(img), h = imgH(img) * k;
    const c = this.ctx;
    c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot); c.scale(sx, sy);
    c.drawImage(img, -anchor.x * w, -anchor.y * h, w, h);
    c.restore();
  },
  drawRig(rig){
    const D = rig.D, A = BUNNY_FILTER.anchors, B = BUNNY_FILTER, c = this.ctx;
    const a = rig.alpha; if(a <= 0.003) return;
    const persp = clamp(D.yaw, -0.9, 0.9);

    /* 1) muzzle (soft pads) -> 2) nose -> 3) teeth: all on their own landmarks, rotated with the head */
    if(B.muzzle.enabled && AssetStore.items.muzzle.ready){
      const w = D.mouthW * 1.12 * B.muzzle.scale * (1 - Math.abs(persp) * 0.2);
      place(D.muzzleX, D.muzzleY, B.muzzle.offsetX, B.muzzle.offsetY, D, _pl);
      this.drawSprite("muzzle", A.muzzle, _pl.x, _pl.y, w, D.roll, 1, 1, a * B.muzzle.alpha);
    }
    place(D.noseX, D.noseY, B.nose.offsetX, B.nose.offsetY, D, _pl);
    this.drawSprite("nose", A.nose, _pl.x, _pl.y, D.noseW * B.nose.widthFactor * B.nose.scale, D.roll, 1, 1, a);
    const t = rig.teeth;
    this.drawSprite("teeth", A.teeth, t.x, t.y, t.w, D.roll, 1, t.sy, a);

    /* 4) ears: each with its own anchor, rotation, stretch and bend */
    const E = B.ears, names = ["leftEar", "rightEar"], cfgs = [E.left, E.right];
    for(let i = 0; i < 2; i++){
      const side = i === 0 ? -1 : 1, cfg = cfgs[i], ep = rig.ears[i].out, asset = AssetStore.items[names[i]];
      if(!asset || !asset.ready) continue;
      const depthScale = 1 - side * persp * 0.12;                              /* the far ear shrinks a little when the head turns */
      const pitchSq = 1 - 0.25 * Math.abs(D.pitch);
      const H = D.fw * E.height * E.scale * cfg.scale * depthScale * pitchSq * ep.sy;
      const ax = rig.anchor[i].x + D.rx * ep.dx * D.fw + D.ux * ep.dy * D.fw;
      const ay = rig.anchor[i].y + D.ry * ep.dx * D.fw + D.uy * ep.dy * D.fw;
      const rot = D.roll + cfg.rotation + ep.tilt + persp * 0.05 * side;
      this.drawBent(names[i], A[names[i]], ax, ay, H, rot, ep.bend, ep.sx, 1, E.segments, a);
    }
  },
  drawDebug(rigs, stats){
    const c = this.ctx;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
    c.font = "bold " + Math.round(VIEW.W / 46) + "px ui-monospace,Menlo,monospace"; c.lineWidth = Math.max(1, VIEW.W / 360);
    const lh = Math.round(VIEW.W / 40); let ty = lh;
    const line = s => { c.fillStyle = "rgba(0,0,0,.55)"; c.fillRect(6, ty - lh + 4, c.measureText(s).width + 10, lh); c.fillStyle = "#9dffc7"; c.fillText(s, 11, ty); ty += lh; };
    for(const rig of rigs){
      if(!rig.visible) continue;
      const K = rig.K, D = rig.D, rr = Math.max(2, VIEW.W / 200);
      /* every landmark of the last detection */
      if(rig.rawFace){
        c.fillStyle = "rgba(120,255,200,.55)";
        const p = { x: 0, y: 0, z: 0 };
        for(let i = 0; i < rig.rawFace.length; i += 1){ mapPoint(rig.rawFace[i], p); c.fillRect(p.x - 1, p.y - 1, 2, 2); }
      }
      /* face bounding box from the key points */
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for(const k of KEYS){ x0 = Math.min(x0, K[k].x); x1 = Math.max(x1, K[k].x); y0 = Math.min(y0, K[k].y); y1 = Math.max(y1, K[k].y); }
      c.strokeStyle = "rgba(255,255,255,.8)"; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
      const dot = (x, y, col, r) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r || rr, 0, TAU); c.fill(); };
      dot(D.noseX, D.noseY, "#ff4b89", rr * 1.6);                                  /* nose anchor */
      dot(K.lipUp.x, K.lipUp.y, "#ffd54a"); dot(K.lipLo.x, K.lipLo.y, "#ffd54a"); dot(K.mL.x, K.mL.y, "#ffd54a"); dot(K.mR.x, K.mR.y, "#ffd54a"); /* mouth */
      dot(rig.anchor[0].x, rig.anchor[0].y, "#58d6ff", rr * 1.6); dot(rig.anchor[1].x, rig.anchor[1].y, "#58d6ff", rr * 1.6);                     /* ear anchors */
      dot(rig.g.cx, rig.g.cy, "#ffffff", rr * 1.4);                                /* face centre */
      c.strokeStyle = "#ff4b89"; c.beginPath(); c.moveTo(D.noseX, D.noseY); c.lineTo(D.noseX + D.ux * D.fw * 0.5, D.noseY + D.uy * D.fw * 0.5); c.stroke(); /* face-up axis */
      line("roll " + (D.roll * 57.3).toFixed(1) + "°  yaw " + (D.yaw * 57.3).toFixed(0) + "°  pitch " + (D.pitch * 57.3).toFixed(0) + "°");
      line("face " + D.fw.toFixed(0) + "x" + D.fh.toFixed(0) + "px  depth " + rig.g.depth.toFixed(2) + "  mouthOpen " + rig.g.openRaw.toFixed(3) + " (" + D.open.toFixed(2) + ")");
      line("confidence " + rig.alpha.toFixed(2) + (rig.hold ? " (holding)" : "") + "  earL tilt " + rig.ears[0].out.tilt.toFixed(2) + " bend " + rig.ears[0].out.bend.toFixed(2));
    }
    line("fps " + stats.fps.toFixed(0) + "  detect " + stats.detectMs.toFixed(1) + "ms  mirror " + VIEW.mirror + "  view " + VIEW.W + "x" + VIEW.H + "  video " + VIEW.vw + "x" + VIEW.vh);
    c.restore();
  }
};

/* ---------- element handles ---------- */
const canvas = g("sn-canvas"), video = g("sn-video");
const ctx = canvas.getContext("2d", { alpha: false });                      /* no `desynchronized`: it can flicker / break capture on some Android GPUs */
Renderer.cvs = canvas; Renderer.ctx = ctx;
const wrap = g("sn-wrap"), guide = g("sn-guide");
const statusEl = g("sn-status"), shutter = g("sn-shutter"), pick = g("sn-pick");
const switchBtn = g("sn-switchcam"), closeBtn = g("sn-closecam");
video.muted = true; video.playsInline = true; video.autoplay = true;
video.setAttribute("playsinline", ""); video.setAttribute("muted", ""); video.setAttribute("autoplay", "");

let lastStatus = "";
function setStatus(t){ if(lastStatus !== t){ lastStatus = t; statusEl.textContent = t; } }
function setPick(on){
  pick.hidden = !on; pick.style.display = on ? "inline-block" : "none";
  const r = g("sn-retry"); r.hidden = !on; r.style.display = on ? "inline-block" : "none";
}

/* canvas backing size = preview size x devicePixelRatio, capped so phones never render a giant canvas */
function syncCanvasSize(){
  const r = wrap.getBoundingClientRect();
  if(!r.width || !r.height) return false;
  const dpr = Math.min(window.devicePixelRatio || 1, BUNNY_FILTER.render.dprCap);
  let w = r.width * dpr, h = r.height * dpr;
  const long = Math.max(w, h), cap = BUNNY_FILTER.render.maxLongSide;
  if(long > cap){ w *= cap / long; h *= cap / long; }
  w = Math.max(2, Math.round(w)); h = Math.max(2, Math.round(h));
  if(canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }   /* only touch the backing store when it really changed */
  VIEW.W = w; VIEW.H = h;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  Renderer.dirty = false;
  return true;
}
if(window.ResizeObserver) new ResizeObserver(() => { Renderer.dirty = true; }).observe(wrap);
addEventListener("resize", () => { Renderer.dirty = true; });
addEventListener("orientationchange", () => { Renderer.dirty = true; setTimeout(() => { Renderer.dirty = true; }, 250); });

/* ---------- FilterController: owns the rigs, the single render loop, and the status text ---------- */
const rigs = Array.from({ length: Math.max(1, BUNNY_FILTER.maxFaces) }, (_, i) => new FaceRig(i));
const FilterController = {
  running: false, raf: 0, mode: "video", lastNow: 0, lastDetect: 0, detectInterval: 1000 / BUNNY_FILTER.tracker.maxFps, detectMs: 0,
  frameDirty: true, rvfc: 0, frames: 0, fpsT: 0, fps: 0, gotFrame: false, errLogged: false, lockedFrames: 0, statusT: 0,
  capturing: false,

  /* ----- start / stop the single render loop ----- */
  startTracking(){
    this.stopTracking();                                                     /* never two loops */
    this.running = true; this.gotFrame = false; this.lastNow = 0; this.lastDetect = 0; this.frameDirty = true;
    if(video.requestVideoFrameCallback){
      const cb = () => { this.frameDirty = true; this.rvfc = video.requestVideoFrameCallback(cb); };
      this.rvfc = video.requestVideoFrameCallback(cb);
    }
    this.raf = requestAnimationFrame(t => this.renderFrame(t));
  },
  stopTracking(){
    this.running = false;
    if(this.raf){ cancelAnimationFrame(this.raf); this.raf = 0; }
    if(this.rvfc && video.cancelVideoFrameCallback){ try{ video.cancelVideoFrameCallback(this.rvfc); }catch(_){} }
    this.rvfc = 0;
    for(const r of rigs){ r.visible = false; r.alpha = 0; r.resetFilters(); }
  },

  /* ----- pick which detected face goes to which rig (closest/largest first; sticky once locked) ----- */
  assign(faces, tSec, nowMs){
    const items = [];
    const p = { x: 0, y: 0, z: 0 }, q = { x: 0, y: 0, z: 0 };
    for(const f of faces){
      if(!FaceGeometry.valid(f)) continue;
      mapPoint(f[234], p); mapPoint(f[454], q); mapPoint(f[LM.nose], this._n || (this._n = { x: 0, y: 0, z: 0 }));
      items.push({ f, size: Math.hypot(p.x - q.x, p.y - q.y), x: this._n.x, y: this._n.y, used: false });
    }
    items.sort((a, b) => b.size - a.size);
    const free = [];
    for(const rig of rigs){                                                   /* keep each active rig on the face nearest to where it was */
      if(!rig.visible){ free.push(rig); continue; }
      let best = null, bd = 1e9;
      for(const it of items){ if(it.used) continue; const d = Math.hypot(it.x - rig.D.noseX, it.y - rig.D.noseY) / Math.max(rig.D.fw, it.size); if(d < bd){ bd = d; best = it; } }
      if(best && bd < 1.6){ best.used = true; rig.rawFace = best.f; rig.ingest(best.f, tSec, nowMs); }
    }
    for(const it of items){
      if(it.used) continue;
      const rig = free.shift(); if(!rig) break;
      it.used = true; rig.rawFace = it.f; rig.ingest(it.f, tSec, nowMs);
    }
  },

  /* ----- one frame: video -> (detect) -> smooth -> physics -> draw ----- */
  renderFrame(now){
    if(!this.running) return;
    this.raf = requestAnimationFrame(t => this.renderFrame(t));
    try{
      if(Renderer.dirty) syncCanvasSize();
      if(video.readyState < 2 || !video.videoWidth || !VIEW.W) return;
      const dt = clamp(this.lastNow ? (now - this.lastNow) / 1000 : 1 / 60, 0.001, 0.05); this.lastNow = now;

      setView(video.videoWidth, video.videoHeight, CameraManager.mirror);   /* mapping must exist BEFORE we convert landmarks */
      let detected = false;
      if(FaceTracker.ready && now - this.lastDetect >= this.detectInterval && (this.frameDirty || now - this.lastDetect > 120)){
        this.frameDirty = false; this.lastDetect = now;
        const t0 = performance.now();
        try{
          const faces = FaceTracker.detectVideo(video, t0);
          this.assign(faces, t0 / 1000, now);
          detected = faces.length > 0;
        }catch(err){ if(!this.errLogged){ this.errLogged = true; ALOG.error("Face detection error", err); } }
        const ms = performance.now() - t0;
        this.detectMs += (ms - this.detectMs) * 0.2;
        this.detectInterval = clamp(this.detectMs * 1.4, 1000 / BUNNY_FILTER.tracker.maxFps, 90);   /* adapt to slow phones */
      }
      for(const r of rigs) r.update(now, dt);

      Renderer.drawBackground(video, video.videoWidth, video.videoHeight, CameraManager.mirror);
      if(!this.gotFrame){ this.gotFrame = true; ALOG.info("Rendering started"); }
      for(const r of rigs) if(r.visible) Renderer.drawRig(r);

      this.frames++;
      if(now - this.fpsT > 1000){ this.fps = this.frames * 1000 / (now - this.fpsT); this.frames = 0; this.fpsT = now; }
      if(DEBUG_AR) Renderer.drawDebug(rigs, { fps: this.fps, detectMs: this.detectMs });
      this.updateStatus(now);
    }catch(err){
      if(!this.errLogged){ this.errLogged = true; ALOG.error("Render error", err); }
    }
  },
  /* status line + shutter state (throttled so the DOM isn't touched every frame) */
  updateStatus(now){
    if(now - this.statusT < 120) return; this.statusT = now;
    if(!FaceTracker.ready){
      if(FaceTracker.state === "failed"){ setStatus("The face filter couldn't load (check your internet). You can still take a normal pic 📸"); shutter.disabled = false; }
      else { setStatus("Loading the bunny filter… 🐰"); shutter.disabled = true; }
      return;
    }
    const locked = rigs.some(r => r.visible && r.alpha > 0.6);
    setStatus(locked ? "Face locked — smile! 🐰" : "Looking for your face… move into view");
    shutter.disabled = !locked || this.capturing;
    if(guide) guide.classList.toggle("on", !locked);
  },
  /* draw one still image with the filter (phone-camera fallback) */
  async renderStill(img){
    syncCanvasSize();
    Renderer.drawBackground(img, img.naturalWidth, img.naturalHeight, false);
    await FaceTracker.setMode("IMAGE");
    let faces = [];
    try{ faces = FaceTracker.detectImage(img); } finally { try{ await FaceTracker.setMode("VIDEO"); }catch(_){ } }
    for(const r of rigs){ r.visible = false; r.resetFilters(); }
    this.assign(faces, performance.now() / 1000, performance.now());
    const rig = rigs.find(r => r.visible);
    if(!rig) return false;
    for(const k of DKEYS) rig.D[k] = rig.T[k];                                 /* stills: no smoothing, no lag */
    rig.D.rx = Math.cos(rig.D.roll); rig.D.ry = Math.sin(rig.D.roll); rig.D.ux = Math.sin(rig.D.roll); rig.D.uy = -Math.cos(rig.D.roll);
    rig.alpha = 1; rig.lastSeen = performance.now();
    const E = BUNNY_FILTER.ears;
    FaceGeometry.earAnchor(-1, rig.D, E.left, rig.anchor[0]); FaceGeometry.earAnchor(1, rig.D, E.right, rig.anchor[1]);
    MouthController.teeth(rig.D, BUNNY_FILTER.teeth, rig.teeth);
    Renderer.drawRig(rig);
    if(DEBUG_AR) Renderer.drawDebug(rigs, { fps: 0, detectMs: 0 });
    return true;
  }
};
function renderFrame(now){ FilterController.renderFrame(now); }               /* spec'd entry points, kept as plain functions too */
function startTracking(){ FilterController.startTracking(); }
function stopTracking(){ FilterController.stopTracking(); }

/* ---------- CameraManager: permission, stream, switching, clean release ---------- */
const CameraManager = {
  stream: null, facing: BUNNY_FILTER.camera.facing, deviceId: "", mirror: true, token: 0, switching: false, suspended: false, devices: 0,

  /* readable messages for every failure we know about */
  message(err){
    const n = (err && err.name) || "";
    if(!window.isSecureContext || n === "SecurityError") return "The camera needs a secure page (https:// or localhost). Please open the hosted https link 🔒";
    if(n === "NotAllowedError" || n === "PermissionDeniedError") return "Camera permission is blocked. Tap the 🔒 icon in the address bar, allow the camera, then press Try again.";
    if(n === "NotFoundError" || n === "DevicesNotFoundError") return "No camera was found on this device.";
    if(n === "NotReadableError" || n === "TrackStartError" || n === "AbortError") return "The camera is busy in another app or tab. Close it and try again.";
    if(n === "OverconstrainedError") return "That camera mode isn't available. Try switching cameras.";
    if(n === "NotSupportedError" || n === "TypeError") return "This browser can't use the live camera here.";
    if(n === "TimeoutError") return "The camera opened but no picture arrived. Please try again.";
    return "Could not open the camera" + (n ? " (" + n + ")" : "") + ".";
  },
  logError(err){
    const n = (err && err.name) || "";
    if(n === "NotAllowedError" || n === "PermissionDeniedError") ALOG.error("Camera permission denied");
    else if(n === "NotFoundError" || n === "DevicesNotFoundError") ALOG.error("No camera found");
    else if(n === "NotReadableError" || n === "TrackStartError") ALOG.error("Camera already in use");
    else if(n === "SecurityError" || !window.isSecureContext) ALOG.error("Insecure context: camera needs https or localhost");
    else ALOG.error("Camera error: " + (n || (err && err.message) || "unknown"));
  },
  async request(){
    if(!window.isSecureContext) throw Object.assign(new Error("insecure"), { name: "SecurityError" });
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw Object.assign(new Error("unsupported"), { name: "NotSupportedError" });
    const portrait = innerHeight > innerWidth;
    const size = portrait ? { width: { ideal: 720 }, height: { ideal: 1280 } } : { width: { ideal: 1280 }, height: { ideal: 720 } };
    const fr = { frameRate: { ideal: BUNNY_FILTER.camera.maxFrameRate } };
    const tries = [];
    if(this.deviceId) tries.push({ video: Object.assign({ deviceId: { exact: this.deviceId } }, size, fr), audio: false });
    tries.push({ video: Object.assign({ facingMode: { ideal: this.facing } }, size, fr), audio: false },
               { video: { facingMode: { ideal: this.facing } }, audio: false },
               { video: true, audio: false });
    let last = null;
    for(const constraints of tries){
      try{
        ALOG.info("Requesting camera", JSON.stringify(constraints.video));
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        if(!s.getVideoTracks().length){ s.getTracks().forEach(t => t.stop()); throw Object.assign(new Error("no video track"), { name: "NotReadableError" }); }
        return s;
      }catch(err){
        last = err; ALOG.warn("getUserMedia attempt failed", err && err.name, err && err.message);
        if(["NotAllowedError", "PermissionDeniedError", "SecurityError", "NotFoundError"].includes(err && err.name)) break;   /* retrying can't help */
      }
    }
    throw last || Object.assign(new Error("camera failed"), { name: "NotReadableError" });
  },
  release(){                                                                    /* stop every track, detach the video: the camera light goes off */
    if(this.stream){ this.stream.getTracks().forEach(t => { t.onended = null; try{ t.stop(); }catch(_){} }); this.stream = null; }
    try{ video.pause(); }catch(_){}
    video.srcObject = null; video.removeAttribute("src");
  },
  async countDevices(){
    try{ this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput").length; }catch(_){ this.devices = 0; }
    switchBtn.disabled = !(this.devices > 1);
  },
  async nextDevice(){
    const list = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput");
    if(list.length < 2){ this.facing = this.facing === "user" ? "environment" : "user"; this.deviceId = ""; return; }
    const isBack = d => /back|rear|environment|world/i.test(d.label || "");
    const cur = this.deviceId || (this.stream && this.stream.getVideoTracks()[0].getSettings().deviceId) || "";
    let idx = list.findIndex(d => d.deviceId === cur);
    if(idx < 0) idx = Math.max(0, list.findIndex(d => isBack(d) === (this.facing === "environment")));   /* id unknown: fall back to the facing we think we have */
    const next = list[(idx + 1) % list.length];
    this.deviceId = next.deviceId;
    this.facing = isBack(next) ? "environment" : "user";
  }
};

let photoURL = "", photoBlob = null;

function camFail(err){
  CameraManager.logError(err);
  stopCameraAll(true);
  wrap.hidden = true; shutter.disabled = true; setPick(true);
  setStatus(CameraManager.message(err));
}

/* stop stream + loop (+ optionally release the detector). Safe to call any time, any number of times. */
function stopCameraAll(disposeTracker){
  FilterController.stopTracking();
  CameraManager.release();
  if(disposeTracker) FaceTracker.close();
  if(guide) guide.classList.remove("on");
  switchBtn.disabled = true;
}

/* CLICK -> permission -> getUserMedia -> attach -> metadata -> play -> tracker -> render loop */
async function openCamera(){
  ALOG.info("Camera button clicked");
  const token = ++CameraManager.token;
  FilterController.mode = "video";
  stopCameraAll(false);                                                        /* no duplicate streams or loops */
  show("sn-cam"); wrap.hidden = false; setPick(false); shutter.disabled = true;
  setStatus("Opening camera… 📷");
  Renderer.dirty = true; syncCanvasSize();
  FaceTracker.load().catch(() => {});                                          /* start loading the tracker in parallel with the permission prompt */
  AssetStore.loadAll().catch(() => {});

  const s = await CameraManager.request();
  if(token !== CameraManager.token){ s.getTracks().forEach(t => t.stop()); return; }
  CameraManager.stream = s;
  const track = s.getVideoTracks()[0], st = (track.getSettings && track.getSettings()) || {};
  CameraManager.deviceId = st.deviceId || CameraManager.deviceId;
  if(st.facingMode) CameraManager.facing = st.facingMode;
  else if(/back|rear|environment|world/i.test(track.label || "")) CameraManager.facing = "environment";
  CameraManager.mirror = CameraManager.facing !== "environment";               /* selfie preview is mirrored, the rear camera is not */
  ALOG.info("Camera stream received", st.width + "x" + st.height, "facing=" + CameraManager.facing, "mirror=" + CameraManager.mirror);
  track.onended = () => { if(CameraManager.stream === s) camFail(Object.assign(new Error("camera stopped"), { name: "NotReadableError" })); };

  video.srcObject = s;
  await new Promise((resolve, reject) => {
    let done = false;
    const finish = (fn, v) => { if(done) return; done = true; clearTimeout(timer); video.removeEventListener("loadedmetadata", onMeta); video.removeEventListener("loadeddata", onMeta); fn(v); };
    const onMeta = () => { if(video.videoWidth > 0){ ALOG.info("Video metadata loaded", video.videoWidth + "x" + video.videoHeight); finish(resolve); } };
    const timer = setTimeout(() => finish(reject, Object.assign(new Error("video metadata timeout"), { name: "TimeoutError" })), 8000);
    video.addEventListener("loadedmetadata", onMeta); video.addEventListener("loadeddata", onMeta); onMeta();
  });
  if(token !== CameraManager.token) return;
  try{ await video.play(); }
  catch(err){ if(token !== CameraManager.token) return; ALOG.error("Video playback failed", err && err.name); video.muted = true; await video.play(); }
  if(token !== CameraManager.token) return;
  ALOG.info("Video playback started");

  CameraManager.countDevices();
  setStatus(FaceTracker.ready ? "Looking for your face… 🐰" : "Loading the bunny filter… 🐰");
  FilterController.startTracking();                                            /* live preview right away; the filter joins as soon as the tracker is ready */
  setTimeout(() => {                                                           /* no picture after 7 s = something is wrong with the camera */
    if(token === CameraManager.token && FilterController.running && !FilterController.gotFrame) camFail(Object.assign(new Error("no frames"), { name: "TimeoutError" }));
  }, 7000);
}
const safeOpenCamera = () => openCamera().catch(err => camFail(err));

function closeCamera(){
  CameraManager.token++;
  CameraManager.suspended = false;
  stopCameraAll(true);                                                         /* releases the camera AND the detector */
  ALOG.info("Camera stopped");
  show("sn-open"); setStatus("");
}

async function switchCamera(){
  if(CameraManager.switching || !CameraManager.stream) return;
  CameraManager.switching = true; switchBtn.disabled = true;
  const prev = { facing: CameraManager.facing, deviceId: CameraManager.deviceId };
  try{
    await CameraManager.nextDevice();
    ALOG.info("Switching camera", CameraManager.facing);
    await openCamera();
  }catch(err){
    ALOG.warn("Switch failed, going back", err && err.name);
    CameraManager.facing = prev.facing; CameraManager.deviceId = prev.deviceId;
    try{ await openCamera(); }catch(e2){ camFail(e2); }
  }finally{ CameraManager.switching = false; }
}

/* ---------- CaptureManager: the shutter saves exactly what is on the canvas (video + ears + nose + teeth) ---------- */
const CaptureManager = {
  capture(){
    if(shutter.disabled || FilterController.capturing) return;
    FilterController.capturing = true; shutter.disabled = true;
    const fl = g("sn-flash"); fl.classList.remove("go"); void fl.offsetWidth; fl.classList.add("go");
    let settled = false;
    const fail = why => {
      if(settled) return; settled = true;
      FilterController.capturing = false; shutter.disabled = false;
      ALOG.error("Capture failed: " + why);
      setStatus("I couldn't save the pic 😔 try again");
    };
    const guard = setTimeout(() => fail("toBlob timed out"), 6000);
    /* the canvas always holds a complete frame (video + ears + nose + teeth); toBlob snapshots it, so tracking is never interrupted */
    try{
      canvas.toBlob(blob => {
        if(settled) return;
        clearTimeout(guard);
        if(!blob) return fail("empty blob");
        settled = true; FilterController.capturing = false;
        if(photoURL) URL.revokeObjectURL(photoURL);
        photoBlob = blob; photoURL = URL.createObjectURL(blob);
        dlog("photo " + Math.round(blob.size / 1024) + " KB");
        g("sn-photo").src = photoURL; g("sn-save").href = photoURL;
        ALOG.info("Filtered frame captured", canvas.width + "x" + canvas.height);
        stopCameraAll(false);                                                  /* camera off, detector kept warm for a quick retake */
        show("sn-res");
      }, "image/jpeg", 0.92);
    }catch(err){ clearTimeout(guard); fail(err && err.message || err); }
  }
};
shutter.addEventListener("click", () => CaptureManager.capture());

/* ---------- wiring ---------- */
g("sn-opencam").addEventListener("click", safeOpenCamera);
g("sn-retry").addEventListener("click", safeOpenCamera);
switchBtn.addEventListener("click", switchCamera);
closeBtn.addEventListener("click", closeCamera);
/* pause the camera while the page is hidden (battery + privacy) and bring it back on return */
document.addEventListener("visibilitychange", () => {
  const inCam = g("sn-cam").classList.contains("on") && snap.classList.contains("on");
  if(document.hidden){
    if(inCam && CameraManager.stream && FilterController.mode === "video"){ CameraManager.suspended = true; CameraManager.token++; stopCameraAll(false); ALOG.info("Camera paused (page hidden)"); }
  }else if(CameraManager.suspended){
    CameraManager.suspended = false;
    if(inCam) safeOpenCamera();
  }
});
addEventListener("pagehide", () => { stopCameraAll(true); });

/* ---- fallback: take a pic with the phone's own camera app, the filter is added on top of it ---- */
g("sn-file").addEventListener("change", e => {
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if(!f) return;
  const url = URL.createObjectURL(f), img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); useStill(img); };
  img.onerror = () => { URL.revokeObjectURL(url); setStatus("I couldn't read that photo 😔 try another one?"); };
  img.src = url;
});
async function useStill(img){
  CameraManager.token++;
  stopCameraAll(false);
  FilterController.mode = "still";
  show("sn-cam"); wrap.hidden = false; setPick(false); shutter.disabled = true;
  setStatus("Finding a face in your photo… 🐰");
  try{
    await Promise.all([AssetStore.loadAll(), FaceTracker.load()]);
    const ok = await FilterController.renderStill(img);
    if(!ok){ setStatus("I couldn't find a face in that photo. Please choose another one."); setPick(true); return; }
    shutter.disabled = false; setStatus("Face locked — tap the shutter 📸");
  }catch(err){
    setStatus("The face tracker could not load. Please try the live camera again."); setPick(true);
    ALOG.error("Still-image AR failed", err);
  }
}

/* console helpers for tuning:  BUNNY_AR.config.ears.left.offsetY = 0.05  /  BUNNY_AR.setDebug(true) */
window.BUNNY_AR = {
  config: BUNNY_FILTER,
  setDebug(on){ DEBUG_AR = !!on; },
  tracker: FaceTracker, rigs, view: VIEW, camera: CameraManager, controller: FilterController, renderer: Renderer,
  open: safeOpenCamera, close: closeCamera
};

/* =====================================================================
   3) RESULT  -  retake / save / continue
===================================================================== */
function clearPhoto(){ if(photoURL) URL.revokeObjectURL(photoURL); photoURL = ""; photoBlob = null; g("sn-photo").removeAttribute("src"); g("sn-save").href = "#"; }
g("sn-retake").addEventListener("click", () => { clearPhoto(); safeOpenCamera(); });
g("sn-next").addEventListener("click", () => { g("sn-attach-row").hidden = !photoBlob; show("sn-fb"); heartRain(22); });

/* =====================================================================
   4) THANKS + FEEDBACK
===================================================================== */
let rating = 0;
const stars = [...document.querySelectorAll("#sn-stars button")];
const ta = g("sn-ta"), note = g("sn-note"), sendBtn = g("sn-send");
function paintStars(){ stars.forEach(b => b.classList.toggle("on", +b.dataset.v <= rating)); }
stars.forEach(b => b.addEventListener("click", () => { rating = +b.dataset.v; paintStars(); note.textContent = ""; }));

async function deliver(msg){
  if(FEEDBACK_WHATSAPP){
    const url = "https://wa.me/" + FEEDBACK_WHATSAPP.replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
    const w = window.open(url, "_blank");
    if(!w) location.href = url;
    return "wa";
  }
  if(FEEDBACK_EMAIL){
    location.href = "mailto:" + FEEDBACK_EMAIL + "?subject=" + encodeURIComponent("Feedback for the sorry page") + "&body=" + encodeURIComponent(msg);
    return "mail";
  }
  if(navigator.share){
    try{
      const data = { title: "Feedback", text: msg };
      if(photoBlob && navigator.canShare){
        const file = new File([photoBlob], "bunny-pic.jpg", { type: "image/jpeg" });
        if(navigator.canShare({ files: [file] })) data.files = [file];
      }
      await navigator.share(data);
      return "share";
    }catch(e){
      if(e && e.name === "AbortError") return "cancel";
    }
  }
  try{ await navigator.clipboard.writeText(msg); return "copied"; }catch(_){}
  return "none";
}

/* ✏️ BACKEND: the secure endpoint that forwards to Telegram (the bot token lives ONLY on that server).
   GitHub Pages can't run it, so put the public https URL of your Worker / serverless function here,
   e.g. "https://sorry-feedback.yourname.workers.dev/".  Set to "" to use the old WhatsApp / email / share fallback. */
const FEEDBACK_ENDPOINT = String(window.FEEDBACK_ENDPOINT || "").trim();
const sid = Math.random().toString(36).slice(2, 10);
let sending = false;
let feedbackLastError = "";
async function postFeedback(txt){
  if(!FEEDBACK_ENDPOINT) return false;
  const attach = !!(photoBlob && g("sn-attach") && g("sn-attach").checked);
  const fd = new FormData();
  fd.append("rating", String(rating));
  fd.append("feedback", txt);
  fd.append("sent_at", new Date().toISOString());
  fd.append("session", sid);
  fd.append("attach_photo", attach ? "1" : "0");
  if(attach) fd.append("photo", photoBlob, "bunny-pic.jpg");
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 25000);
  try{
    const r = await fetch(FEEDBACK_ENDPOINT, { method: "POST", body: fd, signal: ctl.signal });
    let data = null;
    try{ data = await r.clone().json(); }catch(_){}
    feedbackLastError = data && data.code ? String(data.code) : (r.ok ? "" : "http_" + r.status);
    dlog("feedback: backend " + r.status + " code=" + feedbackLastError);
    return r.ok && !!(data ? data.ok !== false : true);
  }catch(e){
    feedbackLastError = (e && e.name) || "network_error";
    dlog("feedback: network error " + feedbackLastError);
    return false;
  }finally{ clearTimeout(to); }
}
sendBtn.addEventListener("click", async () => {
  if(sending) return;                                     /* double-tap protection */
  const txt = ta.value.trim().slice(0, 800);
  if(!rating && !txt){
    note.textContent = "Tap a heart or write a few words 💕";
    sendBtn.classList.remove("sn-shake"); void sendBtn.offsetWidth; sendBtn.classList.add("sn-shake");
    return;
  }
  sending = true; sendBtn.disabled = true; sendBtn.textContent = "Sending… 💖"; note.textContent = "";
  const msg = "💌 Feedback for the sorry page\nRating: " + (rating ? rating + "/5 ❤️" : "not rated") + (txt ? "\n\n" + txt : "");
  try{ localStorage.setItem("abhu_feedback", JSON.stringify({ rating: rating, text: txt, at: Date.now() })); }catch(_){}
  let how = "fail";
  try{ how = FEEDBACK_ENDPOINT ? ((await postFeedback(txt)) ? "sent" : "fail") : await deliver(msg); }catch(_){ how = "fail"; }
  sending = false; sendBtn.disabled = false; sendBtn.textContent = "Send feedback 💌";
  if(how === "fail"){
    if(!FEEDBACK_ENDPOINT) note.textContent = "Feedback server is not connected yet 😔 Please set FEEDBACK_ENDPOINT in feedback-config.js.";
    else if(feedbackLastError === "origin") note.textContent = "This page address is not allowed by the feedback server 😔";
    else if(feedbackLastError === "not_configured") note.textContent = "The feedback bot is not configured on the server yet 😔";
    else if(feedbackLastError === "telegram_rate_limited") note.textContent = "Telegram is temporarily rate-limiting the bot. Please try again in a moment.";
    else note.textContent = "Couldn't send right now 😔 Please try again.";
    return;
  }
  if(how === "cancel"){ note.textContent = "Not sent yet. Tap Send again when you're ready 💕"; return; }
  const doneP = g("sn-done-p"), copyBox = g("sn-copy");
  copyBox.hidden = true;
  if(how === "wa") doneP.textContent = "Opening WhatsApp so you can send it to me 💬";
  else if(how === "mail") doneP.textContent = "Opening your email so you can send it to me 💌";
  else if(how === "share" || how === "sent") doneP.textContent = "Sent! Your feedback means a lot to me 💖";
  else if(how === "copied") doneP.textContent = "I copied your feedback 📋 Please paste it to me, it means a lot 💖";
  else{
    doneP.textContent = "I couldn't send it automatically 😔 Please copy this and send it to me 💖";
    copyBox.value = msg; copyBox.hidden = false;
  }
  g("sn-form").hidden = true;
  g("sn-done").hidden = false;
  heartRain(40);
});
g("sn-save").addEventListener("click", async e => {        /* iOS ignores download on blob links: use the share sheet */
  if(!photoBlob || !navigator.canShare || !/iPhone|iPad|iPod/.test(navigator.userAgent)) return;
  try{
    const f = new File([photoBlob], "bunny-pic.jpg", { type: "image/jpeg" });
    if(navigator.canShare({ files: [f] })){ e.preventDefault(); await navigator.share({ files: [f] }); }
  }catch(_){}
});
const jump = new URLSearchParams(location.search).get("jump");
if(jump) setTimeout(() => { openSnap(); if(jump === "camera") safeOpenCamera(); }, 300);
})();

