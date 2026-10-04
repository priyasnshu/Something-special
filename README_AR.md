# Bunny face-AR camera (MediaPipe Face Landmarker)

## Files (keep these relative paths)

```text
/index.html                    unchanged from your upload (it already had the right elements/IDs)
/style.css                     unchanged from your upload
/script.js                     the AR block was rewritten (search "ADVANCED BUNNY AR CAMERA"); everything else is untouched
/worker.js                     untouched
/assets/bunny/left-ear.webp    clean transparent parts, drawn from scratch, no watermark
/assets/bunny/right-ear.webp
/assets/bunny/nose.webp
/assets/bunny/teeth.webp
/assets/bunny/muzzle.webp      optional soft cheek pads (set BUNNY_FILTER.muzzle.enabled=false to drop it)
/tools/build_assets.js         optional: regenerates the five WebP files (needs `npm i sharp`)
```

The old `assets/bunny/*.png` files are no longer used and were removed.
The Shutterstock reference is never loaded by the page.

## Needs

- `https://` (GitHub Pages is fine) or `http://localhost` — browsers refuse the camera otherwise.
- Internet on first use: the MediaPipe WASM + model load from jsDelivr / Google storage (see `BUNNY_FILTER.tracker`
  to point both at your own copy).

## How it works (modules inside script.js)

`CameraManager` (getUserMedia, switching, release) → `FaceTracker` (MediaPipe, swappable backend) →
`FaceGeometry` (face size, roll/yaw/pitch, depth, anchors) → `FaceRig` (One-Euro smoothing, lost-face hold/fade)
→ `EarPhysics` (one spring set per ear) + `MouthController` (mouth open → teeth) → `Renderer`
(video + bunny parts, ears drawn as bending strips) → `CaptureManager` (shutter saves the canvas).
`FilterController` owns the single render loop (`startTracking` / `stopTracking` / `renderFrame`).

Everything is placed from landmarks, in the face's own rotated frame, in face-width units, so it scales with distance and
rotates with the head. All landmarks are converted once into display space (already mirrored for the selfie camera), so
"left" always means screen-left.

## Tuning — `BUNNY_FILTER` near the top of the AR block

| What | Where |
|---|---|
| ear size / height / how high they sit / spread | `ears.scale`, `ears.height`, `ears.baseLift`, `ears.spread` |
| per-ear offset / rotation / scale | `ears.left.*`, `ears.right.*` (`offsetX`, `offsetY` in face-widths, **+Y = down**) |
| per-ear springiness | `spring`, `damping`, `bendSpring`, `bendDamping`, `bend`, `gain` |
| overall swing strength | `physics.intensity` (0 = rigid ears), `tiltGain`, `bendGain`, `bounceGain`, `microMotion` |
| nose / teeth / muzzle | `nose.*`, `teeth.*`, `muzzle.*` |
| jitter vs. lag | `smoothing.*` (`minCutoff` lower = steadier at rest, `beta` higher = less lag when moving) |
| lost face | `lostFace.holdMs / fadeMs / fadeInMs` |
| several faces | `maxFaces` (default 1 = closest face) |
| image pivots | `anchors.*` (fraction of the image; ears pivot where their soft fade-out begins) |

Live in the browser console: `BUNNY_AR.config.ears.left.offsetY = 0.05`, `BUNNY_AR.setDebug(true)`.

## Replacing a part

Drop in a new `left-ear.webp` (or change its path in `BUNNY_FILTER.assets`). The ear only needs its base near
`anchors.leftEar` (default: bottom centre, 84 % down). No tracking code changes.

## Debug

`?debugAR=1` (or `BUNNY_FILTER.render.debug = true`, or tap the "Smile!" title 5 times for the on-screen log) draws all
landmarks, face box, nose / mouth / ear anchors, face centre, roll/yaw/pitch, face size, mouth-open, confidence, fps.
Console lines: `[AR] Camera button clicked → Requesting camera → Camera stream received → Video metadata loaded →
Video playback started → Face tracker initialized → Face detected → Rendering started → Camera stopped`,
errors as `[AR ERROR] …`.


## Updated in this build

- The bunny parts were replaced with the five uploaded reference images and converted to transparent WebP assets for the canvas renderer. The original PNGs are kept in `assets/bunny/source/`.
- Bunny placement/physics values were tuned for these taller, wider source images while keeping the existing camera flow, capture flow, and page behavior intact.
- Feedback now sends an explicit `attach_photo=1` flag when the checkbox is enabled. The Worker validates the photo and forwards it with Telegram `sendPhoto`; text-only feedback uses `sendMessage`.
- `feedback-config.js` is the only browser-side setting for the backend URL. The Telegram token is intentionally not bundled in the site.
- `FEEDBACK_SETUP.md` contains the exact deployment/configuration checklist.

## Security note

The bot token was pasted into the conversation. Treat that token as exposed and regenerate it with BotFather before production use. Store the replacement token only as a Cloudflare Worker secret.
