// Bac à sable : la fréquence du bruit.
// Trois panneaux côte à côte, à des fréquences qui doublent à chaque fois,
// pour bien montrer l'effet direct de la fréquence sur la taille des détails.
window.sketchFrequencyDemo = (p) => {
  const PANEL_W = 220;
  const PANEL_H = 220;
  const GAP = 24;
  const CELL = 4;
  const FREQUENCIES = [2, 4, 8];
  // Voir elevation_demo.js : on évite l'origine (0,0), symétrique en Perlin.
  const DEFAULT_OFFSET_X = 500.123;
  const DEFAULT_OFFSET_Y = 500.456;

  let seed = 0;
  let offsetX = DEFAULT_OFFSET_X;
  let offsetY = DEFAULT_OFFSET_Y;
  let showBoxCheckbox;

  p.setup = () => {
    const totalW = PANEL_W * FREQUENCIES.length + GAP * (FREQUENCIES.length - 1);
    const cnv = p.createCanvas(totalW, PANEL_H + 50);
    const container = cnv.parent();

    const controls = p.createDiv().parent(container);
    controls.style("display", "flex");
    controls.style("flex-wrap", "wrap");
    controls.style("align-items", "center");
    controls.style("gap", "10px");
    controls.style("margin-top", "10px");
    controls.style("font-family", "sans-serif");
    controls.style("font-size", "14px");

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
      seed = 0;
      offsetX = DEFAULT_OFFSET_X;
      offsetY = DEFAULT_OFFSET_Y;
      showBoxCheckbox.checked(true);
      p.redraw();
    });

    showBoxCheckbox = p.createCheckbox("Afficher l'encadré", true);
    showBoxCheckbox.parent(controls);
    showBoxCheckbox.changed(() => p.redraw());

    p.noLoop();
  };

  p.draw = () => {
    p.background(255);
    p.noStroke();

    const cols = Math.floor(PANEL_W / CELL);
    const rows = Math.floor(PANEL_H / CELL);

    FREQUENCIES.forEach((freq, panelIndex) => {
      p.noiseSeed(seed); // même graine pour chaque panneau : seule la fréquence change
      const offsetPanelX = panelIndex * (PANEL_W + GAP);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const nx = (i - cols / 2) / cols;
          const ny = (j - rows / 2) / cols;
          const n = p.noise(freq * nx + offsetX, freq * ny + offsetY);

          p.fill(n * 255);
          p.rect(offsetPanelX + i * CELL, j * CELL, CELL, CELL);
        }
      }

      // Le carré central (demi-largeur, demi-hauteur) d'un panneau à fréquence F
      // correspond exactement, pixel pour pixel, au panneau complet à fréquence F/2
      // (même graine, même décalage). On l'encadre pour rendre le "zoom" visible.
      if (panelIndex > 0 && showBoxCheckbox.checked()) {
        const boxW = PANEL_W / 2;
        const boxH = PANEL_H / 2;
        const boxX = offsetPanelX + (PANEL_W - boxW) / 2;
        const boxY = (PANEL_H - boxH) / 2;

        p.noFill();
        p.stroke(255);
        p.strokeWeight(4);
        p.rect(boxX, boxY, boxW, boxH);
        p.stroke(220, 30, 30);
        p.strokeWeight(2);
        p.rect(boxX, boxY, boxW, boxH);

        p.noStroke();
        p.fill(220, 30, 30);
        p.textSize(11);
        p.text(`≈ fréquence ${FREQUENCIES[panelIndex - 1]} au complet`, boxX, boxY - 6);
      }

      p.fill(0);
      p.textSize(13);
      p.text(`Fréquence = ${freq}`, offsetPanelX, PANEL_H + 18);
    });
  };
};
