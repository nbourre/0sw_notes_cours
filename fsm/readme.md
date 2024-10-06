# La machine à état fini <!-- omit in toc -->
Améliorons nos personnages!

# Plan de leçon <!-- omit in toc -->
- [Étude de cas](#étude-de-cas)
- [Machine à état fini](#machine-à-état-fini)
- [Projet Godot](#projet-godot)
  - [Modification au code](#modification-au-code)
  - [Solution intermédiaire](#solution-intermédiaire)
    - [Diagramme d'états](#diagramme-détats)
  - [Solution intermédiaire : Modification du code](#solution-intermédiaire--modification-du-code)
  - [Résumé de la solution temporaire](#résumé-de-la-solution-temporaire)
- [Design pattern : L'état](#design-pattern--létat)
  - [Implémentation dans Godot](#implémentation-dans-godot)
- [Références](#références)

# Étude de cas

Évaluons le code suivant :
```gdscript
# Classe Heroine
func handle_input(input: String) -> void:
    if input == "PRESS_B":
        y_velocity = JUMP_VELOCITY
        set_graphics(IMAGE_JUMP)
```
*Code 01* 

Question : Quel est le problème?

<details><summary>Réponse</summary>
- Rien ne ll'empêche de faire du air jumping
</details>

```gdscript
func handle_input(input: String) -> void:
    if input == "PRESS_B":
        if not is_jumping:
            is_jumping = true
            # Jump...

// Solution : air jumping résolu avec le booléen isJumping_.
// Maintenant, on veut que l’héroïne puisse se pencher lorsque l’on appuie en bas et se relever lorsque l’on relâche
```
*Code 02*

```gdscript
func handle_input(input: String) -> void:
    if input == "PRESS_B":
        if not is_jumping:
            # Jump...
    elif input == "PRESS_DOWN":
        if not is_jumping:
            set_graphics(IMAGE_DUCK)
    elif input == "RELEASE_DOWN":
        set_graphics(IMAGE_STAND)

```
*Code 03*

**Quelques secondes pour trouver le bogue :)**

- Le joueur pourra :
  - Appuyer sur la flèche du bas pour se pencher
  - Appuyer sur B pour sauter lorsqu’il est penché
  - Relâcher la flèche du bas lorsque dans les airs
  - On aura une image debout lorsqu’il sera dans les airs
- Corrigeons en ajoutant des nouveaux drapeaux...

```gdscript
func handle_input(input: String) -> void:
    if input == "PRESS_B":
        if not is_jumping and not is_ducking:
            # Jump...
    elif input == "PRESS_DOWN":
        if not is_jumping:
            is_ducking = true
            set_graphics(IMAGE_DUCK)
    elif input == "RELEASE_DOWN":
        if is_ducking:
            is_ducking = false
            set_graphics(IMAGE_STAND)

```
*Code 04*

Parfait! On a corrigé notre bogue.

Maintenant, ça serait amusant si l’héroïne pouvant faire un dive attack lorsque le joueur appuie sur la touche du bas dans les airs.

```gdscript
func handle_input(input: String) -> void:
    if input == "PRESS_B":
        if not is_jumping and not is_ducking:
            # Jump...
    elif input == "PRESS_DOWN":
        if not is_jumping:
            is_ducking = true
            set_graphics(IMAGE_DUCK)
        else:
            is_jumping = false
            set_graphics(IMAGE_DIVE)
    elif input == "RELEASE_DOWN":
        if is_ducking:
            # Stand...


```
*Code 05*

Chasse aux bogues encore…

- On prévoit le air jumping lorsqu’il saute, mais pas en plongeant.
- On ajoutera un autre drapeau…
- On se rend compte qu’il y a un problème avec notre approche.
- À chaque fois que l’on touche au code, on brise quelque chose...

---

- On rage et on met au poubelle ce que l’on vient d’écrire et on se met à gribouiller un diagramme de flux de donnée où on fait des carrés pour chaque chose que le personnage peut faire soit être debout, penché, en saut et en plonge.
- Lorsqu’il répond à une commande, on fait une flèche de l’état initial, vers l’état final en inscrivant l’action nécessaire.

![Esquisse d'une machine à état fini](assets/fsm_esquisse.jpg)

- Félicitations! Vous venez de réaliser un diagramme de **machine à état fini**!

---

# Machine à état fini
- [La machine à état fini](https://fr.wikipedia.org/wiki/Automate_fini) (FSM) fait partie de la famille de la [Théorie des automates](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_automates)
- Il s’agit de la structure la plus simple
- Ce qu’il faut savoir :
  - Il y a un nombre déterminé d’état dans lequel la machine peut être. Par exemple : debout, saut, penché et plonge.
  - La machine ne peut être qu’en un seul état à la fois.
  - Une séquence d’actions ou d’entrées est envoyée à la machine. Dans notre cas, ce seront les boutons d’une manette.
  - Chaque état a un jeu de transitions, chacune de celle-ci est associée à une entrée et pointe vers un état. Quand un événement est déclenché, s’il est reconnu par une transition pour l’état courant, la machine passera à l’état que la transition pointe vers.

---

- Ce qu’il faut retenir ce sont : **états**, **entrées** et **transitions**
- Il y a un design pattern (DP) nommé **État** qui permet de constuire une FSM

---

# Projet Godot
- Le jeu de plateforme du dernier cours représente bien le sujet précédent
- Nous allons travailler avec ce projet
- Activez la branche « platformer_done »
  - `git checkout platformer_done`
- Créez et activez une nouvelle branche « platformer_fsm »
  - `git checkout –b platformer_fsm`
  - L’option `-b` permet de créer une nouvelle branche et activer celle-ci
- Ouvrez le projet `c03a_platformer_completed`

---

## Modification au code
- Avant toute chose, nous allons améliorer le code de base
- À la première ligne de la méthode `_PhysicsProcess`, ajoutez le code pour connaître la direction appuyée

```gdscript 
var dir = Input.GetActionStrength("ui_right") - Input.GetActionStrength("ui_left");
```

Remplacez le code d'avant ci-bas avec celui après.

```gdscript
# AVANT
if Input.is_action_pressed("ui_left"):
    motion.x += ACCEL * dir
    facing_right = false
    anim_player.play("Run")
elif Input.is_action_pressed("ui_right"):
    motion.x += ACCEL * dir
    facing_right = true
    anim_player.play("Run")
else:
    motion = motion.linear_interpolate(Vector2.ZERO, 0.2)
    anim_player.play("Idle")
``` 
*Code 06*

```gdscript
# APRÈS
if dir != 0:
    motion.x += ACCEL * dir
    anim_player.play("Run")
if dir > 0:
    facing_right = true
elif dir < 0:
    facing_right = false
else:
    motion = motion.linear_interpolate(Vector2.ZERO, 0.2)
    anim_player.play("Idle")
```
*Code 07*

---

## Solution intermédiaire
Avant d’implanter le DP État, on fera une solution intermédiaire pour mieux comprendre la mécanique.

**Énumérations et switch** 
- Pour indiquer les états, on regardait si le personnage était au sol ou dans les airs ainsi que les touches appuyées.
- On aurait pu utiliser des booléens isJumping et isRunning, mais il ne faudrait pas qu’ils soient à vrai en simultané.
- Si on a besoin d’avoir plusieurs booléens et qu’un seul doit être vrai dans tous les cas, c’est un indice indiquant que l’on devrait utiliser des énumérations.

### Diagramme d'états
La première étape est de tracer le diagramme d’états. Tracer le diagramme facilite grandement la programmation.
- Alors sortez vos crayons! :)

L'ordre pour tracer le diagramme est relativement simple :
1. Identifier les états
2. Tracer les transitions et écrire les conditions de transition

![Diagramme d'état fini d'un personnage de jeu de plateforme](assets/platform_fsm.png)

3. Créer l'énumération qui contiendra les états.

---
## Solution intermédiaire : Modification du code

Dans la classe `Player`, ajoutez l’énumération ci-bas ainsi qu’un attribut pour sauvegarder l’état.

```gdscript
extends KinematicBody2D
class_name Player

enum State { STATE_JUMPING, STATE_IDLE, STATE_RUNNING, STATE_FALLING }

var current_state: State = STATE_IDLE

# ...
```
*Code 08*

Ajouter un switch-case pour la gestion des états.

Voici le code de `_PhysicsProcess` modifié

```gdscript
func _physics_process(delta: float) -> void:
    var dir = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")

    motion.x += ACCEL * dir
    motion.y += GRAVITY

    if facing_right:
        current_sprite.flip_h = false
    else:
        current_sprite.flip_h = true

    match current_state:
        State.STATE_FALLING:
            if is_on_floor():
                current_state = State.STATE_IDLE
                anim_player.play("Idle")
        State.STATE_IDLE:
            if dir != 0:
                current_state = State.STATE_RUNNING
                anim_player.play("Run")
            elif Input.is_action_just_pressed("ui_jump"):
                current_state = State.STATE_JUMPING
                motion.y = -JUMP_FORCE
                anim_player.play("Jump")
            elif not is_on_floor() and motion.y > 0:
                current_state = State.STATE_FALLING
                anim_player.play("Fall")
        State.STATE_JUMPING:
            if motion.y >= 0:
                current_state = State.STATE_FALLING
                anim_player.play("Fall")
            else:
                anim_player.play("Jump")
        State.STATE_RUNNING:
            if dir > 0:
                facing_right = true
            elif dir < 0:
                facing_right = false
            else:
                current_state = State.STATE_IDLE
                motion = motion.linear_interpolate(Vector2.ZERO, 0.2)
                anim_player.play("Idle")

            if not is_on_floor() and motion.y > 0:
                current_state = State.STATE_FALLING
                anim_player.play("Fall")
            elif Input.is_action_just_pressed("ui_jump"):
                current_state = State.STATE_JUMPING
                motion.y = -JUMP_FORCE
                anim_player.play("Jump")
        _:
            anim_player.play("Idle")

    motion.x = lerp(motion.x, MAX_SPEED * (1 if motion.x > 0 else -1), (ACCEL * 1.0) / MAX_SPEED)

    if motion.y > MAX_FALL_SPEED:
        motion.y = MAX_FALL_SPEED

    motion = move_and_slide(motion, UP)


```
*Code 09*

**Points saillants**
- Toutes la gestions est dans un `switch-case` (`match-case` en Godot)
- Chaque état est indépendant

Pour un lecteur, ce code a l’air compliqué. Pour améliorer la lisibilité, on crée des méthodes pour chaque état.

---

Ainsi, on crée des méthodes pour chaque état et ensuite on appelle ces méthodes dans les différents cas.

```gdscript
# Dans _PhysicsProcess
match current_state:
    State.STATE_FALLING:
        fall()
    State.STATE_IDLE:
        idle()
    State.STATE_JUMPING:
        jump()
    State.STATE_RUNNING:
        run()
    _:
        idle()

# ...

```
*Code 10*
- Cette solution ci-haut est beaucoup plus propre que celle d’avant.
- Une seule propriété pour gérer les états
- Un peu de structure conditionnelle pour chaque état, mais c’est utilisable pour bien des cas.
- C’est la méthode la plus simple pour implanter une FSM

<details><summary>Cliquer pour voir le code de chacune des méthodes.</summary>


```gdscript
func jump() -> void:
    if motion.y >= 0:
        current_state = State.STATE_FALLING
        anim_player.play("Fall")
    else:
        anim_player.play("Jump")

func fall() -> void:
    if is_on_floor():
        current_state = State.STATE_IDLE
        anim_player.play("Idle")

func idle() -> void:
    if dir != 0:
        current_state = State.STATE_RUNNING
        anim_player.play("Run")
    jump_check()
    fall_check()

func fall_check() -> void:
    if not is_on_floor() and motion.y > 0:
        current_state = State.STATE_FALLING
        anim_player.play("Fall")

func jump_check() -> void:
    if Input.is_action_just_pressed("ui_jump"):
        current_state = State.STATE_JUMPING
        motion.y = -JUMP_FORCE
        anim_player.play("Jump")

func run() -> void:
    if dir > 0:
        facing_right = true
    elif dir < 0:
        facing_right = false
    else:
        current_state = State.STATE_IDLE
        motion = motion.linear_interpolate(Vector2.ZERO, 0.2)
        anim_player.play("Idle")

    jump_check()
    fall_check()

```
*Code 11*
</details>

---

## Résumé de la solution temporaire
Pour les petits jeux, cette solution peut convenir. Toutefois, si le jeux prend de l'ampleur, ça peut être un peu compliqué.

En effet, la solution présentée peut ne pas convenir à nos besoins lorsque les états deviennent trop nombreux.

Exemple :
- Disons que l’on désire que le personnage puisse voler, mais il devra courir pendant un certain temps avant de pouvoir s’exécuter.
- Dans le code, il faudra faire un suivi du temps pendant l'état de la course.

```gdscript
var charge_time: float = 0.0

func run() -> void:
    charge_time += delta
    if dir > 0:
        facing_right = true
    elif dir < 0:
        facing_right = false
    else:
        current_state = State.STATE_IDLE
        motion = motion.linear_interpolate(Vector2.ZERO, 0.2)
        anim_player.play("Idle")

    fly_check()
    jump_check()
    fall_check()


# On devra remettre à zéro le temps avant de changer vers l’état de courir

```
*Code 12*

Avec cette solution, nous avons eu besoin de modifier deux méthodes.
- On doit ajouter une propriété pour garder le temps de recharge qui n’est utilisé que lorsque le personnage court
- Le DP État permet de remédier à cette situation

---

# Design pattern : L'état
- Anglais : State
- Patron de conception comportementale
- Objectif : Permettre à un objet de modifier son comportement après un changement d’état interne
- Exemple de problème : Une section de l’application possède un switch avec trop de cas dépendant de l’état de celle-ci.

![Diagramme de classe du design pattern de l'état](assets/State_Design_Pattern_UML_Class_Diagram.svg)

---

Principe :
- Définir une classe « contexte » qui présente une interface unique pour le monde
- Définir une classe abstraite « état »
- Représenter les différents états comme étant des classes héritantes de la classe abstraite
- Définir le comportement de l’état dans la classe qui hérite de la classe abstraite
- Garder un pointeur qui garde l’état courant dans la classe contexte
- Pour changer l’état, modifier le pointeur de l’état


---

- Le DP État n’indique pas où l’on doit intégrer le changement d’état
- On peut le faire dans la classe « contexte » ou dans chacun des états
  - L’avantage de faire l’intégration dans les états est la facilité de créer de nouveaux états
  - Le désavantage, c’est que chaque état doit connaître l’état qui suit la transition ainsi il y a un couplage par transition qui se forment


---

## Implémentation dans Godot
- Pour implémenter ce DP, il faudra tricher à quelques endroits pour optimiser les caractéristiques de Godot
- La première étape sera de créer une classe générique qui aura les méthodes de base pour l’ensemble des états
- Nous appellerons cette classe `BaseState`
  - Celle-ci héritera de la classe Node pour avoir les fonctionnalités de Godot

```gdscript
extends Node

class_name State

# Reference à la `StateMachine`
var _state_machine: StateMachine

func handle_inputs(input_event: InputEvent) -> void:
    pass

func update(delta: float) -> void:
    pass

func physics_update(delta: float) -> void:
    pass

func enter(message: Dictionary = {}) -> void:
    pass

func exit() -> void:
    pass


```
*Code 13*

> **Rappel**
> 
> Une méthode virtuel est une méthode qui peut être redéfinie dans une classe dérivée. Une méthode virtuelle est définie avec le mot-clé `virtual` et peut être redéfinie avec le mot-clé `override` dans une classe dérivée.

---

Une fois que nous avons notre classe de base, nous pouvons créer nos états. Nous allons créer un état pour chaque action que le personnage peut faire. Nous allons donc créer les états suivants :
- Idle
- Running
- Jumping
- Falling

```gdscript
extends State

func enter(message: Dictionary = {}) -> void:
    _state_machine._player._anim_player.play("Idle")

func handle_inputs(input_event: InputEvent) -> void:
    if input_event.is_action_pressed("ui_right"):
        _state_machine._player.dir = 1
        _state_machine.transition_to("Running")
    elif input_event.is_action_pressed("ui_left"):
        _state_machine._player.dir = -1
        _state_machine.transition_to("Running")

    if input_event.is_action_just_pressed("ui_jump"):
        _state_machine.transition_to("Jumping")

func physics_update(delta: float) -> void:
    if _state_machine._player._velocity.y > 0:
        _state_machine.transition_to("Falling")


```


---
# Références
- [Design Pattern Guru : State pattern](https://refactoring.guru/design-patterns/state)