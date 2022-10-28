# La machine à état fini <!-- omit in toc -->
Améliorons nos personnages!

# Plan de leçon <!-- omit in toc -->
- [Étude de cas](#étude-de-cas)
- [Machine à état fini](#machine-à-état-fini)
- [Projet Godot](#projet-godot)
  - [Modification au code](#modification-au-code)

# Étude de cas

Évaluons le code suivant :
```cpp
void Heroine::handleInput(Input input){
    if (input == PRESS_B)    {
        yVelocity_ = JUMP_VELOCITY;
        setGraphics(IMAGE_JUMP);    
    }
}
```
*Code 01* 

Question : Quel est le problème?

<details><summary>Réponse</summary>
- Rien ne ll'empêche de faire du air jumping
</details>

```cpp
void Heroine::handleInput(Input input)
    if (input == PRESS_B){
        if (!isJumping_){
            isJumping_ = true;
            // Jump...
        }
    }
}

// Solution : air jumping résolu avec le booléen isJumping_.
// Maintenant, on veut que l’héroïne puisse se pencher lorsque l’on appuie en bas et se relever lorsque l’on relâche
```
*Code 02*

```cpp
void Heroine::handleInput(Input input){
    if (input == PRESS_B){
        // Jump if not jumping...
    }
    else if (input == PRESS_DOWN){
        if (!isJumping_){
                setGraphics(IMAGE_DUCK);
                }
        }
    else if (input == RELEASE_DOWN){
        setGraphics(IMAGE_STAND);
    }
}
```
*Code 03*

**Quelques secondes pour trouver le bogue :)**

- Le joueur pourra :
  - Appuyer sur la flèche du bas pour se pencher
  - Appuyer sur B pour sauter lorsqu’il est penché
  - Relâcher la flèche du bas lorsque dans les airs
  - On aura une image debout lorsqu’il sera dans les airs
- Corrigeons en ajoutant des nouveaux drapeaux...

```cpp
void Heroine::handleInput(Input input)
{
  if (input == PRESS_B)
  {
    if (!isJumping_ && !isDucking_)
    {
      // Jump...
    }
  }
  else if (input == PRESS_DOWN)
  {
    if (!isJumping_)
    {
      isDucking_ = true;
      setGraphics(IMAGE_DUCK);
    }
  }
  else if (input == RELEASE_DOWN)
  {
    if (isDucking_)
    {
      isDucking_ = false;
      setGraphics(IMAGE_STAND);
    }
  }
}
```
*Code 04*

Parfait! On a corrigé notre bogue.

Maintenant, ça serait amusant si l’héroïne pouvant faire un dive attack lorsque le joueur appuie sur la touche du bas dans les airs.

```cpp
void Heroine::handleInput(Input input)
{
  if (input == PRESS_B)
  {
    if (!isJumping_ && !isDucking_)
    {
      // Jump...
    }
  }
  else if (input == PRESS_DOWN)
  {
    if (!isJumping_)
    {
      isDucking_ = true;
      setGraphics(IMAGE_DUCK);
    }
    else
    {
      isJumping_ = false;
      setGraphics(IMAGE_DIVE);
    }
  }
  else if (input == RELEASE_DOWN)
  {
    if (isDucking_)
    {
      // Stand...
    }
  }
}

```
*Code 05*

Chasse aux bogues encore…

- On prévoit le air jumping lorsqu’il saute, mais pas en plongeant.
- On ajoutera un autre drapeau…
- On se rend compte qu’il y a un problème avec notre approche.
- À chaque fois que l’on touche au code, on brise quelque chose...

---

- On rage et on met au poubelle ce que l’on vient d’écrire et on se met à gribouiller un diagramme de flux de donnée où on fait des carré pour chaque chose que le personnage peut faire soit être debout, penché, en saut et en plonge.
- Lorsqu’il répond à une commande, on fait une flèche de l’état initial, vers l’état final en inscrivant l’action nécessaire.

![](assets/fsm_esquisse.jpg)

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

`var dir = Input.GetActionStrength("ui_right") - Input.GetActionStrength("ui_left");`

Remplacez le code qui vérifie la direction appuyée par le code de droite


|--|---|
|c|232|
