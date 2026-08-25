# Génération de terrain <!-- omit in toc -->

!!! danger "Page en construction"
    Cette page est en cours de rédaction. Les sections jusqu'à « Redistribuer les valeurs » sont complètes (texte + exemples visuels interactifs). Tout ce qui suit, à partir de **« Façonner une île »**, est encore à l'état de brouillon (texte de base sans exemple visuel).

!!! warning "Prérequis"
    Cette page suppose que vous avez déjà lu [A - Introduction au bruit de Perlin](../procedural_generation/). On y explique ce qu'est le bruit de Perlin, comment l'utiliser avec `noise()` et pourquoi il est cohérent contrairement à `random()`. Si ce n'est pas encore fait, c'est le bon moment.

## Introduction
Le bruit de Perlin est un bon point de départ, mais utilisé seul, il ne donne pas vraiment l'impression d'un terrain : on obtient une bosse lisse, sans montagnes, sans îles, sans variété. Cette page présente quelques techniques simples pour transformer un bruit brut en quelque chose qui ressemble à une vraie carte.

Le contenu qui suit est une adaptation pédagogique de l'excellent article [Making maps with noise functions](https://www.redblobgames.com/maps/terrain-from-noise/) de Red Blob Games, traduit et simplifié pour ce cours. Je vous encourage fortement à consulter l'article original : il contient des démonstrations interactives (vous pouvez modifier les paramètres et voir le résultat en temps réel) qui valent largement le détour.

## Le bruit en 2D : l'effet « nuage »
Dans la section [Introduction au bruit de Perlin](../procedural_generation/), on a vu `noise()` avec un seul argument : une courbe qui varie dans le temps. Mais `noise()` accepte aussi deux arguments. En lui donnant les coordonnées `x` et `y` d'un pixel plutôt qu'une seule valeur de temps, on obtient une valeur différente pour chaque point d'une image — et en transformant cette valeur en niveau de gris, on obtient le fameux effet « nuage » qu'on retrouve dans énormément de textures et de générateurs de terrain.

```java
float increment = 0.05;

void setup() {
  size(400, 300);
}

void draw() {
  loadPixels();

  float yoff = 0;
  for (int y = 0; y < height; y++) {
    float xoff = 0;
    for (int x = 0; x < width; x++) {
      float bright = map(noise(xoff, yoff), 0, 1, 0, 255);
      pixels[x + y * width] = color(bright);
      xoff += increment;
    }
    yoff += increment;
  }

  updatePixels();
}
```

C'est exactement la même idée que la courbe 1D : chaque pixel lit le bruit à une position légèrement différente de celle de son voisin, ce qui donne des zones qui se ressemblent (contrairement à la « neige » complètement aléatoire qu'on obtiendrait avec `random()`), tout en variant doucement dans toutes les directions.

<div class="p5-embed">
  <div id="sketch-noise2d-demo"></div>
  <script src="assets/noise2d_demo.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-noise2d-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchNoise2D, holder);
    })();
  </script>
</div>

C'est cette texture, une fois qu'on lui donne un sens, qui devient un terrain — exactement ce qu'on fait dans la prochaine section.

## L'élévation : donner un sens au bruit
La première étape consiste à décider ce que représente une valeur de bruit. Puisque `noise()` retourne une valeur entre 0 et 1, on peut simplement dire : « 0 = le point le plus bas, 1 = le point le plus haut ». On appelle ça l'**élévation**.

```java
float nx = x / (float) width - 0.5;
float ny = y / (float) height - 0.5;

float elevation = noise(nx, ny);
```

Notez que `nx` et `ny` sont recentrés entre -0,5 et 0,5 plutôt que d'utiliser directement les coordonnées de pixel. C'est une habitude à prendre : cela permet de changer la taille de la carte sans changer l'apparence du bruit, et ça facilite les calculs de distance qu'on utilisera plus loin (pour les îles, entre autres).

À partir de cette élévation, on peut décider d'un seuil pour l'eau, par exemple :

```java
color terrainColor(float e) {
  if (e < 0.3) return color(50, 100, 200);   // Eau
  if (e < 0.35) return color(220, 210, 130); // Plage
  if (e < 0.7) return color(90, 160, 80);    // Terre
  return color(255, 255, 255);               // Montagne / neige
}
```

Le bac à sable ci-dessous montre les deux côte à côte : à gauche, le bruit tel quel (0 = noir, 1 = blanc); à droite, la même valeur interprétée avec les seuils ci-dessus. C'est exactement la même donnée — seule l'interprétation change.

<div class="p5-embed">
  <div id="sketch-elevation-demo"></div>
  <script src="assets/elevation_demo.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-elevation-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchElevationDemo, holder);
    })();
  </script>
</div>

## La fréquence : contrôler la taille des détails
Dans les bacs à sable précédents, le curseur **Échelle** contrôlait à quel point le bruit variait rapidement d'un bord à l'autre de la carte. Ce paramètre a un nom précis : c'est la **fréquence** du bruit.

