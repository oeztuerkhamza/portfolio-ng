/**
 * Erzeugt Gerichtfotos für die Speisekarte mit Fooocus (Gradio 3, z. B. auf
 * Colab hinter einem *.gradio.live-Link).
 *
 *   node scripts/generate-dish-photos.mjs --url https://xxxx.gradio.live
 *   node scripts/generate-dish-photos.mjs --url … --only maultaschen,tiramisu --force
 *   node scripts/generate-dish-photos.mjs --list
 *
 * Referenzbild: liegt scripts/assets/plate-reference.jpg, wird es als Image Prompt
 * mitgegeben (Teller, Tisch und Wand bleiben dann gleich). --make-reference <n> erzeugt n
 * Kandidaten (leerer Teller) nach scripts/assets/candidates/; --no-reference schaltet es ab,
 * --ref-weight <0-2> (0.6) und --ref-stop <0-1> (0.5) stellen die Stärke ein.
 * Optionen: --out <Ordner> (public/menu/sichelschmiede), --seed <Zahl> (Start,
 * je Gericht +1), --performance Quality|Speed (Quality), --force (vorhandene
 * Bilder neu erzeugen). Ohne --force wird übersprungen, was schon da ist; ein
 * abgebrochener Lauf lässt sich also einfach neu starten.
 *
 * Fooocus hat keine benannte API. Das Skript liest deshalb die Oberfläche
 * (/config), baut die 153 Eingaben der Erzeugungsfunktion aus deren
 * Voreinstellungen und überschreibt nur Prompt, Stil, Format und Seed. Die
 * Abfolge ist dieselbe wie beim Klick auf „Generate": 65 → 66 → 67 → 68 → 69.
 * Die Verbindung läuft über die Warteschlange (WebSocket), Node ≥ 22.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DISHES, NEGATIVE, PROMPT_PREFIX, PROMPT_SUFFIX, REFERENCE_PROMPT } from './dish-photos.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? def : (args[i + 1] ?? true);
};
const flag = (name) => args.includes(`--${name}`);

if (flag('list')) {
  for (const d of DISHES) console.log(`${d.slug.padEnd(30)} ${d.de}`);
  process.exit(0);
}

const base = String(opt('url', '')).replace(/\/+$/, '');
if (!/^https:\/\/[\w.-]+$/.test(base)) {
  console.error('Bitte --url https://….gradio.live angeben.');
  process.exit(1);
}
const outDir = String(opt('out', 'public/menu/sichelschmiede'));
const seed0 = Number(opt('seed', 20261024));
const performance = String(opt('performance', 'Quality'));
const only = opt('only', '') ? String(opt('only')).split(',') : null;
const force = flag('force');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Oberfläche lesen ─────────────────────────────────────────
const config = await (await fetch(`${base}/config`)).json();
const comps = new Map(config.components.map((c) => [c.id, c]));
const GENERATE = 67;
const dep = config.dependencies[GENERATE];
if (!dep || dep.inputs.length < 100) throw new Error('Das ist keine Fooocus-Oberfläche, die dieses Skript kennt.');

const idByLabel = (label, nth = 0) => {
  const hits = dep.inputs.filter((id) => comps.get(id)?.props?.label === label);
  if (!hits[nth]) throw new Error(`Eingabe „${label}" nicht gefunden.`);
  return hits[nth];
};
const ID = {
  prompt: dep.inputs[2], // Textfeld „Prompt" (Position in der Eingabeliste von Fooocus)
  negative: idByLabel('Negative Prompt'),
  styles: idByLabel('Selected Styles'),
  performance: idByLabel('Performance'),
  aspect: idByLabel('Aspect Ratios'),
  count: idByLabel('Image Number'),
  format: idByLabel('Output Format'),
  seed: idByLabel('Seed'),
};
const choices = (id) => comps.get(id).props.choices.map((c) => (Array.isArray(c) ? c[0] : c));
const aspect = choices(ID.aspect).find((c) => c.startsWith('1280×768'));
if (!aspect) throw new Error('Seitenverhältnis 1280×768 fehlt in dieser Fooocus-Version.');
const wantStyles = ['Fooocus Photograph', 'Fooocus Enhance'].filter((s) => choices(ID.styles).includes(s));

// Image-Prompt-Felder von Fooocus (Position in der Eingabeliste, per Beschriftung geprüft)
const IP = {
  enable: dep.inputs[31],
  tab: dep.inputs[32],
  image: dep.inputs[81],
  stop: dep.inputs[82],
  weight: dep.inputs[83],
  type: dep.inputs[84],
};
if (comps.get(IP.image)?.props?.label !== 'Image' || comps.get(IP.type)?.props?.label !== 'Type') {
  throw new Error('Image-Prompt-Felder nicht gefunden: andere Fooocus-Version?');
}
const refPath = String(opt('reference', 'scripts/assets/plate-reference.jpg'));
const useRef = !flag('no-reference') && !flag('make-reference') && existsSync(refPath);
const refData = useRef ? `data:image/jpeg;base64,${(await readFile(refPath)).toString('base64')}` : null;
const refWeight = Number(opt('ref-weight', 0.6));
const refStop = Number(opt('ref-stop', 0.5));

function payload(prompt, seed) {
  const over = {
    [ID.prompt]: prompt,
    [ID.negative]: NEGATIVE,
    [ID.styles]: wantStyles,
    [ID.performance]: performance,
    [ID.aspect]: aspect,
    [ID.count]: 1,
    [ID.format]: 'jpeg',
    [ID.seed]: String(seed),
    ...(refData ? { [IP.enable]: true, [IP.tab]: 'ip', [IP.image]: refData, [IP.stop]: refStop, [IP.weight]: refWeight, [IP.type]: 'ImagePrompt' } : {}),
  };
  return dep.inputs.map((id) => {
    if (id in over) return over[id];
    const v = comps.get(id)?.props?.value;
    return v === undefined ? null : v;
  });
}

// ── Warteschlange (Gradio 3, WebSocket) ───────────────────────
function run(fn, data, session, onProgress) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${base.replace(/^https/, 'wss')}/queue/join`);
    let last = null;
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error(`Zeitüberschreitung bei fn ${fn}`));
    }, 15 * 60 * 1000);
    ws.onerror = () => reject(new Error(`WebSocket-Fehler bei fn ${fn}`));
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.msg === 'send_hash') ws.send(JSON.stringify({ fn_index: fn, session_hash: session }));
      else if (m.msg === 'send_data') ws.send(JSON.stringify({ data, event_data: null, fn_index: fn, session_hash: session }));
      else if (m.msg === 'process_generating' && m.success !== false) {
        last = m.output?.data ?? last;
        onProgress?.(m);
      } else if (m.msg === 'process_completed') {
        clearTimeout(timer);
        ws.close();
        if (!m.success) reject(new Error(`fn ${fn}: ${JSON.stringify(m.output).slice(0, 300)}`));
        else resolve(m.output?.data ?? last);
      } else if (m.msg === 'queue_full') {
        clearTimeout(timer);
        ws.close();
        reject(new Error('Warteschlange voll'));
      }
    };
  });
}

/** Alle Bilddateien in einer Gradio-Antwort (Galerie, Einzelbild, verschachtelt). */
function imagesIn(value, out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    for (const v of value) imagesIn(v, out);
    return out;
  }
  if (typeof value.name === 'string' && /\.(png|jpe?g|webp)$/i.test(value.name)) out.push(value);
  else for (const v of Object.values(value)) imagesIn(v, out);
  return out;
}

