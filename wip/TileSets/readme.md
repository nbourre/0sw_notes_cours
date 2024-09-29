# Utilisation des TileSets <!-- omit in toc -->

![alt text](assets/hex_map.png)

# Table des matières <!-- omit in toc -->
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
  - [Placer les tuiles dans la TileMap](#placer-les-tuiles-dans-la-tilemap)
- [Conclusion](#conclusion)



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



Créez un nouveau nœud **TileMapLayer**, puis sélectionnez-le et créez une nouvelle ressource **TileSet** dans l'inspecteur :

![Création d'une nouvelle ressource TileSet dans le nœud TileMapLayer](assets/using_tilesets_create_new_tileset.webp)


> **Note** : Pour ceux qui ont utilisé les versions précédentes à la version 4.3, le noeud pour créer des maps de tuiles s'appele `TileMap` et non `TileMapLayer`.

---

## Ajout de tuiles au TileSet

Une fois que vous avez créé un **TileSet**, vous devez y ajouter des tuiles. Vous pouvez le faire dans l'éditeur de **TileSet**.

1. Ouvrez l'éditeur **TileSet** qui est dans le volet inférieur de l'éditeur de scène.
2. Cliquez sur le bouton "Nouveau TileSet" en haut de l'éditeur.
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

Pour pouvoir définir des formes de collision, de navigation et d'occlusion pour chaque tuile, vous devrez d'abord créer une **couche de physique**, de **navigation** ou d'**occlusion** pour la ressource `TileSet`. Pour ce faire, sélectionnez le nœud TileMapLayer, cliquez sur la valeur de la propriété `TileSet` dans l'inspecteur pour l'éditer, puis dépliez les `couches de physique (Physics Layers)` et choisissez `Ajouter un élément (Add Element)`. :

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
- Attribuez des formes de collision à toutes les tuiles rouges qui ont une surface de marche.

---

## Sauvegarder le TileSet


---

# Utilisation des TileMaps
Un TileMap est une grille de tuiles utilisée pour créer la disposition d’un jeu. Il y a plusieurs avantages à utiliser des nœuds `TileMapLayer` pour concevoir vos niveaux. Tout d'abord, ils vous permettent de dessiner une mise en page en "peignant" des tuiles sur une grille, ce qui est beaucoup plus rapide que de placer des nœuds `Sprite2D` individuellement un par un. Ensuite, ils permettent des niveaux plus grands car ils sont optimisés pour dessiner un grand nombre de tuiles. Enfin, ils vous permettent d'ajouter des fonctionnalités supplémentaires à vos tuiles avec des formes de collision, d'occlusion et de navigation.



---

# Créer un jeu de terrain (`Terrain Sets`)
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

---

## Placer les tuiles dans la TileMap

Une fois que vos tuiles et leurs propriétés sont configurées, vous pouvez les placer dans la **TileMap** :

1. Sélectionnez votre nœud **TileMapLayer** dans la scène.
2. Ouvrez l'éditeur de **TileMap** et choisissez votre **TileSet**.
3. Peignez vos tuiles directement dans la scène en utilisant l'outil pinceau.

![Peindre les tuiles dans la TileMap](assets/using_tilesets_paint_tiles.webp)

---

**TODO : Insert code**

---

# Conclusion

Utiliser les **TileSets** dans Godot vous permet de concevoir rapidement et efficacement des niveaux tout en optimisant les performances grâce aux outils comme les **Autotiles** et les formes de collision. Cela simplifie la gestion des grands environnements et la personnalisation des interactions dans vos jeux.
