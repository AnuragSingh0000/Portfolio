(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  $("reports").href = SITE.profile.reports;

  /* ---------- trail ---------- */
  (function () {
    var s = $("trail");
    S(s, "path", ["M30 140 C 180 50, 290 230, 450 140 S 690 40, 870 120"], { sw: 2.2, dash: [9, 7], seed: 5 });
    // stop 1: loop arrows
    S(s, "path", ["M115 110 A 38 38 0 0 1 185 100"], { sw: 2.4, color: "peach", seed: 6 });
    S(s, "linearPath", [[[174, 90], [186, 101], [172, 108]]], { sw: 2.4, color: "peach", seed: 7 });
    S(s, "path", ["M185 128 A 38 38 0 0 1 115 138"], { sw: 2.4, color: "sky", seed: 8 });
    S(s, "linearPath", [[[126, 148], [114, 137], [128, 130]]], { sw: 2.4, color: "sky", seed: 9 });
    S(s, "path", ["M128 119 q6 -12 12 0 t12 0 t12 0"], { sw: 1.6, seed: 10 });
    T(s, 150, 196, "Cycle Sound", { size: 22, weight: 700 });
    T(s, 150, 218, "jan – apr 2025", { size: 16 });
    // stop 2: benchmark bars
    [[410, 40], [432, 62], [454, 30], [476, 78]].forEach(function (b, i) {
      F(s, "rectangle", [b[0], 160 - b[1], 16, b[1]], i === 3 ? "peach" : "sky", { seed: 20 + i * 3, gap: 4 });
    });
    S(s, "line", [400, 161, 500, 161], { sw: 1.8, seed: 40 });
    T(s, 450, 196, "SRIP internship", { size: 22, weight: 700 });
    T(s, 450, 218, "summer 2025 · 20+ models", { size: 16 });
    // stop 3: paper + stamp
    F(s, "rectangle", [718, 22, 84, 108], "sheet", { seed: 50, sw: 2 });
    for (var i = 0; i < 5; i++) S(s, "line", [730, 44 + i * 16, 790 - (i % 2) * 18, 44 + i * 16], { sw: 1, seed: 60 + i });
    var st = E("g", { transform: "rotate(-14 760 110)" }, s);
    S(st, "rectangle", [712, 94, 96, 32], { color: "red", sw: 2.4, seed: 70 });
    T(st, 760, 117, "ACCEPTED", { size: 18, weight: 700, color: "red" });
    T(s, 760, 170, "BMVC 2026", { size: 22, weight: 700 });
    T(s, 760, 192, "the paper", { size: 16 });
    T(s, 330, 44, "one question, three stops", { size: 18, color: "red", rotate: -2 });
  })();

  /* ---------- characters for the story ---------- */
  function dog(parent, x, y, s) {
    var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + (s || 1) + ")" }, parent);
    F(g, "ellipse", [0, 70, 84, 58], "peach", { seed: 101, gap: 4.5 });
    F(g, "path", ["M-26 -22 C -52 -14, -50 30, -30 32 C -24 16, -22 0, -26 -22 Z"], "peach", { seed: 103, gap: 3 });
    F(g, "path", ["M26 -22 C 52 -14, 50 30, 30 32 C 24 16, 22 0, 26 -22 Z"], "peach", { seed: 105, gap: 3 });
    F(g, "circle", [0, 0, 64], "sheet", { seed: 107 });
    S(g, "circle", [-11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: 109 });
    S(g, "circle", [11, -6, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: 110 });
    S(g, "ellipse", [0, 10, 14, 9], { fill: true, fillStyle: "solid", noStroke: true, seed: 111 });
    S(g, "path", ["M0 14 L0 20 M-9 21 Q0 28 9 21"], { sw: 1.6, seed: 112 });
    return g;
  }
  function guitar(parent, x, y, s) {
    var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + (s || 1) + ")" }, parent);
    F(g, "rectangle", [-7, -118, 14, 100], "sheet", { seed: 121, sw: 1.8 });
    F(g, "rectangle", [-11, -138, 22, 24], "sky", { seed: 123 });
    F(g, "circle", [0, 44, 78], "sky", { seed: 125, gap: 4.5 });
    F(g, "circle", [0, 2, 56], "sky", { seed: 127, gap: 4.5 });
    F(g, "circle", [0, 18, 20], "sheet", { seed: 129 });
    S(g, "line", [-3, -110, -3, 60], { sw: 0.8, seed: 131, rough: 0.3 });
    S(g, "line", [3, -110, 3, 60], { sw: 0.8, seed: 132, rough: 0.3 });
    return g;
  }
  function waves(parent, x, y, dir, color) {
    for (var i = 0; i < 3; i++) {
      var r = 14 + i * 12;
      S(parent, "path", ["M" + x + " " + (y - r) + " q" + (dir * r * 0.9) + " " + r + " 0 " + (2 * r)], { sw: 1.8, color: color, seed: 140 + i * 2 + (dir > 0 ? 0 : 10) });
    }
  }
  function cluster(parent, cx, cy, color, seed) {
    var rand = K.rng(seed);
    for (var i = 0; i < 14; i++) {
      var a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 34;
      S(parent, "circle", [cx + Math.cos(a) * d, cy + Math.sin(a) * d, 10], { fill: true, fillStyle: "solid", noStroke: true, color: color, seed: seed + i });
      S(parent, "circle", [cx + Math.cos(a) * d, cy + Math.sin(a) * d, 10], { sw: 1, seed: seed + 50 + i });
    }
  }

  /* ---------- story scene ---------- */
  var scene = $("scene"), layers = [];
  for (var i = 0; i < 5; i++) layers.push(E("g", { class: "layer" + (i === 0 ? " on" : "") }, scene));

  // 0: two sounds
  dog(layers[0], 120, 180, 1);
  guitar(layers[0], 340, 200, 0.95);
  waves(layers[0], 180, 150, 1, "peach");
  waves(layers[0], 270, 150, -1, "sky");
  T(layers[0], 110, 300, "woof!", { size: 26, weight: 700 });
  T(layers[0], 340, 320, "strum", { size: 26, weight: 700 });

  // 1: dog-guitar
  (function (g) {
    guitar(g, 230, 210, 1.05);
    dog(g, 230, 118, 0.62);
    T(g, 110, 70, "a dog-guitar??", { size: 26, color: "red", rotate: -6 });
    S(g, "path", ["M150 84 C 170 100, 190 110, 205 116"], { color: "red", sw: 1.8, seed: 160 });
    T(g, 370, 320, "fusion", { size: 22, weight: 700 });
    T(g, 90, 320, "or neglect:", { size: 18 });
    T(g, 90, 342, "one sound vanishes", { size: 18 });
  })(layers[1]);

  // 2: squashed tokens in CLIP space
  (function (g) {
    S(g, "rectangle", [36, 40, 388, 262], { sw: 1.8, seed: 170 });
    T(g, 50, 30, "CLIP space", { size: 18, anchor: "start", weight: 700 });
    cluster(g, 214, 172, "peach", 300);
    cluster(g, 246, 182, "sky", 400);
    S(g, "ellipse", [230, 177, 150, 120], { color: "red", sw: 1.8, seed: 180 });
    T(g, 360, 90, "crowded!", { size: 22, color: "red", rotate: 8 });
    S(g, "circle", [70, 340, 12], { fill: true, fillStyle: "solid", noStroke: true, color: "peach", seed: 181 });
    T(g, 84, 346, "dog tokens", { size: 17, anchor: "start" });
    S(g, "circle", [250, 340, 12], { fill: true, fillStyle: "solid", noStroke: true, color: "sky", seed: 182 });
    T(g, 264, 346, "guitar tokens", { size: 17, anchor: "start" });
  })(layers[2]);

  // 3: pushed apart
  var driftA, driftB;
  (function (g) {
    S(g, "rectangle", [36, 40, 388, 262], { sw: 1.8, seed: 190 });
    T(g, 50, 30, "CLIP space, after", { size: 18, anchor: "start", weight: 700 });
    driftA = E("g", { class: "drift" }, g); cluster(driftA, 120, 130, "peach", 300);
    driftB = E("g", { class: "drift" }, g); cluster(driftB, 335, 215, "sky", 400);
    S(g, "path", ["M205 165 L160 145"], { sw: 2, color: "red", seed: 195 });
    S(g, "linearPath", [[[170, 139], [158, 144], [166, 154]]], { sw: 2, color: "red", seed: 196 });
    S(g, "path", ["M255 185 L300 205"], { sw: 2, color: "red", seed: 197 });
    S(g, "linearPath", [[[288, 208], [301, 206], [294, 195]]], { sw: 2, color: "red", seed: 198 });
    T(g, 230, 340, "Attend-and-Excite + A* loss", { size: 20, weight: 700 });
    T(g, 230, 364, "every sound gets its own spot", { size: 16 });
  })(layers[3]);
  function setDrift(apart) {
    if (K.reduce) apart = true;
    driftA.style.transform = apart ? "translate(0px,0px)" : "translate(94px,42px)";
    driftB.style.transform = apart ? "translate(0px,0px)" : "translate(-89px,-33px)";
  }
  setDrift(false);

  // 4: both in the picture
  (function (g) {
    F(g, "rectangle", [40, 30, 380, 290], "sheet", { seed: 210, sw: 3 });
    S(g, "rectangle", [52, 42, 356, 266], { sw: 1, seed: 211 });
    S(g, "path", ["M52 250 C 150 230, 300 260, 408 240"], { sw: 1.4, seed: 212 });
    dog(g, 150, 165, 0.9);
    guitar(g, 320, 185, 0.8);
    T(g, 230, 355, "both of them. finally.", { size: 24, color: "red", rotate: -2 });
  })(layers[4]);

  var dots = $("dots"), steps = [].slice.call(document.querySelectorAll("#steps .step")), current = 0;
  steps.forEach(function (st, i) {
    var b = K.el("button"); b.type = "button"; b.setAttribute("aria-label", "Step " + (i + 1));
    b.addEventListener("click", function () { st.scrollIntoView({ behavior: K.reduce ? "auto" : "smooth", block: "center" }); show(i); });
    dots.appendChild(b);
  });
  function show(i) {
    current = i;
    layers.forEach(function (l, j) { l.classList.toggle("on", j === i); });
    steps.forEach(function (st, j) { st.classList.toggle("on", j === i); });
    [].forEach.call(dots.children, function (b, j) { b.setAttribute("aria-current", j === i ? "true" : "false"); });
    if (i === 3) { setDrift(false); requestAnimationFrame(function () { requestAnimationFrame(function () { setDrift(true); }); }); }
  }
  show(0);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) show(+en.target.getAttribute("data-step")); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (st) { io.observe(st); });
  }

  /* ---------- Skan AI: noise filter ---------- */
  var events = [
    ["10:02:11", "click  'Invoice #4411'  (browser)", ""],
    ["10:02:11", "click  'Invoice #4411'  (browser)", "duplicate of previous event"],
    ["10:02:12", "mousemove  (812, 440)", "no business action"],
    ["10:02:14", "type  amount = 320  (spreadsheet)", ""],
    ["10:02:16", "focus  window 'Notifications'", "window unrelated to the task"],
    ["10:02:20", "click  'Submit'  (ERP)", ""],
    ["10:02:21", "capture  (no fields read)", "empty field values"],
    ["10:02:25", "click  'Approve'  (ERP)", ""]
  ];
  var log = $("log"), btn = $("filter"), on = false;
  function renderLog() {
    log.innerHTML = "";
    events.forEach(function (ev) {
      var noise = on && ev[2];
      log.appendChild(K.el("span", "muted", ev[0]));
      log.appendChild(K.el("span", noise ? "noise" : "", ev[1]));
      log.appendChild(K.el("span", "why", noise ? ev[2] : ""));
    });
  }
  function renderGraph() {
    var g = $("graph"); g.innerHTML = "";
    var main = [[60, 88, "open"], [190, 88, "enter"], [320, 88, "submit"], [450, 88, "approve"]];
    if (!on) {
      var noise = [[125, 26], [255, 150], [385, 26], [255, 26], [125, 150]];
      var spaghetti = [[0, 0], [0, 4], [2, 4], [1, 3], [3, 1], [1, 1], [2, 2], [1, 2], [2, 3], [3, 2]];
      spaghetti.forEach(function (e, i) {
        var a = main[e[0]], b = noise[e[1]];
        S(g, "path", ["M" + a[0] + " " + a[1] + " Q " + ((a[0] + b[0]) / 2 + 20) + " " + ((a[1] + b[1]) / 2 - 10) + " " + b[0] + " " + b[1]], { sw: 1.2, seed: 500 + i });
        var c = main[Math.min(e[0] + 1, 3)];
        S(g, "path", ["M" + b[0] + " " + b[1] + " Q " + ((b[0] + c[0]) / 2 - 10) + " " + ((b[1] + c[1]) / 2 + 12) + " " + c[0] + " " + c[1]], { sw: 1.2, seed: 520 + i });
      });
      noise.forEach(function (n, i) { F(g, "circle", [n[0], n[1], 22], "red", { seed: 540 + i * 2, gap: 3 }); });
    }
    for (var i = 0; i < 3; i++) S(g, "line", [main[i][0] + 26, 88, main[i + 1][0] - 26, 88], { sw: 2, seed: 560 + i });
    main.forEach(function (n, i) {
      F(g, "ellipse", [n[0], n[1], 82, 38], on ? "sage" : "sheet", { seed: 580 + i * 2 });
      T(g, n[0], n[1] + 6, n[2], { size: 16, weight: 700 });
    });
    $("graphnote").innerHTML = on
      ? "4 noisy events flagged, each with a reason → <b>one clean path</b>"
      : "raw log → the same four steps buried in spaghetti";
  }
  btn.addEventListener("click", function () {
    on = !on;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "show the raw log again" : "run the noise filter";
    renderLog(); renderGraph();
  });
  renderLog(); renderGraph();
})();
