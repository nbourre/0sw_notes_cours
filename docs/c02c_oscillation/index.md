# Les oscillations et les collisions circulaires <!-- omit in toc -->
De la trigonométrie!... Oh boboy!
---


## Plan de leçon

- Rappel très rapide sur la trigonométrie de base
- Trigonométrie en programmation
- `pushMatrix()` et `popMatrix()`
- Mouvement angulaire
- Coordonnées polaires
- Les collisions circulaires

---

## Trigo de base

- Dans notre contexte, on se limitera aux fonctions de base, soit sinus, cosinus et tangente.
- Le Sinus est le côté opposé de l’angle sur l’hypoténuse.
- Le Cosinus est le côté adjacent de l’angle sur l’hypoténuse.
- La Tangente est le côté opposé de l’angle sur le côté adjacent.
- Mnémonique : SOHCAHTOA

![alt text](assets/triangle.png)

---

## Cercle trigonométrique : Ce qu’il faut retenir

<table>
    <tr>
        <td>

- $2\pi\ rad = 360°$
- $\pi\ rad = 180°$
- $\frac{\pi}{2}\ rad = 90°$
- $\frac{\pi}{3}\ rad = 60°$
- $\frac{\pi}{4}\ rad = 45°$
- $\frac{\pi}{180}\ rad = 1°$
- Si l'on veut incrémenter de 1°, on peut se faire une constante `DEG_TO_RAD` égale à $\frac{\pi}{180}$.

    </td>
    <td>
    
    <img src="assets/cercle_trigo.png" />

    </td>
    </tr>
</table>


---

## Trigonométrie en programmation

- C’est bien beau la théorie, mais à quoi ça peut servir en programmation?
- Exemple : Pointer un vaisseau vers un vaisseau ennemi devient simple avec la trigonométrie.

![alt text](assets/vaisseau.png)

```java
float angle = atan2(enemy.y - player.y, enemy.x - player.x);
```

> **Note** : On utilise la fonction `atan2` pour obtenir l’angle en radians entre deux points. Elle est plus précise que `atan` et prend en compte les quadrants.

---

- Dans la très grande majorité des cas, les fonctions trigonométriques en programmation sont en **radians et non en degrés**.
- Formules de conversion :
    - radians = PI * (degrés / 180)
    - degrés = (radians * 180) / PI
- Dans Processing, il existe la fonction `float radians(float degrees)`.

```java
background(0);
pushMatrix();
  translate(width / 2, height / 2);
  rotate(angle);
  stroke(255);
  line (-100, -100, 100, 100);
popMatrix();
```

---

## `pushMatrix()` et `popMatrix()`

### Scénario

- On veut faire un système solaire où les planètes tournent autour de l’étoile, et les lunes autour de leur planète.
    - Certains astres dépendent de la position de l’astre parent par exemple la lune autour de la Terre
- Disons que l'on désire contrôler un bras robotisé avec plusieurs segments.
    - Chaque segment dépend de la position du segment précédent.
- Ces calculs peuvent devenir complexes, car on doit calculer la position d'un objet en fonction de la position d'un autre objet.
- Pour simplifier la tâche, on introduit le concept de **matrice de transformation**.

---

### Les fonctions `pushMatrix()` et `popMatrix()`
- La compréhension intrinsèque de ceux-ci nécessite de comprendre le concept de pile de matrices ce qui sort des compétences de ce cours.

Pour simplifier :
- `pushMatrix()` permet de sauvegarder la matrice d’affichage actuelle.
- `popMatrix()` permet de remettre la dernière matrice d’affichage sauvegardée.

---

### Analogie `pushMatrix()` et `popMatrix()`

- Imaginez une matrice comme une feuille de papier quadrillée.
- `pushMatrix()` met la feuille de côté dans sa position actuelle sur une pile.
- On peut ensuite dessiner sur la feuille actuelle et faire des transformations.
    - On peut par exemple faire des rotations, des translations, des mises à l’échelle comme si l'on déplaçait la feuille.


![alt text](assets/transform_mat.svg)

---

