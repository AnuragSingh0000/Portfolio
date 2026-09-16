(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  /* =================== HAR =================== */
  (function () {
    var s = $("harsvg");
    var figure = E("g", {}, s), tree = E("g", {}, s);

    var nodes = {
      root: [470, 40, "moving a lot?"],
      A: [340, 128, "going up or down?"],
      B: [600, 128, "lying flat?"],
      up: [262, 222, "upstairs"], walk: [345, 256, "walking"], down: [428, 222, "downstairs"],
      lay: [535, 222, "laying"], C: [650, 222, "hips bent?"],
      sit: [592, 312, "sitting"], stand: [680, 312, "standing"]
    };
    var edges = [["root", "A", "yes"], ["root", "B", "no"], ["A", "up", "up"], ["A", "walk", "neither"], ["A", "down", "down"],
      ["B", "lay", "yes"], ["B", "C", "no"], ["C", "sit", "yes"], ["C", "stand", "no"]];
    var acts = [
      ["walking", ["root", "A", "walk"]], ["upstairs", ["root", "A", "up"]], ["downstairs", ["root", "A", "down"]],
      ["sitting", ["root", "B", "C", "sit"]], ["standing", ["root", "B", "C", "stand"]], ["laying", ["root", "B", "lay"]]
    ];
    var current = 0, frame = 0;

    function drawTree(path) {
      tree.innerHTML = "";
      edges.forEach(function (e, i) {
        var a = nodes[e[0]], b = nodes[e[1]];
        var on = path.indexOf(e[0]) !== -1 && path.indexOf(e[1]) !== -1;
        var ln = S(tree, "line", [a[0], a[1] + 14, b[0], b[1] - 14], { sw: on ? 3 : 1.3, color: on ? "red" : null, seed: 10 + i });
        if (!on) ln.style.opacity = .45;
        var lab = T(tree, (a[0] + b[0]) / 2 + (b[0] < a[0] ? -14 : 14), (a[1] + b[1]) / 2 + 2, e[2], { size: 13, color: on ? "red" : null });
        if (!on) lab.style.opacity = .6;
      });
      Object.keys(nodes).forEach(function (k, i) {
        var n = nodes[k], w = n[2].length * 8.4 + 22, on = path.indexOf(k) !== -1;
        var leaf = ["up", "walk", "down", "lay", "sit", "stand"].indexOf(k) !== -1;
        F(tree, "rectangle", [n[0] - w / 2, n[1] - 15, w, 30], on ? "peach" : "sheet", { seed: 40 + i * 2, sw: on ? 2 : 1.2 });
        var t = T(tree, n[0], n[1] + 6, n[2], { size: 15, weight: leaf || on ? 700 : 400 });
        if (!on) t.style.opacity = .7;
      });
    }

    function stairs(g, down) {
      var pts = down ? [[20, 212], [96, 212], [96, 242], [148, 242], [148, 272], [200, 272], [200, 302]]
        : [[20, 302], [20, 272], [72, 272], [72, 242], [124, 242], [124, 212], [200, 212]];
      S(g, "linearPath", [pts], { sw: 2, seed: 70 });
    }
    function body(g, j, seed) {
      S(g, "circle", [j.head[0], j.head[1], 28], { sw: 2, seed: seed });
      var L = [["neck", "hip"], ["hip", "lk"], ["lk", "lf"], ["hip", "rk"], ["rk", "rf"], ["neck", "le"], ["le", "lh"], ["neck", "re"], ["re", "rh"]];
      L.forEach(function (l, i) { S(g, "line", [j[l[0]][0], j[l[0]][1], j[l[1]][0], j[l[1]][1]], { sw: 2.6, seed: seed + i + 1, rough: .8 }); });
    }
    function mirror(j) { var o = {}; for (var k in j) o[k] = [220 - j[k][0], j[k][1]]; return o; }
    var stand = { head: [110, 122], neck: [110, 142], hip: [110, 214], lk: [103, 258], lf: [101, 300], rk: [117, 258], rf: [119, 300], le: [97, 180], lh: [93, 214], re: [123, 180], rh: [127, 214] };
    var walk1 = { head: [112, 122], neck: [110, 142], hip: [110, 214], lk: [96, 256], lf: [80, 300], rk: [124, 256], rf: [138, 300], le: [124, 178], lh: [136, 204], re: [98, 178], rh: [86, 204] };
    var walk2 = { head: [112, 124], neck: [110, 144], hip: [110, 216], lk: [118, 258], lf: [124, 300], rk: [104, 258], rf: [96, 300], le: [100, 180], lh: [94, 212], re: [120, 180], rh: [126, 212] };
    var climb1 = { head: [96, 96], neck: [92, 116], hip: [84, 184], lk: [72, 232], lf: [58, 272], rk: [108, 210], rf: [112, 242], le: [80, 148], lh: [72, 172], re: [104, 148], rh: [116, 170] };
    var climb2 = { head: [102, 92], neck: [98, 112], hip: [90, 180], lk: [94, 214], lf: [90, 242], rk: [112, 204], rf: [116, 242], le: [86, 144], lh: [80, 170], re: [108, 144], rh: [118, 166] };
    var sit = { head: [150, 126], neck: [150, 146], hip: [150, 222], lk: [100, 226], lf: [98, 300], rk: [106, 222], rf: [104, 300], le: [140, 186], lh: [116, 212], re: [152, 186], rh: [126, 214] };
    var lay = { head: [44, 236], neck: [64, 242], hip: [132, 246], lk: [166, 248], lf: [200, 250], rk: [166, 243], rf: [200, 243], le: [92, 234], lh: [116, 230], re: [94, 252], rh: [118, 254] };

    function drawFigure() {
      figure.innerHTML = "";
      var name = acts[current][0];
      if (name === "walking") { S(figure, "line", [10, 302, 210, 302], { sw: 1.6, seed: 60 }); body(figure, frame ? walk2 : walk1, 100); }
      else if (name === "upstairs") { stairs(figure, false); body(figure, frame ? climb2 : climb1, 120); }
      else if (name === "downstairs") { stairs(figure, true); body(figure, mirror(frame ? climb1 : climb2), 140); }
      else if (name === "sitting") {
        S(figure, "line", [10, 302, 210, 302], { sw: 1.6, seed: 61 });
        S(figure, "path", ["M96 226 L176 226 L176 146 M104 226 L104 302 M170 226 L170 302"], { sw: 2.2, seed: 62, color: "navy" });
        body(figure, sit, 160);
      }
      else if (name === "standing") { S(figure, "line", [10, 302, 210, 302], { sw: 1.6, seed: 63 }); body(figure, stand, 180); }
      else { S(figure, "rectangle", [16, 262, 196, 22], { fill: true, noStroke: true, color: "sky", seed: 64 }); S(figure, "rectangle", [16, 262, 196, 22], { seed: 65 }); body(figure, lay, 200); }
      T(figure, 110, 36, "phone says:", { size: 15 });
      T(figure, 110, 62, name, { size: 24, weight: 700, color: "red" });
    }

    acts.forEach(function (a, i) {
      var b = K.el("button", "btn ghost", a[0]); b.type = "button";
      b.addEventListener("click", function () { current = i; render(); });
      $("acts").appendChild(b);
    });
    function render() {
      drawTree(acts[current][1]); drawFigure();
      [].forEach.call($("acts").children, function (b, i) { b.setAttribute("aria-pressed", i === current ? "true" : "false"); });
    }
    render();
    if (!K.reduce) setInterval(function () {
      var n = acts[current][0];
      if (n === "walking" || n === "upstairs" || n === "downstairs") { frame = 1 - frame; drawFigure(); }
    }, 480);
  })();

  /* =================== Next word =================== */
  (function () {
    var corpus = "Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don't tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist — I really believe he is Antichrist — I will have nothing more to do with you and you are no longer my friend, no longer my faithful slave, as you call yourself! But how do you do? I see I have frightened you — sit down and tell me all the news. " +
      "It was in July, 1805, and the speaker was the well-known Anna Pavlovna Scherer, maid of honor and favorite of the Empress Marya Fedorovna. With these words she greeted Prince Vasili Kuragin, a man of high rank and importance, who was the first to arrive at her reception.";
    var toks = corpus.match(/[A-Za-z0-9'\-]+|[.,!?—]/g);
    var big = {}, freq = {};
    toks.forEach(function (w, i) {
      var k = w.toLowerCase();
      freq[k] = (freq[k] || 0) + 1;
      if (i < toks.length - 1) { big[k] = big[k] || {}; big[k][toks[i + 1]] = (big[k][toks[i + 1]] || 0) + 1; }
    });
    var start = ["Well", ",", "Prince", ","], words, typed;
    function reset() { words = start.slice(); typed = words.map(function () { return false; }); render(); }
    function options(last) {
      var m = big[last.toLowerCase()];
      if (!m) m = { But: 1, I: 1, you: 1 };
      return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; });
    }
    function add(w, byModel) { words.push(w); typed.push(byModel); render(); }
    function render() {
      var box = $("sentence"); box.innerHTML = "";
      words.forEach(function (w, i) {
        var punct = /^[.,!?]$/.test(w);
        if (i && !punct) box.appendChild(document.createTextNode(" "));
        var span = K.el("span", typed[i] ? "typed" : "", w);
        box.appendChild(span);
      });
      box.appendChild(K.el("span", "caret"));
      var row = $("nexts"); row.innerHTML = "";
      row.appendChild(K.el("span", "caption", "next word?"));
      options(words[words.length - 1]).slice(0, 4).forEach(function (w) {
        var b = K.el("button", "btn sage", w); b.type = "button";
        b.addEventListener("click", function () { add(w, false); });
        row.appendChild(b);
      });
    }
    $("ramble").addEventListener("click", function () {
      var n = 0, btn = this; btn.disabled = true;
      (function step() {
        var m = big[words[words.length - 1].toLowerCase()] || { But: 1 };
        var tot = 0, k; for (k in m) tot += m[k];
        var r = Math.random() * tot;
        for (k in m) { r -= m[k]; if (r <= 0) break; }
        add(k, true);
        if (++n < 8) setTimeout(step, K.reduce ? 0 : 220); else btn.disabled = false;
      })();
    });
    $("reset").addEventListener("click", reset);
    reset();
  })();

  /* =================== Molecule =================== */
  (function () {
    var s = $("mol");
    var atoms = [
      ["C", 240, 170], ["C", 320, 150], ["O", 392, 196], ["H", 452, 176],
      ["H", 196, 120], ["H", 188, 204], ["H", 252, 238], ["H", 300, 82], ["H", 360, 96]
    ];
    var bonds = [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]];
    var springs = bonds.map(function (b) { return [b[0], b[1], 0.9]; });
    atoms.forEach(function (_, i) {
      var nb = []; bonds.forEach(function (b) { if (b[0] === i) nb.push(b[1]); if (b[1] === i) nb.push(b[0]); });
      for (var a = 0; a < nb.length; a++) for (var c = a + 1; c < nb.length; c++) springs.push([nb[a], nb[c], 0.25]);
    });
    var p = atoms.map(function (a) { return [a[1], a[2]]; });
    var v = atoms.map(function () { return [0, 0]; });
    springs.forEach(function (sp) { sp.push(Math.hypot(p[sp[0]][0] - p[sp[1]][0], p[sp[0]][1] - p[sp[1]][1])); });

    var bondEls = bonds.map(function () { return E("line", { stroke: "currentColor", "stroke-width": 3.2, "stroke-linecap": "round" }, s); });
    var atomEls = atoms.map(function (a, i) {
      var g = E("g", {}, s);
      var d = a[0] === "H" ? 22 : 36;
      if (a[0] === "C") F(g, "circle", [0, 0, d], "navy", { seed: 10 + i * 3, gap: 3 });
      else if (a[0] === "O") F(g, "circle", [0, 0, d], "red", { seed: 10 + i * 3, gap: 3 });
      else F(g, "circle", [0, 0, d], "sheet", { seed: 10 + i * 3 });
      T(g, 0, 5, a[0], { size: a[0] === "H" ? 12 : 15, weight: 700 });
      return g;
    });
    var arrowEls = atoms.map(function () { var pth = E("path", { fill: "none", stroke: "var(--red)", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, s); return pth; });
    T(s, 40, 40, "ethanol · C₂H₅OH", { size: 17, weight: 700, anchor: "start" });
    var legend = T(s, 40, 300, "", { size: 15, anchor: "start" });

    var showForces = false, heat = 1.2;
    function forces() {
      var f = atoms.map(function () { return [0, 0]; });
      springs.forEach(function (sp) {
        var a = p[sp[0]], b = p[sp[1]], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
        var mag = sp[2] * (d - sp[3]) / d;
        f[sp[0]][0] += mag * dx; f[sp[0]][1] += mag * dy;
        f[sp[1]][0] -= mag * dx; f[sp[1]][1] -= mag * dy;
      });
      return f;
    }
    function drawFrame(f) {
      bonds.forEach(function (b, i) { var l = bondEls[i]; l.setAttribute("x1", p[b[0]][0]); l.setAttribute("y1", p[b[0]][1]); l.setAttribute("x2", p[b[1]][0]); l.setAttribute("y2", p[b[1]][1]); });
      atomEls.forEach(function (g, i) { g.setAttribute("transform", "translate(" + p[i][0].toFixed(1) + " " + p[i][1].toFixed(1) + ")"); });
      arrowEls.forEach(function (a, i) {
        if (!showForces) { a.setAttribute("d", ""); return; }
        var fx = f[i][0] * 7, fy = f[i][1] * 7, len = Math.hypot(fx, fy);
        if (len < 4) { fx *= 4 / (len || 1); fy *= 4 / (len || 1); len = 4; }
        if (len > 60) { fx *= 60 / len; fy *= 60 / len; len = 60; }
        var x0 = p[i][0], y0 = p[i][1], x1 = x0 + fx, y1 = y0 + fy, ux = fx / len, uy = fy / len;
        a.setAttribute("d", "M" + x0 + " " + y0 + " L" + x1 + " " + y1 + " M" + (x1 - ux * 8 - uy * 5) + " " + (y1 - uy * 8 + ux * 5) + " L" + x1 + " " + y1 + " L" + (x1 - ux * 8 + uy * 5) + " " + (y1 - uy * 8 - ux * 5));
      });
      legend.textContent = showForces ? "red arrows = forces = −slope of the energy surface" : "atoms wobble; bonds pull them back";
    }
    function step() {
      var f = forces();
      for (var i = 0; i < p.length; i++) {
        v[i][0] = (v[i][0] + f[i][0] * 0.12 + (Math.random() - .5) * heat * 0.35) * 0.93;
        v[i][1] = (v[i][1] + f[i][1] * 0.12 + (Math.random() - .5) * heat * 0.35) * 0.93;
        p[i][0] += v[i][0]; p[i][1] += v[i][1];
      }
      heat = Math.max(1.2, heat * 0.985);
      drawFrame(forces());
    }
    // nudge into a stretched pose so forces are visible at rest
    p[3][0] += 14; p[7][1] -= 10; p[5][0] -= 10;
    drawFrame(forces());

    var visible = true, running = !K.reduce;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(s);
    (function loop() { if (running && visible) step(); requestAnimationFrame(loop); })();

    $("forces").addEventListener("click", function () {
      showForces = !showForces; this.setAttribute("aria-pressed", showForces ? "true" : "false");
      this.textContent = showForces ? "hide forces" : "show predicted forces";
      drawFrame(forces());
    });
    $("kick").addEventListener("click", function () {
      heat = 9;
      if (K.reduce) { for (var i = 0; i < p.length; i++) { p[i][0] += (Math.random() - .5) * 16; p[i][1] += (Math.random() - .5) * 16; } drawFrame(forces()); }
    });
  })();
})();
