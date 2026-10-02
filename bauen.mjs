// Baut aus einer Ausgabe (JSON) die fertige Zeitungsseite.
//
//   node bauen.mjs ausgaben/2026-08-15.json
//       -> docs/index.html  (die aktuelle Ausgabe)
//       -> docs/archiv/2026-08-15.html
//
//   node bauen.mjs ausgaben/2026-08-15.json --galerie
//       -> docs/stilgalerie.html  (derselbe Text in allen Varianten,
//          nur als Entscheidungshilfe, nicht Teil des täglichen Laufs)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VARIANTEN, varianteFuer, css, FIXIERT, ZEITUNG, KUERZEL } from "./stile.mjs";

const WURZEL = dirname(fileURLToPath(import.meta.url));

const WOCHENTAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
  "August", "September", "Oktober", "November", "Dezember"];

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function datumLang(iso) {
  const d = new Date(iso + "T12:00:00Z");
  return `${WOCHENTAGE[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONATE[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Fortlaufende Ausgabennummer: die wievielte Ausgabe ist das?
function ausgabenNummer(datum) {
  try {
    const alle = readdirSync(join(WURZEL, "ausgaben"))
      .filter((f) => f.endsWith(".json")).sort();
    const i = alle.indexOf(`${datum}.json`);
    return i >= 0 ? i + 1 : alle.length + 1;
  } catch {
    return 1;
  }
}

function lesezeit(ausgabe) {
  const woerter = [ausgabe.standfirst ?? ausgabe.lede, ausgabe.schluss,
    ...ausgabe.abschnitte.flatMap((a) => a.absaetze)]
    .join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woerter / 200));
}

export function seite(ausgabe, variante) {
  const v = variante || varianteFuer(new Date(ausgabe.datum + "T12:00:00Z"));
  const nr = ausgabenNummer(ausgabe.datum);
  const standfirst = ausgabe.standfirst ?? ausgabe.lede;

  const datumszeile = [
    datumLang(ausgabe.datum),
    ...ausgabe.abschnitte.map((a) => a.bereich),
  ].map((s) => `<span>${esc(s)}</span>`)
    // Die Leerzeichen sind Absicht: ohne sie findet der Umbruch auf dem
    // Handy keine Stelle und die Zeile läuft rechts aus dem Bild.
    .join(' <span class="trenner">✦</span> ');

  const ressorts = ausgabe.abschnitte.map((a, i) => `
    <div class="ressort">
      <div class="ressort-zeile">
        <span class="ressort-nr">${String(i + 1).padStart(2, "0")}</span>
        <span class="ressort-name">${esc(a.bereich)}</span>
        <span class="ressort-linie"></span>
      </div>
      <h2>${esc(a.ueberschrift)}</h2>
      ${a.absaetze.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
    </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ZEITUNG + KUERZEL)} — ${datumLang(ausgabe.datum)}</title>
<meta name="robots" content="noindex">
<!-- Stil ${v.id} (${v.name})${FIXIERT ? ", fixiert" : ", Rotation aktiv"} · Ausgabe Nr. ${nr} -->
<style>${css(v)}</style>
</head>
<body>
  <div class="blatt">
    <header class="kopf">
      <div class="kopf-oben">
        <span>Ausgabe Nr.&nbsp;${nr}</span>
        <span>Morgen-Briefing</span>
        <span>${lesezeit(ausgabe)}&nbsp;Min.</span>
      </div>
      <h1 class="titel">${esc(ZEITUNG)}<span class="kuerzel">${esc(KUERZEL)}</span></h1>
      <div class="datumszeile">${datumszeile}</div>
    </header>

    <p class="standfirst">${esc(standfirst)}</p>
${ressorts}
    <p class="schluss">${esc(ausgabe.schluss)}</p>
    <div class="signet">Ende der Ausgabe</div>
  </div>
</body>
</html>
`;
}

function galerie(ausgabe) {
  const karten = VARIANTEN.map((v) => `
    <figure>
      <figcaption>Stil ${v.id} — ${v.name}</figcaption>
      <iframe srcdoc="${seite(ausgabe, v).replace(/"/g, "&quot;")}" loading="lazy"></iframe>
    </figure>`).join("\n");

  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stil-Galerie — Morgen-Briefing</title>
<style>
  body { margin:0; background:#e9e7e1; font-family:-apple-system,"Segoe UI",sans-serif; color:#2a2822; }
  .kopf { max-width:1400px; margin:0 auto; padding:32px 20px 8px; }
  h1 { font-size:22px; margin:0 0 6px; }
  p.hinweis { color:#6d6a62; font-size:14px; margin:0 0 24px; max-width:60ch; line-height:1.6; }
  .raster { max-width:1400px; margin:0 auto; padding:0 20px 60px;
            display:grid; gap:24px; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); }
  figure { margin:0; background:#fff; border-radius:10px; overflow:hidden;
           box-shadow:0 1px 3px rgba(0,0,0,.10); }
  figcaption { font-size:13px; font-weight:600; padding:12px 14px; border-bottom:1px solid #eceae4; }
  iframe { width:100%; height:900px; border:0; display:block; }
</style></head>
<body>
  <div class="kopf">
    <h1>Stil-Galerie</h1>
    <p class="hinweis">Derselbe Artikel in allen Varianten. Sag mir den Buchstaben,
    der es werden soll — dann wird er fixiert und die Rotation hört auf.</p>
  </div>
  <div class="raster">${karten}</div>
</body></html>
`;
}

const [, , datei, flag] = process.argv;
if (datei) {
  const ausgabe = JSON.parse(readFileSync(datei, "utf8"));
  if (flag === "--galerie") {
    writeFileSync(join(WURZEL, "docs/stilgalerie.html"), galerie(ausgabe));
    console.log("docs/stilgalerie.html geschrieben");
  } else {
    const html = seite(ausgabe);
    mkdirSync(join(WURZEL, "docs/archiv"), { recursive: true });
    writeFileSync(join(WURZEL, "docs/index.html"), html);
    writeFileSync(join(WURZEL, `docs/archiv/${ausgabe.datum}.html`), html);
    console.log(`docs/index.html + docs/archiv/${ausgabe.datum}.html geschrieben`);
  }
}
