"""
WIMA CAR — case-study asset generator.

Builds the still images served from /public/projects/wima-car/:
  cover.webp   16:10 brand cover carrying the project's own data
  home.webp    the localized homepage
  fleet.webp   the crawlable fleet index
  vehicle.webp a dedicated vehicle page

Everything is drawn from the WIMA CAR brand tokens (near-black canvas + red
#D71920), so the assets match the /wima-car page and the project card on the
home page. No remote assets: the site runs under a strict CSP.

Run:
  python scripts/gen-wima-assets.py
"""

from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ── Brand tokens (mirrors src/data/wima.ts → wimaPalette) ───────────────────
BG = (10, 10, 11)
BG_2 = (13, 14, 16)
WELL = (16, 17, 20)
PANEL = (18, 19, 22)
PANEL_2 = (23, 24, 28)
BODY = (34, 36, 42)
GLASS = (47, 50, 58)
TIRE = (20, 21, 24)
RIM = (62, 65, 73)
LINE = (34, 36, 41)
LINE_2 = (48, 51, 58)
FG = (243, 244, 246)
FG_2 = (201, 204, 210)
MUTED = (138, 144, 153)
DIM = (92, 98, 107)
RED = (215, 25, 32)
RED_2 = (255, 59, 65)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"
SANS_B = os.path.join(FONT_DIR, "segoeuib.ttf")
SANS_R = os.path.join(FONT_DIR, "segoeui.ttf")
MONO_B = os.path.join(FONT_DIR, "consolab.ttf")
MONO_R = os.path.join(FONT_DIR, "consola.ttf")

OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "projects", "wima-car",
)

_font_cache: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}


def F(path: str, size: int) -> ImageFont.FreeTypeFont:
    key = (path, size)
    if key not in _font_cache:
        _font_cache[key] = ImageFont.truetype(path, size)
    return _font_cache[key]


# ── Text helpers ────────────────────────────────────────────────────────────


def ls_width(draw, text: str, font, spacing: float) -> float:
    if not text:
        return 0.0
    return draw.textlength(text, font=font) + spacing * (len(text) - 1)


def ls_text(draw, xy, text: str, font, fill, spacing: float = 0.0,
            right: float | None = None, center: float | None = None) -> float:
    """Draw letter-spaced text, optionally right-aligned or centred."""
    x, y = xy
    if right is not None:
        x = right - ls_width(draw, text, font, spacing)
    elif center is not None:
        x = center - ls_width(draw, text, font, spacing) / 2
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing
    return x


# ── Shape helpers ───────────────────────────────────────────────────────────


def glow(size, center, radius, color, strength=1.0) -> Image.Image:
    """Soft elliptical glow returned as an RGBA layer ready to paste."""
    w, h = size
    grad = Image.radial_gradient("L").resize((w, h), Image.LANCZOS)
    mask = grad.point(lambda v: int((255 - v) * strength))  # 0 centre → 255 edge
    tint = Image.new("RGB", (w, h), color)
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    layer.paste(tint, (0, 0), mask)
    ellipse = Image.new("L", (w, h), 0)
    ImageDraw.Draw(ellipse).ellipse(
        [center[0] - radius, center[1] - radius * 0.78,
         center[0] + radius, center[1] + radius * 0.78],
        fill=255,
    )
    falloff = ellipse.filter(ImageFilter.GaussianBlur(radius * 0.34))
    layer.putalpha(Image.composite(layer.getchannel("A"), Image.new("L", (w, h), 0), falloff))
    return layer


