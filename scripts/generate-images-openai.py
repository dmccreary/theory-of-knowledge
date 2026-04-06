#!/usr/bin/env python3
"""
generate-images-openai.py — Generate graphic novel panel images using
OpenAI's gpt-image-1 model as an alternative to Gemini.

Reads the same <details><summary>Image Prompt</summary>...</details> blocks
from a story's index.md that the Gemini script uses — no prompt changes needed.

Pricing (gpt-image-1, as of early 2026):
    Quality   Size        Cost/image
    low       1024x1024   $0.011
    medium    1536x1024   $0.047
    high      1536x1024   $0.167

The 1536x1024 size is ~3:2 (close to 16:9 but not exact). For true 16:9,
the script can optionally crop to 1536x864 after generation.

Usage:
    # Test on one story (cover only)
    python3 scripts/generate-images-openai.py docs/stories/hedy-lamarr --first-only

    # Full run, low quality ($0.011/image)
    python3 scripts/generate-images-openai.py docs/stories/hedy-lamarr --quality low

    # Full run, medium quality ($0.047/image)
    python3 scripts/generate-images-openai.py docs/stories/hedy-lamarr --quality medium

    # Resume after partial run
    python3 scripts/generate-images-openai.py docs/stories/hedy-lamarr --skip-existing

Environment:
    export OPENAI_API_KEY=...

Requires: pip install openai pillow
"""
import argparse
import base64
import os
import re
import sys
import time
from pathlib import Path

from openai import OpenAI

# Pricing per image (USD)
# gpt-image-1 supported sizes: 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait)
# For graphic novel panels we always want landscape (1536x1024, ~3:2).
# The "low" tier officially only supports 1024x1024, but we use 1536x1024
# for all tiers to get landscape. If low+landscape fails, the script falls
# back to 1024x1024 and logs a warning.
PRICING = {
    "low":    {"size": "1536x1024",  "cost": 0.011},
    "medium": {"size": "1536x1024",  "cost": 0.047},
    "high":   {"size": "1536x1024",  "cost": 0.167},
}
LOW_FALLBACK_SIZE = "1024x1024"

# Match <details><summary>...Prompt...</summary>BODY</details> blocks.
_PROMPT_BLOCK = re.compile(
    r"<details>\s*<summary>([^<]*?Prompt[^<]*?)</summary>\s*(.*?)\s*</details>",
    re.DOTALL,
)


def extract_prompts(index_md: Path):
    """
    Parse a story index.md and return a list of (output_path, prompt_text)
    tuples in document order: cover image first, then panel-01, panel-02, ...
    """
    text = index_md.read_text(encoding="utf-8")
    story_dir = index_md.parent

    blocks = [
        m for m in _PROMPT_BLOCK.finditer(text) if "Image Prompt" in m.group(1)
    ]
    if not blocks:
        return []

    prompts = [(story_dir / "cover.png", blocks[0].group(2).strip())]
    for i, m in enumerate(blocks[1:], start=1):
        prompts.append((story_dir / f"panel-{i:02d}.png", m.group(2).strip()))
    return prompts


def crop_to_16_9(png_path: Path) -> None:
    """Crop a 1536x1024 (3:2) image to 1536x864 (16:9) by trimming top/bottom."""
    try:
        from PIL import Image
        img = Image.open(png_path)
        w, h = img.size
        target_h = int(w * 9 / 16)
        if h > target_h:
            top = (h - target_h) // 2
            img = img.crop((0, top, w, top + target_h))
            img.save(png_path)
            print(f"   cropped {w}x{h} -> {img.size[0]}x{img.size[1]} (16:9)")
    except ImportError:
        print("   WARNING: pillow not installed, skipping 16:9 crop")


