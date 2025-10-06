# Supla - jaka taryfa?

Na podstawie danych z `supla cloud` gdzie jest podpięty główny licznik prądu `zamel` zainstalowany w domu, wylicza najbardziej optymalną taryfę `PGE` dla tych danych. Wyliczenie jest przybliżone.

## Jak używać?

Do uruchomienia tego narzędzia potrzebujesz `dane z supla cloud` oraz zainstalowany `git` i `node`.

1. Zaloguj się do [supla](https://cloud.supla.org/login)
2. Wybierz swój licznik, przejdź do `Historia pomiarów` i kliknij na `Pobierz historię pomiarów`
    * Zakres dat: `Wszystko`
    * Format pliku: `csv`
    * Separator: `Przecinek`
    * Przekształcenie wartości: `Licznik (wartości tak jak na liczniku)`
3. Zinicjalizuj ten repo: `npm i`
4. Skopiuj ściągniety plik do tego repo i w `index.mjs` zmień `path`, `overrideStart`, `overrideEnd`
5. Zauktualizuj dni wolne od pracy w `lib/isFreeDay.mjs` oraz ceny w `tarrif/*.mjs`
6. Sprawdź najbardziej optymalną taryfę: `node index.mjs`

**Zuważ, że**:
* najlepiej sprawdzić dane za 365 dni, gdyż zużycie prądu różni się w zależności od miesiąca w roku, ale powinno być podobne rok do roku przy tym samym zakresie używania domu i pogody
* cena prądu jest taka sama przez cały rok dla danej taryfy
* używany jest `Forward active Energy kWh - Vector balance`, ale dane z cloud supla są pobierane mniej więcej w 10 minutowych odstępach - bardziej dokładnie byłoby użyć 1 godzinnych odstępów ponieważ energia jest rozliczana przez dystrybutorów wektorowo cogodzinnie. Ten punkt ma tylko znaczenie gdy w domu zainstalowana jest fotowoltaika lub inne źródło energi, która jest oddawana do sieci

## Test plan

Sprawdzone na liczniku `Zamel MEW-01` z danymi od października 2024 roku do września 2025 roku (`365 dni`).

## Dev

Open to PR requests. Na przykład dodanie taryf dla innych dystrybutorów energii.

## License

[Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/deed.en)