# Déployer le jeu sur l'arcade <!-- omit in toc -->
Dans cette leçon, nous allons voir comment porter un jeu Godot sur l'arcade du département.

# Table des matières <!-- omit in toc -->
- [Modification au code](#modification-au-code)
  - [Les contrôles](#les-contrôles)
  - [Quitter le jeu](#quitter-le-jeu)
  - [Simuler la souris](#simuler-la-souris)
- [Exporter le jeu](#exporter-le-jeu)
  - [Télécharger le modèle d'exportation](#télécharger-le-modèle-dexportation)
  - [Exporter le jeu](#exporter-le-jeu-1)
  - [Copier le jeu sur l'arcade](#copier-le-jeu-sur-larcade)
    - [Redémarrer l'arcade](#redémarrer-larcade)

# Modification au code
Pour adapter le jeu à l'arcade, il faudra apporter quelques modifications au code.

## Les contrôles
L'arcade est équipée de deux joysticks et de 6 boutons. Il faudra adapter les contrôles du jeu en conséquence.

Voici un tableau du mapping des contrôles de l'arcade

| Contrôle | Valeur dans Godot |
|----------|-------------------|
| Axe X | `joy_axis_0` |
| Axe Y | `joy_axis_1` |
| Bouton A | `joy_button_0` |
| Bouton B | `joy_button_1` |
| Bouton X | `joy_button_2` |
| Bouton Y | `joy_button_3` |
| Bouton L1 | `joy_button_4` |
| Bouton R1 | `joy_button_5` |
| Bouton L2 | `joy_button_7` |
| Bouton R2 | `joy_button_6` |
| Bouton Select | `joy_button_8` |
| Bouton Start | `joy_button_9` |

**Attention!** Au moment d'écrire ces lignes, le joystick de droite est le principal.

## Quitter le jeu
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

## Simuler la souris
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

# Exporter le jeu

## Télécharger le modèle d'exportation
L'arcade fonctionne avec Linux. Il faudra exporter le jeu pour cette plateforme. La première étape est de télécharger le modèle d'exportation pour Linux.

1. Ouvrir le menu "Editor"
2. Ouvrir le menu "Export Template Manager"
3. Cliquer simplement sur "Download and install" pour télécharger le modèle d'exportation
4. Attendre la fin du téléchargement
5. Fermer la fenêtre

## Exporter le jeu
Une fois que le modèle d'exportation est installé, vous pouvez exporter le jeu.

1. Ouvrir le menu "Project"
2. Cliquer sur "Export..."
3. Donner un nom au projet
4. Cliquer sur "Export PCK/ZIP"
5. Donner l'extension `.pck` au fichier

## Copier le jeu sur l'arcade
Vous pouvez maintenant envoyer le fichier `.pck` sur l'arcade. Pour cela, vous pouvez utiliser un logiciel de transfert de fichier comme FileZilla ou autres client FTP.

- Utiliser le protocole `SFTP`.
- L'adresse de l'arcade est 172.22.215.250.
  - À partir du réseau étudiant
- Le nom d'utilisateur est `etd`.
- Le mot de passe est `etdshawi`.
- Téléverser le fichier `.pck` dans le répertoire `upload` de l'utilisateur `etd`.

À toutes les minutes, un script s'exécute pour vérifier la présence de nouveaux fichiers `.pck` dans le répertoire `/home/etd/ftp/upload`. Si un fichier est trouvé, il est automatiquement déplacé dans le répertoire des roms de Godot.

### Redémarrer l'arcade
Avec le SFTP, si vous téléversez un fichier nommé `restart.txt`, le script redémarrera `emulationstation` lorsqu'il le trouvera.