async function fetchImage(img) {
  if (typeof img.data === 'string' && img.data.startsWith('data:')) return Buffer.from(img.data.split(',')[1], 'base64');
  const res = await fetch(`${base}/file=${img.name}`);
  if (!res.ok) throw new Error(`Bild nicht ladbar (${res.status}): ${img.name}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generate(prompt, seed) {
  const session = Math.random().toString(36).slice(2, 12);
  await run(65, [], session);
  await run(66, [false, String(seed)], session);
  await run(GENERATE, payload(prompt, seed).map((v, i) => (i === 0 ? null : v)), session);
  let result = null;
  result = await run(68, [null], session);
  await run(69, [], session).catch(() => {});
  const files = imagesIn(result);
  // Letztes Bild ist das fertige (Vorschauen kommen vorher).
  const img = files.at(-1);
  if (!img) throw new Error('Keine Bilddatei in der Antwort: ' + JSON.stringify(result).slice(0, 300));
  return fetchImage(img);
}

let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('Hinweis: sharp fehlt, Bilder werden unverkleinert gespeichert.');
}

const nRef = Number(opt('make-reference', 0));
await mkdir(nRef ? 'scripts/assets/candidates' : outDir, { recursive: true });
const todo = nRef
  ? Array.from({ length: nRef }, (_, i) => ({ slug: `ref-${i + 1}`, raw: REFERENCE_PROMPT, outDir: 'scripts/assets/candidates' }))
  : DISHES.filter((d) => (!only || only.includes(d.slug)) && (force || !existsSync(join(outDir, `${d.slug}.jpg`))));
console.log(`${todo.length} ${nRef ? 'Referenzbilder' : `von ${DISHES.length} Gerichten`}, ${performance}, ${aspect.split(' ')[0]}${refData ? ', mit Referenzbild' : ''}`);

let done = 0;
const failed = [];
for (const [i, d] of todo.entries()) {
  const seed = seed0 + (nRef ? i * 7 : DISHES.indexOf(d));
  const prompt = d.raw ?? PROMPT_PREFIX + d.prompt + PROMPT_SUFFIX;
  const t0 = Date.now();
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      let buf = await generate(prompt, seed + (attempt - 1) * 1000);
      if (sharp) buf = await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      await writeFile(join(d.outDir ?? outDir, `${d.slug}.jpg`), buf);
      ok = true;
      done++;
      console.log(`[${i + 1}/${todo.length}] ${d.slug} ✓ ${Math.round((Date.now() - t0) / 1000)} s, ${Math.round(buf.length / 1024)} KB`);
    } catch (err) {
      console.warn(`[${i + 1}/${todo.length}] ${d.slug} Versuch ${attempt}: ${err.message}`);
      await sleep(3000);
    }
  }
  if (!ok) failed.push(d.slug);
}
console.log(`Fertig: ${done} erzeugt${failed.length ? `, fehlgeschlagen: ${failed.join(', ')}` : ''}.`);
process.exit(failed.length ? 1 : 0);
