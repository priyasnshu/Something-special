# Advanced Bunny Face AR Filter

## Files

- `index.html` — existing page, updated only in the finale camera section to add camera controls.
- `style.css` — existing stylesheet plus scoped AR camera/switch/close/orientation styles.
- `script.js` — full existing page script with the finale camera pipeline upgraded to real-time MediaPipe Face Landmarker tracking, face geometry, smoothing, ear spring physics, segmented ear bending, mouth response, camera switching, lifecycle/error handling, debug mode, and filtered capture.
- `worker.js` — preserved from the existing site package.
- `assets/bunny/left-ear.png`
- `assets/bunny/right-ear.png`
- `assets/bunny/nose.png`
- `assets/bunny/teeth.png`
- `assets/bunny/muzzle.png` (optional component used by the renderer)

The Shutterstock reference image is not used at runtime.

## Placement

Keep the relative paths exactly as shown:

```text
/index.html
/style.css
/script.js
/worker.js
/assets/bunny/left-ear.png
/assets/bunny/right-ear.png
/assets/bunny/nose.png
/assets/bunny/teeth.png
/assets/bunny/muzzle.png
```

## Camera requirements

The live camera requires a secure context (`https://` or `http://localhost`) and a browser with `navigator.mediaDevices.getUserMedia()` support.

The face tracker and MediaPipe WASM/model are loaded from CDN at runtime. An internet connection is therefore needed for the tracker unless you later self-host those MediaPipe files.

## Tuning

The main filter configuration lives near the top of the advanced camera block in `script.js` as `BUNNY_FILTER`.

Useful values include:

- `ears.left/right.offsetX`, `offsetY`, `rotation`, `scale`
- `ears.left/right.spring`, `damping`, `bendSpring`, `bendDamping`
- `physics.intensity`
- `nose.scale`
- `teeth.scale`, `teeth.minVisible`, `teeth.openBoost`
- `maxFaces`

## Debug mode

Set `BUNNY_FILTER.render.debug = true`, or open the page with `?debugAR=1`, to draw face landmarks, the face bounding box, nose anchor, ear anchors, and live roll/yaw/pitch/scale/mouth values.
