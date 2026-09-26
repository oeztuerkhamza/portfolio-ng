import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Bewertungsabschnitts.
 *
 * Was hier steht, ist unser Text. Die Bewertungen selbst kommen unverändert
 * von Google — kürzen oder umschreiben wäre nach deren Bedingungen nicht
 * erlaubt, und wäre ohnehin unredlich.
 */
export const REVIEWS_CONTENT: Record<string, Entry> = {
  'rv.label': { de: 'Bewertungen', fr: 'Avis', en: 'Reviews', tr: 'Değerlendirmeler', ku: 'Nirxandin' },
  'rv.title': {
    de: 'Was Kunden<br /><em>über uns schreiben</em>.',
    fr: 'Ce que nos clients<br /><em>écrivent de nous</em>.',
    en: 'What customers<br /><em>write about us</em>.',
    tr: 'Müşterilerimizin<br /><em>bizim için yazdıkları</em>.',
    ku: 'Ya ku xerîdar<br /><em>li ser me dinivîsin</em>.',
  },
  'rv.of5': { de: 'von 5', fr: 'sur 5', en: 'out of 5', tr: 'üzerinden 5', ku: 'ji 5' },
  'rv.count': {
    de: '{p} Bewertungen bei Google',
    fr: '{p} avis sur Google',
    en: '{p} reviews on Google',
    tr: "Google'da {p} değerlendirme",
    ku: 'li Google {p} nirxandin',
  },
  'rv.stars': {
    de: '{p} von 5 Sternen',
    fr: '{p} étoiles sur 5',
    en: '{p} out of 5 stars',
    tr: '5 üzerinden {p} yıldız',
    ku: '{p} ji 5 stêrkan',
  },
  'rv.prev': { de: 'Vorige Bewertungen', fr: 'Avis précédents', en: 'Previous reviews', tr: 'Önceki değerlendirmeler', ku: 'Nirxandinên berê' },
  'rv.next': { de: 'Weitere Bewertungen', fr: 'Avis suivants', en: 'More reviews', tr: 'Sonraki değerlendirmeler', ku: 'Nirxandinên din' },
  'rv.source': {
    de: 'Bewertungen von Google, unverändert übernommen.',
    fr: 'Avis provenant de Google, repris sans modification.',
    en: 'Reviews from Google, shown unchanged.',
    tr: "Google'dan alınan değerlendirmeler, değiştirilmeden gösteriliyor.",
    ku: 'Nirxandin ji Google, bê guhertin têne nîşandan.',
  },
  'rv.open': { de: 'Bei Google ansehen', fr: 'Voir sur Google', en: 'View on Google', tr: "Google'da gör", ku: 'Li Google bibîne' },
  'rv.own': {
    de: 'So sammeln wir sie — mit den Bewertungskarten',
    fr: 'Comment nous les collectons — avec les cartes d’avis',
    en: 'How we collect them — with the review cards',
    tr: 'Bunları nasıl topluyoruz — değerlendirme kartlarıyla',
    ku: 'Em çawa wan berhev dikin — bi kartên nirxandinê',
  },
};
