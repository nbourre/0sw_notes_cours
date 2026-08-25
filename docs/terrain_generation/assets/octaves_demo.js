// Bac à sable : combiner plusieurs octaves de bruit.
// Reproduit l'idée de la figure "img1 + img2 + img3 = résultat" de
// Red Blob Games : trois octaves affichées telles quelles, puis leur somme
// pondérée (contrôlée par le gain) dans un dernier panneau.
window.sketchOctavesDemo = (p) => {
  const PANEL_W = 160;
  const PANEL_H = 160;
  const OP_W = 34; // largeur réservée pour les signes "+" et "="
  const CELL = 4;
  const NB_OCTAVES = 3;
  const LACUNARITY = 2; // chaque octave double la fréquence de la précédente
  const DEFAULT_GAIN = 0.5;
  // Voir elevation_demo.js : on évite l'origine (0,0), symétrique en Perlin.
  const DEFAULT_OFFSET_X = 500.123;
  const DEFAULT_OFFSET_Y = 500.456;

  let seed = 0;
  let offsetX = DEFAULT_OFFSET_X;
  let offsetY = DEFAULT_OFFSET_Y;
  let gainSlider;
  let gainLabel;

  p.setup = () => {
    const totalW = PANEL_W * (NB_OCTAVES + 1) + OP_W * NB_OCTAVES;
    const cnv = p.createCanvas(totalW, PANEL_H + 60);
    const container = cnv.parent();

    const controls = p.createDiv().parent(container);
    controls.style("display", "flex");
    controls.style("flex-wrap", "wrap");
    controls.style("align-items", "center");
    controls.style("gap", "10px");
    controls.style("margin-top", "10px");
    controls.style("font-family", "sans-serif");
    controls.style("font-size", "14px");

    p.createSpan("Gain :").parent(controls);
    gainSlider = p.createSlider(0.1, 0.9, DEFAULT_GAIN, 0.05);
    gainSlider.parent(controls);
    gainSlider.input(() => {
      gainLabel.html(Number(gainSlider.value()).toFixed(2));
      p.redraw();
    });
    gainLabel = p.createSpan(DEFAULT_GAIN.toFixed(2)).parent(controls);

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
      gainSlider.value(DEFAULT_GAIN);
      gainLabel.html(DEFAULT_GAIN.toFixed(2));
      seed = 0;
      offsetX = DEFAULT_OFFSET_X;
      offsetY = DEFAULT_OFFSET_Y;
      p.redraw();
    });

    p.noLoop();
  };

  p.draw = () => {
    p.noiseSeed(seed);
    p.background(255);
    p.noStroke();

    const gain = Number(gainSlider.value());
    const cols = Math.floor(PANEL_W / CELL);
    const rows = Math.floor(PANEL_H / CELL);

    const frequencies = [];
    const amplitudes = [];
    for (let o = 0; o < NB_OCTAVES; o++) {
      frequencies.push(Math.pow(LACUNARITY, o));
      amplitudes.push(Math.pow(gain, o));
    }
    const ampSum = amplitudes.reduce((a, b) => a + b, 0);

    // Une octave par panneau, affichée telle quelle (sans pondération),
    // pour montrer à quoi ressemble chaque fréquence individuellement.
    for (let o = 0; o < NB_OCTAVES; o++) {
      const panelX = o * (PANEL_W + OP_W);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const nx = (i - cols / 2) / cols;
          const ny = (j - rows / 2) / cols;
          const n = p.noise(frequencies[o] * nx + offsetX, frequencies[o] * ny + offsetY);
          p.fill(n * 255);
          p.rect(panelX + i * CELL, j * CELL, CELL, CELL);
        }
      }

      p.fill(0);
      p.textSize(12);
      p.text(`Octave ${o + 1} (fréq. ${frequencies[o]})`, panelX, PANEL_H + 18);
      p.text(`amplitude = ${amplitudes[o].toFixed(2)}`, panelX, PANEL_H + 34);

      if (o < NB_OCTAVES - 1) {
        p.textSize(24);
        p.text("+", panelX + PANEL_W + OP_W / 2 - 7, PANEL_H / 2 + 8);
      }
    }

    // Panneau final : la somme pondérée de toutes les octaves, normalisée.
    const resultX = NB_OCTAVES * (PANEL_W + OP_W);
    p.textSize(24);
    p.text("=", resultX - OP_W / 2 - 7, PANEL_H / 2 + 8);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const nx = (i - cols / 2) / cols;
        const ny = (j - rows / 2) / cols;

        let e = 0;
        for (let o = 0; o < NB_OCTAVES; o++) {
          e += amplitudes[o] * p.noise(frequencies[o] * nx + offsetX, frequencies[o] * ny + offsetY);
        }
        e /= ampSum;

        p.fill(e * 255);
        p.rect(resultX + i * CELL, j * CELL, CELL, CELL);
      }
    }

    p.fill(0);
    p.textSize(12);
    p.text("Résultat (fBm)", resultX, PANEL_H + 18);
    p.text(`gain = ${gain.toFixed(2)}`, resultX, PANEL_H + 34);
  };
};
