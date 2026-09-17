/* ==========================================================
   All site content lives here. Edit this file to update the
   site; pages read from window.SITE.
   ========================================================== */
window.SITE = {
  profile: {
    name: "Anurag Singh",
    tagline: "I am a final-year Computer Science undergraduate at IIT Gandhinagar. My research focuses on multimodal generative models, particularly how audio and vision can be composed, and my first paper has been accepted at BMVC 2026. Alongside research, I enjoy building systems from first principles, from compilers and database engines to high-speed networking tools.",
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
      courses: ["Deep Learning", "Machine Learning"], teaser: "Generative models across audio and vision, and the robustness of deep networks." },
    { id: "ml",   name: "Data Science & ML",     color: "peach", x: 180, y: 118, page: "work/projects/ml/",
      courses: ["Machine Learning", "Data Science"], teaser: "Machine learning for sensor data, natural language and molecular physics." },
    { id: "rl",   name: "RL & Multi-agent",      color: "peach", x: 78,  y: 262, page: "work/projects/rl/",
      courses: ["Foundations of Multi-agent AI"], teaser: "Deep reinforcement learning agents for Atari games." },
    { id: "sys",  name: "Systems & Networks",    color: "sky",   x: 580, y: 108, page: "work/projects/systems/",
      courses: ["Operating Systems", "Computer Networks", "Computer Architecture"], teaser: "High-throughput packet processing and kernel-bypass networking." },
    { id: "hw",   name: "Hardware",              color: "sky",   x: 728, y: 232, page: "work/projects/hardware/",
      courses: ["Digital Systems"], teaser: "Microcontroller programming with sensor input and audio output." },
    { id: "db",   name: "Databases & Web",       color: "sky",   x: 590, y: 322, page: "work/projects/databases/",
      courses: ["Databases"], teaser: "Database internals, from storage engines to full-stack web applications." },
    { id: "pl",   name: "Compilers & Languages", color: "sage",  x: 395, y: 342, page: "work/projects/compilers/",
      courses: ["Compilers"], teaser: "Compilers and interpreters for programming languages." },
    { id: "algo", name: "Algorithms",            color: "sage",  x: 200, y: 330, page: null,
      courses: ["Data Structures & Algorithms I", "Data Structures & Algorithms II"], teaser: "Competitive programming and algorithmic problem solving." }
  ],
  links: [["gen","ml"],["ml","rl"],["gen","rl"],["gen","sys"],["sys","hw"],["sys","db"],["db","pl"],["pl","algo"],["algo","ml"],["gen","pl"]],

  /* page: where the project is written up (relative to site root, may include #anchor) */
  projects: [
    { id: "bmvc", kind: "publication", domain: "gen", short: "BMVC 2026 paper",
      title: "Why Multi-Source Audio Fails to Compose: A Geometric Diagnosis and Its Remedy",
      dates: "Accepted, BMVC 2026", with: "Anurag Singh, Prajwal Singh, Prof. Shanmuganathan Raman", page: "work/experience/#paper-h",
      one: "Diagnoses why audio-to-image models fail on several sounds at once, and fixes it at inference time.",
      skills: ["python","pytorch","diffusion","clip","attention","geneval","latex"] },
    { id: "srip", kind: "internship", domain: "gen", short: "SRIP internship",
      title: "Research Intern: Compositional Audio-to-Image Generation",
      dates: "May – Jul 2025", with: "Prof. Shanmuganathan Raman · SRIP, IIT Gandhinagar", page: "work/experience/#cycle-h",
      one: "Benchmarked 20+ audio-to-image models and curated multi-audio evaluation sets.",
      skills: ["python","pytorch","diffusion","clip","transformers","geneval","latex"] },
    { id: "cycle", kind: "project", domain: "gen", short: "Cycle Sound",
      title: "Cycle Sound: Bidirectional Audio–Image Generation",
      dates: "Jan – Apr 2025", with: "Prof. Shanmuganathan Raman", page: "work/projects/deep-learning/#cycle",
      repo: "https://github.com/AnuragSingh0000/Cycle_Sound", site: "https://anuragsingh0000.github.io/Cycle_Sound.github.io/",
      one: "Audio → image and image → audio with discrete VAEs and transformer decoders.",
      skills: ["python","pytorch","transformers","vitm","clip","vae","numpy","git"] },
    { id: "vit", kind: "project", domain: "gen", short: "ViT robustness",
      title: "Adversarial Robustness of Vision Transformers",
      dates: "Jan – Apr 2025", with: "Prof. Anirban Dasgupta", team: "Karan Gandhi, Arjun Dikshit, Aarsh Wankar", page: "work/projects/deep-learning/#vit",
      repo: "https://github.com/Karan-Gandhi/Adversarial-Attacks-On-ViTs",
      one: "A new positional encoding that makes ViTs sturdier under black-box attacks.",
      skills: ["python","pytorch","vitm","transformers","adversarial","matplotlib","git"] },
    { id: "dagmm", kind: "project", domain: "gen", short: "DAGMM",
      title: "DAGMM for Anomaly Detection",
      dates: "Feb – Apr 2025", with: "Prof. Anirban Dasgupta", page: "work/projects/deep-learning/#dagmm",
      repo: "https://github.com/AnuragSingh0000/Anomaly-detection-using-mixture-models",
      one: "Rebuilding a deep anomaly detector with VAE, VQ-VAE and Laplacian variants.",
      skills: ["python","pytorch","vae","gmm","anomaly","numpy","sklearn","git"] },

    { id: "skan", kind: "internship", domain: "ml", short: "Skan AI internship",
      title: "Data Science Intern: Process Intelligence, Skan AI",
      dates: "May – Jul 2026", with: "Skan AI", page: "work/experience/#skan-h",
      one: "Noise filtering and event reordering for process-mining logs.",
      skills: ["python","processmining","prompting"] },
    { id: "har", kind: "project", domain: "ml", short: "Human Activity Recognition",
      title: "Human Activity Recognition",
      dates: "Aug – Nov 2024", with: "Machine Learning course", page: "work/projects/ml/#har",
      repo: "https://github.com/adi776borate/Human_Activity_Recognition",
      one: "Classifying six activities from accelerometer data with decision trees and LLM prompting.",
      skills: ["python","sklearn","numpy","matplotlib","dtrees","pca","tsfel","prompting","git"] },
    { id: "nwp", kind: "project", domain: "ml", short: "Next Word Predictor",
      title: "Next Word Predictor",
      dates: "Aug – Nov 2024", with: "Machine Learning course", page: "work/projects/ml/#nwp",
      repo: "https://github.com/AnuragSingh0000/Next-Word-Predictor", app: "https://next-word-predictor-0.onrender.com/",
      one: "A word-level language model trained on War and Peace, with a live Streamlit app.",
      skills: ["python","pytorch","embeddings","pca","streamlit","git"] },
    { id: "md", kind: "project", domain: "ml", short: "Molecular dynamics",
      title: "ML Models for Molecular Dynamics",
      dates: "Research reproduction", page: "work/projects/ml/#md",
      repo: "https://github.com/AnuragSingh0000/ML_Models_for_Molecular_Dynamics",
      one: "Reproducing SchNet and sGDML for force and energy prediction.",
      skills: ["python","pytorch","schnet","numpy","git"] },

    { id: "pacman", kind: "project", domain: "rl", short: "Pac-Man DeepRL",
      title: "Comparative Analysis of Deep RL Agents in Pac-Man",
      dates: "Aug – Nov 2025", with: "Prof. Manisha Padala", team: "Aditya Borate, Arjun B Dikshit, Hanamanthagouda", page: "work/projects/rl/#pacman",
      repo: "https://github.com/adi776borate/Pacman-DeepRL-Agents",
      one: "DQN, DDQN, Deep SARSA and A2C compared on Ms. Pac-Man.",
      skills: ["python","pytorch","dqn","a2c","gym","numpy","matplotlib","git"] },

    { id: "packet", kind: "project", domain: "sys", short: "Packet Crafter",
      title: "Ultra-Fast Packet Crafter",
      dates: "Aug – Nov 2025", with: "Prof. Sameer Kulkarni", page: "work/projects/systems/#packet",
      repo: "https://github.com/AnuragSingh0000/Computer-network-project",
      one: "Blitzping rebuilt for UDP with a DPDK kernel bypass and a TTL traceroute.",
      skills: ["c","linux","dpdk","netproto","make","git"] },

    { id: "bptree", kind: "project", domain: "db", short: "B+ tree engine",
      title: "Custom B+ Tree Database Engine",
      dates: "Jan – Mar 2026", with: "Prof. Yogesh Meena", page: "work/projects/databases/#bptree",
      repo: "https://github.com/AnuragSingh0000/DB_Assignment_3",
      one: "A database engine from scratch: B+ tree index, ACID transactions, write-ahead log.",
      skills: ["python","bplus","wal","git"] },
    { id: "olympia", kind: "project", domain: "db", short: "Olympia",
      title: "Olympia: Sports Management System",
      dates: "Jan – Mar 2026", with: "Prof. Yogesh Meena", page: "work/projects/databases/#olympia",
      repo: "https://github.com/AnuragSingh0000/DB_Assignment_3",
      one: "A FastAPI + MySQL web app with auth, RBAC, indexing and sharding.",
      skills: ["python","fastapi","mysql","sql","jwt","sharding","html","git"] },
    { id: "egate", kind: "project", domain: "db", short: "IITGn E-gate",
      title: "IITGn E-gate: QR-based Campus Access",
      dates: "HackRush hackathon", team: "Aditya Borate", page: "work/projects/databases/#egate",
      repo: "https://github.com/AnuragSingh0000/IITGn-E-gate",
      one: "QR passes for visitors and residents, with a scanner and log for guards.",
      skills: ["python","flask","mysql","sql","html","git"] },

    { id: "psylang", kind: "project", domain: "pl", short: "Psylang",
      title: "Psylang: A Custom Programming Language",
      dates: "Jan 2026 – present", with: "Prof. Shouvick Mondal", page: "work/projects/compilers/#psylang",
      repo: "https://github.com/AnuragSingh0000/psylang",
      one: "A compiler front end: Flex lexer, LALR(1) parser, semantic analyzer and TAC IR.",
      skills: ["c","flexbison","parsing","ir","make","git"] },
    { id: "jlox", kind: "project", domain: "pl", short: "Jlox",
      title: "Jlox: A Tree-Walk Interpreter for Lox",
      dates: "Language project", page: "work/projects/compilers/#jlox",
      repo: "https://github.com/AnuragSingh0000/Jlox",
      one: "The Lox language from Crafting Interpreters, implemented in Java.",
      skills: ["java","parsing","git"] },

    { id: "keyboard", kind: "project", domain: "hw", short: "Musical Keyboard",
      title: "Arduino Musical Keyboard",
      dates: "Embedded project", page: "work/projects/hardware/#keyboard",
      repo: "https://github.com/AnuragSingh0000/Musical-Keyboard",
      one: "Seven push-button keys, a piezo buzzer and an ultrasonic sensor for octave control.",
      skills: ["arduino","cpp","git"] },

    { id: "cp", kind: "practice", domain: "algo", short: "Codeforces & LeetCode",
      title: "Competitive Programming",
      dates: "ongoing", page: null,
      one: "Regular contest practice on Codeforces and LeetCode.",
      skills: ["cpp","dsa"] }
  ],

  /* Skills page: click a skill to see the projects above that used it. */
  skills: [
    { group: "Languages", color: "peach", items: [
      { id: "python", name: "Python" }, { id: "c", name: "C" }, { id: "cpp", name: "C++" },
      { id: "java", name: "Java" }, { id: "sql", name: "SQL" }, { id: "html", name: "HTML & CSS" },
      { id: "csharp", name: "C#", note: "Used in Software Tools & Techniques coursework." }
    ]},
    { group: "Deep learning & generative AI", color: "peach", items: [
      { id: "pytorch", name: "PyTorch" }, { id: "transformers", name: "Transformers" }, { id: "vitm", name: "Vision Transformers" },
      { id: "diffusion", name: "Diffusion models" }, { id: "clip", name: "CLIP & CLAP" }, { id: "vae", name: "VAEs & VQ-VAEs" },
      { id: "attention", name: "Attention guidance" }, { id: "adversarial", name: "Adversarial robustness" },
      { id: "geneval", name: "Generative model evaluation" }, { id: "embeddings", name: "Word embeddings" },
      { id: "prompting", name: "LLM & VLM prompting" }
    ]},
    { group: "Machine learning & data", color: "sky", items: [
      { id: "sklearn", name: "scikit-learn" }, { id: "numpy", name: "NumPy & Pandas" }, { id: "matplotlib", name: "Matplotlib" },
      { id: "dtrees", name: "Decision trees" }, { id: "gmm", name: "Gaussian mixture models" }, { id: "anomaly", name: "Anomaly detection" },
      { id: "pca", name: "PCA & t-SNE" }, { id: "tsfel", name: "Time-series features (TSFEL)" }, { id: "schnet", name: "SchNet & sGDML" },
      { id: "processmining", name: "Process mining" }, { id: "streamlit", name: "Streamlit" }
    ]},
    { group: "Reinforcement learning", color: "sky", items: [
      { id: "dqn", name: "DQN & DDQN" }, { id: "a2c", name: "Actor-critic (A2C, GAE)" }, { id: "gym", name: "Gymnasium & Atari ALE" }
    ]},
    { group: "Systems & compilers", color: "sage", items: [
      { id: "linux", name: "Linux" }, { id: "dpdk", name: "DPDK" }, { id: "netproto", name: "UDP, ICMP & sockets" },
      { id: "flexbison", name: "Flex & Bison" }, { id: "parsing", name: "Parsing & semantic analysis" }, { id: "ir", name: "Intermediate representations" },
      { id: "make", name: "Make" }, { id: "dsa", name: "Data structures & algorithms" }
    ]},
    { group: "Databases & web", color: "sage", items: [
      { id: "bplus", name: "B+ trees & storage engines" }, { id: "wal", name: "Transactions & WAL recovery" }, { id: "mysql", name: "MySQL" },
      { id: "sharding", name: "Indexing & sharding" }, { id: "fastapi", name: "FastAPI" }, { id: "flask", name: "Flask" }, { id: "jwt", name: "JWT auth & RBAC" }
    ]},
    { group: "Tools & hardware", color: "sky", items: [
      { id: "git", name: "Git & GitHub" }, { id: "latex", name: "LaTeX" }, { id: "arduino", name: "Arduino" },
      { id: "vivado", name: "Xilinx Vivado", note: "Used in Digital Systems coursework." },
      { id: "inventor", name: "Autodesk Inventor", note: "Used in coursework." }
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
