# Faire un game jam en équipe avec Godot et Git

Pendant un game jam, le temps est limité : un conflit de fusion (*merge*) peut coûter des heures. Ce workflow vise à **éviter les conflits plutôt que de les résoudre**.

## Préparation générale

### 1. Préparation (avant le jam)

- Avoir un compte sur GitHub.
    - On évite les autres services, car la plupart ont déjà un compte sur cette plateforme.
- Déterminer les rôles de chacun : qui fait quoi, qui est responsable de quoi.
    - Une personne doit s'occuper du projet principal et de la structure du dépôt.

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

### 3. Créer le projet de base

La personne en charge du projet crée un projet Godot vide.

- Ajouter un `Main.tscn` et un script `Main.gd`.
- Configurer les paramètres du projet (résolution, etc.).
- Commiter le projet vide dans Git.

!!! note "Export du projet"
    Informez-vous sur les règles d'exportation du projet dès le début. Par exemple, si vous exportez pour Windows, vous aurez besoin d'un fichier `.pck` et d'un exécutable `.exe`. Si vous exportez pour le web, vous aurez besoin d'un fichier `.html` et d'un fichier `.js`. Assurez-vous d'avoir un membre de l'équipe qui sait comment faire ces exports.

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

### 5. Communication

C'est la mesure la plus efficace contre les conflits.

- Annoncez dans le canal d'équipe (Discord) : « Je touche à `Level1.tscn` ».
- Utilisez un tableau simple type KanBan sur GitHub Projects avec le responsable de chaque tâche.
- Désignez une personne qui vérifie que `main` s'ouvre et se lance dans Godot après chaque fusion.

### 6. En cas de conflit sur un `.tscn`

1. Ne paniquez pas et évitez d'éditer le fichier à la main.
2. Choisissez une version complète :

    ```bash
    git checkout --ours fichier.tscn    # ou --theirs
    ```

3. Refaites dans Godot les ajouts perdus de l'autre version (c'est rapide si les scènes sont petites).
4. Pour les `.gd`, résolvez le conflit normalement dans VS Code.

### 7. Bonnes pratiques de game jam

- **Étiquette de sauvegarde** avant la remise : `git tag v1.0-jam`.
- **Testez un clone frais** du dépôt avant la fin pour vous assurer que le projet s'ouvre.
- N'utilisez **jamais** `git push --force` sur `main`.
- Ne commitez pas les fichiers temporaires ni les exports.

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

## Petite pratique en équipe

Dépendant de la taille de votre équipe, vous pouvez faire un petit exercice pour vous familiariser avec ce workflow.

Chaque équipe désigne un **responsable du projet**. Les autres membres sont des **développeurs**. Fermez Godot avant chaque opération Git (`pull`, `switch`, `merge`).

### Étape 1 : Créez un dépôt GitHub avec un projet vide

Le responsable du projet :

- Crée un dépôt GitHub vide.
- Crée un projet Godot vide dans ce dépôt.
- Ajoute et commite les fichiers `.gitignore` et `.gitattributes` (voir la section « Préparer le dépôt Git »).
- Invite les autres membres comme collaborateurs (*Settings → Collaborators*). Sans cet accès en écriture, leur `git push` sera refusé.

### Étape 2 : Créez une scène principale

Le responsable du projet :

- Crée une scène principale `Main.tscn` et configure le projet (résolution, etc.).
- Commite, puis pousse le projet sur la branche `main`.

Les autres membres acceptent l'invitation et attendent que ce push soit fait avant de passer à l'étape 3.

### Étape 3 : Créez une scène et une scène de test par personne

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
    Ces fichiers sont partagés. Dans cet exercice, personne d'autre que le responsable ne les modifie.

### Étape 4 : Fusionnez les branches dans `main`

1. Chaque membre ouvre une **Pull Request** sur GitHub pour fusionner sa branche dans `main`.
2. Le responsable du projet fusionne les Pull Requests **une à la fois**. Avant chaque fusion, il vérifie qu'elle ne touche que le dossier de son auteur.
3. Après chaque fusion, le responsable met à jour son `main` local et vérifie que `Main.tscn` s'ouvre et se lance :

    ```bash
    git switch main
    git pull
    ```

### Étape 5 : Récupérez les changements de `main` dans votre branche

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

### Étape 6 : Vérification finale

Cochez chaque point avant de terminer :

- [ ] Toutes les Pull Requests sont fusionnées dans `main`.
- [ ] Chaque dossier de fonctionnalité est présent dans `main` sur GitHub.
- [ ] Aucun dossier `.godot/` n'est suivi par Git.
- [ ] Un **clone frais** du dépôt (dans un autre dossier) s'ouvre dans Godot sans erreur.
- [ ] Le responsable crée l'étiquette de remise : `git tag v1.0-jam`, puis `git push origin v1.0-jam`.

