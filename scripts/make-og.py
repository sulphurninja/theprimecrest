"""Compose a branded Open Graph card (1200x630) for a PrimeCrest issue.

Usage:
  python scripts/make-og.py <slug> "<title>" "<kicker>"   -> public/issues/<slug>/og.jpg
  python scripts/make-og.py --primecrest <slug> "<title>" "<kicker>"

Layout: dark editorial panel left (lockup, kicker, title, publisher line),
issue cover bleeding in from the right with a gradient seam.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEWSREADER = os.path.join(ROOT, "scripts", "newsreader.ttf")
INTER = os.path.join(ROOT, "scripts", "inter.ttf")

W, H = 1200, 630
S = 2
CREAM = (244, 239, 230)
GOLD = (232, 197, 107)
CORAL = (224, 90, 78)
TEAL = (26, 95, 106)
DIM = (244, 239, 230, 168)


def font(path, size, wght, opsz=None):
    f = ImageFont.truetype(path, size * S)
    try:
        f.set_variation_by_axes([opsz, wght] if opsz is not None else [wght])
    except Exception:
        pass
    return f


def tracked(draw, xy, text, fnt, track_em, fill):
    x, y = xy
    track_px = fnt.size * track_em
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += fnt.getlength(ch) + track_px
    return x - track_px


def base_canvas():
    img = Image.new("RGB", (W * S, H * S), (13, 10, 7))
    grad = Image.new("L", (1, H * S))
    for y in range(H * S):
        grad.putpixel((0, y), int(18 + 26 * (y / (H * S))))
    img.paste(Image.merge("RGB", [grad.resize((W * S, H * S))] * 3).point(lambda v: v), (0, 0),
              Image.new("L", (W * S, H * S), 26))
    return img


def draw_lockup(img, draw, x, y, mark_h=54, brand="primecrest"):
    pc = Image.open(os.path.join(ROOT, "public", "brand", "logo-primecrest.png")).convert("RGBA")
    ph = 58 * S
    pw = int(pc.width * (ph / pc.height))
    pc = pc.resize((pw, ph), Image.LANCZOS)
    img.alpha_composite(pc, (x, y))
    return y + ph


def wrap_title(draw, title, fnt, max_w):
    words = title.split()
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:3]


def make_issue(slug, title, kicker, brand="primecrest"):
    cover_path = os.path.join(ROOT, "public", "issues", slug, "cover.jpg")
    img = base_canvas().convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")

    cover = Image.open(cover_path).convert("RGB")
    ch = H * S
    cw = int(cover.width * (ch / cover.height))
    cover = cover.resize((cw, ch), Image.LANCZOS)
    cx = W * S - cw
    img.paste(cover, (max(cx, int(W * S * 0.46)), 0))
    seam_w = int(W * S * 0.34)
    seam = Image.new("L", (seam_w, 1))
    for x in range(seam_w):
        seam.putpixel((x, 0), int(255 * (1 - x / seam_w)))
    seam = seam.resize((seam_w, ch))
    dark = Image.new("RGBA", (seam_w, ch), (13, 10, 7, 255))
    img.paste(dark, (int(W * S * 0.46), 0), seam)
    
    foot_grad = Image.new("L", (1, 160 * S))
    for y in range(160 * S):
        foot_grad.putpixel((0, y), int(150 * (y / (160 * S))))
    img.paste(Image.new("RGBA", (W * S, 160 * S), (10, 8, 6, 255)),
              (0, H * S - 160 * S), foot_grad.resize((W * S, 160 * S)))

    PAD = 72 * S
    draw_lockup(img, draw, PAD, 64 * S, brand=brand)

    kick_f = font(INTER, 19, 650)
    accent = CORAL if brand == "primecrest" else GOLD
    tracked(draw, (PAD, 236 * S), kicker.upper(), kick_f, 0.24, accent)

    title_size, line_h = (74, 82) if len(title) <= 46 else (54, 62)
    title_f = font(NEWSREADER, title_size, 640, opsz=72)
    lines = wrap_title(draw, title, title_f, int(W * S * 0.52))
    ty = 286 * S
    for line in lines:
        draw.text((PAD, ty), line, font=title_f, fill=CREAM)
        ty += line_h * S

    foot_f = font(INTER, 15, 600)
    foot = "PRIMECREST  ·  A PRODUCT OF FORTIORA GROUP  ·  THEPRIMECREST.COM"
    tracked(draw, (PAD, (H - 92) * S), foot, foot_f, 0.22, DIM)

    out = os.path.join(ROOT, "public", "issues", slug, "og.jpg")
    img.convert("RGB").resize((W, H), Image.LANCZOS).save(out, "JPEG", quality=90)
    print("saved:", out)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    brand = "primecrest" if "--primecrest" in sys.argv else "primecrest"
    slug, title, kicker = args[0], args[1], args[2]
    make_issue(slug, title, kicker, brand=brand)
