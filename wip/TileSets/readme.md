# Utilisation des TileSets

---

## Introduction

Une **TileMap** est une grille de tuiles utilisée pour créer la disposition d’un jeu. Il y a plusieurs avantages à utiliser des nœuds `TileMapLayer` pour concevoir vos niveaux. Tout d'abord, ils vous permettent de dessiner une mise en page en "peignant" des tuiles sur une grille, ce qui est beaucoup plus rapide que de placer des nœuds `Sprite2D` individuellement un par un. Ensuite, ils permettent des niveaux plus grands car ils sont optimisés pour dessiner un grand nombre de tuiles. Enfin, ils vous permettent d'ajouter des fonctionnalités supplémentaires à vos tuiles avec des formes de collision, d'occlusion et de navigation.

Pour utiliser des nœuds **TileMapLayer**, vous devrez d'abord créer un **TileSet**. Un **TileSet** est une collection de tuiles qui peuvent être placées dans un nœud **TileMapLayer**. Après avoir créé un **TileSet**, vous pourrez les placer [en utilisant l'éditeur de TileMap](https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html#doc-using-tilemaps).

Pour suivre ce guide, vous aurez besoin d'une image contenant vos tuiles, où chaque tuile a la même taille (les grands objets peuvent être divisés en plusieurs tuiles). Cette image est appelée un *tilesheet*. Les tuiles ne doivent pas forcément être carrées : elles peuvent être rectangulaires, hexagonales ou isométriques (perspective pseudo-3D).

---

## Création d’un nouveau TileSet

### Utilisation d'un tilesheet

Cette démonstration utilise les tuiles suivantes tirées du pack ["Abstract Platformer" de Kenney](https://kenney.nl/assets/abstract-platformer). Nous utiliserons cette *tilesheet* particulière du set :

![Exemple de tilesheet avec des tuiles 64×64](assets/using_tilesets_kenney_abstract_platformer_tile_sheet.webp)



Créez un nouveau nœud **TileMapLayer**, puis sélectionnez-le et créez une nouvelle ressource **TileSet** dans l'inspecteur :

![Création d'une nouvelle ressource TileSet dans le nœud TileMapLayer](assets/using_tilesets_create_new_tileset.webp)

---

## Ajout de tuiles au TileSet

Une fois que vous avez créé un **TileSet**, vous devez y ajouter des tuiles. Vous pouvez le faire dans l'éditeur de **TileSet**.



1. Ouvrez l'éditeur **TileSet** qui est dans le volet inférieur de l'éditeur de scène.
2. Cliquez sur le bouton "Nouveau TileSet" en haut de l'éditeur.
3. Cliquez sur "Ajouter une texture" et sélectionnez votre image de tuiles (*tilesheet*).
4. Ajustez la taille des tuiles en fonction des dimensions de votre *tilesheet* (par exemple, 64x64).

![Ajout d'une texture de tuiles dans l'éditeur de TileSet](assets/using_tilesets_add_texture.webp)

---

## Définir des collisions pour les tuiles

Pour chaque tuile, vous pouvez définir des formes de collision afin que le personnage ou les objets du jeu réagissent correctement.

1. Dans l'éditeur de **TileSet**, sélectionnez une tuile.
2. Cliquez sur l'onglet "Collision".
3. Dessinez la forme de collision directement sur la tuile.

![Ajout de collisions aux tuiles](assets/using_tilesets_collision_shapes.webp)

---

## Utilisation des autotiles

Les **Autotiles** permettent à Godot de générer automatiquement des transitions fluides entre les tuiles. Cela facilite grandement la création de niveaux où les tuiles doivent s'adapter dynamiquement à leur environnement.

1. Sélectionnez une tuile dans l'éditeur de **TileSet**.
2. Cliquez sur "Autotile".
3. Définissez les règles pour créer des transitions automatiques entre les tuiles.

![Définition d'un Autotile dans le TileSet](assets/using_tilesets_autotile.webp)

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
