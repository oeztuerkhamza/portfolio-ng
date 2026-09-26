/**
 * Eine Regel, die an mehreren Stellen gilt und darum an einer steht.
 *
 * Bewertungen, die von einer fremden Plattform stammen — bei uns die von
 * Google —, dürfen **nicht** als eigene strukturierte Daten ausgezeichnet
 * werden. Google nennt das self-serving markup; die Strafe ist der Verlust
 * aller Rich Results für die Seite, nicht nur der Sterne.
 *
 * Verlockend wäre es genau dort, wo schon ein Product-Schema steht: die
 * Gesamtnote aus den Google-Bewertungen als `aggregateRating` an die Karten
 * hängen. Damit diese Versuchung auffällt, prüfen die Seitentests, dass im
 * ausgelieferten JSON-LD nichts davon steht.
 *
 * Erlaubt wäre eine Bewertung, die wir selbst erhoben haben und selbst
 * vorhalten — dann aber mit echten, nachweisbaren Einzelbewertungen. So weit
 * sind wir nicht, und bis dahin gilt die Regel ohne Ausnahme.
 */
export function expectNoBorrowedRatings(doc: Document = document): void {
  for (const s of Array.from(doc.head.querySelectorAll('script[data-jsonld]'))) {
    const body = (s.textContent ?? '').toLowerCase().replace(/\s+/g, '');
    const where = s.getAttribute('data-jsonld') ?? '?';
    expect(body).not.withContext(`JSON-LD "${where}" trägt eine geliehene Gesamtnote`).toContain('aggregaterating');
    expect(body).not.withContext(`JSON-LD "${where}" zeichnet fremde Bewertungen aus`).toContain('"@type":"review"');
    expect(body).not.withContext(`JSON-LD "${where}" zeichnet fremde Bewertungen aus`).toContain('reviewrating');
  }
}
