// Réexécute les <script> des esquisses p5.js à chaque navigation instantanée
// (navigation.instant), sinon le script ne tourne qu'au tout premier chargement.
// (p5.js elle-même est chargée dans <head>, voir overrides/main.html, pour
// être disponible avant même que ces scripts ne s'exécutent une première fois.)
// Convention : englober l'esquisse dans <div class="p5-embed">...</div>
// et écrire le sketch en mode instance pour pouvoir le nettoyer/recréer sans erreur :
//
// <div class="p5-embed">
//   <div id="sketch-unique-id"></div>
//   <script>
//     (() => {
//       const holder = document.getElementById("sketch-unique-id");
//       if (holder._p5Instance) holder._p5Instance.remove();
//       holder._p5Instance = new p5((p) => {
//         p.setup = () => p.createCanvas(400, 400).parent(holder);
//         p.draw = () => p.background(220);
//       });
//     })();
//   </script>
// </div>

document$.subscribe(() => {
  document.querySelectorAll(".p5-embed script").forEach((oldScript) => {
    const newScript = document.createElement("script");
    const src = oldScript.getAttribute("src");

    if (src) {
      newScript.src = src;
      // Préserve l'ordre d'exécution relatif entre scripts insérés dynamiquement
      // (par défaut, un <script src> créé par script s'exécute en mode async
      // dès qu'il est chargé, sans respecter l'ordre du document).
      newScript.async = false;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    oldScript.replaceWith(newScript);
  });
});
