# Segregatornia – wersja deweloperska

Edukacyjna gra planszowa o segregacji odpadów, tworzywach sztucznych i gospodarce o obiegu zamkniętym (PL/EN, motyw jasny/ciemny).
Czysty HTML + CSS + JavaScript – **bez frameworków, bez kompilacji, bez zależności**.

## Uruchomienie

- Najprościej: otwórz `index.html` w przeglądarce (działa też z dysku, `file://`).
- Albo przez lokalny serwer, np.:
  ```bash
  npx serve .          # lub
  python3 -m http.server 8000
  ```

Jedynym zasobem zewnętrznym są czcionki z Google Fonts (bez internetu gra działa z czcionkami zapasowymi).

## Struktura

```
segregatornia/
├── index.html                 # szkielet strony, ładuje CSS i JS we właściwej kolejności
├── css/
│   ├── 00-reset.css           # reset, bezpieczne marginesy (notch)
│   ├── 01-variables.css       # ZMIENNE: kolory, czcionki, motyw jasny/ciemny, kolory pojemników
│   ├── 02-base.css            # typografia, pasek górny, przyciski
│   ├── 03-setup.css           # ekran startowy
│   ├── 04-board.css           # plansza, pola, kostka, pionki
│   ├── 05-panel.css           # karta odpadu, pytania, pojemniki
│   ├── 06-control.css         # Kontrola sortowni
│   ├── 07-end.css             # ekran końcowy, tabele
│   ├── 08-modal.css           # okna modalne, toast
│   ├── 09-toggles-footer.css  # przełączniki PL/EN i motywu, stopka
│   └── 10-responsive.css      # media queries, reduced-motion
└── js/
    ├── config/settings.js     # język i motyw (localStorage)
    ├── data/                  # ← TREŚCI EDUKACYJNE (najczęściej edytowane)
    │   ├── bins.js            # pojemniki, kody tworzyw 1–7, metale ciężkie
    │   ├── cards.pl.js        # karty odpadów (PL) – źródło prawdy
    │   ├── cards.en.js        # tłumaczenia kart (EN)
    │   ├── questions.js       # pula pytań ogólnych PL/EN
    │   └── second-life.js     # karty „Drugie życie” PL/EN
    ├── i18n/ui-texts.js       # wszystkie teksty interfejsu PL/EN + funkcja tr()
    ├── core/
    │   ├── data-access.js     # dane w bieżącym języku, układ planszy (FIELDS), punktacja (PTS)
    │   └── utils.js           # narzędzia, globalny stan gry (S), zapis/odczyt
    ├── game/
    │   ├── logic.js           # przebieg tury, ruch, kontrola, koniec gry
    │   └── quiz.js            # definicje pytań w turze
    ├── ui/
    │   ├── toggles.js         # przełączniki + pasek górny
    │   ├── setup-screen.js    # ekran startowy
    │   ├── game-screen.js     # ekran gry
    │   ├── end-screen.js      # ekran końcowy
    │   └── modals.js          # zasady, potwierdzenie wyjścia
    └── main.js                # start aplikacji (ładowany jako ostatni)
```

## Ważne zasady

1. **Kolejność skryptów w `index.html` ma znaczenie.** Pliki to zwykłe `<script>` (nie moduły ES), więc współdzielą zakres globalny – dane muszą być załadowane przed logiką, a `main.js` na końcu.
2. **Karty PL i EN są dopasowane po indeksie.** Dodając, usuwając lub przestawiając kartę w `cards.pl.js`, zrób to samo w tym samym miejscu w `cards.en.js`. To samo dotyczy `POOL`/`POOL_EN` i `LIFE`/`LIFE_EN`.
3. **Pierwsza opcja odpowiedzi jest zawsze poprawna** – gra sama tasuje kolejność przy wyświetlaniu.
4. Pojemnik, kod tworzywa, metal i poziom pytania są zapisane tylko w wersji PL; wersja EN zawiera wyłącznie teksty.

## Jak…

**…dodać kartę odpadu** – dopisz wiersz na końcu `CARDS` w `js/data/cards.pl.js`:
```js
['🧃','Nazwa','Opis.','M',5,'Dlaczego do tego pojemnika.',['Pytanie?',['poprawna','zła','zła'],'Wyjaśnienie.',1]],
// opcjonalnie 8. element: {metal:'Hg'|'Pb'|'Cd', mat:'Notatka o materiale'}
```
Pojemniki: `P` papier, `S` szkło, `M` metale i tworzywa, `B` bio, `Z` zmieszane, `E` elektroodpady, `A` baterie, `L` leki, `N` niebezpieczne. Kod tworzywa `1–7` lub `null`. Poziom pytania: `1` (łatwe, także dla młodszych) lub `2`.
Potem dopisz odpowiadający wiersz na końcu `CARDS_EN` w `cards.en.js`:
```js
["Name","Description.","Why.",["Question?",["correct","wrong","wrong"],"Explanation."],"Optional material note"],
```

**…dodać pytanie ogólne** – dopisz do `POOL` (z poziomem) i do `POOL_EN` (bez poziomu) w `js/data/questions.js`.

**…zmienić punktację** – obiekt `PTS` w `js/core/data-access.js` (teksty zasad aktualizują się same).

**…zmienić układ planszy** – tablica `FIELDS` (28 pól w pętli) w `js/core/data-access.js`. Typy: `start`, `w` (zwykłe), `life`, `q`, `control`, `haz`, `jam` (−3), `express` (+2).

**…zmienić kolory / motyw** – `css/01-variables.css` (osobne bloki dla trybu jasnego i ciemnego).

**…zmienić tekst w interfejsie** – `js/i18n/ui-texts.js` (sekcje `pl` i `en`, te same klucze).

## Zapis w przeglądarce

Gra zapisuje w `localStorage`: trwającą rozgrywkę (`segregatornia-v2`), język (`segregatornia-lang`) i motyw (`segregatornia-theme`). Zmieniając strukturę stanu gry, podbij wersję klucza `SAVE_KEY` w `data-access.js`, żeby stare zapisy nie psuły nowej wersji.

---
© 2026 CappySoft.pl
