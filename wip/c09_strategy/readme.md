<!-- 
Leçon sur le patron de conception Strategy appliqué à Godot.

Idées de contre-exemples :
- Utilisation d'une seule attaque et ensuite ajouter d'autres attaques à l'intérieur de la classe

Idées de propos :
- Utilisation de différentes attaques
- Utilisation de différentes IA
- Utilisation de bonus pour les armes
-->

# Le patron de conception de la stratégie (Strategy) <!-- omit in toc -->

# Table des matières <!-- omit in toc -->
- [Introduction](#introduction)
- [Exemple par l'absurde](#exemple-par-labsurde)
- [Solution](#solution)
- [Astuce générale](#astuce-générale)
- [Références](#références)

# Introduction
L'intention de ce patron de conception est de définir une famille d'algorithmes, encapsuler chacun d'eux dans leur classe et les rendre interchangeables. Le patron de conception de la stratégie permet à l'algorithme de varier indépendamment des clients qui l'utilisent.

# Exemple par l'absurde
Dans un jeu vidéo, un vaisseau peut tirer des projectiles qui ont différentes propriétés selon les bonus qu'il a ramassés. On peut imaginer une classe `Player` qui contient une méthode `shoot` qui gère les différents types de projectiles.

```gdscript
class_name Player

# ...

func shoot() -> void:
    if bonus == BONUS_ICE:
        # Tirer un projectile de glace
    if bonus == BONUS_FIRE:
        # Tirer un projectile de feu
    if bonus == BONUS_LIGHTNING:
        # Tirer un projectile de foudre    
```

Plus tard, on veut ajouter un nouveau bonus qui accélère les projectiles et un autre qui perce les ennemis.

```gdscript
class_name Player

# ...

func shoot() -> void:
    if bonus == BONUS_ICE:
        # Tirer un projectile de glace
    if bonus == BONUS_FIRE:
        # Tirer un projectile de feu
    if bonus == BONUS_LIGHTNING:
        # Tirer un projectile de foudre
    if bonus == BONUS_SPEED:
        # Tirer un projectile accéléré
    if bonus == BONUS_PIERCE:
        # Tirer un projectile qui perce les ennemis
```

On se rend compte que la gestion du code devient de plus en plus complexe. On doit ajouter des conditions pour chaque nouveau bonus. De plus, si on veut ajouter un nouveau type de projectile, on doit modifier la classe `Player` et on risque de casser le code existant.

# Solution
Le patron de conception de la stratégie (*Strategy*) permettra de résoudre ce problème. La première étape sera de regarder ce qui est générique au projectile. Un projectile aura un vitesse, un niveau de dommage, un nombre de perforation, etc. On peut créer une classe `Projectile` qui contient ces propriétés.

```gdscript
class_name Bullet
extends CharacterBody2D

# Hurtbox est une classe qui gère les collisions avec les ennemis
@export var hurtbox : Hurtbox

@export var speed := 150.0
@export var damage := 5.0
@export var max_pierce := 1

var current_pierce_count := 0


func _ready():
	if hurtbox:
		hurtbox.hit_enemy.connect(on_enemy_hit)


func _physics_process(delta: float) -> void:
	var direction = Vector2.RIGHT.rotated(rotation)
	
	velocity = direction*speed
	
	var collision := move_and_collide(velocity*delta)
	
	if collision:
		queue_free()


func on_enemy_hit():
	current_pierce_count += 1
	
	if current_pierce_count >= max_pierce:
		queue_free()
```





---

# Astuce générale
Lorsque l'on commence à avoir plusieurs conditions qui s'empilent dans notre code, il est peut-être temps de penser à utiliser un patron de conception qui permet de rendre notre code plus flexible et plus facile à maintenir.

---

# Références
- [Refactoring Guru - Strategy](https://refactoring.guru/design-patterns/strategy)