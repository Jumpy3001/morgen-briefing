# Tagesauftrag für den Cloud-Agenten

Das hier ist die vollständige Arbeitsanweisung für den täglichen Lauf.
Der Cloud-Agent startet ohne Vorwissen und liest nur diese Datei.

**Leser:** Tim, Deutsch, Zeitzone Europe/Berlin. Die Seite ist seine
persönliche Morgenzeitung — niemand sonst liest sie.

## Ablauf

### 1. Recherchieren

Suche mit `WebSearch` aktuelle Nachrichten (letzte ~24 Stunden) zu vier Bereichen:

1. **KI & Tech**
2. **Wirtschaft**
3. **Politik**
4. **Ein wechselnder vierter Bereich** — nicht jeden Tag derselbe.
   Sinnvolle Kandidaten: Wissenschaft, Klima, Gesellschaft, Medizin,
   Energie, Kultur, Sport, Raumfahrt, Bildung.
   Schau in `ausgaben/` nach den letzten ~7 Ausgaben und nimm einen
   Bereich, der zuletzt nicht dran war.

Pro Bereich zwei bis drei Suchanfragen, damit du mehr als eine Quelle hast.
Wenn eine Meldung nur aus einer Zusammenfassung stammt und du sie nicht
verifizieren konntest: vorsichtig formulieren („laut Berichten", „einem
Bericht zufolge") statt sie als gesichert darzustellen. Lieber eine
Meldung weglassen als etwas erfinden. **Niemals Zahlen, Zitate oder Namen
erfinden.**

### 2. Artikel schreiben

Ein einziger zusammenhängender Artikel, **kein** Nachrichten-Feed, keine
Aufzählungen, keine Bullet Points.

- Sprache: Deutsch, erzählerisch, spannend, direkt. Kein Behördendeutsch,
  kein Marketing-Ton, keine Floskeln wie „in der heutigen schnelllebigen Welt".
- Länge: **1000–1300 Wörter** insgesamt.
- Aufbau: Lede-Absatz, der alle vier Themen anteasert und verbindet →
  vier nummerierte Abschnitte mit je 2–3 Absätzen → Schluss-Absatz, der
  den roten Faden ausspricht.
- Der **rote Faden** ist Pflicht: Finde den gemeinsamen Nenner der vier
  Themen des Tages und mach ihn im Lede und im Schluss explizit. Kein
  aufgesetzter Zwangs-Zusammenhang — wenn er dünn ist, benenne das ehrlich.
- Erklär kurz, was ein Fachbegriff bedeutet, wenn er vorkommt.
- Der Schluss endet mit einem Verweis auf morgen 7 Uhr.

### 3. Ausgabe speichern

Als JSON unter `ausgaben/JJJJ-MM-TT.json` (heutiges Datum, Europe/Berlin):

```json
{
  "datum": "2026-08-15",
  "titel": "Was heute zählt",
  "lede": "…",
  "abschnitte": [
    { "bereich": "KI & Tech", "ueberschrift": "…", "absaetze": ["…", "…"] },
    { "bereich": "Wirtschaft", "ueberschrift": "…", "absaetze": ["…"] },
    { "bereich": "Politik", "ueberschrift": "…", "absaetze": ["…"] },
    { "bereich": "Wissenschaft", "ueberschrift": "…", "absaetze": ["…"] }
  ],
  "schluss": "…"
}
```

`titel` bleibt „Was heute zählt" — das ist der feste Zeitungskopf.
Die Tages-Schlagzeile steckt in den `ueberschrift`-Feldern.

### 4. Seite bauen

```bash
node bauen.mjs ausgaben/JJJJ-MM-TT.json
```

Das schreibt `docs/index.html` (die aktuelle Ausgabe) und
`docs/archiv/JJJJ-MM-TT.html` (Archiv). **Nicht** von Hand HTML schreiben —
Layout und Stil-Rotation macht das Skript. Kurz prüfen, dass beide Dateien
neu geschrieben wurden und die Wortzahl im Zielbereich liegt.

### 5. Veröffentlichen

```bash
git add -A
git commit -m "Ausgabe vom JJJJ-MM-TT"
git push
```

GitHub Pages liefert danach innerhalb von ein bis zwei Minuten die neue Seite
unter der URL aus, die in `README.md` steht.

### 6. Push-Benachrichtigung schicken

```bash
curl -X POST https://ntfy.sh \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "tim-morgenbriefing-iw2k5mo",
    "title": "Was heute zählt",
    "message": "EIN_SATZ",
    "click": "SEITEN_URL",
    "tags": ["newspaper"]
  }'
```

`EIN_SATZ` ist ein neu formulierter Anreißer von 10–20 Wörtern — nicht
der erste Satz des Lede, sondern der interessanteste Punkt des Tages, so
geschrieben, dass man draufklicken will. `SEITEN_URL` steht in `README.md`.

Prüfe, dass `curl` HTTP 200 zurückgibt. Wenn nicht: noch einmal versuchen,
dann im Lauf-Protokoll klar vermerken, dass die Benachrichtigung
fehlgeschlagen ist.

## Wenn etwas schiefgeht

- Recherche liefert für einen Bereich nichts Brauchbares: nimm einen
  anderen Bereich, statt den Abschnitt zu streichen. Es sind immer vier.
- `git push` scheitert: trotzdem die Benachrichtigung schicken, aber mit
  dem Hinweis „(Seite konnte nicht aktualisiert werden)" im Text, damit
  Tim sofort sieht, dass etwas klemmt.
- Nicht mehr als nötig ändern. Keine Umbauten an `bauen.mjs` oder
  `stile.mjs` ohne Auftrag — die sind fertig.
