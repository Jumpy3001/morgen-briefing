// Stil-Varianten für das Morgen-Briefing.
//
// Alle Varianten teilen dasselbe Zeitungs-Gerüst: Zeitungskopf mit Titel und
// Doppellinie, Datumszeile, Standfirst mit Initial, nummerierte Ressorts mit
// Ober- und Unterzeile, Schlusswort. Was sich unterscheidet, ist die Anmutung:
// Papierton, Schriftpaarung, Linienstärke, Akzentfarbe.
//
// Tim hat A, B und D ausgewählt (16.08.2026). C, E und F sind raus.
//
// Endgültig festlegen: FIXIERT auf einen Buchstaben setzen, z.B. "B".
// Dann hört die Rotation auf.

export const FIXIERT = null;

const GEORGIA = 'Georgia, "Times New Roman", serif';
const PALATINO = 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif';
const TIMES = '"Times New Roman", Times, serif';
const DIDOT = 'Didot, "Bodoni 72", "Playfair Display", Georgia, serif';
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const VARIANTEN = [
  {
    id: "A",
    name: "Sepia",
    t: {
      papier: "#f6f4ef", tinte: "#2a2822", grau: "#8b887e", weich: "#4a4740",
      akzent: "#a3714a", linie: "#d8d3c6", linieStark: "#2a2822",
      titelSchrift: GEORGIA, textSchrift: GEORGIA, uiSchrift: SANS,
      titelGroesse: "52px", titelGewicht: "700", titelSperrung: "-0.02em",
      breite: "660px", text: "17.5px", zeile: "1.72",
    },
  },
  {
    id: "B",
    name: "Tinte",
    t: {
      papier: "#f3f3f0", tinte: "#1f2530", grau: "#767e8c", weich: "#3d4552",
      akzent: "#3a5a78", linie: "#d5d9de", linieStark: "#1f2530",
      titelSchrift: PALATINO, textSchrift: PALATINO, uiSchrift: SANS,
      titelGroesse: "50px", titelGewicht: "700", titelSperrung: "-0.015em",
      breite: "640px", text: "17.5px", zeile: "1.75",
    },
  },
  {
    id: "D",
    name: "Klassik",
    t: {
      papier: "#fbfaf7", tinte: "#16150f", grau: "#8a877c", weich: "#3c3a33",
      akzent: "#16150f", linie: "#d3cec1", linieStark: "#16150f",
      titelSchrift: DIDOT, textSchrift: TIMES, uiSchrift: SANS,
      titelGroesse: "58px", titelGewicht: "400", titelSperrung: "0.01em",
      breite: "620px", text: "18px", zeile: "1.68",
    },
  },
];

// Welche Variante ist heute dran? Rotiert über den Tag im Jahr,
// solange nichts fixiert ist.
export function varianteFuer(datum) {
  if (FIXIERT) {
    const f = VARIANTEN.find((v) => v.id === FIXIERT);
    if (f) return f;
  }
  const jahresstart = Date.UTC(datum.getUTCFullYear(), 0, 0);
  const tag = Math.floor((datum.getTime() - jahresstart) / 86400000);
  return VARIANTEN[tag % VARIANTEN.length];
}

export function css(v) {
  const t = v.t;
  return `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${t.papier};
    color: ${t.tinte};
    font-family: ${t.textSchrift};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  .blatt { max-width: ${t.breite}; margin: 0 auto; padding: 40px 24px 64px; }

  /* ---- Zeitungskopf ---- */
  .kopf { text-align: center; }
  .kopf-oben {
    font-family: ${t.uiSchrift}; font-size: 10.5px; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${t.grau};
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid ${t.linie}; padding-bottom: 8px; margin-bottom: 20px;
  }
  .titel {
    font-family: ${t.titelSchrift}; font-size: ${t.titelGroesse};
    font-weight: ${t.titelGewicht}; letter-spacing: ${t.titelSperrung};
    line-height: 1.02; margin: 0; color: ${t.tinte};
  }
  .datumszeile {
    font-family: ${t.uiSchrift}; font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${t.grau};
    margin-top: 18px; padding: 7px 0;
    border-top: 3px solid ${t.linieStark};
    border-bottom: 1px solid ${t.linieStark};
  }
  .datumszeile span { white-space: nowrap; }
  .datumszeile .trenner { color: ${t.akzent}; }
  body { overflow-wrap: break-word; }

  /* ---- Standfirst ---- */
  .standfirst {
    font-size: 19px; line-height: 1.6; color: ${t.weich};
    margin: 32px 0 6px; text-align: justify; hyphens: auto;
  }
  .standfirst::first-letter {
    float: left; font-family: ${t.titelSchrift}; font-size: 62px;
    line-height: 0.82; padding: 6px 10px 0 0; color: ${t.akzent};
    font-weight: ${t.titelGewicht};
  }

  /* ---- Ressorts ---- */
  .ressort { margin-top: 40px; }
  .ressort-zeile {
    display: flex; align-items: center; gap: 12px;
    border-top: 1px solid ${t.linieStark}; padding-top: 10px; margin-bottom: 4px;
  }
  .ressort-nr {
    font-family: ${t.uiSchrift}; font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; color: ${t.papier}; background: ${t.akzent};
    padding: 3px 7px; border-radius: 2px; flex: none;
  }
  .ressort-name {
    font-family: ${t.uiSchrift}; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: ${t.akzent};
  }
  .ressort-linie { flex: 1; height: 1px; background: ${t.linie}; }
  h2 {
    font-family: ${t.titelSchrift}; font-size: 25px; line-height: 1.25;
    font-weight: 700; margin: 10px 0 16px; letter-spacing: -0.01em;
  }
  p {
    font-size: ${t.text}; line-height: ${t.zeile}; margin: 0 0 16px;
    text-align: justify; hyphens: auto;
  }

  /* ---- Schluss ---- */
  .schluss {
    margin-top: 44px; padding-top: 22px;
    border-top: 3px double ${t.linieStark};
    font-style: italic; color: ${t.weich}; font-size: 17px; line-height: 1.7;
    text-align: justify; hyphens: auto;
  }
  .signet {
    text-align: center; margin-top: 40px; padding-top: 18px;
    border-top: 1px solid ${t.linie};
    font-family: ${t.uiSchrift}; font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: ${t.grau};
  }

  @media (max-width: 680px) {
    .blatt { padding: 28px 18px 48px; }
    .titel { font-size: calc(${t.titelGroesse} * 0.62); }
    .standfirst { font-size: 17.5px; }
    .standfirst::first-letter { font-size: 50px; }
    h2 { font-size: 21px; }
    p { font-size: 17px; }
    .datumszeile { font-size: 9px; letter-spacing: 0.1em; }
    .kopf-oben { font-size: 9px; }
  }
`;
}
