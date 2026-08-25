// Bac à sable : donner un sens au bruit (élévation).
// Affiche côte à côte le bruit brut (niveaux de gris) et son interprétation
// en carte de terrain (eau / plage / terre / montagne), pour bien montrer
// qu'une valeur de bruit ne "veut rien dire" tant qu'on ne l'interprète pas.
window.sketchElevationDemo = (p) => {
  const MAP_W = 340;
  const MAP_H = 280;
  const GAP = 40;
  const CELL = 4;
  const DEFAULT_SCALE = 3;
  // Le bruit de Perlin a un artéfact connu : les valeurs autour de l'origine
  // (0, 0) ont tendance à être symétriques (n(-x,-y) ressemble à n(x,y)).
  // Comme nx/ny sont recentrés autour de 0, on décale l'échantillonnage loin
  // de l'origine pour éviter cet effet miroir visible au centre de la carte.
  const DEFAULT_OFFSET_X = 500.123;
  const DEFAULT_OFFSET_Y = 500.456;

  let scaleSlider;
  let scaleLabel;
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
    const cnv = p.createCanvas(MAP_W * 2 + GAP, MAP_H + 60);
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
    p.background(255);
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
        const e = p.noise(nx * scale + offsetX, ny * scale + offsetY);

        // Carte de gauche : le bruit brut, sans interprétation
        p.fill(e * 255);
        p.rect(i * CELL, j * CELL, CELL, CELL);

        // Carte de droite : la même valeur, interprétée comme une élévation
        p.fill(terrainColor(e));
        p.rect(MAP_W + GAP + i * CELL, j * CELL, CELL, CELL);
      }
    }

    p.fill(0);
    p.noStroke();
    p.textSize(13);
    p.text("Bruit brut", 0, MAP_H + 18);
    p.text("Interprété comme une élévation", MAP_W + GAP, MAP_H + 18);
  };
};
