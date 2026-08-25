import base64

W, H = 1800, 560

FONT_PATH = "/home/nbourre/.local/share/fonts/PatrickHand-Regular.ttf"
with open(FONT_PATH, "rb") as f:
    font_b64 = base64.b64encode(f.read()).decode("ascii")

gray = "#969696"
black = "#0a0a0a"

axis_x = 480
axis_top = 30
axis_bottom = 410
axis_right = 1750


def catmull_rom(p0, p1, p2, p3, t):
    t2 = t * t
    t3 = t2 * t
    return 0.5 * (
        (2 * p1)
        + (-p0 + p2) * t
        + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
        + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    )


control = [
    (0.00, 0.33),
    (0.06, 0.38),
    (0.14, 0.50),
    (0.20, 0.57),
    (0.235, 0.50),
    (0.255, 0.47),
    (0.275, 0.50),
    (0.32, 0.56),
    (0.42, 0.76),
    (0.50, 0.88),
    (0.545, 0.93),
    (0.60, 0.88),
    (0.66, 0.70),
    (0.715, 0.52),
    (0.76, 0.42),
    (0.83, 0.38),
    (0.90, 0.34),
    (0.95, 0.38),
    (1.00, 0.42),
]

pts = []
n = len(control)
samples_per_seg = 24
for i in range(n - 1):
    p0 = control[max(i - 1, 0)]
    p1 = control[i]
    p2 = control[i + 1]
    p3 = control[min(i + 2, n - 1)]
    for s in range(samples_per_seg):
        t = s / samples_per_seg
        fx = catmull_rom(p0[0], p1[0], p2[0], p3[0], t)
        fy = catmull_rom(p0[1], p1[1], p2[1], p3[1], t)
        pts.append((fx, fy))
pts.append(control[-1])

curve_top = 90
curve_bottom = axis_bottom - 10
curve_h = curve_bottom - curve_top


def to_px(fx, fy):
    x = axis_x + fx * (axis_right - axis_x)
    y = curve_bottom - fy * curve_h
    return (x, y)


px_pts = [to_px(fx, fy) for fx, fy in pts]


def point_at(frac):
    idx = min(range(len(pts)), key=lambda i: abs(pts[i][0] - frac))
    return px_pts[idx]


def fmt(v):
    return f"{v:.2f}"


path_d = "M " + " L ".join(f"{fmt(x)},{fmt(y)}" for x, y in px_pts)

tick_h = 22
p_a = point_at(0.235)
p_b = point_at(0.255)
p_c = point_at(0.545)
p_d = point_at(0.715)

brace_cx = (p_a[0] + p_b[0]) / 2
brace_y = p_a[1] - 45

text_x = p_c[0] + 90
text_y = 40
line_h = 44
text_bottom = text_y + 3 * line_h

sx, sy = text_x + 70, text_bottom + 45
ex, ey = p_d[0], p_d[1] - tick_h - 5
mx, my = ex + 10, sy + (ey - sy) * 0.55

svg_parts = []
svg_parts.append(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
    f'width="{W}" height="{H}" font-family="\'Patrick Hand\', cursive">'
)
svg_parts.append(
    f"""
<defs>
  <style>
    @font-face {{
      font-family: 'Patrick Hand';
      src: url(data:font/truetype;charset=utf-8;base64,{font_b64}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }}
    text {{ font-family: 'Patrick Hand', cursive; fill: {black}; }}
  </style>
</defs>
"""
)
svg_parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="white"/>')

# axes
svg_parts.append(f'<line x1="{axis_x}" y1="{axis_top}" x2="{axis_x}" y2="{axis_bottom}" stroke="{gray}" stroke-width="3"/>')
svg_parts.append(f'<line x1="{axis_x}" y1="{axis_bottom}" x2="{axis_right}" y2="{axis_bottom}" stroke="{gray}" stroke-width="3"/>')

