# Morgen-Briefing

Tims persönliche Tageszeitung. Jeden Morgen um 7 Uhr eine Push-Nachricht,
ein Klick, ein Artikel von ungefähr fünf Minuten Lesezeit — KI & Tech,
Wirtschaft, Politik und ein wechselnder vierter Bereich, als ein
zusammenhängender Text.

Läuft komplett in der Cloud. Der Mac kann aus sein.

## Wie es funktioniert

```
07:00 Europe/Berlin
   │
   ├─ Cloud-Routine startet (Anthropic-Cloud, unabhängig vom Mac)
   ├─ liest BRIEFING.md, recherchiert mit WebSearch
   ├─ schreibt ausgaben/JJJJ-MM-TT.json
   ├─ node bauen.mjs …           → docs/index.html + docs/archiv/…
   ├─ git push                   → GitHub Pages veröffentlicht die Seite
   └─ Push-Benachrichtigung mit Link aufs Handy
```

Kein Server, keine Datenbank, keine API-Keys, keine laufenden Kosten.
Drei Dateien Code, der Rest ist Text.

## Dateien

| Datei | Wofür |
|---|---|
| `BRIEFING.md` | Die Arbeitsanweisung, die der Cloud-Agent täglich befolgt |
| `bauen.mjs` | Macht aus einer Ausgabe (JSON) die fertige HTML-Seite |
| `stile.mjs` | Die Stil-Varianten und die Rotationslogik |
| `ausgaben/` | Jede Ausgabe als JSON — der Rohtext, unabhängig vom Layout |
| `docs/` | Was GitHub Pages ausliefert: `index.html` = heute, `archiv/` = alles davor |

Warum JSON und HTML getrennt: So kann sich das Layout ändern, ohne dass die
alten Texte verloren gehen — und alte Ausgaben lassen sich jederzeit im
neuen Stil neu bauen.

## Stil-Varianten

Sechs Varianten, gleiche Struktur, anderes Aussehen:

| | Name | Charakter |
|---|---|---|
| A | Sepia | Der abgesegnete Ausgangsentwurf: warmes Papier, Georgia, Kupfer-Akzent |
| B | Tinte | Kühler, Palatino, dunkelblau, Strich unter der Überschrift |
| C | Salbei | Grüner Akzent, Sans-Serif-Schlagzeile, mehr Luft |
| D | Klassik | Zentrierter Zeitungskopf, echte Zwischenüberschriften statt Kapitälchen |
| E | Abendrot | Terrakotta, Trennpunkte statt Linien, wärmster der sechs |
| F | Kobalt | Moderner, blaue Kicker-Plakette, nummerierte Chips |

Rotiert täglich (Tag im Jahr modulo 6). Unten auf jeder Seite steht, welcher
Stil gerade dran war.

**Festlegen:** In `stile.mjs` oben `FIXIERT = null` auf den Buchstaben
setzen, z. B. `FIXIERT = "C";`. Dann hört die Rotation auf.

**Alle Varianten nebeneinander ansehen:**

```bash
node bauen.mjs ausgaben/2026-08-15.json --galerie
```

Schreibt `docs/stilgalerie.html`.

## Lokal eine Ausgabe neu bauen

```bash
node bauen.mjs ausgaben/2026-08-15.json
```

## Zustellweg

*Noch nicht festgelegt — wird ergänzt, sobald Tim entschieden hat
(ntfy-App oder E-Mail).*

## Offene Punkte

- [ ] Zustellweg festlegen und hier eintragen
- [ ] GitHub-Repo anlegen, Pages aktivieren, URL hier eintragen
- [ ] Cloud-Routine für 07:00 Europe/Berlin anlegen
- [ ] Lieblings-Stil festlegen und in `stile.mjs` fixieren
- [ ] Ende Oktober: Cron von 05:00 UTC auf 06:00 UTC ändern (Winterzeit)
