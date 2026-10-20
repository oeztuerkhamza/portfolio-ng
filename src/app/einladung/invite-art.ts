import { ArtId } from './invite-themes';

/**
 * Gezeichnete Ecken der Gestaltungen: Zitronenzweig, Olive, Eukalyptus,
 * Rosen, Tulpen, Ähren, Lorbeer, Arabeske, Art déco.
 *
 * Jede Zeichnung ist eine Ecke oben links (240 × 240), aus zwei Zweigen, die
 * an den Kanten entlangwachsen. Die anderen Ecken entstehen per CSS durch
 * Spiegeln. Gezeichnet wird mit Klassen statt Farben (a1 Frucht/Blüte,
 * a2 Blatt, a3 Akzent), die Farben kommen aus der Gestaltung
 * (`--iv-art1…3`). Der Zufall ist fest gesät — dieselbe Ecke beim
 * Vorrendern und im Browser, darum dürfen die Zeichnungen als HTML
 * eingesetzt werden.
 */

type Pt = [number, number];

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Kubische Kurve: Punkt und Richtung (Grad) bei t. */
function bez(p: Pt[], t: number): { p: Pt; a: number } {
  const u = 1 - t;
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  return { p: [x, y], a: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const at = (p: Pt, a: number, s = 1) => `transform="translate(${r1(p[0])} ${r1(p[1])}) rotate(${r1(a)})${s !== 1 ? ` scale(${r1(s * 100) / 100})` : ''}"`;
const off = (p: Pt, a: number, d: number): Pt => [p[0] + Math.cos((a * Math.PI) / 180) * d, p[1] + Math.sin((a * Math.PI) / 180) * d];

// ── Einzelteile, jeweils am Ursprung, nach +x ausgerichtet ──

function leaf(len: number, w: number): string {
  const c = len * 0.42;
  return (
    `<path class="a2" d="M0 0Q${c} ${-w} ${len} 0Q${c} ${w} 0 0Z"/>` +
    `<path class="lt" d="M0 0Q${c} ${-w} ${len} 0Z"/>` +
    `<path class="rib" d="M1 0Q${c} ${-w * 0.12} ${len * 0.9} 0"/>`
  );
}

function roundLeaf(r: number): string {
  return `<path class="rib" d="M0 0h${r * 0.6}"/><circle class="a2" cx="${r * 1.4}" cy="0" r="${r}"/><path class="lt" d="M${r * 0.4} 0a${r} ${r} 0 0 1 ${r * 2} 0z"/>`;
}

function lemon(): string {
  // hängt an einem kurzen Stiel nach +x
  return (
    '<path class="rib" d="M0 0q4 1 7 0"/>' +
    '<ellipse class="a1" cx="20" cy="0" rx="14" ry="10.5"/>' +
    '<path class="a1" d="M33 -2.5q4 2.5 0 5z"/>' +
    '<path class="dk" d="M9 4q11 9 23 1q-6 7-14 6q-6-2-9-7z"/>' +
    '<ellipse class="lt" cx="15" cy="-4" rx="6" ry="3" transform="rotate(-12 15 -4)"/>' +
    '<circle class="lt" cx="24" cy="-5.5" r="1.1"/>'
  );
}

function blossom(r: number): string {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 * Math.PI) / 180;
    s += `<circle class="pw" cx="${r1(Math.cos(a) * r)}" cy="${r1(Math.sin(a) * r)}" r="${r1(r * 0.78)}"/>`;
  }
  return s + `<circle class="a1" r="${r1(r * 0.42)}"/>`;
}

function olive(): string {
  return '<path class="rib" d="M0 0q3 0 5 1"/><ellipse class="a1" cx="11" cy="1" rx="6.5" ry="4.6"/><ellipse class="lt" cx="9" cy="-0.6" rx="2.6" ry="1.3"/>';
}

function rose(r: number): string {
  return (
    `<circle class="a1" r="${r}"/>` +
    `<path class="dk" d="M${-r} 0a${r} ${r} 0 0 0 ${r * 2} 0a${r * 0.9} ${r * 0.7} 0 0 1 ${-r * 2} 0z"/>` +
    `<path class="sp" d="M${-r * 0.55} ${-r * 0.1}a${r * 0.55} ${r * 0.55} 0 1 1 ${r * 0.6} ${r * 0.62}M${-r * 0.2} ${-r * 0.25}a${r * 0.3} ${r * 0.3} 0 1 1 ${r * 0.35} ${r * 0.4}M${r * 0.7} ${-r * 0.5}a${r * 0.85} ${r * 0.85} 0 0 1 ${-r * 1.3} ${r * 1.1}"/>` +
    `<circle class="lt" cx="${-r * 0.35}" cy="${-r * 0.45}" r="${r * 0.3}"/>`
  );
}

