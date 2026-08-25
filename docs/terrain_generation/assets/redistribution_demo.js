// Bac à sable : la redistribution (fonction puissance).
// À gauche, la courbe "avant -> après" (comme sur Red Blob Games) ; à droite,
// l'effet réel sur une carte de terrain, mis à jour en direct.
window.sketchRedistributionDemo = (p) => {
  const PLOT_W = 180;
  const PLOT_H = 180;
  const PLOT_MARGIN_LEFT = 40;
  const PLOT_MARGIN_BOTTOM = 30;

  const MAP_W = 220;
  const MAP_H = 220;
  const GAP = 40;
  const CELL = 4;

  const NB_OCTAVES = 3;
  const LACUNARITY = 2;
  const GAIN = 0.5; // fixe ici : cette démo porte sur la redistribution, pas sur le gain

  const DEFAULT_EXPONENT = 2.2;
  const DEFAULT_OFFSET_X = 500.123;
  const DEFAULT_OFFSET_Y = 500.456;

  let expSlider;
  let expLabel;
  let seed = 0;
  let offsetX = DEFAULT_OFFSET_X;
  let offsetY = DEFAULT_OFFSET_Y;

  function terrainColor(e) {
    if (e < 0.3) return p.color(50, 100, 200); // Eau
    if (e < 0.35) return p.color(220, 210, 130); // Plage
    if (e < 0.7) return p.color(90, 160, 80); // Terre
    return p.color(255, 255, 255); // Montagne / neige
  }

  p.setup = () => {
    const plotTotalW = PLOT_MARGIN_LEFT + PLOT_W;
    const cnv = p.createCanvas(plotTotalW + GAP + MAP_W, Math.max(PLOT_H + PLOT_MARGIN_BOTTOM, MAP_H) + 40);
    const container = cnv.parent();

    const controls = p.createDiv().parent(container);
    controls.style("display", "flex");
    controls.style("flex-wrap", "wrap");
    controls.style("align-items", "center");
    controls.style("gap", "10px");
    controls.style("margin-top", "10px");
    controls.style("font-family", "sans-serif");
    controls.style("font-size", "14px");

    p.createSpan("Exposant :").parent(controls);
    expSlider = p.createSlider(0.3, 4, DEFAULT_EXPONENT, 0.1);
    expSlider.parent(controls);
    expSlider.input(() => {
      expLabel.html(Number(expSlider.value()).toFixed(1));
      p.redraw();
    });
    expLabel = p.createSpan(DEFAULT_EXPONENT.toFixed(1)).parent(controls);

    const genBtn = p.createButton("Générer");
    genBtn.parent(controls);
    genBtn.mousePressed(() => {
      seed = Math.floor(p.random(100000));
      offsetX = p.random(1000);
      offsetY = p.random(1000);
      p.redraw();
    });

    const resetBtn = p.createButton("Réinitialiser");
    resetBtn.parent(controls);
    resetBtn.mousePressed(() => {
      expSlider.value(DEFAULT_EXPONENT);
      expLabel.html(DEFAULT_EXPONENT.toFixed(1));
      seed = 0;
      offsetX = DEFAULT_OFFSET_X;
      offsetY = DEFAULT_OFFSET_Y;
      p.redraw();
    });

    p.noLoop();
  };

  function drawGraph(exponent) {
    const x0 = PLOT_MARGIN_LEFT;
    const yBottom = PLOT_H;

    const toPx = (x, y) => ({ x: x0 + x * PLOT_W, y: yBottom - y * PLOT_H });

    // Axes
    p.stroke(180);
    p.strokeWeight(1.5);
    p.line(x0, 0, x0, yBottom); // axe vertical
    p.line(x0, yBottom, x0 + PLOT_W, yBottom); // axe horizontal

    // Diagonale de référence (identité, exposant = 1)
    p.stroke(200);
    p.line(toPx(0, 0).x, toPx(0, 0).y, toPx(1, 1).x, toPx(1, 1).y);

    // Courbe y = x^exponent
    p.noFill();
    p.stroke(190, 30, 30);
    p.strokeWeight(3);
    p.beginShape();
    for (let i = 0; i <= 60; i++) {
      const x = i / 60;
      const y = Math.pow(x, exponent);
      const pt = toPx(x, y);
      p.vertex(pt.x, pt.y);
    }
    p.endShape();

    // Étiquettes
    p.noStroke();
    p.fill(0);
    p.textSize(12);
    p.text("1", x0 - 14, 8);
    p.text("0", x0 - 14, yBottom + 4);
    p.text("0", x0 - 4, yBottom + 18);
    p.text("1", x0 + PLOT_W - 6, yBottom + 18);
    p.text("Avant", x0 + PLOT_W / 2 - 16, yBottom + 18);

    p.push();
    p.translate(10, yBottom / 2 + 16);
    p.rotate(-Math.PI / 2);
    p.text("Après", 0, 0);
    p.pop();
  }

  function elevationAt(nx, ny) {
    let e = 0;
    let ampSum = 0;
    for (let o = 0; o < NB_OCTAVES; o++) {
      const freq = Math.pow(LACUNARITY, o);
      const amp = Math.pow(GAIN, o);
      e += amp * p.noise(freq * nx + offsetX, freq * ny + offsetY);
      ampSum += amp;
    }
    return e / ampSum;
  }

  p.draw = () => {
    p.noiseSeed(seed);
    p.background(255);

    const exponent = Number(expSlider.value());

    drawGraph(exponent);

    // Carte de terrain, avant/après la redistribution
    const mapX0 = PLOT_MARGIN_LEFT + PLOT_W + GAP;
    const cols = Math.floor(MAP_W / CELL);
    const rows = Math.floor(MAP_H / CELL);

    p.noStroke();
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const nx = (i - cols / 2) / cols;
        const ny = (j - rows / 2) / cols;

        let e = elevationAt(nx, ny);
        e = Math.pow(e, exponent);

        p.fill(terrainColor(e));
        p.rect(mapX0 + i * CELL, j * CELL, CELL, CELL);
      }
    }

    p.fill(0);
    p.textSize(12);
    p.text(`Carte redistribuée (exposant = ${exponent.toFixed(1)})`, mapX0, MAP_H + 18);
  };
};
