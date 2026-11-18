# TJ Jednota Brestovec – návrh webu

Návrh nového webu futbalového klubu TJ Jednota Brestovec. **Nie je to oficiálna stránka klubu.** Ukážka má v hlavičke pás s týmto upozornením a vyhľadávače ju neindexujú (`noindex`).

Ukážka: https://matuslenicky.github.io/tj-jednota-brestovec/ · administrácia (ukážka bez ukladania): https://matuslenicky.github.io/tj-jednota-brestovec/admin/

## Vzhľad

**„Rozpis“ (dizajn v2, 18. 11. 2026).** Papierová biela, modrá a žltá z erbu a obce. Písmo Barlow Condensed (titulky, čísla) a EB Garamond (text).

- hlavným obsahom úvodu je celý rozpis kôl áčka ako sadzaná tabuľka zo športovej strany novín: kolo, dátum, zápas domáci – hostia a výsledok alebo čas, rozdelený na jeseň a jar; najbližší zápas je zvýraznený žltou,
- vedľa (na telefóne nad ním) najbližší zápas a miesto v tabuľke, pod ním celá tabuľka VI. ligy Západ,
- ročníky áčka od 2014/15, ihrisko Pod Solniskom a obec sú na stránke Klub,
- menu na telefóne je svetlá plocha cez celú obrazovku.

Web sa skladá zo spoločného jadra v2 (`kluby-siet/engine`: `python assemble.py <web>`), vlastný je `src/site.js` (úvod, Klub, nastavenia) a `src/css/skin.css`.

## Obsah a zdroje

- Zápasy, výsledky, strelci, karty, počty divákov, zostavy dospelých, tabuľky a súpisky 2 tímov (áčko, U9) zo Sportnetu (Futbalnet), verejné API súťaží (`scripts/sportnet.mjs` → `data/sportnet.json`). Čísla kôl sú podľa Sportnetu. Vek hráčov sa neukladá, zostavy len pri dospelých.
- Ročníky áčka 2014/15 – 2025/26 z konečných tabuliek na Sportnete, tituly vo VII. lige 2015/16 a 2023/24 (`data/klub.json`). Rok 1951 je z erbu klubu.
- Ihrisko (šatne, tribúna, osadový turnaj) a obec (1955, Štefánikov tunel, erb) podľa webu obce Brestovec.
- E-mail zo Sportnetu. Vlastný web ani sociálne siete klubu sme nenašli (18. 11. 2026).
- Erb klubu a erby súperov zo Sportnetu (`scripts/logos.py`). Patria príslušným klubom. Náš erb je orezaný na kruhový znak bez tmavého pozadia.
- Písmo Barlow Condensed a EB Garamond, licencia SIL Open Font License 1.1 (`scripts/fonts.py`, rovné číslice sú zapečené do písma).

## Zostavenie

Statický generátor bez závislostí (Node 20+, Python 3 s Pillow na erby a fontTools na písmo):

```
python C:\Users\lenic\kluby-siet\engine\assemble.py .   # zloží build.js a site.css zo spoločného jadra
node scripts/sportnet.mjs        # zápasy, tabuľky a súpisky (FULL=1 stiahne znova aj detaily zápasov)
python -I scripts/logos.py       # erby súperov do src/img (náš orezaný erb neprepíše, kým nie je FORCE=1)
node build.js                    # data/ + src/ -> dist/ (TODAY=2026-11-18 prepíše dnešný dátum)
node scripts/serve.mjs dist 5458 # náhľad na http://127.0.0.1:5458/ (?nolr = bez obnovovania, s CSP)
node scripts/deploy.mjs          # nasadenie dist/ na vetvu gh-pages (GitHub Pages)
```

Výsledky sa po zápasoch aktualizujú samé cez GitHub Actions (`.github/workflows/sportnet.yml`). Ročníky v `data/klub.json` treba po sezóne doplniť ručne.
