"""Render the Vineet / Folio magazine PrimeCrest lockup.

Cover and back use Cinzel Bold cream type, a two-tone crest
(cream peak, brass lower chevron), and a red period.

Outputs:
  public/brand/logo-primecrest-folio.png         transparent
  public/brand/logo-primecrest-folio-solid.png   on magazine ink
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CINZEL = os.path.join(ROOT, "scripts", "cinzel.ttf")
BRAND = os.path.join(ROOT, "public", "brand")

# Sampled from folio vineet.pdf back cover + vineet.css
CREAM = (247, 242, 232, 255)  # #f7f2e8 wordmark / upper crest
GOLD = (195, 154, 75, 255)  # #c39a4b lower chevron only
RED = (196, 58, 50, 255)  # #c43a32 period
INK = (12, 18, 20, 255)  # cover ink

S = 3  # supersample


def cinzel(size, weight=700):
    f = ImageFont.truetype(CINZEL, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def draw_crest(draw, x, y, h):
    """Folio cover crest — viewBox 0 0 48 42, double chevron."""
    sc = h / 42.0

    def P(px, py):
        return (x + px * sc, y + py * sc)

    draw.polygon(
        [P(24, 1.2), P(46, 20.4), P(38.8, 20.4), P(24, 8.6), P(9.2, 20.4), P(2, 20.4)],
        fill=CREAM,
    )
    draw.polygon(
        [P(24, 15.2), P(46, 34.4), P(38.8, 34.4), P(24, 22.6), P(9.2, 34.4), P(2, 34.4)],
        fill=GOLD,
    )


def tracked(draw, xy, text, fnt, track_em, fill):
    x, y = xy
    track = fnt.size * track_em
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + track
    return x - track


def text_width(draw, text, fnt, track_em):
    track = fnt.size * track_em
    return sum(draw.textlength(ch, font=fnt) for ch in text) + track * (len(text) - 1)


def make_lockup():
    name_f = cinzel(220 * S, 700)
    name = "PRIMECREST"
    track = 0.06
    probe = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(probe)
    name_w = text_width(d, name, name_f, track)
    dot_w = d.textlength(".", font=name_f)
    asc, desc = name_f.getmetrics()

    crest_h = 168 * S
    crest_w = crest_h * (48 / 42)
    gap = 36 * S
    pad = 24 * S

    w = int(crest_w + gap + name_w + dot_w + pad * 2)
    h = int(max(crest_h, asc + desc) + pad * 2)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    crest_y = pad + (asc + desc - crest_h) / 2 - 6 * S
    draw_crest(draw, pad, crest_y, crest_h)

    tx = pad + crest_w + gap
    ty = pad
    tracked(draw, (tx, ty), name, name_f, track, CREAM)
    draw.text((tx + name_w, ty), ".", font=name_f, fill=RED)

    bbox = img.getbbox()
    img = img.crop((bbox[0] - 8, bbox[1] - 8, bbox[2] + 8, bbox[3] + 8))
    # Downsample for crisp edges
    out_w = img.width // S
    out_h = img.height // S
    img = img.resize((out_w, out_h), Image.Resampling.LANCZOS)
    return img


def main():
    os.makedirs(BRAND, exist_ok=True)
    lockup = make_lockup()

    trans = os.path.join(BRAND, "logo-primecrest-folio.png")
    lockup.save(trans, "PNG")
    print("saved", trans, lockup.size)

    pad_x, pad_y = 96, 72
    solid = Image.new(
        "RGBA",
        (lockup.width + pad_x * 2, lockup.height + pad_y * 2),
        INK,
    )
    solid.alpha_composite(lockup, (pad_x, pad_y))
    solid_path = os.path.join(BRAND, "logo-primecrest-folio-solid.png")
    solid.save(solid_path, "PNG")
    print("saved", solid_path, solid.size)


if __name__ == "__main__":
    main()
