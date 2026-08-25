# Génération procédurale

## Introduction
La génération procédurale consiste à créer du contenu — un terrain, un niveau, une texture, une musique — à l'aide d'un algorithme plutôt qu'en le dessinant ou en l'écrivant à la main. L'idée n'est pas de générer n'importe quoi au hasard, mais de produire un résultat qui reste cohérent et « naturel » à l'œil, tout en étant différent à chaque exécution (ou identique, si on le souhaite, grâce à une graine).

Dans cet article, nous allons voir l'outil de base qui rend cela possible : le **bruit de Perlin**. Nous verrons ensuite comment l'appliquer à un cas concret — la génération de plateformes — à titre d'exemple. La méthode présentée ne couvre pas tous les cas d'usage, mais elle donne une base que vous pourrez adapter à d'autres contextes (terrains, donjons, obstacles, etc.).

## Le bruit de Perlin
Avant d'aborder l'exemple, voyons ce qu'est le bruit de Perlin, l'outil qui rend la génération procédurale cohérente plutôt que complètement chaotique.

Contrairement à `random()`, qui retourne une valeur totalement indépendante à chaque appel, le bruit de Perlin retourne des valeurs qui varient graduellement en fonction de la position qu'on lui donne. Deux positions rapprochées produiront des valeurs similaires, alors que deux positions éloignées produiront des valeurs très différentes. C'est cette continuité qui donne un aspect naturel aux terrains, textures ou trajectoires générés.

Comme pour `random()`, le bruit dépend d'une graine (voir la section sur les [nombres aléatoires](../c01_nombres_aleatoires/)) : avec la même graine, on obtient toujours le même bruit, donc les mêmes résultats. Une graine différente produira un tout autre paysage.

Vous pouvez vous référer à l'image ci-dessous pour mieux comprendre : plus les positions sont proches, plus les valeurs du bruit sont similaires.

![](assets/perlin_noise.png)

Voici un exemple de bruit de Perlin généré avec Processing. On avance progressivement sur l'axe des `y` (`yoff`) et on trace une ligne entre la valeur précédente et la nouvelle valeur du bruit.

```java
float yoff = 0.0;
float previous;
float t = 0;
float n = noise(yoff) * height;
float dir = 1;

void setup () {
  size (800, 600);
  background(204);
}

void draw() {
  previous = n; 
  yoff = yoff + .02;  
  n = noise(yoff) * height;  
  line (t - 1, previous, t, n);
  
  if (t > width)
    t = 0;
    
  t++;
}
```

Voici le résultat avec un pas de `0.02` :

![](assets/perlin_noise_exemple.gif)

Et voici le résultat avec un pas plus petit, de `0.005`. On remarque que la courbe est beaucoup plus lisse : plus le pas est petit, plus les positions successives sont rapprochées, donc plus les valeurs se ressemblent.

![](assets/perlin_noise_0_005.gif)

Pour plus d'informations, je vous invite à lire l'article de [Khan Academy](https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-noise/a/perlin-noise).

## Exemple : générer des plateformes
Voyons maintenant comment appliquer le bruit de Perlin à un cas concret. Ce n'est qu'un exemple parmi d'autres : le même principe pourrait tout aussi bien servir à générer un terrain, une grotte ou le tracé d'une rivière.

L'idée est relativement simple : on avance sur l'axe des `x` par petits pas et, à chaque pas, on lit la valeur du bruit à cette position pour déterminer de combien la prochaine plateforme doit monter ou descendre par rapport à la précédente.

