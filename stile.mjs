// Stil-Varianten für das Morgen-Briefing.
//
// Struktur der Seite bleibt IMMER gleich (Kicker, H1, Meta-Zeile, Lede,
// 4 nummerierte Abschnitte, Schluss-Absatz). Es ändern sich nur Farben,
// Schriften und ein paar Details.
//
// Wenn Tim eine Variante endgültig festlegt: unten FIXIERT auf den
// Buchstaben setzen, z.B. FIXIERT = "C". Dann hört die Rotation auf.

export const FIXIERT = null;

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const PALATINO = 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif';
const IOWAN = 'Iowan Old Style, "Hoefler Text", Charter, Georgia, serif';

export const VARIANTEN = [
  {
    id: "A",
    name: "Sepia",
    t: {
      bg: "#f6f4ef", fg: "#2a2822", gedaempft: "#8b887e", weich: "#4a4740",
      akzent: "#a3714a", ziffer: "#c8b9a8", linie: "#e6e2d8",
      schriftText: SERIF, schriftUi: SANS,
      breite: "640px", h1: "34px", h1Gewicht: "600", lede: "19px", text: "18px",
      zeile: "1.75",
    },
  },
  {
    id: "B",
    name: "Tinte",
    t: {
      bg: "#f4f4f1", fg: "#1f2530", gedaempft: "#7d8592", weich: "#3d4552",
      akzent: "#3a5a78", ziffer: "#aebccb", linie: "#dfe2e4",
      schriftText: PALATINO, schriftUi: SANS,
      breite: "620px", h1: "36px", h1Gewicht: "700", lede: "19.5px", text: "18px",
      zeile: "1.78",
    },
    extra: `
      h1 { border-bottom: 2px solid #1f2530; padding-bottom: 18px; }
      .kicker { border-left: 3px solid #3a5a78; padding-left: 10px; }
    `,
  },
  {
    id: "C",
    name: "Salbei",
    t: {
      bg: "#f3f5f0", fg: "#252b24", gedaempft: "#82897d", weich: "#454b43",
      akzent: "#5f7a55", ziffer: "#b6c4ad", linie: "#e0e5da",
      schriftText: SERIF, schriftUi: SANS,
      breite: "660px", h1: "33px", h1Gewicht: "600", lede: "19px", text: "18px",
      zeile: "1.8",
    },
    extra: `
      h1 { font-family: ${SANS}; letter-spacing: -0.02em; font-weight: 700; }
      h2 .n { display: inline-block; min-width: 26px; }
      .section { border-top: none; }
      .section + .section h2 { border-top: 1px solid #e0e5da; padding-top: 34px; }
    `,
  },
  {
    id: "D",
    name: "Klassik",
    t: {
      bg: "#fbfaf7", fg: "#16150f", gedaempft: "#8a877c", weich: "#3c3a33",
      akzent: "#16150f", ziffer: "#c4bfae", linie: "#dcd8cb",
      schriftText: '"Times New Roman", Times, serif', schriftUi: SANS,
      breite: "600px", h1: "40px", h1Gewicht: "700", lede: "20px", text: "18.5px",
      zeile: "1.72",
    },
    extra: `
      .kicker { text-align: center; letter-spacing: 0.22em; }
      h1 { text-align: center; }
      .meta-row { justify-content: center; flex-wrap: wrap; }
      h2 { font-family: ${IOWAN}; text-transform: none; font-size: 21px;
           letter-spacing: 0; font-weight: 700; }
      h2 .n { font-family: ${SANS}; font-size: 12px; vertical-align: 2px; }
      .lede { text-align: justify; }
    `,
  },
  {
    id: "E",
    name: "Abendrot",
    t: {
      bg: "#faf3ec", fg: "#2e2620", gedaempft: "#94867a", weich: "#4f453c",
      akzent: "#b0553f", ziffer: "#e0b7a5", linie: "#ece0d4",
      schriftText: IOWAN, schriftUi: SANS,
      breite: "640px", h1: "35px", h1Gewicht: "600", lede: "20px", text: "18px",
      zeile: "1.8",
    },
    extra: `
      .section { border-top: none; }
      .section + .section::before {
        content: "· · ·"; display: block; text-align: center;
        color: #e0b7a5; letter-spacing: 0.4em; margin: 40px 0 10px;
      }
      .lede { border-left: 3px solid #b0553f; padding-left: 18px; }
    `,
  },
  {
    id: "F",
    name: "Kobalt",
    t: {
      bg: "#f5f6f8", fg: "#1c1f26", gedaempft: "#7c828e", weich: "#3f4551",
      akzent: "#2f5fd0", ziffer: "#b5c4e6", linie: "#e2e5eb",
      schriftText: SERIF, schriftUi: SANS,
      breite: "660px", h1: "32px", h1Gewicht: "700", lede: "19px", text: "17.5px",
      zeile: "1.8",
    },
    extra: `
      h1 { font-family: ${SANS}; letter-spacing: -0.025em; }
      .kicker { background: #2f5fd0; color: #fff; display: inline-block;
                padding: 5px 10px; border-radius: 4px; letter-spacing: 0.1em; }
      h2 { font-size: 12.5px; }
      h2 .n { background: #e6ecf9; color: #2f5fd0; border-radius: 3px;
              padding: 3px 6px; font-size: 11px; }
      .section { border-top: 1px solid #e2e5eb; }
    `,
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
    background: ${t.bg};
    color: ${t.fg};
    font-family: ${t.schriftText};
    -webkit-font-smoothing: antialiased;
  }
  .page { max-width: ${t.breite}; margin: 0 auto; padding: 56px 24px 60px; }
  .kicker {
    font-family: ${t.schriftUi}; font-size: 12.5px; letter-spacing: 0.08em;
    text-transform: uppercase; color: ${t.akzent}; font-weight: 600;
    margin-bottom: 14px;
  }
  .meta-row {
    font-family: ${t.schriftUi}; font-size: 12.5px; color: ${t.gedaempft};
    margin-top: 10px; margin-bottom: 40px;
    display: flex; gap: 10px; align-items: center;
  }
  .dot { width: 3px; height: 3px; border-radius: 50%; background: ${t.ziffer}; flex: none; }
  h1 {
    font-size: ${t.h1}; line-height: 1.22; margin: 0;
    font-weight: ${t.h1Gewicht}; letter-spacing: -0.01em;
  }
  .lede { font-size: ${t.lede}; line-height: 1.65; color: ${t.weich}; margin: 22px 0 40px; }
  h2 {
    font-family: ${t.schriftUi}; font-size: 13px; text-transform: uppercase;
    letter-spacing: 0.07em; color: ${t.akzent}; font-weight: 700;
    margin: 46px 0 16px;
  }
  h2 .n { color: ${t.ziffer}; margin-right: 8px; }
  p { font-size: ${t.text}; line-height: ${t.zeile}; color: ${t.fg}; margin: 0 0 18px; }
  .section { border-top: 1px solid ${t.linie}; padding-top: 2px; }
  .closing {
    margin-top: 48px; padding-top: 24px; border-top: 1px solid ${t.linie};
    font-style: italic; color: ${t.weich}; font-size: 17px; line-height: 1.7;
  }
  .impressum {
    font-family: ${t.schriftUi}; font-size: 11.5px; color: ${t.gedaempft};
    margin-top: 44px; padding-top: 16px; border-top: 1px solid ${t.linie};
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  }
  .impressum a { color: ${t.gedaempft}; }
  @media (max-width: 680px) {
    .page { padding: 36px 18px 48px; }
    h1 { font-size: calc(${t.h1} - 7px); }
    .lede, p { font-size: 17px; }
    .meta-row { flex-wrap: wrap; }
  }
${v.extra || ""}`;
}
