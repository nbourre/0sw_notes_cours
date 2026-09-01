// Bac à sable : applyForce() — pousser un objet avec le vent.
// Reproduit l'exemple du projet s02_forces_01 : un Mover qui rebondit sur
// les bords, poussé par une force de vent constante appliquée chaque frame.
window.sketchForcesWind = (p) => {
  const W = 700;
  const H = 400;

  let mover;
  let windSlider;

  function resetMover() {
    mover = new SandboxMover(p, {
      x: W / 2,
      y: H / 2,
      vx: p.random(-2, 2),
      vy: p.random(-2, 2),
      diameter: 30,
    });
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();

    const bar = sandboxControlsBar(p, container);

    const s = sandboxSlider(p, bar, "Vent (force en x) :", -1, 1, -0.1, 0.05);
    windSlider = s.slider;

    sandboxButton(p, bar, "Réinitialiser", resetMover);

    resetMover();
  };

  p.draw = () => {
    p.background(0);

    const wind = p.createVector(Number(windSlider.value()), 0);
    mover.applyForce(wind);

    mover.checkEdges();
    mover.update();
    mover.display();
  };
};
