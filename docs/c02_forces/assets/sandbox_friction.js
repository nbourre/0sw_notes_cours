// Bac à sable : la friction.
// Reproduit la logique de s02_forces_friction : une force de friction qui
// s'oppose toujours à la vélocité (vecteur unitaire * mu), appliquée chaque
// frame, plus une poussée au clic (comme le "wind" du sketch original).
window.sketchForcesFriction = (p) => {
  const W = 700;
  const H = 400;
  const DEFAULT_MU = 0.03;

  let mover;
  let muSlider;

  function resetMover() {
    mover = new SandboxMover(p, {
      x: W / 2,
      y: H / 2,
      vx: 0,
      vy: 0,
      mass: 1,
      diameter: 30,
    });
  }

  function launch() {
    const angle = p.random(p.TWO_PI);
    const speed = p.random(6, 10);
    mover.velocity = p.createVector(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();
    const bar = sandboxControlsBar(p, container);

    const m = sandboxSlider(
      p,
      bar,
      "Coefficient de friction (μ) :",
      0,
      0.1,
      DEFAULT_MU,
      0.005,
      null,
      (v) => v.toFixed(3)
    );
    muSlider = m.slider;

    sandboxButton(p, bar, "Lancer", launch);
    sandboxButton(p, bar, "Réinitialiser", resetMover);

    const hint = p.createP("Maintenez le clic pour pousser l'objet vers la droite pendant qu'il ralentit.");
    hint.parent(container);
    hint.style("font-family", "sans-serif");
    hint.style("font-size", "13px");
    hint.style("margin", "6px 0 0 0");

    resetMover();
  };

  p.draw = () => {
    p.background(0);

    const mu = Number(muSlider.value());

    if (mover.velocity.mag() > 0) {
      const friction = mover.velocity.copy();
      friction.normalize();
      friction.mult(-1);
      friction.mult(mu);
      mover.applyForce(friction);
    }

    if (p.mouseIsPressed) {
      mover.applyForce(p.createVector(0.5, 0));
    }

    mover.checkEdges(true);
    mover.update();
    mover.display();

    p.noStroke();
    p.fill(200);
    p.textSize(13);
    p.text(`Vitesse = ${mover.velocity.mag().toFixed(2)}`, 10, 20);
  };
};
