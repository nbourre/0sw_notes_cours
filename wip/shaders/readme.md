<<<<<<< HEAD
# Les shaders en Godot <!-- omit in toc -->

- [Introduction](#introduction)
- [Les shaders dans Godot](#les-shaders-dans-godot)
  - [Projet de base](#projet-de-base)
  - [Créer un shader](#créer-un-shader)
  - [Écrire le code GLSL](#écrire-le-code-glsl)
    - [Exemple simple](#exemple-simple)
  - [Utiliser des variables](#utiliser-des-variables)
  - [Pixel avec une texture](#pixel-avec-une-texture)
    - [Variable `UV`](#variable-uv)
    - [Variable `TEXTURE`](#variable-texture)
    - [Exemple](#exemple)
- [Rendre public des paramètres du shader](#rendre-public-des-paramètres-du-shader)
  - [Le mot clé `uniform`](#le-mot-clé-uniform)
- [Utiliser le shader dans un jeu](#utiliser-le-shader-dans-un-jeu)
  - [Sauvegarder le shader](#sauvegarder-le-shader)
  - [Appliquer le shader sur un objet](#appliquer-le-shader-sur-un-objet)
  - [Utiliser le shader dans un script](#utiliser-le-shader-dans-un-script)
    - [Autres exemples](#autres-exemples)
- [Conclusion](#conclusion)
- [Références](#références)

# Introduction
- Les shaders sont des programmes qui permettent de dessiner des objets dans un moteur de jeu.
- Ils sont utilisés pour les effets de lumière, les ombres, les textures, les effets de particules, etc.
- Les shaders sont écrits en GLSL (OpenGL Shading Language), un langage de programmation bas niveau.
- Le code est compilé pour la carte graphique et exécuté sur le GPU (Graphics Processing Unit).
- Les shaders sont écrits dans un fichier texte avec l'extension `.glsl` ou `.shader`
  - Godot sauvegarde avec l'extension `.gdshader` pour les shaders écrits dans l'éditeur de code.
- Les shaders sont utilisés dans Godot pour les matériaux, les post-process, les effets de particules, etc.

> **Note**
> 
> Étant donné que les shaders sont écrits en GLSL, il est possible, avec quelques conversions, d'utiliser des shaders dans d'autres moteurs de jeu. Par exemple, les shaders peuvent être utilisés dans Unity, Unreal Engine, etc.

# Les shaders dans Godot
Dans cet article, nous allons voir comment créer et utiliser un shader 2D dans Godot. On va faire clignoter une texture. Ce shader pourra être réutilisé, par exemple pour faire clignoter un ennemi ou un joueur qui se fait toucher ou encore pour d'autres effets.

## Projet de base
Étant donné que le code GLSL est identique pour tous les projets, vous pouvez prendre le projet de votre choix ou encore démarrer un projet vide pour suivre la démonstration.

**Note :** L'exemple pourra s'appliquer à facilement à votre projet de session. 

Dans le projet, vous devez avoir un sprite avec une texture. Comme indiquer précédemment, j'utilise le projet vide de Godot, j'ai pris le sprite `Icon` que j'ai mis directement dans la scène.

![](../assets/shader_tutorial_01.gif)

## Créer un shader
Pour créer un nouveau shader, vous pouvez suivre les étapes suivantes:

1. Sélectionnez le noeud `Sprite`
2. Dans l'inspecteur, sélectionnez le menu déroulant `Material`
3. Cliquez sur le bouton `New ShaderMaterial`
   - Une sphère apparait dans l'inspecteur
   - Un nouveau noeud `ShaderMaterial` est créé dans la hiérarchie
   ![](../assets/shader_tutorial_02.gif)
4. Cliquez `Material` dans l'inspecteur
5. Créez un nouveau `Shader` pour la propriété du même nom
6. Cliquez sur `Shader` une seconde fois pour développer l'éditeur de shader
   ![](../assets/shader_tutorial_03.gif)

## Écrire le code GLSL
Le langage GLSL est basé sur le C. Il est donc possible d'utiliser des variables, des fonctions, des boucles, des conditions, etc.

Comme j'en ai fait part, nous allons programmer un shader relativement simple. Nous allons travailler sur les pixels directement.

La première étape sera de déterminer le type de shader que nous allons utiliser. Dans notre cas, nous allons utiliser un shader 2D. La première ligne de code doit définir le type de shader avec la syntaxe suivante.

```glsl
shader_type <type>;
```

Les types valides sont les suivants:
- spatial : pour le rendu 3D
- canvas_item : pour le rendu 2D
- particles : pour les systèmes de particules

Nous allons donc utiliser le type `shader_type canvas_item;`.

```glsl
shader_type canvas_item; // Première ligne de code
```

Ensuite, il faudra utiliser la fonction de shader qui sera utilisée. Dans notre cas, nous allons utiliser la fonction `fragment`. Cette fonction est appelée pour chaque pixel du sprite. Ainsi, nous allons donc pouvoir modifier les pixels directement. Elle permet de déterminer la couleur que le pixel doit avoir.

```glsl
shader_type canvas_item;

void fragment() {
  // Code du shader
}
```

> **Note**
>
> Si le sprite a une dimension de 1920x1080, la fonction `fragment` sera appelée 2 073 600 fois!

### Exemple simple

La variable `COLOR` contient la couleur du pixel et est de type `vec4` soit un vecteur de 4 valeurs. La première valeur est le rouge, la deuxième le vert, la troisième le bleu et la quatrième l'alpha (transparence). Les valeurs sont comprises **entre 0 et 1**.

Assignons la valeur 1 à tous les composantes de `COLOR` pour obtenir un pixel blanc.

```glsl
shader_type canvas_item;

void fragment() {
  COLOR = vec4(1, 1, 1, 1);
}
```
Sauvegardez et observez le résultat en direct dans la scène.

![](../assets/shader_tutorial_04.gif)

- Testez en modifiant la valeur de `COLOR` pour obtenir un pixel rouge ou dans une autre couleur
- Testez en modifiant la transparence

![](../assets/shader_tutorial_05.gif)

## Utiliser des variables
Pour être un peu plus efficace, on peut sauvegarder la valeur dans une variable.

![](../assets/shader_tutorial_06.gif)

## Pixel avec une texture
On remarque que la couleur change pour l'ensemble des pixels. Ce n'est généralement pas ce que l'on désire. On peut donc utiliser une texture pour déterminer la couleur du pixel. Pour ce faire, on va utiliser les variables `COLOR`, `UV` et `TEXTURE`.

### Variable `UV`
La variable `UV` contient les coordonnées du pixel. Il s'agit d'un type `vec2`. La première valeur est la coordonnée horizontale et la deuxième la coordonnée verticale. Les valeurs sont comprises **entre 0 et 1**.

![](../assets/shader_iconuv.webp)

Exemple  
```glsl
void fragment() {
  // À chaque pixel, on met la composante bleue à 0.5
  COLOR = vec4(UV, 0.5, 1.0);
}
```
![](../assets/shader_tutorial_07.gif)

### Variable `TEXTURE`
La variable `TEXTURE` contient la texture du sprite. On peut donc utiliser la fonction `texture` pour obtenir la couleur du pixel à partir de la texture.

Exemple
```glsl
void fragment() {
  COLOR = texture(TEXTURE, UV);
  COLOR.b = 1.0; // On met la composante bleue à 1.0
}
```
Vous remarquez que l'on peut modifier la couleur du pixel en utilisant les composantes de `COLOR`. Les composantes sont les valeurs suivantes: `r` pour le rouge, `g` pour le vert, `b` pour le bleu et `a` pour l'alpha. Il y a aussi la composante `rgb` qui contient les trois composantes précédentes.

### Exemple
Nous allons maintenant utiliser une texture pour déterminer la couleur du pixel. Pour ce faire, nous allons utiliser la fonction `texture` et la variable `TEXTURE`.

```glsl
void fragment() {
  vec4 color = texture(TEXTURE, UV); // Récupère la texture du pixel à la position UV
  color.rgb = mix(color.rgb, vec3(1, 1, 1).rgb, 1); // On met la couleur à blanc 
  COLOR = color;
}
```
Vous avez remarqué la fonction `mix`? Cette fonction permet de mélanger deux couleurs. Le premier paramètre est la première couleur, le second est la 2e couleur et la troisième valeur est le pourcentage de mélange de la 2e couleur sur la 1ère. Ici, on met la valeur à 1 pour appliquer 100% de la 2e couleur.

![](../assets/shader_tutorial_08.gif)

# Rendre public des paramètres du shader
Maintenant que l'on connaît les bases du shader, il est temps de rendre public des paramètres du shader. Cela permettra de modifier les paramètres du shader dans Godot (ou tout autre moteur de jeu).

## Le mot clé `uniform`
Le mot clé `uniform` permet de rendre public un paramètre du shader. Il faut donc utiliser ce mot clé pour pouvoir modifier les paramètres du shader dans Godot.

Syntaxe
```glsl
uniform <type> <nom> [:indice] [= <valeur par défaut>];
```

Le `<nom>` est le nom qui sera affiché dans Godot. Le `<type>` est le type de la variable. Il peut s'agir d'un type prédéfini ou d'un type défini par l'utilisateur. Le `= <valeur par défaut>` est optionnel et permet de définir une valeur par défaut pour le paramètre.

Le `:indice` est optionnel et permet d'indiquer à l'inspecteur Godot quel sera l'utilisation du paramètre. Il peut s'agir d'un indice de texture, de couleur, de vecteur, etc.

Voici des exemples d'indice

| Type | Indice | Description |
| --- | --- | --- |
| vec4 | 	hint_color |	Used as color|
|int, float| 	hint_range(min,max [,step] )| 	Used as range (with min/max/step)|


Exemple
```glsl
shader_type canvas_item;

uniform vec4 flash_color : hint_color = vec4(1.0);

void fragment() {
  vec4 color = texture(TEXTURE, UV);
  color.rgb = mix(color.rgb, flash_color.rgb, 1);
  COLOR = color;
}
```

Nous avons maintenant accès à un paramètre `Flash color` dans l'inspecteur de Godot.

![](../assets/shader_tutorial_09.gif)

Exemple 2
```glsl
uniform vec4 flash_color : hint_color = vec4(1.0);
uniform float flash_modifer : hint_range(0.0, 1.0) = 1.0;

void fragment() {
  vec4 color = texture(TEXTURE, UV);
  color.rgb = mix(color.rgb, flash_color.rgb, flash_modifer);
  COLOR = color;
}
```

# Utiliser le shader dans un jeu
Pour exploiter un shader à son plein potentiel, il faut l'utiliser dans un jeu.

## Sauvegarder le shader
Dans l'inspecteur à la propriété `Shader`, cliquez la petite flèche au bout de `Shader`. Sélectionnez `Save` et sauvegardez le shader dans un fichier `.shader` ou `.gdshader`.

![](../assets/shader_tutorial_10_saving.gif)

Une fois sauvegardé, on peut appliquer le shader sur plusieurs objets.

## Appliquer le shader sur un objet
Pour appliquer le shader sur un objet, il faut sélectionner l'objet et dans l'inspecteur, sélectionner le shader dans la propriété `Shader` et cliquer sur `Load`.

> **Important**
> 
> Dans le bloc `Resource`, il faut cocher `Local to Scene` pour que le shader ne soit appliquer qu'à l'objet actuel. Autrement, aussitôt que l'on activera le shader, il sera appliqué à tous les objets qui utilisent le même shader en simultané.

![](../assets/shader_tutorial_11_localToScene.gif)

## Utiliser le shader dans un script
Dans la scène où j'utilise le shader, j'ai ajouté un noeud `Timer` qui dure 0.1 seconde.

La première étape consiste à se créer des références pour utiliser le `Sprite`, le `Timer` et le `Shader`.

```gdscript	
Sprite sprite;
Timer flashTimer;
ShaderMaterial shader;

public override void _Ready()
{
    sprite = GetNode<Sprite>("Icon");    
    flashTimer = GetNode<Timer>("FlashTimer");                        
    shader = sprite.Material as ShaderMaterial;
}
```

Ensuite, je crée une fonction `flash` qui va modifier le paramètre `flash_modifier` et démarrer `flashTimer`.

```gdscript
private void flash() {
    GD.Print("Flash");
    shader.SetShaderParam("flash_modifier", 1);
    flashTimer.Start();
}
```

Dans la méthode associée au signal `Timeout`, je vais modifier la propriété `flash_modifer` du shader pour la mettre à 0 et aussi arrêter le timer.

```gdscript
public void onTimerTimeout()
{
    GD.Print("Timer timeout");
    shader.SetShaderParam("flash_modifier", 0);
    flashTimer.Stop();
}
```

Enfin pour tester mon shader, je vais l'activer lorsque j'appuie sur la touche `Espace`.

```gdscript
public override void _Process(float delta)
{
    if (Input.IsActionJustPressed("ui_select"))
    {
        flash();
    }
}
```

Voici le résultat

![](../assets/shader_tutorial_12_final.gif)

### Autres exemples
![](../assets/shader_tutorial_13_exA.gif)

![](../assets/shader_tutorial_13_exB.gif)

![](../assets/shader_tutorial_13_exC.gif)

# Conclusion
Une fois que les bases sont apprises, les `shaders` ne sont pas si compliqué. Il faut juste prendre le temps de comprendre comment ils fonctionnent et de les tester.

Il y a plusieurs ressources gratuites de disponibles sur [GodotShaders.com](https://godotshaders.com/) que vous pouvez réutiliser dans vos jeux.


# Références
- [Your first 2D shader](https://docs.godotengine.org/en/stable/tutorials/shaders/your_first_shader/your_first_2d_shader.html)
- [Shading Language](https://docs.godotengine.org/en/3.0/tutorials/shading/shading_language.html) (GLSL) - OpenGL Wiki
- [Godot Shader Tutorial](https://www.youtube.com/watch?v=ctevHwoRl24)
- [The book of shaders](https://thebookofshaders.com/)
=======
# Les shaders en Godot <!-- omit in toc -->

- [Introduction](#introduction)
- [Les shaders dans Godot](#les-shaders-dans-godot)
  - [Projet de base](#projet-de-base)
  - [Créer un shader](#créer-un-shader)
  - [Écrire le code GLSL](#écrire-le-code-glsl)
    - [Exemple simple](#exemple-simple)
  - [Utiliser des variables](#utiliser-des-variables)
  - [Pixel avec une texture](#pixel-avec-une-texture)
    - [Variable `UV`](#variable-uv)
    - [Variable `TEXTURE`](#variable-texture)
    - [Exemple](#exemple)
- [Rendre public des paramètres du shader](#rendre-public-des-paramètres-du-shader)
  - [Le mot clé `uniform`](#le-mot-clé-uniform)
- [Utiliser le shader dans un jeu](#utiliser-le-shader-dans-un-jeu)
  - [Sauvegarder le shader](#sauvegarder-le-shader)
  - [Appliquer le shader sur un objet](#appliquer-le-shader-sur-un-objet)
  - [Utiliser le shader dans un script](#utiliser-le-shader-dans-un-script)
    - [Autres exemples](#autres-exemples)
- [Conclusion](#conclusion)
- [Références](#références)

# Introduction
- Les shaders sont des programmes qui permettent de dessiner des objets dans un moteur de jeu.
- Ils sont utilisés pour les effets de lumière, les ombres, les textures, les effets de particules, etc.
- Les shaders sont écrits en GLSL (OpenGL Shading Language), un langage de programmation bas niveau.
- Le code est compilé pour la carte graphique et exécuté sur le GPU (Graphics Processing Unit).
- Les shaders sont écrits dans un fichier texte avec l'extension `.glsl` ou `.shader`
  - Godot sauvegarde avec l'extension `.gdshader` pour les shaders écrits dans l'éditeur de code.
- Les shaders sont utilisés dans Godot pour les matériaux, les post-process, les effets de particules, etc.

> **Note**
> 
> Étant donné que les shaders sont écrits en GLSL, il est possible, avec quelques conversions, d'utiliser des shaders dans d'autres moteurs de jeu. Par exemple, les shaders peuvent être utilisés dans Unity, Unreal Engine, etc.

# Les shaders dans Godot
Dans cet article, nous allons voir comment créer et utiliser un shader 2D dans Godot. On va faire clignoter une texture. Ce shader pourra être réutilisé, par exemple pour faire clignoter un ennemi ou un joueur qui se fait toucher ou encore pour d'autres effets.

## Projet de base
Étant donné que le code GLSL est identique pour tous les projets, vous pouvez prendre le projet de votre choix ou encore démarrer un projet vide pour suivre la démonstration.

**Note :** L'exemple pourra s'appliquer à facilement à votre projet de session. 

Dans le projet, vous devez avoir un sprite avec une texture. Comme indiquer précédemment, j'utilise le projet vide de Godot, j'ai pris le sprite `Icon` que j'ai mis directement dans la scène.

![](../assets/shader_tutorial_01.gif)

## Créer un shader
Pour créer un nouveau shader, vous pouvez suivre les étapes suivantes:

1. Sélectionnez le noeud `Sprite`
2. Dans l'inspecteur, sélectionnez le menu déroulant `Material`
3. Cliquez sur le bouton `New ShaderMaterial`
   - Une sphère apparait dans l'inspecteur
   - Un nouveau noeud `ShaderMaterial` est créé dans la hiérarchie
   ![](../assets/shader_tutorial_02.gif)
4. Cliquez `Material` dans l'inspecteur
5. Créez un nouveau `Shader` pour la propriété du même nom
6. Cliquez sur `Shader` une seconde fois pour développer l'éditeur de shader

![](../assets/shader_tutorial_03.gif)

## Écrire le code GLSL
Le langage GLSL est basé sur le C. Il est donc possible d'utiliser des variables, des fonctions, des boucles, des conditions, etc.

Comme j'en ai fait part, nous allons programmer un shader relativement simple. Nous allons travailler sur les pixels directement.

La première étape sera de déterminer le type de shader que nous allons utiliser. Dans notre cas, nous allons utiliser un shader 2D. La première ligne de code doit définir le type de shader avec la syntaxe suivante.

```glsl
shader_type <type>;
```

Les types valides sont les suivants:
- spatial : pour le rendu 3D
- canvas_item : pour le rendu 2D
- particles : pour les systèmes de particules

Nous allons donc utiliser le type `shader_type canvas_item;`.

```glsl
shader_type canvas_item; // Première ligne de code
```

Ensuite, il faudra utiliser la fonction de shader qui sera utilisée. Dans notre cas, nous allons utiliser la fonction `fragment`. Cette fonction est appelée pour chaque pixel du sprite. Ainsi, nous allons donc pouvoir modifier les pixels directement. Elle permet de déterminer la couleur que le pixel doit avoir.

```glsl
shader_type canvas_item;

void fragment() {
  // Code du shader
}
```

> **Note**
>
> Si le sprite a une dimension de 1920x1080, la fonction `fragment` sera appelée 2 073 600 fois!

### Exemple simple

La variable `COLOR` contient la couleur du pixel et est de type `vec4` soit un vecteur de 4 valeurs. La première valeur est le rouge, la deuxième le vert, la troisième le bleu et la quatrième l'alpha (transparence). Les valeurs sont comprises **entre 0 et 1**.

Assignons la valeur 1 à tous les composantes de `COLOR` pour obtenir un pixel blanc.

```glsl
shader_type canvas_item;

void fragment() {
  COLOR = vec4(1, 1, 1, 1);
}
```
Sauvegardez et observez le résultat en direct dans la scène.

![](../assets/shader_tutorial_04.gif)

- Testez en modifiant la valeur de `COLOR` pour obtenir un pixel rouge ou dans une autre couleur
- Testez en modifiant la transparence

![](../assets/shader_tutorial_05.gif)

## Utiliser des variables
Pour être un peu plus efficace, on peut sauvegarder la valeur dans une variable.

![](../assets/shader_tutorial_06.gif)

## Pixel avec une texture
On remarque que la couleur change pour l'ensemble des pixels. Ce n'est généralement pas ce que l'on désire. On peut donc utiliser une texture pour déterminer la couleur du pixel. Pour ce faire, on va utiliser les variables `COLOR`, `UV` et `TEXTURE`.

### Variable `UV`
La variable `UV` contient les coordonnées du pixel. Il s'agit d'un type `vec2`. La première valeur est la coordonnée horizontale et la deuxième la coordonnée verticale. Les valeurs sont comprises **entre 0 et 1**.

![](../assets/shader_iconuv.webp)

Exemple  
```glsl
void fragment() {
  // À chaque pixel, on met la composante bleue à 0.5
  COLOR = vec4(UV, 0.5, 1.0);
}
```
![](../assets/shader_tutorial_07.gif)

### Variable `TEXTURE`
La variable `TEXTURE` contient la texture du sprite. On peut donc utiliser la fonction `texture` pour obtenir la couleur du pixel à partir de la texture.

Exemple
```glsl
void fragment() {
  COLOR = texture(TEXTURE, UV);
  COLOR.b = 1.0; // On met la composante bleue à 1.0
}
```
Vous remarquez que l'on peut modifier la couleur du pixel en utilisant les composantes de `COLOR`. Les composantes sont les valeurs suivantes: `r` pour le rouge, `g` pour le vert, `b` pour le bleu et `a` pour l'alpha. Il y a aussi la composante `rgb` qui contient les trois composantes précédentes.

### Exemple
Nous allons maintenant utiliser une texture pour déterminer la couleur du pixel. Pour ce faire, nous allons utiliser la fonction `texture` et la variable `TEXTURE`.

```glsl
void fragment() {
  vec4 color = texture(TEXTURE, UV); // Récupère la texture du pixel à la position UV
  color.rgb = mix(color.rgb, vec3(1, 1, 1).rgb, 1); // On met la couleur à blanc 
  COLOR = color;
}
```
Vous avez remarqué la fonction `mix`? Cette fonction permet de mélanger deux couleurs. Le premier paramètre est la première couleur, le second est la 2e couleur et la troisième valeur est le pourcentage de mélange de la 2e couleur sur la 1ère. Ici, on met la valeur à 1 pour appliquer 100% de la 2e couleur.

![](../assets/shader_tutorial_08.gif)

# Rendre public des paramètres du shader
Maintenant que l'on connaît les bases du shader, il est temps de rendre public des paramètres du shader. Cela permettra de modifier les paramètres du shader dans Godot (ou tout autre moteur de jeu).

## Le mot clé `uniform`
Le mot clé `uniform` permet de rendre public un paramètre du shader. Il faut donc utiliser ce mot clé pour pouvoir modifier les paramètres du shader dans Godot.

Syntaxe
```glsl
uniform <type> <nom> [:indice] [= <valeur par défaut>];
```

Le `<nom>` est le nom qui sera affiché dans Godot. Le `<type>` est le type de la variable. Il peut s'agir d'un type prédéfini ou d'un type défini par l'utilisateur. Le `= <valeur par défaut>` est optionnel et permet de définir une valeur par défaut pour le paramètre.

Le `:indice` est optionnel et permet d'indiquer à l'inspecteur Godot quel sera l'utilisation du paramètre. Il peut s'agir d'un indice de texture, de couleur, de vecteur, etc.

Voici des exemples d'indice

| Type | Indice | Description |
| --- | --- | --- |
| vec4 | 	hint_color |	Used as color|
|int, float| 	hint_range(min,max [,step] )| 	Used as range (with min/max/step)|


Exemple
```glsl
shader_type canvas_item;

uniform vec4 flash_color : hint_color = vec4(1.0);

void fragment() {
  vec4 color = texture(TEXTURE, UV);
  color.rgb = mix(color.rgb, flash_color.rgb, 1);
  COLOR = color;
}
```

Nous avons maintenant accès à un paramètre `Flash color` dans l'inspecteur de Godot.

![](../assets/shader_tutorial_09.gif)

Exemple 2
```glsl
uniform vec4 flash_color : hint_color = vec4(1.0);
uniform float flash_modifier : hint_range(0.0, 1.0) = 1.0;

void fragment() {
  vec4 color = texture(TEXTURE, UV);
  color.rgb = mix(color.rgb, flash_color.rgb, flash_modifier);
  COLOR = color;
}
```

# Utiliser le shader dans un jeu
Pour exploiter un shader à son plein potentiel, il faut l'utiliser dans un jeu.

## Sauvegarder le shader
Dans l'inspecteur à la propriété `Shader`, cliquez la petite flèche au bout de `Shader`. Sélectionnez `Save` et sauvegardez le shader dans un fichier `.shader` ou `.gdshader`.

![](../assets/shader_tutorial_10_saving.gif)

Une fois sauvegardé, on peut appliquer le shader sur plusieurs objets.

## Appliquer le shader sur un objet
Pour appliquer le shader sur un objet, il faut sélectionner l'objet et dans l'inspecteur, sélectionner le shader dans la propriété `Shader` et cliquer sur `Load`.

> **Important**
> 
> Dans le bloc `Resource`, il faut cocher `Local to Scene` pour que le shader ne soit appliquer qu'à l'objet actuel. Autrement, aussitôt que l'on activera le shader, il sera appliqué à tous les objets qui utilisent le même shader en simultané.

![](../assets/shader_tutorial_11_localToScene.gif)

## Utiliser le shader dans un script
Dans la scène où j'utilise le shader, j'ai ajouté un noeud `Timer` qui dure 0.1 seconde.

La première étape consiste à se créer des références pour utiliser le `Sprite`, le `Timer` et le `Shader`.

```gdscript	
Sprite sprite;
Timer flashTimer;
ShaderMaterial shader;

public override void _Ready()
{
    sprite = GetNode<Sprite>("Icon");    
    flashTimer = GetNode<Timer>("FlashTimer");                        
    shader = sprite.Material as ShaderMaterial;
}
```

Ensuite, je crée une fonction `flash` qui va modifier le paramètre `flash_modifier` et démarrer `flashTimer`.

```gdscript
private void flash() {
    GD.Print("Flash");
    shader.SetShaderParam("flash_modifier", 1);
    flashTimer.Start();
}
```

Dans la méthode associée au signal `Timeout`, je vais modifier la propriété `flash_modifer` du shader pour la mettre à 0 et aussi arrêter le timer.

```gdscript
public void onTimerTimeout()
{
    GD.Print("Timer timeout");
    shader.SetShaderParam("flash_modifier", 0);
    flashTimer.Stop();
}
```

Enfin pour tester mon shader, je vais l'activer lorsque j'appuie sur la touche `Espace`.

```gdscript
public override void _Process(float delta)
{
    if (Input.IsActionJustPressed("ui_select"))
    {
        flash();
    }
}
```

Voici le résultat

![](../assets/shader_tutorial_12_final.gif)

### Autres exemples
![](../assets/shader_tutorial_13_exA.gif)

![](../assets/shader_tutorial_13_exB.gif)

![](../assets/shader_tutorial_13_exC.gif)

# Conclusion
Une fois que les bases sont apprises, les `shaders` ne sont pas si compliqué. Il faut juste prendre le temps de comprendre comment ils fonctionnent et de les tester.

Il y a plusieurs ressources gratuites de disponibles sur [GodotShaders.com](https://godotshaders.com/) que vous pouvez réutiliser dans vos jeux.


# Références
- [Your first 2D shader](https://docs.godotengine.org/en/stable/tutorials/shaders/your_first_shader/your_first_2d_shader.html)
- [Shading Language](https://docs.godotengine.org/en/3.0/tutorials/shading/shading_language.html) (GLSL) - OpenGL Wiki
- [Godot Shader Tutorial](https://www.youtube.com/watch?v=ctevHwoRl24)
- [The book of shaders](https://thebookofshaders.com/)
>>>>>>> 7e681f04e8ae6ad5eee4de911d9ef01291d7db84
