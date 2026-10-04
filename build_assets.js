/* Generates clean, watermark-free, transparent bunny assets (SVG -> WebP) */
const sharp = require('sharp');
const fs = require('fs');
const OUT = require('path').join(__dirname, '..', 'assets', 'bunny');
fs.mkdirSync(OUT, { recursive: true });

/* ---------- helpers ---------- */
function bez(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
    u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]
  ];
}
function bezTan(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]);
  const dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]);
  const l = Math.hypot(dx, dy) || 1; return [dx/l, dy/l];
}
const smooth = (a,b,x) => { const t = Math.min(1, Math.max(0, (x-a)/(b-a))); return t*t*(3-2*t); };

/* closed outline around a centerline with half-width w(t); optional round cap at t=1 (no self-intersection) */
function band(curve, wFn, shiftFn, N = 110, tEnd = 1) {
  const L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * tEnd;
    const c = bez(...curve, t), tg = bezTan(...curve, t);
    const nx = -tg[1], ny = tg[0];
    const w = wFn(t), s = shiftFn ? shiftFn(t) : 0;
    L.push([c[0] + nx*(w + s), c[1] + ny*(w + s)]);
    R.push([c[0] - nx*(w - s), c[1] - ny*(w - s)]);
  }
  const cEnd = bez(...curve, tEnd), tgE = bezTan(...curve, tEnd);
  const nxE = -tgE[1], nyE = tgE[0], wE = wFn(tEnd), sE = shiftFn ? shiftFn(tEnd) : 0;
  const cap = [];
  for (let k = 1; k < 24; k++) {
    const phi = Math.PI * k / 24;
    const ox = cEnd[0] + nxE * sE, oy = cEnd[1] + nyE * sE;
    cap.push([ox + (nxE*Math.cos(phi) + tgE[0]*Math.sin(phi)) * wE, oy + (nyE*Math.cos(phi) + tgE[1]*Math.sin(phi)) * wE]);
  }
  const pts = L.concat(cap, R.reverse());
  const n = pts.length; let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i-1+n)%n], p1 = pts[i], p2 = pts[(i+1)%n], p3 = pts[(i+2)%n];
    const c1 = [p1[0] + (p2[0]-p0[0])/6, p1[1] + (p2[1]-p0[1])/6];
    const c2 = [p2[0] - (p3[0]-p1[0])/6, p2[1] - (p3[1]-p1[1])/6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/* ---------- EAR ---------- */
/* Canvas 512x1024. Base pivot (where the ear meets the head) is at about (256, 960) = (0.5, 0.9375).
   The ear leans outward toward its own side and the tip curls out a little, like the reference. */
function earSvg(side /* -1 left, +1 right (screen side) */, v) {
  const W = 800, H = 1024;
  const s = side;
  const X = x => 400 + s * (x - 400);          // mirror around the vertical axis for the right ear
  const curve = [
    [X(400), 1020],
    [X(400 - v.c1), 740],
    [X(400 - v.c2), 440],
    [X(400 - v.tip), 190]
  ];
  const wOuter = t => 92 + 30 * Math.sin(Math.PI * Math.min(1, t / 0.9) * 0.62) / Math.sin(Math.PI * 0.62) - 14 * smooth(0.7, 1, t) + 2;
  const wInner = t => wOuter(t) * 0.64;
  const shiftInner = t => 6 * (1 - t);                 // pink sits a touch toward the inside of the ear
  const outer = band(curve, wOuter, null);
  const inner = band(curve, wInner, shiftInner, 100, 0.90);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wh" x1="0" y1="0" x2="1" y2="0.25">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#fcfafc"/><stop offset="1" stop-color="#efeaf1"/>
    </linearGradient>
    <linearGradient id="pk" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#ffc9d6"/><stop offset="0.5" stop-color="#fda0b5"/><stop offset="1" stop-color="#ee7896"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff"/><stop offset="0.84" stop-color="#fff"/><stop offset="0.985" stop-color="#000"/>
    </linearGradient>
    <mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <clipPath id="co"><path d="${outer}"/></clipPath>
    <clipPath id="ci"><path d="${inner}"/></clipPath>
    <filter id="b10" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="b14" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="13"/></filter>
    <filter id="b22" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <g mask="url(#m)">
    <path d="${outer}" fill="url(#wh)"/>
    <g clip-path="url(#co)">
      <path d="${outer}" fill="none" stroke="#d3cade" stroke-width="30" filter="url(#b10)" opacity="0.55"/>
      <path d="${outer}" fill="none" stroke="#ffffff" stroke-width="12" filter="url(#b10)" transform="translate(${-s*8} 6)" opacity="0.9"/>
    </g>
    <path d="${outer}" fill="none" stroke="#e7e1ec" stroke-width="2.5"/>
    <path d="${inner}" fill="url(#pk)"/>
    <g clip-path="url(#ci)">
      <path d="${inner}" fill="none" stroke="#c0446c" stroke-width="34" filter="url(#b14)" opacity="0.5"/>
      <ellipse cx="${X(330)}" cy="560" rx="46" ry="250" fill="#ffffff" opacity="0.2" filter="url(#b22)" transform="rotate(${s*6} ${X(330)} 560)"/>
    </g>
    <path d="${inner}" fill="none" stroke="#f6e3ea" stroke-width="3" opacity="0.8"/>
  </g>
</svg>`;
}

/* ---------- NOSE ---------- */
const NOSE_D = "M180 214 C163 214 150 198 118 172 C70 134 40 112 40 80 C40 50 68 34 104 36 C142 38 166 54 180 74 C194 54 218 38 256 36 C292 34 320 50 320 80 C320 112 290 134 242 172 C210 198 197 214 180 214Z";
const noseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="250" viewBox="0 0 360 250">
  <defs>
    <radialGradient id="g" cx="0.42" cy="0.25" r="0.9">
      <stop offset="0" stop-color="#ffc9d6"/><stop offset="0.5" stop-color="#ff8fa9"/><stop offset="1" stop-color="#e65a80"/>
    </radialGradient>
    <filter id="b6"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="c"><path d="${NOSE_D}"/></clipPath>
  </defs>
  <path d="${NOSE_D}" fill="url(#g)"/>
  <g clip-path="url(#c)">
    <path d="${NOSE_D}" fill="none" stroke="#bd3a69" stroke-width="20" filter="url(#b6)" opacity="0.5"/>
    <ellipse cx="116" cy="76" rx="40" ry="16" transform="rotate(-16 116 76)" fill="#fff" opacity="0.6" filter="url(#b3)"/>
    <ellipse cx="250" cy="78" rx="28" ry="12" transform="rotate(14 250 78)" fill="#fff" opacity="0.36" filter="url(#b3)"/>
    <path d="M180 86 L180 160" stroke="#c2406c" stroke-width="5" stroke-linecap="round" opacity="0.45" filter="url(#b3)"/>
  </g>
</svg>`;

/* ---------- TEETH (two buck teeth, top edge hides under the upper lip) ---------- */
const teethSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="330" viewBox="0 0 400 330">
  <defs>
    <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#fbfafd"/><stop offset="1" stop-color="#e6e2ee"/>
    </linearGradient>
    <filter id="b5"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
    <clipPath id="l"><path d="M34 0 H190 V250 Q190 308 120 308 H104 Q34 308 34 250Z"/></clipPath>
    <clipPath id="r"><path d="M210 0 H366 V250 Q366 308 296 308 H280 Q210 308 210 250Z"/></clipPath>
  </defs>
  <path d="M34 0 H190 V250 Q190 308 120 308 H104 Q34 308 34 250Z" fill="url(#t)"/>
  <path d="M210 0 H366 V250 Q366 308 296 308 H280 Q210 308 210 250Z" fill="url(#t)"/>
  <g clip-path="url(#l)"><path d="M34 0 H190 V250 Q190 308 120 308 H104 Q34 308 34 250Z" fill="none" stroke="#c9c2d8" stroke-width="22" filter="url(#b5)" opacity="0.6"/>
    <ellipse cx="80" cy="130" rx="12" ry="76" fill="#fff" filter="url(#b2)" opacity="0.9"/></g>
  <g clip-path="url(#r)"><path d="M210 0 H366 V250 Q366 308 296 308 H280 Q210 308 210 250Z" fill="none" stroke="#c9c2d8" stroke-width="22" filter="url(#b5)" opacity="0.6"/>
    <ellipse cx="256" cy="130" rx="12" ry="76" fill="#fff" filter="url(#b2)" opacity="0.9"/></g>
  <path d="M34 0 H190 V250 Q190 308 120 308 H104 Q34 308 34 250Z" fill="none" stroke="#d6d0e2" stroke-width="3"/>
  <path d="M210 0 H366 V250 Q366 308 296 308 H280 Q210 308 210 250Z" fill="none" stroke="#d6d0e2" stroke-width="3"/>
</svg>`;

/* ---------- MUZZLE (two soft cheek pads + philtrum line, feathered so the real face stays visible) ---------- */
const muzzleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" viewBox="0 0 640 320">
  <defs>
    <radialGradient id="p" cx="0.5" cy="0.45" r="0.55">
      <stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="0.65" stop-color="#fdfcfe" stop-opacity="0.92"/><stop offset="1" stop-color="#f4f0f7" stop-opacity="0"/>
    </radialGradient>
    <filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <ellipse cx="238" cy="190" rx="160" ry="96" fill="url(#p)"/>
  <ellipse cx="402" cy="190" rx="160" ry="96" fill="url(#p)"/>
  <path d="M320 24 L320 96 M320 96 C312 128 284 138 262 132 M320 96 C328 128 356 138 378 132" fill="none" stroke="#f08aa4" stroke-width="7" stroke-linecap="round" filter="url(#b3)" opacity="0.8"/>
  <g fill="#e9a5b6" opacity="0.5"><circle cx="170" cy="200" r="5"/><circle cx="206" cy="218" r="5"/><circle cx="144" cy="228" r="5"/><circle cx="470" cy="200" r="5"/><circle cx="434" cy="218" r="5"/><circle cx="496" cy="228" r="5"/></g>
</svg>`;

async function out(name, svg, quality = 94) {
  const buf = Buffer.from(svg);
  await sharp(buf, { density: 72 }).webp({ quality, alphaQuality: 100, effort: 5 }).toFile(`${OUT}/${name}.webp`);
  await sharp(buf, { density: 72 }).png().toFile(require('path').join(__dirname, 'preview-' + name + '.png'));
  const st = fs.statSync(`${OUT}/${name}.webp`); console.log(name, st.size, 'bytes');
}
(async () => {
  /* slightly different curve/tip for each ear = natural asymmetry */
  await out('left-ear',  earSvg( 1, { c1: 8,  c2: 50, tip: 238 }));
  await out('right-ear', earSvg(-1, { c1: 14, c2: 42, tip: 222 }));
  await out('nose', noseSvg);
  await out('teeth', teethSvg);
  await out('muzzle', muzzleSvg);
})();