def generate_image(client: OpenAI, prompt: str, quality: str) -> bytes | None:
    """Call gpt-image-1 and return PNG bytes, or None on failure."""
    cfg = PRICING[quality]
    size = cfg["size"]
    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            n=1,
            size=size,
            quality=quality,
        )
        image_b64 = result.data[0].b64_json
        return base64.b64decode(image_b64)
    except Exception as e:
        err_str = str(e)
        # If low quality doesn't support landscape, fall back to square
        if quality == "low" and "size" in err_str.lower():
            print(f"   landscape not supported at low quality, trying {LOW_FALLBACK_SIZE}")
            try:
                result = client.images.generate(
                    model="gpt-image-1",
                    prompt=prompt,
                    n=1,
                    size=LOW_FALLBACK_SIZE,
                    quality=quality,
                )
                image_b64 = result.data[0].b64_json
                return base64.b64decode(image_b64)
            except Exception as e2:
                print(f"   ERROR (fallback): {e2}")
                return None
        print(f"   ERROR: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Generate story images via OpenAI gpt-image-1"
    )
    parser.add_argument("story_dir", help="Path to story directory (e.g. docs/stories/hedy-lamarr)")
    parser.add_argument("--quality", choices=["low", "medium", "high"], default="low",
                        help="Image quality tier (default: low = $0.011/image)")
    parser.add_argument("--first-only", action="store_true",
                        help="Generate only the cover image for evaluation")
    parser.add_argument("--skip-existing", action="store_true",
                        help="Skip images that already exist on disk")
    parser.add_argument("--crop-16-9", action="store_true",
                        help="Crop medium/high (1536x1024) images to 16:9 (1536x864)")
    parser.add_argument("--rpm", type=int, default=7,
                        help="Max requests per minute (default: 7)")
    args = parser.parse_args()

    story_dir = Path(args.story_dir)
    index_md = story_dir / "index.md"
    if not index_md.exists():
        print(f"ERROR: {index_md} not found")
        sys.exit(1)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    prompts = extract_prompts(index_md)
    if not prompts:
        print(f"No image prompts found in {index_md}")
        sys.exit(1)

    cfg = PRICING[args.quality]
    print(f"Found {len(prompts)} image prompts in {index_md}")
    print(f"Quality: {args.quality} | Size: {cfg['size']} | Cost/image: ${cfg['cost']}")
    if args.first_only:
        print("--first-only: generating only the cover image for evaluation\n")

    min_interval = 60.0 / args.rpm if args.rpm > 0 else 0
    last_request = 0.0
    total_cost = 0.0
    generated = 0
    skipped = 0

    for out_path, prompt in prompts:
        if args.skip_existing and out_path.exists():
            print(f"\n-> skipping {out_path} (already exists)")
            skipped += 1
            continue

        print(f"\n-> generating {out_path}")

        # Rate limiting
        elapsed = time.monotonic() - last_request
        if last_request > 0 and elapsed < min_interval:
            wait = min_interval - elapsed
            print(f"   rate-limit: sleeping {wait:.1f}s")
            time.sleep(wait)

        t0 = time.monotonic()
        last_request = time.monotonic()
        png_bytes = generate_image(client, prompt, args.quality)

        if png_bytes is None:
            print(f"   SKIPPING {out_path.name} — generation failed")
            if args.first_only:
                break
            continue

        out_path.write_bytes(png_bytes)
        elapsed = time.monotonic() - t0
        print(f"   wrote {out_path} ({len(png_bytes):,} bytes, {elapsed:.1f}s)")
        print(f"   cost: ${cfg['cost']:.3f}")

        # Optional crop to 16:9
        if args.crop_16_9 and cfg["size"] != "1024x1024":
            crop_to_16_9(out_path)

        total_cost += cfg["cost"]
        generated += 1

        if args.first_only:
            break

    print(f"\n{'='*60}")
    print(f"Generated: {generated} | Skipped: {skipped} | Total cost: ${total_cost:.3f}")
    print(f"Quality: {args.quality} | Size: {cfg['size']}")
    if generated > 0:
        print(f"Inspect the images in {story_dir}/")


if __name__ == "__main__":
    main()
