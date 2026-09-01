// Bac à sable : la résistance des fluides.
// Adapté de s02_forces_fluidDrag : des balles de masse aléatoire tombent
// (gravité proportionnelle à la masse => chute libre indépendante de la masse),
// subissent une légère friction de l'air, puis ralentissent nettement en
// traversant deux bandes de "fluide" de densités différentes.
window.sketchForcesFluidDrag = (p) => {
  const W = 700;
  const H = 500;
  const NB_MOVERS = 10;
  const AIR_MU = 0.02;

  let movers;
  let fluidBottom;
  let fluidMiddle;
  let densityBottomSlider;
  let densityMiddleSlider;

  function makeFluid(x, y, w, h, density, coefficientFriction) {
    return { x, y, w, h, density, coefficientFriction };
  }

  // On teste le chevauchement avec le rayon réel affiché (contrairement au
  // projet original, où la boîte de collision ne suivait pas la taille visuelle
  // des balles plus massives) — plus clair pour l'enseignement.
  function intersectsFluid(mover, fluid) {
    const r = mover.diameter / 2;
    return mover.location.y + r > fluid.y && mover.location.y - r < fluid.y + fluid.h;
  }

  // Formule tirée de Fluid.draggingForce() : F = -0.5 * rho * ||v||^2 * A * Cd * v_hat
  // Ici, comme dans le projet original, on utilise la masse comme "aire" A simplifiée.
  function dragForce(mover, fluid) {
    const speed = mover.velocity;
    const speedMag = speed.mag();
    const coeffRhoMag = fluid.density * fluid.coefficientFriction * speedMag * speedMag * 0.5;

    const result = speed.copy();
    result.mult(-1);
    result.normalize();
    result.mult(mover.mass);
    result.mult(coeffRhoMag);
    return result;
  }

  function resetPositions() {
    for (let i = 0; i < movers.length; i++) {
      movers[i].location.x = 30 + i * (W / NB_MOVERS);
      movers[i].location.y = 20;
      movers[i].velocity.set(0, 0);
    }
  }

  function newBatch() {
    movers = [];
    for (let i = 0; i < NB_MOVERS; i++) {
      const mass = p.random(1, 5);
      movers.push(
        new SandboxMover(p, {
          x: 30 + i * (W / NB_MOVERS),
          y: 20,
          mass,
          diameter: mass * 16,
        })
      );
    }
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();
    const bar = sandboxControlsBar(p, container);

    const d1 = sandboxSlider(p, bar, "Densité fluide (bas) :", 0.1, 3, 0.8, 0.1);
    densityBottomSlider = d1.slider;

    const d2 = sandboxSlider(p, bar, "Densité fluide (milieu) :", 0.1, 3, 2, 0.1);
    densityMiddleSlider = d2.slider;

    sandboxButton(p, bar, "Relancer du haut", resetPositions);
    sandboxButton(p, bar, "Nouveau lot", newBatch);

    const hint = p.createP("Maintenez le clic pour souffler du vent sur toutes les balles.");
    hint.parent(container);
    hint.style("font-family", "sans-serif");
    hint.style("font-size", "13px");
    hint.style("margin", "6px 0 0 0");

    fluidBottom = makeFluid(0, H - H / 4, W, H / 4, 0.8, 0.1);
    fluidMiddle = makeFluid(0, H / 3, W, H / 8, 2, 0.1);

    newBatch();
  };

  p.draw = () => {
    fluidBottom.density = Number(densityBottomSlider.value());
    fluidMiddle.density = Number(densityMiddleSlider.value());

    p.background(255);

    p.noStroke();
    p.fill(80, 140, 220, 70);
    p.rect(fluidBottom.x, fluidBottom.y, fluidBottom.w, fluidBottom.h);
    p.fill(100, 200, 100, 100);
    p.rect(fluidMiddle.x, fluidMiddle.y, fluidMiddle.w, fluidMiddle.h);

    for (const mover of movers) {
      const gravity = p.createVector(0, 0.1 * mover.mass);
      mover.applyForce(gravity);

      if (mover.velocity.mag() > 0) {
        const friction = mover.velocity.copy();
        friction.normalize();
        friction.mult(-1);
        friction.mult(AIR_MU);
        mover.applyForce(friction);
      }

      if (intersectsFluid(mover, fluidBottom)) {
        mover.applyForce(dragForce(mover, fluidBottom));
      }
      if (intersectsFluid(mover, fluidMiddle)) {
        mover.applyForce(dragForce(mover, fluidMiddle));
      }

      if (p.mouseIsPressed) {
        mover.applyForce(p.createVector(0.1, 0));
      }

      // Rebond asymétrique comme dans le projet original : le plafond
      // amortit davantage la vitesse que les autres bords.
      const r = mover.diameter / 2;
      if (mover.location.x - r < 0) {
        mover.location.x = r;
        mover.velocity.x *= -1;
      } else if (mover.location.x + r > p.width) {
        mover.location.x = p.width - r;
        mover.velocity.x *= -1;
      }
      if (mover.location.y + r > p.height) {
        mover.location.y = p.height - r;
        mover.velocity.y *= -1;
      } else if (mover.location.y - r < 0) {
        mover.location.y = r;
        mover.velocity.y *= -0.6;
      }

      mover.update();
      mover.display();
    }
  };
};
