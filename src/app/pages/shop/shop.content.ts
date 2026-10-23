import type { Entry } from '../../core/i18n/translations';

/** Texte für /bestellen und /bestellen/danke. */
export const SHOP_CONTENT: Record<string, Entry> = {
  'shop.label': { de: 'Online-Bestellung', en: 'Order online', tr: 'Online sipariş' },
  'shop.title': {
    de: 'Bewertungskarten<br /><em>online bestellen</em>.',
    en: 'Order review cards<br /><em>online</em>.',
    tr: 'Değerlendirme kartlarını<br /><em>online sipariş edin</em>.',
  },
  'shop.intro': {
    de: 'Menge wählen, bezahlen, fertig. Wir richten jede Karte auf Ihr Google-Profil ein und melden uns vor dem Druck.',
    en: 'Choose the quantity, pay, done. We set every card up for your Google profile and get in touch before printing.',
    tr: 'Adedi seçin, ödeyin, bu kadar. Her kartı Google profilinize göre ayarlar, baskıdan önce sizinle iletişime geçeriz.',
  },
  'shop.soon.title': { de: 'Online-Bestellung folgt in Kürze.', en: 'Online ordering is coming soon.', tr: 'Online sipariş yakında.' },
  'shop.soon.text': {
    de: 'Bis dahin bestellen Sie ganz einfach per Anfrage — wir melden uns innerhalb eines Werktags.',
    en: 'Until then, simply order via an enquiry — we reply within one working day.',
    tr: 'O zamana kadar talep formuyla kolayca sipariş verebilirsiniz — bir iş günü içinde dönüş yaparız.',
  },
  'shop.forms': { de: 'Einzeln', en: 'Single items', tr: 'Tek tek' },
  'shop.packages': { de: 'Pakete', en: 'Bundles', tr: 'Paketler' },
  'shop.cards': { de: 'Eigene NFC-Karten', en: 'Your own NFC cards', tr: 'Kendi NFC kartlarınız' },
  'shop.cards.note': {
    de: 'Karte mit eigener Seite auf unserer Domain — kein fremder Anbieter, kein Abo. Nach der Bestellung richten wir den Inhalt mit Ihnen ein: Logo, Kontaktdaten und Links, bei der Geschenkkarte Fotos und ein Lied.',
    en: 'A card with its own page on our domain — no third-party provider, no subscription. After ordering we set the content up with you: logo, contact details and links; for the gift card, photos and a song.',
    tr: 'Kendi alan adımızda kendi sayfası olan kart — üçüncü firma yok, abonelik yok. Siparişten sonra içeriği sizinle kuruyoruz: logo, iletişim bilgileri ve linkler; hediye kartında fotoğraflar ve bir şarkı.',
  },
  'shop.minus': { de: 'Weniger', en: 'Fewer', tr: 'Azalt' },
  'shop.plus': { de: 'Mehr', en: 'More', tr: 'Artır' },
  'shop.details': { de: 'Für die Einrichtung', en: 'For the setup', tr: 'Kurulum için' },
  'shop.business': { de: 'Name des Betriebs (steht auf der Karte)', en: 'Business name (printed on the card)', tr: 'İşletme adı (kartta yazacak)' },
  'shop.google': { de: 'Link zu Ihrem Google-Profil (falls vorhanden)', en: 'Link to your Google profile (if you have one)', tr: 'Google profil linkiniz (varsa)' },
  'shop.total': { de: 'Gesamt', en: 'Total', tr: 'Toplam' },
  'shop.shipping': { de: 'Versand', en: 'Shipping', tr: 'Kargo' },
  'shop.shipping.free': { de: 'Versand innerhalb Deutschlands inklusive', en: 'Shipping within Germany included', tr: 'Almanya içi kargo dahil' },
  'shop.vat': {
    de: 'Endpreise. Als Kleinunternehmer nach § 19 UStG wird keine Umsatzsteuer berechnet.',
    en: 'Final prices. As a small business under § 19 UStG, no VAT is charged.',
    tr: 'Nihai fiyatlar. § 19 UStG kapsamında küçük işletme olarak KDV alınmaz.',
  },
  'shop.cart': { de: 'Warenkorb', en: 'Cart', tr: 'Sepet' },
  'shop.cart.add': { de: 'In den Warenkorb', en: 'Add to cart', tr: 'Sepete ekle' },
  'shop.cart.empty': {
    de: 'Ihr Warenkorb ist noch leer. Wählen Sie links eine Karte oder ein Paket.',
    en: 'Your cart is still empty. Pick a card or a bundle on the left.',
    tr: 'Sepetiniz henüz boş. Soldan bir kart ya da paket seçin.',
  },
  'shop.cart.clear': { de: 'Leeren', en: 'Clear', tr: 'Boşalt' },
  'shop.cart.remove': { de: 'Entfernen', en: 'Remove', tr: 'Çıkar' },
  'shop.cart.each': { de: 'je Stück', en: 'each', tr: 'adet' },
  'shop.legal.consent': {
    de: 'Ich habe die AGB und die Widerrufsbelehrung gelesen und akzeptiere sie.',
    en: 'I have read and accept the terms and the withdrawal policy.',
    tr: 'Satış koşullarını ve cayma hakkı bilgilendirmesini okudum ve kabul ediyorum.',
  },
  'shop.legal.delivery': {
    de: 'Lieferzeit: 5–10 Werktage nach Ihrer Freigabe. Versand nur innerhalb Deutschlands.',
    en: 'Delivery: 5–10 working days after your approval. Shipping within Germany only.',
    tr: 'Teslim süresi: onayınızdan sonra 5–10 iş günü. Kargo yalnızca Almanya içi.',
  },
  'shop.legal.custom': {
    de: 'Die Karten werden für Sie personalisiert. Den Entwurf erhalten Sie vorab per E-Mail — bis zu Ihrer Freigabe können Sie kostenlos stornieren. Mit der Freigabe beginnt die Herstellung; danach besteht nach § 312g Abs. 2 Nr. 1 BGB kein Widerrufsrecht.',
    en: 'The cards are personalised for you. You receive the draft by email beforehand — you can cancel free of charge until you approve it. Approval starts production; after that there is no right of withdrawal (§ 312g(2) no. 1 BGB).',
    tr: 'Kartlar size özel hazırlanır. Taslağı önceden e-postayla alırsınız — onaylayana kadar ücretsiz iptal edebilirsiniz. Onayla üretim başlar; sonrasında cayma hakkı bulunmaz (§ 312g Abs. 2 Nr. 1 BGB).',
  },
  'shop.legal.langnote': {
    de: 'Die Rechtstexte liegen auf Deutsch vor.',
    en: 'The legal texts are provided in German.',
    tr: 'Yasal metinler Almanca olarak sunulur.',
  },
  'shop.submit': { de: 'Zahlungspflichtig bestellen', en: 'Order and pay', tr: 'Siparişi ver ve öde' },
  'shop.pay': {
    de: 'Sie werden zur sicheren Bezahlung bei Stripe weitergeleitet.',
    en: 'You will be taken to secure payment with Stripe.',
    tr: 'Güvenli ödeme için Stripe’a yönlendirileceksiniz.',
  },
  'shop.empty': { de: 'Bitte wählen Sie mindestens ein Produkt.', en: 'Please choose at least one product.', tr: 'Lütfen en az bir ürün seçin.' },
  'shop.error': {
    de: 'Die Bestellung konnte nicht gestartet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns.',
    en: 'The order could not be started. Please try again or write to us.',
    tr: 'Sipariş başlatılamadı. Lütfen tekrar deneyin veya bize yazın.',
  },
  'shop.thanks.title': { de: 'Danke für Ihre Bestellung!', en: 'Thank you for your order!', tr: 'Siparişiniz için teşekkürler!' },
  'shop.thanks.text': {
    de: 'Die Bestätigung kommt per E-Mail. Wir richten Ihre Karten ein und melden uns vor dem Druck mit dem Entwurf.',
    en: 'Your confirmation is on its way by email. We set up your cards and send you the draft before printing.',
    tr: 'Onay e-postayla gelecek. Kartlarınızı hazırlar, baskıdan önce taslağı size göndeririz.',
  },
  'shop.thanks.back': { de: 'Zur Startseite', en: 'Back to home', tr: 'Ana sayfaya dön' },
  'seo.shop.title': {
    de: 'Bewertungskarten online bestellen | Breisgau Digital',
    en: 'Order review cards online | Breisgau Digital',
    tr: 'Değerlendirme kartlarını online sipariş edin | Breisgau Digital',
  },
};
