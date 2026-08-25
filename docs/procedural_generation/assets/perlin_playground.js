// Bac à sable : bruit de Perlin.
// Convention : voir docs/p5js/assets/p5js_extern_test.js.
window.sketchPerlinPlayground = (p) => {
  const W = 900;
  const H = 300;
  const DEFAULT_STEP = 0.02;

  let stepSlider;
  let stepValueLabel;
  let seedInput;
  let seed = 0;

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent(); // Récupère le holder dans lequel createCanvas a été placé

    const controls = p.createDiv().parent(container);
    controls.style("display", "flex");
    controls.style("flex-wrap", "wrap");
    controls.style("align-items", "center");
    controls.style("gap", "10px");
    controls.style("margin-top", "10px");
    controls.style("font-family", "sans-serif");
    controls.style("font-size", "14px");

    p.createSpan("Pas :").parent(controls);

    stepSlider = p.createSlider(0.001, 0.1, DEFAULT_STEP, 0.001);
    stepSlider.parent(controls);
    stepSlider.input(() => {
      stepValueLabel.html(Number(stepSlider.value()).toFixed(3));
      p.redraw();
    });

    stepValueLabel = p.createSpan(DEFAULT_STEP.toFixed(3));
    stepValueLabel.parent(controls);

    const genBtn = p.createButton("Générer");
    genBtn.parent(controls);
    genBtn.mousePressed(() => {
      seed = Math.floor(p.random(100000));
      seedInput.value(seed);
      p.redraw();
    });

    const resetBtn = p.createButton("Réinitialiser");
    resetBtn.parent(controls);
    resetBtn.mousePressed(() => {
      stepSlider.value(DEFAULT_STEP);
      stepValueLabel.html(DEFAULT_STEP.toFixed(3));
      seed = 0;
      seedInput.value(seed);
      p.redraw();
    });

    p.createSpan("| Graine :").parent(controls);
    seedInput = p.createInput(String(seed), "number");
    seedInput.parent(controls);
    seedInput.style("width", "80px");
    // Permet aux élèves d'entrer leur propre graine plutôt que d'en tirer une au hasard.
    seedInput.input(() => {
      const v = parseInt(seedInput.value(), 10);
      if (!Number.isNaN(v)) {
        seed = v;
        p.redraw();
      }
    });

    p.noLoop();
  };

  p.draw = () => {
    p.noiseSeed(seed);
    p.background(255);

    const step = Number(stepSlider.value());

    // On échantillonne le bruit une seule fois, puis on réutilise
    // les mêmes points pour le remplissage et le contour.
    const points = [];
    let yoff = 0;
    for (let x = 0; x <= p.width; x++) {
      const n = p.noise(yoff);
      points.push({ x, y: p.height - n * p.height });
      yoff += step;
    }

    // Remplissage façon "terrain"
    p.noStroke();
    p.fill(100, 200, 120, 140);
    p.beginShape();
    p.vertex(0, p.height);
    for (const pt of points) p.vertex(pt.x, pt.y);
    p.vertex(p.width, p.height);
    p.endShape(p.CLOSE);

    // Contour de la courbe de bruit
    p.noFill();
    p.stroke(20, 60, 30);
    p.strokeWeight(3);
    p.beginShape();
    for (const pt of points) p.vertex(pt.x, pt.y);
    p.endShape();
  };
};