- `popMatrix()` remet la dernière feuille en place par rapport à la feuille actuelle.
- Cela permet de relativiser les calculs géométriques entre les objets graphiques.

En résumé, ces deux fonctions sont essentielles pour isoler les transformations géométriques entre les objets graphiques qui se retrouvent entre le `pushMatrix()` et le `popMatrix()`.

---

<table>
    <tr>
        <td>

- **Il s'utilise toujours en pair push-pop.**
- **On peut les imbriquer.**
- Par exemple, si l’on veut dessiner un objet où il y a d’autres composants-enfants qui sont positionnés relativement au parent
- Voici une [vidéo explicative](https://www.youtube.com/watch?v=o9sgjuh-CBM&ab_channel=TheCodingTrain) de Daniel Shiffman
- Question : Comment pourrait-on animer le robot ci-contre?

    </td>
<td>

![alt text](assets/robot.webp)
    </td>
    </tr>
</table>
    
---

## Exemple d’imbrication

<table>
    <tr>
        <td>
    
![alt text](assets/solar_system.png)
</td>
<td>
    
```java
pushMatrix();
  soleil.draw();
  pushMatrix();
    venus.draw();
  popMatrix();
  pushMatrix();
    terre.draw();
    pushMatrix();
      lune.draw();
    popMatrix();
  popMatrix();
  pushMatrix();
    mars.draw();
    pushMatrix();
      deimos.draw();
    popMatrix();
    pushMatrix();
      phobos.draw();
    popMatrix();
  popMatrix();
popMatrix();

```

</td>
</tr>
</table>

---

### Exemples visuels

<table>
    <tr>
        <td>
    
![alt text](assets/rectangle_moving.gif)
Projet : [s04_push_pop](https://github.com/nbourre/0sw_processing_exemples/raw/master/bin/s04_push_pop.pdez)

</td>
<td>

![alt text](assets/solar_system.gif)
Projet : [s04_syst_solaire](pde://github.com/nbourre/0sw_processing_exemples/raw/master/bin/s04_syst_solaire.pdez)
</td>
</tr>
</table>

---

![alt text](assets/math-hangover.gif)

---

---

## Mouvement angulaire


<table>
    <tr>
        <td>

- On se rappelle de :
    - $$vitesse = vitesse + acceleration$$
    - $$location = location + vitesse$$
- Pour la vitesse angulaire, c’est le même principe :
    - $$\theta_{vitesse} = \theta_{vitesse} + \theta_{acceleration}$$
    - $$\theta = \theta + \theta_{vitesse}$$

    ![alt text](assets/angular_motion_Image.webp)

</td>
    <td>

```java
void update(float deltaTime) {
  velocity.add(acceleration);
  location.add(velocity);
  
  acceleration.mult(0);
  
  angularVelocity += angularAcceleration;
  angle += angularVelocity;
  
  angularAcceleration = 0.0;    
}

void display() {
  pushMatrix();
    translate (location.x, location.y);
    rotate (angle);
    
    fill(fillColor);
    noStroke();
    
    rect (0, 0, w, h);
  popMatrix();
}
```
    </td>
    </tr>
</table>


---

## Trouver l’angle de direction

- La fonction arctangente (`atan2`) permet de trouver l’angle de la vélocité.
- **Pourquoi `atan2` et non `atan` ?**
    - `atan` retourne un angle basé uniquement sur le rapport entre les côtés opposé et adjacent, sans savoir dans quel quadrant se trouve le point.
    - `atan2`, en revanche, prend en compte à la fois l'opposé et l'adjacent, ainsi que leurs signes, ce qui permet de déterminer correctement le quadrant et d'obtenir un angle précis entre -π et π radians.

<table>
    <tr>
    <td>

<img src="assets/motion_detection.webp"/>

    </td>
    <td>

<img src="assets/velocity_triangle.png" width="400"/>

    </td>
    </tr>
</table>

---

## Coordonnées polaires

- Les coordonnées polaires sont une représentation angulaire des données cartésiennes.
- Elles facilitent les calculs de rotation en utilisant uniquement la valeur de $\theta$ (thêta) et $r$ (rayon).
- Une des utilisations les plus courantes est le mouvement circulaire, car on n'a qu'à incrémenter l'angle.
- Les formules de conversion de polaires à cartésiennes :
    - $x = r \cos(\theta)$
    - $y = r \sin(\theta)$

<table>
    <tr>
    <td>

![alt text](assets/coord_polaire.webp)

    </td>
    <td>

![alt text](assets/triangle_polar.png)

    </td>
    </tr>
</table>



---

## Exercice

Réalisez un petit vaisseau simple qui pivote à l’aide des flèches gauche et droite et qui accélère en appuyant sur espace.

![alt text](assets/vaisseau.webp)

---

## Les collisions circulaires

### Plan de leçon

- Détecter une collision circulaire
- Trouver le point de contact
- Répondre à une collision entre balles

---

### Collision entre cercles

- La collision entre cercles se base sur la distance entre les centres des cercles.
- Si la distance est plus petite que la somme des deux rayons, il y a collision.

![alt text](assets/collision_circulaire.gif)

- Code : Exemples/s03_collision_cercles

---

### Trouver le point de contact

- Pour trouver le point de contact, il suffit de faire un peu de trigo! 👩‍🎓👨‍🎓🧑‍🎓

![alt text](assets/collision_contact_point.jpg)

```java
// Trouver le point de collision sans trigo
float collisionPointX = ((this.position.x * autre.radius) + (autre.position.x * this.radius)) / (this.radius + autre.radius);
float collisionPointY = ((this.position.y * autre.radius) + (autre.position.y * this.radius)) / (this.radius + autre.radius);
```

---

---

### Réponse à la collision

- Simuler une réponse suite à l’impact entre deux cercles permet de rendre l’animation plus réaliste.
- Ce type de collision entre deux corps est appelé une "collision élastique".
- La théorie derrière les collisions élastiques se trouve sur [Wikipédia](https://code.tutsplus.com/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769t).

![alt text](assets/collision_elastique.gif)

- Voir Exemples/s04_collision_cercles_impact

---

### Étape : Vecteur unitaire du point de contact

- Trouver le vecteur unitaire entre le point de collision et le centre du cercle.

```java
// Vecteur unitaire entre le point de contact et le centre du cercle
PVector un = result.get();
un.sub(this.position);
un.normalize();

// 90° du vecteur unitaire
PVector ut = new PVector(-un.y, un.x);

```

---

### Étape : Projection de vecteur

- Pour simuler la direction que prendront les balles après la collision, on calcule les projections des vecteurs de vélocité résultants.
- Cela nécessite d’utiliser des produits croisés pour séparer les composantes normales et tangentielles de la vitesse.
- La classe `PVector` en Processing offre la méthode `dot()` pour effectuer ce calcul.

![alt text](assets/math_magic.png)

```java
// Produits croisés pour la vélocité du premier cercle
float v1n = PVector.dot(un, this.velocity);
float v1t = PVector.dot(ut, this.velocity);

// Produits croisés pour la vélocité du deuxième cercle
float v2n = PVector.dot(un, autre.velocity);
float v2t = PVector.dot(ut, autre.velocity);

// Formule
// (b1.vitesse.x * (b1.mass - b2.mass) + (2 * b2.mass * b2.vitesse.x))
// / (b1.mass + b2.mass)
// Calcul des nouvelles vélocités normales après la collision
v1n = (v1n * (this.mass - autre.mass) + 2 * autre.mass * v2n) / (this.mass + autre.mass);

// Mise à jour des vecteurs de vélocité
un.mult(v1n);
ut.mult(v1t);

// Addition des composantes normales et tangentielles pour obtenir la vélocité finale
un.add(ut);

// La vélocité résultante pour "this" est maintenant dans un vecteur temporaire
PVector tempVel = un.get();
```

### Exemple de résultat
![alt text](assets/collision_balles.webp)




---

## Références
- [Collision circulaire](https://code.tutsplus.com/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769t)

<!-- Tableau html à 2 colonnes pour copier coller

<table>
    <tr>
        <td>
    

        </td>
        <td>
        </td>
    </tr>
</table>

-->