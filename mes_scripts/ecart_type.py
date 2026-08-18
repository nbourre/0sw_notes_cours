# =============================================================================
# gaussiennes_ecart_type.py
#
# Contexte : matériel pédagogique (cours sur la distribution normale).
# But      : générer une image de 4 panneaux côte à côte montrant 4 courbes
#            gaussiennes ayant TOUTES la même moyenne (mu = 0) mais des
#            écarts-types différents (sigma = 1, 2, 3, 4).
#
# Choix pédagogiques :
#   - Axes X et Y IDENTIQUES sur les 4 panneaux : c'est ce qui rend la
#     comparaison honnête (sinon les 4 courbes se ressemblent toutes).
#   - Bandes ombragées de la règle empirique 68 - 95 - 99,7 % (+/-1s, 2s, 3s).
#   - Ligne verticale pointillée sur la moyenne, identique partout, pour
#     montrer que seul l'étalement change, pas le centre.
#   - Dégradé de bleu du plus pâle (sigma petit) au plus foncé (sigma grand).
#   - Les crochets 68/95/99,7 % sont dessinés sur le DERNIER panneau
#     (le plus étalé) : c'est là qu'ils sont lisibles.
#
# Sorties : gaussiennes_ecart_type.png (300 dpi) et .svg
# Pour ajuster : modifier SIGMAS, MU, X_MIN/X_MAX, Y_MAX ci-dessous.
#
# Dépendances : numpy, matplotlib
# =============================================================================

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator
from matplotlib.patches import Patch
from matplotlib.lines import Line2D

# ---------------------------------------------------------------- paramètres
MU = 0.0
SIGMAS = [1.0, 2.0, 3.0, 4.0]

# Rampe bleue ordinale (pâle -> foncé) : le foncé = plus grand étalement
COULEURS = ["#86b6ef", "#5598e7", "#2a78d6", "#184f95"]

SURFACE = "#fcfcfb"
ENCRE = "#0b0b0b"
ENCRE_2 = "#52514e"
MUET = "#898781"
GRILLE = "#e1e0d9"
AXE = "#c3c2b7"

X_MIN, X_MAX = -13.0, 13.0
Y_MAX = 0.46

# Transparence des bandes 1s / 2s / 3s (de la plus foncée à la plus pâle)
ALPHAS = {1: 0.40, 2: 0.21, 3: 0.10}


def densite_normale(x, mu, sigma):
    """Densité de probabilité de la loi normale N(mu, sigma^2)."""
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))


# ------------------------------------------------------------------- figure
# Disposition 2 x 2 (grille). Pour revenir à une rangée : NLIG, NCOL = 1, 4
NLIG, NCOL = 2, 2

fig, grille = plt.subplots(NLIG, NCOL, figsize=(11.5, 8.6), facecolor=SURFACE)
axes = grille.ravel()

x = np.linspace(X_MIN, X_MAX, 3000)