```java
float frequency = 4;
float e = noise(frequency * nx, frequency * ny);
```

- **Fréquence** : le nombre d'oscillations par unité de distance. Doubler la fréquence divise la taille des détails par deux (le terrain a l'air deux fois plus « zoomé »).
- **Longueur d'onde** (*wavelength*) : l'inverse de la fréquence — la distance nécessaire pour compléter une oscillation, en pixels ou en tuiles. Doubler la longueur d'onde double la taille des détails.

Les deux notions décrivent la même chose, juste dans un sens différent. La relation entre les deux :

```
longueur d'onde = taille de la carte / fréquence
```

On peut donc écrire l'échantillonnage de deux façons équivalentes :

```java
// Avec une fréquence
float e = noise(frequency * nx, frequency * ny);

// Avec une longueur d'onde (en pixels), directement sur les coordonnées de pixel
float wavelength = 100;
float e = noise(x / wavelength, y / wavelength);
```

Le bac à sable ci-dessous affiche le **même bruit** (même graine) échantillonné à trois fréquences qui doublent à chaque panneau. Remarquez que les détails du deuxième panneau sont deux fois plus petits que ceux du premier, et ceux du troisième, deux fois plus petits que ceux du deuxième :

<div class="p5-embed">
  <div id="sketch-frequency-demo"></div>
  <script src="assets/frequency_demo.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-frequency-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchFrequencyDemo, holder);
    })();
  </script>
</div>

L'encadré rouge sur les panneaux 2 et 3 montre bien pourquoi : comme les trois panneaux partagent la même graine, le carré central d'un panneau (la moitié de sa largeur et de sa hauteur) contient **exactement** le même motif que le panneau précédent au complet. Doubler la fréquence, c'est donc littéralement zoomer 2× sur le bruit.

Une seule fréquence donne un terrain plat et prévisible — soit tout en grosses formes, soit tout en petits détails. La prochaine section montre comment combiner plusieurs fréquences ensemble pour obtenir un terrain qui a à la fois de grandes formes et des petits détails, comme un vrai paysage.

## Combiner plusieurs octaves de bruit
Un seul appel à `noise()` donne des collines toutes de la même taille. Pour obtenir un terrain plus riche, on additionne **plusieurs couches de bruit à différentes fréquences** : une couche pour les grandes formes du terrain (continents), une pour les collines, une pour les petits détails. Chaque couche est appelée une **octave**.

L'idée : à chaque octave, on double la fréquence (donc on obtient des détails deux fois plus petits) et on réduit l'amplitude de moitié (donc cette couche compte pour moitié moins dans le résultat final).

```java
float e = 1.0 * noise(1 * nx, 1 * ny)
        + 0.5 * noise(2 * nx, 2 * ny)
        + 0.25 * noise(4 * nx, 4 * ny);

// On divise par la somme des amplitudes pour ramener le résultat entre 0 et 1
e = e / (1.0 + 0.5 + 0.25);
```

Le rapport entre deux amplitudes consécutives (ici 0,5) s'appelle le **gain** (ou *persistence*). Plus le gain est élevé, plus les petits détails prennent de l'importance dans le résultat final.

Le bac à sable ci-dessous montre exactement la somme illustrée plus haut : chaque octave affichée telle quelle, puis le résultat combiné à droite. Le curseur **Gain** contrôle le poids des octaves à haute fréquence — à gain faible, le résultat reste dominé par les grandes formes de l'octave 1; à gain élevé, les petits détails des octaves 2 et 3 prennent le dessus et le résultat devient bruité.

<div class="p5-embed">
  <div id="sketch-octaves-demo"></div>
  <script src="assets/octaves_demo.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-octaves-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchOctavesDemo, holder);
    })();
  </script>
</div>

## Redistribuer les valeurs
Une carte purement issue du bruit a tendance à avoir beaucoup trop de terrain à mi-hauteur (des collines partout, ni assez d'océan, ni assez de montagnes). On peut corriger ça en appliquant une fonction mathématique sur l'élévation avant de l'utiliser — on appelle ça la **redistribution**.

La technique la plus simple consiste à élever l'élévation à une puissance :

```java
float exponent = 2.2;
e = pow(e, exponent);
```

Comme `e` est toujours entre 0 et 1, l'élever à une puissance plus grande que 1 pousse les valeurs moyennes vers le bas (plus de basses terres, des vallées plus plates) tout en gardant les sommets élevés (des montagnes plus prononcées). Essayez différentes valeurs d'exposant pour voir l'effet.

Le graphique de gauche montre la fonction elle-même : en abscisse, l'élévation *avant* redistribution; en ordonnée, l'élévation *après*. La diagonale grise représente l'exposant 1 (aucun changement); la courbe rouge s'en éloigne de plus en plus à mesure que l'exposant augmente. La carte de droite applique cette même courbe à une carte de terrain généré avec 3 octaves de bruit (comme dans la section précédente), pour que vous puissiez voir l'effet concret sur le relief :

<div class="p5-embed">
  <div id="sketch-redistribution-demo"></div>
  <script src="assets/redistribution_demo.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-redistribution-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchRedistributionDemo, holder);
    })();
  </script>
