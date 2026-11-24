# Faire un game jam en équipe avec Godot et Git

Pendant un game jam, le temps est limité : un conflit de fusion (*merge*) peut coûter des heures. Ce workflow vise à **éviter les conflits plutôt que de les résoudre**.

## Brièvement : le workflow typique

Voici la version courte. Les sections suivantes expliquent chaque point.

**Avant le jam (une seule fois, par le responsable du projet)**

1. Créer le dépôt GitHub et inviter l'équipe.
2. Ajouter et commiter `.gitignore` et `.gitattributes`.
3. Créer le projet Godot avec `Main.tscn`, puis le pousser sur `main`.
4. Répartir les scènes et les dossiers : **une scène = un propriétaire**.

**Cycle de travail (à répéter toute la journée, pour chaque membre)**

```bash
# 1. Fermer Godot, partir à jour
git switch main
git pull

# 2. Créer une branche courte pour une fonctionnalité
git switch -c feature/ma-fonctionnalite

# 3. Travailler dans son dossier, TESTER AVEC SA SCÈNE (F6). Pas F5!

# 4. Fermer Godot, commiter souvent
git add .
git commit -m "Description courte"

# 5. Intégrer les changements des autres, puis pousser
git pull --rebase origin main
git push -u origin feature/ma-fonctionnalite

# 6. Ouvrir une Pull Request sur GitHub
```

7. Une personne désignée fusionne la Pull Request, puis vérifie que `main` s'ouvre et se lance dans Godot.
8. Tout le monde refait `git switch main` et `git pull` avant la prochaine tâche.

**Les règles à retenir**

- Petites scènes, un propriétaire par scène, un dossier par fonctionnalité.
- Branches courtes (quelques heures), commits petits et fréquents.
- **Godot fermé** pendant un `pull`, `merge` ou `switch`.
- Annoncer à l'équipe les fichiers partagés qu'on touche (`Main.tscn`, `project.godot`, ressources communes).
- Ne jamais faire `git push --force` sur `main`.

**En cas de problème**

- Conflit sur un `.tscn` : garder une version complète, puis refaire l'ajout dans Godot.
- Conflit sur un `.gd` : résoudre dans VS Code.
- « Your local changes would be overwritten » : `git stash push -u`, puis `pull`, puis `git stash pop`.

**À la fin du jam**

- Étiquette de remise : `git tag v1.0-jam`.
- Tester un **clone frais** du dépôt avant de remettre le projet.

## Préparation générale

!!! example "Pratiquer en équipe au fil des notes"
    Des blocs **Pratique** sont répartis dans les sections qui suivent. Faites-les dans l'ordre, en équipe, pour vous familiariser avec le workflow avant le jam.

    Chaque équipe désigne un **responsable du projet**. Les autres membres sont des **développeurs**. Fermez Godot avant chaque opération Git (`pull`, `switch`, `merge`).

### 1. Préparation (avant le jam)

- Avoir un compte sur GitHub.
    - On évite les autres services, car la plupart ont déjà un compte sur cette plateforme.
- Déterminer les rôles de chacun : qui fait quoi, qui est responsable de quoi.
    - Une personne doit s'occuper du projet principal et de la structure du dépôt.
- Si l'équipe compte un graphiste (ou un musicien) qui ne programme pas, faites-lui suivre le [cours accéléré GitHub Desktop](../github_desktop_graphiste/index.md) avant le jam. Il pourra déposer ses fichiers sans Godot ni ligne de commande.

### 2. Préparer le dépôt Git

