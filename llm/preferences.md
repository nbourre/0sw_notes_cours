# Préférences de travail

## Rythme et validation

- Sur une série de nouveautés similaires (ex. un bac à sable par section d'une page), **construire un seul exemple, puis attendre le retour** avant de faire les suivants — ne pas tout produire d'un coup.
- Nick teste souvent en donnant un retour précis sur un défaut visuel concret (« effet miroir », « ça s'étire », « repositionne pas la balle ») plutôt qu'une description abstraite — creuser la cause réelle (ex. artéfact du bruit de Perlin, mauvais ratio d'échantillonnage) plutôt que de patcher en surface.

## Fidélité aux projets Processing existants

- Nick fournit souvent un lien vers un projet Processing existant (`github.com/nbourre/0sw_projets_cours`) comme référence pour un bac à sable. **Aller lire le code source réel** (fichiers `.pde` via `raw.githubusercontent.com`) plutôt que de deviner la logique à partir de la description du cours — les valeurs exactes (masses, coefficients, dimensions du canevas) et les petits détails de comportement (rebond asymétrique au plafond, ordre des appels) comptent et sont souvent repris tels quels dans le bac à sable web.
- Quand une adaptation s'écarte volontairement de l'original (ex. boîte de collision alignée sur la taille visuelle plutôt que fixe, couleurs plus visibles), le dire explicitement plutôt que de la présenter comme fidèle.

## Artefacts intermédiaires

- Garder les fichiers intermédiaires (scripts de génération d'image, SVG, etc.) dans le projet (`docs/<page>/assets/`), pas seulement dans le scratchpad temporaire — utile pour retoucher plus tard.

## Git

- Committer et pousser reste une action **explicite** (jamais automatique en cours de travail) — mais c'est le seul vrai mécanisme de continuité entre les machines (bureau/maison), puisque les sessions Claude Code elles-mêmes ne se transfèrent pas d'une machine à l'autre. Proposer de committer/pousser quand une quantité de travail significative n'est pas encore sauvegardée, surtout avant une pause prévisible.

## Portée des révisions de contenu

- Quand on demande de « mettre à jour » un contenu technique (ex. passage à une nouvelle version d'un logiciel), vérifier activement ce qui a changé (recherche web) plutôt que de réécrire par précaution — beaucoup de contenu reste valide et n'a pas besoin d'être touché. Ne corriger que ce qui est réellement obsolète ou incorrect, et le dire clairement.
