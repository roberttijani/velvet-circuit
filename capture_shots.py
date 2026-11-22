import os
import sys
import time
import subprocess
from pathlib import Path
from PIL import Image

REPO = Path(r"E:\AI\make.fun\velvet-circuit")
SCREENSHOTS = REPO / "screenshots"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

SHOTS = [
    {
        "name": "01-gallery-stealth.png",
        "query": "?shot=01-gallery-stealth",
        "desc": "Hero stealth frame with all 5 mandatory heist elements visible"
    },
    {
        "name": "02-gadget-distraction.png",
        "query": "?shot=02-gadget-distraction",
        "desc": "Tactical decoy coin sound ripple & EMP pulse disabling cameras"
    },
    {
        "name": "03-vault-lockdown.png",
        "query": "?shot=03-vault-lockdown",
        "desc": "High-alert vault extraction under red lockdown siren with smoke veil"
    },
    {
        "name": "04-penthouse-extraction.png",
        "query": "?shot=04-penthouse-extraction",
        "desc": "Penthouse safe exfil underway with full multi-room tactical blueprint"
    }
]

print("Starting serve.ts on port 8089...")
srv = subprocess.Popen(
    ["node", "serve.ts", "--port", "8089"],
    cwd=str(REPO),
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)
time.sleep(2.0)

try:
    for shot in SHOTS:
        raw_png = SCREENSHOTS / f"raw_{shot['name']}"
        final_png = SCREENSHOTS / shot['name']
        url = f"http://127.0.0.1:8089/{shot['query']}"
        sw, sh = 1280, 480
        cmd = f'npx.cmd playwright screenshot --channel chrome --wait-for-timeout 1000 --viewport-size "{sw}, {sh}" "{url}" "{raw_png}"'
        print(f"Capturing {shot['name']} ({sw}x{sh}) - {shot['desc']}...")
        res = subprocess.run(cmd, check=True, shell=True)

        with Image.open(raw_png) as img:
            rgb_img = img.convert("RGB")
            w, h = rgb_img.size
            print(f"Captured: {w}x{h}")
            assert w == 1280 and h == 480, f"Expected 1280x480, got {w}x{h}"

            # Save optimized PNG
            rgb_img.save(final_png, "PNG", optimize=True)
            sz = final_png.stat().st_size
            print(f"Initial PNG size: {sz / 1024:.1f} KiB")

            if sz > 256000:
                print(f"Quantizing palette for {shot['name']} to guarantee < 256 KiB...")
                quantized = rgb_img.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
                quantized.save(final_png, "PNG", optimize=True)
                sz = final_png.stat().st_size
                print(f"Quantized PNG size: {sz / 1024:.1f} KiB")

            assert sz <= 262144, f"File exceeds 256 KiB limit: {sz} bytes"

        if raw_png.exists():
            raw_png.unlink()

        print(f"VERIFIED: {shot['name']} ({w}x{h}, {sz} bytes)\n")

finally:
    srv.terminate()
    srv.wait()

print("All 4 screenshots successfully generated and verified!")
