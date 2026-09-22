"""Instagram carousel for The September Issue.

1080x1350 (4:5), the size that fills the feed. Slide 1 is the hook,
slides 2-6 are the real issue covers, slide 7 is the closer.
"""
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "social", "instagram")
W, H = 1080, 1350

INK = (12, 14, 16)
CREAM = (247, 242, 232)
GOLD = (195, 154, 75)
MUTED = (168, 160, 148)

ISSUES = [
    ("espey", "James Espey OBE", "Vol. I", "Sixty years behind the world's back bar"),
    ("joan", "Joan Gillman", "Vol. II", "Forty-four years of making room for wonder"),
    ("nichole", "Dr. Nichole Pettway", "Vol. III", "Where you have been does not decide where you are going"),
    ("kohila", "Kohila Sivas", "Vol. IV", "Readiness before performance"),
    ("pallavi", "Pallavi Pande", "Vol. V", "Twenty million plates later"),
]


def font(name, size, wght=400):
    path = os.path.join(ROOT, "scripts", name)
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([wght])
    except Exception:
        pass
    return f


def tracked(draw, xy, text, fnt, em, fill):
    x, y = xy
    gap = fnt.size * em
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + gap
    return x


def tracked_w(draw, text, fnt, em):
    gap = fnt.size * em
    return sum(draw.textlength(c, font=fnt) for c in text) + gap * max(0, len(text) - 1)


def cover(slug):
    im = Image.open(os.path.join(ROOT, "public", "issues", slug, "magcover.jpg")).convert("RGB")
    return im


def shadow_paste(canvas, im, xy):
    x, y = xy
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    plate = Image.new("RGBA", (im.width, im.height), (0, 0, 0, 170))
    sh.paste(plate, (x + 18, y + 28))
    sh = sh.filter(ImageFilter.GaussianBlur(28))
    base = canvas.convert("RGBA")
    base = Image.alpha_composite(base, sh)
    base.paste(im, (x, y))
    return base.convert("RGB")


def frame():
    img = Image.new("RGB", (W, H), INK)
    return img, ImageDraw.Draw(img)


def opener():
    img, d = frame()
    # top lockup
    kick = "PRIMECREST"
    kf = font("cinzel.ttf", 28, 600)
    kw = tracked_w(d, kick, kf, 0.28)
    tracked(d, ((W - kw) / 2, 78), kick, kf, 0.28, CREAM)
    d.rectangle([(W - 36) / 2, 128, (W + 36) / 2, 132], fill=GOLD)

    hf = font("cinzel.ttf", 78, 600)
    lines = ["The September", "Issue."]
    y = 168
    for ln in lines:
        d.text(((W - d.textlength(ln, font=hf)) / 2, y), ln, font=hf, fill=CREAM)
        y += 88
    sub = "FIVE COVERS  ·  FIVE LEADERS"
    sf = font("inter.ttf", 18, 600)
    sw = tracked_w(d, sub, sf, 0.22)
    tracked(d, ((W - sw) / 2, y + 8), sub, sf, 0.22, GOLD)

    # fan of covers — kept above the swipe line
    ch = 500
    covers = []
    for slug, *_ in ISSUES:
        c = cover(slug)
        cw = int(c.width * (ch / c.height))
        covers.append(c.resize((cw, ch), Image.LANCZOS))
    rotations = [-14, -7, 0, 7, 14]
    cx = W // 2
    base_y = 500
    # paint from the outside in so the center cover sits on top
    order = [0, 4, 1, 3, 2]
    for i in order:
        c = covers[i].rotate(rotations[i], resample=Image.BICUBIC, expand=True)
        x = int(cx - c.width / 2 + (i - 2) * 78)
        y = base_y + abs(i - 2) * 14
        img = shadow_paste(img, c, (x, y))
    d = ImageDraw.Draw(img)
    cue = "SWIPE"
    cf = font("inter.ttf", 16, 650)
    cw_ = tracked_w(d, cue, cf, 0.32)
    tracked(d, ((W - cw_) / 2, H - 72), cue, cf, 0.32, CREAM)
    return img


