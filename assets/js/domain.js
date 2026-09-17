/* Shared bits for domain pages: project meta lines, links, the on-page index and "other domains". */
(function () {
  var K = Sketch, D = SITE;
  var here = document.body.getAttribute("data-domain");
  var byId = {};
  D.projects.forEach(function (p) { byId[p.id] = p; });

  // "jan – apr 2025 · Prof. X · with teammates"
  document.querySelectorAll("[data-meta]").forEach(function (el) {
    var p = byId[el.getAttribute("data-meta")]; if (!p) return;
    var parts = [p.dates];
    if (p.with) parts.push(p.with);
    if (p.team) parts.push("team: " + p.team);
    el.textContent = parts.join(" · ");
  });

  // GitHub / website / live app buttons, appended after any tags already in the row
  document.querySelectorAll("[data-links]").forEach(function (row) {
    var p = byId[row.getAttribute("data-links")]; if (!p) return;
    [["repo", "GitHub ↗", "peach"], ["site", "project website ↗", ""], ["app", "live app ↗", "sage"]].forEach(function (l) {
      if (!p[l[0]]) return;
      var a = K.el("a", "btn " + l[2], l[1]); a.href = p[l[0]]; a.rel = "noopener"; a.target = "_blank";
      row.appendChild(a);
    });
  });

  // on-page index
  var jump = document.getElementById("jump");
  if (jump) {
    D.projects.filter(function (p) { return p.domain === here && p.page && p.page.indexOf("work/projects/") === 0; }).forEach(function (p) {
      var a = K.el("a", null, p.short); a.href = "#" + p.id; jump.appendChild(a);
    });
  }

  var row = document.getElementById("others");
  if (row) {
    D.domains.forEach(function (d) {
      if (!d.page || d.id === here) return;
      var a = K.el("a", "btn " + (d.color === "sky" ? "" : d.color), d.name);
      a.href = K.link(d.page);
      row.appendChild(a);
    });
    var all = K.el("a", "btn ghost", "all projects →"); all.href = K.link("work/projects/"); row.appendChild(all);
  }
})();
