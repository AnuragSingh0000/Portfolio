# Anurag, hand-drawn

A personal site where everything is drawn by hand (well, by code). It has two sides:

- **`/work/`**: the formal side for recruiters and reviewers
- **`/hello/`**: the informal side (being written)
- **`/`**: a signpost that lets visitors pick a path

Plain HTML, CSS and JavaScript, with no build step. Shapes are drawn with [rough.js](https://roughjs.com) (vendored in `assets/vendor/`).

## Structure

```text
index.html                    signpost: pick a path
hello/                        informal side (placeholder for now)
work/
  index.html                  home + interest web
  research/                   Cycle Sound → SRIP → BMVC paper, Skan AI
  projects/
    deep-learning/            Cycle Sound, ViT robustness, DAGMM
    ml/                       HAR, next-word predictor, molecular dynamics
    rl/                       Pac-Man DeepRL agents
    systems/                  packet crafter, traceroute
    databases/                B+ tree, WAL, Olympia, E-gate
    compilers/                Psylang, Jlox
    hardware/                 Arduino musical keyboard
  skills/                     skills as charms
  milestones/                 JEE, Dean's List, PORs
  offline/                    favourites, Hollow Knight, piano
  contact/
assets/
  css/site.css                all styles and theme tokens
  js/data.js                  ALL content: projects, skills, favourites, links
  js/sketch.js                drawing helpers, avatar, nav, footer
  js/domain.js                shared bits for project pages
  vendor/rough.js
archive/v1/                   the previous portfolio
```

## Editing content

Most edits happen in **`assets/js/data.js`**:

- Add a project to `projects`, with its `domain`, `kind` and `skills`. The interest-web circle sizes and the charm dots update automatically.
- Add a line to a favourite with its `note` field. It shows on the back of the ticket stub.

Page text (the stories for each project) lives in each page's `index.html`.

## Run locally

Folder URLs like `/work/research/` need a local server:

```bash
python -m http.server 8000
# open http://localhost:8000
```

Opening the files directly from disk also works. Links are rewritten to point at `index.html`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository (e.g. `AnuragSingh0000.github.io` for a root URL).
2. In the repository, go to **Settings → Pages → Build and deployment**, choose *Deploy from a branch*, and pick `main` / `(root)`.
3. Share `https://<user>.github.io/work/` with recruiters and `https://<user>.github.io/hello/` with friends.

All paths are relative, so the site also works as a project page (`https://<user>.github.io/<repo>/`).

> Everything in the repo gets published, including any PDFs in the root. Move the CV PDFs out, or link to one on purpose.
