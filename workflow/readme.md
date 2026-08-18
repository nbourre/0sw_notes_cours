# Workflows

## Ajouter une animation p5.js dans une page MkDocs

Le site est déjà configuré pour supporter des esquisses p5.js (voir [mkdocs.yml](../mkdocs.yml) : librairie p5.js en CDN + [docs/javascripts/p5-embed.js](../docs/javascripts/p5-embed.js)). Ce dernier fichier force les `<script>` à se réexécuter lors d'une navigation instantanée (`navigation.instant`), sinon l'esquisse ne s'afficherait qu'au tout premier chargement du site.

### Étapes

1. **Choisir un id unique** pour le conteneur du sketch (unique sur *tout le site*, pas juste la page — la navigation instantanée peut laisser des traces d'anciennes pages en mémoire).
    - Convention suggérée : `sketch-<nom_du_dossier_de_la_page>` (ex. `sketch-c01-nombres-aleatoires`).

2. **Coller ce gabarit dans la page markdown**, à l'endroit voulu :

    ```html
    <div class="p5-embed">
      <div id="sketch-unique-id"></div>
      <script>
        (() => {
          const holder = document.getElementById("sketch-unique-id");
          if (holder._p5Instance) holder._p5Instance.remove();
          holder._p5Instance = new p5((p) => {
            p.setup = () => p.createCanvas(400, 400).parent(holder);
            p.draw = () => p.background(220);
          });
        })();
      </script>
    </div>
    ```

3. **Remplacer `sketch-unique-id`** (aux deux endroits) par l'id choisi à l'étape 1.

4. **Écrire le sketch en mode instance** (`p.setup`, `p.draw`, etc. sur le paramètre `p`) à l'intérieur de la fonction passée à `new p5(...)`. C'est le mode requis ici — le mode global (`function setup() {...}` sans `p.`) ne fonctionne pas bien quand plusieurs sketches ou pages coexistent.

5. Si le code du sketch est **long**, éviter de l'écrire en ligne dans le markdown :
    - Le mettre dans un fichier séparé, par ex. `docs/<dossier_de_la_page>/assets/sketch.js`, en gardant le mode instance et en exportant une fonction (ex. `window.sketchXyz = (p) => { ... }`).
    - Dans la page markdown, ne garder que le petit bloc d'instanciation (étape 2), en appelant `window.sketchXyz` au lieu d'une fonction fléchée inline :
      ```html
      <div class="p5-embed">
        <div id="sketch-unique-id"></div>
        <script src="assets/sketch.js"></script>
        <script>
          (() => {
            const holder = document.getElementById("sketch-unique-id");
            if (holder._p5Instance) holder._p5Instance.remove();
            holder._p5Instance = new p5(window.sketchXyz, holder);
          })();
        </script>
      </div>
      ```

6. **Tester en local** :
    ```
    mkdocs serve
    ```
    - Vérifier que le sketch s'affiche au chargement initial de la page.
    - Naviguer vers une autre page puis revenir (navigation instantanée) : le sketch doit se relancer proprement, sans erreur dans la console ni canvas dupliqué.

### Exemple concret : un cercle dans un canvas 640x480

Voici le gabarit de l'étape 2, rempli pour afficher simplement un cercle au centre d'un canvas de 640x480 pixels. C'est le résultat de l'application des étapes 1 à 4 ci-dessus.

```html
<div class="p5-embed">
  <div id="sketch-cercle-demo"></div>
  <script>
    (() => {
      const holder = document.getElementById("sketch-cercle-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5((p) => {
        p.setup = () => {
          p.createCanvas(640, 480).parent(holder);
        };
        p.draw = () => {
          p.background(220);
          p.circle(p.width / 2, p.height / 2, 100);
        };
      });
    })();
  </script>
</div>
```

Ce qui a changé par rapport au gabarit vide :

- `sketch-unique-id` → `sketch-cercle-demo` (aux deux endroits : le `id` du `<div>` et le `getElementById`).
- `p.createCanvas(400, 400)` → `p.createCanvas(640, 480)`.
- Une ligne `p.circle(p.width / 2, p.height / 2, 100);` ajoutée dans `p.draw` : dessine un cercle de 100px de diamètre, centré (`p.width / 2`, `p.height / 2` = 320, 240).

À coller tel quel dans une page markdown pour tester — pas besoin de fichier séparé pour un sketch aussi court (voir l'étape 5 pour les sketches plus longs).

### Pièges fréquents

- **Id dupliqué** entre deux pages ou deux sketches → un des deux ne s'affiche pas ou écrase l'autre. Toujours vérifier l'unicité du id sur le site complet.
- **Oublier `.parent(holder)`** dans `createCanvas()` → le canvas est injecté ailleurs dans la page (souvent tout en haut du `<body>`) plutôt que dans son conteneur.
- **Oublier `holder._p5Instance.remove()`** avant de recréer l'instance → boucles `draw()` multiples qui tournent en parallèle après quelques navigations, ralentissant la page.
- **Mode global au lieu du mode instance** → conflits si plusieurs sketches existent sur le site (toutes les fonctions `setup`/`draw` globales se marchent dessus).
