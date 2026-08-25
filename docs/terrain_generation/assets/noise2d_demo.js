// Bac à sable : le bruit de Perlin en 2D (l'effet "nuage").
// Un simple champ de bruit affiché en niveaux de gris, sans interprétation.
window.sketchNoise2D = (p) => {
  const MAP_W = 700;
  const MAP_H = 320;
  const CELL = 4;
  const DEFAULT_SCALE = 3;
  // Voir elevation_demo.js : on évite de centrer l'échantillonnage sur
  // l'origine (0,0), le bruit de Perlin y étant visuellement symétrique.
  const DEFAULT_OFFSET_X = 500.123;
  const DEFAULT_OFFSET_Y = 500.456;

  let scaleSlider;
  let scaleLabel;
  let seed = 0;
  let offsetX = DEFAULT_OFFSET_X;
  let offsetY = DEFAULT_OFFSET_Y;

  p.setup = () => {
    const cnv = p.createCanvas(MAP_W, MAP_H + 40);
    const container = cnv.parent();

    const controls = p.createDiv().parent(container);
    controls.style("display", "flex");
    controls.style("flex-wrap", "wrap");
    controls.style("align-items", "center");
    controls.style("gap", "10px");
    controls.style("margin-top", "10px");
    controls.style("font-family", "sans-serif");
    controls.style("font-size", "14px");

    p.createSpan("Échelle :").parent(controls);
    scaleSlider = p.createSlider(1, 10, DEFAULT_SCALE, 1);
    scaleSlider.parent(controls);
    scaleSlider.input(() => {
      scaleLabel.html(scaleSlider.value());
      p.redraw();
    });
    scaleLabel = p.createSpan(DEFAULT_SCALE).parent(controls);

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
      scaleSlider.value(DEFAULT_SCALE);
      scaleLabel.html(DEFAULT_SCALE);
      seed = 0;
      offsetX = DEFAULT_OFFSET_X;
      offsetY = DEFAULT_OFFSET_Y;
      p.redraw();
    });

    p.noLoop();
  };

  p.draw = () => {
    p.noiseSeed(seed);
    p.noStroke();

    const scale = Number(scaleSlider.value());
    const cols = Math.floor(MAP_W / CELL);
    const rows = Math.floor(MAP_H / CELL);

    // On divise nx ET ny par `cols` (et non par `rows`) pour que le bruit
    // avance du même pas sur les deux axes, peu importe le ratio largeur/hauteur
    // de la carte. Sans ça, le motif s'étire sur l'axe le plus court.
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const nx = (i - cols / 2) / cols;
        const ny = (j - rows / 2) / cols;
        const n = p.noise(nx * scale + offsetX, ny * scale + offsetY);

        p.fill(n * 255);
        p.rect(i * CELL, j * CELL, CELL, CELL);
      }
    }
  };
};
