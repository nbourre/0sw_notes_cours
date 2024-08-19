À reformater ce qui suit



Les classes
Les classes en Processing
- Pour créer une nouvelle classe,
il faut ajouter un onglet et lui
attribuer le nom de la classe
- Flèche à droite du dernier onglet
- Pas la suite, il suffit de coder
comme pratiquement n’importe
quelle classe
Les classes en Processing
- Les classes de base en Processing ont la particularité d’être des
classes internes
- En effet, Processing fusionne toutes classes à l’intérieur d’une grande
classe principale lors de la compilation
- L’avantage de cette méthode est que le programme dispose de
variables et constantes propre à Processing tel que width et height
- Il est possible de créer des classes totalement génériques en ajoutant
l’extension « .java » au nom de l’onglet
- Cela aura comme conséquence qu’il ne sera pas possible directement
d’accéder aux variables et constantes de Processing
- Pour pouvoir accéder aux propriétés de Processing, il faudra injecter un
PApplet dans la classe
Les vecteurs
Liste de vidéos de support
Vecteur : définition
- Le terme vecteur peut signifier plusieurs choses dépendant du
contexte
- En biologie : Décrit un organisme qui transmet une infection d’un hôte à un
autre
- En programmation : Décrit une structure de tableau de données
- En mathématique, un vecteur est un concept permettant de
représenter une longueur (magnitude) et une direction
Vecteur : utilité
- Dans le monde des jeux vidéo, réalité virtuelle ou autre simulation,
les vecteurs sont utilisés partout
- C’est une connaissance fondamentale à la programmation de jeux
et applis multimédia
- C’est un bloc de construction nécessaire pour toute application ayant
des implications mathématiques
Vecteur :
exemple
- Voici du code représentant
une balle qui rebondit aux
limites de l’écran
- Lien pour l’exécuter
- Au moment d’écrire ces
lignes, il y avait un bug dans
Processing. Il faut cliquer une
2e fois sur le lien tout en ayant
une fenêtre ouverte.
Vecteur : exemple
- Ce que l’on remarque est l’utilisation de plusieurs variables X et Y
similaires
- Position X et Y
- Vitesse X et Y
- Une des complications est la gestion de toutes ces variables
- Imaginez maintenant que vous devez gérer l’accélération, la position
d’une cible, le vent et la friction
- Quelles seraient les variables probables?
- Utilisation de deux variables dans chacun des cas
- Dans un monde 3D ce serait 3 variables…
Vecteur : exemple
float x;
float y;
float z; // Si 3D
Vecteur location;
float xSpeed;
float ySpeed;
float zSpeed; // Si 3D
Vecteur speed;
On simplifie le code en utilisant les vecteurs.
Vecteur : classe
- Processing offre la classe PVector qui représente un vecteur
- Dans cette classe, on y retrouve les propriétés X et Y en float
- On y retrouve plusieurs méthodes pour effectuer des opérations
avec les vecteurs
Vecteur : déplacement
- Pour simuler du mouvement à l’aide des vecteurs, il faut utiliser la
translation
- Pour effectuer une translation, il suffit d’additionner la vitesse à la position
- Le mouvement est un déplacement dans le temps
- La vitesse représente un déplacement dans le temps
- La vitesse peut être représentée par un vecteur
- Le déplacement est une distance dans une unité donnée
- Exemple : L’unité pixel
Exemple :
location = new PVector (50, 50);
vitesse = new PVector (1, 1);
// On additionne à location le vecteur de vitesse
location.add(vitesse)
// Équivalent sans vecteur
locX = 50;
locY = 50;
vitX = 1;
vitY = 1;
locX += vitX;
locY += vitY;
Exercice #2
- Dans l’exercice #1, vous deviez faire une ellipse qui rebondit sur les
côtés de la fenêtre, améliorez le code pour utiliser des vecteurs pour
déplacer la balle
Vecteur : opérations d’intérêt
- Soustraction
- Idem que l’addition
- Méthode sub(PVector)
- Exemple : Pour trouver la distance entre deux vecteurs
- Multiplication par un scalaire
- On multiplie pour chacun des composants du vecteur par une valeur scalaire
- 𝐴 ∗ 𝑣 𝑥, 𝑦 = 𝑣 𝐴𝑥, 𝐴𝑦 ;
- Méthode mult(float)
- Division par un scalaire
- Idem que la multiplication
Vecteur : opérations
- Magnitude
- La magnitude est la longueur du vecteur en utilisant le théorème de
Pythagore. Qui est?
- Normalisation
- Ramène le vecteur à une longueur de 1 unité
- On divise le vecteur par sa longueur
- Ça donne la direction du vecteur
- Exemple : Pour limiter la vitesse d’un objet. On normalise le vecteur de
vitesse ensuite on le multiplie par la vitesse maximale
Vecteur : accélération
- L’accélération est le taux de variation de la vitesse
- En programmation, on additionne l’accélération à la vitesse
Exemple
acceleration = new PVector (1, 1);
vitesse = new PVector (0, 0);
vitesse.add (acceleration);
location.add (vitesse);
Vecteur : autres opérations
- Dans un jeu, on limite souvent les vitesses
- Pour limiter les vitesses, on ajoute une méthode qui limite la
longueur d’un vecteur
- L’algorithme est le suivant
- Si vecteur.longueur > max
- vecteur.normalise() // On le met à une longueur de 1 unité
- vecteur.mult(max)
- Fin si
Vecteur : trajectoire
- À chaque fois que l’on désire calculer une trajectoire, il faut calculer
la magnitude et la direction
- Prenons l’exemple où l’on désire que notre objet se déplace vers la
souris
- Calculons la direction
- Celle-ci est la distance entre le X et Y de l’objet et le X et Y de la souris
PVector souris = new PVector (mouseX, mouseY);
PVector dir = PVector.sub(souris, location);
Vecteur : trajectoire
- Nous avons maintenant le vecteur qui pointe directement à
l’emplacement de la souris
- Si nous additionnons la direction à la position l’objet apparaîtrait
immédiatement à la souris et ce n’est pas l’effet désiré
- Ce que l’on doit faire, c’est de décider à quelle vitesse l’objet doit se
rendre à la souris
- Pour ce faire, on normalisera le vecteur pour ensuite le multiplier par
une valeur qui déterminera sa vitesse en unité
- Pour finaliser, on applique ce vecteur à l’accélération
Exercice #3
- Modifiez l’exercice #2 pour avoir une forme qui accélère dans la
direction de la flèche appuyée par l’utilisateur
Exercice
- Faites un projet où une image (cible, balle, etc.) poursuit la souris
- Essayez avec différentes vitesses
Les templates
Processing : Templates
- Depuis la version 3.x, il y a un dossier « templates » dans
« Documents/Processing »
- On peut modifier le dossier dans les préférences
- Ce dossier permet de créer un patron pour chaque mode de
programmation de Processing
- Lors de la création d’un nouveau projet, le contenu du projet sera
déjà rempli avec du code par défaut ainsi que les classes qui y sont
présentes
- Chaque patron doit être dans un dossier nommé avec le nom du
langage
- Par exemple « Java »
- Dans chaque dossier, il devra y avoir un fichier nommé « sketch.pde »
- Ainsi templates/Java/sketch.pde
Processing : Templates
- Ci-contre est un exemple de
patron que j’utilise pour mes
projets
- Sauvegardez ce fichier sous
“documents/processing/templat
es/java/sketch.pde”
int currentTime;
int previousTime;
int deltaTime;
void setup () {
size (800, 600);
currentTime = millis();
previousTime = millis();
}
void draw () {
timeManagement();
update(deltaTime);
display();
}
void update(int delta) {
}
void display () {
}
void timeManagement (){
currentTime = millis();
deltaTime = currentTime - previousTime;
previousTime = currentTime;
}
Processing : Templates - exercices
- Dans notre cas, nous utiliserons Java, ainsi, créez un dossier « Java »
dans « templates »
- Ajoutez un fichier « sketch.pde »
- Dans le fichier « sketch.pde », collez le code qui est dans la section
commentaire de cette diapo
- Testez le patron en créant un nouveau projet java
- Ajoutez un objet abstrait nommé « GraphicObject » avec les
propriétés et méthodes suivantes :
- PVector location, velocity et acceleration
- color fillColor, strokeColor et strokeWeight
- Méthode abstraite void update (float deltaTime) et display()
- Cette classe servira à accélérer le développement d’objet graphique
- Sauvegardez « GraphicObject » dans le patron
Références
- À lire pour le prochain cours
- https://natureofcode.com/book/introduction/
- https://natureofcode.com/book/chapter-1-vectors/


Modèle de table html pour copier-coller
<table style="border: none;">

<tr>
<td>

</td>
<td>

</td>
</tr>
</table>