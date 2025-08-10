# ConlangCrafter Project Page

## Structure

```
conlangcrafter.github.io/
├── index.html              # Main language browser interface
├── css/
│   └── style.css           # Responsive styling with teal theme
├── js/
│   ├── main.js            # Core browser functionality
│   └── language_renderer.js # Language HTML generation
├── assets/                 # Research paper figures and diagrams
│   ├── teaser/            # Teaser images
│   ├── pipeline/          # System pipeline diagrams
│   ├── experiments/       # Experimental results
│   └── appendix/         # Additional visualizations
└── data/
    ├── languages.json     # Central language metadata with names/IPA
    └── [language_id]/     # Individual language data folders
        ├── metadata.json  # Language metadata
        ├── phonology.txt  # Phonological description
        ├── grammar.txt    # Grammatical analysis
        └── lexicon.json   # Complete vocabulary (optional)
```

## Usage

### Viewing the Site

Since this is a static site, you can serve it locally:

```bash
# Option 1: Python simple server
python -m http.server 8000

# Option 2: Node.js serve
npx serve .

# Option 3: Any static file server
```

Then visit `http://localhost:8000` in your browser.