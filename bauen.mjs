// Baut aus einer Ausgabe (JSON) die fertige HTML-Seite.
//
//   node bauen.mjs ausgaben/2026-08-15.json
//       -> docs/index.html  (die heutige Ausgabe)
//       -> docs/archiv/2026-08-15.html
//
//   node bauen.mjs ausgaben/2026-08-15.json --galerie
//       -> docs/stilgalerie.html  (derselbe Text in allen Stil-Varianten,
//          nur als Entscheidungshilfe, nicht Teil des täglichen Laufs)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VARIANTEN, varianteFuer, css, FIXIERT } from "./stile.mjs";

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

function lesezeit(ausgabe) {
  const woerter = [ausgabe.lede, ausgabe.schluss,
    ...ausgabe.abschnitte.flatMap((a) => a.absaetze)]
    .join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woerter / 200));
}

export function seite(ausgabe, variante) {
  const v = variante || varianteFuer(new Date(ausgabe.datum + "T12:00:00Z"));
  const bereiche = ausgabe.abschnitte.map((a) => esc(a.bereich)).join(" · ");

  const abschnitte = ausgabe.abschnitte.map((a, i) => `
    <div class="section">
      <h2><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(a.bereich)} — ${esc(a.ueberschrift)}</h2>
      ${a.absaetze.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
    </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ausgabe.titel || "Was heute zählt")} — ${datumLang(ausgabe.datum)}</title>
<style>${css(v)}</style>
</head>
<body>
  <div class="page">
    <div class="kicker">Morgen-Briefing</div>
    <h1>${esc(ausgabe.titel || "Was heute zählt")}</h1>
    <div class="meta-row">
      <span>${datumLang(ausgabe.datum)}</span>
      <span class="dot"></span>
      <span>≈ ${lesezeit(ausgabe)} Min. Lesezeit</span>
      <span class="dot"></span>
      <span>${bereiche}</span>
    </div>
    <p class="lede">${esc(ausgabe.lede)}</p>
${abschnitte}
    <p class="closing">${esc(ausgabe.schluss)}</p>
    <div class="impressum">
      <span>Stil ${v.id} · ${v.name}${FIXIERT ? " (fixiert)" : ""}</span>
      <span class="dot"></span>
      <span>Tims persönlicher Verlag</span>
    </div>
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
  .kopf { max-width:1200px; margin:0 auto; padding:32px 20px 8px; }
  h1 { font-size:22px; margin:0 0 6px; }
  p.hinweis { color:#6d6a62; font-size:14px; margin:0 0 24px; max-width:60ch; line-height:1.6; }
  .raster { max-width:1200px; margin:0 auto; padding:0 20px 60px;
            display:grid; gap:24px; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); }
  figure { margin:0; background:#fff; border-radius:10px; overflow:hidden;
           box-shadow:0 1px 3px rgba(0,0,0,.10); }
  figcaption { font-size:13px; font-weight:600; padding:12px 14px; border-bottom:1px solid #eceae4; }
  iframe { width:100%; height:640px; border:0; display:block; }
</style></head>
<body>
  <div class="kopf">
    <h1>Stil-Galerie</h1>
    <p class="hinweis">Derselbe Artikel in allen Varianten. Sag mir den Buchstaben,
    der dir am besten gefällt — dann wird er fixiert und die Rotation hört auf.</p>
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