- **Un seul dépôt**. Par convention, personne ne pousse directement sur `main`.
- **`.gitignore` Godot** : ignorer `.godot/`, `export/` et les builds.
    - Voici un [fichier gitignore](https://www.toptal.com/developers/gitignore/api/visualstudiocode,python,venv,godot){target="_blank"} que j'utilise pour Godot 4. **Je vous le recommande**, il est plus complet que l'exemple ci-dessous.
    - Ajouter aussi les fichiers temporaires de votre éditeur (VS Code, etc.).
- **Fins de ligne** : ajouter un fichier `.gitattributes` pour éviter les différences Windows/Linux.
- **Format texte** : Godot 4 utilise par défaut `.tscn` et `.tres`, ce qui est lisible par Git.
- **Git LFS** (optionnel) pour les gros assets (`.wav`, `.psd`, `.blend`).

=== ".gitignore"
    
    ```gitignore
    ### Godot ###
    # Godot 4+ specific ignores
    **/.godot/

    # Godot-specific ignores
    **/.import/
    **/export.cfg
    **/export_presets.cfg

    # Imported translations (automatically generated from CSV files)
    *.translation

    # Mono-specific ignores
    **/.mono/
    **/data_*/
    mono_crash.*.json
    ```

=== ".gitattributes"

    ```gitattributes
    * text=auto eol=lf
    ```

- Une fois les fichiers `.gitignore` et `.gitattributes` ajoutés, **commitez-les** avant de commencer à travailler.

```bash
git init    # Initialiser le dépôt Git si ce n'est pas déjà fait
git add .
git commit -m "Ajout .gitignore et .gitattributes"
```

Poussez ensuite sur GitHub et invitez vos coéquipiers à cloner le dépôt. Pour faciliter la gestion de version, je vous suggère d'utiliser VS Code.

!!! example "Pratique 1 : créer le dépôt"
    Le responsable du projet :

    - Crée un dépôt GitHub vide.
    - Crée un projet Godot vide dans ce dépôt.
    - Ajoute et commite les fichiers `.gitignore` et `.gitattributes` (voir ci-dessus).
    - Invite les autres membres comme collaborateurs (*Settings → Collaborators*). Sans cet accès en écriture, leur `git push` sera refusé.

### 3. Créer le projet de base

La personne en charge du projet crée un projet Godot vide.

- Ajouter un `Main.tscn` et un script `Main.gd`.
- Configurer les paramètres du projet (résolution, etc.).
- Commiter le projet vide dans Git.

!!! note "Export du projet"
    Informez-vous sur les règles d'exportation du projet dès le début. Par exemple, si vous exportez pour Windows, vous aurez besoin d'un fichier `.pck` et d'un exécutable `.exe`. Si vous exportez pour le web, vous aurez besoin d'un fichier `.html` et d'un fichier `.js`. Assurez-vous d'avoir un membre de l'équipe qui sait comment faire ces exports.

!!! example "Pratique 2 : créer la scène principale"
    Le responsable du projet :

    - Crée une scène principale `Main.tscn` et configure le projet (résolution, etc.).
    - Commite, puis pousse le projet sur la branche `main`.

    Les autres membres acceptent l'invitation et attendent que ce push soit fait avant de passer à la pratique 3.

## Le flot de travail quotidien est simple

### 1. Règle d'or : réduire les conflits par la structure

Les conflits viennent presque toujours des **scènes (`.tscn`)** modifiées par deux personnes en même temps.

- **Une scène = un propriétaire à la fois.** Répartissez les fichiers au début (ex. : A = Joueur, B = Ennemis, C = Niveau 1, D = UI/Menus).
- **Découpez en petites scènes** : `Player.tscn`, `Enemy.tscn`, `HUD.tscn`, `Level1.tscn`. Instanciez-les dans le niveau plutôt que de tout bâtir dans une seule scène `Main.tscn`.
- **Un niveau par personne** quand c'est possible.
- **Un script par responsabilité** : les `.gd` fusionnent bien, les `.tscn` beaucoup moins.
- **Ressources partagées** (`.tres`, tilesets, `project.godot`) : une seule personne les modifie, ou l'équipe est avertie avant.
- **Ne pas déplacer ni renommer** de fichiers sans prévenir (Godot réécrit les chemins `res://`).

!!! tip "En résumé"
    Petites scènes, un propriétaire par scène, branches courtes, `pull` souvent, Godot fermé pendant les fusions.

### 2. Organisation des dossiers

Organisez le projet **par fonctionnalité** : chaque dossier contient la scène, le script et les assets qui lui sont propres.

Par exemple :

```
player/
  player.tscn
  player.gd
  player_sprites.png
  test_player.tscn
enemies/
  generic_enemy.tscn
  slime/
    slime.tscn
    slime.gd
  goblin/
    goblin.tscn
    goblin.gd
levels/
ui/
shared/        # polices, sons communs, tilesets, thème UI
```

- Chaque personne travaille dans son dossier, ce qui limite les conflits.
- Il est possible de créer des sous-dossiers dans chaque fonctionnalité (ex. : `enemies/slime/`).
- Les ressources utilisées par plusieurs scènes vont dans `shared/`.
- Utilisez le `snake_case` pour les noms de fichiers (`player.tscn`) : Windows ignore la casse, mais pas Linux.
- N'oubliez pas que l'**objectif est de limiter les conflits**, pas de créer une structure parfaite. Adaptez-vous à votre équipe et à votre projet.

### 3. Une scène de test par personne

Chaque membre de l'équipe a sa propre scène de test, pour travailler sans dépendre du travail des autres.

- Placez-la à côté de la fonctionnalité (ex. : `player/test_player.tscn`).
- Elle instancie simplement la scène à tester, avec un sol et une caméra minimaux.
- Lancez-la avec **F6** (*Run Current Scene*). Gardez **F5** pour la scène principale du projet.
- Ne modifiez **pas** la scène principale dans `project.godot` pour tester : ce fichier est partagé.

!!! note
    Les tests isolés ne remplacent pas l'essai dans le vrai jeu. Vérifiez `Main.tscn` après chaque fusion.

### 4. Workflow régulier (branches courtes)

```bash
git switch main
git pull                       # toujours partir à jour
git switch -c feature/ennemi-slime

# ... travailler, tester dans Godot ...

git add .
git commit -m "Ajout du slime"
git pull --rebase origin main  # intégrer les changements des autres
git push -u origin feature/ennemi-slime
```

!!! note "`rebase` c'est quoi?"
    `git pull --rebase` est une alternative à `git pull` qui **réécrit l'historique** pour que vos commits apparaissent après ceux de `main`. Cela évite les commits de fusion inutiles et rend l'historique plus lisible.

Fusionnez ensuite dans `main` (Pull Request ou fusion rapide en équipe).

- **Branches courtes** (quelques heures) et **fusionnées souvent**.
- **`git pull` avant de commencer** et avant chaque `push`.
- **Commits petits et fréquents**.

!!! warning "Fermez Godot avant un `pull`, `merge` ou `switch`"
    L'éditeur peut réécrire les fichiers ouverts et créer des modifications fantômes.

!!! example "Pratique 3 : une scène et une scène de test par personne"
    Chaque membre de l'équipe (responsable inclus) :

    1. Clone le dépôt, puis ouvre le projet dans Godot.
    2. Crée une branche à son nom de fonctionnalité :

        ```bash
        git switch -c feature/joueur    # ou feature/ennemi, feature/niveau, etc.
        ```

    3. Crée un dossier pour sa fonctionnalité (ex. : `player/`, `enemies/`, `levels/`). Chaque membre prend un dossier différent.
    4. Crée une scène simple dans son dossier (ex. : `player/player.tscn`). Utilisez le `snake_case` pour les noms de fichiers.
    5. Crée une scène de test dans le même dossier (ex. : `player/test_player.tscn`) qui instancie sa scène, et lance-la avec **F6**.
    6. **Ferme Godot**, puis commite et pousse la branche :

        ```bash
        git add .
        git commit -m "Ajout de la scène du joueur"
        git push -u origin feature/joueur
        ```

    !!! warning "Ne touchez pas à `Main.tscn` ni à `project.godot`"
        Ces fichiers sont partagés. Dans cette pratique, personne d'autre que le responsable ne les modifie.

### 5. Communication

C'est la mesure la plus efficace contre les conflits.

- Annoncez dans le canal d'équipe (Discord) : « Je touche à `Level1.tscn` ».
- Utilisez un tableau simple type KanBan sur GitHub Projects avec le responsable de chaque tâche.
- Désignez une personne qui vérifie que `main` s'ouvre et se lance dans Godot après chaque fusion.

!!! example "Pratique 4 : fusionner les branches dans `main`"
    1. Chaque membre ouvre une **Pull Request** sur GitHub pour fusionner sa branche dans `main`.
    2. Le responsable du projet fusionne les Pull Requests **une à la fois**. Avant chaque fusion, il vérifie qu'elle ne touche que le dossier de son auteur.
    3. Après chaque fusion, le responsable met à jour son `main` local et vérifie que `Main.tscn` s'ouvre et se lance :

        ```bash
        git switch main
        git pull
        ```

!!! example "Pratique 5 : récupérer les changements de `main` dans votre branche"
    Une fois toutes les Pull Requests fusionnées, chaque membre (Godot fermé) :

    ```bash
    git switch main
    git pull
    ```

    Rouvrez ensuite le projet dans Godot et ouvrez les scènes des autres membres (ex. : `enemies/enemy.tscn`, `levels/level_1.tscn`). Lancez leurs scènes de test avec **F6** pour confirmer que tout est arrivé dans votre copie du projet.

    Si vous voulez continuer à travailler sur votre branche avec les changements des autres, ramenez-y `main` :

    ```bash
    git switch feature/joueur
    git merge main
    ```

    !!! note "Pourquoi `merge` et pas `rebase` ici?"
        Votre branche est déjà poussée sur GitHub. Un `rebase` réécrirait son historique et demanderait un `git push --force`. Pour une branche déjà partagée, un `merge` est plus sûr.

### 6. En cas de conflit sur un `.tscn`

1. Ne paniquez pas et évitez d'éditer le fichier à la main.
2. Choisissez une version complète :

    ```bash
    git checkout --ours fichier.tscn    # ou --theirs
    ```

3. Refaites dans Godot les ajouts perdus de l'autre version (c'est rapide si les scènes sont petites).
4. Pour les `.gd`, résolvez le conflit normalement dans VS Code.

