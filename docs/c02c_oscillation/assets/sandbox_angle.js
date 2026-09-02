// Bac à sable : trouver l'angle entre deux points avec atan2.
//
// Le vaisseau rouge (ennemi, immobile) pointe toujours vers le vaisseau bleu
// (joueur), qui suit la souris. Le joueur garde volontairement un cap FIXE
// vers le nord, pour bien contraster avec le cap CALCULÉ de l'ennemi
// (angle = atan2(dy, dx)) — exactement la formule vue plus haut sur la page.
//
// La case à cocher (décochée par défaut) superpose le triangle rectangle
// (dx, dy, hypoténuse) et l'angle utilisés dans ce calcul, comme sur le
// schéma velocity_triangle.png.
window.sketchOscillationAngle = (p) => {
  const W = 700;
  const H = 450;
  const SHIP_LENGTH = 26;
  const SHIP_WIDTH = 18;

  let showTriangle = false;
  let enemy;

  // Triangle pointant vers +X (est) à angle 0 ; rotate(angle) l'oriente ensuite.
  function drawShip(x, y, heading, fillColor) {
    p.push();
    p.translate(x, y);
    p.rotate(heading);
    p.noStroke();
    p.fill(fillColor);
    p.triangle(
      SHIP_LENGTH / 2, 0,
      -SHIP_LENGTH / 2, SHIP_WIDTH / 2,
      -SHIP_LENGTH / 2, -SHIP_WIDTH / 2
    );
    p.pop();
  }

  function dashedLine(x1, y1, x2, y2, dash = 6, gap = 5) {
    const d = p.dist(x1, y1, x2, y2);
    if (d < 1) return;

    const ux = (x2 - x1) / d;
    const uy = (y2 - y1) / d;
    let dist = 0;

    while (dist < d) {
      const sx = x1 + ux * dist;
      const sy = y1 + uy * dist;
      const endDist = Math.min(dist + dash, d);
      const ex = x1 + ux * endDist;
      const ey = y1 + uy * endDist;
      p.line(sx, sy, ex, ey);
      dist += dash + gap;
    }
  }

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    const container = cnv.parent();

    const bar = p.createDiv().parent(container);
    bar.style("display", "flex");
    bar.style("align-items", "center");
    bar.style("gap", "10px");
    bar.style("margin-top", "10px");
    bar.style("font-family", "sans-serif");
    bar.style("font-size", "14px");

    const checkbox = p.createCheckbox("Afficher le triangle (dx, dy, angle)", showTriangle);
    checkbox.parent(bar);
    checkbox.changed(() => {
      showTriangle = checkbox.checked();
    });

    enemy = { x: W / 2, y: H / 2.4 };
  };

  p.draw = () => {
    p.background(20);

    const px = p.constrain(p.mouseX, 0, W);
    const py = p.constrain(p.mouseY, 0, H);

    const dx = px - enemy.x;
    const dy = py - enemy.y;
    const angle = p.atan2(dy, dx);

    if (showTriangle) {
      const corner = { x: px, y: enemy.y };

      p.strokeWeight(1.5);
      p.stroke(255, 90);
      dashedLine(enemy.x, enemy.y, corner.x, corner.y);
      dashedLine(corner.x, corner.y, px, py);
      dashedLine(enemy.x, enemy.y, px, py);

      p.noStroke();
      p.fill(255, 170);
      p.textSize(13);
      p.textAlign(p.CENTER, dy >= 0 ? p.TOP : p.BOTTOM);
      p.text("dx", (enemy.x + corner.x) / 2, corner.y + (dy >= 0 ? 6 : -6));
      p.textAlign(dx >= 0 ? p.LEFT : p.RIGHT, p.CENTER);
      p.text("dy", corner.x + (dx >= 0 ? 6 : -6), (corner.y + py) / 2);

      // Arc représentant l'angle, centré sur le vaisseau ennemi.
      p.noFill();
      p.stroke(255, 130);
      const r = 34;
      if (angle >= 0) {
        p.arc(enemy.x, enemy.y, r * 2, r * 2, 0, angle);
      } else {
        p.arc(enemy.x, enemy.y, r * 2, r * 2, angle, 0);
      }

      p.noStroke();
      p.fill(255, 200);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(`angle = atan2(dy, dx) ≈ ${angle.toFixed(2)} rad`, 14, H - 16);
    }

    drawShip(px, py, -p.HALF_PI, p.color(70, 140, 240)); // Joueur : cap fixe, nord
    drawShip(enemy.x, enemy.y, angle, p.color(230, 70, 70)); // Ennemi : cap = atan2(dy, dx)
  };
};
