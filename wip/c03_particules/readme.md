# Systèmes de Particules <!-- omit in toc -->

# Table des matières <!-- omit in toc -->
- [Introduction](#introduction)
- [Histoire et Concept](#histoire-et-concept)
  - [Exemple de Code en Processing](#exemple-de-code-en-processing)
- [Principe de fonctionnement](#principe-de-fonctionnement)
- [Particule unique](#particule-unique)


---

# Introduction

Les systèmes de particules sont une technique largement utilisée en informatique graphique pour simuler des phénomènes naturels tels que le feu, la fumée, les cascades, et bien plus encore.

# Histoire et Concept

Le concept de système de particules a été introduit par William T. Reeves en 1982, lors de son travail sur le film *Star Trek II: The Wrath of Khan*. Pour créer l'effet de la "Genesis Device", une technique a été développée où de nombreux petits éléments, ou particules, interagissent pour former un effet visuel complexe, comme une onde de feu qui se propage.

> "Un système de particules est une collection de nombreuses petites particules qui, ensemble, représentent un objet flou."  
> — William Reeves, *ACM Transactions on Graphics*, 1983

---

 Pourquoi avons-nous besoin des systèmes de particules ?

Les systèmes de particules permettent de modéliser des phénomènes complexes en utilisant un grand nombre de petits objets simples. Ils sont essentiels pour simuler des systèmes où de nombreux éléments interagissent, tels que des explosions, des nuages de fumée, ou même des foules de personnes.

- **Flexibilité** : Les systèmes de particules permettent de gérer des quantités variables d'éléments, parfois zéro, parfois des milliers.
- **Approche orientée objet** : Au lieu de gérer chaque particule individuellement, nous pouvons créer une classe qui gère l'ensemble du système, facilitant ainsi la gestion et l'extension du code.

---

## Exemple de Code en Processing

Voici un exemple simple de mise en place d'un système de particules en Processing :

```java
ParticleSystem ps;

void setup() {
  size(640, 360);
  ps = new ParticleSystem(new PVector(width/2, height - 16));
}

void draw() {
  background(255);
  ps.run();
}
```

Dans cet exemple, un système de particules est créé et géré dans la fonction draw(), où il est continuellement mis à jour et affiché. La classe ParticleSystem gère la création, la mise à jour et l'affichage de chaque particule individuelle.

---

# Principe de fonctionnement
Un système de particules se compose de trois éléments principaux :

1. **Les Particules** : Ce sont les unités de base qui composent le système. Elles sont souvent représentées par des formes simples (cercles, carrés).
2. **L'Émetteur** : C'est l'origine des particules, souvent un point ou une zone d'où les particules sont émises.
3. **Le Gestionnaire** : Il gère la création, l'actualisation, et la destruction des particules au fil du temps.

---

# Particule unique
Avant d'élaborer un système de particules, il est important de comprendre comment une particule individuelle fonctionne. Une particule peut avoir les propriétés suivantes :

- **Position** : La position de la particule dans l'espace.
- **Vitesse** : La vitesse à laquelle la particule se déplace.
- **Accélération** : La variation de la vitesse de la particule.
- **Durée de vie** : La durée pendant laquelle la particule est visible.
- **Apparence** : La couleur, la taille, la forme de la particule.
- **Mise à jour** : La façon dont la particule est mise à jour à chaque image.
- **Affichage** : La façon dont la particule est affichée à l'écran.

---
Voici la classe de base pour une particule en Processing sans la durée de vie ni l'apparence :

```java
class Particle {
  PVector position;
  PVector velocity;
  PVector acceleration;

  Particle() {
    position = new PVector(width/2, height/2);
    velocity = new PVector(random(-1, 1), random(-2, 0));
    acceleration = new PVector(0, 0.05);
  }

  Particle(PVector l) {
    position = l.get();
    velocity = new PVector(random(-1, 1), random(-2, 0));
    acceleration = new PVector(0, 0.05);
  }

  void update() {
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(position.x, position.y, 10, 10);
  }
}
```