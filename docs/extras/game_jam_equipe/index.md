# Faire un game jam en équipe avec Godot et Git

Pendant un game jam, le temps est limité : un conflit de fusion (*merge*) peut coûter des heures. Ce workflow vise à **éviter les conflits plutôt que de les résoudre**.

## Préparation générale

### 1. Préparation (avant le jam)

- Avoir un compte sur GitHub.
    - On évite les autres services, car la plupart avez déjà un compte sur cette plateforme.
- Déterminer les rôles de chacun : qui fait quoi, qui est responsable de quoi.
    - Une personne doit s'ocupper du projet principal et de la structure du dépôt.

### 2. Préparer le dépôt Git

- **Un seul dépôt**. Par convention, personne ne pousse directement sur `main`.
- **`.gitignore` Godot** : ignorer `.godot/`, `export/` et les builds.
    - Voici un [fichier gitignore](https://www.toptal.com/developers/gitignore/api/visualstudiocode,python,venv,godot) que j'utilise pour Godot 4
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

```
player/
  player.tscn
  player.gd
  player_sprites.png
  test_player.tscn
enemies/
  slime/
    slime.tscn
    slime.gd
levels/
ui/
shared/        # polices, sons communs, tilesets, thème UI
```

- Chaque personne travaille dans son dossier, ce qui limite les conflits.
- Les ressources utilisées par plusieurs scènes vont dans `shared/`.
- Utilisez le `snake_case` pour les noms de fichiers (`player.tscn`) : Windows ignore la casse, mais pas Linux.

### 3. Une scène de test par personne

Chaque membre de l'équipe a sa propre scène de test, pour travailler sans dépendre du travail des autres.

- Placez-la à côté de la fonctionnalité (ex. : `player/test_player.tscn`).
- Elle instancie simplement la scène à tester, avec un sol et une caméra minimaux.
- Lancez-la avec **F6** (*Run Current Scene*). Gardez **F5** pour la scène principale du projet.
- Ne modifiez **pas** la scène principale dans `project.godot` pour tester : ce fichier est partagé.

!!! note
    Les tests isolés ne remplacent pas l'essai dans le vrai jeu. Vérifiez `Main.tscn` après chaque fusion.

### 4. Workflow quotidien (branches courtes)

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

Fusionnez ensuite dans `main` (Pull Request ou fusion rapide en équipe).

- **Branches courtes** (quelques heures, maximum une journée) et **fusionnées souvent**.
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
