(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  function token(parent, x, y, color, seed) { F(parent, "rectangle", [x - 8, y - 8, 16, 16], color, { seed: seed, gap: 3 }); }
  function arrowHead(parent, x, y, dx, dy, seed, color) {
    var l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
    S(parent, "linearPath", [[[x - ux * 11 - uy * 7, y - uy * 11 + ux * 7], [x, y], [x - ux * 11 + uy * 7, y - uy * 11 - ux * 7]]], { sw: 1.8, seed: seed, color: color });
  }

  /* =================== Cycle Sound =================== */
  (function () {
    var s = $("fig-cycle");
    F(s, "rectangle", [24, 110, 150, 120], "sheet", { seed: 1, sw: 2 });
    F(s, "rectangle", [426, 110, 150, 120], "sheet", { seed: 3, sw: 2 });
    // waveform
    var r = K.rng(4), pts = [];
    for (var x = 36; x <= 162; x += 4) { var env = Math.sin((x - 36) / 126 * Math.PI); pts.push([x, 170 + Math.sin(x * 0.5) * 34 * env * (0.4 + r() * 0.6)]); }
    S(s, "linearPath", [pts], { sw: 2, color: "sky", seed: 5, rough: 0.6 });
    T(s, 99, 256, "sound", { size: 19, weight: 700 });
    T(s, 99, 276, "(Mel-spectrogram)", { size: 13 });
    // picture: dog
    S(s, "circle", [548, 136, 22], { fill: true, noStroke: true, color: "peach", seed: 6 });
    S(s, "path", ["M430 210 C 470 196, 530 200, 572 208"], { sw: 1.4, seed: 7 });
    var g = E("g", { transform: "translate(500 170) scale(.6)" }, s);
    F(g, "path", ["M-26 -22 C -52 -14, -50 30, -30 32 C -24 16, -22 0, -26 -22 Z"], "peach", { seed: 8, gap: 3 });
    F(g, "path", ["M26 -22 C 52 -14, 50 30, 30 32 C 24 16, 22 0, 26 -22 Z"], "peach", { seed: 10, gap: 3 });
    F(g, "circle", [0, 0, 64], "sheet", { seed: 12 });
    S(g, "circle", [-11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: 14 });
    S(g, "circle", [11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: 15 });
    S(g, "ellipse", [0, 10, 14, 9], { fill: true, fillStyle: "solid", noStroke: true, seed: 16 });
    T(s, 501, 256, "picture", { size: 19, weight: 700 });
    T(s, 501, 276, "(image dVAE)", { size: 13 });

    // top: audio -> image
    S(s, "path", ["M180 128 Q 300 20 420 128"], { sw: 1.6, dash: [6, 6], seed: 20 });
    arrowHead(s, 420, 128, 20, 22, 21);
    [[222, 87, "sky"], [258, 67, "sky"], [300, 60, "red"], [342, 67, "peach"], [378, 87, "peach"]].forEach(function (t, i) {
      if (t[2] === "red") { F(s, "rectangle", [t[0] - 36, t[1] - 16, 72, 32], "sheet", { seed: 30 + i, sw: 1.8 }); T(s, t[0], t[1] + 5, "decoder", { size: 14, weight: 700 }); }
      else token(s, t[0], t[1], t[2], 30 + i * 3);
    });
    T(s, 240, 40, "audio tokens", { size: 14 });
    T(s, 362, 40, "image tokens", { size: 14 });
    // bottom: image -> audio
    S(s, "path", ["M420 212 Q 300 320 180 212"], { sw: 1.6, dash: [6, 6], seed: 40 });
    arrowHead(s, 180, 212, -20, -22, 41);
    [[378, 253, "peach"], [342, 273, "peach"], [300, 280, "red"], [258, 273, "sky"], [222, 253, "sky"]].forEach(function (t, i) {
      if (t[2] === "red") { F(s, "rectangle", [t[0] - 36, t[1] - 16, 72, 32], "sheet", { seed: 50 + i, sw: 1.8 }); T(s, t[0], t[1] + 5, "decoder", { size: 14, weight: 700 }); }
      else token(s, t[0], t[1], t[2], 50 + i * 3);
    });
    T(s, 300, 176, "transformer", { size: 18, color: "red", rotate: -3 });
    T(s, 300, 318, "same recipe, other way round", { size: 13 });
  })();

  /* =================== ViT =================== */
  (function () {
    var s = $("fig-vit");
    var X0 = 24, Y0 = 60, P = 46, G = 6, W = 4 * P + 3 * G;
    T(s, X0 + W / 2, 40, "image, cut into patches", { size: 15, weight: 700 });
    S(s, "circle", [64, 96, 28], { fill: true, noStroke: true, color: "peach", seed: 1 });
    S(s, "rectangle", [X0, 210, W, 48], { fill: true, noStroke: true, color: "sky", seed: 2, gap: 4 });
    F(s, "polygon", [[[50, 198], [200, 198], [180, 226], [72, 226]]], "peach", { seed: 3, gap: 3.5 });
    S(s, "line", [124, 84, 124, 198], { sw: 2.4, seed: 5 });
    F(s, "polygon", [[[130, 88], [130, 188], [194, 188]]], "sheet", { seed: 6 });
    F(s, "polygon", [[[118, 104], [118, 188], [66, 188]]], "sheet", { seed: 8 });
    for (var i = 1; i < 4; i++) {
      var o = i * (P + G) - G / 2;
      E("line", { x1: X0 + o, y1: Y0 - 4, x2: X0 + o, y2: Y0 + W + 4, stroke: "var(--sheet)", "stroke-width": G }, s);
      E("line", { x1: X0 - 4, y1: Y0 + o, x2: X0 + W + 4, y2: Y0 + o, stroke: "var(--sheet)", "stroke-width": G }, s);
    }
    var rnd = K.rng(11);
    [1, 4, 6, 9, 11, 14].forEach(function (k, j) {
      var x = X0 + (k % 4) * (P + G) + 6, y = Y0 + Math.floor(k / 4) * (P + G) + 20, pts = [];
      for (var q = 0; q < 7; q++) pts.push([x + q * 5.5, y + rnd() * 18]);
      S(s, "linearPath", [pts], { sw: 1.4, color: "red", seed: 20 + j, rough: 1.8 });
    });
    for (var n = 0; n < 16; n++) {
      var px = X0 + (n % 4) * (P + G), py = Y0 + Math.floor(n / 4) * (P + G);
      S(s, "circle", [px + 10, py + 10, 16], { fill: true, fillStyle: "solid", noStroke: true, color: "sheet", seed: 40 + n });
      S(s, "circle", [px + 10, py + 10, 16], { sw: 1, seed: 60 + n });
      T(s, px + 10, py + 14, String(n + 1), { size: 10, weight: 700 });
    }
    T(s, X0 + W / 2, 290, "tags = positions", { size: 14 });

    var BX = 286, BW = 226;
    T(s, BX, 50, "added (sinusoidal, learnable, RoPE)", { size: 15, weight: 700, anchor: "start" });
    for (var a = 0; a < 3; a++) {
      var y = 64 + a * 34;
      S(s, "rectangle", [BX, y, BW, 22], { fill: true, noStroke: true, color: "peach", seed: 100 + a, gap: 5 });
      S(s, "rectangle", [BX, y, BW, 22], { fill: true, noStroke: true, color: "sky", seed: 110 + a, gap: 5, angle: 41 });
      S(s, "rectangle", [BX, y, BW, 22], { seed: 120 + a });
      S(s, "linearPath", [[[BX + 12, y + 5], [BX + 80, y + 17], [BX + 150, y + 4], [BX + 236, y + 16]]], { sw: 1.4, color: "red", seed: 130 + a });
    }
    T(s, BX + BW + 12, 106, "all", { size: 13, anchor: "start", color: "red" });
    T(s, BX + BW + 12, 122, "smudged", { size: 13, anchor: "start", color: "red" });

    T(s, BX, 190, "concatenated, 4 : 1 (ours)", { size: 15, weight: 700, anchor: "start" });
    for (var b = 0; b < 3; b++) {
      var yy = 204 + b * 34, pw = BW * 0.8 - 4;
      F(s, "rectangle", [BX, yy, pw, 22], "peach", { seed: 140 + b * 3, gap: 4 });
      F(s, "rectangle", [BX + pw + 8, yy, BW - pw - 8, 22], "sky", { seed: 160 + b * 3, gap: 4, angle: 41 });
      S(s, "linearPath", [[[BX + 12, yy + 5], [BX + 70, yy + 17], [BX + 130, yy + 4], [BX + 190, yy + 16]]], { sw: 1.4, color: "red", seed: 180 + b });
    }
    T(s, BX + 88, 318, "patch", { size: 13 });
    T(s, BX + 205, 318, "position", { size: 13 });
    T(s, BX + BW + 12, 246, "position", { size: 13, anchor: "start", color: "red" });
    T(s, BX + BW + 12, 262, "stays clean", { size: 13, anchor: "start", color: "red" });
  })();

  /* =================== DAGMM =================== */
  (function () {
    var s = $("fig-dagmm");
    function sheep(parent, x, y, sc, kind, seed) {
      var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + sc + ")" }, parent);
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
    // field
    T(s, 100, 40, "the data", { size: 16, weight: 700 });
    S(s, "path", ["M14 272 C 60 262, 150 276, 190 266"], { sw: 1.2, seed: 1 });
    var field = [[50, 90, "sheep"], [130, 84, "sheep"], [88, 132, "wolf"], [158, 136, "sheep"], [44, 180, "sheep"], [118, 186, "sheep"], [70, 232, "sheep"], [150, 234, "black"]];
    field.forEach(function (f, i) { sheep(s, f[0], f[1], 0.72, f[2], 100 + i * 20); });

    // compress arrow
    F(s, "polygon", [[[214, 150], [270, 150], [270, 136], [300, 164], [270, 192], [270, 178], [214, 178]]], "sky", { seed: 300, gap: 4 });
    T(s, 256, 118, "autoencoder", { size: 14, weight: 700 });
    T(s, 256, 214, "compress", { size: 13 });

    // latent
    S(s, "rectangle", [318, 50, 266, 240], { sw: 1.8, seed: 310 });
    T(s, 330, 40, "latent space + Gaussian mixture", { size: 15, weight: 700, anchor: "start" });
    S(s, "ellipse", [400, 130, 130, 90], { fill: true, noStroke: true, color: "sage", seed: 320, gap: 7 });
    S(s, "ellipse", [400, 130, 130, 90], { dash: [5, 5], seed: 321 });
    S(s, "ellipse", [500, 220, 120, 80], { fill: true, noStroke: true, color: "sage", seed: 322, gap: 7, angle: 30 });
    S(s, "ellipse", [500, 220, 120, 80], { dash: [5, 5], seed: 323 });
    var A = K.rng(8);
    for (var a = 0; a < 6; a++) sheep(s, 400 + (A() - .5) * 80, 130 + (A() - .5) * 44, 0.45, "sheep", 400 + a * 20);
    for (var b = 0; b < 6; b++) sheep(s, 500 + (A() - .5) * 74, 220 + (A() - .5) * 36, 0.45, "sheep", 540 + b * 20);
    sheep(s, 545, 88, 0.5, "wolf", 700);
    sheep(s, 360, 250, 0.5, "black", 720);
    S(s, "circle", [545, 90, 52], { color: "red", sw: 2, seed: 740 });
    S(s, "circle", [360, 252, 52], { color: "red", sw: 2, seed: 741 });
    T(s, 450, 310, "low density → high energy → anomaly", { size: 14, color: "red" });
  })();
})();
