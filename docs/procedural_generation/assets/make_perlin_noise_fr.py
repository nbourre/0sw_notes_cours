import numpy as np
from PIL import Image, ImageDraw, ImageFont

SCALE = 3  # supersample for anti-aliasing
W, H = 1800 * SCALE, 560 * SCALE

img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)

FONT_PATH = "/home/nbourre/.local/share/fonts/PatrickHand-Regular.ttf"


def font(size):
    return ImageFont.truetype(FONT_PATH, size * SCALE)


gray = (150, 150, 150)
black = (10, 10, 10)

axis_x = 480 * SCALE
axis_top = 30 * SCALE
axis_bottom = 410 * SCALE
axis_right = 1750 * SCALE

# Y axis
d.line([(axis_x, axis_top), (axis_x, axis_bottom)], fill=gray, width=3 * SCALE)
# X axis
d.line([(axis_x, axis_bottom), (axis_right, axis_bottom)], fill=gray, width=3 * SCALE)

# axis labels 0 / 1
d.text((axis_x - 40 * SCALE, axis_top - 14 * SCALE), "1", fill=black, font=font(46))
d.text((axis_x - 40 * SCALE, axis_bottom - 28 * SCALE), "0", fill=black, font=font(46))

# "Valeur du bruit" label
d.text((190 * SCALE, 205 * SCALE), "Valeur du bruit", fill=black, font=font(46))

# "Temps" label + arrow
d.text((640 * SCALE, 430 * SCALE), "Temps", fill=black, font=font(46))
arrow_y = 460 * SCALE
d.line([(800 * SCALE, arrow_y), (955 * SCALE, arrow_y)], fill=black, width=3 * SCALE)
d.polygon(
    [
        (955 * SCALE, arrow_y - 12 * SCALE),
        (985 * SCALE, arrow_y),
        (955 * SCALE, arrow_y + 12 * SCALE),
    ],
    fill=black,
)

# ---- Catmull-Rom spline through control points to draw the "noise" curve ----
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

xs = np.array([c[0] for c in control])
ys = np.array([c[1] for c in control])


def catmull_rom(p0, p1, p2, p3, t):
    t2 = t * t
    t3 = t2 * t
    return 0.5 * (
        (2 * p1)
        + (-p0 + p2) * t
        + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
        + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    )


pts = []
n = len(control)
samples_per_seg = 40
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

curve_top = 90 * SCALE
curve_bottom = axis_bottom - 10 * SCALE
curve_h = curve_bottom - curve_top


def to_px(fx, fy):
    x = axis_x + fx * (axis_right - axis_x)
    y = curve_bottom - fy * curve_h
    return (x, y)


px_pts = [to_px(fx, fy) for fx, fy in pts]
d.line(px_pts, fill=black, width=5 * SCALE, joint="curve")


# helper to get (x,y) on curve at a given fraction, via nearest sample
def point_at(frac):
    idx = min(range(len(pts)), key=lambda i: abs(pts[i][0] - frac))
    return px_pts[idx]


# ---- short jump annotation ----
p_a = point_at(0.235)
p_b = point_at(0.255)
tick_h = 22 * SCALE
for p in (p_a, p_b):
    d.line([(p[0], p[1] - tick_h), (p[0], p[1] + tick_h)], fill=gray, width=4 * SCALE)

# small downward-curving brace between the two ticks
brace_y = p_a[1] - 45 * SCALE
d.arc(
    [p_a[0] - 10 * SCALE, brace_y - 16 * SCALE, p_b[0] + 10 * SCALE, brace_y + 16 * SCALE],
    start=200,
    end=340,
    fill=black,
    width=4 * SCALE,
)

short_text = "un petit\nsaut dans\nle temps"
short_text_bottom = brace_y - 20 * SCALE
d.multiline_text(
    ((p_a[0] + p_b[0]) / 2 - 95 * SCALE, short_text_bottom - 130 * SCALE),
    short_text,
    fill=black,
    font=font(38),
    align="center",
    spacing=4 * SCALE,
)

d.text(
    ((p_a[0] + p_b[0]) / 2 - 100 * SCALE, p_a[1] + 55 * SCALE),
    "t += 0.01",
    fill=black,
    font=font(42),
)

# ---- long jump annotation ----
p_c = point_at(0.545)  # peak, start of long jump
p_d = point_at(0.715)  # after the drop, end of long jump
for p in (p_c, p_d):
    d.line([(p[0], p[1] - tick_h), (p[0], p[1] + tick_h)], fill=gray, width=4 * SCALE)

text_x = p_c[0] + 90 * SCALE
text_y = 40 * SCALE
long_text = "un grand\nsaut dans\nle temps"
line_h = 44 * SCALE
d.multiline_text((text_x, text_y), long_text, fill=black, font=font(38), align="center", spacing=4 * SCALE)
text_bottom = text_y + 3 * line_h

# curved connector from just below the text down to p_d, mimic hand-drawn swoosh
curve_pts = []
sx, sy = text_x + 70 * SCALE, text_bottom + 45 * SCALE
ex, ey = p_d[0], p_d[1] - tick_h - 5 * SCALE
mx, my = ex + 10 * SCALE, sy + (ey - sy) * 0.55
steps = 40
for i in range(steps + 1):
    t = i / steps
    bx = (1 - t) ** 2 * sx + 2 * (1 - t) * t * mx + t ** 2 * ex
    by = (1 - t) ** 2 * sy + 2 * (1 - t) * t * my + t ** 2 * ey
    curve_pts.append((bx, by))
d.line(curve_pts, fill=black, width=3 * SCALE, joint="curve")

d.text(
    (p_d[0] - 100 * SCALE, p_d[1] + 55 * SCALE),
    "t += 0.1",
    fill=black,
    font=font(42),
)

img = img.resize((1800, 560), Image.LANCZOS)
out_path = "/home/nbourre/_data/projets/_cegep/_0SW/0sw_notes_cours/docs/procedural_generation/assets/perlin_noise_fr.png"
img.save(out_path)
print("saved", out_path)
