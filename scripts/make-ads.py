"""Generate ad creatives for Zaptick (zaptick.io) and A3M (thea3m.com).

Sizes: 970x90, 728x90, 300x250, 300x600 — rendered at 2x for retina.
Zaptick: light ground, emerald accent — "The Operating System for Communication."
A3M: dark ground, steel-cyan accent — "Intelligence that ships."
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTER = os.path.join(ROOT, "scripts", "inter.ttf")
OUT = os.path.join(ROOT, "public", "ads")
S = 2

# Zaptick palette
Z_BG = (250, 251, 250)
Z_INK = (15, 23, 42)
Z_MUT = (100, 116, 139)
Z_EM = (16, 185, 129)
Z_EM_DK = (5, 150, 105)

# A3M palette
A_BG = (10, 10, 12)
A_INK = (238, 242, 246)
A_MUT = (148, 163, 184)
A_CY = (56, 189, 248)


def font(size, wght):
    f = ImageFont.truetype(INTER, size * S)
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


def zap_glyph(d, x, y, h):
    """Rounded chat bubble with a bolt/tick."""
    r = h / 2
    d.rounded_rectangle([x, y, x + h, y + h], radius=r * 0.42, fill=Z_EM)
    # lightning tick
    cx, cy = x + h / 2, y + h / 2
    s = h * 0.30
    d.polygon(
        [
            (cx + s * 0.25, cy - s),
            (cx - s * 0.7, cy + s * 0.25),
            (cx - s * 0.06, cy + s * 0.25),
            (cx - s * 0.25, cy + s),
            (cx + s * 0.7, cy - s * 0.25),
            (cx + s * 0.06, cy - s * 0.25),
        ],
        fill=(255, 255, 255),
    )


def zap_banner(w, h):
    img, d = canvas(w, h, Z_BG)
    # hairline frame + emerald left rail
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(226, 232, 240), width=S)
    d.rectangle([0, 0, 5 * S, h * S], fill=Z_EM)

    pad = 22 * S
    gh = 46 * S
    gy = (h * S - gh) // 2
    zap_glyph(d, pad, gy, gh)

    name_f = font(30, 750)
    d.text((pad + gh + 14 * S, gy + gh / 2 - name_f.size * 0.62), "zaptick", font=name_f, fill=Z_INK)

    tag_f = font(15, 550)
    tagline = "The Operating System for Communication"
    sub = "WhatsApp · Email · SMS · Voice AI · Instagram — one platform"
    nx = pad + gh + 14 * S + d.textlength("zaptick", font=name_f) + 34 * S
    if w >= 900:
        d.text((nx, h * S / 2 - tag_f.size - 3 * S), tagline, font=tag_f, fill=Z_INK)
        d.text((nx, h * S / 2 + 4 * S), sub, font=font(13, 450), fill=Z_MUT)
    else:
        d.text((nx, h * S / 2 - tag_f.size * 0.62), tagline, font=font(14, 550), fill=Z_MUT)

    # CTA pill right
    cta_f = font(14, 650)
    cta = "Start free  →"
    cw = d.textlength(cta, font=cta_f) + 36 * S
    ch = 38 * S
    cx = w * S - pad - cw
    cy = (h * S - ch) // 2
    d.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=ch / 2, fill=Z_INK)
    d.text((cx + 18 * S, cy + ch / 2 - cta_f.size * 0.62), cta, font=cta_f, fill=(255, 255, 255))
    # url over the pill
    url_f = font(10, 600)
    uw = tracked_w(d, "ZAPTICK.IO", url_f, 0.18)
    tracked(d, (cx + (cw - uw) / 2, cy - 16 * S), "ZAPTICK.IO", url_f, 0.18, Z_EM_DK)
    return img


def zap_box(w, h):
    img, d = canvas(w, h, Z_BG)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(226, 232, 240), width=S)
    d.rectangle([0, 0, w * S, 5 * S], fill=Z_EM)

    cx = w * S / 2
    tall = h >= 500
    gh = (64 if tall else 52) * S
    gy = (h * 0.14 if tall else h * 0.11) * S
    zap_glyph(d, cx - gh / 2, gy, gh)

    name_f = font(34 if tall else 28, 750)
    ny = gy + gh + 14 * S
    d.text((cx - d.textlength("zaptick", font=name_f) / 2, ny), "zaptick", font=name_f, fill=Z_INK)

    tag_f = font(16 if tall else 14, 550)
    lines = ["The Operating System", "for Communication"]
    ty = ny + name_f.size + 16 * S
    for ln in lines:
        d.text((cx - d.textlength(ln, font=tag_f) / 2, ty), ln, font=tag_f, fill=Z_INK)
        ty += tag_f.size + 5 * S

    sub_f = font(12.5 if tall else 11, 450)
    if tall:
        subs = [
            "Campaigns, workflows, AI agents,",
            "and a developer SDK —",
            "every channel on one platform.",
        ]
        ty += 8 * S
        for ln in subs:
            d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=Z_MUT)
            ty += sub_f.size + 5 * S

    cta_f = font(14, 650)
    cta = "Start free  →"
    cw = d.textlength(cta, font=cta_f) + 40 * S
    ch = 40 * S
    cy = h * S - (int(h * 0.16) + ch // 2) * 1
    cy = h * S - ch - int(h * S * (0.14 if tall else 0.13))
    d.rounded_rectangle([cx - cw / 2, cy, cx + cw / 2, cy + ch], radius=ch / 2, fill=Z_INK)
    d.text((cx - d.textlength(cta, font=cta_f) / 2, cy + ch / 2 - cta_f.size * 0.62), cta, font=cta_f, fill=(255, 255, 255))

    url_f = font(10.5, 600)
    uw = tracked_w(d, "ZAPTICK.IO", url_f, 0.2)
    tracked(d, (cx - uw / 2, cy + ch + 10 * S), "ZAPTICK.IO", url_f, 0.2, Z_EM_DK)
    return img


def a3m_field(d, w, h):
    """Faint engineered grid + radar rings."""
    step = 26 * S
    for x in range(0, w * S, step):
        d.line([(x, 0), (x, h * S)], fill=(24, 26, 30), width=1)
    for y in range(0, h * S, step):
        d.line([(0, y), (w * S, y)], fill=(22, 24, 28), width=1)
    cx, cy = w * S * 0.9, h * S * 0.1
    for i in range(5):
        r = (i + 1) * min(w, h) * S * 0.16
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(30, 36, 44), width=S)


def a3m_banner(w, h):
    img, d = canvas(w, h, A_BG)
    a3m_field(d, w, h)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(38, 42, 50), width=S)
    d.rectangle([0, 0, 5 * S, h * S], fill=A_CY)

    pad = 24 * S
    name_f = font(34, 800)
    d.text((pad, h * S / 2 - name_f.size * 0.72), "A3M", font=name_f, fill=A_INK)
    nw = d.textlength("A3M", font=name_f)
    # divider
    dx = pad + nw + 22 * S
    d.line([(dx, h * S * 0.24), (dx, h * S * 0.76)], fill=(51, 58, 68), width=S)

    if w >= 900:
        t1 = "AI SYSTEMS FOR ENTERPRISE & INTELLIGENCE AGENCIES"
        tracked(d, (dx + 22 * S, h * S / 2 - 15 * S), t1, font(11.5, 650), 0.16, A_MUT)
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
    d.rectangle([cx, cy, cx + cw, cy + ch], outline=A_CY, width=S)
    tracked(d, (cx + 17 * S, cy + ch / 2 - cta_f.size * 0.62), cta, cta_f, 0.1, A_CY)
    return img


def a3m_box(w, h):
    img, d = canvas(w, h, A_BG)
    a3m_field(d, w, h)
    d.rectangle([0, 0, w * S - 1, h * S - 1], outline=(38, 42, 50), width=S)
    d.rectangle([0, 0, w * S, 5 * S], fill=A_CY)

    cx = w * S / 2
    tall = h >= 500
    top = int(h * S * (0.16 if tall else 0.13))

    k_f = font(10.5, 650)
    kick = "AI SYSTEMS · CYBER INTELLIGENCE"
    kw = tracked_w(d, kick, k_f, 0.2)
    tracked(d, (cx - kw / 2, top), kick, k_f, 0.2, A_CY)

    name_f = font(56 if tall else 44, 800)
    ny = top + 24 * S
    d.text((cx - d.textlength("A3M", font=name_f) / 2, ny), "A3M", font=name_f, fill=A_INK)

    sub_f = font(13 if tall else 11.5, 500)
    subs = [
        "AI systems for enterprise",
        "& intelligence agencies.",
    ]
    ty = ny + name_f.size + 18 * S
    for ln in subs:
        d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=A_MUT)
        ty += sub_f.size + 6 * S

    if tall:
        ty += 12 * S
        for ln in ["Garuda Intelligence · AEGIS", "Forensics · Field hardware", "Trusted by state police &", "intelligence partners."]:
            d.text((cx - d.textlength(ln, font=sub_f) / 2, ty), ln, font=sub_f, fill=(90, 100, 112))
            ty += sub_f.size + 6 * S

    tag_f = font(19 if tall else 16, 650)
    tag = "Intelligence that ships."
    tyy = h * S - int(h * S * (0.2 if tall else 0.24)) - tag_f.size
    d.text((cx - d.textlength(tag, font=tag_f) / 2, tyy), tag, font=tag_f, fill=A_INK)

    cta_f = font(12, 650)
    cta = "THEA3M.COM  ↗"
    cw = tracked_w(d, cta, cta_f, 0.12) + 30 * S
    ch = 36 * S
    cy = h * S - ch - int(h * S * 0.07)
    d.rectangle([cx - cw / 2, cy, cx + cw / 2, cy + ch], outline=A_CY, width=S)
    tracked(d, (cx - cw / 2 + 15 * S, cy + ch / 2 - cta_f.size * 0.62), cta, cta_f, 0.12, A_CY)
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
