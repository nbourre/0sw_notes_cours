# GitHub Desktop pour le graphiste (cours accéléré)

Cette page s'adresse aux membres d'une équipe de game jam qui **ne programment pas** (graphiste, musicien, scénariste, etc.) et qui doivent déposer leurs fichiers dans le dépôt Git de l'équipe, sans utiliser la ligne de commande ni Godot.

**Durée visée : 30 minutes**, installation comprise.

!!! note "Contexte"
    Cette page complète le guide [Faire un game jam en équipe avec Godot et Git](../game_jam_equipe/index.md). Lisez au moins la section « Résumé : le workflow typique » de ce guide avant de commencer.

## Ce que vous avez besoin de savoir (5 minutes)

| Mot | Ce que c'est |
| --- | --- |
| **Dépôt** (*repository*) | Le dossier du projet, hébergé sur GitHub. Chaque membre en a une copie sur son ordinateur. |
| **Cloner** | Télécharger une copie du dépôt sur votre ordinateur. À faire une seule fois. |
| **Commit** | Une « sauvegarde » nommée de vos changements. Elle reste sur votre ordinateur tant que vous ne l'envoyez pas. |
| **Push** | Envoyer vos commits sur GitHub pour que l'équipe les voie. |
| **Pull** | Récupérer sur votre ordinateur les changements des autres. |
| **Branche** | Une version parallèle du projet où vous travaillez sans déranger les autres. |
| **Pull Request** (PR) | Une demande à l'équipe d'ajouter votre branche au projet principal (`main`). |

Le cycle complet tient en une phrase : **vous récupérez la dernière version, vous travaillez sur votre branche, vous envoyez, puis vous demandez la fusion.**

## Vos règles d'or

1. **Vous ne touchez qu'aux images, sons et autres fichiers d'art.** Jamais aux fichiers `.tscn`, `.tres`, `.gd` ni `project.godot`. Ce sont les fichiers du jeu, gérés par les programmeurs.
2. **Ne renommez pas et ne déplacez pas** un fichier déjà dans le dépôt sans prévenir l'équipe. Le jeu s'attend à le trouver à cet endroit.
3. **Vous êtes libre de choisir le style, les dimensions et la grille de vos feuilles de sprites.** En échange, **dites au programmeur** la taille d'une case, le nombre de colonnes et de lignes, et les cases de chaque animation. Il ajuste la scène du jeu en conséquence.
4. **Noms de fichiers en minuscules, sans espace ni accent**, avec des tirets bas : `slime_idle.png`, pas `Slime Idle.PNG`.
5. **Exportez en PNG** (fond transparent si nécessaire). Gardez vos fichiers de travail (`.psd`, `.kra`, `.aseprite`, `.blend`) **hors du dépôt**, par exemple sur Google Drive.
6. **Avant de commencer à travailler, prévenez l'équipe** sur Discord : « Je modifie `slime.png` ». Deux personnes ne modifient jamais le même fichier image en même temps : Git ne peut pas fusionner des images.
7. **Un doute? Demandez** avant de pousser. Une erreur détectée avant la fusion ne coûte rien.

## Installation et configuration

### 1. Préparez votre accès