function tulip(): string {
  // Osmanische Tulpe: drei schmale, spitze Blütenblätter auf einem Stiel.
  const petal = (a: number, len: number, w: number) =>
    `<g transform="translate(16 0) rotate(${a})"><path class="a1" d="M0 0Q${len * 0.45} ${-w} ${len} 0Q${len * 0.45} ${w} 0 0Z"/><path class="lt" d="M0 0Q${len * 0.45} ${-w} ${len} 0Z"/></g>`;
  return '<path class="st" d="M0 0h17"/>' + petal(-22, 24, 5.5) + petal(22, 24, 5.5) + petal(0, 30, 6.5) + '<path class="dk" d="M16 0q8 3 16 0q-8 6-16 0z"/>';
}

function grain(): string {
  return '<path class="a1" d="M0 0q5-4 10 0q-5 4-10 0z"/><path class="lt" d="M0 0q5-4 10 0z"/><path class="awn" d="M10 0l9-1"/>';
}

// ── Zweige ──

interface Branch {
  pts: Pt[];
  leaves: number;
  len: number;
  w: number;
  angle: number;
}

/** Ecke oben links: der erste Zweig wächst nach rechts, der gespiegelte nach unten. */
const ALONG_TOP: Pt[] = [
  [-6, 22],
  [54, -2],
  [128, 6],
  [214, 42],
];
const SHORT_TOP: Pt[] = [
  [-6, 22],
  [40, 14],
  [76, 26],
  [112, 58],
];

const swap = (p: Pt): Pt => [p[1], p[0]];

interface Placed {
  p: Pt;
  a: number;
}

function branchSvg(b: Branch, seed: number, mirror: boolean, leafFn: (len: number, w: number) => string, extra?: (pos: Placed[], rand: () => number) => string): string {
  const rand = rng(seed);
  const pts = mirror ? b.pts.map(swap) : b.pts;
  const tr = (p: Pt) => (mirror ? swap(p) : p);
  // Spiegeln an der Diagonale: Winkel a → 90° − a.
  const ang = (a: number) => (mirror ? 90 - a : a);
  const P = b.pts;
  let s = `<path class="st" d="M${pts[0][0]} ${pts[0][1]}C${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]} ${pts[3][0]} ${pts[3][1]}"/>`;
  for (let i = 0; i < b.leaves; i++) {
    const t = 0.12 + (i / b.leaves) * 0.84;
    const { p, a } = bez(P, t);
    const side = i % 2 ? 1 : -1;
    const k = 1 - t * 0.4;
    const la = a + side * (b.angle + rand() * 14 - 7);
    s += `<g ${at(tr(p), ang(la), k)}>${leafFn(b.len, b.w)}</g>`;
  }
  const tip = bez(P, 1);
  s += `<g ${at(tr(tip.p), ang(tip.a), 0.62)}>${leafFn(b.len, b.w)}</g>`;
  if (extra) {
    const pos: Placed[] = [0.3, 0.5, 0.66, 0.82, 0.2, 0.92].map((t) => {
      const q = bez(P, t);
      return { p: tr(q.p), a: ang(q.a) };
    });
    s += extra(pos, rand);
  }
  return s;
}

/** Ein Zweig plus dessen Spiegelbild, darunter ein kürzerer Nebenzweig. */
function pair(b: Branch, seed: number, leafFn: (len: number, w: number) => string, extra?: (pos: Placed[], rand: () => number, mirror: boolean) => string): string {
  const short: Branch = { ...b, pts: SHORT_TOP, leaves: Math.max(3, Math.round(b.leaves / 2)) };
  return (
    branchSvg(short, seed + 7, false, leafFn) +
    branchSvg(short, seed + 9, true, leafFn) +
    branchSvg(b, seed, false, leafFn, extra && ((p, r) => extra(p, r, false))) +
    branchSvg(b, seed + 1, true, leafFn, extra && ((p, r) => extra(p, r, true)))
  );
}

// „Nach innen" heißt: für den oberen Zweig nach unten (+90°), für den gespiegelten nach rechts (0° … also 90 − 90).
const inward = (a: number, mirror: boolean) => (mirror ? a - 80 : a + 80);

