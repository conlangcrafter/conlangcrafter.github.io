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
├── data/
│   ├── languages.json     # Language metadata for browser
│   └── sample_language.html # Sample language HTML (from generator)
└── generate_language_data.py # Script to scan and create language metadata
```

## Features

- **Modern Design**: Clean, academic-style layout inspired by successful ML project pages
- **Interactive Language Browser**: Browse and explore generated constructed languages
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Paper Integration**: Incorporates content and figures from the research paper
- **Live Language Data**: Dynamically loads available languages from the repository

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

### Updating Language Data

To refresh the language browser with new generated languages:

```bash
cd web/
python generate_language_data.py ..
```

This will scan the `output/languages/languages/` directory and update `data/languages.json`.

## Interactive Features

### Language Browser
- **Grid View**: Displays all available languages with metadata
- **Status Indicators**: Shows which components (HTML, phonology, grammar, lexicon) are available
- **Completeness Badges**: Visual indication of language completeness percentage
- **Dynamic Loading**: Languages with HTML files can be viewed directly in the interface

### Animations and Effects
- **Scroll Animations**: Sections animate in as you scroll
- **Typing Effect**: The conlang quote types out dynamically
- **Hover Effects**: Interactive elements respond to mouse interactions
- **Smooth Scrolling**: Navigation links scroll smoothly to sections

## Design Inspiration

The design draws inspiration from successful academic project pages, particularly:
- Clean, minimal aesthetic with focused typography
- Hero section with compelling quote from generated language
- Clear information hierarchy
- Interactive demo section for hands-on exploration
- Professional color scheme with accent colors from the paper

## Technical Notes

- **No Build Process**: Pure HTML/CSS/JavaScript for simplicity
- **ES6+ JavaScript**: Uses modern JavaScript features (async/await, fetch, etc.)
- **CSS Grid**: Modern layout techniques for responsive design
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## Customization

### Adding New Sections
1. Add HTML structure to `index.html`
2. Style in `css/style.css`
3. Add interactivity in `js/main.js` if needed

### Modifying Language Browser
- Language metadata format is defined in `generate_language_data.py`
- Browser behavior is handled by the `LanguageBrowser` class in `main.js`
- Styling for language cards and viewer is in `style.css`

### Updating Content
- Paper content is in the HTML sections
- Images are referenced from the `assets/` directory
- Update the citation section with final paper details