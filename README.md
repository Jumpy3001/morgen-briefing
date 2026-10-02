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

Drei Varianten, gleiches Zeitungs-Gerüst, andere Anmutung:

| | Name | Charakter |
|---|---|---|
| A | Sepia | Warmes Papier, Georgia, Kupfer-Akzent |
| B | Tinte | Kühler, Palatino, dunkelblau |
| D | Klassik | Didot-Zeitungskopf, Times, Schwarz auf Fast-Weiß |

Rotiert täglich. Welcher Stil dran war, steht als Kommentar im Quelltext —
nie sichtbar auf der Seite.

**Festlegen:** In `stile.mjs` oben `FIXIERT = null` auf den Buchstaben
setzen, z. B. `FIXIERT = "B";`. Dann hört die Rotation auf.

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

Push über **ntfy.sh** (App „ntfy", kostenlos, kein Login). Das Topic steht
bewusst **nicht** in diesem öffentlichen Repo, sondern nur im Auftrag der
Cloud-Routine — wer das Topic kennt, kann Nachrichten dorthin schicken.

## Adresse

Aktuelle Ausgabe: https://jumpy3001.github.io/morgen-briefing/
Archiv: `https://jumpy3001.github.io/morgen-briefing/archiv/JJJJ-MM-TT.html`

## Zeitplan

Die Routine feuert um 04:47 und 05:47 UTC. Der Tagesauftrag lässt nur den
Lauf weiterlaufen, der um 06:47 Berliner Zeit stattfindet — Sommer- und
Winterzeit erledigen sich dadurch von selbst.

## Offene Punkte

- [x] Zeitungsname: Moment/07 (`ZEITUNG` + `KUERZEL` in `stile.mjs`)
- [ ] Lieblings-Stil fixieren (`FIXIERT` in `stile.mjs`)
- [ ] Zweiter Leser: eigenes Topic oder E-Mail-Versand
