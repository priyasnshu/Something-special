from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "bunny" / "source"
DST = ROOT / "assets" / "bunny"
ITEMS = ["left-ear", "right-ear", "teeth", "muzzle", "nose"]

def main():
    for name in ITEMS:
        im = Image.open(SRC / f"{name}.png").convert("RGB")
        arr = np.asarray(im).astype(np.float32) / 255.0
        lum = arr.max(axis=2)
        lo, hi = 0.018, 0.20
        a = np.clip((lum - lo) / (hi - lo), 0, 1)
        a = a * a * (3 - 2 * a)
        a = np.where(a < 0.02, 0, a)
        rgba = np.dstack([arr, a])
        out = Image.fromarray(np.clip(rgba * 255, 0, 255).astype("uint8"), "RGBA")
        bbox = out.getchannel("A").getbbox()
        if bbox:
            pad = max(8, int(min(out.size) * 0.012))
            bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(out.width, bbox[2]+pad), min(out.height, bbox[3]+pad))
            out = out.crop(bbox)
        out.save(DST / f"{name}.webp", "WEBP", lossless=True, method=6)
        print(f"wrote {name}.webp {out.size}")

if __name__ == "__main__":
    main()
