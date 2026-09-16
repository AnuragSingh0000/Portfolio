(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;

  function along(guide, t) { var L = guide.getTotalLength(); var a = guide.getPointAtLength(t * L), b = guide.getPointAtLength(Math.min(L, t * L + 1)); return [a.x, a.y, Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI]; }

  /* =================== Race =================== */
  (function () {
    var s = $("race");
    var bypassD = "M70 64 L570 64", kernelD = "M70 150 C 180 150, 220 250, 320 250 S 460 150, 570 150";
    F(s, "rectangle", [16, 30, 44, 150], "sky", { seed: 1, gap: 5, angle: 60 });
    T(s, 38, 204, "NIC", { size: 17, weight: 700 });
    F(s, "rectangle", [580, 30, 30, 150], "sage", { seed: 3, gap: 5 });
    T(s, 595, 204, "wire", { size: 17, weight: 700 });
    S(s, "path", [bypassD], { sw: 1.2, dash: [5, 7], seed: 5 });
    S(s, "path", [kernelD], { sw: 1.2, dash: [5, 7], seed: 6 });
    F(s, "rectangle", [262, 224, 116, 54], "peach", { seed: 7, sw: 2 });
    T(s, 320, 256, "kernel", { size: 19, weight: 700 });
    T(s, 320, 274, "post office", { size: 13 });
    T(s, 320, 40, "DPDK lane: skip the post office", { size: 17, weight: 700 });
    T(s, 480, 130, "the normal way", { size: 16 });
    var gB = E("path", { d: bypassD, fill: "none" }, s), gK = E("path", { d: kernelD, fill: "none" }, s);
    var layer = E("g", {}, s);

    // at rest: a few planes parked mid-flight
    function parked() {
      layer.innerHTML = "";
      [0.2, 0.45, 0.7, 0.92].forEach(function (t) { var p = along(gB, t); var g = K.plane(layer, 13); g.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ") rotate(" + p[2] + ")"); });
      var p = along(gK, 0.35); var g = K.plane(layer, 13); g.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ") rotate(" + p[2] + ")");
    }
    parked();
    $("tally").textContent = "planes landed: – vs –";

    var busy = false;
    $("burst").addEventListener("click", function () {
      if (busy) return; busy = true; this.disabled = true;
      var btn = this;
      layer.innerHTML = "";
      var planes = [], landedB = 0, landedK = 0;
      for (var i = 0; i < 9; i++) planes.push({ lane: "B", start: i * 333, dur: 1000 });
      for (var j = 0; j < 2; j++) planes.push({ lane: "K", start: j * 1500, dur: 1500, hold: 700 });
      planes.forEach(function (p) { p.g = K.plane(layer, 13); p.g.setAttribute("opacity", 0); });
      if (K.reduce) { landedB = 9; landedK = 2; done(); return; }
      var t0 = null;
      function frame(ts) {
        if (!t0) t0 = ts;
        var el = ts - t0, active = false;
        landedB = 0; landedK = 0;
        planes.forEach(function (p) {
          var total = p.dur + (p.hold || 0), local = el - p.start;
          if (local < 0) { active = true; return; }
          if (local >= total) { p.g.setAttribute("opacity", 0); if (p.lane === "B") landedB++; else landedK++; return; }
          active = true;
          var t;
          if (p.hold) { var half = p.dur / 2; t = local < half ? local / p.dur : local < half + p.hold ? 0.5 : (local - p.hold) / p.dur; }
          else t = local / p.dur;
          var pos = along(p.lane === "B" ? gB : gK, t);
          p.g.setAttribute("opacity", 1);
          p.g.setAttribute("transform", "translate(" + pos[0] + " " + pos[1] + ") rotate(" + pos[2] + ")");
        });
        $("tally").innerHTML = "planes landed: <b>" + landedB + "</b> via DPDK vs <b>" + landedK + "</b> via the kernel";
        if (active) requestAnimationFrame(frame); else done();
      }
      requestAnimationFrame(frame);
      function done() {
        $("tally").innerHTML = "planes landed: <b>" + landedB + "</b> via DPDK vs <b>" + landedK + "</b> via the kernel → <b>4.5×</b>";
        busy = false; btn.disabled = false; parked();
      }
    });
  })();

  /* =================== Traceroute =================== */
  (function () {
    var s = $("trace");
    var xs = [50, 160, 270, 380, 490, 590], Y = 120;
    var names = ["you", "hop 1", "hop 2", "hop 3", "hop 4", "server"];
    var ips = ["", "10.0.0.1", "192.0.2.17", "198.51.100.8", "203.0.113.42", "203.0.113.99"];
    var ms = ["", "1.2", "4.8", "11.3", "19.6", "24.1"];
    for (var i = 0; i < 5; i++) S(s, "line", [xs[i] + 24, Y, xs[i + 1] - 24, Y], { sw: 1.4, dash: [4, 6], seed: 10 + i });
    var nodeG = [];
    xs.forEach(function (x, i) {
      var g = E("g", {}, s); nodeG.push(g);
      if (i === 0) { F(g, "rectangle", [x - 24, Y - 16, 48, 32], "sheet", { seed: 30 }); S(g, "line", [x - 30, Y + 20, x + 30, Y + 20], { sw: 2.4, seed: 31 }); }
      else if (i === 5) { F(g, "rectangle", [x - 20, Y - 30, 40, 60], "sage", { seed: 32 }); S(g, "line", [x - 12, Y - 14, x + 12, Y - 14], { sw: 1.4, seed: 33 }); S(g, "line", [x - 12, Y, x + 12, Y], { sw: 1.4, seed: 34 }); }
      else { F(g, "circle", [x, Y, 44], "sky", { seed: 40 + i * 3 }); S(g, "path", ["M" + (x - 10) + " " + (Y - 4) + " l10 -8 l10 8 M" + (x - 10) + " " + (Y + 4) + " l10 8 l10 -8"], { sw: 1.6, seed: 60 + i }); }
      T(s, x, Y + 50, names[i], { size: 16, weight: 700 });
    });
    var marks = E("g", {}, s), fly = E("g", {}, s), gauge = E("g", {}, s);
    var ttl = 1, busy = false, found = [];

    function drawGauge(bars, x) {
      gauge.innerHTML = "";
      if (bars == null) return;
      T(gauge, x, 36, "fuel (TTL)", { size: 13 });
      for (var b = 0; b < 5; b++) {
        var r = S(gauge, "rectangle", [x - 30 + b * 12, 44, 10, 14], b < bars ? { fill: true, fillStyle: "solid", noStroke: true, color: "peach", seed: 80 + b } : { sw: 1, seed: 90 + b });
      }
    }
    function listHops() {
      var el = $("hops"); el.innerHTML = "";
      found.forEach(function (h) { el.appendChild(K.el("div", null, h)); });
    }
    function animate(from, to, dur, back, cb) {
      fly.innerHTML = "";
      var g;
      if (back) { g = E("g", {}, fly); F(g, "rectangle", [-12, -8, 24, 16], "sheet", { seed: 99, sw: 1.4 }); S(g, "linearPath", [[[-12, -8], [0, 1], [12, -8]]], { sw: 1.2, seed: 98 }); }
      else g = K.plane(fly, 13);
      if (K.reduce) { fly.innerHTML = ""; cb(); return; }
      var t0 = null;
      function frame(ts) {
        if (!t0) t0 = ts;
        var t = Math.min(1, (ts - t0) / dur), x = from + (to - from) * t, y = Y - 34 - Math.sin(t * Math.PI) * 18;
        g.setAttribute("transform", "translate(" + x + " " + y + ")" + (back ? "" : " rotate(" + (to > from ? 0 : 180) + ")"));
        if (!back) { var hopsPassed = Math.floor((x - xs[0] + 1) / 110); drawGauge(Math.max(0, ttl - hopsPassed), x); }
        if (t < 1) requestAnimationFrame(frame); else { fly.innerHTML = ""; cb(); }
      }
      requestAnimationFrame(frame);
    }
    $("probe").addEventListener("click", function () {
      if (busy || ttl > 5) return;
      busy = true; var btn = this; btn.disabled = true;
      var target = Math.min(ttl, 5);
      animate(xs[0], xs[target], 450 * target, false, function () {
        drawGauge(null);
        var x = xs[target];
        if (target < 5) { S(marks, "path", ["M" + (x - 14) + " " + (Y - 52) + " l8 -10 l6 8 l8 -12 l6 10"], { sw: 1.8, color: "red", seed: 200 + target }); }
        T(marks, x, Y - 70, target < 5 ? "out of fuel!" : "arrived", { size: 14, color: "red", rotate: -4 });
        animate(x, xs[0], 380 * target, true, function () {
          found.push(target + "  " + ips[target].padEnd(15, " ") + " " + ms[target] + " ms   " + (target < 5 ? "(time exceeded)" : "(port unreachable: destination!)"));
          listHops();
          S(marks, "circle", [xs[target], Y, target === 5 ? 84 : 62], { color: "red", sw: 2, seed: 300 + target });
          ttl++;
          busy = false;
          btn.disabled = ttl > 5;
          btn.textContent = ttl > 5 ? "route traced ✓" : "send probe (TTL " + ttl + ")";
        });
      });
    });
    $("treset").addEventListener("click", function () {
      if (busy) return;
      ttl = 1; found = []; marks.innerHTML = ""; listHops();
      var b = $("probe"); b.disabled = false; b.textContent = "send probe (TTL 1)";
    });
    $("hops").textContent = "no hops discovered yet";
  })();
})();
