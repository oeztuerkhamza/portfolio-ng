/**
 * Die Rechnungsseite als PDF (Base64) für den Versand per E-Mail — dieselbe
 * Seite wie Vorschau und Druck, doppelt aufgelöst gerastert und auf A4
 * gelegt. Die beiden Bibliotheken werden erst beim ersten Versand geladen.
 */
export async function invoicePdf(sheet: HTMLElement, title: string): Promise<string> {
  const [{ toSvg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);

  // Kopie außerhalb des Bildschirms: ohne den Zoom der Vorschau, in voller A4-Breite.
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;background:#fff';
  const copy = sheet.cloneNode(true) as HTMLElement;
  host.appendChild(copy);
  document.body.appendChild(host);
  try {
    await inlineSvgImages(sheet, copy);
    await document.fonts.ready;
    avoidPageBreaks(copy);
    const img = await rasterize(copy, await toSvg(copy, { backgroundColor: '#ffffff' }));
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    pdf.setProperties({ title });
    // Längere Rechnungen laufen über mehrere Seiten: dasselbe Bild, jeweils eine A4-Höhe weiter oben.
    const height = (210 * copy.offsetHeight) / copy.offsetWidth;
    const pages = Math.max(1, Math.ceil(height / 297 - 0.01));
    for (let p = 0; p < pages; p++) {
      if (p) pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, -297 * p, 210, height, 'sheet', 'FAST');
    }
    return pdf.output('datauristring').split('base64,')[1];
  } finally {
    host.remove();
  }
}

/**
 * SVG-Abbild der Seite in doppelter Auflösung auf ein Canvas zeichnen. Nicht
 * über `toJpeg`: dessen Bildladen wartet auf requestAnimationFrame, und das
 * steht in einem Hintergrund-Tab still — wer nach dem Festschreiben in sein
 * Postfach wechselte, hielt den Versand an, bis er zurückkam.
 */
async function rasterize(node: HTMLElement, svg: string): Promise<string> {
  const image = new Image();
  image.src = svg;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = node.offsetWidth * 2;
  canvas.height = node.offsetHeight * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Was im Druck `break-inside: avoid` hat, darf auch im PDF nicht über eine
 * Seitengrenze laufen: Solche Blöcke rutschen samt 15 mm Kopfabstand auf die
 * nächste Seite. Vor Tabellenzeilen kommen dafür zwei Zeilen — eine hohe
 * leere und eine ohne Höhe —, damit die Zebrastreifen nicht kippen.
 */
function avoidPageBreaks(copy: HTMLElement): void {
  const mm = copy.offsetWidth / 210;
  const pageHeight = 297 * mm;
  for (const el of copy.querySelectorAll<HTMLElement>('tbody tr, .inv-sums, .inv-tax-note, .inv-pay, .inv-foot')) {
    const origin = copy.getBoundingClientRect().top;
    const box = el.getBoundingClientRect();
    const top = box.top - origin;
    const edge = (Math.floor(top / pageHeight) + 1) * pageHeight;
    if (box.bottom - origin <= edge || box.height > pageHeight - 30 * mm) continue;
    const push = edge - top + 15 * mm;
    if (el.tagName === 'TR') {
      const spacer = document.createElement('tr');
      spacer.innerHTML = `<td colspan="99" style="height:${push}px;padding:0;border:0;background:#fff"></td>`;
      el.before(spacer, document.createElement('tr'));
    } else {
      el.style.marginTop = `${parseFloat(getComputedStyle(el).marginTop) + push}px`;
    }
  }
}

/**
 * Ein <img> mit SVG-Datei zeichnet der Browser beim Rastern nicht zuverlässig
 * mit — das Logo fehlte. In der Kopie wird es deshalb durch das SVG selbst
 * ersetzt, in der Größe, die das Original gerade hat.
 */
async function inlineSvgImages(sheet: HTMLElement, copy: HTMLElement): Promise<void> {
  const originals = sheet.querySelectorAll('img');
  const images = copy.querySelectorAll('img');
  await Promise.all(
    [...images].map(async (img, i) => {
      if (!/\.svg(\?|$)/i.test(img.getAttribute('src') ?? '')) return;
      const text = await fetch(img.src).then((r) => r.text());
      const svg = document.importNode(new DOMParser().parseFromString(text, 'image/svg+xml').documentElement, true);
      const size = getComputedStyle(originals[i]);
      svg.setAttribute('width', size.width);
      svg.setAttribute('height', size.height);
      svg.style.display = 'block';
      img.replaceWith(svg);
    }),
  );
}
