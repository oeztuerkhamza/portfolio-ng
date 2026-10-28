import type { Entry } from './translations';

/**
 * Firmenweite Texte, die auf jeder Seite gebraucht werden: Navigation,
 * Aktionen, Footer und die Produktnamen/-texte (Startseite, Leistungen,
 * Footer). Seitentexte der Startseite und der Smart-Home-Seite liegen bei
 * der jeweiligen Seite und kommen erst mit deren Lazy-Chunk.
 *
 * Platzhalter `{p}` steht für einen Preis und wird über `I18nService.tp()`
 * aus den Produktdaten gefüllt — Preise stehen nie in den Übersetzungen.
 */
export const COMPANY_TRANSLATIONS: Record<string, Entry> = {
  'nav.invite': { de: 'Einladungen', en: 'Invitations', tr: 'Davetiyeler' },
  'nav.speisekarte': { de: 'Digitale Speisekarte', en: 'Digital menu', tr: 'Dijital menü' },
  'nav.smarthome': { de: 'Smart Home', en: 'Smart home', tr: 'Akıllı ev' },
  'nav.wartung': {
    de: 'Wartung',
    en: 'Maintenance',
    tr: 'Bakım',
  },
  'wart.banner.title': {
    de: 'Website laufend betreut?',
    en: 'Want your website looked after?',
    tr: 'Web siteniz sürekli bakımda mı?',
  },
  'wart.banner.text': {
    de: 'Hosting, Updates, Backups und kleine Änderungen — ab {p} € im Monat, monatlich kündbar.',
    en: 'Hosting, updates, backups and small changes — from €{p} a month, cancel monthly.',
    tr: 'Barındırma, güncellemeler, yedekler ve küçük değişiklikler — aylık {p} €’dan, her ay iptal edilebilir.',
  },
  'wart.cta.view': {
    de: 'Wartung ansehen',
    en: 'See maintenance plans',
    tr: 'Bakım paketlerini gör',
  },
  'nav.references': { de: 'Referenzen', en: 'References', tr: 'Referanslar' },
  'nav.cta': { de: 'Erstgespräch', en: 'Free consultation', tr: 'Ücretsiz görüşme' },
  'nav.menu': { de: 'Menü', en: 'Menu', tr: 'Menü' },
  'cta.consult': {
    de: 'Kostenloses Erstgespräch', en: 'Free consultation', tr: 'Ücretsiz ön görüşme',
  },
  'cta.products': {
    de: 'Leistungen ansehen',
    en: 'See services',
    tr: 'Hizmetleri gör',
  },
  'cta.call': { de: 'Anrufen', en: 'Call', tr: 'Ara' },
  'cta.whatsapp': { de: 'WhatsApp', en: 'WhatsApp', tr: 'WhatsApp' },
  'cta.request_short': { de: 'Anfrage', en: 'Enquire', tr: 'Talep' },
  'cta.more_about': { de: 'Mehr über uns', en: 'More about us', tr: 'Hakkımızda' },
  'price.from': { de: 'ab {p} €', en: 'from €{p}', tr: '{p} €’dan itibaren' },
  'home.prod.label': {
    de: 'Leistungen',
    en: 'Services',
    tr: 'Hizmetler',
  },
  'home.prod.cards.tag': {
    de: 'Ergänzung',
    en: 'Add-on',
    tr: 'Tamamlayıcı',
  },
  'home.prod.cards.title': {
    de: 'Google-Bewertungskarten', en: 'Google review cards', tr: 'Google değerlendirme kartları',
  },
  'home.prod.cards.text': {
    de: 'Ihr Kunde hält das Handy an die Karte, Ihr Google-Bewertungsformular öffnet sich. Mehr Bewertungen, ohne jedes Mal zu fragen.',
    en: 'Customers hold their phone to the card and your Google review form opens. More reviews without asking every time.',
    tr: 'Müşteriniz telefonunu karta yaklaştırır, Google yorum formunuz açılır. Her seferinde rica etmeden daha fazla yorum.',
  },
  'home.prod.cards.p1': { de: 'NFC-Chip plus QR-Code', en: 'NFC chip plus QR code', tr: 'NFC çip ve QR kod' },
  'home.prod.cards.p2': { de: 'Mit Ihrem Namen oder Logo', en: 'With your name or logo', tr: 'Adınız veya logonuzla' },
  'home.prod.cards.p3': { de: 'Für iPhone und Android', en: 'Works on iPhone and Android', tr: 'iPhone ve Android ile çalışır' },
  'home.prod.cards.cta': { de: 'Pakete & Preise', en: 'Packages & prices', tr: 'Paketler ve fiyatlar' },
  'home.prod.cards.alt': {
    de: 'NFC-Bewertungskarte mit QR-Code auf einem Holztresen, daneben ein Smartphone mit geöffnetem Bewertungsformular',
    en: 'NFC review card with a QR code on a wooden counter, next to a smartphone showing the review form',
    tr: 'Ahşap tezgâhta QR kodlu NFC değerlendirme kartı ve yanında yorum formu açık bir akıllı telefon',
  },
  'home.prod.web.tag': { de: 'Neukunden gewinnen', en: 'Win new customers', tr: 'Yeni müşteri kazanın' },
  'home.prod.web.title': {
    de: 'Webdesign & Webentwicklung',
    en: 'Web design & development',
    tr: 'Web tasarım ve geliştirme',
  },
  'home.prod.web.text': {
    de: 'Individuell entwickelte Websites, Online-Shops und Web-Apps: schnell auf dem Handy, bei Google lokal auffindbar und gebaut, um aus Besuchern Anfragen zu machen — Design, Programmierung, SEO und Hosting aus einer Hand.',
    en: 'Custom-built websites, online shops and web apps: fast on mobile, found locally on Google and built to turn visitors into enquiries — design, development, SEO and hosting from one source.',
    tr: 'Özel geliştirilen web siteleri, online mağazalar ve web uygulamaları: mobilde hızlı, Google’da yerel olarak bulunur ve ziyaretçileri talebe dönüştürmek için kurulur — tasarım, programlama, SEO ve barındırma tek elden.',
  },
  'home.prod.web.p1': { de: 'Für das Handy gebaut, schnell geladen', en: 'Built for mobile, fast to load', tr: 'Mobil için tasarlanmış, hızlı' },
  'home.prod.web.p2': { de: 'Lokal auffindbar bei Google', en: 'Found locally on Google', tr: 'Google’da yerel olarak bulunur' },
  'home.prod.web.p3': {
    de: 'Individuell entwickelt, kein Baukasten',
    en: 'Custom-built, no page builder',
    tr: 'Özel geliştirilir, hazır şablon değil',
  },
  'home.prod.web.cta': { de: 'Leistungen ansehen', en: 'View services', tr: 'Hizmetleri gör' },
  'home.prod.web.alt': {
    de: 'Kundenwebsite von Zerin Gold auf einem Laptop und die mobile Website von GKN Bewerbungsfoto auf einem Smartphone',
    en: 'Client website for Zerin Gold on a laptop and the mobile site of GKN Bewerbungsfoto on a smartphone',
    tr: 'Dizüstü bilgisayarda müşterimiz Zerin Gold’un sitesi, akıllı telefonda GKN Bewerbungsfoto’nun mobil sitesi',
  },
  'home.prod.sh.tag': { de: 'Neu', en: 'New', tr: 'Yeni' },
  'home.prod.sh.title': {
    de: 'Smart Home & Automatisierung', en: 'Smart home & automation', tr: 'Akıllı ev ve otomasyon',
  },
  'home.prod.sh.text': {
    de: 'Heizung nach Öffnungszeiten, Licht nach Plan, Türcode für Gäste: Laden, Praxis oder Ferienwohnung steuern sich selbst — lokal und ohne neue Kabel.',
    en: 'Heating by opening hours, lighting on schedule, door codes for guests: shops, practices and holiday flats run themselves — locally and without rewiring.',
    tr: 'Açılış saatlerine göre ısıtma, programlı aydınlatma, misafirler için kapı kodu: dükkân, muayenehane veya tatil dairesi kendi kendini yönetir — yerel ve yeni kablo çekmeden.',
  },
  'home.prod.sh.p1': { de: 'Heizkosten senken', en: 'Cut heating costs', tr: 'Isıtma masrafını düşürün' },
  'home.prod.sh.p2': { de: 'Self-Check-in per Türcode', en: 'Self check-in with door codes', tr: 'Kapı koduyla kendi kendine giriş' },
  'home.prod.sh.p3': { de: 'Eine App statt fünf', en: 'One app instead of five', tr: 'Beş yerine tek uygulama' },
  'home.prod.sh.cta': { de: 'Smart Home entdecken', en: 'Explore smart home', tr: 'Akıllı evi keşfet' },
  'home.prod.sh.alt': {
    de: 'Smartphone mit Smart-Home-App, daneben Thermostat, Türschloss-Tastatur, Zwischenstecker und Sensoren',
    en: 'Smartphone with a smart-home app next to a thermostat, a door-lock keypad, a smart plug and sensors',
    tr: 'Akıllı ev uygulaması açık telefon; yanında termostat, kapı kilidi tuş takımı, akıllı priz ve sensörler',
  },
  'footer.col.products': { de: 'Produkte', en: 'Products', tr: 'Ürünler' },
  'footer.col.company': { de: 'Unternehmen', en: 'Company', tr: 'Şirket' },
};
