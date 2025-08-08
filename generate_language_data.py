#!/usr/bin/env python3
"""
Generate language data for the web interface by scanning the output directories
and creating JSON metadata for each language.
"""

import os
import json
import sys
from pathlib import Path

def scan_languages(base_path):
    """Scan the languages directory and collect metadata for each language."""
    languages = []
    
    # Check both possible locations
    lang_paths = [
        Path(base_path) / "output" / "languages" / "languages",
        Path(base_path) / "languages" / "languages" 
    ]
    
    for lang_dir in lang_paths:
        if lang_dir.exists():
            print(f"Scanning directory: {lang_dir}")
            
            for lang_folder in lang_dir.iterdir():
                if lang_folder.is_dir() and len(lang_folder.name) == 8:  # Language ID format
                    lang_data = process_language(lang_folder)
                    if lang_data:
                        languages.append(lang_data)
    
    return languages

def process_language(lang_folder):
    """Process a single language directory and extract metadata."""
    lang_id = lang_folder.name
    
    try:
        # Load basic metadata
        metadata_file = lang_folder / "metadata.json"
        metadata = {}
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
        
        # Check what files are available
        has_html = (lang_folder / f"{lang_id}_language_reference.html").exists()
        has_phonology = (lang_folder / "memory" / "phonology" / "phonology.txt").exists()
        has_grammar = (lang_folder / "memory" / "grammar" / "grammar.txt").exists()
        has_lexicon = (lang_folder / "memory" / "lexicon" / "lexicon.csv").exists()
        has_translations = (lang_folder / "memory" / "translation" / "translation_individual.json").exists()
        
        # Extract basic features from grammar if available
        features = extract_features(lang_folder)
        
        lang_data = {
            "id": lang_id,
            "created_at": metadata.get("created_at", "2025-08-06 12:00:00"),
            "has_html": has_html,
            "has_phonology": has_phonology,
            "has_grammar": has_grammar,
            "has_lexicon": has_lexicon,
            "has_translations": has_translations,
            "features": features,
            "completeness": calculate_completeness(has_phonology, has_grammar, has_lexicon, has_translations)
        }
        
        return lang_data
        
    except Exception as e:
        print(f"Error processing language {lang_id}: {e}")
        return None

def extract_features(lang_folder):
    """Extract typological features from language files."""
    features = []
    
    # Try to extract features from grammar file
    grammar_file = lang_folder / "memory" / "grammar" / "grammar.txt"
    if grammar_file.exists():
        try:
            with open(grammar_file, 'r') as f:
                grammar_text = f.read().lower()
                
                # Look for common typological features
                if "vso" in grammar_text or "verb-subject-object" in grammar_text:
                    features.append("VSO Word Order")
                elif "sov" in grammar_text or "subject-object-verb" in grammar_text:
                    features.append("SOV Word Order")
                elif "svo" in grammar_text or "subject-verb-object" in grammar_text:
                    features.append("SVO Word Order")
                
                if "active-stative" in grammar_text:
                    features.append("Active-Stative Alignment")
                elif "ergative" in grammar_text:
                    features.append("Ergative-Absolutive")
                elif "nominative" in grammar_text:
                    features.append("Nominative-Accusative")
                
                if "vowel harmony" in grammar_text:
                    features.append("Vowel Harmony")
                
                if "agglutinative" in grammar_text:
                    features.append("Agglutinative")
                elif "analytic" in grammar_text:
                    features.append("Analytic")
                
        except Exception as e:
            print(f"Error reading grammar file for {lang_folder.name}: {e}")
    
    # Try to extract phonological features
    phonology_file = lang_folder / "memory" / "phonology" / "phonology.txt"
    if phonology_file.exists():
        try:
            with open(phonology_file, 'r') as f:
                phon_text = f.read().lower()
                
                if "ejective" in phon_text:
                    features.append("Ejective Consonants")
                if "prenasalized" in phon_text:
                    features.append("Prenasalized Stops")
                if "tone" in phon_text:
                    features.append("Tonal System")
                
        except Exception as e:
            print(f"Error reading phonology file for {lang_folder.name}: {e}")
    
    # If no features found, add some defaults
    if not features:
        features = ["Complex Morphology", "Rich Phonology", "Unique Typology"]
    
    return features[:6]  # Limit to 6 features for display

def calculate_completeness(has_phonology, has_grammar, has_lexicon, has_translations):
    """Calculate completeness percentage based on available components."""
    total_components = 4
    available_components = sum([has_phonology, has_grammar, has_lexicon, has_translations])
    return int((available_components / total_components) * 100)

def main():
    """Main function to generate language data."""
    if len(sys.argv) > 1:
        base_path = sys.argv[1]
    else:
        base_path = "."
    
    print(f"Scanning for languages in: {base_path}")
    languages = scan_languages(base_path)
    
    # Sort by creation date (newest first)
    languages.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Create output
    output_data = {
        "languages": languages,
        "total_count": len(languages),
        "generated_at": "2025-08-06T12:00:00Z"
    }
    
    # Save to web/data directory
    web_data_dir = Path(base_path) / "web" / "data"
    web_data_dir.mkdir(exist_ok=True)
    
    output_file = web_data_dir / "languages.json"
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Generated language data for {len(languages)} languages")
    print(f"Saved to: {output_file}")
    
    # Print summary
    complete_languages = [l for l in languages if l["completeness"] == 100]
    html_languages = [l for l in languages if l["has_html"]]
    
    print(f"\nSummary:")
    print(f"  Total languages: {len(languages)}")
    print(f"  Complete languages: {len(complete_languages)}")
    print(f"  Languages with HTML: {len(html_languages)}")
    
    # Show first few languages as examples
    print(f"\nFirst 5 languages:")
    for lang in languages[:5]:
        print(f"  {lang['id']}: {lang['completeness']}% complete, {len(lang['features'])} features")

if __name__ == "__main__":
    main()