def rr(draw, box, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def car(draw, x0, y0, w, body=BODY, glass=GLASS, tire=TIRE, rim=RIM,
        arch=None, accent=None) -> float:
    """
    Stylised side-view vehicle (SUV proportions) drawn into a box `w` wide.
    Returns the height used. `arch` punches wheel wells in a colour — normally
    the surrounding surface — and `accent` draws the red rim light.
    """
    h = w * 0.46
    px = lambda u: x0 + u * w
    py = lambda v: y0 + v * h

    outline = [
        (0.035, 0.940), (0.012, 0.700), (0.062, 0.560), (0.212, 0.498),
        (0.352, 0.175), (0.588, 0.148), (0.756, 0.478), (0.936, 0.522),
        (0.988, 0.678), (0.972, 0.940),
    ]
    draw.polygon([(px(u), py(v)) for u, v in outline], fill=body)

    # Greenhouse + B-pillar
    draw.polygon(
        [(px(0.262), py(0.486)), (px(0.368), py(0.226)),
         (px(0.570), py(0.200)), (px(0.706), py(0.470))],
        fill=glass,
    )
    draw.polygon(
        [(px(0.466), py(0.208)), (px(0.502), py(0.206)),
         (px(0.502), py(0.478)), (px(0.466), py(0.478))],
        fill=body,
    )

    wr = 0.118 * w
    wy = y0 + h - wr
    for cx in (px(0.202), px(0.788)):
        if arch is not None:
            draw.ellipse([cx - wr * 1.32, wy - wr * 1.32, cx + wr * 1.32, wy + wr * 1.32], fill=arch)
        draw.ellipse([cx - wr, wy - wr, cx + wr, wy + wr], fill=tire)
        draw.ellipse([cx - wr * 0.55, wy - wr * 0.55, cx + wr * 0.55, wy + wr * 0.55], fill=rim)

    if accent is not None:
        lw = max(2, int(w * 0.0055))
        draw.line([(px(0.066), py(0.585)), (px(0.212), py(0.518))], fill=accent, width=lw)
        draw.line([(px(0.940), py(0.548)), (px(0.982), py(0.672))], fill=accent, width=lw)
    return h


# ── Reusable site chrome ────────────────────────────────────────────────────


def brandmark(draw, x, y, size=27, dot=17, label="WIMA CAR", fill=FG, gap=14, spacing=5.0):
    draw.rounded_rectangle([x, y + size * 0.20, x + dot, y + size * 0.20 + dot],
                           radius=4, fill=RED)
    ls_text(draw, (x + dot + gap, y), label, F(MONO_B, size), fill, spacing)


def site_nav(draw, w, y=0, h=88, langs=("FR", "AR", "EN", "ES", "IT"), active="FR"):
    draw.rectangle([0, y, w, y + h], fill=(12, 13, 15))
    draw.line([(0, y + h), (w, y + h)], fill=LINE, width=1)
    brandmark(draw, 44, y + 27, size=25, dot=15)

    lx = w * 0.30
    for i, t in enumerate(("Accueil", "Véhicules", "Services", "Contact")):
        f = F(SANS_R, 19)
        draw.text((lx, y + 32), t, font=f, fill=FG if i == 0 else FG_2)
        lx += draw.textlength(t, font=f) + 38

    # CTA first, then languages right-to-left so nothing can collide
    cta_w = 150
    cta_x = w - 44 - cta_w
    fl = F(MONO_B, 15)
    chips = []
    for lg in langs:
        tw = draw.textlength(lg, font=fl) + 18
        chips.append((lg, tw))
    total = sum(t for _, t in chips) + 8 * (len(chips) - 1)
    rx = cta_x - 34 - total
    for lg, tw in chips:
        box = [rx, y + 30, rx + tw, y + 58]
        if lg == active:
            rr(draw, box, 6, fill=RED)
            draw.text((rx + 9, y + 35), lg, font=fl, fill=WHITE)
        else:
            rr(draw, box, 6, outline=LINE_2)
            draw.text((rx + 9, y + 35), lg, font=fl, fill=MUTED)
        rx += tw + 8

    label = "RÉSERVER"
    tw = ls_width(draw, label, fl, 1.6)
    rr(draw, [cta_x, y + 24, cta_x + cta_w, y + 66], 21, fill=RED)
    ls_text(draw, (cta_x + (cta_w - tw) / 2, y + 34), label, fl, WHITE, 1.6)


def cta(draw, x, y, label, h=60, pad=30, fill=RED, color=WHITE, size=17, spacing=1.8, radius=None):
    f = F(MONO_B, size)
    tw = ls_width(draw, label, f, spacing)
    rr(draw, [x, y, x + tw + pad * 2, y + h], radius or h // 2, fill=fill)
    ls_text(draw, (x + pad, y + (h - size * 1.42) / 2 + 4), label, f, color, spacing)
    return tw + pad * 2


def ghost_cta(draw, x, y, label, h=44, pad=22, size=14, spacing=1.6):
    f = F(MONO_B, size)
    tw = ls_width(draw, label, f, spacing)
    rr(draw, [x, y, x + tw + pad * 2, y + h], h // 2, outline=LINE_2)
    ls_text(draw, (x + pad, y + (h - size * 1.42) / 2 + 3), label, f, FG_2, spacing)
    return tw + pad * 2


def vehicle_card(draw, x, y, cw, ch, name, sub, price, badge=None):
    """Fleet tile: image well on top, commercial line + ghost CTA below."""
    rr(draw, [x, y, x + cw, y + ch], 16, fill=PANEL, outline=LINE)
    well_h = int(ch * 0.575)
    draw.rectangle([x + 1, y + 1, x + cw - 1, y + well_h], fill=WELL)
    cw_img = int(cw * 0.60)
    car(draw, x + (cw - cw_img) / 2, y + 14, cw_img, arch=WELL)

    ty = y + well_h + 20
    ls_text(draw, (x + 28, ty), name.upper(), F(SANS_B, 25), FG, 0.4)
    ls_text(draw, (x + 28, ty + 36), sub.upper(), F(MONO_R, 14), MUTED, 1.5)
    ls_text(draw, (x + 28, ty + 66), price, F(MONO_B, 15), RED_2, 1.4)
    if badge:
        wb = ghost_cta(draw, x + cw - 26 - ls_width(draw, badge, F(MONO_B, 14), 1.6) - 44, ty + 40, badge)
        _ = wb


# ════════════════════════════════════════════════════════════════════════════
# 1. COVER — 1600×1000, brand cover carrying the project's own data
# ════════════════════════════════════════════════════════════════════════════

def build_cover() -> Image.Image:
    W, H = 1600, 1000
    img = Image.new("RGB", (W, H), BG)
    for center, radius, color, strength in (
        ((1190, 130), 900, RED, 0.30),
        ((150, 890), 760, WHITE, 0.045),
    ):
        g = glow((W, H), center, radius, color, strength)
        img.paste(g, (0, 0), g)

    d = ImageDraw.Draw(img)
    M = 92

    brandmark(d, M, 66, size=27, dot=17)
    ls_text(d, (0, 76), "CASE STUDY · WEB DEVELOPMENT · SEO", F(MONO_R, 16), DIM, 2.6, right=W - M)
    d.line([(M, 152), (W - M, 152)], fill=LINE, width=1)

    # Ghosted vehicle, right half, fully inside the frame
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    car(ImageDraw.Draw(layer), 812, 258, 660, body=BODY, glass=GLASS,
        tire=TIRE, rim=RIM, arch=BG, accent=RED)
    layer.putalpha(layer.getchannel("A").point(lambda v: int(v * 0.86)))
    img.paste(layer, (0, 0), layer)
    d = ImageDraw.Draw(img)

    # Headline
    f1 = F(SANS_B, 168)
    ls_text(d, (M, 196), "WIMA", f1, FG, -6)
    xw = ls_width(d, "WIMA", f1, -6)
    ls_text(d, (M + xw - 6, 196), ".", f1, RED, -6)
    ls_text(d, (M, 344), "CAR", f1, RED, -6)

    ls_text(d, (M, 552), "LOCATION DE VOITURES À RABAT", F(MONO_B, 19), FG_2, 4.2)
    d.line([(M, 606), (M + 96, 606)], fill=RED, width=4)
    ls_text(d, (M, 626), "FROM A LIMITED DIGITAL PRESENCE TO A MULTILINGUAL,", F(SANS_R, 21), MUTED, 0.2)
    ls_text(d, (M, 656), "SEARCH-READY CAR RENTAL PLATFORM.", F(SANS_R, 21), MUTED, 0.2)

    # Metrics strip — the project's own numbers
    top, bot = 730, 886
    rr(d, [M, top, W - M, bot], 14, fill=BG_2, outline=LINE, width=1)
    metrics = [("175", "", "ORGANIC CLICKS"), ("5,340", "", "IMPRESSIONS"),
               ("4.2", "%", "AVERAGE CTR"), ("51.6", "", "AVERAGE POSITION")]
    col = (W - M * 2) / 4
    for i, (val, unit, label) in enumerate(metrics):
        cx = M + col * i
        if i:
            d.line([(cx, top + 22), (cx, bot - 22)], fill=LINE, width=1)
        fv, fu = F(SANS_B, 56), F(SANS_B, 30)
        vw = d.textlength(val, font=fv)
        uw = d.textlength(unit, font=fu) if unit else 0
        vx = cx + (col - (vw + uw)) / 2
        d.text((vx, top + 34), val, font=fv, fill=FG)
        if unit:
            d.text((vx + vw + 2, top + 56), unit, font=fu, fill=RED_2)
        ls_text(d, (0, bot - 46), label, F(MONO_R, 14), MUTED, 2.4, center=cx + col / 2)

    ls_text(d, (M, 918), "GOOGLE SEARCH CONSOLE · 08 AUG → 14 SEP 2026 · INITIAL PERIOD FOLLOWING LAUNCH",
            F(MONO_R, 14), DIM, 1.6)

    for cx, cy, sx, sy in ((M - 20, 194, 1, 1), (W - M + 20, 194, -1, 1),
                           (M - 20, 932, 1, -1), (W - M + 20, 932, -1, -1)):
        d.line([(cx, cy), (cx + 14 * sx, cy)], fill=RED, width=2)
        d.line([(cx, cy), (cx, cy + 14 * sy)], fill=RED, width=2)
    return img


# ════════════════════════════════════════════════════════════════════════════
# 2. HOMEPAGE — 1920×1040
# ════════════════════════════════════════════════════════════════════════════

def build_home() -> Image.Image:
    W, H = 1920, 1040
    img = Image.new("RGB", (W, H), BG)
    g = glow((W, H), (1420, 260), 980, RED, 0.26)
    img.paste(g, (0, 0), g)
    d = ImageDraw.Draw(img)

    site_nav(d, W, 0, 88)

    ls_text(d, (96, 236), "LOCATION DE VOITURES", F(SANS_B, 74), FG, -2.4)
    ls_text(d, (96, 322), "À RABAT", F(SANS_B, 74), RED, -2.4)
    ls_text(d, (96, 434), "RÉSERVEZ VOTRE VÉHICULE EN QUELQUES MINUTES —", F(SANS_R, 21), MUTED, 0.4)
    ls_text(d, (96, 464), "LIVRAISON AÉROPORT · LONGUE DURÉE · VÉHICULES RÉCENTS.", F(SANS_R, 21), MUTED, 0.4)

    cw = cta(d, 96, 520, "RÉSERVER MAINTENANT")
    ls_text(d, (96 + cw + 30, 542), "OU APPELER  +212 5 37 00 00 00", F(MONO_R, 16), DIM, 1.4)

    car(d, 1000, 250, 800, arch=None, accent=RED)

    # Fleet strip
    ls_text(d, (96, 676), "NOTRE FLOTTE", F(MONO_B, 19), FG, 3.4)
    ls_text(d, (96, 708), "CITADINE · SUV · BERLINE · UTILITAIRE", F(MONO_R, 15), DIM, 1.8)

    cards = [
        ("Citadine", "5 places · manuelle · clim", "À PARTIR DE 250 MAD / JOUR"),
        ("SUV", "5 places · diesel · clim", "À PARTIR DE 450 MAD / JOUR"),
        ("Berline", "5 places · automatique · clim", "À PARTIR DE 400 MAD / JOUR"),
    ]
    ccw, gap, cch, top = 566, 30, 264, 752
    for i, (name, sub, price) in enumerate(cards):
        vehicle_card(d, 96 + i * (ccw + gap), top, ccw, cch, name, sub, price, "RÉSERVER")
    return img


# ════════════════════════════════════════════════════════════════════════════
# 3. FLEET INDEX — 1920×1040
# ════════════════════════════════════════════════════════════════════════════

def build_fleet() -> Image.Image:
    W, H = 1920, 1040
    img = Image.new("RGB", (W, H), BG)
    g = glow((W, H), (960, -160), 1100, RED, 0.16)
    img.paste(g, (0, 0), g)
    d = ImageDraw.Draw(img)

    site_nav(d, W, 0, 88)

    ls_text(d, (96, 148), "NOTRE FLOTTE", F(SANS_B, 52), FG, -1.4)
    ls_text(d, (96, 222), "34 VÉHICULES · 5 LANGUES · CHAQUE VÉHICULE A SA PROPRE URL INDEXÉE",
            F(MONO_R, 16), DIM, 1.8)

    rows = [
        ("Citadine", "Clio · 208 · Ibiza", "À PARTIR DE 250 MAD / JOUR"),
        ("SUV", "Duster · Qashqai · Tiguan", "À PARTIR DE 450 MAD / JOUR"),
        ("Berline", "Passat · Talisman · C5", "À PARTIR DE 400 MAD / JOUR"),
        ("Utilitaire", "Kangoo · Partner · Trafic", "À PARTIR DE 380 MAD / JOUR"),
        ("Premium", "Classe C · Série 3 · A4", "À PARTIR DE 900 MAD / JOUR"),
        ("Monospace", "Scenic · C4 Picasso", "À PARTIR DE 500 MAD / JOUR"),
    ]
    ccw, cch, gap = 566, 322, 30
    for i, (name, models, price) in enumerate(rows):
        col, row = i % 3, i // 3
        vehicle_card(d, 96 + col * (ccw + gap), 296 + row * (cch + 26), ccw, cch,
                     name, models, price, "VOIR")
    return img


# ════════════════════════════════════════════════════════════════════════════
# 4. VEHICLE DETAIL — 1440×1040
# ════════════════════════════════════════════════════════════════════════════

def build_vehicle() -> Image.Image:
    W, H = 1440, 1040
    img = Image.new("RGB", (W, H), BG)
    g = glow((W, H), (500, 360), 880, RED, 0.24)
    img.paste(g, (0, 0), g)
    d = ImageDraw.Draw(img)

    site_nav(d, W, 0, 88)

    ls_text(d, (72, 132), "ACCUEIL  /  VÉHICULES  /  CITADINE  /  RENAULT CLIO 5", F(MONO_R, 14), DIM, 1.6)

    rr(d, [72, 190, 872, 620], 18, fill=WELL, outline=LINE)
    car(d, 156, 268, 630, arch=WELL, accent=RED)

    for i in range(4):
        x = 72 + i * 106
        rr(d, [x, 646, x + 90, 736], 10, fill=PANEL, outline=RED if i == 0 else LINE)
        car(d, x + 18, 672, 54, body=(38, 40, 46), glass=(50, 53, 60), tire=TIRE,
            rim=RIM, arch=PANEL)

    x = 920
    ls_text(d, (x, 196), "CITADINE", F(MONO_B, 16), RED_2, 3.2)
    ls_text(d, (x, 232), "RENAULT CLIO 5", F(SANS_B, 46), FG, -1.2)
    ls_text(d, (x, 300), "BOÎTE MANUELLE · 5 PLACES · CLIMATISATION · ESSENCE", F(MONO_R, 15), MUTED, 1.4)
    d.line([(x, 344), (W - 72, 344)], fill=LINE, width=1)

    specs = [("TRANSMISSION", "Manuelle"), ("CARBURANT", "Essence"),
             ("PLACES", "5"), ("CLIMATISATION", "Oui"),
             ("PORTES", "5"), ("BAGAGES", "2 valises")]
    for i, (k, v) in enumerate(specs):
        col, row = i % 2, i // 2
        sx, sy = x + col * 232, 372 + row * 84
        ls_text(d, (sx, sy), k, F(MONO_R, 13), DIM, 1.8)
        ls_text(d, (sx, sy + 24), v, F(SANS_B, 22), FG, 0.2)

    d.line([(x, 636), (W - 72, 636)], fill=LINE, width=1)
    ls_text(d, (x, 664), "250 MAD", F(SANS_B, 52), FG, -1.4)
    ls_text(d, (x + 216, 692), "/ JOUR", F(MONO_R, 17), MUTED, 1.6)
    ls_text(d, (x, 740), "LIVRAISON AÉROPORT RABAT-SALÉ DISPONIBLE", F(MONO_R, 14), DIM, 1.6)

    cta(d, x, 786, "RÉSERVER CE VÉHICULE", h=64)

    ls_text(d, (72, 900), "SCHEMA.ORG VEHICLE  ·  CANONICAL /FR/VEHICULES/RENAULT-CLIO-5  ·  HREFLANG ×5",
            F(MONO_R, 14), DIM, 1.6)
    return img


# ════════════════════════════════════════════════════════════════════════════
# 5. MOBILE HOMEPAGE — 900×1900 (the reservation flow at 390px)
# ════════════════════════════════════════════════════════════════════════════

def build_mobile() -> Image.Image:
    W, H = 900, 1900
    img = Image.new("RGB", (W, H), BG)
    g = glow((W, H), (450, 60), 700, RED, 0.26)
    img.paste(g, (0, 0), g)
    d = ImageDraw.Draw(img)

    # Nav
    d.rectangle([0, 0, W, 124], fill=(12, 13, 15))
    d.line([(0, 124), (W, 124)], fill=LINE, width=1)
    brandmark(d, 44, 46, size=24, dot=14)
    rx = W - 44
    for lg, on in (("EN", False), ("AR", False), ("FR", True)):
        f = F(MONO_B, 17)
        tw = d.textlength(lg, font=f) + 22
        rx -= tw
        box = [rx, 44, rx + tw, 80]
        if on:
            rr(d, box, 8, fill=RED)
            d.text((rx + 11, 51), lg, font=f, fill=WHITE)
        else:
            rr(d, box, 8, outline=LINE_2)
            d.text((rx + 11, 51), lg, font=f, fill=MUTED)
        rx -= 10

    # Hero
    ls_text(d, (48, 200), "LOCATION DE VOITURES", F(SANS_B, 52), FG, -1.4)
    ls_text(d, (48, 264), "À RABAT", F(SANS_B, 52), RED, -1.4)
    ls_text(d, (48, 356), "Réservez votre véhicule en quelques", F(SANS_R, 23), MUTED, 0.3)
    ls_text(d, (48, 392), "minutes — livraison aéroport, longue", F(SANS_R, 23), MUTED, 0.3)
    ls_text(d, (48, 428), "durée, véhicules récents.", F(SANS_R, 23), MUTED, 0.3)

    cta(d, 48, 496, "RÉSERVER MAINTENANT", h=86, pad=44, size=22, spacing=2.2)

    # Vehicle stage
    d.rectangle([48, 640, W - 48, 900], fill=WELL)
    car(d, 132, 682, 636, arch=WELL, accent=RED)

    # Fleet list
    ls_text(d, (48, 950), "NOTRE FLOTTE", F(MONO_B, 20), FG, 3.2)
    ls_text(d, (48, 986), "DISPONIBLES AUJOURD'HUI", F(MONO_R, 15), DIM, 1.8)

    rows = [("Citadine", "Clio · 208 · Ibiza", "250 MAD / JOUR"),
            ("SUV", "Duster · Qashqai", "450 MAD / JOUR"),
            ("Berline", "Passat · Talisman", "400 MAD / JOUR")]
    for i, (name, models, price) in enumerate(rows):
        y = 1046 + i * 232
        rr(d, [48, y, W - 48, y + 208], 18, fill=PANEL, outline=LINE)
        d.rectangle([49, y + 1, W - 49, y + 128], fill=WELL)
        car(d, 148, y + 22, 440, arch=WELL)
        ls_text(d, (76, y + 142), name.upper(), F(SANS_B, 24), FG, 0.4)
        ls_text(d, (76, y + 176), models.upper(), F(MONO_R, 14), MUTED, 1.5)
        f = F(MONO_B, 14)
        lab = "RÉSERVER"
        tw = ls_width(d, lab, f, 1.6)
        rr(d, [W - 76 - tw - 44, y + 148, W - 76, y + 194], 23, fill=RED)
        ls_text(d, (W - 76 - tw - 22, y + 162), lab, f, WHITE, 1.6)

    # Sticky bottom bar
    d.rectangle([0, H - 132, W, H], fill=(12, 13, 15))
    d.line([(0, H - 132), (W, H - 132)], fill=LINE, width=1)
    ls_text(d, (48, H - 96), "APPELER  +212 5 37 00 00 00", F(MONO_R, 18), MUTED, 1.6)
    f = F(MONO_B, 17)
    lab = "RÉSERVER"
    tw = ls_width(d, lab, f, 1.8)
    rr(d, [W - 48 - tw - 56, H - 106, W - 48, H - 36], 35, fill=RED)
    ls_text(d, (W - 48 - tw - 28, H - 82), lab, f, WHITE, 1.8)
    return img


# ════════════════════════════════════════════════════════════════════════════

def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, fn in (("cover.webp", build_cover), ("home.webp", build_home),
                     ("fleet.webp", build_fleet), ("vehicle.webp", build_vehicle),
                     ("mobile.webp", build_mobile)):
        img = fn()
        path = os.path.join(OUT_DIR, name)
        img.save(path, "WEBP", quality=92, method=6)
        print(f"{name:14s} {img.width}x{img.height}  {os.path.getsize(path) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
