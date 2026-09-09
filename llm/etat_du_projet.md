# État du projet

*Dernière mise à jour : 2026-09-09. À tenir à jour après chaque session de travail significative — pas besoin de détail, juste assez pour repartir sans relire tout l'historique.*

## Fait récemment

- **`docs/c04_godot/index.md`** : révision complète du contenu, converti brut d'un export PPT (bullets fragmentés, séparateurs `---` après chaque « diapo », `alt text` générique sur toutes les images, artefacts `&nbsp;`). Réécrit en prose fluide (façon `c01_nombres_aleatoires`), garde les listes à puces seulement là où c'est légitime (étapes d'exercice, objectifs, références). Alt text réécrit pour chaque image après les avoir regardées une à une. Deux corrections de contenu :
  - Contradiction « quatre environnements de travail » vs 5 listés (2D, 3D, Script, Game, AssetLib) — retiré le décompte erroné, gardé la liste des 5.
  - Un exercice utilisait une syntaxe Godot 3.x obsolète (`Connect("pressed", this, nameof(...))`, `_Process(float delta)`) alors que le reste de la page enseigne la syntaxe C# moderne (`+=`, `double delta`) — corrigé pour rester cohérent.
  - Blocs `!!! tip`/`!!! warning` utilisés à la place des `>` blockquote et mentions ad hoc ("Bug alert!"), cohérent avec la convention du site.
  - Validé avec `mkdocs build --strict` (aucun avertissement propre à ce fichier) + inspection du HTML généré (tables, admonitions, headings).
- **Bug des bacs à sable au premier chargement** (signalé : « je dois rafraîchir la page pour que les sandbox apparaissent »), corrigé site large. Cause : p5.js était chargée en tout dernier dans le `<body>` (`extra_javascript`), après le contenu de page — un `<script>` de bac à sable exécutable natif tentait `new p5(...)` avant que `p5` n'existe, échec silencieux.
  - **Premier essai (raté, causait une régression totale — plus aucun bac à sable ne s'affichait)** : neutraliser les `<script>` d'un bloc `.p5-embed` avec `type="text/plain"` et les activer via `document$` uniquement. Abandonné et revenu en arrière (6 fichiers markdown + `p5-embed.js` restaurés à l'identique).
  - **Fix retenu** : charger p5.js dans `<head>` via un override de thème (`overrides/main.html`, `theme.custom_dir: overrides` dans `mkdocs.yml`), plutôt que via `extra_javascript`. Elle est ainsi garantie disponible avant le moindre script de contenu, peu importe l'ordre dans `extra_javascript`. `docs/javascripts/p5-embed.js` (toujours via `extra_javascript`) garde son rôle : réexécuter les scripts à la navigation instantanée ; il a aussi été amélioré pour copier correctement `src` (et forcer `async = false`) lors du clonage d'un `<script src>`, ce qui n'était pas fait avant (bug préexistant, invisible tant qu'aucune page n'était testée après une navigation instantanée entre deux pages à bacs à sable).
  - Fichiers markdown des 6 pages à bacs à sable (`c02_forces`, `c02b_attraction`, `procedural_generation`, `terrain_generation`, `p5js`, `c01_nombres_aleatoires`) : **inchangés** au final (retour à l'état d'origine après le premier essai raté). Convention mise à jour dans [workflow/readme.md](../workflow/readme.md) et [conventions.md](conventions.md).
  - **🚧 À vérifier** : testé uniquement via `mkdocs build --strict` (ordre des scripts confirmé dans le HTML généré) — pas de test dans un vrai navigateur (aucun outil headless disponible dans l'environnement). À valider avec `mkdocs serve` avant de considérer le correctif confirmé.
- **`docs/c01_nombres_aleatoires/`** : section sur la graine (seed) étoffée — cas où la graine n'est pas régénérée, piège du `randomSeed()` appelé en boucle, référence à Minecraft.
- **`docs/procedural_generation/`** (nav : *Science → Génération Procédurale → A*) : recadré autour du concept général de génération procédurale (pas juste les plateformes) ; dossier renommé depuis `procedural_generation_platform`. Contient : admonition « c'est quoi le bruit », bacs à sable bruit de Perlin + retour sur le marcheur aléatoire (avec `noise()` au lieu de `random()`), exemple de génération de plateformes.
- **`docs/terrain_generation/`** (nav : *Science → Génération Procédurale → B*) : nouvelle page adaptée de [Red Blob Games — Making maps with noise functions](https://www.redblobgames.com/maps/terrain-from-noise/). Sections **complètes avec bac à sable interactif** : bruit en 2D (effet nuage), élévation, fréquence (avec encadré « zoom » comparant les fréquences), octaves (fBm), redistribution (graphique avant/après + carte).
  - **🚧 À compléter** : à partir de « Façonner une île » (île, biomes, pour aller plus loin, résumé) — texte présent, mais aucun bac à sable encore.
  - Souhait noté dans la page (section repliée en bas) : ajouter une visualisation 3D au bout de chaque exemple.
- **`docs/c02_forces/`** : framework réutilisable `assets/forces_lib.js` (`SandboxMover` + helpers UI), puis un bac à sable par notion, fidèle aux projets Processing de référence (`github.com/nbourre/0sw_projets_cours`) :
  - `sandbox_wind.js` — `applyForce()` / vent.
  - `sandbox_accumulation.js` — accumulation de forces + bug de reset d'accélération (case à cocher pour le reproduire).
  - `sandbox_mass.js` — masse + bug de partage de vecteur (même objet `PVector` réutilisé sans copie) ; gravité + rebond ajoutés après coup.
  - `sandbox_friction.js` — friction, basé sur `s02_forces_friction`.
  - `sandbox_fluid_drag.js` — résistance des fluides à deux bandes de densité différente, basé sur `s02_forces_fluidDrag`.
  - Semble complet pour les notions enseignées (Résumé/Exercices n'ont pas besoin de bac à sable).
- **`docs/c02a_templates/`** : révisé pour Processing 4.x (la fonctionnalité de templates du carnet de croquis existe depuis 3.2 et est inchangée en 4.x — vérifié par recherche web) ; corrections mineures (casse de chemin, référence à « cette diapo » obsolète).
- **`mkdocs.yml`** : nouvelle section `Science:` en fin de nav.

## Prochaines étapes possibles (non demandées explicitement, à proposer si pertinent)

1. Continuer `terrain_generation` : bacs à sable pour île, biomes, et/ou le reste de « Pour aller plus loin ».
2. Explorer le souhait de visualisation 3D (mentionné dans `terrain_generation/index.md`, section repliée).
3. Autres pages du cours pas encore touchées cette série (voir `mkdocs.yml` pour la liste complète).

## Historique détaillé

Voir `git log` — les messages de commit sont descriptifs. Ce fichier ne remplace pas l'historique git, il donne juste le contexte immédiat pour repartir vite.