1. Créez un compte sur [github.com](https://github.com){target="_blank"} si vous n'en avez pas.
2. Donnez votre nom d'utilisateur au responsable du projet. Il vous invite comme collaborateur.
3. **Acceptez l'invitation** reçue par courriel (ou dans les notifications GitHub).

### 2. Installez GitHub Desktop

1. Téléchargez [GitHub Desktop](https://desktop.github.com){target="_blank"} (Windows ou macOS).
2. Installez-le, puis lancez-le.
3. Choisissez **Sign in to GitHub.com** et connectez-vous.

!!! tip "Pas besoin d'installer Git"
    GitHub Desktop contient déjà Git. Vous n'avez rien d'autre à installer.

### 3. Clonez le dépôt de l'équipe

1. Menu **File → Clone repository…** (sur macOS : **File → Clone Repository…**).
2. Onglet **GitHub.com**, puis choisissez le dépôt de l'équipe dans la liste.
3. Choisissez un dossier local simple, **sans espace dans le chemin** si possible (ex. : `C:\jam\mon_jeu`).
4. Cliquez sur **Clone**.

Vous avez maintenant une copie du projet. Pour ouvrir le dossier : menu **Repository → Show in Explorer** (Windows) ou **Show in Finder** (macOS).

## Le cycle de travail

À répéter chaque fois que vous livrez de l'art.

### Étape 1 : Récupérez la dernière version

1. Vérifiez que la branche courante (en haut, **Current Branch**) est `main`.
2. Cliquez sur **Fetch origin**. Si le bouton devient **Pull origin**, cliquez dessus.

### Étape 2 : Créez votre branche

1. Cliquez sur **Current Branch**, puis **New Branch**.
2. Donnez-lui un nom court, qui commence par `art/` : `art/slime`, `art/decor-niveau1`, etc.
3. Cliquez sur **Create Branch**.

### Étape 3 : Ajoutez ou remplacez vos fichiers

1. Ouvrez le dossier du dépôt (**Repository → Show in Explorer / Finder**).
2. Copiez vos images dans le bon dossier du projet (ex. : `enemies/slime/`).
    - **Nouveau fichier :** copiez-le dans le dossier de la fonctionnalité concernée. Demandez au programmeur responsable où le placer.
    - **Remplacement d'un placeholder :** vous pouvez soit copier votre fichier **par-dessus l'ancien** (même nom), soit ajouter votre fichier avec un nouveau nom. Dans les deux cas, indiquez au programmeur la grille de votre feuille de sprites.
3. Retournez dans GitHub Desktop. Vos fichiers apparaissent à gauche, dans l'onglet **Changes**.

!!! warning "Vérifiez la liste des changements"
    Seuls vos fichiers d'art doivent apparaître. Si vous voyez un `.tscn`, un `.gd` ou `project.godot`, **ne les cochez pas**, et prévenez un programmeur.

!!! tip "Variante : livrer un dossier complet"
    Si vous êtes prêt à utiliser un peu de Godot, vous pouvez construire vous-même le visuel de votre entité (sprites et animations) dans un petit projet personnel, puis livrer le **dossier complet**. Le programmeur n'a plus qu'à le copier dans le projet. Voir la [variante « dossier autonome »](../game_jam_equipe/index.md#variante-livrer-un-dossier-autonome) du guide principal.

### Étape 4 : Faites un commit

1. En bas à gauche, écrivez un message court dans **Summary** (ex. : `Nouvelle animation du slime`).
2. Cliquez sur **Commit to art/slime**.

### Étape 5 : Envoyez sur GitHub

Cliquez sur **Publish branch** (première fois) ou **Push origin** (les fois suivantes).

### Étape 6 : Demandez la fusion

1. Cliquez sur **Create Pull Request**. Votre navigateur s'ouvre sur GitHub.
2. Écrivez une courte description : ce qui est ajouté, où.
3. Cliquez sur **Create pull request**, puis annoncez-le sur Discord.

Le responsable du projet vérifie, puis fusionne. **Vous n'avez rien d'autre à faire.**

### Étape 7 : Après la fusion

1. Dans GitHub Desktop, cliquez sur **Current Branch** et choisissez `main`.
2. Cliquez sur **Fetch origin**, puis **Pull origin**.
3. Vous êtes prêt à recommencer à l'étape 2 pour la prochaine livraison.

## Petits problèmes fréquents

| Symptôme | Solution |
| --- | --- |
| Des fichiers inattendus apparaissent dans **Changes** | Ne les cochez pas. Clic droit → **Discard changes** pour les annuler, puis prévenez un programmeur. |
| **Push** est refusé (*permission denied*) | Vous n'avez pas accepté l'invitation de collaborateur, ou le responsable doit vous réinviter. |
| Message de **conflit** (*merge conflict*) | Arrêtez-vous et appelez un programmeur. Ne cliquez pas au hasard. |
| GitHub refuse un fichier trop gros | GitHub bloque les fichiers de plus de **100 Mo**. Exportez en plus petit, ou gardez-le hors du dépôt. |
| Le programmeur dit que votre image n'est « pas là » dans Godot | Vérifiez le nom et le dossier. Godot doit aussi **importer** le fichier : le programmeur ouvre le projet et commite les fichiers `.import` générés. Si l'image s'affiche mal ou coupée, c'est que la scène doit être ajustée à votre grille : donnez-lui la taille des cases. |
| Vous avez travaillé sur `main` par erreur | Ne faites pas de commit. Créez la branche (étape 2) : vos changements la suivent. |

## Exercice de pratique (15 minutes)

À faire en équipe pendant l'exercice « Petite pratique en équipe » du [guide principal](../game_jam_equipe/index.md).

- [ ] Installer GitHub Desktop et cloner le dépôt de l'équipe.
- [ ] Créer la branche `art/pratique`.
- [ ] Ajouter ou remplacer l'image placeholder d'un programmeur par une version colorée de votre choix.
- [ ] Écrire dans la Pull Request la taille d'une case et la grille de votre image.
- [ ] Faire un commit avec un message clair.
- [ ] Publier la branche et créer une Pull Request.
- [ ] Après la fusion, revenir sur `main` et faire **Pull origin**.
- [ ] Demander à un programmeur d'ouvrir le projet dans Godot, d'ajuster la scène à votre grille et de confirmer que la nouvelle image s'affiche.

## À retenir

- Vous travaillez **toujours sur votre propre branche**, jamais sur `main`.
- Vous ne touchez **qu'aux fichiers d'art**.
- Vous êtes libre de votre style et de votre grille, mais **vous donnez la grille au programmeur** (taille d'une case, colonnes, lignes, cases de chaque animation).
- Vous annoncez ce que vous modifiez, et vous demandez de l'aide au premier doute.
