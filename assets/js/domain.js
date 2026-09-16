/* Shared bits for domain project pages: GitHub links and "other domains" row. */
(function () {
  var K = Sketch, D = SITE;
  var here = document.body.getAttribute("data-domain");

  document.querySelectorAll("[data-repo]").forEach(function (a) {
    var p = D.projects.filter(function (x) { return x.id === a.getAttribute("data-repo"); })[0];
    if (p && p.repo) { a.href = p.repo; a.rel = "noopener"; }
    else a.remove();
  });

  var row = document.getElementById("others");
  if (row) {
    D.domains.forEach(function (d) {
      if (!d.page || d.id === here) return;
      var a = K.el("a", "btn " + (d.color === "sky" ? "" : d.color), d.name);
      a.href = K.link(d.page);
      row.appendChild(a);
    });
  }
})();
