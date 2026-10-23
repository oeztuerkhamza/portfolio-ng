import type { Entry } from '../i18n/translations';

/**
 * Texte der Homepage-Update-Pakete. Zwei Seiten zeigen sie — die Leistungsseite
 * mit allen Punkten, die Startseite als Preisübersicht — und registrieren sie
 * beide aus dieser einen Datei, damit Preis und Zusage nicht auseinanderlaufen.
 */
export const UPDATE_CONTENT: Record<string, Entry> = {
  'upd.label': {
    de: 'Homepage-Update',
    en: 'Homepage update',
    tr: 'Web sitesi güncelleme',
  },
  'upd.title': {
    de: 'Ihre Website ist schon da.<br /><em>Wir machen sie wieder gut.</em>',
    en: 'You already have a website.<br /><em>We make it good again.</em>',
    tr: 'Web siteniz zaten var.<br /><em>Biz onu yeniden iyi hale getiririz.</em>',
  },
  'upd.subtitle': {
    de: 'Drei Festpreis-Pakete für bestehende Websites — schriftlich vorab, in wenigen Werktagen fertig. Nichts davon ist ein Abo.',
    en: 'Three fixed-price packages for existing websites — in writing up front, done in a few working days. None of it is a subscription.',
    tr: 'Mevcut web siteleri için üç sabit fiyatlı paket — önceden yazılı, birkaç iş gününde hazır. Hiçbiri abonelik değildir.',
  },
  'upd.days': {
    de: 'Fertig in {p} Werktagen',
    en: 'Done in {p} working days',
    tr: '{p} iş gününde hazır',
  },
  'upd.featured': {
    de: 'Meistgewählt',
    en: 'Most chosen',
    tr: 'En çok tercih edilen',
  },
  'upd.cta': {
    de: 'Update anfragen',
    en: 'Request the update',
    tr: 'Güncelleme talep et',
  },
  'upd.note': {
    de: 'Endpreise ohne Umsatzsteuer (Kleinunternehmer, § 19 UStG). Die Werktage zählen ab dem Moment, in dem Zugänge, Texte und Fotos bei uns sind. Texten und Fotos übernehmen wir auf Wunsch gegen Aufpreis.',
    en: 'Final prices, no VAT added (small-business rule, § 19 UStG). Working days count from the moment we have access, copy and photos. Copywriting and photos on request, for an extra fee.',
    tr: 'Net fiyatlar KDV içermez (küçük işletme, § 19 UStG). İş günleri; erişim, metin ve fotoğrafların bize ulaştığı andan itibaren sayılır. Metin yazımı ve fotoğraf isteğe bağlı, ek ücretli.',
  },
  'upd.start.name': {
    de: 'Update Start',
    en: 'Update Start',
    tr: 'Update Start',
  },
  'upd.start.tag': {
    de: 'Aufgefrischt und sicher',
    en: 'Refreshed and secure',
    tr: 'Tazelenmiş ve güvenli',
  },
  'upd.start.p1': {
    de: 'Bis zu 3 Seiten inhaltlich aktualisiert',
    en: 'Up to 3 pages updated',
    tr: '3 sayfaya kadar içerik güncelleme',
  },
  'upd.start.p2': {
    de: 'Handy-Ansicht geprüft und korrigiert',
    en: 'Mobile view checked and fixed',
    tr: 'Mobil görünüm kontrol ve düzeltme',
  },
  'upd.start.p3': {
    de: 'Ladezeit-Check, SSL, Impressum und Datenschutz auf Stand',
    en: 'Speed check, SSL, imprint and privacy policy up to date',
    tr: 'Hız kontrolü, SSL, künye ve gizlilik güncel',
  },
  'upd.start.p4': {
    de: 'Titel und Beschreibungen für Google überarbeitet',
    en: 'Titles and descriptions reworked for Google',
    tr: 'Google için başlık ve açıklamalar yenilenir',
  },
  'upd.standard.name': {
    de: 'Update Standard',
    en: 'Update Standard',
    tr: 'Update Standard',
  },
  'upd.standard.tag': {
    de: 'Neues Gesicht für Ihre Website',
    en: 'A new face for your website',
    tr: 'Web sitenize yeni bir yüz',
  },
  'upd.standard.p1': {
    de: 'Bis zu 5 Seiten neu gestaltet',
    en: 'Up to 5 pages redesigned',
    tr: '5 sayfaya kadar yeniden tasarım',
  },
  'upd.standard.p2': {
    de: 'Schnell und mobil, mit Basis-SEO',
    en: 'Fast and mobile-ready, with basic SEO',
    tr: 'Hızlı ve mobil uyumlu, temel SEO ile',
  },
  'upd.standard.p3': {
    de: 'Google-Unternehmensprofil geprüft und aktualisiert',
    en: 'Google Business Profile checked and updated',
    tr: 'Google İşletme Profili kontrol ve güncelleme',
  },
  'upd.standard.p4': {
    de: 'DSGVO-konforme Einwilligung, zwei Korrekturrunden',
    en: 'GDPR-compliant consent, two rounds of revisions',
    tr: 'GDPR uyumlu onay, iki düzeltme turu',
  },
  'upd.komplett.name': {
    de: 'Update Komplett',
    en: 'Update Complete',
    tr: 'Update Komple',
  },
  'upd.komplett.tag': {
    de: 'Relaunch mit Ortsbezug',
    en: 'Relaunch with a local focus',
    tr: 'Yerel odaklı yenileme',
  },
  'upd.komplett.p1': {
    de: 'Bis zu 10 Seiten plus Ratgeber-Bereich',
    en: 'Up to 10 pages plus a guide section',
    tr: '10 sayfaya kadar ve rehber bölümü',
  },
  'upd.komplett.p2': {
    de: 'Zwei Orts-Landingpages für die lokale Suche',
    en: 'Two local landing pages for local search',
    tr: 'Yerel arama için iki şehir sayfası',
  },
  'upd.komplett.p3': {
    de: 'Google-Profil plus Verzeichniseinträge abgestimmt',
    en: 'Google profile plus directory listings aligned',
    tr: 'Google profili ve rehber kayıtları uyumlu',
  },
  'upd.komplett.p4': {
    de: 'Vier Wochen Nachbetreuung inklusive',
    en: 'Four weeks of aftercare included',
    tr: 'Dört hafta destek dahil',
  },
};
