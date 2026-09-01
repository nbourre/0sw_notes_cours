// Petit framework réutilisable pour les bacs à sable du chapitre sur les forces.
//
// Fournit :
//   - SandboxMover : calqué sur les classes GraphicObject/Mover du projet
//     s02_forces_01 (location, velocity, acceleration, mass, applyForce,
//     checkEdges, update, display).
//   - sandboxControlsBar / sandboxSlider / sandboxButton / sandboxCheckbox :
//     évite de réécrire le style de la barre de contrôles à chaque sketch.
//
// Ce fichier est inclus (<script src="assets/forces_lib.js">) dans plusieurs
// bacs à sable de la page. Tout est enveloppé dans une IIFE pour pouvoir être
// inclus/exécuté plusieurs fois sur la même page sans provoquer d'erreur
// "already declared" (les balises <script> des bacs à sable sont réexécutées
// à chaque navigation grâce à p5-embed.js).
(function () {
  class SandboxMover {
    // p : l'instance p5 courante (mode instance)
    constructor(p, options = {}) {
      this.p = p;
      this.location = p.createVector(options.x ?? p.width / 2, options.y ?? p.height / 2);
      this.velocity = p.createVector(options.vx ?? 0, options.vy ?? 0);
      this.acceleration = p.createVector(0, 0);
      this.mass = options.mass ?? 1;
      this.diameter = options.diameter ?? Math.sqrt(this.mass) * 16;
      this.fillColor = options.fillColor ?? p.color(255);
      this.strokeColor = options.strokeColor ?? p.color(30);
    }

    // On copie le vecteur (via p5.Vector.div, qui retourne un nouveau vecteur)
    // avant de l'ajouter à l'accélération. Voir la section "Travailler avec la
    // masse" : appliquer directement `force` briserait tout si le même objet
    // `force` est réutilisé pour plusieurs Mover.
    applyForce(force) {
      const f = p5.Vector.div(force, this.mass);
      this.acceleration.add(f);
    }

    checkEdges(bounce = true) {
      const p = this.p;
      const r = this.diameter / 2;

      if (this.location.x - r < 0) {
        this.location.x = r;
        if (bounce) this.velocity.x *= -1;
      } else if (this.location.x + r > p.width) {
        this.location.x = p.width - r;
        if (bounce) this.velocity.x *= -1;
      }

      if (this.location.y - r < 0) {
        this.location.y = r;
        if (bounce) this.velocity.y *= -1;
      } else if (this.location.y + r > p.height) {
        this.location.y = p.height - r;
        if (bounce) this.velocity.y *= -1;
      }
    }

    update() {
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
      this.acceleration.mult(0);
    }

    display() {
      const p = this.p;
      p.push();
      p.translate(this.location.x, this.location.y);
      p.noStroke();
      p.fill(this.fillColor);
      p.stroke(this.strokeColor);
      p.strokeWeight(2);
      p.ellipse(0, 0, this.diameter, this.diameter);
      p.pop();
    }
  }

  function sandboxControlsBar(p, container) {
    const bar = p.createDiv().parent(container);
    bar.style("display", "flex");
    bar.style("flex-wrap", "wrap");
    bar.style("align-items", "center");
    bar.style("gap", "10px");
    bar.style("margin-top", "10px");
    bar.style("font-family", "sans-serif");
    bar.style("font-size", "14px");
    return bar;
  }

  // format : fonction optionnelle pour l'affichage de la valeur (défaut : 2 décimales)
  function sandboxSlider(p, bar, labelText, min, max, value, step, onInput, format) {
    const fmt = format || ((v) => v.toFixed(2));

    p.createSpan(labelText).parent(bar);
    const slider = p.createSlider(min, max, value, step);
    slider.parent(bar);
    const valueLabel = p.createSpan(fmt(value)).parent(bar);

    slider.input(() => {
      const v = Number(slider.value());
      valueLabel.html(fmt(v));
      if (onInput) onInput(v);
    });

    return { slider, valueLabel };
  }

  function sandboxButton(p, bar, labelText, onClick) {
    const btn = p.createButton(labelText);
    btn.parent(bar);
    btn.mousePressed(onClick);
    return btn;
  }

  function sandboxCheckbox(p, bar, labelText, checked, onChange) {
    const checkbox = p.createCheckbox(labelText, checked);
    checkbox.parent(bar);
    checkbox.changed(() => onChange && onChange(checkbox.checked()));
    return checkbox;
  }

  window.SandboxMover = SandboxMover;
  window.sandboxControlsBar = sandboxControlsBar;
  window.sandboxSlider = sandboxSlider;
  window.sandboxButton = sandboxButton;
  window.sandboxCheckbox = sandboxCheckbox;
})();
