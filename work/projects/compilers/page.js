(function () {
  var K = Sketch, $ = K.$, S = K.S, T = K.T, E = K.E, F = K.filled;
  var ENV = { b: 3, c: 4, x: 5, y: 2 };

  /* ---------- belt ---------- */
  (function () {
    var s = $("belt");
    S(s, "path", ["M20 30 L880 30 M20 58 L880 58"], { sw: 1.6, seed: 2 });
    E("line", { x1: 20, y1: 44, x2: 880, y2: 44, stroke: "currentColor", "stroke-width": 2, "stroke-dasharray": "4 20", class: K.reduce ? "" : "belt", opacity: .5 }, s);
    [60, 300, 540, 780].forEach(function (x, i) { S(s, "circle", [x, 44, 22], { sw: 1.4, seed: 10 + i }); });
    [["lexer", 180, "peach"], ["parser", 420, "sky"], ["IR", 660, "sage"]].forEach(function (st, i) {
      F(s, "rectangle", [st[1] - 44, 6, 88, 22], st[2], { seed: 20 + i * 3, sw: 1.4 });
      T(s, st[1], 23, st[0], { size: 15, weight: 700 });
    });
  })();

  /* ---------- lexer ---------- */
  function lex(src) {
    var re = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(&&|\|\||==|!=|<=|>=|[-+*\/<>=!])|([()]))/y, out = [], m;
    re.lastIndex = 0;
    while (re.lastIndex < src.length) {
      var at = re.lastIndex;
      m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw { msg: "lexer: I don't know what '" + src.slice(at).trim()[0] + "' is", pos: at }; }
      if (m[1]) out.push({ t: "num", v: m[1] });
      else if (m[2]) out.push({ t: "id", v: m[2] });
      else if (m[3]) out.push({ t: "op", v: m[3] });
      else if (m[4]) out.push({ t: "p", v: m[4] });
      else break;
    }
    return out;
  }

  /* ---------- parser (precedence climbing) ---------- */
  var PREC = { "||": 1, "&&": 2, "==": 3, "!=": 3, "<": 4, ">": 4, "<=": 4, ">=": 4, "+": 5, "-": 5, "*": 6, "/": 6 };
  function parse(toks) {
    var i = 0;
    function peek() { return toks[i]; }
    function eat(v) { var t = toks[i]; if (!t || (v && t.v !== v)) throw { msg: "parser: expected '" + v + "'" + (t ? " but found '" + t.v + "'" : " at the end") }; i++; return t; }
    function primary() {
      var t = peek();
      if (!t) throw { msg: "parser: the expression ends too early" };
      if (t.v === "(") { eat("("); var e = expr(0); eat(")"); return e; }
      if (t.v === "-" || t.v === "!") { eat(); return { k: "unary", op: t.v, a: primary() }; }
      if (t.t === "num") { eat(); return { k: "num", v: t.v }; }
      if (t.t === "id") { eat(); return { k: "var", v: t.v }; }
      throw { msg: "parser: didn't expect '" + t.v + "' here" };
    }
    function expr(min) {
      var left = primary();
      while (peek() && PREC[peek().v] && PREC[peek().v] > min) {
        var op = eat().v;
        left = { k: "bin", op: op, a: left, b: expr(PREC[op]) };
      }
      return left;
    }
    if (!toks[0] || toks[0].t !== "id") throw { msg: "parser: start with a variable name, like  a = …" };
    var target = eat().v; eat("=");
    var value = expr(0);
    if (i < toks.length) throw { msg: "parser: leftover '" + toks[i].v + "' at the end" };
    return { k: "assign", target: target, value: value };
  }

  /* ---------- semantic check ---------- */
  function check(node, errs) {
    if (!node) return;
    if (node.k === "var" && !(node.v in ENV)) errs.push("'" + node.v + "' is used but never declared");
    ["a", "b", "value"].forEach(function (k) { if (node[k]) check(node[k], errs); });
  }

  /* ---------- TAC ---------- */
  function tac(ast) {
    var q = [], tn = 0, ln = 0;
    function tmp() { return "t" + (++tn); }
    function gen(n) {
      if (n.k === "num" || n.k === "var") return n.v;
      if (n.k === "unary") { var a = gen(n.a), t = tmp(); q.push([n.op === "-" ? "neg" : "not", a, "", t]); return t; }
      if (n.op === "&&" || n.op === "||") {
        var r = tmp(), L = "L" + (++ln);
        q.push(["=", gen(n.a), "", r]);
        q.push([n.op === "&&" ? "ifFalse" : "ifTrue", r, "", "goto " + L]);
        q.push(["=", gen(n.b), "", r]);
        q.push(["label", "", "", L]);
        return r;
      }
      var x = gen(n.a), y = gen(n.b), t2 = tmp();
      q.push([n.op, x, y, t2]);
      return t2;
    }
    q.push(["=", gen(ast.value), "", ast.target]);
    return q;
  }

  /* ---------- tree-walk eval ---------- */
  function evaluate(n) {
    switch (n.k) {
      case "num": return parseFloat(n.v);
      case "var": return ENV[n.v];
      case "unary": return n.op === "-" ? -evaluate(n.a) : !evaluate(n.a);
      case "bin":
        if (n.op === "&&") return evaluate(n.a) && evaluate(n.b);
        if (n.op === "||") return evaluate(n.a) || evaluate(n.b);
        var a = evaluate(n.a), b = evaluate(n.b);
        return { "+": a + b, "-": a - b, "*": a * b, "/": a / b, "<": a < b, ">": a > b, "<=": a <= b, ">=": a >= b, "==": a === b, "!=": a !== b }[n.op];
    }
  }

  /* ---------- AST drawing ---------- */
  function drawAst(ast) {
    var s = $("ast"); s.innerHTML = "";
    var root = { label: "=", kids: [{ label: ast.target, kids: [] }, toTree(ast.value)] };
    function toTree(n) {
      if (n.k === "num" || n.k === "var") return { label: n.v, kids: [], leaf: n.k };
      if (n.k === "unary") return { label: n.op, kids: [toTree(n.a)] };
      return { label: n.op, kids: [toTree(n.a), toTree(n.b)] };
    }
    var col = 0, depthMax = 0, GX = 64, GY = 62;
    (function layout(n, d) {
      depthMax = Math.max(depthMax, d);
      n.d = d;
      if (!n.kids.length) { n.x = col++ * GX; return; }
      n.kids.forEach(function (k) { layout(k, d + 1); });
      n.x = (n.kids[0].x + n.kids[n.kids.length - 1].x) / 2;
    })(root, 0);
    var width = Math.max(400, col * GX + 40), height = (depthMax + 1) * GY + 20;
    s.setAttribute("viewBox", "0 0 " + width + " " + height);
    s.style.minWidth = Math.min(width, 900) * 0.8 + "px";
    var off = (width - (col - 1) * GX) / 2, seed = 1;
    (function edges(n) { n.kids.forEach(function (k) { S(s, "line", [n.x + off, n.d * GY + 30, k.x + off, k.d * GY + 30], { sw: 1.4, seed: seed++ }); edges(k); }); })(root);
    (function nodes(n) {
      var c = n.leaf === "num" ? "sage" : n.leaf === "var" ? "sky" : "peach";
      F(s, "circle", [n.x + off, n.d * GY + 30, 40], c, { seed: 100 + seed++, gap: 4 });
      T(s, n.x + off, n.d * GY + 36, n.label, { size: 16, weight: 700, family: "var(--mono)" });
      n.kids.forEach(nodes);
    })(root);
  }

  function run() {
    var src = $("src").value, toksEl = $("toks"), diag = $("diag"), quads = $("quads");
    toksEl.innerHTML = ""; diag.textContent = ""; quads.innerHTML = ""; $("result").textContent = "";
    $("env").innerHTML = "declared: " + Object.keys(ENV).map(function (k) { return "<b>" + k + "</b> = " + ENV[k]; }).join(", ");
    var toks;
    try { toks = lex(src); } catch (e) { diag.textContent = e.msg; $("ast").innerHTML = ""; return; }
    toks.forEach(function (t) {
      var chip = K.el("span", "tok " + t.t); chip.appendChild(document.createTextNode(t.v));
      chip.appendChild(K.el("small", null, { id: "IDENT", num: "NUMBER", op: "OP", p: "PAREN" }[t.t]));
      toksEl.appendChild(chip);
    });
    var ast;
    try { ast = parse(toks); } catch (e) { diag.textContent = e.msg; $("ast").innerHTML = ""; return; }
    drawAst(ast);
    var errs = []; check(ast, errs);
    if (errs.length) { diag.textContent = "semantic error: " + errs.join("; "); }
    var q = tac(ast);
    var head = quads.insertRow(); ["#", "op", "arg1", "arg2", "result"].forEach(function (h) { var th = document.createElement("th"); th.textContent = h; head.appendChild(th); });
    q.forEach(function (r, i) { var tr = quads.insertRow(); [i + 1].concat(r).forEach(function (c) { tr.insertCell().textContent = c; }); });
    if (!errs.length) {
      var v = evaluate(ast.value);
      if (typeof v === "number" && !isFinite(v)) $("result").innerHTML = "<b>" + ast.target + "</b> = " + v + "  (you divided by zero)";
      else $("result").innerHTML = "<b>" + ast.target + "</b> = " + (typeof v === "number" ? Math.round(v * 1000) / 1000 : v);
    } else $("result").textContent = "won't run until the semantic error is fixed";
  }

  ["a = b * (c + 2)", "ok = x > 0 && y < 10", "d = -b + c / 4", "oops = z + 1"].forEach(function (ex) {
    var b = K.el("button", "btn ghost", ex); b.type = "button"; b.style.fontFamily = "var(--mono)"; b.style.fontSize = "14px";
    b.addEventListener("click", function () { $("src").value = ex; run(); });
    $("examples").appendChild(b);
  });
  $("src").addEventListener("input", run);
  run();

  /* ---------- Jlox REPL doodle ---------- */
  (function () {
    var s = $("repl");
    F(s, "rectangle", [10, 10, 500, 180], "sheet", { seed: 1, sw: 2 });
    S(s, "line", [10, 40, 510, 40], { sw: 1.4, seed: 2 });
    [30, 50, 70].forEach(function (x, i) { S(s, "circle", [x, 25, 10], { fill: true, fillStyle: "solid", noStroke: true, color: ["red", "peach", "sage"][i], seed: 3 + i }); });
    var lines = [["> var greeting = \"hello\";", ""], ["> { var greeting = \"inner\"; print greeting; }", "inner"], ["> print greeting;", "hello"], ["> print 1 + ;", "[line 1] Error at ';': Expect expression."]];
    var y = 66;
    lines.forEach(function (l, i) {
      T(s, 26, y, l[0], { size: 14, anchor: "start", family: "var(--mono)" }); y += 22;
      if (l[1]) { T(s, 26, y, l[1], { size: 14, anchor: "start", family: "var(--mono)", color: i === 3 ? "red" : null }); y += 24; }
    });
  })();
})();
