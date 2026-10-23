import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Bewertungsabschnitts.
 *
 * Was hier steht, ist unser Text. Die Bewertungen selbst kommen unverändert
 * von Google — kürzen oder umschreiben wäre nach deren Bedingungen nicht
 * erlaubt, und wäre ohnehin unredlich.
 */
export const REVIEWS_CONTENT: Record<string, Entry> = {
  'rv.label': { de: 'Bewertungen', en: 'Reviews', tr: 'Değerlendirmeler' },
  'rv.title': {
    de: 'Was Kunden<br /><em>über uns schreiben</em>.',
    en: 'What customers<br /><em>write about us</em>.',
    tr: 'Müşterilerimizin<br /><em>bizim için yazdıkları</em>.',
  },
  'rv.of5': { de: 'von 5', en: 'out of 5', tr: 'üzerinden 5' },
  'rv.count': {
    de: '{p} Bewertungen bei Google',
    en: '{p} reviews on Google',
    tr: "Google'da {p} değerlendirme",
  },
  'rv.stars': {
    de: '{p} von 5 Sternen',
    en: '{p} out of 5 stars',
    tr: '5 üzerinden {p} yıldız',
  },
  'rv.prev': { de: 'Vorige Bewertungen', en: 'Previous reviews', tr: 'Önceki değerlendirmeler' },
  'rv.next': { de: 'Weitere Bewertungen', en: 'More reviews', tr: 'Sonraki değerlendirmeler' },
  'rv.more': { de: 'Ganz lesen', en: 'Read in full', tr: 'Tamamını oku' },
  'rv.less': { de: 'Weniger', en: 'Show less', tr: 'Daha az' },
  'rv.source': {
    de: 'Bewertungen von Google, unverändert übernommen.',
    en: 'Reviews from Google, shown unchanged.',
    tr: "Google'dan alınan değerlendirmeler, değiştirilmeden gösteriliyor.",
  },
  'rv.open': { de: 'Bei Google ansehen', en: 'View on Google', tr: "Google'da gör" },
  'rv.own': {
    de: 'So sammeln wir sie — mit den Bewertungskarten',
    en: 'How we collect them — with the review cards',
    tr: 'Bunları nasıl topluyoruz — değerlendirme kartlarıyla',
  },
};
