// Sketch p5.js en mode instance, chargé depuis un fichier externe.
// Voir workflow/readme.md, étape 5, pour la convention à suivre.
window.sketchExternTest = (p) => {
  let x = 320;
  let y = 240;
  let vx = 3;
  let vy = 2;
  const r = 40;

  p.setup = () => {
    p.createCanvas(640, 480);
  };

  p.draw = () => {
    p.background(220);

    x += vx;
    y += vy;

    if (x - r < 0 || x + r > p.width) {
      vx *= -1;
    }
    if (y - r < 0 || y + r > p.height) {
      vy *= -1;
    }

    p.fill(30, 120, 220);
    p.noStroke();
    p.circle(x, y, r * 2);
  };
};
