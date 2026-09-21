"""Generate the Prime Crest brand kit for the flipbook issues.

Outputs:
  public/issues/kohila/backcover.jpg     Insights-style rotated cover collage, ink wash
  public/issues/kohila/coverart.jpg      Front cover plate with subject
"""
import os
import random

from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEWSREADER = os.path.join(ROOT, "scripts", "newsreader.ttf")
INTER = os.path.join(ROOT, "scripts", "inter.ttf")

CREAM = (244, 239, 230, 255)
TEAL = (26, 95, 106, 255)
CORAL = (224, 90, 78, 255)
INK = (18, 17, 16)


def font(path, size, wght, opsz=None):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([opsz, wght] if opsz is not None else [wght])
    except Exception:
        pass
    return f


def make_backcover(slug="kohila"):
    src_dir = os.path.join(ROOT, "public", "issues", slug)
    names = ["cover.jpg", "portrait.jpg", "feature.jpg"]
    tiles = [Image.open(os.path.join(src_dir, n)).convert("RGB") for n in names if os.path.exists(os.path.join(src_dir, n))]
    
    if not tiles:
        print(f"No images found in {src_dir}")
        return

    PW, PH = 1000, 1414
    big = int((PW**2 + PH**2) ** 0.5) + 400
    collage = Image.new("RGB", (big, big), INK)

    tile_w, tile_h = 240, 330
    gap = 14
    rng = random.Random(42)
    cols = big // (tile_w + gap) + 2
    rows = big // (tile_h + gap) + 2
    for r in range(rows):
        for c in range(cols):
            t = tiles[(r * cols + c + rng.randrange(2)) % len(tiles)]
            th = tile_h
            tw = int(t.width * (th / t.height))
            t = t.resize((tw, th), Image.LANCZOS)
            left = max(0, (tw - tile_w) // 2)
            t = t.crop((left, 0, left + tile_w, th))
            x = c * (tile_w + gap) - (tile_w // 2 if r % 2 else 0)
            collage.paste(t, (x, r * (tile_h + gap)))

    collage = collage.rotate(8, resample=Image.BICUBIC, expand=False)
    cx, cy = collage.width // 2, collage.height // 2
    page = collage.crop((cx - PW // 2, cy - PH // 2, cx + PW // 2, cy + PH // 2))

    wash = Image.new("RGB", (PW, PH), INK)
    page = Image.blend(page, wash, 0.78)

    vig = Image.new("L", (PW, PH), 0)
    dv = ImageDraw.Draw(vig)
    dv.ellipse((-PW * 0.35, -PH * 0.25, PW * 1.35, PH * 1.25), fill=46)
    page = Image.composite(Image.blend(page, wash, -0.0), page, vig.point(lambda v: 0))
    dark = Image.new("RGB", (PW, PH), (8, 7, 6))
    edge = Image.new("L", (PW, PH), 110)
    de = ImageDraw.Draw(edge)
    de.ellipse((PW * -0.25, PH * -0.18, PW * 1.25, PH * 1.18), fill=0)
    page = Image.composite(dark, page, edge)

    out = os.path.join(src_dir, "backcover.jpg")
    page.save(out, "JPEG", quality=88)
    print("saved:", out, page.size)


def make_coverart(slug="kohila"):
    """Front cover plate: blurred ground with the subject anchored bottom-right,
    leaving a clean left column and headroom for masthead + cover lines."""
    src_dir = os.path.join(ROOT, "public", "issues", slug)
    src = os.path.join(src_dir, "cover.jpg")
    
    if not os.path.exists(src):
        print(f"Cover image not found: {src}")
        return
    
    PW, PH = 1000, 1414
    photo = Image.open(src).convert("RGB")

    scale = max(PW / photo.width, PH / photo.height) * 1.15
    bg = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
    bx = (bg.width - PW) // 2
    by = (bg.height - PH) // 2
    bg = bg.crop((bx, by, bx + PW, by + PH))
    bg = bg.filter(ImageFilter.GaussianBlur(48))
    bg = ImageEnhance.Brightness(bg).enhance(0.32)

    sh = int(PH * 0.88)
    sw = int(photo.width * (sh / photo.height))
    subj = photo.resize((sw, sh), Image.LANCZOS)
    strip_w = min(660, sw)
    left = (sw - strip_w) // 2 + 30
    subj = subj.crop((max(0, left), 0, max(0, left) + strip_w, sh))
    sx, sy = PW - strip_w, PH - sh

    fade_w, fade_h = 210, 170
    mh = Image.new("L", (strip_w, sh), 255)
    dm = ImageDraw.Draw(mh)
    for x in range(fade_w):
        dm.line([(x, 0), (x, sh)], fill=int(255 * (x / fade_w)))
    mv = Image.new("L", (strip_w, sh), 255)
    dv = ImageDraw.Draw(mv)
    for y in range(fade_h):
        dv.line([(0, y), (strip_w, y)], fill=int(255 * (y / fade_h)))
    mask = ImageChops.multiply(mh, mv)
    bg.paste(subj, (sx, sy), mask)

    grad = Image.new("L", (1, 320))
    for y in range(320):
        grad.putpixel((0, y), int(120 * (y / 320)))
    dark = Image.new("RGB", (PW, 320), (8, 9, 8))
    bg.paste(dark, (0, PH - 320), grad.resize((PW, 320)))

    out = os.path.join(src_dir, "coverart.jpg")
    bg.save(out, "JPEG", quality=90)
    print("saved:", out, bg.size)


if __name__ == "__main__":
    import sys
    slug = sys.argv[1] if len(sys.argv) > 1 else "kohila"
    make_coverart(slug)
    make_backcover(slug)
