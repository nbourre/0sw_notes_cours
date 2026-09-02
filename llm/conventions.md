# Conventions du projet

## Structure générale

- Site [mkdocs-material](https://www.mkdocs.org/), contenu dans `docs/`, une sous-page par sujet (un dossier `docs/<sujet>/index.md` + `docs/<sujet>/assets/`).
- Navigation définie dans [mkdocs.yml](../mkdocs.yml) (`nav:`), **indépendante** du titre H1 de la page — on peut nommer la page dans la nav sans toucher au contenu.
  - Convention pour les cours numérotés : `Cours XX:` avec des sous-entrées `A - Titre`, `B - Titre`, etc.
  - Catégories thématiques hors séquence de cours (ex. `Science:`) peuvent contenir des sous-groupes de plusieurs niveaux.
- Cours principalement en **Processing** (Java) pour les chapitres 00-03 (nombres aléatoires, forces, vecteurs, particules), puis **Godot** à partir du chapitre 04.

## Animations p5.js interactives (« bacs à sable »)

Convention détaillée dans [workflow/readme.md](../workflow/readme.md) — à lire avant d'ajouter une esquisse p5.js. Résumé :

- `mkdocs.yml` charge p5.js en CDN dans `<head>` via `overrides/main.html` (`theme.custom_dir: overrides`), pas via `extra_javascript` — sinon elle chargerait après le contenu de page (fin de `<body>`), après les scripts des esquisses. `docs/javascripts/p5-embed.js` (chargé via `extra_javascript`) force les `<script>` d'un bloc `.p5-embed` à se réexécuter à la navigation instantanée.
- Toujours écrire les sketches en **mode instance** (`(p) => { p.setup = ...; p.draw = ...; }`), jamais en mode global.
- Sketch court → inline dans le markdown. Sketch long → fichier séparé `docs/<page>/assets/nom.js` exportant `window.sketchXyz = (p) => {...}`, puis un petit bloc d'instanciation dans le markdown (`new p5(window.sketchXyz, holder)`).
- Id de conteneur unique **sur tout le site**, pas juste la page.
- Toujours `holder._p5Instance.remove()` avant de recréer une instance.

### Framework réutilisable pour une série de bacs à sable

Quand une page a **plusieurs** bacs à sable qui partagent de la logique (ex. `docs/c02_forces/`), regrouper le code commun dans un fichier `assets/<xxx>_lib.js` inclus via `<script src>` dans chaque bac à sable, **avant** le script spécifique. Voir `docs/c02_forces/assets/forces_lib.js` pour un exemple concret (classe `SandboxMover` + helpers `sandboxControlsBar/Slider/Button/Checkbox`).

**Piège important** : le fichier partagé doit envelopper tout son contenu top-level (`class`, `function`) dans une IIFE `(function () { ... })();`. Comme plusieurs bacs à sable sur une même page incluent chacun `<script src="assets/xxx_lib.js">`, et que la navigation instantanée réexécute ces balises, une `class`/`const` déclarée directement au top-level provoquerait une erreur `already declared` à la deuxième exécution.

### Contrôles interactifs

Motifs récurrents dans les bacs à sable : curseur + étiquette de valeur, bouton **Générer** (nouvelle graine aléatoire) et **Réinitialiser** (retour aux valeurs par défaut), parfois une case à cocher pour activer/désactiver un overlay pédagogique ou reproduire un bug volontairement. Regarder les fichiers existants dans `docs/*/assets/*.js` avant d'en écrire un nouveau — beaucoup de code est déjà réutilisable.

## Bruit de Perlin / génération procédurale

- Toujours éviter d'échantillonner `noise()` autour de l'origine (0,0) : le bruit de Perlin y est visuellement symétrique. Décaler avec un offset fixe (voir `docs/terrain_generation/assets/elevation_demo.js`).
- Pour garder un bruit non étiré, diviser `nx` **et** `ny` par la même référence (`cols`), pas chacun par sa propre dimension (`cols`/`rows`) — sinon le motif s'étire sur l'axe le plus court.

## Ton et style rédactionnel

- Français, tutoiement absent (vouvoiement neutre orienté élève : « vous »).
- Admonitions `!!! note/tip/warning/danger` et `??? info` (repliable) pour les asides, prérequis, pièges, et notes de rédaction — cohérent avec `pymdownx.details` déjà activé dans `mkdocs.yml`.
- Citer et lier les sources externes utilisées pour adapter du contenu (ex. Red Blob Games, Nature of Code, Khan Academy) plutôt que de paraphraser silencieusement.
