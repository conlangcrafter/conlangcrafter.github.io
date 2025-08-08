class LanguageBrowser {
    constructor() {
        this.languages = [];
        this.currentLanguage = null;
        this.init();
    }

    async init() {
        await this.loadLanguages();
        this.renderLanguageGrid();
        this.setupEventListeners();
    }

    async loadLanguages() {
        try {
            const response = await fetch('data/languages.json');
            const data = await response.json();
            
            this.languages = data.languages.map(lang => ({
                id: lang.id,
                name: `Generated Language ${lang.id.substring(0, 6)}`,
                hasHtml: lang.has_html,
                created: new Date(lang.created_at),
                features: lang.features,
                completeness: lang.completeness,
                hasPhonology: lang.has_phonology,
                hasGrammar: lang.has_grammar,
                hasLexicon: lang.has_lexicon,
                hasTranslations: lang.has_translations
            }));
        } catch (error) {
            console.error('Failed to load languages:', error);
            // Fallback to mock data
            this.languages = [{
                id: '0b212eef',
                name: 'Sample Language',
                hasHtml: true,
                created: new Date(),
                features: ['VSO Word Order', 'Active-Stative Alignment', 'Vowel Harmony'],
                completeness: 100
            }];
        }
    }

    generateRandomFeatures() {
        const possibleFeatures = [
            'VSO Word Order', 'SOV Word Order', 'SVO Word Order',
            'Active-Stative Alignment', 'Ergative-Absolutive Alignment', 'Nominative-Accusative Alignment',
            'Vowel Harmony', 'Consonant Clusters', 'Tone System',
            'Agglutinative Morphology', 'Fusional Morphology', 'Analytic Grammar',
            'Ejective Consonants', 'Prenasalized Stops', 'Lateral Fricatives',
            'Grammatical Gender', 'Dual Number', 'Evidentiality System'
        ];
        
        const numFeatures = Math.floor(Math.random() * 5) + 3;
        const selectedFeatures = [];
        
        while (selectedFeatures.length < numFeatures) {
            const feature = possibleFeatures[Math.floor(Math.random() * possibleFeatures.length)];
            if (!selectedFeatures.includes(feature)) {
                selectedFeatures.push(feature);
            }
        }
        
        return selectedFeatures;
    }

    renderLanguageGrid() {
        const grid = document.getElementById('language-grid');
        if (!grid) return;

        grid.innerHTML = this.languages.map(lang => `
            <div class="language-card" data-id="${lang.id}">
                <div class="language-header">
                    <div class="language-id">${lang.id}</div>
                    <div class="completeness-badge">${lang.completeness}%</div>
                </div>
                <div class="language-name">${lang.name}</div>
                <div class="language-date">${lang.created.toLocaleDateString()}</div>
                <div class="language-features">
                    ${lang.features.slice(0, 2).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                    ${lang.features.length > 2 ? `<span class="feature-more">+${lang.features.length - 2} more</span>` : ''}
                </div>
                <div class="language-status">
                    ${lang.hasHtml ? '<span class="status-indicator available">HTML</span>' : '<span class="status-indicator unavailable">HTML</span>'}
                    ${lang.hasPhonology ? '<span class="status-indicator available">PHON</span>' : '<span class="status-indicator unavailable">PHON</span>'}
                    ${lang.hasGrammar ? '<span class="status-indicator available">GRAM</span>' : '<span class="status-indicator unavailable">GRAM</span>'}
                    ${lang.hasLexicon ? '<span class="status-indicator available">LEX</span>' : '<span class="status-indicator unavailable">LEX</span>'}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Language card clicks
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.language-card');
            if (card) {
                const languageId = card.dataset.id;
                this.selectLanguage(languageId);
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    selectLanguage(languageId) {
        // Update active card
        document.querySelectorAll('.language-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-id="${languageId}"]`).classList.add('active');

        // Find the language
        const language = this.languages.find(l => l.id === languageId);
        if (!language) return;

        this.currentLanguage = language;
        this.loadLanguageViewer(language);
    }

    async loadLanguageViewer(language) {
        const viewer = document.getElementById('language-viewer');
        if (!viewer) return;

        // Show loading state
        viewer.innerHTML = `
            <div class="viewer-loading">
                <div class="loading"></div>
                <p>Loading language ${language.id}...</p>
            </div>
        `;

        try {
            if (language.hasHtml) {
                // Load the actual HTML file
                viewer.innerHTML = `
                    <iframe class="language-content" src="data/sample_language.html"></iframe>
                `;
            } else {
                // Show a placeholder with available information
                this.renderLanguagePlaceholder(viewer, language);
            }
        } catch (error) {
            console.error('Failed to load language viewer:', error);
            viewer.innerHTML = `
                <div class="viewer-error">
                    <h3>Error loading language</h3>
                    <p>Sorry, we couldn't load the details for ${language.name}. Please try another language.</p>
                </div>
            `;
        }
    }

    renderLanguagePlaceholder(viewer, language) {
        viewer.innerHTML = `
            <div class="language-placeholder">
                <div class="placeholder-header">
                    <h3>${language.name}</h3>
                    <div class="language-meta">
                        <span class="language-id">ID: ${language.id}</span>
                        <span class="language-date">Generated: ${language.created.toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="placeholder-content">
                    <div class="feature-section">
                        <h4>Typological Features</h4>
                        <div class="feature-list">
                            ${language.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="placeholder-message">
                        <h4>Coming Soon</h4>
                        <p>Detailed linguistic analysis for this language is being processed. Check back later for:</p>
                        <ul>
                            <li>Complete phonological system</li>
                            <li>Morphological and syntactic rules</li>
                            <li>Comprehensive lexicon</li>
                            <li>Sample translations and examples</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

// Utility functions for enhanced interactivity
class InteractiveFeatures {
    static init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTypingAnimation();
    }

    static setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    static setupHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    static setupTypingAnimation() {
        const quote = document.querySelector('.conlang-quote');
        if (!quote) return;

        const text = quote.textContent;
        quote.textContent = '';
        
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                quote.textContent += text[index];
                index++;
                setTimeout(typeChar, 50);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeChar, 1000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease-out;
    }
    
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-tag {
        display: inline-block;
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        margin: 0.125rem;
    }
    
    .feature-more {
        display: inline-block;
        color: #666;
        font-size: 0.75rem;
        font-style: italic;
        margin-left: 0.25rem;
    }
    
    .language-date {
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.25rem;
    }
    
    .viewer-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        color: #666;
    }
    
    .viewer-loading .loading {
        margin-bottom: 1rem;
    }
    
    .language-placeholder {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
    }
    
    .placeholder-header {
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }
    
    .placeholder-header h3 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .language-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
    }
    
    .feature-section {
        margin-bottom: 2rem;
    }
    
    .feature-section h4 {
        color: #26a69a;
        margin-bottom: 1rem;
    }
    
    .feature-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .placeholder-message {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 10px;
        border-left: 4px solid #26a69a;
    }
    
    .placeholder-message h4 {
        color: #26a69a;
        margin-bottom: 1rem;
    }
    
    .placeholder-message ul {
        margin-top: 1rem;
        padding-left: 1.5rem;
    }
    
    .placeholder-message li {
        margin-bottom: 0.5rem;
        color: #555;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageBrowser();
    InteractiveFeatures.init();
});