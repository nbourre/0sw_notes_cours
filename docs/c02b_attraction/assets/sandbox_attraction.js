// Bac à sable : attraction gravitationnelle.
// Un seul sketch pour les deux exemples du texte, contrôlé par les paramètres :
//   - Nombre de corps mobiles = 1 et attracteur central activé
//     → reproduit attractor_mover.gif (un Mover attiré par un Attractor fixe).
//   - Nombre de corps mobiles > 1 et attracteur central désactivé
//     → reproduit attractor_multiple.gif (N corps qui s'attirent mutuellement,
//     comme dans xtra/attractors_02 : pas de G explicite, chaque corps attire
//     tous les autres).
// Formule et distance limite (5 à 25) identiques à la classe Attractor du texte
// et des projets de référence (xtra/attractors, xtra/attractors_02).
window.sketchAttraction = (p) => {
  const W = 700;
  const H = 500;

  let movers;
  let centralAttractor;
  let nbSlider;
  let attractorMassSlider;
  let centralCheckbox;

  function attractionForce(fromPos, fromMass, toPos, toMass) {
    const force = p5.Vector.sub(fromPos, toPos);
    let distance = force.mag();
    distance = p.constrain(distance, 5, 25);

    force.normalize();
    const strength = (fromMass * toMass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  function spawnMovers() {
    const n = Number(nbSlider.value());
    movers = [];

    for (let i = 0; i < n; i++) {
      const mass = p.random(0.5, 2);
      let x, y;

      if (n === 1) {
        // Position de départ fixe, comme l'exemple du texte (width/4, height/4).
        x = W / 4;
        y = H / 4;
      } else {
        x = p.random(W * 0.1, W * 0.9);
        y = p.random(H * 0.1, H * 0.9);
      }

      movers.push(
        new SandboxMover(p, {
          x,
          y,
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5),
          mass,
          diameter: mass * 16,
          fillColor: p.color(90, 130, 220, 180),
        })
      );
    }
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();
    const bar = sandboxControlsBar(p, container);

    const n = sandboxSlider(p, bar, "Nombre de corps mobiles :", 1, 12, 1, 1, spawnMovers, (v) => String(v));
    nbSlider = n.slider;

    centralCheckbox = sandboxCheckbox(p, bar, "Attracteur central fixe", true);

    const m = sandboxSlider(p, bar, "Masse de l'attracteur :", 5, 40, 20, 1, null, (v) => String(v));
    attractorMassSlider = m.slider;

    sandboxButton(p, bar, "Réinitialiser", spawnMovers);

    centralAttractor = { position: p.createVector(W / 2, H / 2) };

    spawnMovers();
  };

  p.draw = () => {
    centralAttractor.mass = Number(attractorMassSlider.value());
    const centralOn = centralCheckbox.checked();

    for (let i = 0; i < movers.length; i++) {
      const mover = movers[i];

      if (centralOn) {
        mover.applyForce(
          attractionForce(centralAttractor.position, centralAttractor.mass, mover.location, mover.mass)
        );
      }

      for (let j = 0; j < movers.length; j++) {
        if (i !== j) {
          const other = movers[j];
          mover.applyForce(attractionForce(other.location, other.mass, mover.location, mover.mass));
        }
      }

      mover.update();
    }

    p.background(255);

    if (centralOn) {
      p.push();
      p.stroke(0);
      p.strokeWeight(1);
      p.fill(127);
      const d = centralAttractor.mass * 3;
      p.ellipse(centralAttractor.position.x, centralAttractor.position.y, d, d);
      p.pop();
    }

    for (const mover of movers) {
      mover.display();
    }
  };
};
