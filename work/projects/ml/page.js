(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;
  function arrow(parent, x1, y1, x2, y2, seed, color) {
    S(parent, "line", [x1, y1, x2, y2], { sw: 2, seed: seed, color: color });
    var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
    S(parent, "linearPath", [[[x2 - ux * 10 - uy * 6, y2 - uy * 10 + ux * 6], [x2, y2], [x2 - ux * 10 + uy * 6, y2 - uy * 10 - ux * 6]]], { sw: 2, seed: seed + 1, color: color });
  }

  /* =================== HAR =================== */
  (function () {
    var s = $("fig-har");
    // walking figure
    var j = { head: [80, 92], neck: [78, 112], hip: [78, 184], lk: [64, 226], lf: [48, 270], rk: [92, 226], rf: [106, 270], le: [92, 148], lh: [104, 176], re: [66, 148], rh: [54, 176] };
    S(s, "circle", [j.head[0], j.head[1], 28], { sw: 2, seed: 1 });
    [["neck", "hip"], ["hip", "lk"], ["lk", "lf"], ["hip", "rk"], ["rk", "rf"], ["neck", "le"], ["le", "lh"], ["neck", "re"], ["re", "rh"]].forEach(function (l, i) {
      S(s, "line", [j[l[0]][0], j[l[0]][1], j[l[1]][0], j[l[1]][1]], { sw: 2.6, seed: 2 + i, rough: .8 });
    });
    F(s, "rectangle", [84, 168, 12, 20], "sky", { seed: 20, fillStyle: "solid", sw: 1.4 });
    S(s, "line", [10, 272, 150, 272], { sw: 1.6, seed: 21 });
    T(s, 80, 300, "phone in pocket", { size: 13 });

    // signal
    T(s, 238, 64, "accelerometer", { size: 14, weight: 700 });
    ["peach", "sky", "sage"].forEach(function (c, k) {
      var pts = [], r = K.rng(30 + k);
      for (var x = 170; x <= 306; x += 5) pts.push([x, 100 + k * 34 + Math.sin(x * 0.28 + k) * (8 + r() * 5)]);
      S(s, "linearPath", [pts], { sw: 1.8, color: c, seed: 40 + k, rough: .5 });
    });
    T(s, 238, 204, "x · y · z", { size: 13 });
    arrow(s, 238, 214, 238, 246, 50);
    F(s, "rectangle", [176, 252, 124, 30], "sheet", { seed: 52, sw: 1.6 });
    T(s, 238, 272, "TSFEL features", { size: 14, weight: 700 });
    S(s, "path", ["M302 252 C 330 200, 326 70, 420 52"], { sw: 2, seed: 54 });
    S(s, "linearPath", [[[409, 46], [421, 52], [411, 61]]], { sw: 2, seed: 55 });

    // tree
    var N = { root: [482, 50, "moving a lot?"], A: [410, 128, "up or down?"], B: [556, 128, "lying flat?"], walk: [366, 214, "walking"], up: [458, 214, "stairs"], lay: [518, 214, "laying"], C: [596, 214, "hips bent?"], sit: [552, 290, "sitting"], stand: [622, 290, "standing"] };
    var E2 = [["root", "A", 1], ["root", "B", 0], ["A", "walk", 1], ["A", "up", 0], ["B", "lay", 0], ["B", "C", 0], ["C", "sit", 0], ["C", "stand", 0]];
    E2.forEach(function (e, i) {
      var a = N[e[0]], b = N[e[1]];
      var n = S(s, "line", [a[0], a[1] + 14, b[0], b[1] - 14], { sw: e[2] ? 3 : 1.3, color: e[2] ? "red" : null, seed: 60 + i });
      if (!e[2]) n.style.opacity = .5;
    });
    Object.keys(N).forEach(function (k, i) {
      var n = N[k], w = n[2].length * 7 + 16, on = k === "root" || k === "A" || k === "walk";
      F(s, "rectangle", [n[0] - w / 2, n[1] - 14, w, 28], on ? "peach" : "sheet", { seed: 80 + i * 2, sw: on ? 2 : 1.2 });
      var t = T(s, n[0], n[1] + 5, n[2], { size: 13, weight: on ? 700 : 400 });
      if (!on) t.style.opacity = .7;
    });
    T(s, 366, 250, "✓", { size: 20, color: "red", weight: 700 });
  })();

  /* =================== NWP =================== */
  (function () {
    var s = $("fig-nwp");
    var words = ["well", "prince", "so", "genoa", "and"];
    T(s, 20, 30, "context window", { size: 14, weight: 700, anchor: "start" });
    words.forEach(function (w, i) {
      var x = 20 + i * 76;
      F(s, "rectangle", [x, 42, 68, 32], i ? "sheet" : "sheet", { seed: 1 + i * 2, sw: 1.6 });
      T(s, x + 34, 63, w, { size: 15 });
      // embedding bars
      var r = K.rng(10 + i);
      for (var b = 0; b < 5; b++) {
        var h = 6 + r() * 26;
        S(s, "rectangle", [x + 10 + b * 10, 150 - h, 7, h], { fill: true, fillStyle: "solid", noStroke: true, color: b % 2 ? "sky" : "peach", seed: 20 + i * 6 + b });
      }
      S(s, "line", [x + 34, 76, x + 34, 108], { sw: 1.2, dash: [3, 4], seed: 60 + i });
      S(s, "path", ["M" + (x + 34) + " 156 Q " + (x + 34) + " 180 " + (210) + " 196"], { sw: 1.1, seed: 70 + i });
    });
    F(s, "rectangle", [396, 42, 68, 32], "peach", { seed: 12, sw: 2 });
    T(s, 430, 63, "?", { size: 20, weight: 700, color: "red" });
    T(s, 20, 168, "embeddings", { size: 13, anchor: "start" });

    F(s, "rectangle", [150, 196, 120, 56], "sky", { seed: 80, gap: 6, sw: 2 });
    T(s, 210, 229, "neural net", { size: 16, weight: 700 });
    arrow(s, 274, 224, 318, 224, 82);

    var guesses = [["lucca", 96], ["the", 52], ["war", 30], ["prince", 18]];
    T(s, 330, 186, "next-word guesses", { size: 13, anchor: "start" });
    guesses.forEach(function (g, i) {
      var y = 198 + i * 26;
      S(s, "rectangle", [330, y, g[1], 18], { fill: true, noStroke: true, color: i ? "sage" : "peach", seed: 90 + i * 3, fillStyle: i ? "hachure" : "solid" });
      S(s, "rectangle", [330, y, g[1], 18], { sw: 1.2, seed: 100 + i });
      T(s, 338 + g[1], y + 14, g[0], { size: 14, anchor: "start", weight: i ? 400 : 700 });
    });
    arrow(s, 488, 194, 446, 82, 110, "red");

    // t-SNE inset
    S(s, "rectangle", [500, 150, 104, 128], { sw: 1.4, seed: 120 });
    T(s, 552, 142, "t-SNE", { size: 13, weight: 700 });
    var r2 = K.rng(77);
    [[530, 190, "peach"], [575, 250, "sky"], [575, 180, "sage"]].forEach(function (c, ci) {
      for (var p = 0; p < 6; p++) S(s, "circle", [c[0] + (r2() - .5) * 26, c[1] + (r2() - .5) * 22, 7], { fill: true, fillStyle: "solid", noStroke: true, color: c[2], seed: 130 + ci * 10 + p });
    });
    T(s, 552, 298, "similar words cluster", { size: 12 });
  })();

  /* =================== MD =================== */
  (function () {
    var s = $("fig-md");
    var atoms = [["C", 110, 150], ["C", 190, 130], ["O", 262, 176], ["H", 318, 156], ["H", 66, 100], ["H", 58, 184], ["H", 122, 218], ["H", 170, 62], ["H", 230, 76]];
    var bonds = [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]];
    bonds.forEach(function (b, i) { S(s, "line", [atoms[b[0]][1], atoms[b[0]][2], atoms[b[1]][1], atoms[b[1]][2]], { sw: 3, seed: 1 + i, rough: .6 }); });
    var forces = [[-14, 10], [12, -8], [16, 20], [26, -4], [-20, -18], [-22, 8], [6, 24], [-8, -24], [18, -16]];
    atoms.forEach(function (a, i) {
      var d = a[0] === "H" ? 22 : 36;
      F(s, "circle", [a[1], a[2], d], a[0] === "C" ? "navy" : a[0] === "O" ? "red" : "sheet", { seed: 20 + i * 3, gap: 3 });
      T(s, a[1], a[2] + 5, a[0], { size: a[0] === "H" ? 12 : 15, weight: 700 });
      var fx = forces[i][0] * 1.4, fy = forces[i][1] * 1.4, x1 = a[1] + fx, y1 = a[2] + fy, l = Math.hypot(fx, fy), ux = fx / l, uy = fy / l;
      var off = d / 2 + 2;
      S(s, "line", [a[1] + ux * off, a[2] + uy * off, x1 + ux * off, y1 + uy * off], { sw: 2, color: "red", seed: 60 + i, rough: .5 });
      var hx = x1 + ux * off, hy = y1 + uy * off;
      S(s, "linearPath", [[[hx - ux * 8 - uy * 5, hy - uy * 8 + ux * 5], [hx, hy], [hx - ux * 8 + uy * 5, hy - uy * 8 - ux * 5]]], { sw: 2, color: "red", seed: 80 + i });
    });
    T(s, 190, 280, "ethanol, with forces on each atom", { size: 14 });

    // energy landscape
    S(s, "line", [380, 250, 600, 250], { sw: 1.6, seed: 100 });
    S(s, "line", [390, 40, 390, 256], { sw: 1.6, seed: 101 });
    T(s, 396, 36, "energy", { size: 13, anchor: "start" });
    T(s, 596, 272, "atom positions", { size: 13, anchor: "end" });
    S(s, "path", ["M400 70 C 440 70, 460 220, 500 222 C 540 224, 560 120, 596 90"], { sw: 2.4, color: "sky", seed: 102 });
    F(s, "circle", [448, 148, 20], "peach", { seed: 103, fillStyle: "solid" });
    S(s, "line", [460, 160, 484, 196], { sw: 2.2, color: "red", seed: 105 });
    S(s, "linearPath", [[[474, 192], [485, 198], [486, 186]]], { sw: 2.2, color: "red", seed: 106 });
    T(s, 500, 172, "force = − slope", { size: 15, color: "red", anchor: "start" });
    T(s, 500, 244, "learned by SchNet / sGDML", { size: 12, anchor: "middle" });
  })();
})();
