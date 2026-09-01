# État du projet

*Dernière mise à jour : 2026-09-01. À tenir à jour après chaque session de travail significative — pas besoin de détail, juste assez pour repartir sans relire tout l'historique.*

## Fait récemment

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