for i, (ax, sigma, couleur) in enumerate(zip(axes, SIGMAS, COULEURS)):
    derniere_ligne = i // NCOL == NLIG - 1
    premiere_col = i % NCOL == 0
    y = densite_normale(x, MU, sigma)
    ax.set_facecolor(SURFACE)

    # --- bandes de la règle empirique, du plus large au plus étroit
    for k in (3, 2, 1):
        masque = (x >= MU - k * sigma) & (x <= MU + k * sigma)
        ax.fill_between(x[masque], 0, y[masque],
                        color=couleur, alpha=ALPHAS[k], linewidth=0, zorder=1)

    # --- repères verticaux à +/-1s, +/-2s, +/-3s
    for k in (1, 2, 3):
        for signe in (-1, 1):
            xk = MU + signe * k * sigma
            if X_MIN < xk < X_MAX:
                ax.plot([xk, xk], [0, densite_normale(xk, MU, sigma)],
                        color="#ffffff", linewidth=1.1, alpha=0.9,
                        zorder=3)

    # --- courbe
    ax.plot(x, y, color=couleur, linewidth=2.2, zorder=4,
            solid_capstyle="round")

    # --- moyenne
    ax.axvline(MU, color=ENCRE_2, linewidth=1.2, linestyle=(0, (4, 3)),
               zorder=5)

    # --- titre du panneau
    ax.set_title(f"$\\sigma = {sigma:g}$", fontsize=17, color=ENCRE, pad=16,
                 fontweight="bold")
    ax.text(0.5, 1.02, f"$\\mu = {MU:g}$", transform=ax.transAxes,
            ha="center", va="bottom", fontsize=11, color=MUET)

    # --- habillage
    ax.set_xlim(X_MIN, X_MAX)
    ax.set_ylim(0, Y_MAX)
    ax.set_xticks([-12, -8, -4, 0, 4, 8, 12])
    ax.grid(axis="y", color=GRILLE, linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
    for cote in ("top", "right"):
        ax.spines[cote].set_visible(False)
    for cote in ("left", "bottom"):
        ax.spines[cote].set_color(AXE)
        ax.spines[cote].set_linewidth(1.0)
    ax.tick_params(axis="y", colors=MUET, labelsize=9, length=0)
    ax.tick_params(axis="x", colors=MUET, labelsize=9, length=3)
    ax.yaxis.set_major_locator(MultipleLocator(0.1))

    # étiquettes d'axes seulement sur le pourtour de la grille
    if derniere_ligne:
        ax.set_xlabel("Valeur", fontsize=10, color=MUET, labelpad=6)
    else:
        ax.set_xticklabels([])
    if premiere_col:
        ax.set_ylabel("Densité de probabilité", fontsize=10.5, color=ENCRE_2,
                      labelpad=8)
    else:
        ax.set_yticklabels([])

# --------------------- crochets de la règle empirique sur le dernier panneau
axf = axes[-1]
sf = SIGMAS[-1]
niveaux = [(1, 0.155, "68 %"), (2, 0.235, "95 %"), (3, 0.315, "99,7 %")]
for k, yb, texte in niveaux:
    axf.annotate("", xy=(MU - k * sf, yb), xytext=(MU + k * sf, yb),
                 arrowprops=dict(arrowstyle="<->", color=ENCRE_2,
                                 linewidth=1.1, shrinkA=0, shrinkB=0),
                 zorder=6)
    axf.text(MU, yb + 0.012, f"$\\mu \\pm {k}\\sigma$ : {texte}",
             ha="center", va="bottom", fontsize=10.5, color=ENCRE, zorder=7,
             bbox=dict(facecolor=SURFACE, edgecolor="none", pad=1.5))

# --------------------------------------------------------- titres généraux
fig.suptitle("Effet de l'écart-type sur la courbe normale",
             fontsize=20, color=ENCRE, fontweight="bold", y=0.985)
fig.text(0.5, 0.945,
         "Même moyenne ($\\mu = 0$), quatre écarts-types, axes identiques :\n"
         "plus $\\sigma$ est grand, plus la courbe s'aplatit et s'étale.",
         ha="center", va="top", fontsize=12, color=ENCRE_2,
         linespacing=1.5)

# ------------------------------------------------------------- légende bas
legende = [
    Patch(facecolor="#2a78d6", alpha=ALPHAS[1], label="$\\mu \\pm 1\\sigma$ : 68 %"),
    Patch(facecolor="#2a78d6", alpha=ALPHAS[2], label="$\\mu \\pm 2\\sigma$ : 95 %"),
    Patch(facecolor="#2a78d6", alpha=ALPHAS[3], label="$\\mu \\pm 3\\sigma$ : 99,7 %"),
    Line2D([0], [0], color=ENCRE_2, linewidth=1.2, linestyle=(0, (4, 3)),
           label="Moyenne $\\mu$"),
]
fig.legend(handles=legende, loc="lower center", ncol=4, frameon=False,
           fontsize=11, labelcolor=ENCRE_2, bbox_to_anchor=(0.5, 0.005),
           handlelength=1.9, columnspacing=2.4)

fig.tight_layout(rect=(0, 0.045, 1, 0.885), h_pad=3.5, w_pad=2.5)

fig.savefig("gaussiennes_ecart_type.svg", facecolor=SURFACE,
            bbox_inches="tight", pad_inches=0.35)
print("SVG généré.")