---

## Petite pratique : provoquer et résoudre un conflit

Le premier exercice évite les conflits, comme le recommande le guide. Pendant un vrai jam, il y en aura quand même. Mieux vaut s'exercer **maintenant**, sans pression, à les résoudre.

Cet exercice se fait après le premier. Le dépôt contient déjà les scènes de chaque membre et `main` est à jour.

### Partie A : conflit sur `Main.tscn`

Le conflit le plus fréquent en jam : plusieurs personnes ajoutent leur scène dans `Main.tscn` en même temps.

#### Étape 1 : Tout le monde part du même point

Chaque membre (Godot fermé) :

```bash
git switch main
git pull
git switch -c feature/integration-joueur    # ou integration-ennemi, integration-niveau, etc.
```

!!! warning "Attendez le signal"
    Personne ne fusionne tant que **tous** les membres n'ont pas poussé leur branche à l'étape 2. C'est ce qui garantit le conflit.

#### Étape 2 : Chacun instancie sa scène dans `Main.tscn`

Chaque membre :

1. Ouvre `Main.tscn` dans Godot.
2. Ajoute sa scène comme enfant avec le bouton **Instancier une scène enfant** (ou `Ctrl+Maj+A`).
3. Enregistre, **ferme Godot**, puis commite et pousse :

    ```bash
    git add .
    git commit -m "Ajout de ma scène dans Main"
    git push -u origin feature/integration-joueur
    ```

4. Ouvre une Pull Request vers `main`.

#### Étape 3 : Fusionnez la première Pull Request

Le responsable fusionne **une seule** Pull Request. Les autres affichent maintenant le message *« This branch has conflicts that must be resolved »*. C'est normal : `main` a changé dans `Main.tscn` et leur branche aussi.

#### Étape 4 : Résolvez le conflit

Chaque membre dont la Pull Request est en conflit (Godot fermé) :

```bash
git switch feature/integration-ennemi
git merge main
```

Git affiche un message comme `CONFLICT (content): Merge conflict in Main.tscn`. Suivez la procédure de la section « En cas de conflit sur un `.tscn` » :

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

La Pull Request n'est plus en conflit. Le responsable la fusionne, puis le prochain membre recommence à l'étape 4 avec la version à jour de `main`.

!!! note "Pourquoi `--theirs` pour garder `main`?"
    Lors d'un `git merge main`, **`--ours`** désigne *votre* branche et **`--theirs`** désigne la branche que vous fusionnez, donc `main`. Lors d'un `git rebase`, c'est l'inverse. Dans le doute, ouvrez le fichier dans Godot pour vérifier ce que vous avez gardé.

!!! tip "Pourquoi refaire l'ajout plutôt que fusionner le fichier?"
    Un `.tscn` contient des identifiants générés par Godot (`id="1_abc12"`) et un compteur `load_steps`. Les fusionner à la main est risqué. Refaire un simple ajout dans Godot prend 10 secondes.

### Partie B : conflit dans un script `.gd`

Les scripts se fusionnent mieux, mais deux personnes qui modifient la **même ligne** provoquent quand même un conflit.

#### Étape 1 : Préparez un fichier partagé

Le responsable crée `shared/config.gd`, puis le commite et le pousse sur `main` :

```gdscript
extends Node

const GAME_TITLE = "Mon jeu"
const PLAYER_SPEED = 200
```

Les autres membres font `git switch main` puis `git pull`.

#### Étape 2 : Deux personnes modifient la même ligne

Choisissez deux membres, A et B. Chacun crée sa branche à partir de `main`, **modifie la ligne `PLAYER_SPEED`** avec une valeur différente (ex. : A met `300`, B met `150`), commite et pousse. Chacun ouvre une Pull Request.

Le responsable fusionne la Pull Request de A. Celle de B est maintenant en conflit.

#### Étape 3 : Résolvez le conflit dans VS Code

B (Godot fermé) :

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

### Liste de vérification

- [ ] Toutes les Pull Requests des parties A et B sont fusionnées.
- [ ] `Main.tscn` contient la scène de chaque membre et se lance sans erreur.
- [ ] Aucun fichier du dépôt ne contient les marqueurs `<<<<<<<`, `=======` ou `>>>>>>>`. Vérifiez avec :

    ```bash
    git grep -n "<<<<<<<"
    ```

- [ ] Chaque membre peut expliquer la différence entre `--ours` et `--theirs`.

