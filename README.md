# 0sw_notes_cours
Les notes pour le cours Programmation jeux et multimédias (420-0SW-SW).

Le contenu est publié sous forme de site [mkdocs](https://www.mkdocs.org/) : https://nbourre.github.io/0sw_notes_cours/

## Développement local

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Les notes se trouvent dans le dossier [docs/](docs/), une sous-page par sujet.

## Deux builds : en ligne vs hors ligne

Ce dépôt génère le site de deux façons différentes, selon où il doit être consulté.

### Build normal (`mkdocs.yml`) — hébergement web

```
mkdocs build --strict
```

Produit `site/`, pensé pour être hébergé (GitHub Pages, etc.) : URLs « dossier »
(`cours-04/` plutôt que `cours-04/index.html`), recherche chargée par `fetch()`.
C'est le build utilisé par le déploiement GitHub Pages — ne pas changer sa
structure d'URL, ça casserait les liens et signets existants.

### Build hors ligne (`mkdocs-offline.yml`) — examens sans internet

Nos étudiants passent des examens sur des postes **sans accès internet**. Le
site doit pouvoir être copié tel quel sur ces postes et ouvert directement en
double-cliquant sur `index.html` (protocole `file://`, sans serveur web).

```
mkdocs build -f mkdocs-offline.yml --strict
```

Produit `site-offline/` (ignoré par git, à copier manuellement sur les
postes). Ce build hérite entièrement de `mkdocs.yml` (`INHERIT:
mkdocs.yml`) et n'en diffère que par :

- **`material/offline`** (plugin officiel de mkdocs-material, inclus dans le
  paquet depuis une version récente — pas de dépendance additionnelle). Il
  force `use_directory_urls: false` (liens directs vers les `.html`, qui
  fonctionnent sans serveur) et inline l'index de recherche dans un script JS
  (`search/search_index.js`) plutôt que de le charger par `fetch()`, ce qui
  est bloqué par le navigateur en `file://` (CORS).
- Ce plugin doit être **après `search`** et **avant `print-site`**
  (`print-site` doit toujours être le dernier plugin de la liste — un
  changement qu'il exige indépendamment du mode hors ligne, voir plus bas).
- Un polyfill **iframe-worker** vendorisé localement
  (`docs/javascripts/vendor/iframe-worker-shim.js`), requis par le thème à
  cause de la fonctionnalité `content.code.annotate`. Déclaré dans
  `extra.polyfills` pour empêcher le plugin d'aller chercher sa version par
  défaut sur unpkg.com.

On ne fait **jamais** ça dans `mkdocs.yml` directement : changer
`use_directory_urls` casserait la structure d'URL du site publié.

## Pourquoi aucune ressource externe n'est chargée en mode hors ligne

Par défaut, ce site charge plusieurs ressources depuis des CDN externes — ce
qui ne fonctionne pas sans internet. Elles sont toutes vendorisées
(copiées localement dans le dépôt) :

| Ressource | Utilisée pour | Où elle est vendorisée |
| --- | --- | --- |
| MathJax 3.2.2 (`tex-mml-chtml.js` + fontes woff) | Rendu des formules mathématiques (`\(...\)`, `\[...\]`) | `docs/javascripts/mathjax-vendor/` |
| p5.js 1.11.13 | Tous les sketchs p5 embarqués dans le contenu (`docs/javascripts/p5-embed.js`) | `docs/javascripts/vendor/p5.min.js`, chargé depuis `overrides/main.html` |
| iframe-worker (shim) | Polyfill requis par `content.code.annotate`, uniquement en mode hors ligne | `docs/javascripts/vendor/iframe-worker-shim.js` |
| Google Fonts | Police par défaut du thème Material | Désactivée (`theme.font: false` dans `mkdocs.yml`) — le thème retombe sur les polices système, aucun fichier à vendoriser |

Ces fichiers ne sont **pas** mis à jour automatiquement — si on change de
version de MathJax ou p5.js dans le futur, il faut retélécharger et
retirer/remplacer les fichiers vendorisés à la main (voir les commentaires
dans `mkdocs.yml` et `overrides/main.html`).

**Point de vigilance :** les fichiers vendorisés (bundle du thème Material,
MathJax, p5.js) contiennent chacun des chemins de repli vers des CDN pour des
fonctionnalités optionnelles non utilisées par ce cours (diagrammes Mermaid,
mode accessibilité « explorer » de MathJax, localisation i18n de p5.js). Ces
chemins ne sont jamais empruntés tant qu'on n'active pas ces fonctionnalités.
Le seul à surveiller : si un futur contenu ajoute un bloc ` ```mermaid `,
Material ira chercher `mermaid.min.js` sur unpkg.com au chargement de cette
page — ça ne cassera que ce diagramme précis en mode hors ligne, pas le reste
de la page, mais autant le savoir avant d'en ajouter un.

Les simples liens hypertextes du contenu vers des ressources externes
(Wikipedia, doc Arduino, GitHub, vidéos YouTube, etc.) ne sont **pas**
touchés : ils ne fonctionneront jamais hors ligne, mais ça ne casse rien —
seul ce lien précis est inutilisable.

## Vérifications avant de distribuer une copie hors ligne

```
mkdocs build --strict                        # aucun lien brisé, config normale
mkdocs build -f mkdocs-offline.yml --strict   # aucun lien brisé, config hors ligne

# aucune ressource externe réellement chargée par une page générée
grep -rloE '(src|href)="[^"]*(jsdelivr|googleapis|gstatic|unpkg\.com)[^"]*"' site-offline/

# liens internes en .html direct, pas en dossier seul
grep -o 'href="[^"]*index.html"' site-offline/c05_godot_agregation/index.html

# index de recherche bien inliné en JS (pas seulement le .json, chargé par fetch)
ls site-offline/search/search_index.js
```

Copier ensuite tout le dossier `site-offline/` sur les postes des étudiants
et ouvrir `index.html` directement (double-clic, sans serveur).
