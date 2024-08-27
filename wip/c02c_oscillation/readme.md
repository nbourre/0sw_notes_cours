# Les oscillations et les collisions circulaires <!-- omit in toc -->
De la trigonométrie!... Oh boboy!
---

# Table des matières <!-- omit in toc -->
- [Plan de leçon](#plan-de-leçon)
- [Trigo de base](#trigo-de-base)
- [Cercle trigonométrique : Ce qu’il faut retenir](#cercle-trigonométrique--ce-quil-faut-retenir)
- [Trigonométrie en programmation](#trigonométrie-en-programmation)
- [Trigonométrie en programmation (suite)](#trigonométrie-en-programmation-suite)
- [`pushMatrix()` et `popMatrix()`](#pushmatrix-et-popmatrix)
  - [Scénario](#scénario)
- [`pushMatrix()` et `popMatrix()` (suite)](#pushmatrix-et-popmatrix-suite)
- [Analogie `pushMatrix()` et `popMatrix()`](#analogie-pushmatrix-et-popmatrix)
- [Exemple d’imbrication](#exemple-dimbrication)


---

# Plan de leçon

- Rappel très rapide sur la trigonométrie de base
- Trigonométrie en programmation
- `pushMatrix()` et `popMatrix()`
- Mouvement angulaire
- Coordonnées polaires
- Les collisions circulaires

---

# Trigo de base

- Dans notre contexte, on se limitera aux fonctions de base, soit sinus, cosinus et tangente.
- Le Sinus est le côté opposé de l’angle sur l’hypoténuse.
- Le Cosinus est le côté adjacent de l’angle sur l’hypoténuse.
- La Tangente est le côté opposé de l’angle sur le côté adjacent.
- Mnémonique : SOHCAHTOA

![alt text](assets/triangle.png)

---

# Cercle trigonométrique : Ce qu’il faut retenir

- $\(1\) tour = \(2\pi\)$ radians
- Un demi-tour = \(\pi\) radians

![alt text](assets/cercle_trigo.png)

---

# Trigonométrie en programmation

- C’est bien beau la théorie, mais à quoi ça peut servir en programmation?
- Exemple : Pointer un vaisseau vers un vaisseau ennemi devient simple avec la trigonométrie.

---

# Trigonométrie en programmation (suite)

- Dans la très grande majorité des cas, les fonctions trigonométriques en programmation sont en radians et non en degrés.
- Formules de conversion :
  - radians = PI * (degrés / 180)
  - degrés = (radians * 180) / PI
- En Processing, il existe la fonction `float radians(float degrees)`.

TODO : Ajouter code

---

# `pushMatrix()` et `popMatrix()`

## Scénario

- Exemple : Faire un système solaire où les planètes tournent autour de l’étoile, et les lunes autour de leur planète.
- Certains astres dépendent de la position de l’astre parent, comme un bras robotisé avec plusieurs segments.
- Ces calculs peuvent devenir complexes, nécessitant des transformations de matrices pour simplifier.

---

# `pushMatrix()` et `popMatrix()` (suite)

- `pushMatrix()` permet de sauvegarder la matrice d’affichage actuelle.
- `popMatrix()` permet de remettre la dernière matrice d’affichage sauvegardée.

---

# Analogie `pushMatrix()` et `popMatrix()`

- Imaginez une matrice comme une feuille de papier quadrillée.
- `pushMatrix()` met la feuille de côté et vous en donne une nouvelle pour dessiner.
- `popMatrix()` remet la dernière feuille en place.

---

# Exemple d’imbrication

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
