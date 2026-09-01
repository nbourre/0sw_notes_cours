// Bac à sable : la masse et le partage de vecteurs.
// Trois Mover de masses différentes reçoivent CHAQUE FRAME le même objet
// PVector "wind" (comme si on l'avait créé une seule fois et réutilisé pour
// plusieurs objets). En mode correct, chaque Mover copie le vecteur avant de
// diviser par sa masse. En mode bug, le vecteur est divisé en place et
// transmis tel quel au Mover suivant, qui hérite donc d'une force déjà
// amoindrie par la masse du précédent.
window.sketchForcesMass = (p) => {
  const W = 700;
  const H = 360;
  const MASSES = [1, 2, 4];
  const LANE_Y = [70, 190, 310];
  const START_X = 60;

  let movers;
  let windSlider;
  let gravitySlider;
  let bugCheckbox;

  // Version fautive : mutation en place, sans copie (contrairement à
  // SandboxMover.applyForce, qui utilise p5.Vector.div pour créer une copie).
  function applyForceBuggy(mover, force) {
    force.div(mover.mass);
    mover.acceleration.add(force);
  }

  function resetMovers() {
    movers = MASSES.map(
      (mass, i) =>
        new SandboxMover(p, {
          x: START_X,
          y: LANE_Y[i],
          mass,
          diameter: 24 + mass * 6,
        })
    );
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();
    const bar = sandboxControlsBar(p, container);

    const w = sandboxSlider(p, bar, "Vent (x) :", 0, 1, 0.3, 0.05);
    windSlider = w.slider;

    const g = sandboxSlider(p, bar, "Gravité (y) :", 0, 1, 0.2, 0.05);
    gravitySlider = g.slider;

    sandboxButton(p, bar, "Réinitialiser", resetMovers);

    bugCheckbox = sandboxCheckbox(
      p,
      bar,
      "Reproduire le bug (même vecteur, sans copie)",
      false
    );

    resetMovers();
  };

  p.draw = () => {
    p.background(0);

    // Un seul objet PVector, réutilisé pour les trois Mover (volontairement).
    const wind = p.createVector(Number(windSlider.value()), 0);

    for (const mover of movers) {
      if (bugCheckbox.checked()) {
        applyForceBuggy(mover, wind);
      } else {
        mover.applyForce(wind);
      }

      // La gravité n'est pas partagée : chaque Mover reçoit son propre vecteur.
      // Elle ne fait pas partie de la démonstration du bug, elle sert juste à
      // rendre le mouvement plus intéressant (et à voir le rebond sur les bords).
      mover.applyForce(p.createVector(0, Number(gravitySlider.value())));
    }

    p.noStroke();
    p.fill(200);
    p.textSize(13);
    for (let i = 0; i < movers.length; i++) {
      p.text(`Masse = ${MASSES[i]}`, 10, LANE_Y[i] - 24);
    }

    for (const mover of movers) {
      mover.checkEdges(true);
      mover.update();
      mover.display();
    }
  };
};