Les pratiques précédentes évitent les conflits, comme le recommande ce guide. Pendant un vrai jam, il y en aura quand même. Mieux vaut s'exercer **maintenant**, sans pression, à les résoudre. Le dépôt contient déjà les scènes de chaque membre et `main` est à jour.

!!! example "Pratique 6 : provoquer et résoudre un conflit sur `Main.tscn`"
    Le conflit le plus fréquent en jam : plusieurs personnes ajoutent leur scène dans `Main.tscn` en même temps.

    **Étape 1 : tout le monde part du même point.** Chaque membre (Godot fermé) :

    ```bash
    git switch main
    git pull
    git switch -c feature/integration-joueur    # ou integration-ennemi, integration-niveau, etc.
    ```

    !!! warning "Attendez le signal"
        Personne ne fusionne tant que **tous** les membres n'ont pas poussé leur branche à l'étape 2. C'est ce qui garantit le conflit.

    **Étape 2 : chacun instancie sa scène dans `Main.tscn`.** Chaque membre :

    1. Ouvre `Main.tscn` dans Godot.
    2. Ajoute sa scène comme enfant avec le bouton **Instancier une scène enfant** (ou `Ctrl+Maj+A`).
    3. Enregistre, **ferme Godot**, puis commite et pousse :

        ```bash
        git add .
        git commit -m "Ajout de ma scène dans Main"
        git push -u origin feature/integration-joueur
        ```

    4. Ouvre une Pull Request vers `main`.

    **Étape 3 : fusionnez la première Pull Request.** Le responsable fusionne **une seule** Pull Request. Les autres affichent maintenant le message *« This branch has conflicts that must be resolved »*. C'est normal : `main` a changé dans `Main.tscn` et leur branche aussi.

    **Étape 4 : résolvez le conflit.** Chaque membre dont la Pull Request est en conflit (Godot fermé) :

    ```bash
    git switch feature/integration-ennemi
    git merge main
    ```

    Git affiche un message comme `CONFLICT (content): Merge conflict in Main.tscn`. Suivez la procédure ci-dessus :

    1. **N'éditez pas** `Main.tscn` à la main.
    2. Gardez la version de `main` :

        ```bash
        git checkout --theirs Main.tscn
        ```

    3. Ouvrez le projet dans Godot et **ajoutez de nouveau** votre scène dans `Main.tscn`. Enregistrez, puis fermez Godot.
    4. Terminez la fusion :

        ```bash
        git add Main.tscn
        git commit             # accepte le message de fusion proposé
        git push
        ```

    La Pull Request n'est plus en conflit. Le responsable la fusionne, puis le prochain membre recommence l'étape 4 avec la version à jour de `main`.

    !!! note "Pourquoi `--theirs` pour garder `main`?"
        Lors d'un `git merge main`, **`--ours`** désigne *votre* branche et **`--theirs`** désigne la branche que vous fusionnez, donc `main`. Lors d'un `git rebase`, c'est l'inverse. Dans le doute, ouvrez le fichier dans Godot pour vérifier ce que vous avez gardé.

    !!! tip "Pourquoi refaire l'ajout plutôt que fusionner le fichier?"
        Un `.tscn` contient des identifiants générés par Godot (`id="1_abc12"`) et un compteur `load_steps`. Les fusionner à la main est risqué. Refaire un simple ajout dans Godot prend 10 secondes.

