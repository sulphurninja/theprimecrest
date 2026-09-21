"""Generate ad creatives for Zaptick (zaptick.io) and A3M (thea3m.com)
using their real logos (scripts/assets/zaptick-mark.png, a3m-mark.png).

Sizes: 970x90, 728x90, 300x250, 300x600 — rendered at 2x for retina.
Zaptick: light ground, green tick mark + typeset wordmark.
A3M: light ground so the red/graphite logo reads, red accent.
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTER = os.path.join(ROOT, "scripts", "inter.ttf")
ASSETS = os.path.join(ROOT, "scripts", "assets")
OUT = os.path.join(ROOT, "public", "ads")
S = 2

ZAP_MARK = Image.open(os.path.join(ASSETS, "zaptick-mark.png")).convert("RGBA")
A3M_MARK = Image.open(os.path.join(ASSETS, "a3m-mark.png")).convert("RGBA")

# Zaptick palette (brand green sampled from favicon)
Z_BG = (250, 251, 250)
Z_INK = (15, 23, 42)
Z_MUT = (100, 116, 139)
Z_GREEN = (68, 184, 124)
Z_GREEN_DK = (36, 141, 87)

# A3M palette (brand red sampled from logo)
A_BG = (250, 250, 251)
A_INK = (26, 26, 28)
A_MUT = (110, 114, 122)
A_RED = (219, 38, 30)


def font(size, wght):
    f = ImageFont.truetype(INTER, int(size * S))
    try:
        f.set_variation_by_axes([wght])
    except Exception:
        pass
    return f


def tracked(d, xy, text, fnt, track_em, fill):
    x, y = xy
    track = fnt.size * track_em
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + track
    return x - track


def tracked_w(d, text, fnt, track_em):
    track = fnt.size * track_em
    return sum(d.textlength(c, font=fnt) for c in text) + track * (len(text) - 1)


def canvas(w, h, bg):
    img = Image.new("RGB", (w * S, h * S), bg)
    return img, ImageDraw.Draw(img)


def paste_contain(img, mark, box):
    """Paste `mark` centred inside box=(x, y, w, h), preserving aspect."""
    x, y, bw, bh = box
    scale = min(bw / mark.width, bh / mark.height)
    m = mark.resize((max(1, int(mark.width * scale)), max(1, int(mark.height * scale))), Image.LANCZOS)
    img.paste(m, (int(x + (bw - m.width) / 2), int(y + (bh - m.height) / 2)), m)
    return m.size


def zap_banner(w, h):
    img, d = canvas(w, h, Z_BG)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(226, 232, 240), width=S)
    d.rectangle([0, 0, 5 * S, h * S], fill=Z_GREEN)

    pad = 22 * S
    gh = 48 * S
    gy = (h * S - gh) // 2
    paste_contain(img, ZAP_MARK, (pad, gy, gh, gh))

    name_f = font(30, 750)
    nx = pad + gh + 12 * S
    d.text((nx, h * S / 2 - name_f.size * 0.62), "zaptick", font=name_f, fill=Z_INK)

    tx = nx + d.textlength("zaptick", font=name_f) + 34 * S
    if w >= 900:
        d.text((tx, h * S / 2 - font(15, 550).size - 3 * S), "The Operating System for Communication", font=font(15, 550), fill=Z_INK)
        d.text((tx, h * S / 2 + 4 * S), "WhatsApp · Email · SMS · Voice AI · Instagram — one platform", font=font(13, 450), fill=Z_MUT)
    else:
        d.text((tx, h * S / 2 - font(14, 550).size * 0.62), "The Operating System for Communication", font=font(14, 550), fill=Z_MUT)

    cta_f = font(14, 650)
    cta = "Start free  →"
    cw = d.textlength(cta, font=cta_f) + 36 * S
    ch = 38 * S
    cx = w * S - pad - cw
    cy = (h * S - ch) // 2
    d.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=ch / 2, fill=Z_INK)
    d.text((cx + 18 * S, cy + ch / 2 - cta_f.size * 0.62), cta, font=cta_f, fill=(255, 255, 255))
    url_f = font(10, 600)
    uw = tracked_w(d, "ZAPTICK.IO", url_f, 0.18)
    tracked(d, (cx + (cw - uw) / 2, cy - 16 * S), "ZAPTICK.IO", url_f, 0.18, Z_GREEN_DK)
    return img


def zap_box(w, h):
    img, d = canvas(w, h, Z_BG)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(226, 232, 240), width=S)
    d.rectangle([0, 0, w * S, 5 * S], fill=Z_GREEN)

    cx = w * S / 2
    tall = h >= 500
    gh = (78 if tall else 60) * S
    gy = int((h * 0.13 if tall else 0.10 * h) * S)
    paste_contain(img, ZAP_MARK, (cx - gh / 2, gy, gh, gh))

    name_f = font(34 if tall else 28, 750)
    ny = gy + gh + 12 * S
    d.text((cx - d.textlength("zaptick", font=name_f) / 2, ny), "zaptick", font=name_f, fill=Z_INK)

    tag_f = font(16 if tall else 14, 550)
    ty = ny + name_f.size + 16 * S
    for ln in ["The Operating System", "for Communication"]:
        d.text((cx - d.textlength(ln, font=tag_f) / 2, ty), ln, font=tag_f, fill=Z_INK)
        ty += tag_f.size + 5 * S

    if tall:
        sub_f = font(12.5, 450)
        ty += 10 * S
        for ln in ["Campaigns, workflows, AI agents,", "and a developer SDK —", "every channel on one platform."]:
            d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=Z_MUT)
            ty += sub_f.size + 5 * S

    cta_f = font(14, 650)
    cta = "Start free  →"
    cw = d.textlength(cta, font=cta_f) + 40 * S
    ch = 40 * S
    cy = h * S - ch - int(h * S * (0.14 if tall else 0.13))
    d.rounded_rectangle([cx - cw / 2, cy, cx + cw / 2, cy + ch], radius=ch / 2, fill=Z_INK)
    d.text((cx - d.textlength(cta, font=cta_f) / 2, cy + ch / 2 - cta_f.size * 0.62), cta, font=cta_f, fill=(255, 255, 255))

    url_f = font(10.5, 600)
    uw = tracked_w(d, "ZAPTICK.IO", url_f, 0.2)
    tracked(d, (cx - uw / 2, cy + ch + 10 * S), "ZAPTICK.IO", url_f, 0.2, Z_GREEN_DK)
    return img


def a3m_field(d, w, h):
    step = 26 * S
    for x in range(0, w * S, step):
        d.line([(x, 0), (x, h * S)], fill=(240, 240, 242), width=1)
    for y in range(0, h * S, step):
        d.line([(0, y), (w * S, y)], fill=(240, 240, 242), width=1)
    cx, cy = w * S * 0.92, h * S * 0.08
    for i in range(5):
        r = (i + 1) * min(w, h) * S * 0.16
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(234, 234, 237), width=S)


def a3m_banner(w, h):
    img, d = canvas(w, h, A_BG)
    a3m_field(d, w, h)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(222, 224, 228), width=S)
    d.rectangle([0, 0, 5 * S, h * S], fill=A_RED)

    pad = 24 * S
    lw, lh = 140 * S, 48 * S
    ly = (h * S - lh) // 2
    mw, _ = paste_contain(img, A3M_MARK, (pad, ly, lw, lh))

    dx = pad + mw + 24 * S
    d.line([(dx, h * S * 0.24), (dx, h * S * 0.76)], fill=(216, 218, 222), width=S)

    if w >= 900:
        tracked(d, (dx + 22 * S, h * S / 2 - 15 * S), "AI SYSTEMS FOR ENTERPRISE & INTELLIGENCE AGENCIES", font(11.5, 650), 0.16, A_MUT)
        d.text((dx + 22 * S, h * S / 2 + 2 * S), "Intelligence that ships.", font=font(17, 600), fill=A_INK)
    else:
        tracked(d, (dx + 20 * S, h * S / 2 - 14 * S), "AI SYSTEMS · CYBER INTELLIGENCE", font(10.5, 650), 0.16, A_MUT)
        d.text((dx + 20 * S, h * S / 2 + 2 * S), "Intelligence that ships.", font=font(15.5, 600), fill=A_INK)

    cta_f = font(13.5, 650)
    cta = "THEA3M.COM  ↗"
    cw = tracked_w(d, cta, cta_f, 0.1) + 34 * S
    ch = 38 * S
    cx = w * S - pad - cw
    cy = (h * S - ch) // 2
    d.rectangle([cx, cy, cx + cw, cy + ch], outline=A_RED, width=S)
    tracked(d, (cx + 17 * S, cy + ch / 2 - cta_f.size * 0.62), cta, cta_f, 0.1, A_RED)
    return img


def a3m_box(w, h):
    img, d = canvas(w, h, A_BG)
    a3m_field(d, w, h)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(222, 224, 228), width=S)
    d.rectangle([0, 0, w * S, 5 * S], fill=A_RED)

    cx = w * S / 2
    tall = h >= 500
    top = int(h * S * (0.13 if tall else 0.11))

    k_f = font(10.5, 650)
    kick = "AI SYSTEMS · CYBER INTELLIGENCE"
    kw = tracked_w(d, kick, k_f, 0.2)
    tracked(d, (cx - kw / 2, top), kick, k_f, 0.2, A_RED)

    lw, lh = (200 if tall else 160) * S, (70 if tall else 56) * S
    ly = top + 26 * S
    paste_contain(img, A3M_MARK, (cx - lw / 2, ly, lw, lh))

    sub_f = font(13 if tall else 11.5, 500)
    ty = ly + lh + 16 * S
    for ln in ["AI systems for enterprise", "& intelligence agencies."]:
        d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=A_MUT)
        ty += sub_f.size + 6 * S

    if tall:
        ty += 12 * S
        for ln in ["Garuda Intelligence · AEGIS", "Forensics · Field hardware", "Trusted by state police &", "intelligence partners."]:
            d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=(150, 154, 162))
            ty += sub_f.size + 6 * S

    tag_f = font(19 if tall else 15, 650)
    tag = "Intelligence that ships."
    tyy = h * S - int(h * S * (0.2 if tall else 0.25)) - tag_f.size
    d.text((cx - d.textlength(tag, font=tag_f) / 2, tyy), tag, font=tag_f, fill=A_INK)

    cta_f = font(12, 650)
    cta = "THEA3M.COM  ↗"
    cw = tracked_w(d, cta, cta_f, 0.12) + 30 * S
    ch = 36 * S
    cy = h * S - ch - int(h * S * 0.07)
    d.rectangle([cx - cw / 2, cy, cx + cw / 2, cy + ch], outline=A_RED, width=S)
    tracked(d, (cx - cw / 2 + 15 * S, cy + ch / 2 - cta_f.size * 0.62), cta, cta_f, 0.12, A_RED)
    return img


def save(img, name, w, h):
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, name)
    img.resize((w * 2, h * 2), Image.LANCZOS).save(out, "PNG", optimize=True)
    print("saved:", out)


if __name__ == "__main__":
    for w, h in [(970, 90), (728, 90)]:
        save(zap_banner(w, h), f"zaptick-{w}x{h}.png", w, h)
        save(a3m_banner(w, h), f"a3m-{w}x{h}.png", w, h)
    for w, h in [(300, 250), (300, 600)]:
        save(zap_box(w, h), f"zaptick-{w}x{h}.png", w, h)
        save(a3m_box(w, h), f"a3m-{w}x{h}.png", w, h)