</div>

Remarquez qu'un exposant inférieur à 1 fait l'inverse : la courbe passe au-dessus de la diagonale, ce qui pousse les valeurs moyennes vers le haut (plus de terre, moins d'eau).

## Façonner une île

!!! danger "À compléter"
    Le texte ci-dessous (et toutes les sections suivantes) n'a pas encore d'exemple visuel interactif — contrairement aux sections précédentes.

Sans rien ajouter, un bruit de Perlin ne « sait » pas où sont les bords de la carte — le terrain continue jusqu'aux limites du canevas. Pour obtenir une île entourée d'eau, on combine l'élévation avec une **fonction de distance** : une fonction qui vaut 0 au centre de la carte et 1 sur les bords.

Une version simple (« square bump ») :

```java
float d = 1 - (1 - nx * nx) * (1 - ny * ny);
```

(Rappel : `nx` et `ny` vont de -0,5 à 0,5, donc `nx*nx` et `ny*ny` restent petits au centre et grandissent vers les bords.)

Ensuite, on mélange cette distance avec l'élévation calculée précédemment, à l'aide d'une interpolation linéaire :

```java
float mixParam = 0.5; // 0 = ignore la distance, 1 = île parfaitement ronde
e = lerp(e, 1 - d, mixParam);
```

Près du centre (`d` proche de 0), l'élévation reste presque inchangée. Près des bords (`d` proche de 1), l'élévation est tirée vers 0, ce qui force la présence d'eau. Le paramètre `mixParam` permet de doser à quel point la forme de l'île est « imposée » par rapport à ce que le bruit propose naturellement.

## Les biomes : élévation + humidité
Jusqu'ici, une seule carte de bruit décide de tout. Pour obtenir des **biomes** (désert, forêt, toundra, etc.), on utilise généralement **deux cartes de bruit indépendantes** : une pour l'élévation, une pour l'humidité (générée avec une graine différente). Le biome d'une case est alors déterminé par la combinaison des deux valeurs.

```java
String biome(float e, float m) {
  if (e < 0.1) return "OCÉAN";
  if (e < 0.12) return "PLAGE";

  if (e > 0.8) {
    if (m < 0.1) return "ROCHE_ARIDE";
    if (m < 0.5) return "TOUNDRA";
    return "NEIGE";
  }

  if (e > 0.6) {
    if (m < 0.33) return "FORÊT_CLAIRSEMÉE";
    if (m < 0.66) return "FORÊT";
    return "FORÊT_DENSE";
  }

  if (m < 0.16) return "DÉSERT";
  if (m < 0.5)  return "PRAIRIE";
  return "MARÉCAGE";
}
```

C'est essentiellement une grande cascade de `if`, mais rien n'empêche de la remplacer par une table ou un autre système plus élégant. L'important est de comprendre l'idée : **deux axes indépendants suffisent à générer une bonne variété de biomes**, une approche inspirée des travaux du botaniste Robert Whittaker.

## Pour aller plus loin
L'article original couvre plusieurs autres techniques qu'on ne fait qu'effleurer ici :

- **Le bruit en crête (*ridge noise*)** : `2 * (0.5 - abs(0.5 - noise(nx, ny)))` — inverse les vallées de bruit en pics, utile pour des chaînes de montagnes qui ont l'air de vraies arêtes rocheuses plutôt que des bosses arrondies.
- **Les terrasses** : `round(e * niveaux) / niveaux` — arrondit l'élévation à un nombre fixe de paliers, pour un rendu plus « stylisé » (rizières, terrain de jeu de stratégie, etc.).
- **Le placement d'objets** (arbres, rochers) à l'aide d'une couche de bruit à haute fréquence, en cherchant les maximums locaux.
- **Les cartes qui « boucle »** (cylindriques ou torique), pour qu'on puisse voyager vers l'est indéfiniment et revenir à son point de départ.
- **Les cartes infinies**, en calculant le bruit à la volée autour de la caméra plutôt que de générer toute la carte d'un coup.

Ces techniques sortent du cadre de ce cours, mais l'article de Red Blob Games les explique très bien, avec des démonstrations interactives pour chacune : [redblobgames.com/maps/terrain-from-noise](https://www.redblobgames.com/maps/terrain-from-noise/).

## Résumé
Une carte procédurale intéressante n'est presque jamais un seul appel à `noise()`. Elle résulte d'une combinaison de petites transformations : plusieurs octaves de bruit pour la variété, une redistribution pour contrôler la forme du relief, une fonction de distance pour façonner les côtes, et une seconde carte de bruit (l'humidité) pour faire émerger des biomes. Chacune de ces étapes est simple individuellement — c'est leur combinaison qui donne un résultat convaincant.

??? info "Idées futures / à faire"
    - Ajouter une visualisation 3D au bout de chaque exemple.
