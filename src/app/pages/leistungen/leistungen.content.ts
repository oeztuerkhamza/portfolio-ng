import type { Entry } from '../../core/i18n/translations';

/**
 * Zusätzliche Texte der Leistungsseite (Abschnittsköpfe, Titel der fünf
 * Leistungen, „Lokal gefunden werden"). Werden von LeistungenComponent
 * registriert und kommen mit dem Lazy-Chunk der Seite.
 */
export const LEISTUNGEN_CONTENT: Record<string, Entry> = {
  'leist.services.label': { de: 'Leistungen im Überblick', en: 'Our services', tr: 'Hizmetlerimiz' },
  'leist.services.title': {
    de: 'Websites und Software,<br /><em>die im Alltag helfen</em>.',
    en: 'Websites and software<br /><em>that help every day</em>.',
    tr: 'Günlük işte yardımcı olan<br /><em>web siteleri ve yazılımlar</em>.',
  },
  'leist.s1.title': { de: 'Neue Website', en: 'New website', tr: 'Yeni web sitesi' },
  'leist.s2.title': { de: 'Website-Relaunch', en: 'Website relaunch', tr: 'Web sitesi yenileme' },
  'leist.s5.text': {
    de: 'Wenn jemand in Ihrer Nähe sucht, sollen Sie oben stehen: ein gepflegtes Google-Unternehmensprofil, stimmige Einträge in Verzeichnissen, Ortsseiten auf Ihrer Website und mehr echte Bewertungen.',
    en: 'When someone nearby searches, you should be at the top: a well-kept Google Business Profile, consistent directory listings, local pages on your website and more genuine reviews.',
    tr: 'Yakınınızda biri arama yaptığında üstte çıkmalısınız: bakımlı bir Google İşletme Profili, tutarlı rehber kayıtları, sitenizde yerel sayfalar ve daha fazla gerçek yorum.',
  },
  'leist.s5.p1': {
    de: 'Google-Unternehmensprofil einrichten und pflegen', en: 'Set up and maintain your Google Business Profile', tr: 'Google İşletme Profili kurulumu ve bakımı',
  },
  'leist.s5.p2': {
    de: 'Einheitliche Einträge in Verzeichnissen', en: 'Consistent directory listings', tr: 'Rehberlerde tutarlı kayıtlar',
  },
  'leist.s5.p3': { de: 'Ortsseiten für Ihre Umgebung', en: 'Local pages for your area', tr: 'Bölgeniz için yerel sayfalar' },
  'leist.s5.p4': { de: 'Mehr Bewertungen mit NFC-Karten', en: 'More reviews with NFC cards', tr: 'NFC kartlarla daha fazla yorum' },
  'leist.products.title': {
    de: 'Fertige Produkte<br /><em>zum Festpreis</em>.',
    en: 'Ready-made products<br /><em>at a fixed price</em>.',
    tr: 'Sabit fiyatlı<br /><em>hazır ürünler</em>.',
  },
};