!!! example "Pratique 7 : résoudre un conflit dans un script `.gd`"
    Les scripts se fusionnent mieux, mais deux personnes qui modifient la **même ligne** provoquent quand même un conflit.

    **Étape 1 : préparez un fichier partagé.** Le responsable crée `shared/config.gd`, puis le commite et le pousse sur `main` :

    ```gdscript
    extends Node

    const GAME_TITLE = "Mon jeu"
    const PLAYER_SPEED = 200
    ```

    Les autres membres font `git switch main` puis `git pull`.

    **Étape 2 : deux personnes modifient la même ligne.** Choisissez deux membres, A et B. Chacun crée sa branche à partir de `main`, **modifie la ligne `PLAYER_SPEED`** avec une valeur différente (ex. : A met `300`, B met `150`), commite et pousse. Chacun ouvre une Pull Request.

    Le responsable fusionne la Pull Request de A. Celle de B est maintenant en conflit.

    **Étape 3 : résolvez le conflit dans VS Code.** B (Godot fermé) :

    ```bash
    git switch feature/vitesse-b
    git merge main
    ```

    Ouvrez `shared/config.gd` dans VS Code. Git a inséré des marqueurs :

    ```gdscript
    <<<<<<< HEAD
    const PLAYER_SPEED = 150
    =======
    const PLAYER_SPEED = 300
    >>>>>>> main
    ```

    - Entre `<<<<<<<` et `=======` : **votre** version.
    - Entre `=======` et `>>>>>>>` : la version de **`main`**.

    1. Discutez avec A pour décider de la bonne valeur. Gardez l'une, l'autre ou une troisième (ex. : `250`).
    2. Supprimez les trois lignes de marqueurs (`<<<<<<<`, `=======`, `>>>>>>>`) et gardez **une seule** ligne `PLAYER_SPEED`.
    3. Enregistrez, puis terminez la fusion :

        ```bash
        git add shared/config.gd
        git commit
        git push
        ```

    !!! tip "Dans VS Code"
        VS Code affiche des boutons au-dessus du conflit : **Accept Current Change**, **Accept Incoming Change**, **Accept Both Changes**. Ils font la même chose que l'édition manuelle. Vérifiez toujours que les marqueurs ont disparu avant de commiter.

