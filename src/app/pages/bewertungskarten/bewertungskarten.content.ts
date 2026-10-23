import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Bewertungskarten-Seite für Produktformen und Beispiel-Designs.
 * Werden von BewertungskartenComponent registriert und kommen mit dem
 * Lazy-Chunk der Seite.
 */
export const REVIEW_CARDS_CONTENT: Record<string, Entry> = {
  // ---- Produktformen -------------------------------------------------------
  'rc.forms.label': { de: 'Produktformen', en: 'Formats', tr: 'Ürün çeşitleri' },
  'rc.forms.title': {
    de: 'Karte, Aufsteller, Aufkleber<br /><em>oder Schlüsselanhänger</em>.',
    en: 'Card, stand, sticker<br /><em>or keychain</em>.',
    tr: 'Kart, stand, çıkartma<br /><em>veya anahtarlık</em>.',
  },
  'rc.forms.text': {
    de: 'Alle mit NFC-Chip und QR-Code, fertig eingerichtet auf Ihr Google-Profil. Jede Form ist einzeln bestellbar und lässt sich kombinieren.',
    en: 'All with an NFC chip and QR code, set up on your Google profile. Each format can be ordered on its own or combined.',
    tr: 'Hepsi NFC çip ve QR kodlu, Google profilinize göre hazır kurulmuş. Her biri tek başına sipariş edilebilir ve birleştirilebilir.',
  },
  'rc.form.karte.name': { de: 'NFC-Karte', en: 'NFC card', tr: 'NFC kart' },
  'rc.form.karte.text': {
    de: 'Scheckkartengroß — für Tresen, Tisch und Kasse. Passt in jede Schublade.',
    en: 'Credit-card size — for the counter, the table and the till.',
    tr: 'Kredi kartı boyutunda — tezgâh, masa ve kasa için.',
  },
  'rc.form.aufsteller.name': { de: 'Tischaufsteller', en: 'Table stand', tr: 'Masa standı' },
  'rc.form.aufsteller.text': {
    de: 'Acrylaufsteller mit großer Tippfläche — gut sichtbar am Empfang oder auf dem Tisch.',
    en: 'Acrylic stand with a large tap area — clearly visible at reception or on the table.',
    tr: 'Geniş dokunma alanlı akrilik stand — resepsiyonda veya masada net görünür.',
  },
  'rc.form.aufkleber.name': { de: 'NFC-Aufkleber (2 Stück)', en: 'NFC stickers (set of 2)', tr: 'NFC çıkartma (2 adet)' },
  'rc.form.aufkleber.text': {
    de: 'Rund, wetterfest, selbstklebend — für Kasse, Kartenterminal, Tür oder Schaufenster.',
    en: 'Round, weatherproof, self-adhesive — for the till, card terminal, door or shop window.',
    tr: 'Yuvarlak, hava koşullarına dayanıklı, yapışkanlı — kasa, kart okuyucu, kapı veya vitrin için.',
  },
  'rc.form.anhaenger.name': { de: 'Schlüsselanhänger', en: 'Keychain', tr: 'Anahtarlık' },
  'rc.form.anhaenger.text': {
    de: 'Für alle, die zum Kunden fahren: Handwerk, Pflege, Lieferdienst, Außendienst. Nach dem Auftrag kurz hinhalten.',
    en: 'For anyone who goes to the customer: trades, care, delivery, field service. Hold it out after the job.',
    tr: 'Müşteriye gidenler için: ustalar, bakım, teslimat, saha ekipleri. İş bitince kısaca uzatın.',
  },
  'rc.form.unit': { de: 'Einzelpreis', en: 'Single price', tr: 'Birim fiyat' },
  'rc.see': { de: 'Produkte ansehen', en: 'See the products', tr: 'Ürünlere bak' },
  'rc.form.cta': { de: 'Anfragen', en: 'Enquire', tr: 'Talep et' },

  // ---- Beispiel-Designs ----------------------------------------------------
  'rc.ex.label': { de: 'Beispiele', en: 'Examples', tr: 'Örnekler' },
  'rc.ex.title': {
    de: 'So kann Ihre Karte<br /><em>aussehen</em>.',
    en: 'What your card<br /><em>could look like</em>.',
    tr: 'Kartınız<br /><em>böyle görünebilir</em>.',
  },
  'rc.ex.text': {
    de: 'Sechs Beispiel-Designs für verschiedene Branchen. Ihre Karte gestalten wir in Ihren Farben, mit Ihrem Logo und Ihrem eigenen Satz — den Entwurf sehen Sie vor dem Druck.',
    en: 'Six example designs for different industries. We design your card in your colours, with your logo and your own line — you see the draft before it is printed.',
    tr: 'Farklı sektörler için altı örnek tasarım. Kartınızı kendi renklerinizle, logonuzla ve size özel cümleyle tasarlarız — baskıdan önce taslağı görürsünüz.',
  },
  'rc.ex.cafe': { de: 'Café & Bäckerei', en: 'Café & bakery', tr: 'Kafe ve fırın' },
  'rc.ex.salon': { de: 'Friseur & Kosmetik', en: 'Hair & beauty', tr: 'Kuaför ve güzellik' },
  'rc.ex.handwerk': { de: 'Handwerk', en: 'Trades & crafts', tr: 'Zanaat' },
  'rc.ex.praxis': { de: 'Praxis', en: 'Practice', tr: 'Muayenehane' },
  'rc.ex.fewo': { de: 'Ferienwohnung', en: 'Holiday flat', tr: 'Tatil dairesi' },
  'rc.ex.restaurant': { de: 'Restaurant', en: 'Restaurant', tr: 'Restoran' },
  'rc.ex.alt': {
    de: 'Beispiel-Design einer Bewertungskarte:', en: 'Example review card design:', tr: 'Örnek değerlendirme kartı tasarımı:',
  },
  'rc.ex.note': {
    de: 'Die Namen auf den Beispielen sind Platzhalter.',
    en: 'The names on the examples are placeholders.',
    tr: 'Örneklerdeki isimler temsilidir.',
  },
  'rc.shop.cta': { de: 'Online bestellen', en: 'Order online', tr: 'Online sipariş ver' },
};