const ART: Record<ArtId, () => string> = {
  lemons: () =>
    pair({ pts: ALONG_TOP, leaves: 11, len: 30, w: 11, angle: 52 }, 11, leaf, (pos, rand, m) => {
      let s = '';
      for (const i of [0, 2]) s += `<g ${at(pos[i].p, inward(pos[i].a, m) + (rand() * 20 - 10))}>${lemon()}</g>`;
      for (const i of [1, 3, 5]) s += `<g ${at(off(pos[i].p, inward(pos[i].a, m) + 180, 4), 0)}>${blossom(4.2)}</g>`;
      return s;
    }),
  olive: () =>
    pair({ pts: ALONG_TOP, leaves: 16, len: 28, w: 4.4, angle: 38 }, 23, leaf, (pos, _r, m) => {
      let s = '';
      for (const i of [0, 1, 3]) s += `<g ${at(pos[i].p, inward(pos[i].a, m))}>${olive()}</g>`;
      return s;
    }),
  eucalyptus: () =>
    pair({ pts: ALONG_TOP, leaves: 18, len: 0, w: 7, angle: 70 }, 31, (_l, w) => roundLeaf(w), (pos, _r, m) => {
      let s = '';
      for (const i of [1, 3]) s += `<g ${at(off(pos[i].p, inward(pos[i].a, m), 6), 0)}><circle class="a1" r="2.6"/><circle class="a1" cx="5" cy="3" r="2.2"/><circle class="a1" cx="-1" cy="5.5" r="2"/></g>`;
      return s;
    }),
  roses: () =>
    pair({ pts: ALONG_TOP, leaves: 10, len: 22, w: 9, angle: 50 }, 41, leaf, (pos, rand, m) => {
      let s = '';
      s += `<g ${at(pos[0].p, rand() * 40)}>${rose(15)}</g>`;
      s += `<g ${at(off(pos[2].p, inward(pos[2].a, m), 6), rand() * 40)}>${rose(10)}</g>`;
      for (const i of [3, 5]) s += `<g ${at(pos[i].p, 0)}>${blossom(3.4)}</g>`;
      return s;
    }),
  tulips: () =>
    pair({ pts: ALONG_TOP, leaves: 6, len: 40, w: 6.5, angle: 30 }, 53, leaf, (pos, rand, m) => {
      let s = '';
      for (const i of [0, 2, 3]) s += `<g ${at(pos[i].p, inward(pos[i].a, m) - (m ? -30 : 30) + rand() * 10)}>${tulip()}</g>`;
      for (const i of [1, 4]) s += `<g ${at(pos[i].p, 0)}><circle class="a3" r="2.4"/></g>`;
      return s;
    }),
  wheat: () => {
    // Ähren: Körner dicht am Ende der Halme, schmale Blätter weiter unten.
    const ear = (b: Pt[], seed: number, mirror: boolean) => {
      const rand = rng(seed);
      const tr = (p: Pt) => (mirror ? swap(p) : p);
      const ang = (a: number) => (mirror ? 90 - a : a);
      let s = `<path class="st" d="M${tr(b[0]).join(' ')}C${tr(b[1]).join(' ')} ${tr(b[2]).join(' ')} ${tr(b[3]).join(' ')}"/>`;
      for (let i = 0; i < 4; i++) {
        const { p, a } = bez(b, 0.12 + i * 0.12);
        s += `<g ${at(tr(p), ang(a + (i % 2 ? 24 : -24)), 1 - i * 0.1)}>${leaf(34, 3.6)}</g>`;
      }
      for (let i = 0; i < 16; i++) {
        const t = 0.62 + (i / 16) * 0.36;
        const { p, a } = bez(b, t);
        const side = i % 2 ? 1 : -1;
        s += `<g ${at(tr(p), ang(a + side * (26 + rand() * 6)), 1.5 - (t - 0.62))}>${grain()}</g>`;
      }
      return s;
    };
    return ear(SHORT_TOP, 61, false) + ear(SHORT_TOP, 62, true) + ear(ALONG_TOP, 63, false) + ear(ALONG_TOP, 64, true);
  },
  laurel: () =>
    pair({ pts: ALONG_TOP, leaves: 20, len: 22, w: 6.5, angle: 42 }, 71, leaf, (pos, _r, m) => {
      let s = '';
      for (const i of [0, 1, 2, 3]) s += `<circle class="a3" cx="${r1(off(pos[i].p, inward(pos[i].a, m), 5)[0])}" cy="${r1(off(pos[i].p, inward(pos[i].a, m), 5)[1])}" r="2.6"/>`;
      return s;
    }),
  arabesque: () => {
    // Doppelte Kante, Rosette in der Ecke, Ranken mit Tropfen an beiden Seiten.
    let s = '<path class="ln" d="M14 236V14h222M24 236V24h212"/>';
    let star = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * 45 * Math.PI) / 180;
      star += `${i ? 'L' : 'M'}${r1(19 + Math.cos(a) * 16)} ${r1(19 + Math.sin(a) * 16)}L${r1(19 + Math.cos(a + Math.PI / 8) * 7)} ${r1(19 + Math.sin(a + Math.PI / 8) * 7)}`;
    }
    s += `<path class="a2 fa" d="${star}Z"/><path class="ln" d="${star}Z"/><circle class="a1" cx="19" cy="19" r="3"/>`;
    const vine = (m: boolean) => {
      const tr = (x: number, y: number) => (m ? `${y} ${x}` : `${x} ${y}`);
      let v = `<path class="ln" d="M${tr(44, 24)}c20 0 26 26 46 26s26-26 46-26 26 26 46 26 26-26 46-26"/>`;
      for (const x of [67, 113, 159, 205]) {
        v += `<path class="a2 fa" d="M${tr(x, 37)}c-6 6-6 14 0 20 6-6 6-14 0-20z"/><path class="ln" d="M${tr(x, 37)}c-6 6-6 14 0 20 6-6 6-14 0-20z"/>`;
        v += `<circle class="a1" cx="${m ? 64 : x}" cy="${m ? x : 64}" r="1.8"/>`;
      }
      for (const x of [90, 182]) v += `<path class="ln" d="M${tr(x, 50)}c0 10 8 14 14 10s2-12-4-10"/>`;
      return v;
    };
    return s + vine(false) + vine(true);
  },
  deco: () => {
    // Fächer in der Ecke, Strahlen, gestufte Kanten.
    let s = '';
    for (const r of [34, 48, 62, 76]) s += `<path class="ln" d="M${r} 8A${r - 8} ${r - 8} 0 0 1 8 ${r}"/>`;
    for (let i = 1; i < 6; i++) {
      const a = (i * 15 * Math.PI) / 180;
      s += `<path class="ln" d="M8 8L${r1(8 + Math.cos(a) * 64)} ${r1(8 + Math.sin(a) * 64)}"/>`;
    }
    s += '<path class="a1 fa" d="M8 8h18A18 18 0 0 1 8 26z"/>';
    s += '<path class="ln" d="M84 8h152M84 16h120l8 8h24M8 84v152M16 84v120l8 8v24"/>';
    for (const x of [120, 160, 200]) s += `<path class="a1" d="M${x} 12l4 4-4 4-4-4z"/><path class="a1" d="M12 ${x}l4 4-4 4-4-4z"/>`;
    return s;
  },
};