### 7. Bonnes pratiques de game jam

- **Étiquette de sauvegarde** avant la remise : `git tag v1.0-jam`.
- **Testez un clone frais** du dépôt avant la fin pour vous assurer que le projet s'ouvre.
- N'utilisez **jamais** `git push --force` sur `main`.
- Ne commitez pas les fichiers temporaires ni les exports.
- Le responsable peut modifier `Main.tscn` avec des boutons pour charger les scènes de test de chaque membre. Cela permet de vérifier rapidement que tout fonctionne.

!!! example "Pratique 8 : vérification finale"
    Cochez chaque point avant de terminer :

    - [ ] Toutes les Pull Requests sont fusionnées dans `main`.
    - [ ] Chaque dossier de fonctionnalité est présent dans `main` sur GitHub.
    - [ ] Aucun dossier `.godot/` n'est suivi par Git.
    - [ ] `Main.tscn` contient la scène de chaque membre et se lance sans erreur.
    - [ ] Aucun fichier du dépôt ne contient les marqueurs `<<<<<<<`, `=======` ou `>>>>>>>`. Vérifiez avec `git grep -n "<<<<<<<"`.
    - [ ] Chaque membre peut expliquer la différence entre `--ours` et `--theirs`.
    - [ ] Un **clone frais** du dépôt (dans un autre dossier) s'ouvre dans Godot sans erreur.
    - [ ] Le responsable crée l'étiquette de remise : `git tag v1.0-jam`, puis `git push origin v1.0-jam`.