# 0 / 1 labels
svg_parts.append(f'<text x="{axis_x - 40}" y="{axis_top + 20}" font-size="46">1</text>')
svg_parts.append(f'<text x="{axis_x - 40}" y="{axis_bottom + 6}" font-size="46">0</text>')

# Valeur du bruit
svg_parts.append(f'<text x="190" y="245" font-size="46">Valeur du bruit</text>')

# Temps + arrow
svg_parts.append(f'<text x="640" y="470" font-size="46">Temps</text>')
arrow_y = 460
svg_parts.append(f'<line x1="800" y1="{arrow_y}" x2="955" y2="{arrow_y}" stroke="{black}" stroke-width="3"/>')
svg_parts.append(
    f'<polygon points="955,{arrow_y-12} 985,{arrow_y} 955,{arrow_y+12}" fill="{black}"/>'
)

# noise curve
svg_parts.append(f'<path d="{path_d}" fill="none" stroke="{black}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')

# short jump ticks
for p in (p_a, p_b):
    svg_parts.append(
        f'<line x1="{fmt(p[0])}" y1="{fmt(p[1]-tick_h)}" x2="{fmt(p[0])}" y2="{fmt(p[1]+tick_h)}" stroke="{gray}" stroke-width="4"/>'
    )

# brace: small downward-curving arc between the two ticks
brace_r = (p_b[0] - p_a[0]) / 2 + 10
svg_parts.append(
    f'<path d="M {fmt(p_a[0]-10)},{fmt(brace_y-10)} '
    f'Q {fmt(brace_cx)},{fmt(brace_y+18)} {fmt(p_b[0]+10)},{fmt(brace_y-10)}" '
    f'fill="none" stroke="{black}" stroke-width="4" stroke-linecap="round"/>'
)

svg_parts.append(
    f'<text x="{fmt(brace_cx - 95)}" y="{fmt(brace_y - 150)}" font-size="38" text-anchor="start">'
    f'<tspan x="{fmt(brace_cx - 95)}" dy="0">un petit</tspan>'
    f'<tspan x="{fmt(brace_cx - 95)}" dy="44">saut dans</tspan>'
    f'<tspan x="{fmt(brace_cx - 95)}" dy="44">le temps</tspan>'
    f'</text>'
)

svg_parts.append(
    f'<text x="{fmt(brace_cx - 100)}" y="{fmt(p_a[1] + 55)}" font-size="42">t += 0.01</text>'
)

# long jump ticks
for p in (p_c, p_d):
    svg_parts.append(
        f'<line x1="{fmt(p[0])}" y1="{fmt(p[1]-tick_h)}" x2="{fmt(p[0])}" y2="{fmt(p[1]+tick_h)}" stroke="{gray}" stroke-width="4"/>'
    )

svg_parts.append(
    f'<text x="{fmt(text_x)}" y="{fmt(text_y + 30)}" font-size="38">'
    f'<tspan x="{fmt(text_x)}" dy="0">un grand</tspan>'
    f'<tspan x="{fmt(text_x)}" dy="44">saut dans</tspan>'
    f'<tspan x="{fmt(text_x)}" dy="44">le temps</tspan>'
    f'</text>'
)

# connector swoosh
svg_parts.append(
    f'<path d="M {fmt(sx)},{fmt(sy)} Q {fmt(mx)},{fmt(my)} {fmt(ex)},{fmt(ey)}" '
    f'fill="none" stroke="{black}" stroke-width="3" stroke-linecap="round"/>'
)

svg_parts.append(
    f'<text x="{fmt(p_d[0] - 100)}" y="{fmt(p_d[1] + 55)}" font-size="42">t += 0.1</text>'
)

svg_parts.append("</svg>")

out_path = "/home/nbourre/_data/projets/_cegep/_0SW/0sw_notes_cours/docs/procedural_generation/assets/perlin_noise_fr.svg"
with open(out_path, "w") as f:
    f.write("\n".join(svg_parts))

print("saved", out_path)
