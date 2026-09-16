(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  /* =================== B+ tree (order 4: max 3 keys) =================== */
  (function () {
    var MAX = 3, root, lastKey = null, notes = [];
    function Node(leaf) { return { leaf: leaf, keys: [], kids: [] }; }

    function insert(node, key) {
      if (node.leaf) {
        var i = 0; while (i < node.keys.length && node.keys[i] < key) i++;
        node.keys.splice(i, 0, key);
      } else {
        var c = 0; while (c < node.keys.length && key >= node.keys[c]) c++;
        var split = insert(node.kids[c], key);
        if (split) { node.keys.splice(c, 0, split.key); node.kids.splice(c + 1, 0, split.right); }
      }
      if (node.keys.length <= MAX) return null;
      var right = Node(node.leaf), up;
      if (node.leaf) {
        right.keys = node.keys.splice(2);
        up = right.keys[0];
        right.next = node.next; node.next = right;
        notes.push("leaf split, copied <b>" + up + "</b> up");
      } else {
        up = node.keys[2];
        right.keys = node.keys.splice(3);
        node.keys.splice(2);
        right.kids = node.kids.splice(3);
        notes.push("inner split, pushed <b>" + up + "</b> up");
      }
      return { key: up, right: right };
    }
    function has(node, key) {
      while (!node.leaf) { var c = 0; while (c < node.keys.length && key >= node.keys[c]) c++; node = node.kids[c]; }
      return node.keys.indexOf(key) !== -1;
    }
    function add(key) {
      notes = [];
      if (has(root, key)) { $("treenote").innerHTML = "<b>" + key + "</b> already exists: UNIQUE constraint says no."; return; }
      var split = insert(root, key);
      if (split) { var r = Node(false); r.keys = [split.key]; r.kids = [root, split.right]; root = r; notes.push("the root split, so the tree grew a level"); }
      lastKey = key;
      $("treenote").innerHTML = "inserted <b>" + key + "</b>" + (notes.length ? ": " + notes.join(", then ") : ". It fit, no split needed.");
      draw();
    }

    function draw() {
      var s = $("tree"); s.innerHTML = "";
      var levels = [], q = [[root, 0]];
      while (q.length) { var it = q.shift(); (levels[it[1]] = levels[it[1]] || []).push(it[0]); it[0].kids.forEach(function (k) { q.push([k, it[1] + 1]); }); }
      var CW = 34, GAP = 16, H = 32, LH = 86;
      var wOf = function (n) { return n.keys.length * CW; };
      var leaves = levels[levels.length - 1], x = 20;
      leaves.forEach(function (n) { n.x = x; x += wOf(n) + GAP; });
      var width = Math.max(600, x + 4);
      var offset = (width - x) / 2;
      leaves.forEach(function (n) { n.x += offset; });
      for (var l = levels.length - 2; l >= 0; l--) levels[l].forEach(function (n) {
        var a = n.kids[0], b = n.kids[n.kids.length - 1];
        n.x = ((a.x + b.x + wOf(b)) / 2) - wOf(n) / 2;
      });
      var height = 30 + levels.length * LH;
      s.setAttribute("viewBox", "0 0 " + width + " " + height);
      levels.forEach(function (lv, depth) {
        lv.forEach(function (n, ni) {
          n.y = 20 + depth * LH;
          n.kids.forEach(function (k, ki) {
            var px = n.x + ki * CW, cx = k.x + wOf(k) / 2;
            S(s, "line", [px, n.y + H, cx, 20 + (depth + 1) * LH], { sw: 1.3, seed: 500 + depth * 50 + ni * 7 + ki });
          });
        });
      });
      levels.forEach(function (lv, depth) {
        lv.forEach(function (n, ni) {
          var seed = 100 + depth * 40 + ni * 6;
          F(s, "rectangle", [n.x, n.y, wOf(n), H], n.leaf ? "sage" : "sky", { seed: seed, gap: 6, sw: 1.8 });
          n.keys.forEach(function (k, i) {
            if (i) S(s, "line", [n.x + i * CW, n.y + 2, n.x + i * CW, n.y + H - 2], { sw: 1, seed: seed + 10 + i });
            if (k === lastKey && n.leaf) S(s, "rectangle", [n.x + i * CW + 3, n.y + 3, CW - 6, H - 6], { fill: true, fillStyle: "solid", noStroke: true, color: "peach", seed: seed + 20 });
            T(s, n.x + i * CW + CW / 2, n.y + 22, String(k), { size: 16, weight: 700 });
          });
          if (n.leaf && n.next) {
            var y = n.y + H / 2, x1 = n.x + wOf(n) + 2, x2 = n.next.x - 2;
            S(s, "line", [x1, y, x2, y], { sw: 1.2, dash: [3, 3], color: "red", seed: seed + 30 });
          }
        });
      });
    }
    function reset() {
      root = Node(true); lastKey = null;
      [10, 20, 5, 6, 12, 30, 7, 17].forEach(function (k) { notes = []; var sp = insert(root, k); if (sp) { var r = Node(false); r.keys = [sp.key]; r.kids = [root, sp.right]; root = r; } });
      $("treenote").textContent = "Eight keys are already in. Add one and watch the boxes split.";
      draw();
    }
    $("ins").addEventListener("click", function () { var v = parseInt($("key").value, 10); if (v >= 1 && v <= 999) add(v); else $("treenote").textContent = "CHECK constraint: keys must be between 1 and 999."; });
    $("key").addEventListener("keydown", function (e) { if (e.key === "Enter") $("ins").click(); });
    $("rnd").addEventListener("click", function () { var v; do { v = 1 + Math.floor(Math.random() * 99); } while (has(root, v)); $("key").value = v; add(v); });
    $("treset").addEventListener("click", reset);
    reset();
  })();

  /* =================== WAL =================== */
  (function () {
    var mem = [], log = [], crashed = false, t1 = false, t2 = false;
    var stain = $("stain");
    F(stain, "circle", [110, 90, 150], "peach", { seed: 3, gap: 4 });
    S(stain, "circle", [60, 160, 30], { fill: true, noStroke: true, color: "peach", seed: 5 });
    function render(note) {
      var m = $("mem"); m.innerHTML = "";
      if (crashed) m.appendChild(K.el("div", "row pending", "(gone. it's all coffee now)"));
      else if (!mem.length) m.appendChild(K.el("div", "row pending", "(empty table)"));
      mem.forEach(function (r) { m.appendChild(K.el("div", "row" + (r.pending ? " pending" : ""), (r.pending ? "? " : "✓ ") + r.name)); });
      var l = $("log"); l.innerHTML = "";
      if (!log.length) l.appendChild(K.el("div", "row pending", "(nothing written yet)"));
      log.forEach(function (e) { l.appendChild(K.el("div", "row" + (e.skip ? " skip" : ""), e.text)); });
      stain.classList.toggle("on", crashed);
      $("t1").disabled = t1 || crashed; $("t2").disabled = t2 || crashed || !t1;
      $("crash").disabled = crashed || !t1; $("recover").disabled = !crashed;
      if (note) $("walnote").innerHTML = note;
    }
    $("t1").addEventListener("click", function () {
      log.push({ text: "T1 BEGIN" }, { text: "T1 INSERT Neeraj Chopra" }, { text: "T1 INSERT Mirabai Chanu" }, { text: "T1 COMMIT", t: 1 });
      mem.push({ name: "Neeraj Chopra" }, { name: "Mirabai Chanu" });
      t1 = true; render("Diary first, table second. T1 is <b>committed</b>.");
    });
    $("t2").addEventListener("click", function () {
      log.push({ text: "T2 BEGIN", t2: 1 }, { text: "T2 INSERT PV Sindhu", t2: 1 });
      mem.push({ name: "PV Sindhu", pending: true });
      t2 = true; render("T2 is mid-flight: logged, but <b>not committed</b>.");
    });
    $("crash").addEventListener("click", function () {
      crashed = true; mem = [];
      render("Crash! Everything in memory is gone. The diary was on disk, though.");
    });
    $("recover").addEventListener("click", function () {
      crashed = false;
      log.forEach(function (e) { if (e.t2) e.skip = true; });
      mem = [{ name: "Neeraj Chopra" }, { name: "Mirabai Chanu" }];
      render("Recovery: <b>redo T1</b> (it committed), <b>discard T2</b> (it never did). Atomic and durable.");
    });
    render("Start a transaction.");
  })();

  /* =================== Sharding =================== */
  (function () {
    var s = $("shards"), N = 3, counts = [0, 0, 0];
    var CX = [110, 300, 490];
    function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.toLowerCase().charCodeAt(i)) >>> 0; return h; }
    CX.forEach(function (x, i) {
      F(s, "rectangle", [x - 60, 90, 120, 140], "sky", { seed: 10 + i * 5, gap: 7 });
      S(s, "rectangle", [x - 48, 110, 96, 44], { sw: 1.4, seed: 30 + i });
      S(s, "rectangle", [x - 48, 166, 96, 44], { sw: 1.4, seed: 40 + i });
      S(s, "line", [x - 14, 132, x + 14, 132], { sw: 2.4, seed: 50 + i });
      S(s, "line", [x - 14, 188, x + 14, 188], { sw: 2.4, seed: 60 + i });
      T(s, x, 246, "shard " + i, { size: 16, weight: 700 });
    });
    var countEls = CX.map(function (x) { return T(s, x, 80, "0 rows", { size: 15 }); });
    var fly = E("g", {}, s);
    function file(name, animate) {
      name = name.trim(); if (!name) return;
      var h = hash(name), shard = h % N, x = CX[shard];
      var done = function () {
        counts[shard]++; countEls[shard].textContent = counts[shard] + (counts[shard] === 1 ? " row" : " rows");
        $("shardnote").innerHTML = "hash('" + name + "') % 3 = <b>" + shard + "</b> → filed in shard " + shard;
      };
      if (!animate || K.reduce) { done(); return; }
      fly.innerHTML = "";
      var g = E("g", {}, fly);
      F(g, "rectangle", [-26, -14, 52, 28], "sheet", { seed: 90, sw: 1.4 });
      T(g, 0, 5, name.length > 7 ? name.slice(0, 6) + "…" : name, { size: 12 });
      var t0 = null;
      (function frame(ts) {
        if (!t0) t0 = ts;
        var t = Math.min(1, (ts - t0) / 700), px = 300 + (x - 300) * t, py = 24 + 108 * t * t;
        g.setAttribute("transform", "translate(" + px + " " + py + ") rotate(" + (t * 12 - 6) + ")");
        if (t < 1) requestAnimationFrame(frame); else { fly.innerHTML = ""; done(); }
      })(performance.now());
    }
    ["Neeraj", "Mirabai", "Lakshya", "Manu", "Nikhat", "Sreejesh"].forEach(function (n) { file(n, false); });
    $("shardnote").textContent = "Six athletes are already filed. Add another.";
    $("file").addEventListener("click", function () { file($("athlete").value, true); });
    $("athlete").addEventListener("keydown", function (e) { if (e.key === "Enter") $("file").click(); });
  })();

  /* =================== QR doodle =================== */
  (function () {
    var s = $("qr"), r = K.rng(2026), n = 13, c = 120 / n;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var finder = (x < 4 && y < 4) || (x > 8 && y < 4) || (x < 4 && y > 8);
      if (finder) continue;
      if (r() > 0.55) S(s, "rectangle", [x * c + 1, y * c + 1, c - 2, c - 2], { fill: true, fillStyle: "solid", noStroke: true, seed: y * n + x + 1, rough: .4 });
    }
    [[0, 0], [9, 0], [0, 9]].forEach(function (p, i) {
      S(s, "rectangle", [p[0] * c + 2, p[1] * c + 2, 4 * c - 4, 4 * c - 4], { sw: 3, seed: 400 + i });
      S(s, "rectangle", [p[0] * c + c + 2, p[1] * c + c + 2, 2 * c - 4, 2 * c - 4], { fill: true, fillStyle: "solid", noStroke: true, seed: 410 + i });
    });
  })();
})();