## Dépannage (troubleshooting)

Voir aussi la section « En cas de conflit sur un `.tscn` » plus haut.

### C'est quoi un `stash`?

Un `stash` est un **tiroir temporaire** : Git y range vos modifications non commitées et remet votre dossier de travail dans l'état du dernier commit. Vous pouvez ensuite changer de branche, faire un `pull`, puis **récupérer** vos modifications.

C'est utile quand vous voulez changer de contexte sans commiter du travail inachevé.

| Commande | Effet |
| --- | --- |
| `git stash push -m "message"` | Range les modifications dans le tiroir |
| `git stash list` | Liste le contenu du tiroir |
| `git stash pop` | Récupère les dernières modifications et les retire du tiroir |
| `git stash apply` | Les récupère, mais les garde dans le tiroir |
| `git stash drop` | Supprime la dernière entrée du tiroir |

!!! note
    Par défaut, `git stash` ne range que les fichiers **déjà suivis** par Git. Pour inclure les nouveaux fichiers (ex. : une nouvelle scène), ajoutez `-u` : `git stash push -u`.

### Problème : « Your local changes would be overwritten »

Symptôme : `git pull` ou `git switch` refuse de s'exécuter parce que des fichiers modifiés localement (souvent un `.tscn` réécrit par Godot) seraient écrasés.

```bash
# 1. Fermer Godot, puis ranger les modifications
git stash push -u -m "travail en cours"

# 2. Mettre à jour ou changer de branche
git pull --rebase origin main

# 3. Récupérer ses modifications
git stash pop
```

Si `git stash pop` signale un conflit, résolvez-le comme un conflit normal (voir plus haut). L'entrée reste alors dans le tiroir jusqu'à ce que vous la supprimiez avec `git stash drop`.

!!! tip "Modifications fantômes de Godot"
    Si les changements dans un fichier ne sont pas les vôtres (Godot a simplement réécrit la scène), vous pouvez les abandonner avec `git restore fichier.tscn` plutôt que de les ranger.

### Problème : `HEAD` détachée (*detached HEAD*)

Symptôme : Git affiche « You are in 'detached HEAD' state ». Cela arrive quand vous vous placez sur un commit ou une étiquette au lieu d'une branche (ex. : `git checkout a1b2c3d`). Les commits faits dans cet état n'appartiennent à **aucune branche** et peuvent être perdus.

Si vous avez des modifications en cours, voici comment les sauver :

```bash
# 1. Ranger le travail en cours
git stash push -u -m "travail en cours"

# 2. Revenir sur une vraie branche
git switch main
git pull

# 3. Créer votre branche de travail et récupérer le travail
git switch -c feature/ma-fonctionnalite
git stash pop
```

Si vous avez déjà fait des **commits** en `HEAD` détachée, créez une branche avant de partir, sinon ils seront perdus :

```bash
git switch -c feature/sauvetage
```

