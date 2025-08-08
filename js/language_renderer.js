/**
 * Language Renderer - Programmatically generates HTML from raw language data
 */

class LanguageRenderer {
    constructor() {
        this.tealColors = {
            primary: '#26a69a',
            dark: '#00695c',
            light: '#80cbc4',
            accent: '#4db6ac'
        };
    }

    /**
     * Generate complete HTML for a language
     */
    async generateLanguageHTML(languageId) {
        try {
            // Load language data
            const metadata = await this.loadJSON(`data/${languageId}/metadata.json`);
            const phonology = await this.loadText(`data/${languageId}/phonology.txt`);
            const grammar = await this.loadText(`data/${languageId}/grammar.txt`);
            const lexicon = await this.loadJSON(`data/${languageId}/lexicon.json`);

            return this.renderLanguageHTML(metadata, phonology, grammar, lexicon);
        } catch (error) {
            console.error(`Error generating HTML for ${languageId}:`, error);
            return this.renderErrorHTML(languageId, error);
        }
    }

    /**
     * Load JSON file
     */
    async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    /**
     * Load text file
     */
    async loadText(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            return await response.text();
        } catch (error) {
            return null;
        }
    }

    /**
     * Render the complete language HTML
     */
    renderLanguageHTML(metadata, phonology, grammar, lexicon) {
        const style = this.generateCSS();
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata?.name || 'Unknown Language'}</title>
    <style>${style}</style>
</head>
<body>
    
    <div class="header">
        <h1>${metadata?.name || 'Unknown Language'}</h1>
        ${this.renderUserConstraints(metadata?.user_constraints)}
    </div>

    ${this.renderPhonology(phonology)}
    ${this.renderGrammar(grammar)}
    ${this.renderLexicon(lexicon)}

    <script>
        
        // Collapse/expand sections
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isCollapsed = content.style.display === 'none';
                content.style.display = isCollapsed ? 'block' : 'none';
                header.querySelector('.collapse-indicator').textContent = isCollapsed ? '▼' : '▶';
            });
        });
    </script>
