// Generates sitemap.xml from the prerendered output.
// Walks dist/breisgau-digital/browser for index.html files and maps each to a URL,
// so the sitemap always reflects exactly what was rendered.
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ORIGIN = 'https://breisgau-digital.de';
const BROWSER_DIR = join('dist', 'breisgau-digital', 'browser');

if (!existsSync(BROWSER_DIR)) {
  console.error(`[sitemap] ${BROWSER_DIR} not found — run the build first.`);
  process.exit(1);
}

/** Recursively collect every directory that contains an index.html. */
function collect(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) collect(full, acc);
    else if (entry === 'index.html') acc.push(dir);
  }
  return acc;
}

const today = new Date().toISOString().slice(0, 10);

// Priority/frequency hints. Paths carry the locale prefix (/de/…); the part
// after it decides the weight.
function meta(path) {
  if (path === '/') return { priority: '1.0', freq: 'weekly' };
  const page = path.replace(/^\/(de|fr|en|tr|ku)(?=\/|$)/, '') || '/';
  if (page === '/') return { priority: '0.9', freq: 'weekly' };
  if (['/leistungen', '/bewertungskarten', '/smart-home', '/abo'].includes(page)) {
    return { priority: '0.9', freq: 'monthly' };
  }
  if (page.startsWith('/webdesign/')) return { priority: page === '/webdesign/freiburg' ? '0.9' : '0.8', freq: 'monthly' };
  if (page === '/projects') return { priority: '0.7', freq: 'monthly' };
  if (page.startsWith('/projects/')) return { priority: '0.6', freq: 'monthly' };
  if (page === '/contact' || page === '/ueber-uns') return { priority: '0.7', freq: 'yearly' };
  return { priority: '0.5', freq: 'yearly' };
}

const urls = collect(BROWSER_DIR)
  .map((dir) => {
    const rel = relative(BROWSER_DIR, dir).split(sep).join('/');
    return rel === '' ? '/' : `/${rel}`;
  })
  // Drop 404/error helper folders if any slip in.
  .filter((p) => !p.includes('404'))
  // Admin-Portal und Bestellstrecke gehören nicht in den Suchindex.
  .filter((p) => !/^\/admin|\/bestellen(\/|$)/.test(p))
  .sort();

const body = urls
  .map((path) => {
    const { priority, freq } = meta(path);
    return `  <url>
    <loc>${ORIGIN}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(BROWSER_DIR, 'sitemap.xml'), xml);
console.log(`[sitemap] wrote ${urls.length} URLs to ${join(BROWSER_DIR, 'sitemap.xml')}`);