!!! warning
    Avant de quitter un état détaché avec des commits, créez toujours une branche. Utilisez `git reflog` pour retrouver un commit « perdu » si c'est trop tard.

---

## Et le graphiste?

Un graphiste qui ne programme pas n'a pas besoin de Godot. Il a besoin d'un **gabarit** : une entité modèle, déjà fonctionnelle, qui lui montre comment l'art est utilisé dans le jeu. Il garde la liberté de créer son propre style, ses dimensions et sa grille. Les programmeurs préparent le gabarit, puis adaptent la scène à l'art livré.

!!! note "Prérequis pour le graphiste"
    Il suit le [cours accéléré GitHub Desktop](../github_desktop_graphiste/index.md) avant le jam.

### 1. Un membre prépare l'entité modèle

Un programmeur de l'équipe crée, sur une branche `feature/gabarit-joueur` (ou `-ennemi`), une entité typique avec **un `AnimationPlayer`** et son dossier.

```
player/
  player.tscn          # CharacterBody2D + Sprite2D + AnimationPlayer + CollisionShape2D
  player.gd
  player_sprites.png   # feuille de sprites PLACEHOLDER (carrés colorés numérotés)
  test_player.tscn
```

Dans `player.tscn` :

- Un `Sprite2D` avec `player_sprites.png`, dont **`Hframes` et `Vframes`** correspondent à la grille de la feuille de sprites.
- Un `AnimationPlayer` avec des animations nommées de façon claire (ex. : `idle`, `walk`, `attack`, `hurt`, `death`). Chaque animation modifie la propriété `frame` du `Sprite2D`.
- Une feuille de sprites **placeholder** : cases de couleurs différentes avec le numéro de la case. Elle sert d'exemple au graphiste, pas de contrainte.
- Une scène de test `test_player.tscn` pour vérifier chaque animation avec **F6**.

Le programmeur fusionne cette branche dans `main` **avant** que le graphiste commence.

### 2. Le membre montre comment fonctionne l'`AnimationPlayer`

Une fois le gabarit prêt, le programmeur fait une **courte démonstration (5 à 10 minutes)** à l'équipe, en partage d'écran ou en personne. Le graphiste comprend ainsi comment son image est utilisée, et les autres membres pourront ajouter leurs propres animations.

À montrer, dans `player.tscn` :

1. **Le panneau Animation** (en bas de l'éditeur) : choisir une animation dans la liste déroulante (`idle`, `walk`, etc.).
2. **Les pistes** (*tracks*) : montrer la piste qui modifie la propriété `frame` du `Sprite2D`.
3. **Les clés** (*keyframes*) : à quel moment de la ligne du temps chaque image s'affiche. Déplacer une clé pour changer la vitesse.
4. **La durée et la boucle** : la longueur de l'animation et le bouton de bouclage (`idle` et `walk` bouclent, `attack` et `death` non).
5. **Lecture dans l'éditeur** : le bouton lecture, pour voir le résultat tout de suite.
6. **Créer une nouvelle animation** : bouton *Animation → Nouvelle*, nommer l'animation, ajouter une piste `frame`, insérer les clés.
7. **Déclencher l'animation par le code** :

    ```gdscript
    @onready var anim: AnimationPlayer = $AnimationPlayer

    func _physics_process(_delta: float) -> void:
        if velocity.length() > 0:
            anim.play("walk")
        else:
            anim.play("idle")
    ```

8. **Tester avec F6** dans `test_player.tscn`, pour confirmer que chaque animation joue correctement.

!!! tip "Pour le graphiste"
    L'idée à retenir : chaque animation affiche des cases de la feuille de sprites, dans un ordre précis. Si votre grille diffère du placeholder, dites-le au programmeur : il ajustera la scène.

### 3. Le graphiste livre son art

1. Il récupère `main` avec GitHub Desktop (**Pull origin**).
2. Il crée sa branche `art/joueur`.
3. Il ajoute sa feuille de sprites dans le dossier de l'entité (ex. : `player/`), en suivant le `snake_case` pour le nom.
4. Il fait un commit, pousse, puis ouvre une Pull Request.
5. Dans la Pull Request (ou sur Discord), il indique au programmeur :
    - la **taille d'une case** (ex. : 48 x 48 px) ;
    - le **nombre de colonnes et de lignes** de la feuille ;
    - **quelles cases** forment chaque animation (ex. : `walk` = ligne 2, 8 images).

### 4. Le programmeur adapte la scène

Le nombre d'images par animation et la taille des cases sont **enregistrés dans le `.tscn`** (`Hframes`, `Vframes`, clés de l'`AnimationPlayer`). Avant de fusionner, le programmeur :

