"""Build 1600x800 article-hero covers for the magazine features.

The source photography is portrait; the story page crops to 16:8, which
beheads the subject. Solution: pillarbox composite — the photo blurred and
darkened as the ground, the full subject sharp in the centre with soft
edge fades. No face is ever cropped.
"""
import os

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1600, 800

SOURCES = {
    "espey": "wood.jpg",
    "joan": "conference.jpg",
    "nichole": "hearth.jpg",
    "kohila": "speak.jpg",
    "pallavi": "business.jpg",
}


def make_wide(slug: str, name: str):
    src_dir = os.path.join(ROOT, "public", "issues", slug)
    photo = Image.open(os.path.join(src_dir, name)).convert("RGB")

    # Ground: cover-crop to 2:1, blur, darken.
    scale = max(W / photo.width, H / photo.height)
    bg = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
    bx = (bg.width - W) // 2
    by = int((bg.height - H) * 0.25)  # bias toward the top of the frame
    bg = bg.crop((bx, by, bx + W, by + H))
    bg = bg.filter(ImageFilter.GaussianBlur(46))
    bg = ImageEnhance.Brightness(bg).enhance(0.42)
    bg = ImageEnhance.Color(bg).enhance(0.85)

    # Subject: full height, sharp, centred, soft fades on both edges.
    sh = H
    sw = int(photo.width * (sh / photo.height))
    subj = photo.resize((sw, sh), Image.LANCZOS)

    fade = 110
    mask = Image.new("L", (sw, sh), 255)
    dm = ImageDraw.Draw(mask)
    for x in range(fade):
        v = int(255 * (x / fade))
        dm.line([(x, 0), (x, sh)], fill=v)
        dm.line([(sw - 1 - x, 0), (sw - 1 - x, sh)], fill=v)

    sx = (W - sw) // 2
    bg.paste(subj, (sx, 0), mask)

    out = os.path.join(src_dir, "wide.jpg")
    bg.save(out, "JPEG", quality=88)
    print("saved:", out, bg.size)


if __name__ == "__main__":
    for slug, name in SOURCES.items():
        make_wide(slug, name)
