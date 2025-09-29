# Utilisation des TileSets <!-- omit in toc -->

![alt text](assets/hex_map.png)

# Table des matières <!-- omit in toc -->
- [Pré-requis](#pré-requis)
- [Introduction](#introduction)
- [Création d’un nouveau TileSet](#création-dun-nouveau-tileset)
  - [Utilisation d'un tilesheet](#utilisation-dun-tilesheet)
  - [Ajout de tuiles au TileSet](#ajout-de-tuiles-au-tileset)
- [Ajouter la collision, navigation et l'occlusion aux jeux de tuiles](#ajouter-la-collision-navigation-et-locclusion-aux-jeux-de-tuiles)
  - [Définir des collisions pour les tuiles](#définir-des-collisions-pour-les-tuiles)
  - [Exercices](#exercices)
  - [Sauvegarder le TileSet](#sauvegarder-le-tileset)
- [Utilisation des TileMaps](#utilisation-des-tilemaps)
  - [Créer un jeu de terrain (`Terrain Sets`)](#créer-un-jeu-de-terrain-terrain-sets)
    - [Méthode alternative pour créer un jeu de terrain](#méthode-alternative-pour-créer-un-jeu-de-terrain)
  - [Propriétés importantes `TileMapLayer`](#propriétés-importantes-tilemaplayer)
  - [Placer les tuiles dans la TileMap](#placer-les-tuiles-dans-la-tilemap)
  - [Peinture de tuiles automatiques](#peinture-de-tuiles-automatiques)
- [Conclusion](#conclusion)
- [Exercices](#exercices-1)
- [Références](#références)

---
<!-- TODO : Voir les animations, le scattering, supprimer des tiles, etc.
Src : https://youtu.be/G6TC6ukmSc4?si=LgjDakCLC3O_O4qk&t=188
prj : everthing -> jackie-codes

-->

# Pré-requis
- Utilisez le projet `c07_plateforme` comme base.

![alt text](assets/c07_plateforme_start.gif)

---

# Introduction

Une **TileMap** est une grille de tuiles utilisée pour créer la disposition d’un jeu. Il y a plusieurs avantages à utiliser des nœuds `TileMapLayer` pour concevoir vos niveaux. Tout d'abord, ils vous permettent de dessiner une mise en page en "peignant" des tuiles sur une grille, ce qui est beaucoup plus rapide que de placer des nœuds `Sprite2D` individuellement un par un. Ensuite, ils permettent des niveaux plus grands car ils sont optimisés pour dessiner un grand nombre de tuiles. Enfin, ils vous permettent d'ajouter des fonctionnalités supplémentaires à vos tuiles avec des formes de collision, d'occlusion et de navigation.

Pour utiliser des nœuds **TileMapLayer**, vous devrez d'abord créer un **TileSet**. Un **TileSet** est une collection de tuiles qui peuvent être placées dans un nœud **TileMapLayer**. Après avoir créé un **TileSet**, vous pourrez les placer [en utilisant l'éditeur de TileMap](https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html#doc-using-tilemaps).

Pour suivre ce guide, vous aurez besoin d'une image contenant vos tuiles, où chaque tuile a la même taille (les grands objets peuvent être divisés en plusieurs tuiles). Cette image est appelée un *tilesheet*. Les tuiles ne doivent pas forcément être carrées : elles peuvent être rectangulaires, hexagonales ou isométriques (perspective pseudo-3D).

![alt text](assets/isometric.png)

---

# Création d’un nouveau TileSet

## Utilisation d'un tilesheet

Cette démonstration utilise les tuiles suivantes tirées du pack ["Abstract Platformer" de Kenney](https://kenney.nl/assets/abstract-platformer). Nous utiliserons cette *tilesheet* particulière du set :

![Exemple de tilesheet avec des tuiles 64×64](assets/using_tilesets_kenney_abstract_platformer_tile_sheet.webp)



1. Créez un nouveau nœud **TileMapLayer**
2. Sélectionnez-le nouveau noeud `TileMapLayer`
3. Dans la propriété `Tile Set`, cliquez dessus pour créer une nouvelle ressource **TileSet** dans l'inspecteur :

![Création d'une nouvelle ressource TileSet dans le nœud TileMapLayer](assets/using_tilesets_create_new_tileset.webp)

---

## Ajout de tuiles au TileSet

Une fois que vous avez créé un **TileSet**, vous devez y ajouter des tuiles. Vous pouvez le faire dans l'éditeur de **TileSet**.

1. Ouvrez l'éditeur **TileSet** qui est dans le volet inférieur de l'éditeur de scène.
2. Ajustez la dimension des tuiles dans la propriété `Tile Size` de l'éditeur de **TileSet**. Dans notre exemple, les tuiles sont de 64×64 pixels.
3. Cliquez sur "Ajouter une texture" et sélectionnez votre image de tuiles (*tilesheet*).
4. Ajustez la taille des tuiles en fonction des dimensions de votre *tilesheet*. Dans le cas de notre exemple, les tuiles sont de 64×64 pixels.

![Ajout d'une texture de tuiles dans l'éditeur de TileSet](https://docs.godotengine.org/en/stable/_images/using_tilesets_specify_size_then_edit.webp)

---

> **Note** : Lorsque l'on désire utiliser la fonctionnalité de création de tuiles automatiques, il est important de bien définir la taille des tuiles **avant** de créer l'atlas. Cela permettra à Godot de découper correctement les tuiles de votre *tilesheet*.

5. Avec l'éditeur de TileSet ouvert, glissez et déposez la texture de tuiles dans la zone de l'éditeur pour créer un atlas de tuiles.
6. Cliquez sur "Oui" pour confirmer la création de l'atlas.

![alt text](assets/tileset_drag_sheet.gif)

7. Les tuiles seront automatiquement créées et affichées dans l'éditeur de **TileSet**.

Il est possible d'ajouter plusieurs feuilles de tuiles à un **TileSet** pour créer des jeux plus complexes. Pour ajouter une autre feuille de tuiles, répétez les étapes 3 à 6.

Les propriétés suivantes peuvent être ajustées dans l'atlas selon vos besoins :
- **ID** : L'identifiant (unique dans ce TileSet), utilisé pour le tri.
- **Nom** : Le nom lisible de l'atlas. Utilisez un nom descriptif ici à des fins organisationnelles (comme "terrain", "décoration", etc).
- **Marges** : Les marges sur les bords de l'image qui ne doivent pas être sélectionnées comme tuiles (en pixels). Augmenter cela peut être utile si vous téléchargez une image de feuille de tuiles qui a des marges sur les bords (par exemple pour l'attribution).
- **Séparation** : La séparation entre chaque tuile sur l'atlas en pixels. Augmenter cela peut être utile si l'image de la feuille de tuiles que vous utilisez contient des guides (comme des contours entre chaque tuile).
- **Taille de la région de texture** (*Texture Region Size*) : La taille de chaque tuile sur l'atlas en pixels. Dans la plupart des cas, cela devrait correspondre à la taille de la tuile définie dans la propriété `TileMapLayer` (bien que ce ne soit pas strictement nécessaire).
- **Utiliser le rembourrage de texture** : Si coché, ajoute un bord transparent de 1 pixel autour de chaque tuile pour éviter les saignements de texture lorsque le filtrage est activé. Il est recommandé de laisser cette option activée sauf si vous rencontrez des problèmes de rendu dus au rembourrage de texture.

# Ajouter la collision, navigation et l'occlusion aux jeux de tuiles

Nous avons maintenant créé un `TileSet` de base. Nous pourrions commencer à l'utiliser dans le nœud TileMapLayer maintenant, mais il manque actuellement toute forme de détection de collision. Cela signifie que le joueur et d'autres objets pourraient traverser directement le sol ou les murs.

Si vous utilisez la navigation 2D, vous devrez également définir des polygones de navigation pour les tuiles afin de générer un maillage de navigation que les agents peuvent utiliser pour la recherche de chemin.

Enfin, si vous utilisez des lumières et des ombres 2D ou des particules GPUParticles2D, vous voudrez peut-être également que votre TileSet puisse projeter des ombres et entrer en collision avec des particules. Cela nécessite de définir des polygones d'occlusion pour les tuiles "solides" sur le TileSet.

Pour pouvoir définir des formes de collision, de navigation et d'occlusion pour chaque tuile, vous devrez d'abord créer une **couche de physique**, de **navigation** ou d'**occlusion** pour la ressource `TileSet`.

Pour ce faire,
1. Sélectionnez le nœud `TileMapLayer` dans la scène.
2. Cliquez sur la valeur de la propriété `TileSet` dans l'inspecteur pour l'éditer, puis dépliez les `couches de physique (Physics Layers)` et choisissez `Ajouter un élément (Add Element)`.

![alt text](assets/add_physics_layer.gif)

> **Note :** On peut aussi ajouter des couches de navigation et d'occlusion de la même manière.

---

## Définir des collisions pour les tuiles

Une fois que la couche de physique est ajoutée, vous devriez être en mesure de définir des formes de collision pour chaque tuile.

Les formes de collision permettent de définir des zones de collision pour chaque tuile. Cela permet de déterminer si un objet peut entrer en collision avec une tuile et comment cette collision doit être gérée.

1. Dans l'éditeur de **TileSet**, sélectionnez une tuile avec l'outil de sélection.
2. Développez la section "Physique" dans l'éditeur de **TileSet**.
3. Dessinez la forme de collision directement sur la tuile.
   - La touche rapide `F` permet de tracer un rectangle qui prend toute la tuile.

![alt text](assets/TileSet_adding_collision.gif)

Pour modifier des points au polygone de collision, utilisez les outils qui sont au-dessus de la tuile affichée.

On peut aisément faire une forme triangulaire avec le rectangle de base en supprimant un des points.

![alt text](assets/TileSet_triangle_collision.gif)

On peut aussi utiliser le rectangle de base pour créer des formes plus complexes en ajoutant des points.

![alt text](assets/TileSet_complexe_shape.gif)

---

## Exercices
- Attribuez des formes de collision à toutes les tuiles rouges qui ont une surface pour marcher.

---

## Sauvegarder le TileSet
Dans bien des cas lorsque l'on crée un jeu, on réutilise les mêmes tuiles pour plusieurs niveaux. Il est donc important de sauvegarder le `TileSet` pour pouvoir le réutiliser dans d'autres scènes.

Pour sauvegarder un `TileSet`, il suffit de cliquer sur le bouton `Enregistrer` sur la propriété `TileSet`.

![alt text](assets/TileSet_save.png)

---

# Utilisation des TileMaps
Un TileMap est une grille de tuiles utilisée pour créer la disposition d’un jeu. Il y a plusieurs avantages à utiliser des nœuds `TileMapLayer` pour concevoir vos niveaux. Tout d'abord, ils vous permettent de dessiner une mise en page en "peignant" des tuiles sur une grille, ce qui est beaucoup plus rapide que de placer des nœuds `Sprite2D` individuellement un par un. Ensuite, ils permettent des niveaux plus grands car ils sont optimisés pour dessiner un grand nombre de tuiles. Enfin, ils vous permettent d'ajouter des fonctionnalités supplémentaires à vos tuiles avec des formes de collision, d'occlusion et de navigation.

---

## Créer un jeu de terrain (`Terrain Sets`)
Dans les versions précédentes de Godot, il y avait un mécanisme nommé `AutoTiling` qui permettait de créer des terrains de manière automatique. Depuis la version 4, ce mécanisme a été remplacé par les `Terrain Sets`.

Les terrains permettent de créer des connexions entre les tuiles de manière automatique. Cela permet de créer des terrains de manière plus rapide et plus efficace.

Il y a 3 modes de terrains :

- Match Corners and Sides : Ce mode permet de créer des connexions entre les tuiles en fonction des côtés et des coins.
- Match Corners : Ce mode permet de créer des connexions entre les tuiles en fonction des coins.
- Match Sides : Ce mode permet de créer des connexions entre les tuiles en fonction des côtés.

Pour créer un jeu de terrain, suivez les étapes suivantes :

1. Sélectionnez le `TileSet` que vous souhaitez modifier.
2. Ajoutez un élément (`Add Element`) dans la section `Terrain Sets`.
3. Après avoir créé un jeu de terrain, il faut ajouter un élément à celui-ci en cliquant sur `Add Element`.

![alt text](assets/Terrain_Sets_add_element.png)

4. Ensuite dans le mode `Sélection`, sélectionnez un tuile que vous souhaitez ajouter à votre jeu de terrain.
5. Dans la section `Terrains`, il y a deux propriétés à définir :
   - `Terrain Set` : Il s'agit de l'identifiant du jeu de terrain.
   - `Terrain` : Il s'agit de l'identificant de la tuile dans le jeu de terrain.

![alt text](assets/using_tilesets_configure_terrain_on_tile.webp)

6. Répétez les étapes 4 et 5 pour chaque tuile que vous souhaitez ajouter à votre jeu de terrain.
7. Une fois que vous avez ajouté toutes les tuiles à votre jeu de terrain, vous pouvez définir les connexions entre les tuiles en configurant les propriétés `Terrain Peering Bit`

![alt text](assets/using_tilesets_configure_terrain_peering_bits.webp)

Le fonctionnement va ainsi :
- Si tous les bits sont à 0, la tuile ne s'affichera que s'il y a 8 tuiles autour d'elle avec le même `terrain ID`.
- Si un tuile n'a que les bits de gauche et droite à 0, il faudra seulement que les tuiles de gauche ET de droite aient le même `terrain ID`.
- La valeur `-1` signifie une tuile vide.

![alt text](assets/Terrain_peering_bit_explained.png)

Dans l'exemple ci-haut, il y a trois tuiles configurées :
- La tuile de gauche doit avoir le même `terrain ID` que la tuile de droite.
- La tuile du centre doit avoir le même `terrain ID` que la tuile de gauche et de droite.
- La tuile de droite doit avoir le même `terrain ID` que la tuile de gauche.

Ainsi, on pourrait se retrouver une configuration comme suit :

![alt text](assets/Terrain_peering_bit_examples.png)

Une fois que vous avez configuré les connexions entre les tuiles, il sera possible de peindre les tuiles dans la `TileMap` en utilisant l'outil `Pinceau`. Nous verrons comment faire cela dans la section suivante.

---

### Méthode alternative pour créer un jeu de terrain
Il est possible d'accelérer la création d'un jeu de terrain en utilisant l'onglet `Paint` dans l'éditeur de `TileSet`.

1. Sélectionnez le jeu de terrain que vous souhaitez modifier.
2. Sélectionnez l'outil `Paint`.
3. Sous `Painting`, sélectionnez le jeu de terrain que vous souhaitez modifier.
4. Sélectionnez `Terrain`
5. Sélectionnez les tuiles à inclure dans le jeu de terrain.

![alt text](assets/TileSet_Terrain_Select_Tile.gif)

6. Tracez les bits de terrain sur les tuiles.

![alt text](assets/TileSet_Terrain_Select_Bits.gif)

Voici le résultat final de mon jeu de terrain :

![alt text](assets/TileSet_top_down_complete.png)

---

## Propriétés importantes `TileMapLayer`

Les propriétés suivantes sont importantes pour configurer votre `TileMapLayer` :
- `TileSet` : Le `TileSet` à utiliser pour la `TileMap`.
- **Rendering**
  - **Y Sort Origin** : L'origine de l'ordonnancement Y. Cela détermine comment les tuiles sont ordonnées en fonction de leur position Y. Cette propriété ne fonctionne que si la propriété `Y Sort Enabled` est à vrai sur les paramètres de `CanvasItem`.
  - **X Draw Order Reversed** : Si vrai, les tuiles sont dessinées de droite à gauche. Cela peut être utile pour les jeux de plateforme où les tuiles de fond sont dessinées avant les tuiles de premier plan. Cette propriété ne fonctionne que si la propriété `Y Sort Enabled` est à vrai sur les paramètres de `CanvasItem`.
- **Physics**
  - **Collision Enabled** : Si vrai, les collisions sont activées pour les tuiles de cette `TileMapLayer`.
- **Navigation**
  - **Navigation Enabled** : Si vrai, la navigation est activée pour les tuiles de cette `TileMapLayer`.

Si vous n'avez créé de couche de physique, de navigation ou d'occlusion pour votre `TileSet`, vous n'avez pas besoin de configurer ces propriétés.

---

## Placer les tuiles dans la TileMap

Une fois que vos tuiles et leurs propriétés sont configurées, vous pouvez les placer dans la **TileMap** :

1. Sélectionnez votre nœud **TileMapLayer** dans la scène.
2. Ouvrez l'éditeur de **TileMap** et choisissez votre **TileSet**.
3. Peignez vos tuiles directement dans la scène en utilisant l'outil pinceau.

![Peindre les tuiles dans la TileMap](assets/TileMap_placing_tiles.gif)

---

## Peinture de tuiles automatiques

> **Note :** Officiellemeent, la peinture de tuiles automatiques ne fonctionne qu'avec des tuiles carrées sans pentes. Il faudra ajouter une couche pour les terrains avec des pentes.

Si vous avez configuré un jeu de terrain, vous pouvez peindre des tuiles automatiquement en utilisant l'outil `Pinceau` :

1. Sélectionnez le volet `TileMap`
2. Sélectionnez l'onglet `Terrains`
3. Sélectionnez le terrain
4. Tracez les tuiles sur la `TileMap`
 
![alt text](assets/TileMap_painting.gif)

Exemple d'un jeu top-down

![alt text](assets/TileMap_painting_top_down.gif)

Dépendamment de la configuration de votre jeu de terrain, les tuiles se connecteront automatiquement.

> **Note** : La configuration des terrains demande un peu de pratique pour bien comprendre comment les tuiles se connectent. Il est recommandé de faire des tests pour bien comprendre le fonctionnement.

> **Note** : L'outil semble plus adapté pour les terrains avec vue de dessus.

Il y a un modèle de base pour les terrains avec le mode "Corners and Sides" qui est disponible dans la référence qui est disponible à la fin de ce document.

![alt text](assets/template_corners_and_sides.png)

Sur le site itch.io, il y a plusieurs *tilesheets* qui sont disponibles pour les terrains. Vous pouvez rechercher `Godot TileSet` pour trouver des *tilesheets* qui sont compatibles avec Godot.

---

# Conclusion

Les outils de `TileSet` et de `TileMap` sont des outils puissants pour créer des jeux 2D. Ils permettent de créer des niveaux de manière plus rapide et plus efficace. Ils permettent aussi de créer des niveaux plus grands et plus complexes.

Cependant, l'outil `Terrain` n'est pas prêt à la production. Il est recommandé de faire des tests pour bien comprendre comment les tuiles se connectent.

---

# Exercices
- Trouvez vous un *tilesheet* sur le site itch.io qui serait compatible avec votre projet de session.
- Créez un `TileSet` avec le *tilesheet* que vous avez trouvé.
- Créez un `TileMap` et peignez les tuiles dans la scène.


---

# Références
- [Guide to TileSet Terrains](https://github.com/dandeliondino/godot-4-tileset-terrains-docs)
- [TileSet Explorer](https://donitz.itch.io/tileset-explorer)