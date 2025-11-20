#!/usr/bin/env python3
"""
Przetłumacz całą stronę na polski i usuń wszystkie odniesienia do Ever
"""

import re
import os

def translate_to_polish():
    html_path = "www_ever_clean/www.ever.co.id/index.html"
    
    print("Czytanie pliku HTML...")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("\n=== TŁUMACZENIE NA POLSKI ===")
    
    # 1. Zmień tytuł na "Masaże racibórz"
    print("1. Aktualizowanie tytułu...")
    html = html.replace('Salon Masaży Racibórz', 'Masaże racibórz')
    html = html.replace('<title>Salon Masaży Racibórz</title>', '<title>Masaże racibórz</title>')
    
    # 2. Usuń wszystkie odniesienia do Ever w linkach i tekstach
    print("2. Usuwanie odniesień do Ever...")
    html = re.sub(r'everlash\.id', 'masaze-raciborz.pl', html, flags=re.IGNORECASE)
    html = re.sub(r'everlash_lash_expert', 'masaze_raciborz', html, flags=re.IGNORECASE)
    html = re.sub(r'Halo\s+EVER', 'Cześć', html, flags=re.IGNORECASE)
    html = re.sub(r'Halo\s+Everlash', 'Cześć', html, flags=re.IGNORECASE)
    
    # 3. Tłumaczenie tekstów interfejsu
    print("3. Tłumaczenie tekstów interfejsu...")
    
    translations = {
        # Menu i nawigacja
        'MENU': 'MENU',
        'FACEBOOK': 'FACEBOOK',
        'INSTAGRAM': 'INSTAGRAM',
        
        # Główne nagłówki
        'Your Moment of Glow<br/>Begins Here': 'Twój Moment Relaksu<br/>Zaczyna Się Tutaj',
        "Your Moment of Glow\nBegins Here": 'Twój Moment Relaksu\nZaczyna Się Tutaj',
        "Let's make this about you. A quiet moment for thoughtful treatments designed to restore balance and highlight your natural charm. Because feeling good starts here.": 
        'Zróbmy to dla Ciebie. Spokojna chwila dla przemyślanych zabiegów zaprojektowanych, aby przywrócić równowagę i podkreślić Twoje naturalne piękno. Bo dobre samopoczucie zaczyna się tutaj.',
        'FIND US': 'ZNAJDŹ NAS',
        'FIND&nbsp;US': 'ZNAJDŹ&nbsp;NAS',
        
        # FAQ
        'Frequently Asked Questions': 'Najczęściej Zadawane Pytania',
        "Didn't find the answer to your question?<br/>Send it to us by chat. We will be happy to answer you!": 
        'Nie znalazłeś odpowiedzi na swoje pytanie?<br/>Wyślij je do nas przez czat. Chętnie odpowiemy!',
        'Contact': 'Kontakt',
        'What type of payment is accepted?': 'Jakie formy płatności są akceptowane?',
        'We accept all kinds of payments, but we do prefer cashless for smoother and faster transactions.': 
        'Akceptujemy wszystkie formy płatności, ale preferujemy płatności bezgotówkowe dla płynniejszych i szybszych transakcji.',
        'Where is Ever House located? What are the opening hours?': 
        'Gdzie znajduje się salon? Jakie są godziny otwarcia?',
        'Please refer to this<strong> </strong><a href="/location"><strong>link</strong></a><strong> </strong>to see each one of salon\'s operational hour': 
        'Proszę sprawdzić ten<strong> </strong><a href="/location"><strong>link</strong></a><strong> </strong>aby zobaczyć godziny otwarcia salonu',
        'Why do some people say having treatments at Ever is more expensive?': 
        'Dlaczego niektórzy mówią, że zabiegi w naszym salonie są droższe?',
        'It is my first time at Ever, what information should I know?': 
        'To mój pierwszy raz w salonie, jakie informacje powinienem wiedzieć?',
        'How can I shorten my treatment time?': 'Jak mogę skrócić czas zabiegu?',
        'What determines how long the treatment time?': 'Co decyduje o długości czasu zabiegu?',
        
        # Footer
        'Company': 'Firma',
        'HOME': 'STRONA GŁÓWNA',
        'OUR STORY': 'NASZA HISTORIA',
        'JOURNAL': 'BLOG',
        'SERVICE': 'USŁUGI',
        'SERVICES': 'USŁUGI',
        'LOCATIONs': 'LOKALIZACJE',
        'LOCATION': 'LOKALIZACJA',
        'SCHEDULE AN APPOINTMENT': 'UMÓW WIZYTĘ',
        'ChAT WITH CONSULTANT': 'ROZMOWA Z KONSULTANTEM',
        'Follow Us': 'Śledź Nas',
        '© 2025 LIT GROUP INDONESIA. All rights reserved.': 
        '© 2025 Masaże racibórz. Wszelkie prawa zastrzeżone.',
        'Privacy Policy': 'Polityka Prywatności',
        'Terms of Service': 'Regulamin',
        'Cookies Settings': 'Ustawienia Ciasteczek',
        'Explore Every Detail of EVER': 'Poznaj Każdy Szczegół Masaży',
        
        # Inne
        'Treatment': 'Zabieg',
        'All Services Treatment Everlash, Everbrow, Evernails, Everspmu, Everbody, Everwax': 
        'Wszystkie Usługi Masażu',
    }
    
    # Zastosuj tłumaczenia
    for english, polish in translations.items():
        html = html.replace(english, polish)
    
    # 4. Usuń odniesienia do Ever w tekstach FAQ
    print("4. Aktualizowanie tekstów FAQ...")
    html = re.sub(r'\bat Ever\b', 'w naszym salonie', html, flags=re.IGNORECASE)
    html = re.sub(r'\bEver House\b', 'Salon', html, flags=re.IGNORECASE)
    html = re.sub(r'\bEver\b', 'Masaże racibórz', html, flags=re.IGNORECASE)
    
    # 5. Aktualizuj główny nagłówek
    print("5. Aktualizowanie głównego nagłówka...")
    html = re.sub(
        r'<h1[^>]*>Salon Masaży Racibórz</h1>',
        '<h1 gfluo-scale="1" data-gsap="txt.7" gfluo-duration="0.5" gfluo-delay="0" gfluo-ease="power1.out" gfluo-y="0" gfluo-rotation="0" class="heading-style-h2">Masaże racibórz</h1>',
        html
    )
    
    # 6. Aktualizuj alt teksty obrazów
    print("6. Aktualizowanie alt tekstów...")
    html = re.sub(r'alt="[^"]*EVER[^"]*"', 'alt="Masaże racibórz"', html, flags=re.IGNORECASE)
    
    # Zapisz zaktualizowany HTML
    print("\n=== ZAPISYWANIE ZAKTUALIZOWANEGO PLIKU ===")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n✓ Tłumaczenie zakończone!")
    print(f"✓ Plik zapisany: {html_path}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    try:
        translate_to_polish()
    except Exception as e:
        print(f"\n✗ Błąd: {e}")
        import traceback
        traceback.print_exc()

