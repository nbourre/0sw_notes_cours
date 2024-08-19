# Les nombres aléatoires <!-- omit in toc -->

# Table des matières <!-- omit in toc -->
- [Objectifs](#objectifs)
- [Introduction](#introduction)
- [Le marcheur aléatoire](#le-marcheur-aléatoire)

# Objectifs
- Comprendre les bases des nombres aléatoires
- Les différents types de distributions
- Le bruit

# Introduction
Un ordinateur est une machine déterministe. Cela signifie que si vous lui donnez les mêmes données d'entrée, il donnera toujours la même sortie. Ainsi, il ne peut pas générer de nombres aléatoires. Cela peut être un problème si vous voulez simuler des phénomènes aléatoires. Pour cela, on utilise des générateurs de nombres aléatoires.

Ces nombres sont générés à partir d'une graine (**seed**) qui est un nombre initial. Si vous utilisez la même graine, vous obtiendrez les mêmes nombres aléatoires. Cela peut être utile pour déboguer un programme.

# Le marcheur aléatoire
Un exemple classique de simulation aléatoire est le marcheur aléatoire. Un marcheur aléatoire est un objet qui se déplace aléatoirement dans un espace. Il peut se déplacer dans n'importe quelle direction avec une probabilité égale. Cela peut être utilisé pour simuler la diffusion de particules dans un fluide.


Voici un tableau avec un exemple Processing et Godot-C#  pour simuler un marcheur aléatoire.

<table>
    <tr>
        <th>Processing</th>
        <th>GDScript</th>
    </tr>
    <tr style="vertical-align:top;">
        <td>

```java
int x = 0;
int y = 0;
int step = 2;

void setup() {
  size(400, 400);
  background(255);

  x = width / 2;
  y = height / 2;
}

void draw() {  
    int r = int(random(4));

    if (r == 0) {
        x += step;
    } else if (r == 1) {
        x -= step;
    } else if (r == 2) {
        y += step;
    } else {
        y -= step;
    }
}
```

</td>

<td>

```csharp
using Godot;
using Godot.Collections;
using System;
using System.Collections;
using System.Linq;

public partial class World : Node2D
{
	Vector2 windowSize;
	Array<Vector2> points = new Array<Vector2>();
	Vector2 startPoint;
	int stepLength = 2;

	public override void _Ready()
	{
		GD.Randomize();
		windowSize = GetViewport().GetVisibleRect().Size;

		startPoint = new Vector2(windowSize.X / 2, windowSize.Y / 2);
		points.Add(startPoint);
	}

	public override void _Process(double delta)
	{
		int direction = (int)GD.RandRange(0, 100);
		Vector2 nextPoint = new Vector2(0, 0);

		if (direction < 25)
		{
			nextPoint = new Vector2(startPoint.X + stepLength, startPoint.Y);
		}
		else if (direction < 50)
		{
			nextPoint = new Vector2(startPoint.X - stepLength, startPoint.Y);
		}
		else if (direction < 75)
		{
			nextPoint = new Vector2(startPoint.X, startPoint.Y + stepLength);
		}
		else
		{
			nextPoint = new Vector2(startPoint.X, startPoint.Y - stepLength);
		}		

		points.Add(nextPoint);

		startPoint = nextPoint;

		QueueRedraw();
	}

    // Ceci est appelé uniquement lorsque le nœud est ajouté à la scène.
	// Pour retracer le nœud, vous devez appeler QueueRedraw() ou update().
    public override void _Draw()
    {
		
		DrawLine(new Vector2(0.0f, 0.0f), windowSize, Colors.Green, 1.0f);
    	DrawLine(new Vector2(windowSize.X, 0f), new Vector2(0f, windowSize.Y), Colors.Green, 2.0f);
    	DrawLine(new Vector2(windowSize.X / 2, 0.0f), new Vector2(windowSize.X / 2, windowSize.Y), Colors.Green, 3.0f);

		if (points.Count > 1)
		{
			DrawPolyline(points.ToArray(), Colors.Red, 2f);
			DrawCircle(points[points.Count - 1], 4.0f, Colors.White);
		}
        base._Draw();
    }
}
```

</td>
</tr>
</table>

