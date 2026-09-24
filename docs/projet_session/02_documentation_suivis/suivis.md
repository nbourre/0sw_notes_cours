# Suivi du projet de session

Pour suivre le projet, vous allez devoir créer un projet sur GitHub. On utilisera un Kanban pour faire le suivi. Le Kanban est un tableau qui permet de suivre l'avancement des tâches. Vous pouvez créer un Kanban pour chaque membre de l'équipe ou un Kanban pour l'équipe entière.

![alt text](assets/kanban_exemple.png)

## Nouveau projet sur GitHub
Pour accéder au projet sur GitHub, vous devez être connecté et atteindre l'onglet `Projects`.

![alt text](assets/github_my_projects.png)

### Méthode 1 : À partir d'un dépôt
Vous pouvez créer un projet à partir d'un dépôt existant.

![alt text](assets/github_new_project_from_repo.png)

Pour ce faire, 
1. Ouvrez le dépôt
2. Cliquez sur l'onglet `Projects`
3. Cliquez sur le bouton `New project`

### Méthode 2 : À partir de l'onglet `Projects`
Vous pouvez créer un nouveau projet en cliquant sur le bouton `New project`.

Sélectionnez le modèle `Board`, donnez un nom significatif et cliquez sur `Next`.

![alt text](assets/github_create_new_project.gif)

Vous devrez associer le projet à un dépôt. Sélectionnez le dépôt et cliquez sur `Link a project`.

## Configuration du projet

![alt text](assets/github_new_project.png)

Configuration du projet :

- Nom du projet : Donnez un nom significatif
- Description : Ajoutez une description pour expliquer le projet

## Les colonnes
Un Kanban est composé de colonnes. Chaque colonne représente un état de la tâche. Par exemple, une tâche peut être `À faire`, `En cours` ou `Terminée`.

> **Note :** Le nombre de colonnes variera en fonction des besoins du projet et des standards de l'équipe ou de l'entreprise.

Pour ajouter une colonne, cliquez sur le bouton `+` à l'extrémité droite du tableau.

**Pour les besoins du suivi du projet, vous devez ajouter la colonne `Backlog` qui sera la première colonne.** Cette colonne contiendra toutes les tâches à faire éventuellement.

## Ajouter un collaborateur
Pour ajouter un collaborateur :

1. Cliquez sur le bouton `...` en dessous de votre logo
2. Cliquez sur `Settings`
3. Cliquez sur `Manage access`
4. Invitez un collaborateur en cliquant sur `Invite collaborators`

### Description des colonnes
- `Backlog`: Tâches à faire éventuellement
- `To do`: Tâches à faire prochainement
- `In progress`: Tâches en cours
- `Done`: Tâches terminées

## Ajouter des tâches
Les tâches sont représentées par des cartes. Chaque carte contient des informations sur la tâche.

- On peut ajouter des étiquettes, des assignés, des dates d'échéance, des descriptions, etc.
- On peut créer un *issue* directement à partir de la carte.
    - C'est ce que je recommande pour les tâches.

Pour ajouter une tâche :

1. Cliquer sur le bouton `+ Add item` dans le bas de la colonne désirée.
2. Taper `#` pour sélectionner un dépôt.
3. Cliquer sur `Create a new issue` pour créer une nouvelle tâche.
4. Ajouter les informations nécessaires pour la tâche.

![alt text](assets/kanban_new_card.png)


---

## Exercice
1. Créez un projet sur GitHub pour votre projet de session.
    1. Prenez la méthode de création qui vous convient.
2. Assurez-vous que le dépôt est associé au projet.
3. Ajoutez moi comme collaborateur. Mon username : `nbourre`.
4. Ajoutez la colonne `Backlog`.
5. Ajoutez les tâches à faire dans la colonne `Backlog`.
    1. Voir ci-bas pour le tableau des critères que vous devrez convertir en tâches.

### Tableau des critères
Les critères ne sont pas nécessairement des tâches. Vous devrez les convertir en tâches. Il peut y avoir plusieurs tâches pour le même critère. Par exemple, le critère `Élément d'animation` pourrait être converti en plusieurs tâches tel que `Trouver un sprite sheet`, `Créer les animations`, `Intégrer les animations`, etc.

Les critères et les points proviennent de la [grille d'évaluation de l'énoncé](../01_enonce/index.md#grille-devaluation-detaillee).

> **Note :** Dans tous les cas, il peut y avoir une équivalence pour être adapté à votre projet. Il faudra me faire approuver. Il faudra marquer l'équivalence dans la carte.

| Critère | Points | Remarque |
|---------|:------:|----------|
| Menu initial | 5 | Navigation fonctionnelle avec options pour commencer, configurer ou consulter les instructions |
| Configuration d'éléments | 5 | Niveaux sonores indépendants (musique/effets), touches ou niveau de difficulté |
| Instructions | 5 | Accessibles depuis le menu initial, expliquent les mécaniques principales |
| Interaction dans le jeu | 5 | Clavier, souris ou manette; compatible avec la borne arcade Linux |
| Élément d'animation | 5 | Animations fluides et pertinentes (déplacement, transitions, effets) |
| Réaction à la suite d'événements | 5 | Collisions, victoire/défaite, feedback visuel ou sonore |
| Overlay | 5 | HUD : score, vies restantes ou autres informations en temps réel |
| Son | 10 | Musique de fond, effets sonores réactifs et mute (CTRL + M) |
| Algorithme 1 | 15 | Développé à partir des principes de base (bonus possible) |
| Algorithme 2 | 10 | Deuxième algorithme distinct (bonus possible) |
| Données de débogage | 5 | Activables via F12 : FPS, RAM (actuelle, min., max.), boîtes de collision, vecteurs |
| Scène de fin | 5 | Fin gagnante et fin perdante; touche spéciale pour y accéder directement |
| Quitter, retour au menu et redémarrer | 5 | Options fonctionnelles dans la scène de fin |
| Touche rapide | 5 | Pause (P) et/ou mute |
| Ajustement de qualité | 10 | Finition, absence de bogues majeurs, expérience utilisateur |
| Sauvegarde des meilleures performances | — | *Leaderboard* exigé dans l'énoncé |
| Exécutable sur la borne arcade | — | Version Linux |
| Documentation | — | `readme.md` à la racine du dépôt |
