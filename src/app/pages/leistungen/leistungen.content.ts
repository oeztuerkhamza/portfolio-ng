import type { Entry } from '../../core/i18n/translations';

/**
 * Zusätzliche Texte der Leistungsseite (Abschnittsköpfe, Titel der fünf
 * Leistungen, „Lokal gefunden werden"). Werden von LeistungenComponent
 * registriert und kommen mit dem Lazy-Chunk der Seite.
 */
export const LEISTUNGEN_CONTENT: Record<string, Entry> = {
  'leist.services.label': { de: 'Leistungen im Überblick', fr: 'Nos services', en: 'Our services', tr: 'Hizmetlerimiz', ku: 'Xizmetên me' },
  'leist.services.title': {
    de: 'Websites und Software,<br /><em>die im Alltag helfen</em>.',
    fr: 'Des sites et logiciels<br /><em>utiles au quotidien</em>.',
    en: 'Websites and software<br /><em>that help every day</em>.',
    tr: 'Günlük işte yardımcı olan<br /><em>web siteleri ve yazılımlar</em>.',
    ku: 'Malper û nermalav<br /><em>ku di rojane de alîkar in</em>.',
  },
  'leist.s1.title': { de: 'Neue Website', fr: 'Nouveau site web', en: 'New website', tr: 'Yeni web sitesi', ku: 'Malpera nû' },
  'leist.s2.title': { de: 'Website-Relaunch', fr: 'Refonte de site', en: 'Website relaunch', tr: 'Web sitesi yenileme', ku: 'Nûkirina malperê' },
  'leist.s5.text': {
    de: 'Wenn jemand in Ihrer Nähe sucht, sollen Sie oben stehen: ein gepflegtes Google-Unternehmensprofil, stimmige Einträge in Verzeichnissen, Ortsseiten auf Ihrer Website und mehr echte Bewertungen.',
    fr: 'Quand quelqu’un cherche près de chez vous, vous devez apparaître en haut : une fiche Google soignée, des annuaires cohérents, des pages locales sur votre site et davantage d’avis authentiques.',
    en: 'When someone nearby searches, you should be at the top: a well-kept Google Business Profile, consistent directory listings, local pages on your website and more genuine reviews.',
    tr: 'Yakınınızda biri arama yaptığında üstte çıkmalısınız: bakımlı bir Google İşletme Profili, tutarlı rehber kayıtları, sitenizde yerel sayfalar ve daha fazla gerçek yorum.',
    ku: 'Dema ku kesek li nêzîkî we lê digere, divê hûn li jor bin: profîla karsaziyê ya Google ya xweşkirî, tomarên rêkûpêk di rêberan de, rûpelên herêmî li ser malpera we û bêtir nirxandinên rastîn.',
  },
  'leist.s5.p1': {
    de: 'Google-Unternehmensprofil einrichten und pflegen', fr: 'Création et suivi de la fiche Google', en: 'Set up and maintain your Google Business Profile', tr: 'Google İşletme Profili kurulumu ve bakımı', ku: 'Sazkirin û lênêrîna profîla Google',
  },
  'leist.s5.p2': {
    de: 'Einheitliche Einträge in Verzeichnissen', fr: 'Inscriptions cohérentes dans les annuaires', en: 'Consistent directory listings', tr: 'Rehberlerde tutarlı kayıtlar', ku: 'Tomarên yekreng di rêberan de',
  },
  'leist.s5.p3': { de: 'Ortsseiten für Ihre Umgebung', fr: 'Pages locales pour votre secteur', en: 'Local pages for your area', tr: 'Bölgeniz için yerel sayfalar', ku: 'Rûpelên herêmî ji bo derdora we' },
  'leist.s5.p4': { de: 'Mehr Bewertungen mit NFC-Karten', fr: 'Plus d’avis grâce aux cartes NFC', en: 'More reviews with NFC cards', tr: 'NFC kartlarla daha fazla yorum', ku: 'Bêtir nirxandin bi kartên NFC' },
  'leist.products.title': {
    de: 'Fertige Produkte<br /><em>zum Festpreis</em>.',
    fr: 'Des produits prêts<br /><em>à prix fixe</em>.',
    en: 'Ready-made products<br /><em>at a fixed price</em>.',
    tr: 'Sabit fiyatlı<br /><em>hazır ürünler</em>.',
    ku: 'Berhemên amade<br /><em>bi bihayê sabît</em>.',
  },
};
