/* ==========================================================
   All site content lives here. Edit this file to update the
   site; pages read from window.SITE.
   ========================================================== */
window.SITE = {
  profile: {
    name: "Anurag Singh",
    tagline: "Senior undergrad in Computer Science at IIT Gandhinagar. I teach models to listen and see, and I build the systems underneath them.",
    email: "singh.anurag@iitgn.ac.in",
    cpi: "9.25",
    links: {
      github:     { label: "GitHub",     handle: "AnuragSingh0000",        url: "https://github.com/AnuragSingh0000" },
      linkedin:   { label: "LinkedIn",   handle: "anurag-singh-02b0a7290", url: "https://www.linkedin.com/in/anurag-singh-02b0a7290/" },
      codeforces: { label: "Codeforces", handle: "Anu_rag_Singh",          url: "https://codeforces.com/profile/Anu_rag_Singh" },
      leetcode:   { label: "LeetCode",   handle: "strigif",                url: "https://leetcode.com/u/strigif/" }
    },
    reports: "https://drive.google.com/drive/folders/1NDP_aUirnkiKJUWIfYnV6lpQFV6QAxBZ?usp=sharing"
  },

  /* Interest web. Circle size = courses x1 + projects x1.5 + internships x2 + publications x3 (+ practice x1). */
  weights: { course: 1, project: 1.5, internship: 2, publication: 3, practice: 1 },
  domains: [
    { id: "gen",  name: "Deep Learning & GenAI", color: "peach", x: 370, y: 190, page: "work/projects/deep-learning/",
      courses: ["Deep Learning", "Machine Learning"], teaser: "The sound that became a picture" },
    { id: "ml",   name: "Data Science & ML",     color: "peach", x: 180, y: 118, page: "work/projects/ml/",
      courses: ["Machine Learning", "Data Science"], teaser: "Stick figures, molecules and War and Peace" },
    { id: "rl",   name: "RL & Multi-agent",      color: "peach", x: 78,  y: 262, page: "work/projects/rl/",
      courses: ["Foundations of Multi-agent AI"], teaser: "Pac-Man learns to stop panicking" },
    { id: "sys",  name: "Systems & Networks",    color: "sky",   x: 580, y: 108, page: "work/projects/systems/",
      courses: ["Operating Systems", "Computer Networks", "Computer Architecture"], teaser: "Paper plane packets" },
    { id: "hw",   name: "Hardware",              color: "sky",   x: 728, y: 232, page: "work/projects/hardware/",
      courses: ["Digital Systems"], teaser: "A keyboard you can play" },
    { id: "db",   name: "Databases & Web",       color: "sky",   x: 590, y: 322, page: "work/projects/databases/",
      courses: ["Databases"], teaser: "The coffee-spill crash test" },
    { id: "pl",   name: "Compilers & Languages", color: "sage",  x: 395, y: 342, page: "work/projects/compilers/",
      courses: ["Compilers"], teaser: "The conveyor belt of code" },
    { id: "algo", name: "Algorithms",            color: "sage",  x: 200, y: 330, page: null,
      courses: ["Data Structures & Algorithms I", "Data Structures & Algorithms II"], teaser: "Contest profiles" }
  ],
  links: [["gen","ml"],["ml","rl"],["gen","rl"],["gen","sys"],["sys","hw"],["sys","db"],["db","pl"],["pl","algo"],["algo","ml"],["gen","pl"]],

  projects: [
    { id: "bmvc", kind: "publication", domain: "gen", title: "Why Multi-Source Audio Fails to Compose",
      dates: "2025 – 2026", with: "Anurag Singh, Prajwal Singh, Prof. Shanmuganathan Raman", venue: "Accepted at BMVC 2026",
      skills: ["python","pytorch","diffusion","latex"] },
    { id: "srip", kind: "internship", domain: "gen", title: "Research Intern: Compositional Audio-to-Image Generation",
      dates: "May – Jul 2025", with: "Prof. Shanmuganathan Raman · SRIP, IIT Gandhinagar",
      skills: ["python","pytorch","diffusion","latex"] },
    { id: "cycle", kind: "project", domain: "gen", title: "Cycle Sound", dates: "Jan – Apr 2025",
      with: "Prof. Shanmuganathan Raman", repo: "https://github.com/AnuragSingh0000/Cycle_Sound",
      skills: ["python","pytorch","diffusion","numpy","git"] },
    { id: "vit", kind: "project", domain: "gen", title: "Adversarial Robustness of Vision Transformers", dates: "Jan – Apr 2025",
      with: "Prof. Anirban Dasgupta", repo: "https://github.com/Karan-Gandhi/Adversarial-Attacks-On-ViTs",
      skills: ["python","pytorch","matplotlib","git"] },
    { id: "dagmm", kind: "project", domain: "gen", title: "DAGMM for Anomaly Detection", dates: "Feb – Apr 2025",
      with: "Prof. Anirban Dasgupta", repo: "https://github.com/AnuragSingh0000/Anomaly-detection-using-mixture-models",
      skills: ["python","pytorch","numpy","sklearn","git"] },

    { id: "skan", kind: "internship", domain: "ml", title: "Data Science Intern: Process Intelligence",
      dates: "May – Jul 2026", with: "Skan AI", skills: ["python","numpy"] },
    { id: "har", kind: "project", domain: "ml", title: "Human Activity Recognition", dates: "Aug – Nov 2024",
      repo: "https://github.com/adi776borate/Human_Activity_Recognition", skills: ["python","sklearn","numpy","matplotlib","git"] },
    { id: "nwp", kind: "project", domain: "ml", title: "Next Word Predictor", dates: "Aug – Nov 2024",
      repo: "https://github.com/AnuragSingh0000/Next-Word-Predictor", skills: ["python","pytorch","git"] },
    { id: "md", kind: "project", domain: "ml", title: "ML Models for Molecular Dynamics", dates: "Research reproduction",
      repo: "https://github.com/AnuragSingh0000/ML_Models_for_Molecular_Dynamics", skills: ["python","pytorch","numpy","git"] },

    { id: "pacman", kind: "project", domain: "rl", title: "Pac-Man DeepRL Agents", dates: "Aug – Nov 2025",
      with: "Prof. Manisha Padala", repo: "https://github.com/adi776borate/Pacman-DeepRL-Agents",
      skills: ["python","pytorch","gym","numpy","matplotlib","git"] },

    { id: "packet", kind: "project", domain: "sys", title: "Ultra-Fast Packet Crafter", dates: "Aug – Nov 2025",
      with: "Prof. Sameer Kulkarni", skills: ["c","linux","dpdk","git"] },

    { id: "bptree", kind: "project", domain: "db", title: "Custom B+ Tree Database Engine", dates: "Jan – Mar 2026",
      with: "Prof. Yogesh Meena", skills: ["python","git"] },
    { id: "olympia", kind: "project", domain: "db", title: "Olympia: Sports Management System", dates: "Jan – Mar 2026",
      with: "Prof. Yogesh Meena", repo: "https://github.com/AnuragSingh0000/DB_Assignment_3",
      skills: ["python","fastapi","mysql","sql","jwt","git"] },
    { id: "egate", kind: "project", domain: "db", title: "IITGn E-gate", dates: "Hackathon",
      repo: "https://github.com/AnuragSingh0000/IITGn-E-gate", skills: ["python","flask","mysql","sql","git"] },

    { id: "psylang", kind: "project", domain: "pl", title: "Psylang: a custom programming language", dates: "Jan 2026 – present",
      with: "Prof. Shouvick Mondal", repo: "https://github.com/AnuragSingh0000/psylang", skills: ["c","flexbison","make","git"] },
    { id: "jlox", kind: "project", domain: "pl", title: "Jlox", dates: "Language project",
      repo: "https://github.com/AnuragSingh0000/Jlox", skills: ["java","git"] },

    { id: "keyboard", kind: "project", domain: "hw", title: "Arduino Musical Keyboard", dates: "Embedded project",
      repo: "https://github.com/AnuragSingh0000/Musical-Keyboard", skills: ["arduino","cpp","git"] },

    { id: "cp", kind: "practice", domain: "algo", title: "Competitive programming on Codeforces & LeetCode", dates: "ongoing",
      skills: ["cpp"] }
  ],

  /* Dots under each charm = number of projects above that list the skill. new = used in projects, not on the CV. */
  skills: [
    { group: "Languages", color: "peach", items: [
      { id: "python", name: "Python", glyph: "py" },
      { id: "c", name: "C", glyph: "C" },
      { id: "cpp", name: "C++", glyph: "C++" },
      { id: "java", name: "Java", glyph: "J", isNew: true },
      { id: "csharp", name: "C#", glyph: "C#", note: "from coursework" },
      { id: "sql", name: "SQL", glyph: "SQL", isNew: true }
    ]},
    { group: "ML & AI", color: "sky", items: [
      { id: "pytorch", name: "PyTorch", glyph: "pt" },
      { id: "numpy", name: "NumPy & Pandas", glyph: "np" },
      { id: "sklearn", name: "scikit-learn", glyph: "sk" },
      { id: "matplotlib", name: "Matplotlib", glyph: "plt" },
      { id: "diffusion", name: "Diffusion & CLIP", glyph: "dif", isNew: true },
      { id: "gym", name: "Gymnasium", glyph: "gym", isNew: true }
    ]},
    { group: "Systems", color: "sage", items: [
      { id: "linux", name: "Linux", glyph: "$_", isNew: true },
      { id: "dpdk", name: "DPDK", glyph: "io", isNew: true },
      { id: "flexbison", name: "Flex & Bison", glyph: "{ }", isNew: true },
      { id: "make", name: "Make", glyph: "mk", isNew: true }
    ]},
    { group: "Web & data", color: "peach", items: [
      { id: "fastapi", name: "FastAPI", glyph: "api", isNew: true },
      { id: "flask", name: "Flask", glyph: "fl", isNew: true },
      { id: "mysql", name: "MySQL", glyph: "db", isNew: true },
      { id: "jwt", name: "JWT & RBAC", glyph: "key", isNew: true }
    ]},
    { group: "Tools & hardware", color: "sky", items: [
      { id: "git", name: "Git & GitHub", glyph: "git" },
      { id: "latex", name: "LaTeX", glyph: "TeX" },
      { id: "arduino", name: "Arduino", glyph: "ino" },
      { id: "vivado", name: "Xilinx Vivado", glyph: "viv", note: "from Digital Systems coursework" },
      { id: "inventor", name: "Autodesk Inventor", glyph: "inv", note: "from coursework" }
    ]}
  ],

  /* Colours follow Anurag's own favourites sheet. note: add a line on why it stuck (optional). */
  favourites: [
    { title: "The Dark Knight", kind: "live", year: 2008, by: "Christopher Nolan", note: "" },
    { title: "Luca", kind: "anim", year: 2021, by: "Pixar", note: "" },
    { title: "Bullet Train", kind: "live", year: 2022, by: "David Leitch", note: "" },
    { title: "Everything Everywhere All At Once", kind: "live", year: 2022, by: "Daniels", note: "" },
    { title: "Interstellar", kind: "live", year: 2014, by: "Christopher Nolan", note: "" },
    { title: "Spirited Away", kind: "anim", year: 2001, by: "Studio Ghibli", note: "" },
    { title: "Vinland Saga", kind: "show", year: 2019, by: "anime series", note: "" },
    { title: "Attack on Titan", kind: "show", year: 2013, by: "anime series", note: "" },
    { title: "Premam", kind: "live", year: 2015, by: "Alphonse Puthren", note: "" },
    { title: "Hridayam", kind: "live", year: 2022, by: "Vineeth Sreenivasan", note: "" },
    { title: "The Boy and the Heron", kind: "anim", year: 2023, by: "Studio Ghibli", note: "" },
    { title: "Haikyu!!", kind: "show", year: 2014, by: "anime series", note: "" },
    { title: "A Silent Voice", kind: "anim", year: 2016, by: "Kyoto Animation", note: "" },
    { title: "Princess Mononoke", kind: "anim", year: 1997, by: "Studio Ghibli", note: "" },
    { title: "The Wild Robot", kind: "anim", year: 2024, by: "DreamWorks", note: "" },
    { title: "Arcane", kind: "show", year: 2021, by: "animated series", note: "" }
  ]
};

/* Derived values */
(function (S) {
  S.domains.forEach(function (d) {
    var ps = S.projects.filter(function (p) { return p.domain === d.id; });
    d.projects = ps;
    d.score = d.courses.length * S.weights.course +
      ps.reduce(function (a, p) { return a + S.weights[p.kind]; }, 0);
    d.r = Math.round(15 * Math.sqrt(d.score));
  });
  S.skills.forEach(function (g) {
    g.items.forEach(function (s) {
      s.projects = S.projects.filter(function (p) { return p.skills.indexOf(s.id) !== -1; });
    });
  });
})(window.SITE);
