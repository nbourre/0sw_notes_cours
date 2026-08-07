# Les patrons de projet <!-- omit in toc -->

# Les templates

- Depuis la version 3.x, il y a un dossier « templates » dans « Documents/Processing ».
- On peut modifier le dossier dans les préférences.
- Ce dossier permet de créer un patron pour chaque mode de programmation de Processing.
- Lors de la création d’un nouveau projet, le contenu du projet sera déjà rempli avec du code par défaut ainsi que les classes qui y sont présentes.
- Chaque patron doit être dans un dossier nommé avec le nom du langage.
  - Par exemple « Java ».
- Dans chaque dossier, il devra y avoir un fichier nommé « sketch.pde ».
  - Ainsi templates/Java/sketch.pde.

---

# Exemple

<table style="border: none;">

<tr>
<td>

- Ci-contre est un exemple de patron que j’utilise pour mes projets.
- Sauvegardez ce fichier sous `documents/processing/templates/java/sketch.pde`.

</td>
<td>

```java
int currentTime;
int previousTime;
int deltaTime;

void setup() {
    size(800, 600);
    currentTime = millis();
    previousTime = millis();
}

void draw() {
    timeManagement();
    update(deltaTime);
    display();
}

void update(int delta) {
}

void display() {
}

void timeManagement() {
    currentTime = millis();
    deltaTime = currentTime - previousTime;
    previousTime = currentTime;
}
```

</td>
</tr>
</table>

---

# Exercices
- Dans notre cas, nous utiliserons Java, ainsi, créez un dossier « Java » dans « templates ».
- Ajoutez un fichier `sketch.pde`.
- Dans le fichier `sketch.pde`, collez le code qui est dans la section commentaire de cette diapo.
- Testez le patron en créant un nouveau projet Java.
- Ajoutez un objet abstrait nommé `GraphicObject` avec les propriétés et méthodes suivantes :
  - `PVector location`, `velocity` et `acceleration`.
  - `color fillColor`, `strokeColor` et `strokeWeight`.
  - Méthode abstraite `void update (float deltaTime)` et `display()`.
  - Cette classe servira à accélérer le développement d’objet graphique.
  - Sauvegardez `GraphicObject` dans le patron.