</body>
</html>`;
    }

    /**
     * Generate CSS styles with teal theme
     */
    generateCSS() {
        return `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fafafa;
        }
        
        
        .header {
            background: linear-gradient(135deg, ${this.tealColors.primary} 0%, ${this.tealColors.dark} 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 300;
        }
        
        .user-constraints {
            background: rgba(255, 255, 255, 0.15);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            border-left: 4px solid rgba(255, 255, 255, 0.3);
        }
        
        .user-constraints h3 {
            margin: 0 0 0.5rem 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
        }
        
        .user-constraints p {
            margin: 0;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
        }
        
        .section {
            background: white;
            margin: 2rem 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .section-header {
            background: ${this.tealColors.light};
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.3s ease;
        }
        
        .section-header:hover {
            background: ${this.tealColors.accent};
        }
        
        .section-header h2 {
            color: ${this.tealColors.dark};
            margin: 0;
            flex-grow: 1;
        }
        
        .collapse-indicator {
            color: ${this.tealColors.dark};
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .section-content {
            padding: 2rem;
        }
        
        .section h3 {
            color: ${this.tealColors.primary};
            margin-top: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid ${this.tealColors.light};
        }
        
        .section h4 {
            color: ${this.tealColors.dark};
            margin-top: 1rem;
        }
        
        .phonology-table, .lexicon-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .phonology-table th, .phonology-table td,
        .lexicon-table th, .lexicon-table td {
            border: 1px solid #e0e0e0;
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
        }
        
        .phonology-table th, .lexicon-table th {
            background-color: ${this.tealColors.light};
            font-weight: 600;
            text-align: center;
            color: ${this.tealColors.dark};
        }
        
        .phonology-table .row-header {
            background-color: ${this.tealColors.light};
            font-weight: 600;
            text-align: left;
            color: ${this.tealColors.dark};
        }
        
        .phonology-table td {
            text-align: center;
            font-family: 'Times New Roman', serif;
        }
        
        .lexicon-table {
            font-size: 0.9rem;
        }
        
        .lexicon-table td:first-child {
            font-family: 'Times New Roman', serif;
            font-weight: bold;
            color: ${this.tealColors.dark};
        }
        
        .conlang-text {
            font-family: 'Times New Roman', serif;
            font-style: italic;
            color: ${this.tealColors.dark};
            font-size: 1.1rem;
        }
        
        .gloss {
            font-family: monospace;
            font-size: 0.85rem;
            color: #666;
            margin: 0.25rem 0;
        }
        
        .translation {
            color: #333;
            font-style: italic;
        }
        
        .example-block {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border-left: 4px solid ${this.tealColors.primary};
        }
        
        pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .feature-highlight {
            background: linear-gradient(90deg, ${this.tealColors.light}, transparent);
            padding: 0.25rem 0;
            margin: 0.125rem 0;
            border-left: 3px solid ${this.tealColors.primary};
            padding-left: 1rem;
        }
        `;
    }

    /**
     * Render user constraints section
     */
    renderUserConstraints(constraints) {
        if (!constraints) return '';
        
        return `
        <div class="user-constraints">
            <h3>User-specified constraints:</h3>
            <p>${this.escapeHtml(constraints)}</p>
        </div>`;
    }

    /**
     * Render phonology section
     */
    renderPhonology(phonologyText) {
        if (!phonologyText) {
            return '<div class="section"><div class="section-header"><h2>Phonology</h2><span class="collapse-indicator">▼</span></div><div class="section-content"><p><em>Phonological description not available.</em></p></div></div>';
        }

        const processedText = this.processMarkdownToHTML(phonologyText);
        
        return `
        <div class="section">
            <div class="section-header">
                <h2>Phonology</h2>
                <span class="collapse-indicator">▼</span>
            </div>
            <div class="section-content">
                ${processedText}
            </div>
        </div>`;
    }

    /**
     * Render grammar section
     */
    renderGrammar(grammarText) {
        if (!grammarText) {
            return '<div class="section"><div class="section-header"><h2>Grammar</h2><span class="collapse-indicator">▼</span></div><div class="section-content"><p><em>Grammatical description not available.</em></p></div></div>';
        }

        const processedText = this.processMarkdownToHTML(grammarText);
        
        return `
        <div class="section">
            <div class="section-header">
                <h2>Grammar</h2>
                <span class="collapse-indicator">▼</span>
            </div>
            <div class="section-content">
                ${processedText}
            </div>
        </div>`;
    }

    /**
     * Render lexicon section
     */
    renderLexicon(lexiconData) {
        if (!lexiconData || !Array.isArray(lexiconData) || lexiconData.length === 0) {
            return '<div class="section"><div class="section-header"><h2>Lexicon</h2><span class="collapse-indicator">▼</span></div><div class="section-content"><p><em>Lexicon not available.</em></p></div></div>';
        }

        const lexiconHTML = lexiconData.slice(0, 50).map(entry => `
            <tr>
                <td class="conlang-text">${this.escapeHtml(entry.word || '')}</td>
                <td>${this.escapeHtml(entry.pos || '')}</td>
                <td>${this.escapeHtml(entry.definition || '')}</td>
            </tr>
        `).join('');

        const moreEntries = lexiconData.length > 50 ? `<p><em>... and ${lexiconData.length - 50} more entries</em></p>` : '';

        return `
        <div class="section">
            <div class="section-header">
                <h2>Lexicon</h2>
                <span class="collapse-indicator">▼</span>
            </div>
            <div class="section-content">
                <p>Total vocabulary: <strong>${lexiconData.length}</strong> words</p>
                <table class="lexicon-table">
                    <thead>
                        <tr>
                            <th>Word</th>
                            <th>Part of Speech</th>
                            <th>Definition</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lexiconHTML}
                    </tbody>
                </table>
                ${moreEntries}
            </div>
        </div>`;
    }

    /**
     * Process markdown-style text to HTML
     */
    processMarkdownToHTML(text) {
        if (!text) return '';

        let html = this.escapeHtml(text);
        
        // Convert markdown headers
        html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
        
        // Convert markdown tables
        html = this.convertMarkdownTables(html);
        
        // Convert bold/italic
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Convert paragraphs
        html = html.replace(/\n\n+/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/<p>\s*(<h[1-6])/g, '$1');
        html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1');
        
        return html;
    }

    /**
     * Convert markdown tables to HTML
     */
    convertMarkdownTables(text) {
        const tableRegex = /(\|.+\|\n)+/g;
        return text.replace(tableRegex, (match) => {
            const rows = match.trim().split('\n');
            let html = '<table class="phonology-table">\n';
            
            rows.forEach((row, index) => {
                if (index === 1 && row.includes('---')) return; // Skip separator row
                
                const cells = row.split('|').slice(1, -1); // Remove empty first/last
                const tag = index === 0 ? 'th' : 'td';
                const rowClass = index === 0 ? '' : (cells[0].trim().startsWith('**') ? ' class="row-header"' : '');
                
                html += `  <tr${rowClass}>\n`;
                cells.forEach(cell => {
                    let content = cell.trim();
                    content = content.replace(/\*\*(.+?)\*\*/g, '$1'); // Remove bold in headers
                    html += `    <${tag}>${content}</${tag}>\n`;
                });
                html += '  </tr>\n';
            });
            
            html += '</table>\n';
            return html;
        });
    }

    /**
     * Render error HTML
     */
    renderErrorHTML(languageId, error) {
        return `
        <div style="padding: 2rem; text-align: center; color: #666;">
            <h2>Error Loading Language ${languageId}</h2>
            <p>Sorry, we couldn't load the details for this language.</p>
            <p style="font-size: 0.9rem; color: #999;">${error.message}</p>
        </div>`;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in main.js
window.LanguageRenderer = LanguageRenderer;