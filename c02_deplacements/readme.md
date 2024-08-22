# Le déplacement avec les vecteurs <!-- omit in toc -->
Les projets du cours sont disponibles sur [GitHub](https://github.com/nbourre/0sw_processing_exemples)

# Table des matières <!-- omit in toc -->
- [Objectifs](#objectifs)
- [Le déplacement avec les vecteurs](#le-déplacement-avec-les-vecteurs)
  - [Note](#note)
- [La vitesse](#la-vitesse)
  - [Résumé](#résumé)
  - [Exercices](#exercices)
- [L'accélération](#laccélération)
  - [Résumé](#résumé-1)
  - [Exercices](#exercices-1)
- [Destination cible](#destination-cible)
- [Références](#références)

# Objectifs
- Comprendre l'utilisation d'un vecteur de vitesse
- Comprendre l'utilisation d'un vecteur d'accélération
- Comprendre l'utilisation des forces pour déplacer un objet

# Le déplacement avec les vecteurs
Maintenant que nous avons vu comment représenter un vecteur, nous allons voir comment nous pouvons utiliser les vecteurs pour déplacer un objet.

## Note

Je vais utiliser une classe abstraite nommé `GraphicObject` pour représenter un objet graphique. Cette classe contient les méthodes `display` et `update`. La méthode `display` permet d'afficher l'objet graphique et la méthode `update` permet de mettre à jour l'objet graphique.

```java
abstract class GraphicObject {
  PVector location;
  PVector velocity;
  PVector acceleration;
  
  color fillColor = color (200);
  color strokeColor = color (255);
  float strokeWeight = 1;
  
  abstract void update(int deltaTime);
  
  abstract void display();
  
}
```

Je vais aussi utiliser une classe `Mover` qui hérite de la classe `GraphicObject`. On modifiera la classe `Mover` pour ajouter des forces à l'objet plus tard dans ce cours.

```java
class Mover extends GraphicObject {
  int diameter = 20;

  Mover() {
    location = new PVector(width/2, height/2);
    velocity = new PVector(0, 0);
    acceleration = new PVector(0, 0);
  }

  Mover(float x, float y) {
    location = new PVector(x, y);
    velocity = new PVector(0, 0);
    acceleration = new PVector(0, 0);
  }

  void update(int deltaTime) {
    location.add(velocity); // Déplacement de l'objet
  }

  void display() {
    stroke(strokeColor);
    fill(fillColor);
    strokeWeight(strokeWeight);

    ellipse(location.x, location.y, diameter, diameter);
  }
```

# La vitesse
![alt text](assets/ludicrous_speed.webp)

La vitesse est un vecteur qui représente la vitesse d'un objet. La vitesse est la dérivée de la position par rapport au temps. La vitesse est donc la variation de la position par rapport au temps. La vitesse est un vecteur qui a une **direction** et une **magnitude**. La direction de la vitesse est la direction dans laquelle l'objet se déplace et la magnitude de la vitesse est la vitesse de l'objet.

Si je dis qu'un véhicule se déplace à 20 km/h, je vous donne la magnitude de la vitesse. Cependant, je ne connais pas la direction de la vitesse. Si j'ajoute l'information que le véhicule se déplace vers le nord, je vous donne la direction de la vitesse.

Pour déplacer un objet, on additionne la vitesse à la position de l'objet.

$$ \text{position} = \text{position} + \text{vitesse} $$

Dans la classe `Mover`, on ajoute la vitesse à la position de l'objet dans la méthode `update`.

```java
void update(int deltaTime) {
  location.add(velocity);
}
```

Voici un exemple de code qui déplace un objet en ligne droite.

```java
Mover mover;
int currentTime = 0;
int lastTime = 0;
int deltaTime = 0;

void setup() {
  size(800, 800);
  mover = new Mover();
  mover.velocity = new PVector(2, -1);
}

void draw() {
  update();
  display();
}

void update() {
  currentTime = millis();
  deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  mover.update(deltaTime);
}

void display() {
  mover.display();
}
```

Voici le résultat de ce code.

![alt text](assets/moving_example.gif)

## Résumé

- La vitesse est un vecteur qui a une direction et une magnitude.
- Pour déplacer un objet, on ajoute la vitesse à la position de l'objet.

## Exercices
- Reproduisez l'exemple de cette section en modifiant la vitesse de l'objet.

# L'accélération
![alt text](assets/acceleration.webp)

L'accélération est un vecteur qui représente la variation de la vitesse par rapport au temps. L'accélération est la dérivée de la vitesse par rapport au temps. L'accélération est un vecteur. La direction de l'accélération est la direction dans laquelle la vitesse de l'objet change et la magnitude de l'accélération est la variation de la vitesse de l'objet.

![alt text](assets/Acceleration_graph.svg)

Dans ce graphique, la courbe bleue représente la vitesse de l'objet. La ligne verte représente la variation de la vitesse au temps $t$ soit l'accélération.

> **Note** : Ceux qui ont des connaissances en mathématiques peuvent voir que l'accélération est la dérivée de la vitesse par rapport au temps.

---

Pour accélérer un objet, on ajoute l'accélération à la vitesse de l'objet.

$$ \text{vitesse} = \text{vitesse} + \text{accélération} $$

L'équation de base pour déplacer un objet est donc :

$$ \text{vitesse} = \text{vitesse} + \text{accélération} \newline
 \text{position} = \text{position} + \text{vitesse} $$

Le code de la méthode `update` de la classe `Mover` devient donc :

```java

  void checkEdge() {
    var tempLoc = location.copy().add(velocity);
    
    if (tempLoc.x +  diameter / 2 > width || tempLoc.x - diameter / 2 < 0) {
      velocity.x *= -1;
    }
    
    if (tempLoc.y +  diameter / 2 > height || tempLoc.y - diameter / 2 < 0) {
      velocity.y *= -1;
    }
  }

  void update(long deltaTime) {
    checkEdge();
    velocity.add(acceleration); // Accélération
    location.add(velocity); // Déplacement de l'objet    
    acceleration.mult(0);    
  }
```

Vous remarquerez que je multiplie l'accélération par 0 à la fin de la méthode `update`. Cela permet de réinitialiser l'accélération à chaque frame. Sinon, l'accélération s'accumulerait et l'objet accélérerait indéfiniment.

J'ai aussi ajouté une méthode `checkEdge` qui permet de vérifier si l'objet touche les bords de la fenêtre. Si l'objet touche un bord, la vitesse de l'objet est inversée.

---

Voici un exemple où on ajoute de l'accélération à un objet sur l'axe des Y.

```java
long currentTime;
long previousTime;
long deltaTime;

Mover m;

void setup () {
  size (800, 600);
  currentTime = millis();
  previousTime = millis();
  
  m = new Mover();
  m.velocity.x = 2;
  m.velocity.y = -1;
}

void draw () {
  timeManagement();
  update(deltaTime);
  display();
}

void accelerate() {
  m.acceleration.x = 0;
  m.acceleration.y = 0.5;
}

void update(long delta) {
  // Mettre les calculs ici
  accelerate();
  m.update(delta);
}

void display () {
  // Mettre le code d'affichage ici
  background(0);
  m.display();
}

void timeManagement (){
  currentTime = millis();
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;
}

```

---

Voici le résultat de ce code.

![alt text](assets/example_acceleration.gif)

---

Vous remarquerez que l'objet accélère vers le bas. C'est parce que j'ai ajouté de l'accélération sur l'axe des Y. Évidemment, on remarque aussi que cela donne un effet de gravité.

En effet, la gravité est une accélération qui attire les objets vers le bas. Dans le prochain chapitre, nous allons voir comment nous pouvons utiliser les forces pour déplacer un objet.

## Résumé
- L'accélération est un vecteur qui représente la variation de la vitesse par rapport au temps.
- Pour accélérer un objet, on ajoute l'accélération à la vitesse de l'objet.

## Exercices
- Reproduisez l'exemple de cette section en modifiant l'accélération de l'objet.
  - Inversez l'accélération sur l'axe des Y.

---


# Destination cible
![alt text](assets/cible.gif)

Parfois, on veut que notre objet se déplace vers une destination. Pour cela, on peut utiliser la méthode `PVector.sub` qui permet de soustraire un vecteur à un autre vecteur.

Voic un exemple où l'on a modifié la classe `Mover` pour ajouter des méthodes qui permettent de déplacer l'objet vers une destination.

```java
class Mover extends GraphicObject {
  
  int diameter = 20;
  PVector target;
  float topSpeed = 10;

  // -- Méthodes ajoutées --
  
  void setTarget (PVector _target) {
    target = _target;
  }
  
  void updateTarget (float x, float y) {
    if (target == null) {
      target = new PVector();
    }
    
    target.x = x;
    target.y = y;
  }
  
  void seekTarget() {
    
    var dir = PVector.sub(target, location);
    dir.normalize();
    dir.mult(0.2);
    
    acceleration = dir;
  }
  
  boolean isTargetReached() {
    if (target == null) {
      return true;
    }
    
    return PVector.dist(location, target) < 10;
  }

  // Méthode modifiée

  void update(long deltaTime) {
    checkEdge();
    
    if (target != null) {
      seekTarget();
    }
    
    velocity.add(acceleration); // Accélération
    velocity.limit(topSpeed);
    location.add(velocity); // Déplacement de l'objet
    
    acceleration.mult(0);    
    
    if (isTargetReached()) {
      target = null;
    }
  }

}
```

Voici un exemple où l'on déplace un mover vers la position de la souris.

```java
long currentTime;
long previousTime;
long deltaTime;

Mover m;

void setup () {
  size (640, 480);
  currentTime = millis();
  previousTime = millis();
  
  m = new Mover();
  m.velocity.x = 2;
  m.velocity.y = -1;
  m.setTarget(new PVector(mouseX, mouseY));
}

void draw () {
  timeManagement();
  update(deltaTime);
  display();
}

void update(long delta) {
  // Mettre les calculs ici
  m.updateTarget(mouseX, mouseY);
  m.update(delta);
}

void display () {
  // Mettre le code d'affichage ici
  background(0);
  m.display();
  
  fill (0, 200, 0);
  ellipse (mouseX, mouseY, 10, 10);
}

void timeManagement (){
  currentTime = millis();
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;
}
```


# Références
- [Nature of Code - Chapter 1](https://natureofcode.com/book/chapter-1-vectors/)

