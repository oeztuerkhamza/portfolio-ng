import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Produktseiten unter /bewertungskarten/<kurzname>.
 *
 * Preise stehen nirgends in diesen Texten — die kommen aus dem Katalog
 * (src/app/core/data/catalog.ts) und werden im Admin-Portal gepflegt. Sonst
 * müsste man bei jeder Preisänderung drei Sprachen nachziehen.
 *
 * Die langen Texte je Produkt (`pd.<kurzname>.long`) sind die Seiten, die bei
 * Google landen: jede beschreibt ein Produkt, keine wiederholt die andere.
 */
export const PRODUCT_CONTENT: Record<string, Entry> = {
  // ── Seitengerüst ──────────────────────────────────────────
  'pd.back': { de: 'Alle Produkte', en: 'All products', tr: 'Tüm ürünler' },
  'pd.incl': { de: 'Immer dabei', en: 'Always included', tr: 'Her zaman dahil' },
  'pd.inc1': {
    de: 'NFC-Chip und QR-Code — funktioniert mit jedem Handy, auch ohne App.',
    en: 'NFC chip and QR code — works with any phone, no app needed.',
    tr: 'NFC çipi ve QR kodu — uygulama olmadan her telefonda çalışır.',
  },
  'pd.inc2': {
    de: 'Druck mit Ihrem Logo und Ihren Farben, von uns eingerichtet.',
    en: 'Printed with your logo and colours, set up by us.',
    tr: 'Logonuz ve renklerinizle baskı, kurulumu bizden.',
  },
  'pd.inc3': {
    de: 'Verknüpfung mit Ihrem Google-Profil — Sie schicken uns nur den Link.',
    en: 'Linked to your Google profile — you just send us the link.',
    tr: 'Google profilinizle bağlantı — bize sadece linki gönderin.',
  },
  'pd.inc4': {
    de: 'Kein Abo, keine laufenden Kosten: einmal zahlen, dauerhaft nutzen.',
    en: 'No subscription, no running costs: pay once, use it for good.',
    tr: 'Abonelik yok, aylık ödeme yok: bir kez öde, sürekli kullan.',
  },
  'pd.contains': { de: 'Im Paket enthalten', en: "What's in the bundle", tr: 'Pakette neler var' },
  'pd.cart': { de: 'Zum Warenkorb', en: 'Go to cart', tr: 'Sepete git' },
  'pd.inbasket': { de: 'Im Warenkorb', en: 'In your cart', tr: 'Sepette' },
  'pd.ask': { de: 'Per E-Mail anfragen', en: 'Ask by e-mail', tr: 'E-posta ile sor' },
  'pd.closed': {
    de: 'Die Online-Bestellung ist gerade geschlossen. Schreiben Sie uns — wir melden uns am selben Werktag.',
    en: 'Online ordering is closed right now. Write to us — we reply the same working day.',
    tr: 'Online sipariş şu an kapalı. Bize yazın — aynı iş günü dönüş yapıyoruz.',
  },
  'pd.faq': {
    de: 'Häufige Fragen und Beispiel-Designs finden Sie auf der Übersichtsseite.',
    en: 'Frequently asked questions and design samples are on the overview page.',
    tr: 'Sık sorulan sorular ve örnek tasarımlar genel bakış sayfasında.',
  },
  'pd.notfound.title': { de: 'Dieses Produkt gibt es nicht.', en: 'No such product.', tr: 'Böyle bir ürün yok.' },
  'pd.notfound.text': {
    de: 'Der Link zeigt auf ein Produkt, das es nicht (mehr) gibt. In der Übersicht finden Sie alle aktuellen Karten und Pakete.',
    en: 'This link points to a product that no longer exists. The overview lists all current cards and bundles.',
    tr: 'Bu link artık olmayan bir ürüne gidiyor. Güncel tüm kartlar ve paketler genel bakışta.',
  },
  'pd.details': { de: 'Details', en: 'Details', tr: 'Detaylar' },

  // ── Einzelprodukte ────────────────────────────────────────
  'pd.karte.long': {
    de: 'Die Karte im Format einer Bankkarte ist das Stück, das am Tresen, am Tisch oder an der Kasse in die Hand gegeben wird. Der Gast hält sein Handy dran, die Google-Bewertung öffnet sich sofort — kein Suchen, kein Abtippen, kein Erklären. Gedruckt wird auf stabilem Kunststoff mit Ihrem Logo; der NFC-Chip sitzt innen und ist von außen nicht zu sehen. Wer kein NFC hat, scannt den QR-Code auf der Rückseite. Für Teams lohnt sich eine Karte pro Person: so fragt jeder selbst nach der Bewertung, statt sie an der Theke zu sammeln.',
    en: 'Bank-card sized, this is the piece you hand over at the counter, at the table or at the till. The guest holds their phone against it and the Google review opens straight away — nothing to search for, nothing to type, nothing to explain. Printed on solid plastic with your logo; the NFC chip sits inside and is invisible from the outside. No NFC? The QR code on the back does the job. For teams, one card per person pays off: everyone asks for their own review instead of leaving it at the counter.',
    tr: 'Banka kartı boyutundaki bu kart, tezgâhta, masada ya da kasada müşterinin eline verilen parçadır. Misafir telefonunu yaklaştırır, Google değerlendirmesi anında açılır — arama yok, yazma yok, anlatma yok. Logonuzla sağlam plastiğe basılır; NFC çipi içindedir, dışarıdan görünmez. NFC’si olmayan arkadaki QR kodu okutur. Ekipler için kişi başı bir kart mantıklı: herkes kendi değerlendirmesini ister, tezgâhta beklemez.',
  },
  'pd.aufsteller.long': {
    de: 'Der Tischaufsteller steht dauerhaft da, wo gewartet oder gezahlt wird: auf dem Tresen, am Empfang, auf dem Tisch. Er fragt, ohne dass jemand fragen muss — gerade in Betrieben, in denen zum Bezahlen niemand mehr an die Kasse kommt. Massiver Standfuß, Druck beidseitig mit Ihrem Logo, NFC-Chip und QR-Code auf der Vorderseite. Zwei Aufsteller sind erfahrungsgemäß besser als einer: einer drinnen, einer auf der Terrasse oder am zweiten Ausgang.',
    en: 'The table stand stays where people wait or pay: on the counter, at reception, on the table. It asks without anyone having to ask — which matters in places where nobody walks up to the till any more. Solid base, printed on both sides with your logo, NFC chip and QR code on the front. Two stands beat one: one inside, one on the terrace or at the second exit.',
    tr: 'Masa standı, beklenen ya da ödeme yapılan yerde sürekli durur: tezgâhta, resepsiyonda, masada. Kimse sormak zorunda kalmadan o sorar — özellikle kimsenin kasaya gelmediği işletmelerde. Sağlam ayak, iki yüzü logonuzla baskılı, ön yüzde NFC çipi ve QR kodu. Tecrübeyle: iki stand birden iyidir — biri içeride, biri terasta ya da ikinci çıkışta.',
  },
  'pd.aufkleber.long': {
    de: 'Der Aufkleber geht dorthin, wo kein Platz für einen Aufsteller ist: auf das Kartenlesegerät, an die Tür, an den Spiegel, an die Theke. Er klebt auf glatten Flächen dauerhaft, hält Reinigungsmittel aus und lässt sich rückstandsfrei wieder abziehen. Der NFC-Chip liegt unter dem Druck; das Handy erkennt ihn, sobald es nah genug ist. Sie bekommen zwei Stück — meist einer beim Bezahlen und einer am Ausgang, denn genau dort entscheidet sich, ob eine Bewertung noch kommt.',
    en: 'The sticker goes where a stand does not fit: on the card reader, on the door, on the mirror, on the counter. It sticks to smooth surfaces for good, survives cleaning products and peels off without residue. The NFC chip sits under the print; the phone picks it up as soon as it is close enough. You get two — usually one at the payment terminal and one at the exit, because that is where a review is won or lost.',
    tr: 'Etiket, standın sığmadığı yere gider: POS cihazına, kapıya, aynaya, tezgâha. Düz yüzeylere kalıcı yapışır, temizlik maddesine dayanır, iz bırakmadan sökülür. NFC çipi baskının altındadır; telefon yeterince yaklaşınca algılar. İki adet gelir — genelde biri ödeme noktasına, biri çıkışa, çünkü değerlendirme tam orada kazanılır.',
  },
  'pd.schluesselanhaenger.long': {
    de: 'Der Schlüsselanhänger ist die Karte für unterwegs: am Schlüsselbund, am Werkzeugkoffer, am Rucksack. Für Handwerk, Lieferdienste, Pflege und alle, die beim Kunden sind und nicht im Laden — die Bewertung wird direkt an der Haustür gefragt, solange der Eindruck frisch ist. Robustes Material, Druck mit Ihrem Logo, NFC-Chip innen und QR-Code auf der Rückseite. Gleiche Technik wie die Karte, nur handlicher.',
    en: 'The keyring is the card for the road: on the key ring, on the tool case, on the backpack. For trades, delivery, care work and anyone who is at the customer rather than in a shop — the review gets asked for at the front door, while the impression is still fresh. Tough material, printed with your logo, NFC chip inside and QR code on the back. Same technology as the card, just handier.',
    tr: 'Anahtarlık, yoldaki karttır: anahtar demetinde, takım çantasında, sırt çantasında. Ustalar, kurye, evde bakım ve dükkânda değil müşteride olan herkes için — değerlendirme kapının önünde, izlenim tazeyken istenir. Sağlam malzeme, logonuzla baskı, içinde NFC çipi, arkada QR kodu. Kartla aynı teknoloji, sadece daha pratik.',
  },

  // ── Pakete ────────────────────────────────────────────────
  'pd.paket-einzel.long': {
    de: 'Das kleinste Paket für den Anfang: eine Karte, eingerichtet auf Ihr Google-Profil, fertig zum Hinlegen. Gedacht für Einzelbetriebe und für alle, die erst sehen wollen, ob das funktioniert, bevor sie mehr bestellen. Der Ablauf ist derselbe wie bei den großen Paketen — Sie schicken Logo und Google-Link, wir schicken den Entwurf zur Freigabe, danach kommt die Karte per Post. Nachbestellen können Sie jederzeit einzeln.',
    en: 'The smallest bundle to start with: one card, set up for your Google profile, ready to put down. Meant for one-person businesses and for anyone who wants to see whether this works before ordering more. The process is the same as for the bigger bundles — you send logo and Google link, we send the draft for approval, then the card goes out by post. You can reorder single items any time.',
    tr: 'Başlangıç için en küçük paket: bir kart, Google profilinize kurulmuş, koymaya hazır. Tek kişilik işletmeler ve önce işe yarayıp yaramadığını görmek isteyenler için. Akış büyük paketlerle aynı — logo ve Google linkini gönderirsiniz, biz taslağı onaya yollarız, sonra kart postayla gelir. Tek tek yeniden sipariş her zaman mümkün.',
  },
  'pd.paket-team.long': {
    de: 'Drei Karten für drei Personen — das Paket für Teams, in denen jeder selbst mit dem Gast spricht: Friseur, Werkstatt, Praxis, Restaurant mit Service. Jede Karte trägt dasselbe Design und zeigt auf dasselbe Google-Profil; wer möchte, bekommt den Namen der Person mit aufgedruckt. Drei Karten kosten weniger als drei einzelne, und im Alltag ist das der Unterschied zwischen „wir haben eine Karte irgendwo" und „jeder hat seine dabei".',
    en: 'Three cards for three people — the bundle for teams where everyone talks to the guest themselves: hairdresser, workshop, practice, restaurant with table service. Every card carries the same design and points at the same Google profile; the person’s name can be printed on it. Three cards cost less than three single ones, and day to day that is the difference between "there is a card somewhere" and "everyone has theirs on them".',
    tr: 'Üç kişi için üç kart — misafirle herkesin kendi konuştuğu ekipler için: kuaför, servis, muayenehane, garsonlu restoran. Her kart aynı tasarımı taşır ve aynı Google profiline gider; isteyene kişinin adı da basılır. Üç kart, üç tek karttan daha ucuz; günlük hayatta fark şu: “bir yerde bir kart var” yerine “herkesin kendi kartı yanında”.',
  },
  'pd.paket-tresen.long': {
    de: 'Ein Tischaufsteller plus drei Karten: der Aufsteller fragt dauerhaft am Tresen, die Karten gehen mit dem Team an den Tisch oder in die Hand. Das ist der Zuschnitt für Gastronomie, Salons und alles mit Laufkundschaft — der feste Platz erwischt die, die warten, die Karten die, die schon gezahlt haben und gerade gehen. Gegenüber den Einzelpreisen sparen Sie mit dem Paket; eingerichtet und aufeinander abgestimmt ist beides sowieso.',
    en: 'One table stand plus three cards: the stand keeps asking at the counter, the cards go with the team to the table or into someone’s hand. This is the fit for hospitality, salons and any walk-in trade — the fixed spot catches the ones who wait, the cards catch the ones who have paid and are leaving. The bundle costs less than the parts; set-up and matching design are included either way.',
    tr: 'Bir masa standı artı üç kart: stand tezgâhta sürekli sorar, kartlar ekiple masaya ya da elden ele gider. Restoran, kuaför ve yoldan müşteri alan her yer için doğru ölçü — sabit nokta bekleyenleri yakalar, kartlar ödeyip çıkanları. Paket, tek tek almaktan daha ucuz; kurulum ve uyumlu tasarım her hâlükârda dahil.',
  },
};
