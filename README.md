# ConlangCrafter Project Page

This directory contains the project website for ConlangCrafter, showcasing the research and providing an interactive browser for generated constructed languages.

## Structure

```
web/
├── index.html              # Main project page
├── css/
│   └── style.css           # Stylesheet for the project page
├── js/
│   └── main.js            # JavaScript for interactive features
├── assets/                 # Images and media from the paper
│   ├── teaser/            # Teaser images
│   ├── pipeline/          # Pipeline diagrams
│   ├── experiments/       # Experiment results visualizations
│   └── appendix/         # Additional figures
└── data/
    ├── languages.json     # Language metadata for browser
    └── sample_language.html # Sample language HTML (from generator)
```

## Usage

### Viewing the Site

Since this is a static site, you can serve it locally:

```bash
# Option 1: Python simple server
cd web/
python -m http.server 8000

# Option 2: Node.js serve
npx serve .

# Option 3: Any static file server
```

Then visit `http://localhost:8000` in your browser.