def issue_slide(index, slug, name, volume, title):
    img, d = frame()
    c = cover(slug)
    # Leave a caption band. Fit the whole cover — never crop a name.
    max_h = 1040
    max_w = 900
    scale = min(max_w / c.width, max_h / c.height)
    c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS)
    x = (W - c.width) // 2
    y = 56
    img = shadow_paste(img, c, (x, y))
    d = ImageDraw.Draw(img)

    band_top = y + c.height + 36
    vf = font("inter.ttf", 15, 650)
    vol = f"{volume.upper()}  ·  THE SEPTEMBER ISSUE"
    vw = tracked_w(d, vol, vf, 0.2)
    tracked(d, ((W - vw) / 2, band_top), vol, vf, 0.2, GOLD)

    nf = font("cinzel.ttf", 36, 600)
    # wrap the feature line if it is long
    tf = font("newsreader.ttf", 26, 450)
    d.text(((W - d.textlength(name, font=nf)) / 2, band_top + 32), name, font=nf, fill=CREAM)

    words = title.split()
    rows, row = [], ""
    for word in words:
        trial = (row + " " + word).strip()
        if d.textlength(trial, font=tf) > 860:
            rows.append(row)
            row = word
        else:
            row = trial
    if row:
        rows.append(row)
    ty = band_top + 84
    for row in rows[:2]:
        d.text(((W - d.textlength(row, font=tf)) / 2, ty), row, font=tf, fill=MUTED)
        ty += 34

    mark = f"{index + 1}  /  {len(ISSUES)}"
    mf = font("inter.ttf", 14, 600)
    d.text(((W - d.textlength(mark, font=mf)) / 2, H - 48), mark, font=mf, fill=MUTED)
    return img


def closer():
    img, d = frame()
    kick = "NOW ON THEPRIMECREST.COM"
    kf = font("inter.ttf", 16, 650)
    kw = tracked_w(d, kick, kf, 0.24)
    tracked(d, ((W - kw) / 2, 280), kick, kf, 0.24, GOLD)

    hf = font("cinzel.ttf", 64, 600)
    for i, ln in enumerate(["Read the", "features."]):
        d.text(((W - d.textlength(ln, font=hf)) / 2, 340 + i * 78), ln, font=hf, fill=CREAM)

    # a short row of cover thumbs
    th = 280
    gap = 16
    thumbs = []
    for slug, *_ in ISSUES:
        c = cover(slug)
        tw = int(c.width * (th / c.height))
        thumbs.append(c.resize((tw, th), Image.LANCZOS))
    total = sum(t.width for t in thumbs) + gap * (len(thumbs) - 1)
    # they won't fit in a row at 280h; scale down to the width
    scale = min(1, (W - 96) / total)
    thumbs = [t.resize((int(t.width * scale), int(t.height * scale)), Image.LANCZOS) for t in thumbs]
    total = sum(t.width for t in thumbs) + gap * (len(thumbs) - 1)
    x = (W - total) // 2
    y = 560
    for t in thumbs:
        img = shadow_paste(img, t, (x, y))
        x += t.width + gap
    d = ImageDraw.Draw(img)

    url_f = font("cinzel.ttf", 28, 600)
    url = "theprimecrest.com"
    d.text(((W - d.textlength(url, font=url_f)) / 2, H - 220), url, font=url_f, fill=CREAM)
    note = "LINK IN BIO"
    nf = font("inter.ttf", 15, 650)
    nw = tracked_w(d, note, nf, 0.28)
    tracked(d, ((W - nw) / 2, H - 160), note, nf, 0.28, GOLD)
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    slides = [opener()]
    for i, item in enumerate(ISSUES):
        slides.append(issue_slide(i, *item))
    slides.append(closer())
    for i, slide in enumerate(slides, start=1):
        path = os.path.join(OUT, f"{i:02d}.jpg")
        slide.save(path, "JPEG", quality=92, optimize=True)
        print("saved", path, slide.size)


if __name__ == "__main__":
    main()