const cache = new Map<ArtId, string>();

export function artSvg(id: ArtId): string {
  let body = cache.get(id);
  if (!body) {
    body = ART[id]();
    cache.set(id, body);
  }
  return `<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false" class="iv-art-svg iv-art--${id}">${body}</svg>`;
}

/**
 * Taube im Flug, nach rechts blickend (120 × 80). Die Flügel sind eigene
 * Gruppen, damit CSS sie schlagen lassen kann.
 */
export const DOVE_SVG =
  '<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false" class="iv-dove-svg">' +
  '<g class="iv-wing iv-wing-b"><path d="M60 42C52 24 40 10 20 4c10 10 14 22 18 40z"/><path class="fe" d="M30 12c6 8 9 16 11 26M40 16c4 7 6 14 8 24"/></g>' +
  '<path class="body" d="M22 47c10-8 30-12 48-8 6-8 16-10 22-6 4 2 6 5 11 6l-8 3c-2 9-12 17-28 19-14 2-28-2-38 2L4 71l13-12c-4-2-3-9 5-12z"/>' +
  '<path class="fe" d="M22 58c12 1 22-1 32-5M14 64l10-3"/>' +
  '<path class="beak" d="M102 38l8 1.5-8 2.5z"/><circle class="eye" cx="93" cy="35" r="1.6"/>' +
  '<g class="iv-wing iv-wing-f"><path d="M54 44C50 24 60 8 84 0c-6 12-8 26-12 44z"/><path class="fe" d="M62 38c0-10 4-20 12-28M68 40c2-9 5-17 10-24"/></g>' +
  '</svg>';
