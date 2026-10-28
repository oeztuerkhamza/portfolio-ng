import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Seite „Digitale Speisekarte" (/digitale-speisekarte). Die Referenz
 * ist das Divan Ocakbaşı in Freiburg (/m/divan). Werden von SpeisekarteComponent
 * beim I18nService registriert.
 */
export const SPEISEKARTE_CONTENT: Record<string, Entry> = {
  'sk.label': { de: 'Digitale Speisekarte', en: 'Digital menu', tr: 'Dijital menü' },
  'sk.title': {
    de: 'Die Speisekarte, die Ihre Gäste<br /><em>erleben</em>.',
    en: 'A menu your guests<br /><em>experience</em>.',
    tr: 'Misafirlerinizin<br /><em>deneyimlediği</em> menü.',
  },
  'sk.intro': {
    de: 'QR-Code oder NFC am Tisch scannen – und Ihre Gäste wählen Schritt für Schritt, mit Fotos und in ihrer Sprache. Ohne App, ohne Wartezeit, im Look Ihres Hauses.',
    en: 'Scan the QR code or NFC tag on the table – and your guests choose step by step, with photos and in their own language. No app, no waiting, in the look of your restaurant.',
    tr: 'Masadaki QR kodu veya NFC’yi okutun – misafirleriniz fotoğraflarla, kendi dillerinde adım adım seçsin. Uygulama yok, bekleme yok, restoranınızın tarzında.',
  },
  'sk.cta.live': { de: 'Live ansehen', en: 'See it live', tr: 'Canlı görün' },
  'sk.cta.request': { de: 'Speisekarte anfragen', en: 'Request your menu', tr: 'Menünüzü talep edin' },

  'sk.ref.label': { de: 'Referenz', en: 'Case study', tr: 'Referans' },
  'sk.ref.title': { de: 'Divan Ocakbaşı, Freiburg', en: 'Divan Ocakbaşı, Freiburg', tr: 'Divan Ocakbaşı, Freiburg' },
  'sk.ref.text': {
    de: 'Für das Divan in der Bertoldstraße haben wir die gedruckte Karte mit über 200 Gerichten und Getränken digitalisiert: in 14 Sprachen, mit den eigenen Fotos des Hauses und einem Eingang wie in einem orientalischen Palast. Am Tisch bestellen die Gäste Schritt für Schritt; wer von außen schaut, sieht die ganze Karte.',
    en: 'For Divan on Bertoldstraße we turned the printed menu with more than 200 dishes and drinks into a digital one: in 14 languages, with the restaurant’s own photos and an entrance like an oriental palace. At the table, guests order step by step; anyone looking from outside sees the full menu.',
    tr: 'Bertoldstraße’deki Divan için 200’den fazla yemek ve içecek içeren basılı menüyü dijitale taşıdık: 14 dilde, restoranın kendi fotoğraflarıyla ve oryantal bir saray gibi bir girişle. Masada misafirler adım adım sipariş veriyor; dışarıdan bakan herkes menünün tamamını görüyor.',
  },
  'sk.ref.table': { de: 'Seite am Tisch', en: 'Table page', tr: 'Masadaki sayfa' },
  'sk.ref.full': { de: 'Ganze Karte', en: 'Full menu', tr: 'Menünün tamamı' },
  'sk.ref.demo': { de: 'Demo-Karte ausprobieren', en: 'Try the demo menu', tr: 'Demo menüyü deneyin' },
  'sk.shot1': { de: 'Der Eingang: zwei Palasttüren öffnen sich', en: 'The entrance: two palace doors swing open', tr: 'Giriş: iki saray kapısı açılıyor' },
  'sk.shot2': { de: 'Begrüßung, Menü und Mittagsmenü', en: 'Welcome, menu and lunch menu', tr: 'Karşılama, menü ve öğle menüsü' },
  'sk.shot3': { de: 'Schritt für Schritt, mit Fotos und Nummern', en: 'Step by step, with photos and numbers', tr: 'Fotoğraflı ve numaralı, adım adım' },
  'sk.shot4': { de: 'Getränke nach Art', en: 'Drinks by type', tr: 'Türüne göre içecekler' },
  'sk.shot5': { de: 'Die Auswahl in der Sprache des Gastes – mit deutschem Namen für den Service', en: 'The selection in the guest’s language – with the German name for the staff', tr: 'Misafirin dilinde seçim – servis için Almanca adıyla' },
  'sk.shots.alt': { de: 'Digitale Speisekarte des Divan auf dem Smartphone', en: 'Divan’s digital menu on a smartphone', tr: 'Divan’ın dijital menüsü akıllı telefonda' },

  'sk.feat.label': { de: 'Was die Karte kann', en: 'What the menu does', tr: 'Menünün yapabildikleri' },
  'sk.feat.title': { de: 'Mehr als ein <em>PDF</em> am Tisch.', en: 'More than a <em>PDF</em> on the table.', tr: 'Masada bir <em>PDF</em>’ten fazlası.' },
  'sk.f1.t': { de: 'Schritt für Schritt bestellen', en: 'Order step by step', tr: 'Adım adım sipariş' },
  'sk.f1.d': {
    de: 'Mittagsmenü, Vorspeisen, Salate, Hauptgerichte, Dessert, Getränke – der Gast tippt sich durch und zeigt am Ende seine Liste.',
    en: 'Lunch menu, starters, salads, mains, dessert, drinks – guests tap through and show their list at the end.',
    tr: 'Öğle menüsü, başlangıçlar, salatalar, ana yemekler, tatlı, içecekler – misafir sırayla seçip sonunda listesini gösteriyor.',
  },
  'sk.f2.t': { de: '14 Sprachen', en: '14 languages', tr: '14 dil' },
  'sk.f2.d': {
    de: 'Von Arabisch bis Koreanisch, Rechts-nach-links inklusive. In der Auswahl steht der deutsche Name für Ihr Personal.',
    en: 'From Arabic to Korean, right-to-left included. The selection shows the German name for your staff.',
    tr: 'Arapçadan Korecaye, sağdan sola yazım dahil. Seçimde personeliniz için Almanca adı da yazıyor.',
  },
  'sk.f3.t': { de: 'Mittagsmenü nach Uhrzeit', en: 'Lunch menu by the clock', tr: 'Saate göre öğle menüsü' },
  'sk.f3.d': {
    de: 'Rubriken erscheinen nur zu ihrer Zeit – das Mittagsmenü zum Beispiel von 11:30 bis 16:00 Uhr.',
    en: 'Sections only appear at their time – the lunch menu, for example, from 11:30 to 16:00.',
    tr: 'Bölümler yalnızca kendi saatlerinde görünür – örneğin öğle menüsü 11:30 ile 16:00 arası.',
  },
  'sk.f4.t': { de: 'Ihre Fotos, Ihre Nummern', en: 'Your photos, your numbers', tr: 'Sizin fotoğraflarınız, sizin numaralarınız' },
  'sk.f4.d': {
    de: 'Die eigenen Bilder des Hauses und die Nummern Ihrer gedruckten Karte – der Service findet jedes Gericht sofort.',
    en: 'The restaurant’s own pictures and the numbers of your printed menu – staff find every dish instantly.',
    tr: 'Restoranın kendi fotoğrafları ve basılı menünüzdeki numaralar – servis her yemeği hemen bulur.',
  },
  'sk.f5.t': { de: 'Design wie Ihr Haus', en: 'Designed like your place', tr: 'Mekânınıza özel tasarım' },
  'sk.f5.d': {
    de: 'Farben, Muster und Eingangsanimation passend zu Ihrem Restaurant – nicht von der Stange.',
    en: 'Colours, patterns and an entrance animation that match your restaurant – not off the shelf.',
    tr: 'Restoranınıza uygun renkler, desenler ve giriş animasyonu – hazır kalıp değil.',
  },
  'sk.f6.t': { de: 'Ohne App, sofort da', en: 'No app, instantly there', tr: 'Uygulamasız, anında' },
  'sk.f6.d': {
    de: 'QR-Code oder NFC-Aufsteller am Tisch; die Seite steht in Sekunden, auch bei schlechtem Empfang.',
    en: 'QR code or NFC stand on the table; the page loads in seconds, even with poor reception.',
    tr: 'Masada QR kod veya NFC standı; sayfa saniyeler içinde açılır, zayıf çekimde bile.',
  },
  'sk.f7.t': { de: 'Zwei Seiten, klar getrennt', en: 'Two pages, clearly separate', tr: 'Net ayrılmış iki sayfa' },
  'sk.f7.d': {
    de: 'Am Tisch nur die Auswahl, für Gäste von außen die ganze Karte – für Website, Google-Profil und Instagram.',
    en: 'At the table only the selection, for guests outside the full menu – for your website, Google profile and Instagram.',
    tr: 'Masada sadece seçim, dışarıdaki misafirler için menünün tamamı – web siteniz, Google profiliniz ve Instagram için.',
  },
  'sk.f8.t': { de: 'Instagram und Google-Bewertung', en: 'Instagram and Google reviews', tr: 'Instagram ve Google yorumu' },
  'sk.f8.d': {
    de: 'Knöpfe zu Ihrem Instagram und zur Google-Bewertung – am Anfang und am Ende der Auswahl.',
    en: 'Buttons to your Instagram and to Google reviews – at the start and at the end of the selection.',
    tr: 'Instagram hesabınıza ve Google yorumuna düğmeler – seçimin başında ve sonunda.',
  },

  'sk.steps.label': { de: 'Ablauf', en: 'How it works', tr: 'Süreç' },
  'sk.steps.title': { de: 'Von der Papierkarte<br /><em>an den Tisch</em>.', en: 'From the paper menu<br /><em>to the table</em>.', tr: 'Kâğıt menüden<br /><em>masaya</em>.' },
  'sk.step1.t': { de: 'Karte schicken', en: 'Send your menu', tr: 'Menünüzü gönderin' },
  'sk.step1.d': { de: 'PDF, Foto oder Link – mehr brauchen wir nicht.', en: 'PDF, photo or link – that is all we need.', tr: 'PDF, fotoğraf veya link – bu kadarı yeterli.' },
  'sk.step2.t': { de: 'Wir digitalisieren', en: 'We digitise it', tr: 'Biz dijitale taşıyoruz' },
  'sk.step2.d': { de: 'Gerichte, Preise, Nummern, Übersetzungen und Ihre Fotos.', en: 'Dishes, prices, numbers, translations and your photos.', tr: 'Yemekler, fiyatlar, numaralar, çeviriler ve fotoğraflarınız.' },
  'sk.step3.t': { de: 'Sie prüfen', en: 'You review', tr: 'Siz kontrol edin' },
  'sk.step3.d': { de: 'Sie bekommen einen Vorschau-Link und sagen uns, was noch fehlt.', en: 'You get a preview link and tell us what is still missing.', tr: 'Bir önizleme linki alırsınız ve eksikleri bize söylersiniz.' },
  'sk.step4.t': { de: 'An den Tisch', en: 'Onto the tables', tr: 'Masalara' },
  'sk.step4.d': { de: 'QR-Codes oder NFC-Aufsteller – und Ihre Gäste wählen los.', en: 'QR codes or NFC stands – and your guests start choosing.', tr: 'QR kodlar veya NFC standları – misafirleriniz seçmeye başlar.' },

  'sk.faq.label': { de: 'Häufige Fragen', en: 'FAQ', tr: 'Sık sorulanlar' },
  'sk.faq.title': { de: 'Gut zu <em>wissen</em>.', en: 'Good to <em>know</em>.', tr: 'Bilmekte <em>fayda var</em>.' },
  'sk.faq1.q': { de: 'Brauchen meine Gäste eine App?', en: 'Do my guests need an app?', tr: 'Misafirlerimin bir uygulamaya ihtiyacı var mı?' },
  'sk.faq1.a': {
    de: 'Nein. Kamera auf den QR-Code halten oder das Handy an den NFC-Aufsteller – die Karte öffnet sich im Browser.',
    en: 'No. Point the camera at the QR code or hold the phone to the NFC stand – the menu opens in the browser.',
    tr: 'Hayır. Kamerayı QR koda tutmak ya da telefonu NFC standına yaklaştırmak yeterli – menü tarayıcıda açılır.',
  },
  'sk.faq2.q': { de: 'Können Gäste direkt bestellen?', en: 'Can guests order directly?', tr: 'Misafirler doğrudan sipariş verebilir mi?' },
  'sk.faq2.a': {
    de: 'Die Gäste stellen ihre Auswahl zusammen und zeigen sie dem Service. Auf Wunsch geht die Bestellung auch direkt vom Tisch an Ihr Personal.',
    en: 'Guests put together their selection and show it to the staff. If you like, orders can also go straight from the table to your team.',
    tr: 'Misafirler seçimlerini yapıp servise gösterir. İsterseniz sipariş doğrudan masadan personelinize de gidebilir.',
  },
  'sk.faq3.q': { de: 'Was ist mit Allergenen?', en: 'What about allergens?', tr: 'Alerjenler ne olacak?' },
  'sk.faq3.a': {
    de: 'Allergene lassen sich je Gericht hinterlegen und filtern; der Hinweis Ihres Hauses steht am Ende der Auswahl.',
    en: 'Allergens can be stored per dish and filtered; your restaurant’s notice appears at the end of the selection.',
    tr: 'Alerjenler her yemek için girilip filtrelenebilir; restoranınızın notu seçimin sonunda görünür.',
  },
  'sk.faq4.q': { de: 'Und wenn sich Preise oder Gerichte ändern?', en: 'What if prices or dishes change?', tr: 'Fiyatlar veya yemekler değişirse?' },
  'sk.faq4.a': {
    de: 'Eine kurze Nachricht genügt – wir pflegen die Karte, und die neue Fassung steht sofort am Tisch, ohne neue QR-Codes.',
    en: 'A short message is enough – we update the menu and the new version is on the table right away, without new QR codes.',
    tr: 'Kısa bir mesaj yeterli – menüyü biz güncelleriz ve yeni hâli hemen masada olur, yeni QR kod gerekmeden.',
  },

  'sk.cta.title': { de: 'Ihre Karte als<br /><em>Erlebnis</em>?', en: 'Your menu as an<br /><em>experience</em>?', tr: 'Menünüz bir<br /><em>deneyim</em> olsun mu?' },
  'sk.cta.text': {
    de: 'Schicken Sie uns Ihre aktuelle Speisekarte – wir zeigen Ihnen, wie sie digital aussieht.',
    en: 'Send us your current menu – we will show you what it looks like digitally.',
    tr: 'Mevcut menünüzü gönderin – dijitalde nasıl göründüğünü size gösterelim.',
  },

  'seo.sk.title': {
    de: 'Digitale Speisekarte mit QR-Code für Restaurants | Freiburg',
    en: 'Digital QR code menu for restaurants | Freiburg',
    tr: 'Restoranlar için QR kodlu dijital menü | Freiburg',
  },
  'seo.sk.desc': {
    de: 'Digitale Speisekarte für Restaurants in Freiburg: QR-Code oder NFC am Tisch, Bestellung Schritt für Schritt, 14 Sprachen, eigene Fotos und Design. Referenz: Divan Ocakbaşı.',
    en: 'Digital menu for restaurants in Freiburg: QR code or NFC on the table, step-by-step ordering, 14 languages, your own photos and design. Case study: Divan Ocakbaşı.',
    tr: 'Freiburg’daki restoranlar için dijital menü: masada QR kod veya NFC, adım adım sipariş, 14 dil, kendi fotoğraf ve tasarımınız. Referans: Divan Ocakbaşı.',
  },
};
