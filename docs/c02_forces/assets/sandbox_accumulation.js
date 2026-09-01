// Bac à sable : accumulation des forces.
// Combine vent + gravité (acceleration.add() plutôt qu'une simple affectation),
// avec un clic de souris qui ajoute une poussée supplémentaire. Une case à
// cocher permet de reproduire le bug vu dans le texte : si on ne remet jamais
// l'accélération à zéro, l'objet accélère indéfiniment.
window.sketchForcesAccumulation = (p) => {
  const W = 700;
  const H = 400;

  let mover;
  let windSlider;
  let gravitySlider;
  let bugCheckbox;

  function resetMover() {
    mover = new SandboxMover(p, {
      x: W / 2,
      y: H / 2,
      vx: 0,
      vy: 0,
      diameter: 30,
    });
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();
    const bar = sandboxControlsBar(p, container);

    const w = sandboxSlider(p, bar, "Vent (x) :", -1, 1, 0, 0.05);
    windSlider = w.slider;

    const g = sandboxSlider(p, bar, "Gravité (y) :", 0, 1, 0.3, 0.05);
    gravitySlider = g.slider;

    sandboxButton(p, bar, "Réinitialiser", resetMover);

    bugCheckbox = sandboxCheckbox(
      p,
      bar,
      "Reproduire le bug (pas de reset de l'accélération)",
      false
    );

    const hint = p.createP("Maintenez le clic sur le canevas pour pousser l'objet vers la droite.");
    hint.parent(container);
    hint.style("font-family", "sans-serif");
    hint.style("font-size", "13px");
    hint.style("margin", "6px 0 0 0");

    resetMover();
  };

  p.draw = () => {
    p.background(0);

    const wind = p.createVector(Number(windSlider.value()), 0);
    const gravity = p.createVector(0, Number(gravitySlider.value()));
    mover.applyForce(wind);
    mover.applyForce(gravity);

    if (p.mouseIsPressed) {
      mover.applyForce(p.createVector(0.5, 0));
    }

    mover.checkEdges();

    if (bugCheckbox.checked()) {
      // Version brisée : on n'appelle jamais acceleration.mult(0).
      mover.velocity.add(mover.acceleration);
      mover.location.add(mover.velocity);
    } else {
      mover.update(); // Version correcte : réinitialise l'accélération à chaque frame
    }

    mover.display();
  };
};
