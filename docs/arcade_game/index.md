# Déployer le jeu sur l'arcade <!-- omit in toc -->
Dans cette leçon, nous allons voir comment porter un jeu Godot sur l'arcade du département.


## Modification au code
Pour adapter le jeu à l'arcade, il faudra apporter quelques modifications au code.

### Les contrôles
L'arcade est équipée de deux joysticks et de 6 boutons. Il faudra adapter les contrôles du jeu en conséquence.

Voici un tableau du mapping des contrôles de l'arcade

| Button    | Godot < 4.5    | Godot 4.5       |
| --------- | -------------- | --------------- |
| Axe X     | `joy_axis_0`   | `joy_axis_0`    |
| Axe Y     | `joy_axis_1`   | `joy_axis_1`    |
| Bouton A  | `joy_button_0` | `joy_button_3`  |
| Bouton B  | `joy_button_1` | `joy_button_1`  |
| Bouton X  | `joy_button_2` | `joy_button_0`  |
| Bouton Y  | `joy_button_3` | `joy_button_2`  |
| Bouton L1 | `joy_button_4` | `joy_button_9`  |
| Bouton R1 | `joy_button_5` | `joy_button_10` |
| Bouton L2 | `joy_button_7` | `joy_axis_5`    |
| Bouton R2 | `joy_button_6` | `joy_axis_4`    |
| Select    | `joy_button_8` | `joy_button_4`  |
| Start     | `joy_button_9` | `joy_button_6`  |

**Attention!** Au moment d'écrire ces lignes, le joystick de droite est le principal.

### Quitter le jeu
Il faudra ajouter un moyen de quitter le jeu. L'arcade n'a pas de clavier, il faudra donc ajouter un mapping de bouton pour quitter le jeu.

- Ajouter un bouton `Hotkey` et attribuer la valeur `joy_button_9` à ce bouton.
- Ajouter un bouton `Quit` et attribuer la valeur `joy_button_8` à ce bouton. 

Ajouter les fonctions suivantes dans le script principal du jeu pour quitter le jeu.

```gd
func is_on_arcade() -> bool:
	return OS.get_executable_path().to_lower().contains("retropie")

func manage_end_game() -> void:
	if is_on_arcade() :
		if Input.is_action_pressed("hotkey") and Input.is_action_pressed("quit"):
			get_tree().quit()
	else :
		if Input.is_action_just_pressed("quit"):
			get_tree().quit()

func _process(delta: float) -> void:
    manage_end_game()
    # ...
```

### Simuler la souris
Si votre projet utilise la souris, il faudra simuler la souris avec les axes du joystick. Voici un exemple de code pour simuler la souris avec le joystick.

```gd
# TODO: À tester!
func _process(delta: float) -> void:
    var mouse_speed = 10
    var mouse_pos = get_viewport().get_mouse_position()
    var mouse_move = Vector2(0, 0)

    if Input.is_action_pressed("ui_right"):
        mouse_move.x += 1
    if Input.is_action_pressed("ui_left"):
        mouse_move.x -= 1
    if Input.is_action_pressed("ui_down"):
        mouse_move.y += 1
    if Input.is_action_pressed("ui_up"):
        mouse_move.y -= 1

    mouse_pos += mouse_move * mouse_speed
    get_viewport().warp_mouse_position(mouse_pos)
```

## Exporter le jeu

### Télécharger le modèle d'exportation
L'arcade fonctionne avec Linux. Il faudra exporter le jeu pour cette plateforme. La première étape est de télécharger le modèle d'exportation pour Linux.

1. Ouvrir le menu "Editor"
2. Ouvrir le menu "Export Template Manager"
3. Cliquer simplement sur "Download and install" pour télécharger le modèle d'exportation
4. Attendre la fin du téléchargement
5. Fermer la fenêtre

### Exporter le jeu
Une fois que le modèle d'exportation est installé, vous pouvez exporter le jeu.

1. Ouvrir le menu "Project"
2. Cliquer sur "Export..."
3. Donner un nom au projet
4. Cliquer sur "Export PCK/ZIP"
5. Indiquer l'emplacement où sauvegarder le fichier, le nom du fichier sera celui affiché dans l'arcade.
    - Si vous utilisez le SFTP, ajouter un préfixe au nom du fichier pour indiquer votre année et la session (ex: `A26_`).
6. Donner l'extension `.pck` (ou `.zip` si vous utilisez le dépôt web) au fichier

### Copier le jeu sur l'arcade
Deux méthodes permettent d'envoyer votre jeu sur l'arcade (depuis le réseau étudiant) :

#### Option 1 (recommandée) : Via le dépôt Web
1. Ouvrir [http://arcade.shawinigan.info/drop](http://arcade.shawinigan.info/drop) (ou cliquer sur le lien discret **« Déposer un jeu »** en bas à droite de [http://arcade.shawinigan.info/](http://arcade.shawinigan.info/)).
2. Entrer le mot de passe donné en classe (n'importe quel nom d'utilisateur est accepté, par exemple `etd`).
3. Sélectionner votre **cohorte** (ex. `A26`), saisir le **nom du jeu** (optionnel, déduit du fichier si vide) et glisser-déposer votre fichier **`.pck`** ou **`.zip`** (max 250 Mo).
4. Laisser cochée l'option **« Redémarrer EmulationStation après le dépôt »** puis cliquer sur **Envoyer sur la borne**.

#### Option 2 : Via SFTP
Vous pouvez aussi utiliser un logiciel de transfert de fichiers comme FileZilla ou un autre client SFTP :

- Utiliser le protocole `SFTP`.
- L'adresse de l'arcade est `172.22.213.71` (ou `arcade.shawinigan.info`).
    - À partir du réseau étudiant
- Le nom d'utilisateur est `etd`.
- Le mot de passe est `etdshawi`.
- Téléverser le fichier `.pck` (avec le préfixe de votre cohorte, ex. `A26_Mon_Jeu.pck`) dans le répertoire `upload` de l'utilisateur `etd`.
- *(Pour redémarrer EmulationStation via SFTP, téléversez un fichier vide nommé `restart.txt` dans le répertoire `upload`.)*

#### Traitement automatique sur la borne
À toutes les minutes, un script s'exécute sur l'arcade pour traiter les fichiers déposés dans `/home/etd/ftp/upload` :

- Le jeu est automatiquement rangé dans le sous-dossier de sa cohorte (ou dans `Z - Non classés` si aucun préfixe n'est détecté).
- La version de Godot requise par le `.pck` est vérifiée et installée automatiquement au besoin.
- Si `restart.txt` est présent (ou si la case de redémarrage a été cochée sur le web), `emulationstation` redémarre automatiquement.
