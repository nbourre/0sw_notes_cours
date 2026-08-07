# Projet de session <!-- omit in toc -->

# Table des matières <!-- omit in toc -->
<!-- Générer table des matières avec Markdown All-in-One -->
- [Énoncé](#énoncé)
- [Structure du projet](#structure-du-projet)
- [Détails des points](#détails-des-points)
  - [Le menu initial](#le-menu-initial)
  - [Le cœur du jeu, simulation ou démonstration](#le-cœur-du-jeu-simulation-ou-démonstration)
    - [Interaction](#interaction)
    - [Graphisme et animation](#graphisme-et-animation)
    - [Son](#son)
    - [Algorithmes et mécanismes de jeux](#algorithmes-et-mécanismes-de-jeux)
      - [Pointage des algorithmes](#pointage-des-algorithmes)
      - [Conseils pour les algorithmes](#conseils-pour-les-algorithmes)
- [Données pour les geeks](#données-pour-les-geeks)
- [Scène de fin](#scène-de-fin)
- [Mise en pause](#mise-en-pause)
- [Liste des algorithmes et mécanismes suggérés](#liste-des-algorithmes-et-mécanismes-suggérés)
  - [Génération procédurale](#génération-procédurale)
  - [Pathfinding et navigation](#pathfinding-et-navigation)
  - [Intelligence artificielle et comportement](#intelligence-artificielle-et-comportement)
  - [Simulation et physique](#simulation-et-physique)
  - [Algorithmes structurels](#algorithmes-structurels)
  - [Relation entre catégories](#relation-entre-catégories)
- [Remise](#remise)
- [Grille d'évaluation détaillée](#grille-dévaluation-détaillée)
  - [Notes pour les évaluateurs](#notes-pour-les-évaluateurs)
- [Note pour Processing ou Monogame](#note-pour-processing-ou-monogame)

---

# Énoncé

Dans le cadre de ce travail, vous allez devoir développer un projet multimédia qui peut être un jeu, une simulation multimédia ou une démonstration multimédia. En autant que le projet soit interactif et qu’il utilise les éléments multimédias (son, image, vidéo, etc.), il pourra être accepté.

Le projet devra avoir les éléments ci-dessous. Chacun de ces points sera développé plus bas.

- Menu initial
- Démarrage
  - Instruction
  - Configuration
    - Ajustement indépendants des niveaux sonores de la musique et des effets sonores
- Cœur : Jeu, simulation ou démonstration
  - Interaction avec l’utilisateur
  - Graphisme et animation
  - Son
    - Touches raccourcies pour mute
    - Son d’ambiance pour la musique
    - Sons réactifs (effets sonores)
  - Algorithmes ou mécanismes de jeu
  - Données pour les geeks
    - Touche F12 pour afficher la RAM et les images par seconde à l’écran
- Scène de fin
  - Une scène indiquant la fin du projet
    - Il doit y avoir une fin perdante et une fin gagnante
  - L'utilisateur pourra faire les choix suivants : quitter, revenir au menu principal et redémarrer le jeu
- Sauvegarde du meilleur score
- Mise en pause
- Exécutable sur la borne arcade
  - Linux

---

# Structure du projet

Votre dossier de projet sur GitHub devra avoir les éléments suivants :

- Dossier `src` pour le projet Godot.
- Fichier `readme.md` à la racine pour la présentation et documentation de votre projet.
  - Les informations à ce sujet sont à venir.

---

# Détails des points

## Le menu initial

Le menu initial est l’introduction au jeu. Il permet, par exemple, au joueur de :

- Configurer des éléments tels que le niveau sonore de la musique/effets sonores ou les touches pour interagir avec le jeu.
- Configurer le niveau de difficulté du jeu.
- Consulter les instructions pour comprendre les mécaniques du jeu.

Ainsi, il s’agit de la fenêtre d’introduction pour votre projet.

---

## Le cœur du jeu, simulation ou démonstration

Cette partie est l’équivalent au développement d’un texte : le « met principal » d’un repas. Tout le projet tournera autour de cet aspect.

### Interaction
- Minimum d’interaction avec l’utilisateur (clavier, souris ou manette).
- Compatibilité avec la borne arcade sous Linux.

### Graphisme et animation
- Éléments animés visibles dans le jeu.
- Réactions observables suite à des actions spécifiques (ex. : collision, victoire, etc.).
- Overlay pour afficher des informations comme le score, les vies restantes, etc.

### Son
- Minimum requis : musique de fond et effets sonores.
- Possibilité de mettre en sourdine via le menu de configuration et une touche raccourcie.

### Algorithmes et mécanismes de jeux

Dans le cadre du projet, on devra retrouver au moins **deux algorithmes développés à partir des principes de base**, c’est-à-dire sans utiliser de librairie quelconque. Dans le cours, vous avez vu l’algorithme d’essaimage et les algorithmes de forces. Cependant, vous n’êtes pas obligés d’utiliser ces algorithmes. Vous pouvez prendre des algorithmes qui sont mieux adaptés à votre projet, par exemple : la génération de terrain, la génération de labyrinthe, la cinématique inverse, l’intelligence artificielle, etc.

Les éléments de base nécessaires à la construction du projet **ne seront pas comptabilisés comme des algorithmes**. Par exemple, dans un jeu de plateforme, le déplacement du personnage, les collisions ou le saut sont des fonctionnalités fondamentales et ne seront donc pas évalués comme des algorithmes. Cependant, si vous intégrez des fonctionnalités avancées, comme un ennemi qui pourchasse le personnage et attaque de manière stratégique, cela sera considéré comme un algorithme.

#### Pointage des algorithmes
J’ai défini un pointage pour différents algorithmes en fonction de leur complexité. La difficulté de ces algorithmes étant variable, le pointage attribué reflètera leur niveau d’exigence.

Si vous choisissez d’utiliser des **mécanismes intégrés dans la plateforme de création** (ex. : Godot), tels que le raycasting, le pathfollowing, ou le parallaxe, il faudra le **double des mécanismes intégrés** pour obtenir les mêmes points qu’un algorithme développé à partir de zéro.

---

#### Conseils pour les algorithmes
- Un algorithme sera évalué sur sa **fonctionnalité**, son **efficacité**, et sa **pertinence** par rapport à votre projet.
- Les projets qui intègrent des solutions innovantes ou particulièrement optimisées peuvent recevoir un bonus.
- Si vous avez des doutes sur un mécanisme ou un algorithme, demandez conseil avant de l’implémenter.

---

# Données pour les geeks

Les données de débogage doivent inclure des informations comme :
- Les boîtes de collision.
- Les vecteurs (flèches pour visualisation).
- Le taux de rafraîchissement (FPS), la mémoire utilisée, etc.

---

# Scène de fin

Une scène de fin doit :
- Afficher une fin gagnante et une fin perdante.
- Permettre de quitter le jeu, retourner au menu principal ou redémarrer.
- Inclure une touche spéciale pour atteindre directement la scène de fin.

---

# Mise en pause

Votre projet doit permettre à l’utilisateur de mettre en pause via une touche spécifique.

---

# Liste des algorithmes et mécanismes suggérés

## Génération procédurale
- **Génération procédurale**  
  - Création dynamique de contenu (niveaux, objets, etc.) basée sur des algorithmes.  
- **Générateur de labyrinthe/donjon**  
  - Génère automatiquement des labyrinthes ou des donjons, souvent utilisé dans les jeux roguelike.  
- **Générateur de piste de course**  
  - Produit des circuits ou parcours dynamiques adaptés à des paramètres définis.  
- **Système L-Tree**  
  - Génération d’arbres ou structures fractales à partir de règles itératives.
- **Wave Function Collapse (WFC)**
  - Algorithme permettant de générer des niveaux ou structures basés sur des motifs compatibles.

## Pathfinding et navigation
- **A***  
  - Algorithme de recherche de chemin optimal prenant en compte les obstacles.  
- **Path following (recherche de chemin)**  
  - Permet à un objet ou un personnage de suivre un chemin prédéfini tout en évitant les obstacles.  
- **Raycasting**  
  - Utilisé pour tracer des lignes de vue ou détecter des collisions sur un chemin.

## Intelligence artificielle et comportement
- **Réseau de neurones**  
  - Modèle d’apprentissage complexe, utilisé pour prendre des décisions ou apprendre des modèles.  
- **Agent autonome**  
  - Entité avec des comportements indépendants comme poursuivre, esquiver, ou explorer.  
- **Essaimage (comportement d’agrégation)**  
  - Simule des comportements collectifs (ex. : bancs de poissons ou essaims).  
- **Fog of war**  
  - Technique masquant certaines parties de la carte jusqu'à ce qu’elles soient explorées.  
- **Champ de vision**  
  - Calcule ce qu'un personnage ou une caméra peut voir selon son orientation ou sa position.

## Simulation et physique
- **Cinématique inverse**  
  - Technique calculant les mouvements des articulations pour atteindre un point spécifique.  
- **Automate cellulaire**  
  - Grille où chaque cellule évolue selon des règles simples, utilisé pour des simulations comme le jeu de la vie.  
- **Système de Voxel**  
  - Représentation d’objets volumétriques en cubes 3D, idéale pour des mondes voxelisés comme Minecraft.

## Algorithmes structurels
- **Algorithme de Prim**  
  - Génère un arbre couvrant minimum, souvent utilisé pour créer des labyrinthes connectés.  
- **Patron de conception – Object pool**  
  - Réutilisation d’objets instanciés pour économiser les ressources.  
- **Patron de conception – State**  
  - Modèle pour gérer les états d’un objet ou système, par exemple les différentes phases d’un ennemi.

---

## Relation entre catégories
Certains algorithmes peuvent se retrouver dans plusieurs catégories en fonction de leur usage. Par exemple :
- **Raycasting** peut être utilisé pour la navigation (Pathfinding) ou la détection de collisions (Simulation).
- **Automate cellulaire** peut servir à la génération procédurale ou à simuler des comportements dynamiques.

---

# Remise

La date de remise du projet est fixée à la dernière semaine de novembre. Les cours suivants seront dédiés à la finalisation, au montage de la présentation et au débogage.

La remise doit se faire via le formulaire Git.

---

# Grille d'évaluation détaillée

| Critère                     | Points | Description détaillée                                                                 |
|-----------------------------|--------|--------------------------------------------------------------------------------------|
| **Menu initial**            | 5      | Présence d'un menu initial avec navigation fonctionnelle. Inclut des options claires pour commencer, configurer ou consulter les instructions. |
| **Configuration d’éléments**| 5      | Permet d'ajuster le niveau sonore (musique/effets), les touches ou le niveau de difficulté dans un menu fonctionnel. |
| **Instructions**            | 5      | Instructions claires et accessibles depuis le menu initial. Contiennent des explications des mécaniques principales et des exemples pratiques. |
| **Interaction dans le jeu** | 5      | Le joueur peut interagir avec le jeu via clavier, souris ou manette. Compatibilité avec la borne arcade Linux. |
| **Élément d’animation**     | 5      | Utilisation d'animations fluides et pertinentes dans le jeu (ex. : déplacement, transitions, effets). |
| **Réaction à la suite d’événements** | 5 | Le jeu réagit aux actions du joueur (ex. : collisions, état de victoire ou défaite, feedback visuel ou sonore). |
| **Overlay**                 | 5      | Présence d'un affichage HUD (score, vies restantes, ou autres informations en temps réel). Clair et lisible. |
| **Son**                     | 10     | Musique de fond et effets sonores bien intégrés. Possibilité de mute via un raccourci et une bonne gestion audio. |
| **Algorithme 1**            | 15     | Implémentation d’un algorithme :<br>- Fonctionnalité de base (5 points).<br>- Efficacité et complexité (3 points).<br>- Pertinence au projet (2 points).<br>**Bonus** : Jusqu’à 2 points supplémentaires pour un algorithme particulièrement créatif, optimisé ou allant au-delà des exigences minimales. |
| **Algorithme 2**            | 10     | Implémentation d’un deuxième algorithme distinct :<br>- Fonctionnalité de base (5 points).<br>- Efficacité et complexité (3 points).<br>- Pertinence au projet (2 points).<br>**Bonus** : Jusqu’à 2 points supplémentaires pour un algorithme particulièrement créatif, optimisé ou allant au-delà des exigences minimales. |
| **Données de débogage**     | 5      | Affichage d'informations techniques (Ex : FPS, RAM, collisions, vecteurs, positions, nombre d'objets, etc.). **Fonctionnalités activables via F12**. |
| **Scène de fin**            | 5      | Scène de fin avec un message clair pour une victoire ou une défaite. Permet de quitter, redémarrer ou retourner au menu. |
| **Quitter, Retour au menu et redémarrer** | 5 | Présence de boutons ou options pour quitter le jeu, revenir au menu principal ou redémarrer une partie. Fonctionnels et ergonomiques. |
| **Touche rapide**           | 5      | Intégration d'une touche pour pause (P) et/ou mute (M). Fonctionnement fluide et fiable. |
| **Ajustement de qualité**   | 10     | Niveau général de finition, absence de bugs majeurs, et expérience utilisateur satisfaisante (graphismes, fluidité, etc.). |

**Total : 100 points**

---

## Notes pour les évaluateurs
- Dans tous les cas, les notes seront graduelles en fonction de la qualité de l’implémentation. Par exemple, 0 point pour une fonctionnalité manquante, 1 point pour une implémentation partielle, 2 points pour une implémentation correcte, etc.
  - Exemple : Un menu initial de base qui répond aux exigences sans plus pourrait valoir 2 points.
- **Bonus**
  - Les points bonus sont attribués pour des éléments innovants et bien réalisés qui dépassent les exigences minimales.
- **Malus**
  - Manque de cohérence dans l'interface tel que du franglais ou des fautes de français.
  - Attitude négative envers le projet (ex. : attitude non collaborative, etc.).

---

# Note pour Processing ou Monogame

Si le projet est réalisé avec Processing ou MonoGame, l’implémentation des nœuds de mécanisme de Godot (ex. : collision, animations, tuiles) peut être comptée comme les algorithmes 1 et 2.