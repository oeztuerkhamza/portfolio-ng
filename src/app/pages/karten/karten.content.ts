import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der zwei Seiten für die eigenen NFC-Karten:
 * /digitale-visitenkarte und /geschenkkarte.
 *
 * Bis hierher waren die beiden Produkte nur zwei Zeilen in der Bestellliste —
 * bestellbar, aber nirgends erklärt und für Google unsichtbar. Diese Texte
 * sind die Seiten dazu.
 *
 * Preise stehen nirgends im Text: die kommen aus dem Katalog
 * (src/app/core/data/catalog.ts) und werden im Portal gepflegt.
 *
 * `kt.` ist der gemeinsame Teil, `kt.business.` und `kt.gift.` das, was je
 * Produkt verschieden ist.
 */
export const CARDS_CONTENT: Record<string, Entry> = {
  // ── Gemeinsames Gerüst ────────────────────────────────────
  'kt.label': { de: 'Eigene NFC-Karten', en: 'Your own NFC cards', tr: 'Kendi NFC kartlarınız' },
  'kt.how': { de: 'So läuft es', en: 'How it works', tr: 'Nasıl oluyor' },
  'kt.step1.t': { de: 'Bestellen', en: 'Order', tr: 'Sipariş' },
  'kt.step1.d': {
    de: 'Sie legen die Karte in den Warenkorb und bezahlen online. Mehr brauchen wir zum Anfangen nicht.',
    en: 'You add the card to the cart and pay online. Nothing else is needed to get started.',
    tr: 'Kartı sepete ekleyip online ödersiniz. Başlamak için fazlası gerekmiyor.',
  },
  'kt.step2.t': { de: 'Inhalte schicken', en: 'Send the content', tr: 'İçeriği gönderin' },
  'kt.step2.d': {
    de: 'Nach der Bestellung kommt eine E-Mail, die genau auflistet, was wir brauchen. Antworten genügt — Sie müssen nichts ausfüllen.',
    en: 'After ordering you get an e-mail listing exactly what we need. A reply is enough — no form to fill in.',
    tr: 'Siparişten sonra neye ihtiyacımız olduğunu tek tek yazan bir e-posta gelir. Cevap vermeniz yeterli, form doldurmanız gerekmez.',
  },
  'kt.step3.t': { de: 'Wir richten die Seite ein', en: 'We set the page up', tr: 'Sayfayı biz kuruyoruz' },
  'kt.step3.d': {
    de: 'Sie bekommen die Adresse Ihrer Seite zur Freigabe. Bis dahin können Sie kostenlos stornieren; erst mit der Freigabe beginnt die Herstellung.',
    en: 'You get the address of your page to approve. Until then you can cancel free of charge; production starts only once you approve.',
    tr: 'Sayfanızın adresi onayınıza gelir. O ana kadar ücretsiz iptal edebilirsiniz; üretim ancak onaydan sonra başlar.',
  },
  'kt.step4.t': { de: 'Die Karte kommt', en: 'The card arrives', tr: 'Kart gelir' },
  'kt.step4.d': {
    de: 'Wir programmieren den Chip und schicken die Karte per Post. Ändert sich später etwas, ändern wir die Seite — die Karte bleibt dieselbe.',
    en: 'We program the chip and send the card by post. If something changes later we change the page — the card stays the same.',
    tr: 'Çipi programlayıp kartı postayla gönderiyoruz. Sonradan bir şey değişirse sayfayı değiştiririz — kart aynı kalır.',
  },

  'kt.own.t': { de: 'Auf unserem eigenen System', en: 'On our own system', tr: 'Kendi sistemimizde' },
  'kt.own.d': {
    de: 'Die Seite Ihrer Karte liegt auf unserer Adresse, nicht bei einem fremden Anbieter. Kein Abo, keine laufenden Kosten, keine Weitergabe Ihrer Daten — und niemand, der die Seite abschalten kann, wenn er seinen Dienst einstellt.',
    en: 'Your card’s page lives on our own address, not with a third-party provider. No subscription, no running costs, no passing on your data — and nobody who can switch the page off by shutting down their service.',
    tr: 'Kartınızın sayfası bizim adresimizde duruyor, yabancı bir sağlayıcıda değil. Abonelik yok, aylık ödeme yok, verilerinizin paylaşımı yok — ve hizmetini kapatınca sayfanızı kapatacak kimse yok.',
  },

  'kt.other.business': { de: 'Auch als Geschenkkarte', en: 'Also as a gift card', tr: 'Hediye kartı olarak da var' },
  'kt.other.gift': { de: 'Auch als digitale Visitenkarte', en: 'Also as a digital business card', tr: 'Dijital kartvizit olarak da var' },
  'kt.review': {
    de: 'Sie möchten statt einer eigenen Seite Google-Bewertungen sammeln? Dafür gibt es die Bewertungskarten.',
    en: 'Want to collect Google reviews instead of having your own page? That’s what the review cards are for.',
    tr: 'Kendi sayfanız yerine Google değerlendirmesi toplamak mı istiyorsunuz? Onun için değerlendirme kartları var.',
  },

  // ── Digitale Visitenkarte ─────────────────────────────────
  'kt.business.title': {
    de: 'Eine Visitenkarte,<br /><em>die aktuell bleibt</em>.',
    en: 'A business card<br /><em>that stays current</em>.',
    tr: 'Hep güncel kalan<br /><em>bir kartvizit</em>.',
  },
  'kt.business.intro': {
    de: 'Der Gast hält sein Handy an die Karte, und Ihre Seite öffnet sich: Telefon, E-Mail, Adresse, Ihre Links. Ein Tippen speichert Sie in seinen Kontakten. Keine App, kein Abo — und wenn sich eine Nummer ändert, ändern wir die Seite, nicht die Karte.',
    en: 'Your contact holds their phone against the card and your page opens: phone, e-mail, address, your links. One tap saves you into their contacts. No app, no subscription — and if a number changes we change the page, not the card.',
    tr: 'Karşınızdaki telefonunu karta yaklaştırıyor ve sayfanız açılıyor: telefon, e-posta, adres, linkleriniz. Bir dokunuşla rehberine kaydediliyorsunuz. Uygulama yok, abonelik yok — numara değişirse kartı değil sayfayı değiştiriyoruz.',
  },
  'kt.business.long': {
    de: 'Gedacht für alle, die ihre Karte häufig weitergeben und deren Angaben sich ändern: Handwerk, Beratung, Immobilien, Vertrieb, Pflege. Eine gedruckte Karte mit falscher Nummer wandert in den Müll, und der Kontakt ist weg; eine Seite, die wir für Sie aktuell halten, bleibt richtig. Dazu kommt, was Papier nicht kann: der Gast speichert Sie mit einem Tippen, ruft direkt an, öffnet die Navigation zu Ihrer Adresse oder folgt Ihnen auf Instagram — ohne etwas abzutippen. Und wenn Sie es möchten, kann er auch seine eigenen Daten dalassen, damit Sie sich melden können.',
    en: 'Meant for people who hand their card out often and whose details change: trades, consulting, property, sales, care. A printed card with the wrong number goes in the bin and the contact is lost; a page we keep current stays right. On top of that comes what paper cannot do: your contact saves you with one tap, calls straight away, opens navigation to your address or follows you on Instagram — without typing anything. And if you want, they can leave their own details so you can get back to them.',
    tr: 'Kartını sık veren ve bilgileri değişen herkes için: ustalar, danışmanlık, emlak, satış, bakım. Yanlış numaralı basılı kart çöpe gider ve o kişiyi kaybedersiniz; bizim güncel tuttuğumuz sayfa doğru kalır. Üstüne kâğıdın yapamadığı şeyler gelir: karşınızdaki tek dokunuşla sizi kaydeder, doğrudan arar, adresinize navigasyon açar ya da Instagram’da takip eder — hiçbir şey yazmadan. İsterseniz kendi bilgilerini de bırakabilir, siz dönersiniz.',
  },
  'kt.business.onit': { de: 'Was auf der Karte steht', en: 'What is on the card', tr: 'Kartta neler var' },
  'kt.business.p1': {
    de: 'Logo oder Portrait, Ihr Name und eine Zeile darunter',
    en: 'Logo or portrait, your name and a line beneath it',
    tr: 'Logo veya portre, adınız ve altında bir satır',
  },
  'kt.business.p2': {
    de: 'Telefon, E-Mail, Adresse und Website — alles antippbar, die Adresse öffnet die Karte',
    en: 'Phone, e-mail, address and website — all tappable, the address opens the map',
    tr: 'Telefon, e-posta, adres ve web — hepsi dokunulabilir, adres haritayı açar',
  },
  'kt.business.p3': {
    de: 'Ihre Links: Instagram, WhatsApp, LinkedIn, Spotify, YouTube und mehr',
    en: 'Your links: Instagram, WhatsApp, LinkedIn, Spotify, YouTube and more',
    tr: 'Linkleriniz: Instagram, WhatsApp, LinkedIn, Spotify, YouTube ve daha fazlası',
  },
  'kt.business.p4': {
    de: '„Zu Kontakten hinzufügen" — ein Tippen, und Sie stehen im Adressbuch',
    en: '“Save to contacts” — one tap and you are in the address book',
    tr: '“Rehbere kaydet” — bir dokunuş ve rehberdesiniz',
  },
  'kt.business.p5': {
    de: 'Auf Wunsch ein Kontaktbogen: der Gast lässt seine Daten bei Ihnen, Sie sehen sie im Portal',
    en: 'Optionally a contact form: the visitor leaves their details and you see them in the portal',
    tr: 'İsteğe bağlı bilgi formu: ziyaretçi bilgilerini bırakır, siz panelde görürsünüz',
  },
  'kt.business.p6': {
    de: 'Die Sprache der Karte: Deutsch, Französisch, Englisch, Türkisch oder Kurdisch',
    en: 'The card’s language: German, French, English, Turkish or Kurdish',
    tr: 'Kartın dili: Almanca, Fransızca, İngilizce, Türkçe ya da Kürtçe',
  },

  // ── Geschenkkarte ─────────────────────────────────────────
  'kt.gift.title': {
    de: 'Eine Karte,<br /><em>die eine Seite erzählt</em>.',
    en: 'A card<br /><em>that tells a page</em>.',
    tr: 'Bir sayfa anlatan<br /><em>bir kart</em>.',
  },
  'kt.gift.intro': {
    de: 'Zum Geburtstag, zur Hochzeit, zum Abschied: die Karte in der Hand, das Handy daran — und es öffnet sich eine Seite mit Ihren Fotos, Ihrem Text und dem Lied, das dazugehört.',
    en: 'For a birthday, a wedding, a farewell: the card in hand, the phone against it — and a page opens with your photos, your words and the song that belongs to it.',
    tr: 'Doğum günü, düğün, veda: kart elde, telefon yaklaşıyor — ve fotoğraflarınız, yazdıklarınız ve ona ait şarkının olduğu bir sayfa açılıyor.',
  },
  'kt.gift.long': {
    de: 'Ein Geschenk, das man behält, weil es nicht aufgebraucht wird: die Karte bleibt im Portemonnaie, und die Seite dahinter bleibt, solange sie soll. Sie schicken uns die Fotos, den Text und den Link zu einem Lied; wir bauen daraus eine Seite, die auf jedem Handy sofort lädt — ohne App, ohne Anmeldung, ohne Werbung. Wer die Karte antippt, sieht genau das, was Sie geschrieben haben, und niemand sonst bekommt die Adresse, denn die Seite steht in keiner Suchmaschine.',
    en: 'A present you keep because it does not get used up: the card stays in the wallet and the page behind it stays as long as it should. You send us the photos, the text and a link to a song; we make a page from it that loads at once on any phone — no app, no sign-up, no advertising. Whoever taps the card sees exactly what you wrote, and nobody else gets the address, because the page is in no search engine.',
    tr: 'Tükenmediği için saklanan bir hediye: kart cüzdanda kalır, arkasındaki sayfa da gerektiği kadar. Fotoğrafları, yazıyı ve bir şarkının linkini bize gönderirsiniz; biz bundan her telefonda anında açılan bir sayfa yaparız — uygulama yok, kayıt yok, reklam yok. Kartı okutan tam olarak sizin yazdığınızı görür; adresi başka kimse bulamaz, çünkü sayfa hiçbir arama motorunda yer almaz.',
  },
  'kt.gift.onit': { de: 'Was die Seite zeigt', en: 'What the page shows', tr: 'Sayfada neler var' },
  'kt.gift.p1': {
    de: 'Eine Überschrift, für wen und von wem',
    en: 'A headline, for whom and from whom',
    tr: 'Bir başlık, kime ve kimden',
  },
  'kt.gift.p2': {
    de: 'Ihr Text, so lang wie Sie möchten — Zeilenumbrüche bleiben erhalten',
    en: 'Your text, as long as you like — line breaks are kept',
    tr: 'İstediğiniz kadar uzun metniniz — satır sonları korunur',
  },
  'kt.gift.p3': {
    de: 'Bis zu acht Fotos, in der Reihenfolge, die Sie festlegen',
    en: 'Up to eight photos, in the order you choose',
    tr: 'Sekize kadar fotoğraf, sizin belirlediğiniz sırada',
  },
  'kt.gift.p4': {
    de: 'Der Link zu einem Lied — Spotify, YouTube, Apple Music',
    en: 'A link to a song — Spotify, YouTube, Apple Music',
    tr: 'Bir şarkının linki — Spotify, YouTube, Apple Music',
  },
  'kt.gift.p5': {
    de: 'Drei Gestaltungen: hell, dunkel oder warm',
    en: 'Three looks: light, dark or warm',
    tr: 'Üç tasarım: açık, koyu ya da sıcak',
  },
  'kt.gift.p6': {
    de: 'Nicht in Suchmaschinen — die Seite findet nur, wer die Karte hat',
    en: 'Not in search engines — only whoever holds the card finds the page',
    tr: 'Arama motorlarında yok — sayfayı sadece kartı olan bulur',
  },

  // ── SEO ───────────────────────────────────────────────────
  'seo.kt.business.title': {
    de: 'Digitale Visitenkarte mit NFC — Breisgau Digital Freiburg',
    en: 'Digital business card with NFC — Breisgau Digital Freiburg',
    tr: 'NFC’li dijital kartvizit — Breisgau Digital Freiburg',
  },
  'seo.kt.gift.title': {
    de: 'NFC-Geschenkkarte mit Fotos und Musik — Breisgau Digital',
    en: 'NFC gift card with photos and music — Breisgau Digital',
    tr: 'Fotoğraflı ve müzikli NFC hediye kartı — Breisgau Digital',
  },
};
