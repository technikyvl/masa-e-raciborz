#!/usr/bin/env python3
"""
Zastosuj wszystkie wcześniejsze zmiany: tłumaczenie, zmiana tytułu, menu, itp.
"""

import re

def apply_all_changes():
    html_path = "www_ever_clean/www.ever.co.id/index.html"
    
    print("Czytanie pliku HTML...")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("\n=== ZASTOSOWYWANIE WSZYSTKICH ZMIAN ===")
    
    # 1. Główny nagłówek
    print("1. Aktualizowanie głównego nagłówka...")
    html = re.sub(r'<h1[^>]*>.*?</h1>', '<h1 gfluo-scale="1" data-gsap="txt.7" gfluo-duration="0.5" gfluo-delay="0" gfluo-ease="power1.out" gfluo-y="0" gfluo-rotation="0" class="heading-style-h2">Masaże racibórz</h1>', html, count=1, flags=re.IGNORECASE | re.DOTALL)
    
    # 2. Menu - zmiana na typy masaży
    print("2. Aktualizowanie menu...")
    menu_map = {
        "Lash Extension": "Masaż Relaksacyjny",
        "Keratiné Filler Lift": "Masaż Leczniczy", 
        "Stem Cell Lash Regrowth": "Masaż Sportowy",
        "Brow Bomber": "Masaż Głęboki",
        "Brow & Face Threading": "Masaż Twarzy",
        "Manicure": "Masaż Pleców",
        "Nail Art": "Masaż Stóp",
        "Pedicure": "Masaż Stóp",
        "Waxing": "Masaż Antycellulitowy",
        "Semi Permanent Make Up": "Masaż Gorącymi Kamieniami",
        "Body Treatment": "Masaż Limfatyczny",
        "Ever House": "Masaż Shiatsu"
    }
    
    for old, new in menu_map.items():
        html = html.replace(f'>{old}<', f'>{new}<')
        html = html.replace(f'>{old}</h3>', f'>{new}</h3>')
    
    # 3. Teksty angielskie na polski
    print("3. Tłumaczenie tekstów...")
    translations = {
        "beauty in every detail": "zdrowie w każdym dotyku",
        "MAKE AN APPOINTMENT": "UMÓW WIZYTĘ",
        "Scroll to explore": "Przewiń, aby odkryć",
        "Your beauty is celebrated through every precise touch.": "Twoje zdrowie jest celebrowane przez każdy precyzyjny dotyk.",
        "Beauty that stays with you. Expertly applied semi-permanent makeup enhances your natural features with subtle definition. From microblading to soft lip tinting, every stroke is placed with care for a look that lasts.": "Relaks, który zostaje z Tobą. Profesjonalnie wykonane masaże wzmacniają Twoje naturalne piękno i zdrowie. Od masażu relaksacyjnego po leczniczy, każdy ruch jest wykonywany z troską o trwałe efekty.",
        "SCHEDULE AN APPOINTMENT": "UMÓW WIZYTĘ",
        "ChAT WITH CONSULTANT": "ROZMOWA Z KONSULTANTEM",
        "Website Build By": "Strona stworzona przez",
        "OUR STORY": "NASZA HISTORIA",
        "HOME": "STRONA GŁÓWNA",
        "SERVICE": "USŁUGI",
        "LOCATION": "LOKALIZACJE",
        "Follow Us": "Śledź Nas",
        "Company": "Firma",
        "Contact": "Kontakt",
        "Privacy Policy": "Polityka Prywatności",
        "Terms": "Regulamin",
        "Cookies": "Ustawienia Ciasteczek",
        "ENDLESS POSSIBILLITY WITH": "NIESKOŃCZONE MOŻLIWOŚCI Z",
        "PERSONALISED SERVICES": "PERSONALIZOWANE MASAŻE",
        "At EVER, no detail is overlooked. Each service is carefully crafted to complement your natural features—because true beauty is personal": "W naszym salonie masażu każdy detal jest przemyślany. Każdy masaż jest indywidualnie dopasowany do Twoich potrzeb—bo prawdziwe zdrowie jest osobiste.",
        "CHECK ALL SERVICES": "ZOBACZ WSZYSTKIE MASAŻE",
        "Quiet luxury for your body. Sculpting, shaping, and releasing tension. Our signature lymphatic drainage ritual are designed to bring you back to center. Gentle yet effective, with proven results that help you feel where true wellness lives.": "Spokojny luksus dla Twojego ciała. Relaks, odprężenie i uwolnienie napięcia. Nasze profesjonalne masaże są zaprojektowane, aby przywrócić Cię do równowagi. Delikatne, a jednocześnie skuteczne, z potwierdzonymi rezultatami, które pomagają poczuć, gdzie mieszka prawdziwe zdrowie.",
        "MASAŻE RACIBÓRZ - ZDROWIE I RELAKS": "MASAŻE RACIBÓRZ - ZDROWIE I RELAKS"
    }
    
    for old, new in translations.items():
        html = html.replace(old, new)
    
    # 4. Opis główny
    print("4. Aktualizowanie opisu głównego...")
    html = re.sub(r'<p[^>]*data-gsap="par\.5"[^>]*>.*?</p>', 
                  '<p gfluo-scale="1" data-gsap="par.5" gfluo-duration="0.25" gfluo-delay="0" gfluo-ease="power1.out" gfluo-y="0" gfluo-rotation="0" class="text-size-small text-style-allcaps">Doświadczeni masażyści, komfortowe warunki i szeroki wybór technik masażu dla Twojego zdrowia i relaksu.</p>', 
                  html, count=1, flags=re.IGNORECASE | re.DOTALL)
    
    # 5. Marquee text
    print("5. Aktualizowanie marquee...")
    html = re.sub(r'<div class="marquee-text">.*?</div>', 
                  '<div class="marquee-text">MASAŻE RACIBÓRZ - ZDROWIE I RELAKS</div>', 
                  html, flags=re.IGNORECASE | re.DOTALL)
    
    # 6. Footer credit
    print("6. Aktualizowanie footera...")
    html = html.replace('The Carrot Cake Studio', 'Wojciech Zaniewski & Jakub Eliasik | BeautyRise')
    
    # 7. Usuń wszystkie pozostałe "EVER" z tekstów
    print("7. Usuwanie pozostałych EVER...")
    html = re.sub(r'\bEVER\b', '', html, flags=re.IGNORECASE)
    
    print("\nZapisywanie pliku...")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("✓ Gotowe! Wszystkie zmiany zastosowane!")

if __name__ == "__main__":
    apply_all_changes()