Ensuite, pour chaque plateforme, on génère une valeur aléatoire qui détermine sa longueur. À la fin de chaque plateforme, on génère un autre nombre aléatoire qui détermine la distance (l'écart) avant la prochaine plateforme.

Voici une implémentation en Processing. Plutôt que d'utiliser un `TileMap`, chaque plateforme est représentée par un simple rectangle. On utilise la fonction `noise()` de Processing, basée sur un bruit de Perlin, pour déterminer la hauteur de chaque plateforme.

On y utilise également la classe abstraite `Actor` (fournie plus haut) dont hérite une classe `Rectangle`, qui se charge d'afficher chaque plateforme.

Puisqu'il n'y a pas de personnage dans cet exemple, les flèches du clavier servent uniquement à déplacer la caméra afin de pouvoir explorer les plateformes générées. La touche `R` permet de régénérer une nouvelle carte.

```java
/// Classe abstraite pour les éléments graphique
abstract class Actor {
  PVector location;
  PVector velocity;
  PVector acceleration;

  color fillColor = color(255);
  color strokeColor = color(255);
  float strokeWeight = 1;

  // Méthode qui permet de mettre à jour les informations
  // interne de la classe
  abstract void update(int time);

  // Méthode qui fait le rendu de la classe
  abstract void display();
}

/// Représente une plateforme sous forme de rectangle
class Rectangle extends Actor {
  float w, h;

  Rectangle(float x, float y, float w, float h) {
    location = new PVector(x, y);
    velocity = new PVector(0, 0);
    acceleration = new PVector(0, 0);

    this.w = w;
    this.h = h;

    fillColor = color(100, 200, 120);
    strokeColor = color(20, 60, 30);
    strokeWeight = 2;
  }

  // Les plateformes sont statiques, rien à mettre à jour
  void update(int time) {
  }

  void display() {
    fill(fillColor);
    stroke(strokeColor);
    strokeWeight(strokeWeight);
    rect(location.x, location.y, w, h);
  }
}

ArrayList<Rectangle> platforms = new ArrayList<Rectangle>();

float tileSize = 32;

// Position de la caméra (déplacée avec les flèches)
PVector camera;
float camSpeed = 6;
boolean moveLeft, moveRight, moveUp, moveDown;

void setup() {
  size(900, 600);
  camera = new PVector(0, 0);
  generateMap();
}

void draw() {
  background(30, 30, 40);
  updateCamera();

  pushMatrix();
  translate(-camera.x, -camera.y);

  for (Rectangle p : platforms) {
    p.update(millis());
    p.display();
  }

  popMatrix();

  drawUI();
}

void updateCamera() {
  if (moveLeft)  camera.x -= camSpeed;
  if (moveRight) camera.x += camSpeed;
  if (moveUp)    camera.y -= camSpeed;
  if (moveDown)  camera.y += camSpeed;
}

void drawUI() {
  fill(255);
  noStroke();
  text("Flèches : déplacer la caméra   |   R : régénérer la carte", 10, 20);
}

void keyPressed() {
  if (keyCode == LEFT)  moveLeft = true;
  if (keyCode == RIGHT) moveRight = true;
  if (keyCode == UP)    moveUp = true;
  if (keyCode == DOWN)  moveDown = true;

  if (key == 'r' || key == 'R') generateMap();
}

void keyReleased() {
  if (keyCode == LEFT)  moveLeft = false;
  if (keyCode == RIGHT) moveRight = false;
  if (keyCode == UP)    moveUp = false;
  if (keyCode == DOWN)  moveDown = false;
}

void generateMap() {
  platforms.clear();

  float xOffset = 0;
  float xIncrement = 0.35;

  // Contrôle l'agressivité de la variation en Y entre les plateformes.
  // Plus la valeur est grande, plus le relief est abrupt.
  float noiseAmplitude = 25;

  int yLevel = 10;

  int nbPlatforms = 15;
  int platformLength = 5;

  int xStart = 0;
  int xEnd = xStart + platformLength;
  int gapLength = 2;

  for (int i = 0; i < nbPlatforms; i++) {
    int length = xEnd - xStart + 1;

    Rectangle platform = new Rectangle(xStart * tileSize, yLevel * tileSize, length * tileSize, tileSize);
    platforms.add(platform);

    platformLength = (int) random(5, 10);
    gapLength = (int) random(2, 5);

    xStart = xEnd + gapLength;
    xEnd = xStart + platformLength;
    xOffset += xIncrement;

    // On centre le bruit autour de 0 (noise() retourne une valeur entre 0 et 1)
    // puis on l'amplifie avec noiseAmplitude pour obtenir la variation en Y
    float n = (noise(xOffset) - 0.5) * 2;
    yLevel = (int) (n * noiseAmplitude) + yLevel;
  }
}
```

Le résultat : on avance sur l'axe des `x` par petits pas (`xIncrement`) et on lit la valeur du bruit à cette position pour déterminer de combien la prochaine plateforme doit monter ou descendre par rapport à la précédente. La longueur des plateformes et la distance entre elles restent aléatoires.

## Résumé
Dans cet article, nous avons vu la base de la génération procédurale : un bruit cohérent, comme le bruit de Perlin, permet de générer du contenu qui a l'air naturel tout en restant contrôlable grâce à une graine. Nous avons illustré ce principe avec un exemple concret — la génération de plateformes — mais les mêmes idées s'appliquent à bien d'autres contextes : terrains, donjons, obstacles, ennemis, textures, etc.

Vous pouvez aussi améliorer cette méthode en générant les plateformes au fil de l'avancement de la caméra (ou du personnage), plutôt que toutes d'un coup. Dans tous les cas, ce sera à vous de jouer!
