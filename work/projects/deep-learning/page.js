(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  /* =================== Cycle Sound =================== */
  (function () {
    var s = $("loop");
    F(s, "rectangle", [30, 90, 170, 140], "sheet", { seed: 1, sw: 2 });
    F(s, "rectangle", [400, 90, 170, 140], "sheet", { seed: 3, sw: 2 });
    T(s, 115, 258, "sound", { size: 20, weight: 700 });
    T(s, 485, 258, "picture", { size: 20, weight: 700 });
    var topD = "M205 110 Q 300 0 395 110", botD = "M395 210 Q 300 320 205 210";
    S(s, "path", [topD], { sw: 1.6, dash: [6, 6], seed: 5 });
    S(s, "path", [botD], { sw: 1.6, dash: [6, 6], seed: 6 });
    S(s, "linearPath", [[[380, 104], [396, 112], [392, 94]]], { sw: 1.8, seed: 7 });
    S(s, "linearPath", [[[220, 216], [204, 208], [208, 226]]], { sw: 1.8, seed: 8 });
    T(s, 300, 44, "tokens → transformer", { size: 16 });
    T(s, 300, 296, "tokens → transformer", { size: 16 });
    T(s, 300, 164, "VQ-VAE", { size: 18, color: "red", rotate: -4 });

    var guideTop = E("path", { d: topD, fill: "none", stroke: "none" }, s);
    var guideBot = E("path", { d: botD, fill: "none", stroke: "none" }, s);

    var sound = E("g", { class: "fade" }, s), pic = E("g", { class: "fade" }, s);
    function drawSound(seed) {
      sound.innerHTML = "";
      var r = K.rng(seed), pts = [];
      for (var x = 44; x <= 186; x += 4) {
        var env = Math.sin((x - 44) / 142 * Math.PI);
        pts.push([x, 160 + Math.sin(x * 0.5 + seed) * 34 * env * (0.4 + r() * 0.6)]);
      }
      S(sound, "linearPath", [pts], { sw: 2, color: "sky", seed: seed, rough: 0.6 });
      T(sound, 115, 118, "woof", { size: 16 });
    }
    function drawPic(seed) {
      pic.innerHTML = "";
      S(pic, "circle", [540, 115, 22], { fill: true, noStroke: true, color: "peach", seed: seed });
      S(pic, "path", ["M404 210 C 440 190, 520 196, 566 206"], { sw: 1.4, seed: seed + 1 });
      var g = E("g", { transform: "translate(470 168) scale(.62)" }, pic);
      F(g, "path", ["M-26 -22 C -52 -14, -50 30, -30 32 C -24 16, -22 0, -26 -22 Z"], "peach", { seed: seed + 2, gap: 3 });
      F(g, "path", ["M26 -22 C 52 -14, 50 30, 30 32 C 24 16, 22 0, 26 -22 Z"], "peach", { seed: seed + 4, gap: 3 });
      F(g, "circle", [0, 0, 64], "sheet", { seed: seed + 6 });
      S(g, "circle", [-11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 8 });
      S(g, "circle", [11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 9 });
      S(g, "ellipse", [0, 10, 14, 9], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 10 });
    }
    drawSound(11); drawPic(21);

    var tokens = [];
    for (var i = 0; i < 6; i++) {
      var tg = E("g", { opacity: 0 }, s);
      F(tg, "rectangle", [-8, -8, 16, 16], i % 2 ? "sky" : "peach", { seed: 40 + i * 3, gap: 3 });
      tokens.push(tg);
    }

    var busy = false, note = $("loopnote");
    function run(toPic) {
      if (busy) return; busy = true;
      var target = toPic ? pic : sound, guide = toPic ? guideTop : guideBot, len = guide.getTotalLength();
      var reseed = Math.floor(Math.random() * 1e4);
      note.textContent = toPic ? "encoding the bark into tokens…" : "encoding the picture into tokens…";
      target.style.opacity = 0.08;
      if (K.reduce) { finish(); return; }
      var t0 = null;
      function frame(ts) {
        if (!t0) t0 = ts;
        var el = ts - t0, done = true;
        tokens.forEach(function (tk, i) {
          var t = Math.max(0, Math.min(1, (el - i * 130) / 1100));
          if (t < 1) done = false;
          var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          var p = guide.getPointAtLength(e * len);
          tk.setAttribute("transform", "translate(" + p.x + " " + p.y + ") rotate(" + (e * 180) + ")");
          tk.setAttribute("opacity", t > 0 && t < 1 ? 1 : 0);
        });
        if (!done) requestAnimationFrame(frame); else finish();
      }
      requestAnimationFrame(frame);
      function finish() {
        if (toPic) drawPic(reseed); else drawSound(reseed);
        target.style.opacity = 1;
        note.innerHTML = toPic ? "…and the transformer draws a <b>dog</b>." : "…and the transformer hums back a <b>woof</b>.";
        busy = false;
      }
    }
    $("a2i").addEventListener("click", function () { run(true); });
    $("i2a").addEventListener("click", function () { run(false); });
  })();

  /* =================== ViT =================== */
  (function () {
    var s = $("vitsvg");
    var encs = [["sinusoidal", "add"], ["learnable", "add"], ["RoPE", "rotate"], ["concat (mine)", "concat"]];
    var enc = 3, attacked = false;
    var X0 = 30, Y0 = 50, P = 48, G = 6;

    var img = E("g", {}, s), overlay = E("g", {}, s), strip = E("g", {}, s);
    T(s, X0 + 105, 34, "the image", { size: 17, weight: 700 });
    T(s, 440, 34, "what the transformer reads", { size: 17, weight: 700 });

    // ship, drawn once
    S(img, "circle", [72, 88, 30], { fill: true, noStroke: true, color: "peach", seed: 1 });
    S(img, "rectangle", [X0, 205, 210, 50], { fill: true, noStroke: true, color: "sky", seed: 2, gap: 4 });
    F(img, "polygon", [[[58, 196], [214, 196], [192, 226], [82, 226]]], "peach", { seed: 3, gap: 3.5 });
    S(img, "line", [135, 76, 135, 196], { sw: 2.4, seed: 5 });
    F(img, "polygon", [[[141, 80], [141, 186], [210, 186]]], "sheet", { seed: 6 });
    F(img, "polygon", [[[129, 98], [129, 186], [74, 186]]], "sheet", { seed: 8 });
    // cut into patches
    for (var i = 1; i < 4; i++) {
      var o = i * (P + G) - G / 2;
      E("line", { x1: X0 + o, y1: Y0 - 4, x2: X0 + o, y2: Y0 + 4 * P + 3 * G + 4, stroke: "var(--sheet)", "stroke-width": G }, s);
      E("line", { x1: X0 - 4, y1: Y0 + o, x2: X0 + 4 * P + 3 * G + 4, y2: Y0 + o, stroke: "var(--sheet)", "stroke-width": G }, s);
    }
    s.appendChild(overlay); s.appendChild(strip);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var px = X0 + c * (P + G), py = Y0 + r * (P + G), n = r * 4 + c + 1;
      S(s, "circle", [px + 11, py + 11, 17], { fill: true, fillStyle: "solid", noStroke: true, color: "sheet", seed: 100 + n });
      S(s, "circle", [px + 11, py + 11, 17], { sw: 1, seed: 140 + n });
      T(s, px + 11, py + 15, String(n), { size: 11, weight: 700 });
    }

    function draw() {
      overlay.innerHTML = ""; strip.innerHTML = "";
      var mode = encs[enc][1];
      if (attacked) {
        var rnd = K.rng(7 + enc);
        for (var k = 0; k < 16; k++) {
          var x = X0 + (k % 4) * (P + G) + 6, y = Y0 + Math.floor(k / 4) * (P + G) + 22, pts = [];
          for (var j = 0; j < 7; j++) pts.push([x + j * 6, y + rnd() * 20]);
          S(overlay, "linearPath", [pts], { sw: 1.3, color: "red", seed: 300 + k, rough: 1.8 });
        }
      }
      for (var t = 0; t < 6; t++) {
        var y = 64 + t * 40, bx = 300, bw = 230;
        T(strip, 286, y + 17, "#" + (t + 1), { size: 14, anchor: "end" });
        if (mode === "concat") {
          F(strip, "rectangle", [bx, y, 160, 24], "peach", { seed: 400 + t * 4, gap: 4 });
          F(strip, "rectangle", [bx + 166, y, 64, 24], "sky", { seed: 420 + t * 4, gap: 4, angle: 41 });
          S(strip, "path", ["M" + (bx + 158) + " " + (y + 6) + " L" + (bx + 168) + " " + (y + 6) + " M" + (bx + 158) + " " + (y + 18) + " L" + (bx + 168) + " " + (y + 18)], { sw: 2, seed: 440 + t });
          if (attacked) S(strip, "linearPath", [[[bx + 10, y + 6], [bx + 50, y + 18], [bx + 90, y + 4], [bx + 140, y + 20]]], { sw: 1.5, color: "red", seed: 460 + t });
        } else {
          S(strip, "rectangle", [bx, y, bw, 24], { fill: true, noStroke: true, color: "peach", seed: 480 + t, gap: 5 });
          S(strip, "rectangle", [bx, y, bw, 24], { fill: true, noStroke: true, color: "sky", seed: 500 + t, gap: 5, angle: 41 });
          S(strip, "rectangle", [bx, y, bw, 24], { seed: 520 + t });
          if (mode === "rotate") S(strip, "path", ["M" + (bx + bw - 30) + " " + (y + 12) + " a 9 9 0 1 1 6 8"], { sw: 1.6, seed: 540 + t });
          if (attacked) S(strip, "linearPath", [[[bx + 10, y + 6], [bx + 70, y + 20], [bx + 130, y + 4], [bx + 220, y + 18]]], { sw: 1.5, color: "red", seed: 560 + t });
        }
      }
      T(strip, 330, 316, "…and 10 more", { size: 14, anchor: "start" });
      if (mode === "concat") {
        T(strip, 380, 58, "patch", { size: 13 });
        T(strip, 498, 58, "position", { size: 13 });
      } else {
        T(strip, 415, 58, "patch + position, mixed", { size: 13 });
      }
      var name = encs[enc][0], note = $("vitnote");
      if (!attacked) note.innerHTML = "<b>" + name + "</b>: each patch knows where it belongs. Try an attack.";
      else if (mode === "concat") note.innerHTML = "Under attack, the scribbles land on the <b>patch</b> half. The position half sits beside it. Across 400+ ViTs, this held up <b>~2% better</b>.";
      else note.innerHTML = "Under attack with <b>" + name + "</b>, position and content share the same numbers, so the scribbles land on both.";
      [].forEach.call($("encs").children, function (b, i) { b.setAttribute("aria-pressed", i === enc ? "true" : "false"); });
    }
    encs.forEach(function (e, i) {
      var b = K.el("button", "btn ghost", e[0]); b.type = "button";
      b.addEventListener("click", function () { enc = i; draw(); });
      $("encs").appendChild(b);
    });
    $("attack").addEventListener("click", function () {
      attacked = !attacked;
      this.setAttribute("aria-pressed", attacked ? "true" : "false");
      this.textContent = attacked ? "clean it up" : "scribble an attack";
      draw();
    });
    draw();
  })();

  /* =================== DAGMM sheep =================== */
  (function () {
    var s = $("field");
    S(s, "path", ["M20 70 C 150 50, 420 60, 580 64"], { sw: 1.2, seed: 1 });
    for (var i = 0; i < 16; i++) { var gx = 40 + i * 36; S(s, "linearPath", [[[gx, 318], [gx + 4, 306], [gx + 8, 318]]], { sw: 1, seed: 10 + i }); }

    var gmm = E("g", { class: "gmm", opacity: 0 }, s);
    S(gmm, "ellipse", [190, 160, 200, 130], { fill: true, noStroke: true, color: "sage", seed: 30, gap: 7 });
    S(gmm, "ellipse", [190, 160, 200, 130], { dash: [5, 5], seed: 31 });
    S(gmm, "ellipse", [400, 225, 190, 120], { fill: true, noStroke: true, color: "sage", seed: 32, gap: 7, angle: 30 });
    S(gmm, "ellipse", [400, 225, 190, 120], { dash: [5, 5], seed: 33 });
    T(gmm, 190, 80, "normal cluster A", { size: 15 });
    T(gmm, 400, 300, "normal cluster B", { size: 15 });
    T(gmm, 40, 34, "latent space (z) + Gaussian mixture", { size: 17, weight: 700, anchor: "start" });

    function sheepDoodle(g, kind, seed) {
      var black = kind === "black";
      [[-14, -2], [0, -8], [14, -2], [8, 8], [-8, 8]].forEach(function (c, i) {
        var n = S(g, "circle", [c[0], c[1], 22], { fill: true, fillStyle: black ? "hachure" : "solid", noStroke: true, gap: 2, seed: seed + i });
        if (!black) n.style.color = "var(--sheet)";
      });
      S(g, "path", ["M-24 -2 C -26 -18, -6 -22, 0 -18 C 8 -24, 26 -16, 24 -2 C 30 10, 14 22, 0 18 C -14 22, -30 12, -24 -2 Z"], { sw: 1.6, seed: seed + 6 });
      S(g, "line", [-12, 16, -13, 28], { sw: 1.8, seed: seed + 7 });
      S(g, "line", [10, 16, 11, 28], { sw: 1.8, seed: seed + 8 });
      S(g, "ellipse", [-26, -6, 14, 18], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 9 });
      if (kind === "wolf") {
        S(g, "polygon", [[[-33, -14], [-30, -30], [-24, -15]]], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 10 });
        S(g, "polygon", [[[-26, -15], [-20, -29], [-18, -12]]], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 11 });
      }
    }

    var r = K.rng(99), flock = [];
    var A = K.rng(5), B = K.rng(6);
    for (var k = 0; k < 20; k++) {
      var kind = k === 7 ? "wolf" : k === 15 ? "black" : "sheep";
      var field = [50 + r() * 500, 100 + r() * 190];
      var lat;
      if (kind === "wolf") lat = [530, 110];
      else if (kind === "black") lat = [70, 290];
      else if (k % 2) lat = [190 + (A() - .5) * 140, 160 + (A() - .5) * 80];
      else lat = [400 + (B() - .5) * 130, 225 + (B() - .5) * 70];
      var g = E("g", {}, s);
      var inner = E("g", { transform: "scale(.8)" }, g);
      sheepDoodle(inner, kind, 600 + k * 20);
      flock.push({ g: g, field: field, lat: lat, kind: kind });
    }
    var flags = E("g", { class: "gmm", opacity: 0 }, s);
    S(flags, "circle", [530, 112, 70], { color: "red", sw: 2, seed: 900 });
    S(flags, "circle", [70, 292, 70], { color: "red", sw: 2, seed: 901 });
    T(flags, 530, 60, "wolf in disguise", { size: 16, color: "red" });
    T(flags, 150, 318, "black sheep", { size: 16, color: "red" });

    var inLatent = false;
    function place() {
      flock.forEach(function (f) {
        var p = inLatent ? f.lat : f.field;
        f.g.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
      });
      gmm.setAttribute("opacity", inLatent ? 1 : 0);
      flags.setAttribute("opacity", inLatent ? 1 : 0);
      $("sheepnote").innerHTML = inLatent
        ? "Squashed down, the normal sheep huddle into two clusters. The two that don't fit sit alone, and DAGMM flags them: <b>low density = anomaly</b>."
        : "Twenty sheep. Two of them aren't quite sheep. Can you spot them?";
    }
    place();
    requestAnimationFrame(function () { flock.forEach(function (f) { f.g.setAttribute("class", "sheep"); }); });
    $("latent").addEventListener("click", function () {
      inLatent = !inLatent;
      this.setAttribute("aria-pressed", inLatent ? "true" : "false");
      this.textContent = inLatent ? "back to the field" : "squash into latent space";
      place();
    });
  })();
})();
