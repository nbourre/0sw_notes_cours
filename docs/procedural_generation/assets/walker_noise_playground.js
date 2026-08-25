// Bac à sable : le marcheur aléatoire piloté par le bruit de Perlin.
// Adapté de Dan Shiffman, natureofcode.com
window.sketchWalkerNoise = (p) => {
  const W = 400;
  const H = 400;

  function Walker() {
    this.x = p.width / 2;
    this.y = p.height / 2;
    this.tx = 0;
    this.ty = 10000; // Décalage pour que x et y ne suivent pas la même courbe de bruit
  }

  Walker.prototype.display = function () {
    p.stroke(0);
    p.point(this.x, this.y);
  };

  Walker.prototype.walk = function () {
    this.x = p.map(p.noise(this.tx), 0, 1, 0, p.width);
    this.y = p.map(p.noise(this.ty), 0, 1, 0, p.height);

    // On avance dans le « temps » du bruit
    this.tx += 0.01;
    this.ty += 0.01;
  };

  let w;

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();

    p.background(255);
    w = new Walker();

    const controls = p.createDiv().parent(container);
    controls.style("margin-top", "10px");

    const resetBtn = p.createButton("Réinitialiser");
    resetBtn.parent(controls);
    resetBtn.mousePressed(() => {
      p.background(255);
      w = new Walker();
    });
  };

  p.draw = () => {
    w.walk();
    w.display();
  };
};
