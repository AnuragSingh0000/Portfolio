(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  function ghostDoodle(parent, seed, color) {
    var g = E("g", {}, parent);
    F(g, "path", ["M-13 12 L-13 -2 C -13 -18, 13 -18, 13 -2 L13 12 L8 7 L4 12 L0 7 L-4 12 L-8 7 Z"], color || "sky", { seed: seed, gap: 3 });
    S(g, "circle", [-5, -3, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 3 }).style.color = "var(--sheet)";
    S(g, "circle", [5, -3, 6], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 4 }).style.color = "var(--sheet)";
    S(g, "circle", [-4, -3, 2.5], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 5 });
    S(g, "circle", [6, -3, 2.5], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 6 });
    return g;
  }

  /* =================== Maze =================== */
  (function () {
    var MAP = [
      "###############",
      "#.............#",
      "#.##.#####.##.#",
      "#.#.........#.#",
      "#.#.##.#.##.#.#",
      "#...#..P..#...#",
      "#.#.#.###.#.#.#",
      "#.............#",
      "###############"
    ];
    var W = MAP[0].length, H = MAP.length, C = 36, OX = 0, OY = 6;
    var s = $("maze");
    var wall = function (x, y) { return MAP[y][x] === "#"; };
    var start;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      if (MAP[y][x] === "#") S(s, "rectangle", [OX + x * C + 3, OY + y * C + 3, C - 6, C - 6], { fill: true, noStroke: true, color: "navy", seed: 1000 + y * W + x, gap: 5 });
      if (MAP[y][x] === "P") start = [x, y];
    }
    var pelletLayer = E("g", {}, s), trail = E("path", { fill: "none", stroke: "var(--red)", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: .55 }, s);
    var ghostG = E("g", { class: "mover" }, s); ghostDoodle(ghostG, 50);
    var pac = E("g", { class: "mover" }, s);
    var pacInner = E("g", {}, pac);
    var mouth = E("path", { fill: "var(--peach)", stroke: "currentColor", "stroke-width": 2, "stroke-linejoin": "round" }, pacInner);
    E("circle", { cx: 2, cy: -7, r: 2, fill: "currentColor" }, pacInner);

    // ghost patrols the outer corridor
    var patrol = [];
    for (x = 13; x >= 1; x--) patrol.push([x, 7]);
    for (y = 6; y >= 1; y--) patrol.push([1, y]);
    for (x = 2; x <= 13; x++) patrol.push([x, 1]);
    for (y = 2; y <= 6; y++) patrol.push([13, y]);

    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function moves(p) { return DIRS.filter(function (d) { return !wall(p[0] + d[0], p[1] + d[1]); }); }
    function key(p) { return p[0] + "," + p[1]; }

    function simulate(epoch, seed) {
      var rnd = K.rng(seed), eps = Math.max(0.04, 1 - epoch / 300);
      var pellets = {}, total = 0;
      for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) if (MAP[yy][xx] === ".") { pellets[xx + "," + yy] = 1; total++; }
      var p = start.slice(), path = [p.slice()], ghosts = [], eaten = 0, caught = false, last = [0, 0];
      for (var t = 0; t < 170; t++) {
        var gpos = patrol[(t + 20) % patrol.length];
        var nextG = patrol[(t + 21) % patrol.length];
        var opts = moves(p), d;
        if (rnd() < eps) {
          var noBack = opts.filter(function (o) { return !(o[0] === -last[0] && o[1] === -last[1]); });
          d = (noBack.length ? noBack : opts)[Math.floor(rnd() * (noBack.length ? noBack.length : opts.length))];
        } else {
          // BFS to nearest pellet, avoiding the ghost's next cells
          var danger = {}; danger[key(gpos)] = 1; danger[key(nextG)] = 1;
          var q = [[p[0], p[1], null]], seen = {}; seen[key(p)] = 1; d = null;
          while (q.length) {
            var cur = q.shift();
            if (pellets[cur[0] + "," + cur[1]] && cur[2]) { d = cur[2]; break; }
            moves(cur).forEach(function (m) {
              var n = [cur[0] + m[0], cur[1] + m[1]];
              if (seen[key(n)] || danger[key(n)]) return;
              seen[key(n)] = 1; q.push([n[0], n[1], cur[2] || m]);
            });
          }
          if (!d) d = opts.filter(function (o) { return !danger[key([p[0] + o[0], p[1] + o[1]])]; })[0] || opts[0];
        }
        last = d;
        p = [p[0] + d[0], p[1] + d[1]];
        path.push(p.slice()); ghosts.push(nextG);
        if (pellets[key(p)]) { delete pellets[key(p)]; eaten++; }
        if (key(p) === key(nextG) || key(p) === key(gpos)) { caught = true; break; }
        if (eaten === total) break;
      }
      return { path: path, ghosts: ghosts, eaten: eaten, total: total, caught: caught };
    }

    var timer = null, runId = 0;
    function drawPellets(eatenSet) {
      pelletLayer.innerHTML = "";
      for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++)
        if (MAP[yy][xx] === "." && !eatenSet[xx + "," + yy]) E("circle", { cx: OX + xx * C + C / 2, cy: OY + yy * C + C / 2, r: 3.4, fill: "currentColor" }, pelletLayer);
    }
    function place(g, cell, dir) {
      g.style.transform = "translate(" + (OX + cell[0] * C + C / 2) + "px," + (OY + cell[1] * C + C / 2) + "px)";
      if (dir) pacInner.setAttribute("transform", "rotate(" + (dir[0] === 1 ? 0 : dir[0] === -1 ? 180 : dir[1] === 1 ? 90 : -90) + ")");
    }
    function setMouth(open) {
      var a = open ? 0.6 : 0.12, r = 14;
      mouth.setAttribute("d", "M0 0 L" + (r * Math.cos(a)) + " " + (-r * Math.sin(a)) + " A" + r + " " + r + " 0 1 0 " + (r * Math.cos(a)) + " " + (r * Math.sin(a)) + " Z");
    }

    function run() {
      var epoch = +$("ep").value, id = ++runId;
      var res = simulate(epoch, 1234 + epoch * 7 + Math.floor(Math.random() * 3));
      var eatenSet = {}, i = 0;
      clearInterval(timer);
      drawPellets(eatenSet); trail.setAttribute("d", "");
      place(pac, res.path[0], [1, 0]); place(ghostG, patrol[20]); setMouth(true);
      $("score").textContent = "";
      function finish() {
        var d = "M" + res.path.map(function (c) { return (OX + c[0] * C + C / 2) + " " + (OY + c[1] * C + C / 2); }).join(" L");
        trail.setAttribute("d", d);
        $("score").innerHTML = res.caught
          ? "ate <b>" + res.eaten + "/" + res.total + "</b>, then a ghost caught it"
          : res.eaten === res.total ? "cleared the board in <b>" + (res.path.length - 1) + "</b> steps" : "ate <b>" + res.eaten + "/" + res.total + "</b> before time ran out";
      }
      if (K.reduce) {
        res.path.forEach(function (c) { eatenSet[key(c)] = 1; });
        drawPellets(eatenSet); place(pac, res.path[res.path.length - 1]); place(ghostG, res.ghosts[res.ghosts.length - 1] || patrol[20]); finish(); return;
      }
      timer = setInterval(function () {
        if (id !== runId) return clearInterval(timer);
        i++;
        if (i >= res.path.length) { clearInterval(timer); finish(); return; }
        var prev = res.path[i - 1], c = res.path[i];
        eatenSet[key(c)] = 1;
        drawPellets(eatenSet);
        place(pac, c, [c[0] - prev[0], c[1] - prev[1]]);
        place(ghostG, res.ghosts[i - 1]);
        setMouth(i % 2 === 0);
        var d = "M" + res.path.slice(0, i + 1).map(function (cc) { return (OX + cc[0] * C + C / 2) + " " + (OY + cc[1] * C + C / 2); }).join(" L");
        trail.setAttribute("d", d);
      }, 110);
    }

    $("ep").addEventListener("input", function () { $("epout").textContent = this.value; });
    $("ep").addEventListener("change", run);
    $("play").addEventListener("click", run);
    drawPellets({}); place(pac, start, [1, 0]); place(ghostG, patrol[20]); setMouth(true);
    $("score").textContent = "slide the epoch, then run an episode";
  })();

  /* =================== Frame stacking =================== */
  (function () {
    var s = $("flip");
    T(s, 140, 30, "one frame", { size: 20, weight: 700 });
    F(s, "rectangle", [60, 50, 160, 120], "sheet", { seed: 1 });
    var g1 = E("g", { transform: "translate(140 110) scale(1.6)" }, s); ghostDoodle(g1, 10);
    T(s, 190, 80, "?", { size: 30, color: "red", weight: 700 });
    T(s, 140, 200, "left? right? no idea", { size: 16 });

    T(s, 430, 30, "four stacked frames", { size: 20, weight: 700 });
    for (var i = 0; i < 4; i++) {
      F(s, "rectangle", [300 + i * 22, 50 + i * 8, 150, 110], "sheet", { seed: 20 + i * 3, sw: 1.4 });
    }
    for (var j = 0; j < 4; j++) {
      var g = E("g", { transform: "translate(" + (380 + j * 26) + " " + (120) + ") scale(1.3)", opacity: 0.25 + j * 0.25 }, s);
      ghostDoodle(g, 40 + j * 7);
    }
    S(s, "path", ["M360 180 L 500 180"], { sw: 2.2, color: "red", seed: 70 });
    S(s, "linearPath", [[[488, 172], [502, 180], [488, 188]]], { sw: 2.2, color: "red", seed: 71 });
    T(s, 430, 206, "heading right. run!", { size: 16, color: "red" });
  })();
})();
