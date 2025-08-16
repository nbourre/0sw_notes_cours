# Les vecteurs <!-- omit in toc -->

[Liste de vidéos de support](https://www.youtube.com/watch?v=mWJkvxQXIa8&list=PLRqwX-V7Uu6ZwSmtE13iJBcoI-r4y7iEc)

# Table des matières <!-- omit in toc -->
- [Vecteur : définition](#vecteur--définition)
- [Vecteur : utilité](#vecteur--utilité)
- [Vecteur : exemple](#vecteur--exemple)
  - [Simplification de l'exemple avec les vecteurs](#simplification-de-lexemple-avec-les-vecteurs)
- [Vecteur : classe](#vecteur--classe)
- [Vecteur : déplacement](#vecteur--déplacement)
- [Exercice 1 : Balle qui rebondit avec vecteurs](#exercice-1--balle-qui-rebondit-avec-vecteurs)
- [Opérations d’intérêt](#opérations-dintérêt)
- [Termes à connaître](#termes-à-connaître)
- [Accélération](#accélération)
- [Autres opérations](#autres-opérations)
- [Trajectoire](#trajectoire)
- [Exercice](#exercice)
- [Concepts avancés (Bonus)](#concepts-avancés-bonus)
  - [Interpolation linéaire (lerp)](#interpolation-linéaire-lerp)
  - [Distance entre deux points](#distance-entre-deux-points)
  - [Rotation d'un vecteur](#rotation-dun-vecteur)
  - [Angle entre deux vecteurs](#angle-entre-deux-vecteurs)
  - [Applications pratiques](#applications-pratiques)
- [Références](#références)
  - [Ressources supplémentaires](#ressources-supplémentaires)



# Vecteur : définition
- Le terme **vecteur** peut signifier plusieurs choses dépendant du contexte.
  - En biologie : Décrit un organisme qui transmet une infection d’un hôte à un autre.
  - En programmation : Décrit une structure de tableau de données.
- En mathématique, un vecteur est un concept permettant de représenter une longueur (magnitude) et une direction.

![alt text](assets/Image1.png)

# Vecteur : utilité
- Dans le monde des jeux vidéo, réalité virtuelle ou autre simulation, les vecteurs sont utilisés partout.
- **C’est une connaissance fondamentale à la programmation de jeux et applis multimédia.**
- C’est un bloc de construction nécessaire pour toute application ayant des implications mathématiques.

---

# Vecteur : exemple

- Voici du code représentant une balle qui rebondit aux limites de l’écran
- [Lien pour l’exécuter](pde://github.com/nbourre/0sw_processing_exemples/raw/master/bin/s01_no_vectors.pdez)
  - Au moment d’écrire ces lignes, il y avait un bug dans Processing. Il faut cliquer une 2e fois sur le lien tout en ayant une fenêtre ouverte.

![alt text](assets/Image2.png)

- Ce que l’on remarque est l’utilisation de plusieurs variables X et Y similaires.
  - Position X et Y.
  - Vitesse X et Y.
- Une des complications est la gestion de toutes ces variables.
- Imaginez maintenant que vous devez gérer l’accélération, la position d’une cible, le vent et la friction.
  - Quelles seraient les variables probables?
  - Utilisation de deux variables dans chacun des cas.
  - Dans un monde 3D ce serait 3 variables…

---

## Simplification de l'exemple avec les vecteurs

<table style="border: none;">

<tr>
<td>

```java
float x;
float y;
float z;
```

</td>
<td>

Vecteur location; // ou position

</td>
</tr>

<tr>
<td>

```java
float xSpeed;
float ySpeed;
float zSpeed;
```

</td>
<td>

Vecteur speed; // ou velocity

</td>
</tr>

<tr>

<td  colspan="2">

On simplifie le code en utilisant les vecteurs.

</td>
</tr>

</table>


---

# Vecteur : classe
- Processing offre la classe `PVector` qui représente un vecteur.
- Dans cette classe, on y retrouve les propriétés X et Y en `float`.
- On y retrouve plusieurs méthodes pour effectuer des opérations avec les vecteurs.

**Création d'un vecteur** :
```java
// Création d'un vecteur à la position (10, 20)
PVector position = new PVector(10, 20);

// Création d'un vecteur de vitesse
PVector vitesse = new PVector(2, -1); // 2 pixels/frame vers la droite, 1 pixel/frame vers le haut

// Accès aux composantes
float x = position.x;  // Récupère la composante X
float y = position.y;  // Récupère la composante Y
```

**Propriétés principales** :
- `x` : Composante horizontale
- `y` : Composante verticale (attention : Y augmente vers le bas dans Processing)
- `z` : Composante en profondeur (pour la 3D)

---

# Vecteur : déplacement
- Pour simuler du mouvement à l’aide des vecteurs, il faut utiliser la translation.
  - Pour effectuer une translation, il suffit d’additionner la vitesse à la position.
- Le mouvement est un déplacement dans le temps.
- La vitesse représente un déplacement dans le temps.
- La vitesse peut être représentée par un vecteur.
- Le déplacement est une distance dans une unité donnée.
  - Exemple : L’unité pixel.

```java
// Variables globales
PVector location;
PVector vitesse;

void setup() {
  size(400, 300);
  location = new PVector(50, 50);    // Position initiale
  vitesse = new PVector(2, 1.5);     // 2 pixels/frame en X, 1.5 en Y
}

void draw() {
  background(255);
  
  // Déplacement : position = position + vitesse
  location.add(vitesse);
  
  // Dessiner la balle
  ellipse(location.x, location.y, 20, 20);
  
  // Rebond sur les bords
  if (location.x > width || location.x < 0) {
    vitesse.x *= -1;  // Inverse la direction X
  }
  if (location.y > height || location.y < 0) {
    vitesse.y *= -1;  // Inverse la direction Y
  }
}
```

**Équivalent sans vecteur** (plus verbeux) :
```java
float locX = 50, locY = 50;
float vitX = 2, vitY = 1.5;

// Dans draw()
locX += vitX;
locY += vitY;
// + gestion des rebonds pour chaque composante...
```

---

# Exercice 1 : Balle qui rebondit avec vecteurs
**Objectif** : Convertir une animation de balle qui rebondit pour utiliser des vecteurs.

**Instructions détaillées** :
1. Créez deux variables globales de type `PVector` :
   - `position` : pour la position de la balle
   - `vitesse` : pour la vitesse de déplacement

2. Dans `setup()` :
   - Initialisez `position` au centre de l'écran
   - Initialisez `vitesse` avec des valeurs comme (3, 2)

3. Dans `draw()` :
   - Effacez l'écran avec `background()`
   - Déplacez la balle : `position.add(vitesse)`
   - Dessinez la balle à la position actuelle
   - Gérez les rebonds en inversant les composantes de vitesse

**Code de base à compléter** :
```java
PVector position;
PVector vitesse;

void setup() {
  size(600, 400);
  // TODO: Initialiser position et vitesse
}

void draw() {
  background(240);
  
  // TODO: Déplacer la balle
  // TODO: Dessiner la balle
  // TODO: Gérer les rebonds
}
```

**Bonus** : Ajoutez des couleurs ou faites varier la taille de la balle.

---

# Opérations d’intérêt
- Soustraction
  - Idem que l’addition.
  - Méthode `sub(PVector)`.
  - Exemple : Pour trouver la distance entre deux vecteurs.
- Multiplication par un scalaire
  - On multiplie chacun des composants du vecteur par une valeur scalaire.
  - 𝐴 ∗ 𝑣 (𝑥, 𝑦) = 𝑣 (𝐴𝑥, 𝐴𝑦).
  - Méthode `mult(float)`.
- Division par un scalaire
  - Idem que la multiplication.

---

# Termes à connaître

- Magnitude
  - La magnitude est la longueur du vecteur en utilisant le théorème de Pythagore.
- Normalisation
  - Ramène le vecteur à une longueur de 1 unité.
  - On divise le vecteur par sa longueur.
  - Cela donne la direction du vecteur.
  - Exemple : Pour limiter la vitesse d’un objet. On normalise le vecteur de vitesse puis on le multiplie par la vitesse maximale.

# Accélération
- L’accélération est le taux de variation de la vitesse.
- En programmation, on additionne l’accélération à la vitesse.

```java
acceleration = new PVector(1, 1);
vitesse = new PVector(0, 0);
vitesse.add(acceleration);
location.add(vitesse);
```

---

# Autres opérations
- Dans un jeu, on limite souvent les vitesses.
- Pour limiter les vitesses, on ajoute une méthode qui limite la longueur d’un vecteur.
- L’algorithme est le suivant :
  - Si `vecteur.longueur > max`
    - `vecteur.normalise()` // On le met à une longueur de 1 unité.
    - `vecteur.mult(max)`
  - Fin si

---

# Trajectoire
- À chaque fois que l’on désire calculer une trajectoire, il faut calculer la magnitude et la direction.
- Prenons l’exemple où l’on désire que notre objet se déplace vers la souris.
- Calculons la direction.
  - Celle-ci est la distance entre le X et Y de l’objet et le X et Y de la souris.

```java
PVector souris = new PVector(mouseX, mouseY);
PVector dir = PVector.sub(souris, location);
```

![alt text](assets/Image3.png)

---

- Nous avons maintenant le vecteur qui pointe directement à l’emplacement de la souris.
- Si nous additionnons la direction à la position, l'objet apparaîtrait immédiatement à la souris et ce n'est pas l'effet désiré.
- Ce que l'on doit faire, c'est de décider à quelle vitesse l'objet doit se rendre à la souris.
- Pour ce faire, on normalisera le vecteur pour ensuite le multiplier par une valeur qui déterminera sa vitesse en unité.
- Pour finaliser, on applique ce vecteur à l'accélération.

---

# Exercice
- Modifiez l’exercice avec la balle pour avoir une forme qui accélère dans la direction de la flèche appuyée par l’utilisateur.
- Faites un projet où une image (cible, balle, etc.) poursuit la souris.
  - Essayez avec différentes vitesses.


# Concepts avancés (Bonus)

## Interpolation linéaire (lerp)
L'interpolation permet de créer des transitions fluides entre deux vecteurs.

```java
PVector debut = new PVector(100, 100);
PVector fin = new PVector(400, 300);
float progression = 0; // De 0 à 1

void draw() {
  background(240);
  
  // Progression automatique
  progression += 0.01;
  if (progression > 1) progression = 0;
  
  // Interpolation entre début et fin
  PVector position = PVector.lerp(debut, fin, progression);
  
  ellipse(position.x, position.y, 20, 20);
}
```

## Distance entre deux points
```java
PVector point1 = new PVector(100, 100);
PVector point2 = new PVector(mouseX, mouseY);

float distance = PVector.dist(point1, point2);
// Ou : float distance = PVector.sub(point2, point1).mag();
```

## Rotation d'un vecteur
```java
PVector v = new PVector(50, 0); // Vecteur horizontal
v.rotate(PI/4); // Rotation de 45 degrés (PI/4 radians)
```

## Angle entre deux vecteurs
```java
PVector v1 = new PVector(1, 0);
PVector v2 = new PVector(0, 1);
float angle = PVector.angleBetween(v1, v2); // Résultat : PI/2 (90°)
```

## Applications pratiques
- **Jeux de tir** : Calculer la trajectoire des projectiles
- **Animation** : Mouvements fluides et naturels
- **Intelligence artificielle** : Comportements de groupe (boids)
- **Physique** : Simulation de forces, collisions
- **Interface utilisateur** : Animations d'éléments GUI

---

# Références
- À lire pour le prochain cours
- https://natureofcode.com/book/introduction/
- https://natureofcode.com/book/chapter-1-vectors/

## Ressources supplémentaires
- [Documentation officielle PVector](https://processing.org/reference/PVector.html)
- [The Nature of Code - Vectors (vidéo)](https://www.youtube.com/watch?v=mWJkvxQXIa8)
- [Exemples interactifs de vecteurs](https://p5js.org/examples/math-vector-math.html)