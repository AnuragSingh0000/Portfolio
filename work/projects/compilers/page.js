(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;
  var MONO = "var(--mono)";
  function arrow(parent, x1, y1, x2, y2, seed, color) {
    S(parent, "line", [x1, y1, x2, y2], { sw: 2, seed: seed, color: color });
    var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
    S(parent, "linearPath", [[[x2 - ux * 10 - uy * 6, y2 - uy * 10 + ux * 6], [x2, y2], [x2 - ux * 10 + uy * 6, y2 - uy * 10 - ux * 6]]], { sw: 2, seed: seed + 1, color: color });
  }
  function node(parent, x, y, label, color, seed, d) {
    F(parent, "circle", [x, y, d || 36], color, { seed: seed, gap: 4 });
    T(parent, x, y + 5, label, { size: 14, weight: 700, family: MONO });
  }

  /* =================== Psylang =================== */
  (function () {
    var s = $("fig-ps");
    // source
    F(s, "rectangle", [16, 16, 300, 40], "sheet", { seed: 1, sw: 2 });
    T(s, 30, 42, "var int a = b * (c + 2);", { size: 15, anchor: "start", family: MONO });
    T(s, 330, 42, "← source", { size: 13, anchor: "start" });

    // station 1: lexer
    arrow(s, 60, 60, 60, 86, 2);
    T(s, 16, 106, "1 · lexer (Flex)", { size: 14, weight: 700, anchor: "start", color: "red" });
    var toks = [["var", "sky"], ["int", "sky"], ["a", "sky"], ["=", "peach"], ["b", "sky"], ["*", "peach"], ["(", "sheet"], ["c", "sky"], ["+", "peach"], ["2", "sage"], [")", "sheet"], [";", "sheet"]];
    var tx = 16;
    toks.forEach(function (t, i) {
      var w = t[0].length * 10 + 16;
      F(s, "rectangle", [tx, 116, w, 26], t[1], { seed: 10 + i * 2, sw: 1.2, gap: 4 });
      T(s, tx + w / 2, 134, t[0], { size: 13, family: MONO });
      tx += w + 6;
    });

    // station 2: parser -> AST
    arrow(s, 60, 146, 60, 176, 40);
    T(s, 16, 196, "2 · parser (LALR(1))", { size: 14, weight: 700, anchor: "start", color: "red" });
    var nodes = { eq: [150, 220, "="], a: [100, 268, "a"], mul: [200, 268, "*"], b: [160, 316, "b"], plus: [240, 316, "+"], c: [210, 358, "c"], two: [270, 358, "2"] };
    [["eq", "a"], ["eq", "mul"], ["mul", "b"], ["mul", "plus"], ["plus", "c"], ["plus", "two"]].forEach(function (e, i) {
      var p = nodes[e[0]], c = nodes[e[1]];
      S(s, "line", [p[0], p[1], c[0], c[1]], { sw: 1.4, seed: 50 + i });
    });
    Object.keys(nodes).forEach(function (k, i) {
      var n = nodes[k], isLeaf = ["a", "b", "c", "two"].indexOf(k) !== -1;
      node(s, n[0], n[1], n[2], isLeaf ? (k === "two" ? "sage" : "sky") : "peach", 70 + i * 3, 32);
    });

    // station 3: semantic analyzer
    arrow(s, 300, 268, 356, 244, 100);
    T(s, 370, 196, "3 · semantic analyzer", { size: 14, weight: 700, anchor: "start", color: "red" });
    F(s, "rectangle", [370, 208, 170, 84], "sheet", { seed: 102, sw: 1.6 });
    [["a : int", "declared ✓"], ["b : int", "declared ✓"], ["c : int", "declared ✓"], ["types", "match ✓"]].forEach(function (r, i) {
      T(s, 382, 228 + i * 18, r[0], { size: 12, anchor: "start", family: MONO });
      T(s, 528, 228 + i * 18, r[1], { size: 12, anchor: "end" });
    });

    // station 4: IR
    arrow(s, 540, 296, 560, 314, 110);
    T(s, 644, 78, "4 · TAC IR", { size: 14, weight: 700, anchor: "end", color: "red" });
    F(s, "rectangle", [470, 88, 174, 70], "sage", { seed: 120, gap: 7, sw: 1.6 });
    ["t1 = c + 2", "t2 = b * t1", "a  = t2"].forEach(function (q, i) { T(s, 486, 112 + i * 19, q, { size: 13, anchor: "start", family: MONO }); });
    S(s, "path", ["M562 318 C 640 300, 660 200, 600 166"], { sw: 1.8, seed: 130 });
    S(s, "linearPath", [[[598, 178], [600, 165], [612, 170]]], { sw: 1.8, seed: 131 });
    T(s, 470, 360, "quadruples: (op, arg1, arg2, result)", { size: 12 });
  })();

  /* =================== Jlox =================== */
  (function () {
    var s = $("fig-jl");
    F(s, "rectangle", [16, 16, 250, 38], "sheet", { seed: 1, sw: 2 });
    T(s, 30, 41, "print (1 + 2) * x;", { size: 15, anchor: "start", family: MONO });
    var n = { pr: [150, 96, "print"], mul: [150, 164, "*"], plus: [90, 232, "+"], x: [220, 232, "x"], one: [50, 300, "1"], two: [130, 300, "2"] };
    [["pr", "mul"], ["mul", "plus"], ["mul", "x"], ["plus", "one"], ["plus", "two"]].forEach(function (e, i) {
      S(s, "line", [n[e[0]][0], n[e[0]][1], n[e[1]][0], n[e[1]][1]], { sw: 1.4, seed: 10 + i });
    });
    Object.keys(n).forEach(function (k, i) {
      var v = n[k], leaf = ["one", "two", "x"].indexOf(k) !== -1;
      if (k === "pr") { F(s, "rectangle", [v[0] - 34, v[1] - 16, 68, 32], "sheet", { seed: 30, sw: 1.6 }); T(s, v[0], v[1] + 5, "print", { size: 14, weight: 700, family: MONO }); }
      else node(s, v[0], v[1], v[2], leaf ? (k === "x" ? "sky" : "sage") : "peach", 40 + i * 3, 36);
    });
    // evaluation order
    [[26, 290, "1"], [154, 290, "2"], [62, 222, "3 → 3"], [246, 222, "4 → 4"], [180, 154, "5 → 12"], [190, 90, "6 → prints 12"]].forEach(function (o, i) {
      T(s, o[0], o[1], o[2], { size: 13, color: "red", anchor: i === 0 || i === 2 ? "end" : "start", weight: 700 });
    });

    // environments
    T(s, 470, 40, "environments", { size: 15, weight: 700 });
    F(s, "rectangle", [330, 56, 290, 230], "sky", { seed: 60, gap: 9, sw: 2 });
    T(s, 344, 80, "global", { size: 13, anchor: "start", weight: 700 });
    T(s, 344, 104, "x = 4", { size: 14, anchor: "start", family: MONO });
    T(s, 344, 126, "greeting = \"hello\"", { size: 14, anchor: "start", family: MONO });
    F(s, "rectangle", [360, 146, 236, 116], "sheet", { seed: 70, sw: 1.8 });
    T(s, 374, 170, "{ block }", { size: 13, anchor: "start", weight: 700 });
    T(s, 374, 196, "greeting = \"inner\"", { size: 14, anchor: "start", family: MONO });
    T(s, 374, 226, "print greeting → inner", { size: 13, anchor: "start" });
    T(s, 374, 248, "x → found in global: 4", { size: 13, anchor: "start" });
    T(s, 470, 314, "inner shadows outer, outer stays \"hello\"", { size: 12 });
  })();
})();
