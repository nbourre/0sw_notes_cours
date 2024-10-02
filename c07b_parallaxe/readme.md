# La parallaxe <!-- omit in toc -->

- [Introduction](#introduction)
- [ParallaxBackground avec Godot](#parallaxbackground-avec-godot)
  - [ParallaxLayer](#parallaxlayer)
  - [Structure typique](#structure-typique)
- [Défilement automatique](#défilement-automatique)


# Introduction
- La parallaxe donne une impression de profondeur en faisant défiler plusieurs couches d’images à différentes vitesses, ce qui permet de simuler un monde 3D en 2D.
- On simule la parallaxe avec des images qui défilent à des vitesses variées
- Pour simplifier la compréhension, nous allons prendre un décor à deux couches
  - Disons `couche_0` pour le fond et `couche_1` pour le devant
- `couche_0` restera immobile, car celle-ci représentera du décor lointain tel que des montages ou encore des étoiles
- `couche_1` déroulera à une vitesse donnée, mais moins rapide que celle de la caméra disons 50%
- Lors du défilement, si l’on atteint la limite de la couche_1, on refera une affiche de celle-ci à partir de l’autre extrémité

![Alt text](assets/theory_live.gif)

# ParallaxBackground avec Godot

![Alt text](assets/Example.gif)

- Pour faire un effet parallaxe avec Godot, on peut utiliser le nœud `ParallaxBackground`
- Ensuite, il faut lui ajouter les nœuds enfants `ParallaxLayer`
- Dans `ParallaxLayer`, il faut ensuite ajouter l’image que l’on désire via le nœud `Sprite`

## ParallaxLayer
- Les propriétés importantes de ce nœud sont `Motion.Scale X|Y` et `Mirroring`
- `Scale` permet de déterminer la vitesse de défilement du paysage
  - Une valeur < 1 va faire défiler le paysage plus lentement que la couche principale et vice versa
- `Mirroring` permet de répéter le paysage lorsque l’image arrive à la fin de son affichage

![Alt text](assets/parallax_layer_props.png)

## Structure typique
Voici un exemple de structure d’arbre pour un effet parallaxe à deux couches ou plus :

```
ParallaxBackground
    └─ ParallaxLayerA
        └─ Sprite (Image)
    └─ ParallaxLayerB
        └─ Sprite (Image)
    └─ ...
```


# Défilement automatique
- Il est possible de faire défiler automatiquement le paysage via un script
- Par exemple, si l'on désire que des nuages lointain se déplace ou encore simuler un levé ou un couché de soleil.
- Un autre cas d'utilisation est de simuler un déplacement de la caméra
- Il suffit d’ajouter un script au nœud `ParallaxBackground` et de modifier dynamiquement la valeur de la propriété `MotionOffset`

Voici un exemple de code :

```cs
public partial class ParallaxBackground : Godot.ParallaxBackground
{
    [Export]
    float Cloud_Speed = -10f;

    ParallaxLayer cloudLayer;
    Sprite2D cloudSprite;

    public override void _Ready()
    {        
        cloudLayer = GetNode<ParallaxLayer>("clouds");
        cloudSprite = cloudLayer.GetNode<Sprite2D>("Sprite2D");
    }

    public override void _Process(double delta)
    {
        // Move the cloud automatically
        cloudLayer.SetMotionOffset(
            new Vector2(
                cloudLayer.GetMotionOffset().X + (Cloud_Speed * (float)delta),
                0));      
    }
}

```