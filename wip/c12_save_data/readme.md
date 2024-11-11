# Sauvegarder les données avec des ressources personnalisées dans Godot  <!-- omit in toc -->

# Table des matières <!-- omit in toc -->
<!-- Générer table des matières avec Markdown All-in-One -->
- [Introduction](#introduction)
- [Qu’est-ce qu’une ressource personnalisée ?](#quest-ce-quune-ressource-personnalisée-)
- [Préparation du projet](#préparation-du-projet)
- [Création d’une ressource de données pour le joueur](#création-dune-ressource-de-données-pour-le-joueur)
- [Configurer le fichier de sauvegarde](#configurer-le-fichier-de-sauvegarde)
- [Test de la sauvegarde et du chargement](#test-de-la-sauvegarde-et-du-chargement)
  - [Observations](#observations)
- [Ajouter un inventaire en tant que sous-ressource](#ajouter-un-inventaire-en-tant-que-sous-ressource)
  - [Observations](#observations-1)
- [Avantages des ressources personnalisées par rapport aux fichiers JSON](#avantages-des-ressources-personnalisées-par-rapport-aux-fichiers-json)
- [Combinaison avec les fichiers JSON](#combinaison-avec-les-fichiers-json)
- [Conclusion](#conclusion)
- [Annexe](#annexe)
- [Références](#références)


---

# Introduction
Dans Godot, une **ressource personnalisée** permet de structurer et de sauvegarder facilement des informations complexes, comme l'état du joueur ou l'inventaire d'objets, sans les complications associées à l'utilisation de fichiers JSON ou d'autres formats de stockage brut. Cette approche rend les sauvegardes plus simples à gérer et à charger.

Dans cette leçon, nous allons :
- Créer une ressource de sauvegarde pour un joueur
- Comprendre comment ajouter des sous-ressources (comme un inventaire)
- Voir les avantages de l'utilisation des ressources personnalisées par rapport aux fichiers JSON.

---

# Qu’est-ce qu’une ressource personnalisée ?
Une **ressource personnalisée** est un composant de Godot que vous pouvez créer pour stocker des données spécifiques. Par exemple, une texture est une ressource assignable à un Sprite. En utilisant des ressources personnalisées, vous pouvez créer des structures de données propres à votre jeu, avec toutes les propriétés et méthodes dont vous avez besoin, tout en profitant de l'intégration avec l'éditeur Godot.

Les ressources personnalisées se prêtent particulièrement bien aux fichiers de sauvegarde car :
- Elles permettent de sauvegarder des structures de données complexes.
- Elles facilitent le chargement sans conversion ni traitement supplémentaire.
- Elles permettent d'utiliser des sous-ressources, idéales pour un inventaire d'objets ou des statistiques complexes.

---

# Préparation du projet
Nous allons juste créer un projet avec des contrôles de base pour illustrer les concepts de sauvegarde et de chargement. Vous pouvez suivre ces étapes dans un nouveau projet ou ajouter ces fonctionnalités à un projet existant.

![alt text](assets/screenshot.png)

La structure de la scène est la suivante :
- `Node2D` (Main) : racine de la scène.
  - `HBoxContainer` : conteneur horizontal.
    - `VBoxContainer` : conteneur vertical.
      - `Button` (LoadButton) : bouton pour charger les données.
      - `Button` (SaveButton) : bouton pour sauvegarder les données.
      - `Button` (ChangeButton) : bouton pour modifier la santé du joueur.
      - `Button` (AddButton) : bouton pour ajouter un item à l’inventaire.
  - `Panel` : panneau pour afficher les informations.
    - `Label` : étiquette pour afficher la santé du joueur.

- Création d'un script `main.gd` pour gérer les interactions avec les boutons
- Ajout des signaux pour les boutons `pressed` pour appeler les fonctions correspondantes.

![alt text](assets/scene_panel.png)


---

# Création d’une ressource de données pour le joueur

Pour gérer les données du joueur, comme sa santé, nous allons créer une ressource `PlayerData` :

1. **Définir la ressource de joueur :**
   - Dans un nouveau dossier nommé `resources`, créez un script nommé `playerdata.gd`.
   - Ce script va hériter de la classe `Resource` pour être reconnu comme une ressource dans Godot.
   - Utilisez `class_name PlayerData` pour que la ressource soit facilement accessible dans l'éditeur.

   ```gd
   extends Resource
   class_name PlayerData

   @export var health: int = 100

   func change_health(value: int) -> void:
       health += value
   ```

2. **Explication :**
   - `health` est une propriété exportée qui stocke la santé du joueur.
   - La méthode `change_health` permet de modifier la santé du joueur en fonction d’une valeur passée en paramètre, ce qui simplifie les opérations de gain ou de perte de santé.

---

# Configurer le fichier de sauvegarde

Pour enregistrer les données du joueur sur le disque, nous devons configurer un fichier de sauvegarde dans `main.gd`.

1. **Définir les variables de chemin :**
   ```gd
   var save_file_path = "user://save/"
   var save_file_name = "player_save.tres"
   ```

   - La sauvegarde est placée dans le répertoire `user://`, accessible à toutes les plateformes.
   - Le fichier sera nommé `player_save.tres`.

2. **Initialiser les données du joueur :**
   - Instanciez `PlayerData` et assignez-la à une variable `player_data`.
   - Créez une fonction pour vérifier et, si besoin, créer le dossier de sauvegarde en utilisant `DirectoryAccess`.
  
   ```gd
   var player_data = PlayerData.new()

   func verify_save_directory(path: String):
       DirAccess.make_dir_absolute(path)
   ```

3. **Sauvegarder et charger les données :**
   - Utilisez `ResourceSaver` pour sauvegarder et `ResourceLoader` pour charger.

   ```gd
   func save_game() -> void:
       ResourceSaver.save(player_data, save_file_path + save_file_name)

   func load_game() -> void :
      # duplicate(true) permet de charger une copie profonde (deep copy) de la ressource, i.e. une copie des sous-ressources. Autrement, les sous-ressources ne seront pas chargées (shallow copy).
      playerData = ResourceLoader.load(save_file_path + save_file_name).duplicate(true)
   ```

4. **Mise à jour de la santé :**
   - Créez une fonction qui modifie la santé du joueur, puis sauvegardez l'état après chaque changement.
   
    ```gd
    func change_health() -> void:
        player_data.change_health(-5)
        update_label()
    ```

---

# Test de la sauvegarde et du chargement
Lors de la première exécution, cliquez sur le bouton `Save` pour enregistrer les données du joueur. Ensuite, cliquez sur le bouton `Change` pour modifier la santé du joueur. Enfin, cliquez sur le bouton `Load` pour charger les données sauvegardées.

## Observations
- Dans votre explorateur de fichiers, vous devriez voir un dossier `save` contenant le fichier `player_save.tres`.
- Ouvrez le fichier `player_save.tres` avec un éditeur de texte pour voir les données sauvegardées.
  - On y constate les différentes propriétés de `PlayerData`, comme la santé du joueur ainsi que les identifiants des ressources générées par Godot.

---

# Ajouter un inventaire en tant que sous-ressource

En ajoutant un inventaire comme sous-ressource dans `PlayerData`, chaque item sera sauvegardé automatiquement avec les données du joueur.


1. **Créer une ressource d’Item :**
   - Créez `item.gd` pour définir un objet `Item` avec une propriété `item_name`.

   ```gd
   extends Resource
   class_name Item

   @export var item_name: String = "undefined"

   func _init(item_name: String = "undefined"):
       self.item_name = item_name
   ```

2. **Ajouter une propriété d’inventaire à `PlayerData` :**
   - Dans `playerdata.gd`, ajoutez une propriété exportée `inventory` comme un tableau d'objets `Item`.

   ```gd
   @export var inventory := []

   func add_item_to_inventory(item_name : String) -> void:
      var item := Item.new(item_name)
      inventory.append(item)
   ```

3. **Ajouter des objets via le script principal :**
   - Dans `main.gd`, créez une méthode pour ajouter des éléments à l’inventaire, comme des pommes.

   ```gd
   func _on_add_button_pressed() -> void:
      playerData.add_item_to_inventory("Apple")
   ```

4. **Sauvegarde et restauration de l’inventaire :**
   - Lors de la sauvegarde, les sous-ressources contenues dans `inventory` seront automatiquement sauvegardées dans le fichier principal.

   En utilisant cette approche, chaque item est enregistré avec toutes ses propriétés, et lors du chargement, l’inventaire est recréé sans manipulation supplémentaire.

## Observations
- Après avoir ajouté des items à l’inventaire, sauvegardez et chargez les données pour voir comment les items sont stockés et restaurés.
- Ouvrez le fichier `player_save.tres` pour voir comment les items sont sauvegardés en tant que sous-ressources.

Voici le contenu de mon fichier `PlayerSave.tres` après avoir ajouté un item à l’inventaire :

```ini
[gd_resource type="Resource" script_class="PlayerData" load_steps=4 format=3]

[ext_resource type="Script" path="res://item.gd" id="1_0bwnc"]
[ext_resource type="Script" path="res://player_data.gd" id="2_th76t"]

[sub_resource type="Resource" id="Resource_21lwd"]
script = ExtResource("1_0bwnc")
item_name = "Apple"

[resource]
script = ExtResource("2_th76t")
health = 95
inventory = [SubResource("Resource_21lwd")]
```

---

# Avantages des ressources personnalisées par rapport aux fichiers JSON

Les ressources personnalisées sont parfaitement intégrées dans Godot et permettent de simplifier considérablement le travail de sauvegarde et de chargement. Contrairement aux fichiers JSON qui nécessitent souvent une conversion et une gestion des erreurs pour être chargés correctement, les ressources personnalisées :
   - Simplifient le processus de chargement grâce à une structure native dans Godot.
   - Permettent d'utiliser des sous-ressources, idéales pour des données imbriquées comme un inventaire.
   - Supportent des types complexes et permettent une interaction directe avec les scripts et méthodes de Godot.

---

# Combinaison avec les fichiers JSON

Les fichiers JSON restent utiles pour stocker des données de référence ou des bases de données. Par exemple, un fichier JSON peut contenir la liste de tous les items du jeu. Lors de l’ajout d’un nouvel item dans l’inventaire, seul l’ID de l'item est utilisé pour récupérer les détails dans le fichier JSON.

Exemple d'utilisation :
   - **JSON** : stocke les données de base des items.
   - **Ressources personnalisées** : gèrent les sauvegardes de chaque instance d’item et ses modifications.

Cette approche hybride permet de conserver des données par défaut tout en offrant la flexibilité d’ajuster chaque item individuellement dans le jeu.

---

# Conclusion

Les ressources personnalisées sont un outil puissant pour gérer les données sauvegardées dans Godot. Grâce à elles, vous pouvez facilement créer des fichiers de sauvegarde complexes et structurés. En les combinant avec des fichiers JSON pour la gestion des données par défaut, vous obtenez un système de sauvegarde et de gestion des données extrêmement flexible et efficace.

Ce guide vous a introduit aux ressources personnalisées et vous a montré comment les utiliser pour des sauvegardes efficaces. Ce système est particulièrement adapté aux jeux ayant besoin de gestion de données avancée, comme les RPG ou les jeux d'aventure, où chaque objet ou statistique peut évoluer indépendamment.

---

# Annexe

`item.gd` :

```gd
class_name Item
extends Resource

@export var item_name := "undefined"

func _init(itemName = "undefined") -> void:
	item_name = itemName
```

`playerdata.gd` :

```gd
class_name PlayerData
extends Resource

@export var health := 100
@export var inventory := []

func change_health(value : int) -> void :
	health += value
	
func add_item_to_inventory(item_name : String) -> void:
	var item := Item.new(item_name)
	inventory.append(item)
```

`main.gd` :

```gd
extends Node2D

@onready var label := $HBoxContainer/Panel/Label

var save_file_path = "user://save/"
var save_file_name = "PlayerSave.tres"

var playerData = PlayerData.new()

func _ready():
	verify_save_directory(save_file_path)
	update_label()

func verify_save_directory(path : String) :
	DirAccess.make_dir_absolute(path)
	
func update_label() -> void:
	label.text = "Player Health : " + str(playerData.health)

func _on_load_button_pressed() -> void:
	playerData = ResourceLoader.load(save_file_path + save_file_name).duplicate(true)
	update_label()

func _on_save_button_pressed() -> void:
	ResourceSaver.save(playerData, save_file_path + save_file_name)
	update_label()


func _on_change_health_pressed() -> void:
	playerData.change_health(-5)
	update_label()


func _on_add_button_pressed() -> void:
	playerData.add_item_to_inventory("Apple")
```

---

# Références
- [Documentation de Godot sur les ressources](https://docs.godotengine.org/en/stable/tutorials/scripting/resources.html)
- [Save Files in Godot! (Custom Resource Tutorial)](https://www.youtube.com/watch?v=VGxYtJ3rXdE)
- [SECURE saving with Encryption in Godot 4!](https://www.youtube.com/watch?v=mI4HfyBdV-k)
- [TSCN file format](https://docs.godotengine.org/en/latest/contributing/development/file_formats/tscn.html)

![alt text](assets/Artificial__Intelligence_Aided.jpeg)
