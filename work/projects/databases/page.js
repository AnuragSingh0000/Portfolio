(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;
  function arrow(parent, x1, y1, x2, y2, seed, color) {
    S(parent, "line", [x1, y1, x2, y2], { sw: 2, seed: seed, color: color });
    var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
    S(parent, "linearPath", [[[x2 - ux * 10 - uy * 6, y2 - uy * 10 + ux * 6], [x2, y2], [x2 - ux * 10 + uy * 6, y2 - uy * 10 - ux * 6]]], { sw: 2, seed: seed + 1, color: color });
  }

  /* =================== B+ tree + WAL =================== */
  (function () {
    var s = $("fig-bp");
    // a small order-4 tree, laid out by hand to match a real insert sequence
    var CW = 30, H = 28;
    var root = { x: 150, y: 50, keys: [10, 20] };
    var leaves = [{ x: 20, y: 150, keys: [5, 6, 7] }, { x: 132, y: 150, keys: [10, 12, 17] }, { x: 244, y: 150, keys: [20, 30] }];
    leaves.forEach(function (l, i) {
      S(s, "line", [root.x + i * CW, root.y + H, l.x + l.keys.length * CW / 2, l.y], { sw: 1.4, seed: 10 + i });
    });
    [root].concat(leaves).forEach(function (n, i) {
      F(s, "rectangle", [n.x, n.y, n.keys.length * CW, H], i ? "sage" : "sky", { seed: 20 + i * 3, gap: 6, sw: 1.8 });
      n.keys.forEach(function (k, j) {
        if (j) S(s, "line", [n.x + j * CW, n.y + 2, n.x + j * CW, n.y + H - 2], { sw: 1, seed: 40 + i * 4 + j });
        if (k === 17) S(s, "rectangle", [n.x + j * CW + 3, n.y + 3, CW - 6, H - 6], { fill: true, fillStyle: "solid", noStroke: true, color: "peach", seed: 60 });
        T(s, n.x + j * CW + CW / 2, n.y + 19, String(k), { size: 14, weight: 700 });
      });
    });
    S(s, "line", [112, 164, 130, 164], { sw: 1.2, dash: [3, 3], color: "red", seed: 70 });
    S(s, "line", [224, 164, 242, 164], { sw: 1.2, dash: [3, 3], color: "red", seed: 71 });
    T(s, 20, 30, "B+ tree index", { size: 15, weight: 700, anchor: "start" });
    T(s, 150, 214, "linked leaves → fast range scans", { size: 12 });
    T(s, 150, 250, "a 4th key → the leaf splits", { size: 13, color: "red" });
    T(s, 150, 268, "and a key moves up", { size: 13, color: "red" });

    // WAL diary
    S(s, "line", [340, 20, 340, 300], { sw: 1, dash: [2, 6], seed: 80 });
    F(s, "rectangle", [380, 30, 250, 220], "sheet", { seed: 90, sw: 2 });
    for (var r = 0; r < 4; r++) S(s, "circle", [392, 60 + r * 50, 8], { sw: 1.2, seed: 95 + r });
    T(s, 505, 22, "write-ahead log", { size: 15, weight: 700 });
    var lines = [["T1 BEGIN", 0], ["T1 INSERT athlete #41", 0], ["T1 COMMIT", 0], ["T2 BEGIN", 1], ["T2 UPDATE match #7", 1]];
    lines.forEach(function (l, i) {
      var t = T(s, 410, 64 + i * 30, l[0], { size: 14, anchor: "start", family: "var(--mono)" });
      if (l[1]) t.style.opacity = .55;
    });
    S(s, "path", ["M406 140 L600 140"], { sw: 1, seed: 100 });
    // coffee
    S(s, "circle", [590, 214, 70], { fill: true, noStroke: true, color: "peach", seed: 110, gap: 3.5 });
    S(s, "circle", [590, 214, 70], { sw: 1.6, seed: 111 });
    S(s, "circle", [548, 246, 16], { fill: true, noStroke: true, color: "peach", seed: 112 });
    T(s, 590, 288, "crash!", { size: 14, color: "red", weight: 700 });
    T(s, 480, 300, "recovery: redo T1 ✓  discard T2 ✗", { size: 13, color: "red" });
  })();

  /* =================== Olympia =================== */
  (function () {
    var s = $("fig-ol");
    // browser
    F(s, "rectangle", [16, 90, 110, 80], "sheet", { seed: 1, sw: 2 });
    S(s, "line", [16, 108, 126, 108], { sw: 1.2, seed: 2 });
    T(s, 71, 146, "request", { size: 14 });
    T(s, 71, 196, "coach / admin / viewer", { size: 11 });
    arrow(s, 132, 130, 176, 130, 4);
    // FastAPI
    F(s, "rectangle", [182, 60, 150, 140], "sky", { seed: 10, gap: 7, sw: 2 });
    T(s, 257, 90, "FastAPI", { size: 17, weight: 700 });
    [["JWT ✓", 120], ["role check ✓", 146], ["audit log", 172]].forEach(function (l, i) { T(s, 257, l[1], l[0], { size: 13 }); });
    arrow(s, 338, 130, 382, 130, 12);
    // router
    F(s, "circle", [424, 130, 76], "peach", { seed: 20, sw: 2 });
    T(s, 424, 126, "hash(key)", { size: 12, weight: 700 });
    T(s, 424, 142, "% 3", { size: 12, weight: 700 });
    // shards
    [50, 130, 210].forEach(function (y, i) {
      arrow(s, 462, 130, 520, y + 10, 30 + i * 2, i === 1 ? "red" : null);
      F(s, "rectangle", [528, y - 20, 100, 60], "sage", { seed: 40 + i * 3, gap: 6, sw: 1.8 });
      S(s, "line", [556, y + 10, 600, y + 10], { sw: 2.2, seed: 60 + i });
      T(s, 578, y + 55, "shard " + i, { size: 12 });
    });
    T(s, 578, 20, "MySQL", { size: 15, weight: 700 });
    T(s, 257, 240, "EXPLAIN + indexes on hot queries", { size: 13, color: "red" });
    T(s, 257, 262, "benchmarked + load-tested", { size: 12 });
  })();

  /* =================== E-gate =================== */
  (function () {
    var s = $("fig-eg");
    function qr(parent, x, y, size, seed) {
      var r = K.rng(seed), n = 7, c = size / n;
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var finder = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4);
        if (finder || r() > .5) S(parent, "rectangle", [x + i * c + .5, y + j * c + .5, c - 1, c - 1], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + i * n + j, rough: .3 });
      }
    }
    var steps = [[70, "register", "visitor + host"], [230, "QR pass", "on the phone"], [400, "guard scans", "details pop up"], [570, "logged", "visit recorded"]];
    // phone
    F(s, "rectangle", [44, 50, 52, 96], "sheet", { seed: 1, sw: 2 });
    for (var f = 0; f < 3; f++) S(s, "line", [54, 74 + f * 18, 86, 74 + f * 18], { sw: 1.2, seed: 5 + f });
    // pass
    F(s, "rectangle", [194, 50, 72, 96], "sky", { seed: 10, gap: 6, sw: 2 });
    qr(s, 206, 66, 48, 20);
    // guard scanner
    F(s, "rectangle", [360, 64, 80, 64], "sheet", { seed: 30, sw: 2 });
    S(s, "line", [372, 96, 428, 96], { sw: 2, color: "red", seed: 31 });
    S(s, "path", ["M372 76 L372 70 L380 70 M420 70 L428 70 L428 76 M372 116 L372 122 L380 122 M420 122 L428 122 L428 116"], { sw: 1.6, seed: 32 });
    // database
    F(s, "ellipse", [570, 62, 80, 22], "sage", { seed: 40, fillStyle: "solid" });
    S(s, "path", ["M530 62 L530 124 C 530 140, 610 140, 610 124 L610 62"], { sw: 2, seed: 42 });
    S(s, "path", ["M530 92 C 530 106, 610 106, 610 92"], { sw: 1.2, seed: 43 });
    for (var i = 0; i < 3; i++) arrow(s, steps[i][0] + 42, 98, steps[i + 1][0] - 46, 98, 50 + i * 2);
    steps.forEach(function (st, k) {
      T(s, st[0], 180, st[1], { size: 15, weight: 700 });
      T(s, st[0], 200, st[2], { size: 12 });
    });
  })();
})();
