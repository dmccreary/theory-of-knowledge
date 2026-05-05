#!/usr/bin/env python3
"""Compose the Theory of Knowledge cover image.

Layout (1200 x 630, Open Graph 1.91:1):
  - Left 30% (0..360 px): warm teal panel with Sofia (welcome pose) centered.
  - Right 70% (360..1200 px): 4x3 montage of story covers, darkened, with the
    title 'Theory of Knowledge' and a subtitle centered on top.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
MASCOT = DOCS / "img" / "mascot" / "welcome.png"
STORIES_DIR = DOCS / "stories"
OUT = DOCS / "img" / "cover.png"

W, H = 1200, 630
LEFT_W = int(W * 0.30)         # 360
RIGHT_X = LEFT_W
RIGHT_W = W - LEFT_W           # 840

PANEL_TEAL = (44, 122, 123)    # Sofia's brand teal
PANEL_TEAL_DARK = (24, 78, 80)
CREAM = (250, 245, 230)


def load_story_covers() -> list[Path]:
    covers = sorted(STORIES_DIR.glob("*/cover.png"))
    if not covers:
        raise SystemExit(f"No story covers found under {STORIES_DIR}")
    return covers


def square_crop(img: Image.Image, side: int) -> Image.Image:
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    img = img.crop((left, top, left + s, top + s))
    return img.resize((side, side), Image.LANCZOS)


def build_left_panel() -> Image.Image:
    panel = Image.new("RGB", (LEFT_W, H), PANEL_TEAL)
    draw = ImageDraw.Draw(panel)
    for y in range(H):
        t = y / (H - 1)
        r = int(PANEL_TEAL[0] * (1 - t) + PANEL_TEAL_DARK[0] * t)
        g = int(PANEL_TEAL[1] * (1 - t) + PANEL_TEAL_DARK[1] * t)
        b = int(PANEL_TEAL[2] * (1 - t) + PANEL_TEAL_DARK[2] * t)
        draw.line([(0, y), (LEFT_W, y)], fill=(r, g, b))

    mascot = Image.open(MASCOT).convert("RGBA")
    target_h = int(H * 0.88)
    scale = target_h / mascot.height
    new_size = (int(mascot.width * scale), target_h)
    if new_size[0] > LEFT_W - 20:
        scale = (LEFT_W - 20) / mascot.width
        new_size = (LEFT_W - 20, int(mascot.height * scale))
    mascot = mascot.resize(new_size, Image.LANCZOS)

    mx = (LEFT_W - mascot.width) // 2
    my = (H - mascot.height) // 2
    panel.paste(mascot, (mx, my), mascot)
    return panel


def build_montage() -> Image.Image:
    cols, rows = 4, 3
    tile_w = math.ceil(RIGHT_W / cols)
    tile_h = math.ceil(H / rows)

    covers = load_story_covers()
    rng = random.Random(42)
    needed = cols * rows
    if len(covers) >= needed:
        chosen = rng.sample(covers, needed)
    else:
        chosen = list(covers)
        while len(chosen) < needed:
            chosen.append(rng.choice(covers))
        rng.shuffle(chosen)

    montage = Image.new("RGB", (RIGHT_W, H), (10, 20, 30))
    for idx, path in enumerate(chosen):
        col = idx % cols
        row = idx // cols
        try:
            im = Image.open(path).convert("RGB")
        except Exception:
            continue
        side = max(tile_w, tile_h)
        tile = square_crop(im, side)
        tile = tile.crop((0, 0, tile_w, tile_h))
        montage.paste(tile, (col * tile_w, row * tile_h))

    return montage


def darken_center_for_title(montage: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", montage.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle([(0, 0), montage.size], fill=(0, 0, 0, 90))

    cx, cy = montage.width // 2, montage.height // 2
    rx, ry = int(montage.width * 0.42), int(montage.height * 0.32)
    radial = Image.new("L", montage.size, 0)
    rdraw = ImageDraw.Draw(radial)
    steps = 60
    for i in range(steps):
        t = i / steps
        alpha = int(160 * (1 - t))
        ex = int(rx * (0.2 + 0.8 * t))
        ey = int(ry * (0.2 + 0.8 * t))
        rdraw.ellipse(
            [(cx - ex, cy - ey), (cx + ex, cy + ey)],
            fill=alpha,
        )
    radial = radial.filter(ImageFilter.GaussianBlur(radius=40))

    dark_layer = Image.new("RGBA", montage.size, (5, 18, 30, 255))
    composed = montage.convert("RGBA")
    composed = Image.composite(dark_layer, composed, radial)
    composed.alpha_composite(overlay)
    return composed.convert("RGB")


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def draw_centered_text(
    img: Image.Image,
    text: str,
    center: tuple[int, int],
    font: ImageFont.FreeTypeFont,
    fill=(255, 255, 255),
    shadow=(0, 0, 0),
) -> None:
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = center[0] - tw // 2 - bbox[0]
    y = center[1] - th // 2 - bbox[1]
    for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2), (2, 2), (-2, -2)]:
        draw.text((x + dx, y + dy), text, font=font, fill=shadow)
    draw.text((x, y), text, font=font, fill=fill)


def add_titles(canvas: Image.Image) -> None:
    title_font = load_font(62, bold=True)
    subtitle_font = load_font(26, bold=False)

    cx = RIGHT_X + RIGHT_W // 2
    title_y = H // 2 - 24
    subtitle_y = H // 2 + 50

    draw_centered_text(canvas, "Theory of Knowledge", (cx, title_y), title_font)

    draw = ImageDraw.Draw(canvas)
    line_y = subtitle_y - 18
    line_w = 220
    draw.line(
        [(cx - line_w // 2, line_y), (cx + line_w // 2, line_y)],
        fill=(230, 200, 120),
        width=2,
    )
    draw_centered_text(
        canvas,
        "An IB Diploma Program Course",
        (cx, subtitle_y + 6),
        subtitle_font,
        fill=(245, 235, 215),
    )


def main() -> None:
    random.seed(42)
    canvas = Image.new("RGB", (W, H), (0, 0, 0))

    montage = build_montage()
    montage = darken_center_for_title(montage)
    canvas.paste(montage, (RIGHT_X, 0))

    panel = build_left_panel()
    canvas.paste(panel, (0, 0))

    seam = Image.new("RGBA", (4, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(seam)
    sd.rectangle([(0, 0), (4, H)], fill=(255, 255, 255, 30))
    canvas.paste(seam, (LEFT_W - 2, 0), seam)

    add_titles(canvas)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, format="PNG", optimize=True)
    print(f"Wrote {OUT.relative_to(ROOT)} ({W}x{H})")


if __name__ == "__main__":
    main()
