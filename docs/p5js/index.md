# Exemple p5js

Test d'intégration enligne

<div class="p5-embed">
  <div id="sketch-cercle-demo"></div>
  <script>
    (() => {
      const holder = document.getElementById("sketch-cercle-demo");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5((p) => {
        p.setup = () => {
          p.createCanvas(640, 480).parent(holder);
        };
        p.draw = () => {
          p.background(220);
          p.circle(p.width / 2, p.height / 2, 100);
        };
      });
    })();
  </script>
</div>

Test d'intégration externe

<div class="p5-embed">
  <div id="sketch-extern-test"></div>
  <script src="assets/p5js_extern_test.js"></script>
  <script>
    (() => {
      const holder = document.getElementById("sketch-extern-test");
      if (holder._p5Instance) holder._p5Instance.remove();
      holder._p5Instance = new p5(window.sketchExternTest, holder);
    })();
  </script>
</div>

