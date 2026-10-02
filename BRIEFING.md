# Tagesauftrag für den Cloud-Agenten

Das hier ist die vollständige Arbeitsanweisung für den täglichen Lauf.
Der Cloud-Agent startet ohne Vorwissen und liest nur diese Datei.

**Leser:** Tim, Deutsch, Zeitzone Europe/Berlin — und später ein, zwei
weitere Leute. Die Seite ist eine kleine, persönliche Tageszeitung.

## Vor allem anderen

Lies **STILBUCH.md** vollständig. Es gilt für jede Zeile, die du schreibst —
Stimme, Sprache, Verbotsliste, Aufbau, Quellenregeln. Nach dem Entwurf
prüfst du ihn mit dem Prüfraster der Chefredaktion am Ende des Stilbuchs
und überarbeitest, bis jede Note mindestens 4 ist (höchstens zwei Durchgänge).

**Recherchetiefe:** Lies pro Ressort mindestens zwei Artikel im Volltext
mit `WebFetch`, nicht nur Suchergebnis-Vorschauen. Nimm dir Zeit —
gründlich schlägt schnell.

## Ablauf

### 0. Darf ich überhaupt loslegen?

Die Routine feuert zweimal pro Morgen (04:47 und 05:47 UTC), damit sie
im Sommer wie im Winter um 06:47 Berliner Zeit läuft. Genau einer der
beiden Läufe ist der richtige.

```bash
STUNDE=$(TZ=Europe/Berlin date +%H)
HEUTE=$(TZ=Europe/Berlin date +%F)
```

- `STUNDE` ist `05` oder `07` → **sofort beenden**, nichts tun. Das ist
  der überzählige Lauf.
- `ausgaben/$HEUTE.json` existiert schon → **sofort beenden**. Die
  heutige Ausgabe ist bereits erschienen.
- Sonst: weiter mit Schritt 1.

### 1. Recherchieren

Suche mit `WebSearch` aktuelle Nachrichten (letzte ~24 Stunden) zu vier Bereichen:

1. **KI & Tech**
2. **Wirtschaft**
3. **Politik**
4. **Ein wechselnder vierter Bereich** — nicht jeden Tag derselbe.
   Kandidaten: Wissenschaft, Klima, Gesellschaft, Medizin, Energie,
   Kultur, Sport, Raumfahrt, Bildung. Schau in `ausgaben/` nach den
   letzten ~7 Ausgaben und nimm einen Bereich, der zuletzt nicht dran war.

Pro Bereich zwei bis drei Suchanfragen, damit du mehr als eine Quelle hast.
Wenn eine Meldung nur aus einer Zusammenfassung stammt und du sie nicht
verifizieren konntest: vorsichtig formulieren („laut Berichten", „einem
Bericht zufolge"). Lieber eine Meldung weglassen als etwas erfinden.
**Niemals Zahlen, Zitate oder Namen erfinden.**

### 2. Artikel schreiben

Ein einziger zusammenhängender Artikel, **kein** Nachrichten-Feed, keine
Aufzählungen.

- Sprache: Deutsch, erzählerisch, spannend, direkt. Kein Behördendeutsch,
  kein Marketington, keine Floskeln.
- Länge: **1000–1300 Wörter** insgesamt.
- Aufbau: Standfirst-Absatz, der alle vier Themen anteasert und verbindet →
  vier Ressorts mit je 2–3 Absätzen → Schlusswort, das den roten Faden
  ausspricht.
- Der **rote Faden** ist Pflicht: Finde den gemeinsamen Nenner der vier
  Themen und mach ihn im Standfirst und im Schluss explizit. Kein
  Zwangs-Zusammenhang — wenn er dünn ist, benenne das ehrlich.
- Fachbegriffe in einem Halbsatz erklären.
- Der Schluss endet mit einem Verweis auf morgen früh.
- Nichts Technisches in den Text: keine Hinweise auf KI, Routinen,
  Versionen, Stile.

### 3. Ausgabe speichern

Als JSON unter `ausgaben/$HEUTE.json`:

```json
{
  "datum": "2026-10-03",
  "standfirst": "…",
  "abschnitte": [
    { "bereich": "KI & Tech", "ueberschrift": "…", "absaetze": ["…", "…"] },
    { "bereich": "Wirtschaft", "ueberschrift": "…", "absaetze": ["…"] },
    { "bereich": "Politik", "ueberschrift": "…", "absaetze": ["…"] },
    { "bereich": "Wissenschaft", "ueberschrift": "…", "absaetze": ["…"] }
  ],
  "schluss": "…",
  "anreisser": "…"
}
```

`anreisser` ist der Text der Push-Benachrichtigung: 10–20 Wörter, der
interessanteste Punkt des Tages, so geschrieben, dass man draufklicken
will. Nicht der erste Satz des Standfirst.

Die `ueberschrift` ist die Schlagzeile des Ressorts. Der Zeitungsname
kommt automatisch aus `stile.mjs`.

### 4. Seite bauen

```bash
node bauen.mjs ausgaben/$HEUTE.json
```

Schreibt `docs/index.html` und `docs/archiv/$HEUTE.html`. **Nicht** von
Hand HTML schreiben. Prüfen, dass beide Dateien neu sind und die Wortzahl
im Zielbereich liegt.

### 5. Veröffentlichen

```bash
git config user.name "Jumpy3001"
git config user.email "164887822+Jumpy3001@users.noreply.github.com"
git add -A
git commit -m "Ausgabe vom $HEUTE"
git push origin HEAD:main
```

Mehr nicht. Sobald die neue Ausgabe auf GitHub liegt, startet dort die
Action `.github/workflows/benachrichtigen.yml`: Sie wartet, bis die Seite
online ist, und schickt dann den Push mit dem `anreisser`.

**Nicht selbst versuchen, ntfy.sh oder github.io zu erreichen** — die
Sandbox sperrt beide Adressen, das ist Absicht und kein Fehler.

## Wenn etwas schiefgeht

- Recherche liefert für einen Bereich nichts Brauchbares: anderen Bereich
  nehmen. Es sind immer vier.
- `git push` scheitert: Tim mit dem Werkzeug `PushNotification`
  benachrichtigen — ein Satz, was nicht geklappt hat.
- Keine Umbauten an `bauen.mjs` oder `stile.mjs`.
