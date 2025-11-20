#!/usr/bin/env python3
"""
Update site to Salon Masaży Racibórz with proper massage types
"""

import re
import os

def update_massage_content():
    html_path = "www_ever_clean/www.ever.co.id/index.html"
    
    print("Reading HTML file...")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("\n=== UPDATING TO SALON MASAŻY RACIBÓRZ ===")
    
    # 1. Update title to "Salon Masaży Racibórz"
    print("1. Updating title...")
    html = html.replace(
        '<title>Masaże Racibórz - Profesjonalny Salon Masażu</title>',
        '<title>Salon Masaży Racibórz</title>'
    )
    html = html.replace(
        'Masaże Racibórz - Profesjonalny Salon Masażu',
        'Salon Masaży Racibórz'
    )
    
    # 2. Update main heading
    print("2. Updating main heading...")
    html = html.replace(
        'Profesjonalne Masaże w Raciborzu',
        'Salon Masaży Racibórz'
    )
    
    # 3. Update menu items with proper massage types
    print("3. Updating menu items with massage types...")
    
    # List of proper Polish massage types
    massage_types = [
        'Masaż Relaksacyjny',
        'Masaż Leczniczy',
        'Masaż Sportowy',
        'Masaż Głęboki',
        'Masaż Twarzy',
        'Masaż Pleców',
        'Masaż Stóp',
        'Masaż Antycellulitowy',
        'Masaż Bańką Chińską',
        'Masaż Gorącymi Kamieniami',
        'Masaż Limfatyczny',
        'Masaż Dla Kobiet w Ciąży'
    ]
    
    # Find all menu items and replace them
    menu_pattern = r'<h3 data-gsap="txt\.3" class="text-font-body text-size-medium text-weight-light is-nav">([^<]+)</h3>'
    
    def replace_menu_item(match):
        # Get current text
        current_text = match.group(1)
        # Find which massage type index we're at by counting previous matches
        # For now, let's use a simpler approach - replace known patterns
        return match.group(0)  # Return unchanged for now, we'll do direct replacements
    
    # Direct replacements for each menu item
    replacements = [
        ('Masaż Leczniczy', 'Masaż Relaksacyjny'),
        ('Masaż Sportowy', 'Masaż Leczniczy'),
        ('Masaż Głęboki', 'Masaż Sportowy'),
        ('Masaż Twarzy', 'Masaż Głęboki'),
        ('Masaż Dłoni', 'Masaż Twarzy'),
        ('Masaż Stóp', 'Masaż Pleców'),
        ('Masaż Stóp i Nóg', 'Masaż Stóp'),
        ('Masaż Antycellulitowy', 'Masaż Antycellulitowy'),
        ('Masaż Bańką Chińską', 'Masaż Bańką Chińską'),
    ]
    
    # Actually, let's find all menu items and replace them systematically
    # First, let's find the pattern for menu items
    menu_items_pattern = r'(<div class="navbar-menu_title-wrapper"><h3 data-gsap="txt\.3" class="text-font-body text-size-medium text-weight-light is-nav">)([^<]+)(</h3></div>)'
    
    matches = list(re.finditer(menu_items_pattern, html))
    print(f"Found {len(matches)} menu items")
    
    # Replace each menu item with proper massage types
    new_massage_types = [
        'Masaż Relaksacyjny',
        'Masaż Leczniczy', 
        'Masaż Sportowy',
        'Masaż Głęboki',
        'Masaż Twarzy',
        'Masaż Pleców',
        'Masaż Stóp',
        'Masaż Antycellulitowy',
        'Masaż Bańką Chińską',
        'Masaż Gorącymi Kamieniami',
        'Masaż Limfatyczny',
        'Masaż Dla Kobiet w Ciąży'
    ]
    
    # Replace in reverse order to maintain positions
    for i, match in enumerate(reversed(matches)):
        if i < len(new_massage_types):
            old_text = match.group(2)
            new_text = new_massage_types[-(i+1)]
            html = html[:match.start(2)] + new_text + html[match.end(2):]
            print(f"  Replaced '{old_text}' with '{new_text}'")
    
    # Also update the first menu item (Masaż Relaksacyjny)
    html = re.sub(
        r'(<h3 data-gsap="txt\.3" class="text-font-body text-size-medium text-weight-light is-nav">)Masaż Relaksacyjny(</h3>)',
        r'\1Masaż Relaksacyjny\2',
        html,
        count=1
    )
    
    # 4. Update any remaining service references
    print("4. Updating service references...")
    
    # Write updated HTML
    print("\n=== SAVING UPDATED FILE ===")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n✓ Update complete!")
    print(f"✓ File saved to: {html_path}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    try:
        update_massage_content()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

