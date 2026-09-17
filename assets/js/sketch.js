/* ==========================================================
   Sketch: shared drawing helpers, characters, nav & footer.
   Every shape goes through S(), which uses rough.js for the
   hand-drawn wobble and falls back to plain SVG without it.
   ========================================================== */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seedCounter = 17;
  var root = document.body.getAttribute("data-root") || "./";
  var onFile = location.protocol === "file:";

  function E(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in (attrs || {})) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function T(parent, x, y, str, o) {
    o = o || {};
    var t = E("text", { x: x, y: y, "text-anchor": o.anchor || "middle", "font-size": o.size || 16 }, parent);
    if (o.color) t.style.fill = "var(--" + o.color + ")";
    if (o.weight) t.setAttribute("font-weight", o.weight);
    if (o.family) t.style.fontFamily = o.family;
    if (o.rotate) t.setAttribute("transform", "rotate(" + o.rotate + " " + x + " " + y + ")");
    t.textContent = str;
    return t;
  }

  /* kind: circle(x,y,d) ellipse(x,y,w,h) rectangle(x,y,w,h) line(x1,y1,x2,y2) path(d) polygon(pts) linearPath(pts) */
  function S(parent, kind, args, o) {
    o = o || {};
    var svg = parent.ownerSVGElement || parent;
    var opt = { stroke: "currentColor", strokeWidth: o.sw || 1.7, roughness: o.rough != null ? o.rough : 1.3, bowing: 1, seed: o.seed || (seedCounter++) };
    if (o.fill) {
      opt.fill = "currentColor";
      opt.fillStyle = o.fillStyle || "hachure";
      opt.hachureGap = o.gap || 5;
      opt.fillWeight = o.fw || 1.5;
      opt.hachureAngle = o.angle != null ? o.angle : -41;
    }
    if (o.noStroke) opt.stroke = "none";
    if (o.dash) opt.strokeLineDash = o.dash;
    var node;
    if (window.rough) {
      var r = rough.svg(svg);
      node = r[kind].apply(r, args.concat([opt]));
    } else {
      var a = { stroke: opt.stroke, "stroke-width": opt.strokeWidth, fill: o.fill ? "currentColor" : "none", "fill-opacity": o.fill && o.fillStyle !== "solid" ? 0.55 : 1 };
      if (o.dash) a["stroke-dasharray"] = o.dash.join(" ");
      node = E("g", {});
      var m = function (base) { for (var k in a) base[k] = a[k]; return base; };
      if (kind === "circle") E("circle", m({ cx: args[0], cy: args[1], r: args[2] / 2 }), node);
      else if (kind === "ellipse") E("ellipse", m({ cx: args[0], cy: args[1], rx: args[2] / 2, ry: args[3] / 2 }), node);
      else if (kind === "rectangle") E("rect", m({ x: args[0], y: args[1], width: args[2], height: args[3] }), node);
      else if (kind === "line") E("line", m({ x1: args[0], y1: args[1], x2: args[2], y2: args[3] }), node);
      else if (kind === "path") E("path", m({ d: args[0] }), node);
      else if (kind === "polygon") E("polygon", m({ points: args[0].map(function (p) { return p.join(","); }).join(" ") }), node);
      else if (kind === "linearPath") { var pl = m({ points: args[0].map(function (p) { return p.join(","); }).join(" ") }); pl.fill = "none"; E("polyline", pl, node); }
    }
    if (o.color) node.style.color = "var(--" + o.color + ")";
    if (o.cls) node.setAttribute("class", o.cls);
    parent.appendChild(node);
    return node;
  }

  /* marker fill + ink outline in one call */
  function filled(parent, kind, args, color, o) {
    o = o || {};
    var fo = { fill: true, noStroke: true, color: color, fillStyle: o.fillStyle || (color === "sheet" ? "solid" : undefined), gap: o.gap, angle: o.angle, seed: o.seed ? o.seed + 1 : undefined };
    var f = S(parent, kind, args, fo);
    if (color === "sheet") f.style.color = "var(--sheet)";
    var s = S(parent, kind, args, { sw: o.sw, seed: o.seed, color: o.inkColor });
    return [f, s];
  }

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  /* ---------- characters ---------- */

  /* Anurag: short swept-up dark hair, rectangular glasses, navy blazer, white shirt, blue lanyard. Head centre ~ (0,20). */
  function avatar(parent, x, y, s, o) {
    o = o || {};
    var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + s + ")", class: "avatar" }, parent);
    var seed = o.seed || 300;
    if (!o.headOnly) {
      filled(g, "path", ["M-58 150 C -54 98, -34 82, 0 80 C 34 82, 54 98, 58 150 Z"], "navy", { seed: seed, gap: 3.4, angle: 60 });
      var shirt = S(g, "polygon", [[[-15, 80], [15, 80], [0, 124]]], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 3 });
      shirt.style.color = "var(--sheet)";
      S(g, "path", ["M-17 82 L-3 126 M17 82 L3 126"], { sw: 1.8, seed: seed + 4 });
      S(g, "path", ["M-11 82 C -8 108, -4 128, 0 150"], { sw: 3.2, color: "sky", seed: seed + 5, rough: 0.8 });
      S(g, "path", ["M11 82 C 8 108, 4 128, 0 150"], { sw: 3.2, color: "sky", seed: seed + 6, rough: 0.8 });
      if (o.wave) {
        var arm = E("g", { class: "wave-arm" }, g);
        S(arm, "path", ["M44 98 C 60 80, 68 58, 72 40"], { sw: 7, color: "navy", seed: seed + 7, rough: 0.8 });
        filled(arm, "circle", [74, 32, 18], "sheet", { seed: seed + 8 });
      }
      filled(g, "rectangle", [-9, 50, 18, 32], "sheet", { seed: seed + 9, sw: 1.4 });
    }
    filled(g, "ellipse", [-33, 26, 11, 18], "sheet", { seed: seed + 10, sw: 1.4 });
    filled(g, "ellipse", [33, 26, 11, 18], "sheet", { seed: seed + 11, sw: 1.4 });
    filled(g, "ellipse", [0, 22, 64, 76], "sheet", { seed: seed + 12 });
    S(g, "path", ["M-33 14 C -38 -16, -22 -34, 2 -32 C 24 -34, 38 -18, 33 10 C 28 -4, 16 -10, 2 -8 C -12 -10, -26 -2, -33 14 Z"],
      { fill: true, noStroke: true, gap: 2.2, angle: 70, seed: seed + 13 });
    S(g, "path", ["M-33 14 C -38 -16, -22 -34, 2 -32 C 24 -34, 38 -18, 33 10"], { sw: 2, seed: seed + 14 });
    S(g, "path", ["M-12 -30 C -4 -44, 14 -44, 24 -32 M-2 -31 C 4 -41, 16 -40, 20 -34"], { sw: 1.8, seed: seed + 15 });
    S(g, "path", ["M-24 9 L-8 8 M8 8 L24 9"], { sw: 2.2, seed: seed + 16, rough: 0.6 });
    S(g, "rectangle", [-27, 14, 22, 15], { sw: 2.2, seed: seed + 17, rough: 0.7 });
    S(g, "rectangle", [5, 14, 22, 15], { sw: 2.2, seed: seed + 18, rough: 0.7 });
    S(g, "path", ["M-5 19 L5 19 M-27 18 L-33 20 M27 18 L33 20"], { sw: 1.6, seed: seed + 19, rough: 0.5 });
    S(g, "circle", [-16, 22, 4], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 20 });
    S(g, "circle", [16, 22, 4], { fill: true, fillStyle: "solid", noStroke: true, seed: seed + 21 });
    S(g, "path", ["M1 28 L-3 38 L3 39"], { sw: 1.5, seed: seed + 22, rough: 0.6 });
    S(g, "path", [o.smile ? "M-9 46 Q 0 53 9 46" : "M-8 48 Q 0 50 8 47"], { sw: 1.8, seed: seed + 23, rough: 0.5 });
    return g;
  }

  /* The Knight from Hollow Knight, as a doodle. Centre of head at (x,y). */
  function knight(parent, x, y, s, o) {
    o = o || {};
    var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + (s || 1) + ")" }, parent);
    var ink = o.onNight ? "#e6eef3" : null;
    var cloak = S(g, "path", ["M-26 46 Q 0 26 26 46 L 30 80 Q 0 90 -30 80 Z"], { fill: true, fillStyle: "solid", noStroke: true, seed: 901 });
    cloak.style.color = o.onNight ? "#2a3d52" : "var(--ink)";
    var h1 = S(g, "path", ["M-14 -12 C -22 -30, -20 -44, -14 -54"], { sw: 2.2, seed: 902 });
    var h2 = S(g, "path", ["M14 -12 C 22 -30, 20 -44, 14 -54"], { sw: 2.2, seed: 903 });
    var head = S(g, "ellipse", [0, 6, 50, 52], { fill: true, fillStyle: "solid", seed: 904 });
    head.style.color = o.onNight ? "#eef4f6" : "var(--sheet)";
    var outline = S(g, "ellipse", [0, 6, 52, 54], { sw: 2, seed: 905 });
    var e1 = S(g, "ellipse", [-9, 9, 9, 15], { fill: true, fillStyle: "solid", noStroke: true, seed: 906 });
    var e2 = S(g, "ellipse", [9, 9, 9, 15], { fill: true, fillStyle: "solid", noStroke: true, seed: 907 });
    if (ink) [h1, h2, outline].forEach(function (n) { n.style.color = ink; });
    if (o.onNight) [e1, e2].forEach(function (n) { n.style.color = "#0b1117"; });
    return g;
  }

  function hornet(parent, x, y, s) {
    var g = E("g", { transform: "translate(" + x + " " + y + ") scale(" + (s || 1) + ")" }, parent);
    S(g, "polygon", [[[-26, 80], [26, 80], [9, 24], [-9, 24]]], { fill: true, fillStyle: "solid", noStroke: true, color: "red", seed: 911 });
    S(g, "path", ["M-12 -6 C -30 -20, -22 -44, -6 -50"], { sw: 2.2, seed: 912 });
    S(g, "path", ["M12 -6 C 30 -20, 22 -44, 6 -50"], { sw: 2.2, seed: 913 });
    var head = S(g, "ellipse", [0, 6, 34, 50], { fill: true, fillStyle: "solid", noStroke: true, seed: 914 });
    head.style.color = "var(--sheet)";
    S(g, "ellipse", [0, 6, 36, 52], { sw: 2, seed: 915 });
    S(g, "ellipse", [-7, 10, 8, 14], { fill: true, fillStyle: "solid", noStroke: true, seed: 916 });
    S(g, "ellipse", [7, 10, 8, 14], { fill: true, fillStyle: "solid", noStroke: true, seed: 917 });
    S(g, "line", [28, 64, 64, -8], { sw: 2.2, seed: 918 });
    return g;
  }

  /* paper plane pointing right, centred at origin */
  function plane(parent, size) {
    var k = (size || 12) / 12;
    var g = E("g", {}, parent);
    E("path", { d: "M" + (-12 * k) + " " + (-7 * k) + " L" + (13 * k) + " 0 L" + (-12 * k) + " " + (7 * k) + " L" + (-6 * k) + " 0 Z", fill: "var(--sheet)", stroke: "currentColor", "stroke-width": 1.6, "stroke-linejoin": "round" }, g);
    E("path", { d: "M" + (-6 * k) + " 0 L" + (13 * k) + " 0", stroke: "currentColor", "stroke-width": 1 }, g);
    return g;
  }

  /* ---------- sound: a tiny piezo-ish synth ---------- */
  var ctx = null;
  function tone(freq, dur, type) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "triangle"; o.frequency.value = freq;
      var t = ctx.currentTime, d = dur || 0.35;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + d + 0.02);
    } catch (e) { /* audio unavailable */ }
  }

  /* seeded random, so illustrations are stable between visits */
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  function link(path) {
    var href = root + path;
    if (onFile && /\/$/.test(href)) href += "index.html";
    return href;
  }

  window.Sketch = { E: E, T: T, S: S, filled: filled, $: $, el: el, avatar: avatar, knight: knight, hornet: hornet, plane: plane, tone: tone, rng: rng, link: link, reduce: reduce, root: root };

  /* ---------- page chrome ---------- */
  var filter = E("svg", { width: 0, height: 0, style: "position:absolute", "aria-hidden": "true" });
  filter.innerHTML = '<filter id="wobble"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>';
  document.body.insertBefore(filter, document.body.firstChild);

  var page = document.body.getAttribute("data-page");
  var nav = $("nav");
  if (nav) {
    var items = [["home", "interests", "work/"], ["projects", "projects", "work/projects/"], ["experience", "experience", "work/experience/"], ["skills", "skills", "work/skills/"],
      ["milestones", "milestones", "work/milestones/"], ["offline", "offline", "work/offline/"], ["contact", "contact", "work/contact/"]];
    nav.className = "site-nav";
    var brand = el("a", "brand"); brand.href = link("work/");
    var bsvg = E("svg", { viewBox: "-46 -52 92 104", "aria-hidden": "true" }, brand);
    avatar(bsvg, 0, 0, 0.95, { headOnly: true, seed: 700 });
    brand.appendChild(document.createTextNode("anurag"));
    nav.appendChild(brand);
    var ul = el("ul");
    items.forEach(function (it) {
      var li = el("li"), a = el("a", null, it[1]);
      a.href = link(it[2]);
      if (page === it[0] || (it[0] === "projects" && page === "project")) a.setAttribute("aria-current", "page");
      li.appendChild(a); ul.appendChild(li);
    });
    var navInner = el("nav"); navInner.setAttribute("aria-label", "Main"); navInner.style.display = "contents"; navInner.appendChild(ul);
    nav.appendChild(navInner);
    var tools = el("div", "tools");
    var other = el("a", null, "take the other path →"); other.href = link("hello/");
    tools.appendChild(other);
    var tbtn = el("button", "theme-toggle"); tbtn.type = "button";
    tools.appendChild(tbtn);
    nav.appendChild(tools);

    var isDark = function () {
      var t = document.documentElement.getAttribute("data-theme");
      return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    var drawToggle = function () {
      tbtn.innerHTML = "";
      var s = E("svg", { viewBox: "0 0 40 40", "aria-hidden": "true" }, tbtn);
      if (isDark()) {
        S(s, "circle", [20, 20, 16], { sw: 1.8, seed: 51 });
        for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; S(s, "line", [20 + Math.cos(a) * 13, 20 + Math.sin(a) * 13, 20 + Math.cos(a) * 18, 20 + Math.sin(a) * 18], { sw: 1.6, seed: 60 + i }); }
        tbtn.setAttribute("aria-label", "Switch to light mode");
      } else {
        S(s, "path", ["M26 6 C 14 8, 8 18, 12 27 C 16 35, 28 36, 34 28 C 24 30, 17 20, 26 6 Z"], { sw: 1.8, fill: true, gap: 3, seed: 52 });
        tbtn.setAttribute("aria-label", "Switch to dark mode");
      }
    };
    drawToggle();
    tbtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { }
      drawToggle();
    });
  }

  var foot = $("foot");
  if (foot) {
    foot.className = "site-foot";
    var L = window.SITE ? SITE.profile.links : {};
    foot.innerHTML = "";
    foot.appendChild(el("span", null, "drawn by hand (well, by code) · Anurag Singh · " + new Date().getFullYear()));
    var fl = el("span");
    ["github", "linkedin", "codeforces", "leetcode"].forEach(function (k, i) {
      if (!L[k]) return;
      var a = el("a", null, L[k].label); a.href = L[k].url; a.rel = "noopener";
      if (i) fl.appendChild(document.createTextNode(" · "));
      fl.appendChild(a);
    });
    foot.appendChild(fl);
  }

  /* make folder links work when opened straight from disk */
  if (onFile) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (!/^[a-z]+:|^#|^\//i.test(h) && /\/$/.test(h)) a.setAttribute("href", h + "index.html");
    });
  }
})();