1. Récupère la branche du graphiste.
2. Ouvre le projet dans Godot : Godot importe l'image et génère les fichiers `.import`.
3. Dans `player.tscn`, assigne la nouvelle texture au `Sprite2D` et ajuste `Hframes` et `Vframes`.
4. Ajuste les clés de chaque animation selon les indications du graphiste.
5. Lance `test_player.tscn` (**F6**) et vérifie chaque animation.
6. Commite la scène modifiée et les fichiers `.import`, puis fusionne.

!!! note "Le graphiste ne modifie pas les `.tscn`"
    Il fournit l'image et les informations. C'est le programmeur qui adapte la scène.

!!! tip "Pour gagner du temps pendant le jam"
    Faites un gabarit pour le joueur et un pour un ennemi **générique**, puis copiez le dossier ennemi pour chaque nouvel ennemi (`slime/`, `goblin/`). Si le graphiste garde la même grille d'une entité à l'autre, l'ajustement de la scène devient très rapide.

### Variante : livrer un dossier autonome

Si le graphiste est prêt à utiliser un peu de Godot, il peut construire lui-même le visuel de son entité (sprites + `AnimationPlayer`) dans un **petit projet Godot personnel**, puis livrer le **dossier complet**. Le programmeur n'a qu'à le copier dans le projet de l'équipe. C'est la voie la plus simple quand elle est possible : plus besoin de communiquer la grille ni d'ajuster les clés.

Cette variante fonctionne seulement si le dossier est **indépendant** :

- Il contient la scène visuelle (ex. : `slime_visual.tscn` avec `Node2D`, `Sprite2D` et `AnimationPlayer`), les images et tout ce dont la scène a besoin.
- Rien dans le dossier ne pointe vers l'extérieur : pas de ressource partagée, pas de script ou de thème venant d'un autre dossier du projet.
- Les noms de fichiers et de dossiers sont en `snake_case`.
- Pas de logique de jeu dans ce dossier : le **programmeur instancie** la scène visuelle dans la scène de l'entité (`slime.tscn`) et y attache son script. Il déclenche les animations avec `anim.play("walk")`, comme dans la démonstration.

Étapes :

1. Le graphiste crée un projet Godot personnel (hors du dépôt) et suit la démonstration de l'`AnimationPlayer`.
2. Il se met d'accord avec le programmeur sur les **noms d'animation** (ex. : `idle`, `walk`, `attack`).
3. Il copie le dossier fini dans le dépôt de l'équipe (même chemin `res://` voulu, ex. : `enemies/slime/`), sur sa branche `art/...`, puis ouvre une Pull Request.
4. Le programmeur ouvre le projet (Godot importe les fichiers et génère les `.import`), instancie la scène visuelle, teste avec F6, commite les `.import` et fusionne.

!!! warning "Pièges à éviter"
    - **Un dossier copié ne doit rien référencer hors de lui-même.** Si la scène charge une ressource de l'ancien projet, elle apparaîtra avec une erreur « dépendance manquante ».
    - **Ne copiez pas** le dossier `.godot/` du projet personnel.
    - **Même chemin des deux côtés** : Godot enregistre les chemins `res://`. Si le dossier est déplacé ou renommé après coup dans le dépôt, passez par Godot et prévenez l'équipe.
    - **Un seul propriétaire par dossier** : le graphiste ne livre qu'un dossier neuf, il ne modifie pas les fichiers existants des autres.
