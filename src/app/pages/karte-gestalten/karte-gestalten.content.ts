import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Kartengestalters: /karte-gestalten/<produkt>.
 *
 * Bis hierher füllte der Kunde nach der Bestellung ein E-Mail-Formular aus und
 * sah seine Karte zum ersten Mal, als sie fertig war. Der Gestalter dreht das
 * um: erst sehen, dann bestellen.
 *
 * `cg.` ist der gemeinsame Teil, `cg.f.` sind Feldbeschriftungen. Die Texte
 * der Vorschau (`cg.preview.*`) gehören dem Baustein, der sie zeigt.
 *
 * Preise stehen hier nicht: die kommen aus dem Katalog.
 */
export const CARD_DESIGNER_CONTENT: Record<string, Entry> = {
  // ── Rahmen ────────────────────────────────────────────────
  'cg.label': { de: 'Karte gestalten', en: 'Design your card', tr: 'Kartı tasarla' },
  'cg.business.title': { de: 'Ihre digitale Visitenkarte, jetzt schon sichtbar', en: 'Your digital business card, visible right now', tr: 'Dijital kartvizitiniz, şimdiden görünür' },
  'cg.gift.title': { de: 'Ihre Geschenkkarte, jetzt schon sichtbar', en: 'Your gift card, visible right now', tr: 'Hediye kartınız, şimdiden görünür' },
  'cg.intro': {
    de: 'Füllen Sie aus, was auf die Karte soll — daneben sehen Sie sofort, wie die fertige Seite aussieht. Erst danach bestellen Sie. Ihre Eingaben fahren mit der Bestellung mit; wir müssen nichts mehr nachfragen.',
    en: 'Fill in what goes on the card — next to it you see the finished page straight away. You order only afterwards. What you entered travels with the order, so we have nothing left to ask.',
    tr: 'Kartta ne yazacaksa doldurun — yanında bitmiş sayfanın nasıl göründüğünü anında görürsünüz. Sipariş ise sonra. Girdikleriniz siparişle birlikte bize ulaşır; ayrıca bir şey sormamıza gerek kalmaz.',
  },
  'cg.back': { de: 'Zurück zum Produkt', en: 'Back to the product', tr: 'Ürüne dön' },

  // Die Texte der Vorschau stehen bei der Vorschau selbst
  // (src/app/shared/card-preview/card-preview.content.ts) — sie meldet sie an.

  // ── Umschalter über der Vorschau ──────────────────────────
  // Diese drei gehören hierher und nicht zu den zwei Vorschauen: gezeichnet
  // werden die Knöpfe vom Gestalter, und zwar bevor die Vorschau dahinter
  // überhaupt besteht. Stünden sie dort, zeigte der Knopf beim ersten Bild
  // seinen eigenen Schlüssel.
  'cg.view.label': { de: 'Ansicht', en: 'View', tr: 'Görünüm' },
  'cg.view.screen': { de: 'Am Telefon', en: 'On the phone', tr: 'Telefonda' },
  'cg.view.print': { de: 'Gedruckt', en: 'Printed', tr: 'Basılmış' },

  // ── Abschnitte des Bogens ─────────────────────────────────
  'cg.sec.basics': { de: 'Das Wichtigste', en: 'The essentials', tr: 'En önemlisi' },
  'cg.sec.contact': { de: 'Kontakt', en: 'Contact', tr: 'İletişim' },
  'cg.sec.links': { de: 'Links', en: 'Links', tr: 'Bağlantılar' },
  'cg.sec.photos': { de: 'Bilder', en: 'Photos', tr: 'Fotoğraflar' },
  'cg.sec.extras': { de: 'Zugabe', en: 'Extras', tr: 'Ekstra' },
  'cg.sec.look': { de: 'Aussehen', en: 'Look', tr: 'Görünüm' },

  // ── Farbschema ────────────────────────────────────────────
  'cg.theme.brand': { de: 'Hell', en: 'Light', tr: 'Açık' },
  'cg.theme.dark': { de: 'Dunkel', en: 'Dark', tr: 'Koyu' },
  'cg.theme.warm': { de: 'Warm', en: 'Warm', tr: 'Sıcak' },

  // ── Felder der Visitenkarte ───────────────────────────────
  'cg.f.company': { de: 'Name des Betriebs', en: 'Business name', tr: 'İşletme adı' },
  'cg.f.tagline': { de: 'Zeile darunter', en: 'Line underneath', tr: 'Altındaki satır' },
  'cg.f.logo': { de: 'Logo', en: 'Logo', tr: 'Logo' },
  'cg.f.avatar': { de: 'Portrait', en: 'Portrait', tr: 'Portre' },
  'cg.f.phone': { de: 'Telefon', en: 'Phone', tr: 'Telefon' },
  'cg.f.email': { de: 'E-Mail', en: 'E-mail', tr: 'E-posta' },
  'cg.f.web': { de: 'Website', en: 'Website', tr: 'Web sitesi' },
  'cg.f.address': { de: 'Adresse', en: 'Address', tr: 'Adres' },
  'cg.f.leads': { de: 'Kontaktbogen auf der Karte zeigen', en: 'Show the contact form on the card', tr: 'Kartta iletişim formu göster' },
  'cg.f.leads.hint': {
    de: 'Ihr Gegenüber kann seine eigenen Daten dalassen. Sie bekommen sie im Portal — wir speichern sie sechs Monate.',
    en: 'The person you meet can leave their own details. You get them in the portal; we keep them for six months.',
    tr: 'Karşınızdaki kişi kendi bilgilerini bırakabilir. Portalda size gelir; altı ay saklıyoruz.',
  },

  // ── Felder der Geschenkkarte ──────────────────────────────
  'cg.f.headline': { de: 'Überschrift', en: 'Headline', tr: 'Başlık' },
  'cg.f.to': { de: 'Für', en: 'To', tr: 'Kime' },
  'cg.f.from': { de: 'Von', en: 'From', tr: 'Kimden' },
  'cg.f.message': { de: 'Ihre Zeilen', en: 'Your message', tr: 'Mesajınız' },
  'cg.f.songUrl': { de: 'Lied (Adresse)', en: 'Song (address)', tr: 'Şarkı (adres)' },
  'cg.f.songLabel': { de: 'Name des Liedes', en: 'Song title', tr: 'Şarkının adı' },

  // ── Listen ────────────────────────────────────────────────
  'cg.link.add': { de: 'Link hinzufügen', en: 'Add a link', tr: 'Bağlantı ekle' },
  'cg.link.net': { de: 'Netzwerk', en: 'Network', tr: 'Ağ' },
  'cg.link.own': { de: 'Eigener Link', en: 'Own link', tr: 'Kendi bağlantım' },
  'cg.link.label': { de: 'Beschriftung', en: 'Label', tr: 'Etiket' },
  'cg.link.url': { de: 'Adresse', en: 'Address', tr: 'Adres' },
  'cg.link.none': { de: 'Noch kein Link.', en: 'No link yet.', tr: 'Henüz bağlantı yok.' },
  'cg.photo.add': { de: 'Bild hinzufügen', en: 'Add a photo', tr: 'Fotoğraf ekle' },
  'cg.photo.n': { de: 'Bild', en: 'Photo', tr: 'Fotoğraf' },
  'cg.photo.none': { de: 'Noch kein Bild.', en: 'No photo yet.', tr: 'Henüz fotoğraf yok.' },
  'cg.remove': { de: 'Entfernen', en: 'Remove', tr: 'Kaldır' },

  // ── Hinweise ──────────────────────────────────────────────
  'cg.hint.img': {
    de: 'JPG, PNG, WebP, GIF oder AVIF, bis 5 MB. Das Bild liegt danach auf unserem Server; bestellen Sie nicht, wird es nach zwei Wochen wieder gelöscht.',
    en: 'JPG, PNG, WebP, GIF or AVIF, up to 5 MB. The image then sits on our server; without an order it is deleted after two weeks.',
    tr: 'JPG, PNG, WebP, GIF veya AVIF, en fazla 5 MB. Görsel sonrasında sunucumuzda durur; sipariş vermezseniz iki hafta sonra silinir.',
  },
  'cg.hint.saved': {
    de: 'Ihr Entwurf bleibt in diesem Browser gespeichert, bis Sie bestellen. Auf unseren Server kommt er erst mit der Bestellung.',
    en: 'Your draft stays saved in this browser until you order. It only reaches our server with the order.',
    tr: 'Taslağınız siparişe kadar bu tarayıcıda kalır. Sunucumuza ancak siparişle birlikte ulaşır.',
  },
  'cg.hint.later': {
    de: 'Sie können alles auch nach der Bestellung noch ändern — bis zur Freigabe.',
    en: 'You can still change everything after ordering, right up to sign-off.',
    tr: 'Siparişten sonra da her şeyi değiştirebilirsiniz — onaya kadar.',
  },

  // ── Knöpfe ────────────────────────────────────────────────
  'cg.toCart': { de: 'Zur Bestellung', en: 'To the order', tr: 'Siparişe git' },
  'cg.reset': { de: 'Entwurf leeren', en: 'Clear the draft', tr: 'Taslağı temizle' },
  'cg.design': { de: 'Karte selbst gestalten', en: 'Design the card yourself', tr: 'Kartı kendin tasarla' },
  'cg.design.d': {
    de: 'Sehen Sie Ihre Karte, bevor Sie bestellen — dauert zwei Minuten.',
    en: 'See your card before you order — it takes two minutes.',
    tr: 'Sipariş vermeden önce kartınızı görün — iki dakika sürer.',
  },

  // ── SEO ───────────────────────────────────────────────────
  'seo.cg.business.title': { de: 'Digitale Visitenkarte selbst gestalten · Breisgau Digital', en: 'Design your digital business card · Breisgau Digital', tr: 'Dijital kartviziti kendin tasarla · Breisgau Digital' },
  'seo.cg.gift.title': { de: 'Geschenkkarte selbst gestalten · Breisgau Digital', en: 'Design your gift card · Breisgau Digital', tr: 'Hediye kartını kendin tasarla · Breisgau Digital' },
};
