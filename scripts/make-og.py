"""Compose the PrimeCrest Open Graph card (1200x630).

Warm paper ground, masthead rules, crest mark + Newsreader wordmark with the
accent-red period, tracked tagline, and the Fortiora Group attribution line.
"""
from PIL import Image, ImageDraw, ImageFont

NEWSREADER = r"e:\Builds\editorial\scripts\newsreader.ttf"
INTER = r"e:\Builds\editorial\scripts\inter.ttf"
OUT = r"e:\Builds\editorial\public\og.jpg"

W, H = 1200, 630
PAPER = (247, 246, 242)
INK = (18, 17, 16)
INK_SOFT = (69, 66, 61)
ACCENT = (179, 33, 43)
RULE = (18, 17, 16, 40)

# Supersample x2 for crisp edges
S = 2
img = Image.new("RGB", (W * S, H * S), PAPER)
draw = ImageDraw.Draw(img, "RGBA")


def font(path: str, size: int, wght: float, opsz: float | None = None):
    f = ImageFont.truetype(path, size * S)
    try:
        axes = [opsz, wght] if opsz is not None else [wght]
        f.set_variation_by_axes(axes)
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


def tracked_width(text, fnt, track_em):
    track_px = fnt.size * track_em
    return sum(fnt.getlength(ch) for ch in text) + track_px * (len(text) - 1)


MARGIN = 84 * S

# --- masthead rules (double rule top, single bottom) ---
draw.rectangle([MARGIN, 92 * S, W * S - MARGIN, 92 * S + 3 * S], fill=INK)
draw.rectangle([MARGIN, 101 * S, W * S - MARGIN, 101 * S + 1 * S], fill=INK)
draw.rectangle([MARGIN, (H - 96) * S, W * S - MARGIN, (H - 96) * S + 1 * S], fill=INK)

# --- top labels: issue left, kicker right ---
label_f = font(INTER, 17, 600)
tracked(draw, (MARGIN, 56 * S), "VOL. IV · NO. 33", label_f, 0.28, INK_SOFT)
kicker = "INDEPENDENT EDITORIAL"
kw = tracked_width(kicker, label_f, 0.28)
tracked(draw, (W * S - MARGIN - kw, 56 * S), kicker, label_f, 0.28, INK_SOFT)

# --- crest mark (double chevron peak, from Logo.tsx viewBox 0 0 32 28) ---
def crest(cx_left, cy_top, h_px):
    sc = h_px / 28.0
    def P(x, y):
        return (cx_left + x * sc, cy_top + y * sc)
    draw.polygon([P(16, 2), P(28, 16), P(22, 16), P(16, 8.5), P(10, 16), P(4, 16)], fill=INK)
    inner = (*INK, 128)
    draw.polygon([P(16, 12), P(24, 22), P(20, 22), P(16, 16.5), P(12, 22), P(8, 22)], fill=inner)


# --- wordmark: crest + "PrimeCrest." centered ---
name_f = font(NEWSREADER, 132, 640, opsz=72)
name = "PrimeCrest"
name_w = draw.textlength(name, font=name_f)
dot_w = draw.textlength(".", font=name_f)
crest_h = 96 * S
crest_w = crest_h * (32 / 28)
gap = 26 * S

total_w = crest_w + gap + name_w + dot_w
x0 = (W * S - total_w) / 2
name_y = 226 * S

asc, desc = name_f.getmetrics()
crest_y = name_y + asc - crest_h - 6 * S
crest(x0, crest_y, crest_h)
draw.text((x0 + crest_w + gap, name_y), name, font=name_f, fill=INK)
draw.text((x0 + crest_w + gap + name_w, name_y), ".", font=name_f, fill=ACCENT)

# --- tagline ---
tag_f = font(INTER, 26, 600)
tag = "WHERE VISION MEETS VOICE"
tw = tracked_width(tag, tag_f, 0.42)
tracked(draw, ((W * S - tw) / 2, 420 * S), tag, tag_f, 0.42, INK_SOFT)

# --- descriptor line ---
desc_f = font(NEWSREADER, 27, 420, opsz=18)
desc_f.set_variation_by_axes([18, 420])
descriptor = "A journal of affairs, business, and culture."
dw = draw.textlength(descriptor, font=desc_f)
draw.text(((W * S - dw) / 2, 466 * S), descriptor, font=desc_f, fill=(*INK_SOFT, 210))

# --- footer attribution ---
foot_f = font(INTER, 16, 600)
foot = "A PRODUCT OF FORTIORA GROUP LLC  ·  THEPRIMECREST.COM"
fw = tracked_width(foot, foot_f, 0.26)
tracked(draw, ((W * S - fw) / 2, (H - 72) * S), foot, foot_f, 0.26, INK_SOFT)

img = img.resize((W, H), Image.LANCZOS)
img.save(OUT, "JPEG", quality=92)
print("saved:", OUT, img.size)
