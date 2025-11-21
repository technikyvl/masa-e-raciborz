#!/usr/bin/env python3
"""
Napraw stronę i usuń wszystkie EVER w kontrolowany sposób
"""

import re

def fix_and_remove_ever():
    html_path = "www_ever_clean/www.ever.co.id/index.html"
    
    print("Czytanie pliku HTML...")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("\n=== NAPRAWA I USUWANIE EVER ===")
    
    # 1. Najpierw zastosuj wszystkie nasze wcześniejsze zmiany (tłumaczenie, itp.)
    print("1. Aktualizowanie tytułu i meta tagów...")
    html = html.replace('<title>Ever Beauty In Every Detail</title>', '<title>Masaże racibórz</title>')
    html = html.replace('lang="en"', 'lang="pl"')
    html = html.replace('data-wf-domain="www.ever.co.id"', 'data-wf-domain="www.masaze-raciborz.pl"')
    
    # 2. Usuń tylko elementy z logo EVER, nie całą strukturę
    print("2. Usuwanie elementów z logo EVER...")
    # Usuń divy z everlogo (ale zachowaj strukturę)
    html = re.sub(r'<div[^>]*class="[^"]*everlogo[^"]*"[^>]*>.*?</div>', '', html, flags=re.IGNORECASE | re.DOTALL)
    
    # 3. Usuń obrazy z EVER w nazwach
    print("3. Usuwanie obrazów z EVER...")
    html = re.sub(r'<img[^>]*src="[^"]*EVER[^"]*"[^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<img[^>]*src=\'[^\']*EVER[^\']*\'[^>]*>', '', html, flags=re.IGNORECASE)
    
    # 4. Usuń linki z EVER
    print("4. Usuwanie linków z EVER...")
    html = re.sub(r'<link[^>]*href="[^"]*ever[^"]*"[^>]*>', '', html, flags=re.IGNORECASE)
    
    # 5. Usuń data-src z EVER
    print("5. Usuwanie data-src z EVER...")
    html = re.sub(r'data-src="[^"]*ever[^"]*"', '', html, flags=re.IGNORECASE)
    
    # 6. Usuń teksty "EVER" (ale nie "every", "never", itp.)
    print("6. Usuwanie tekstów EVER...")
    html = re.sub(r'\bEVER\b', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\bEver\b', '', html)
    
    # 7. Usuń sekcję tricks-slider (zawiera logo EVER)
    print("7. Ukrywanie sekcji tricks-slider...")
    html = html.replace('<div class="padding-global"><section class="section"><div class="tricks-slider">', 
                       '<div class="padding-global"><section class="section" style="display:none;"><div class="tricks-slider">')
    
    # 8. Ukryj logo EVER w footerze
    print("8. Ukrywanie logo EVER w footerze...")
    html = re.sub(r'<div[^>]*class="[^"]*footer15_image-wrapper[^"]*"[^>]*>.*?ever-logo\.json.*?</div>', 
                  lambda m: m.group(0).replace('<div', '<div style="display:none;"'), html, flags=re.IGNORECASE | re.DOTALL)
    
    # 9. Ukryj logo EVER w header115
    print("9. Ukrywanie logo EVER w header115...")
    html = re.sub(r'<div[^>]*id="w-node-_5b8d6493-21b2-45a1-52b5-4044aecac776[^"]*"[^>]*>', 
                  '<div id="w-node-_5b8d6493-21b2-45a1-52b5-4044aecac776-6e1efd83" class="header115_content-right-copy" style="display:none;">', html)
    html = re.sub(r'<div[^>]*id="w-node-_5b8d6493-21b2-45a1-52b5-4044aecac781[^"]*"[^>]*>', 
                  '<div id="w-node-_5b8d6493-21b2-45a1-52b5-4044aecac781-6e1efd83" class="header115_content-right" style="display:none;">', html)
    
    # 10. Dodaj CSS ukrywający wszystkie EVER
    print("10. Dodawanie CSS...")
    css_to_add = """
/* Hide all EVER logos */
.everlogo, [class*="everlogo"], [class*="ever-logo"], .brand-logo-wrapper, [src*="EVER"], [src*="ever"], [alt*="EVER"] { display: none !important; visibility: hidden !important; opacity: 0 !important; }
"""
    
    # Znajdź pierwszy tag <style> i dodaj CSS
    if '<style>' in html:
        html = html.replace('<style>', '<style>' + css_to_add, 1)
    elif '</head>' in html:
        html = html.replace('</head>', '<style>' + css_to_add + '</style></head>')
    
    # 11. Zaktualizuj footer
    print("11. Aktualizowanie footera...")
    html = html.replace('Strona stworzona przez <a href="https://www.thecarrotcake.co" target="_blank">The Carrot Cake Studio</a>', 
                       'by Wojciech Zaniewski & Jakub Eliasik | BeautyRise')
    
    # 12. Usuń "EVER" z meta og:image
    print("12. Aktualizowanie meta tagów...")
    html = html.replace('EVER%20COVER%20IMAGE', 'COVER%20IMAGE')
    
    print("\nZapisywanie pliku...")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("✓ Gotowe! Strona naprawiona i EVER usunięte!")

if __name__ == "__main__":
    fix_and_remove_ever()

