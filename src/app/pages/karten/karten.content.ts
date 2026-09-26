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
  'kt.label': { de: 'Eigene NFC-Karten', fr: 'Cartes NFC sur mesure', en: 'Your own NFC cards', tr: 'Kendi NFC kartlarınız', ku: 'Kartên NFC yên we' },
  'kt.how': { de: 'So läuft es', fr: 'Comment ça marche', en: 'How it works', tr: 'Nasıl oluyor', ku: 'Çawa dibe' },
  'kt.step1.t': { de: 'Bestellen', fr: 'Commander', en: 'Order', tr: 'Sipariş', ku: 'Siparîş' },
  'kt.step1.d': {
    de: 'Sie legen die Karte in den Warenkorb und bezahlen online. Mehr brauchen wir zum Anfangen nicht.',
    fr: 'Vous ajoutez la carte au panier et payez en ligne. Rien d’autre n’est nécessaire pour démarrer.',
    en: 'You add the card to the cart and pay online. Nothing else is needed to get started.',
    tr: 'Kartı sepete ekleyip online ödersiniz. Başlamak için fazlası gerekmiyor.',
    ku: 'Hûn kartê têxin selikê û serhêl bidin. Ji bo destpêkê tiştek din ne hewce ye.',
  },
  'kt.step2.t': { de: 'Inhalte schicken', fr: 'Envoyer le contenu', en: 'Send the content', tr: 'İçeriği gönderin', ku: 'Naverokê bişînin' },
  'kt.step2.d': {
    de: 'Nach der Bestellung kommt eine E-Mail, die genau auflistet, was wir brauchen. Antworten genügt — Sie müssen nichts ausfüllen.',
    fr: 'Après la commande, un e-mail liste précisément ce qu’il nous faut. Une réponse suffit : aucun formulaire à remplir.',
    en: 'After ordering you get an e-mail listing exactly what we need. A reply is enough — no form to fill in.',
    tr: 'Siparişten sonra neye ihtiyacımız olduğunu tek tek yazan bir e-posta gelir. Cevap vermeniz yeterli, form doldurmanız gerekmez.',
    ku: 'Piştî siparîşê e-nameyek tê ku tam dinivîse em çi hewce ne. Bersivek bes e — formek tune ku hûn tijî bikin.',
  },
  'kt.step3.t': { de: 'Wir richten die Seite ein', fr: 'Nous créons la page', en: 'We set the page up', tr: 'Sayfayı biz kuruyoruz', ku: 'Em rûpelê saz dikin' },
  'kt.step3.d': {
    de: 'Sie bekommen die Adresse Ihrer Seite zur Freigabe. Bis dahin können Sie kostenlos stornieren; erst mit der Freigabe beginnt die Herstellung.',
    fr: 'Vous recevez l’adresse de votre page à valider. Jusque-là, annulation gratuite ; la fabrication ne commence qu’après votre accord.',
    en: 'You get the address of your page to approve. Until then you can cancel free of charge; production starts only once you approve.',
    tr: 'Sayfanızın adresi onayınıza gelir. O ana kadar ücretsiz iptal edebilirsiniz; üretim ancak onaydan sonra başlar.',
    ku: 'Navnîşana rûpela we ji bo pejirandinê tê. Heta wê demê hûn dikarin belaş betal bikin; hilberîn tenê piştî pejirandinê dest pê dike.',
  },
  'kt.step4.t': { de: 'Die Karte kommt', fr: 'La carte arrive', en: 'The card arrives', tr: 'Kart gelir', ku: 'Kart tê' },
  'kt.step4.d': {
    de: 'Wir programmieren den Chip und schicken die Karte per Post. Ändert sich später etwas, ändern wir die Seite — die Karte bleibt dieselbe.',
    fr: 'Nous programmons la puce et envoyons la carte par la poste. Si quelque chose change ensuite, nous modifions la page : la carte reste la même.',
    en: 'We program the chip and send the card by post. If something changes later we change the page — the card stays the same.',
    tr: 'Çipi programlayıp kartı postayla gönderiyoruz. Sonradan bir şey değişirse sayfayı değiştiririz — kart aynı kalır.',
    ku: 'Em çîpê bername dikin û kartê bi posteyê dişînin. Ger paşê tiştek biguhere, em rûpelê diguherînin — kart heman dimîne.',
  },

  'kt.own.t': { de: 'Auf unserem eigenen System', fr: 'Sur notre propre système', en: 'On our own system', tr: 'Kendi sistemimizde', ku: 'Li ser pergala me' },
  'kt.own.d': {
    de: 'Die Seite Ihrer Karte liegt auf unserer Adresse, nicht bei einem fremden Anbieter. Kein Abo, keine laufenden Kosten, keine Weitergabe Ihrer Daten — und niemand, der die Seite abschalten kann, wenn er seinen Dienst einstellt.',
    fr: 'La page de votre carte est hébergée sur notre domaine, pas chez un prestataire tiers. Sans abonnement, sans frais récurrents, sans transmission de vos données — et personne ne peut couper la page en arrêtant son service.',
    en: 'Your card’s page lives on our own address, not with a third-party provider. No subscription, no running costs, no passing on your data — and nobody who can switch the page off by shutting down their service.',
    tr: 'Kartınızın sayfası bizim adresimizde duruyor, yabancı bir sağlayıcıda değil. Abonelik yok, aylık ödeme yok, verilerinizin paylaşımı yok — ve hizmetini kapatınca sayfanızı kapatacak kimse yok.',
    ku: 'Rûpela karta we li navnîşana me ye, ne li cem pêşkêşkarek biyanî. Bê abone, bê lêçûnên domdar, bê dayîna daneyên we — û kes tune ku bi girtina xizmeta xwe rûpelê bigire.',
  },

  'kt.other.business': { de: 'Auch als Geschenkkarte', fr: 'Existe aussi en carte cadeau', en: 'Also as a gift card', tr: 'Hediye kartı olarak da var', ku: 'Wek karta diyariyê jî heye' },
  'kt.other.gift': { de: 'Auch als digitale Visitenkarte', fr: 'Existe aussi en carte de visite', en: 'Also as a digital business card', tr: 'Dijital kartvizit olarak da var', ku: 'Wek karta karsaziyê jî heye' },
  'kt.review': {
    de: 'Sie möchten statt einer eigenen Seite Google-Bewertungen sammeln? Dafür gibt es die Bewertungskarten.',
    fr: 'Vous préférez collecter des avis Google plutôt qu’avoir votre propre page ? Ce sont les cartes d’avis.',
    en: 'Want to collect Google reviews instead of having your own page? That’s what the review cards are for.',
    tr: 'Kendi sayfanız yerine Google değerlendirmesi toplamak mı istiyorsunuz? Onun için değerlendirme kartları var.',
    ku: 'Hûn dixwazin li şûna rûpela xwe nirxandinên Google berhev bikin? Ji bo wê kartên nirxandinê hene.',
  },

  // ── Digitale Visitenkarte ─────────────────────────────────
  'kt.business.title': {
    de: 'Eine Visitenkarte,<br /><em>die aktuell bleibt</em>.',
    fr: 'Une carte de visite<br /><em>toujours à jour</em>.',
    en: 'A business card<br /><em>that stays current</em>.',
    tr: 'Hep güncel kalan<br /><em>bir kartvizit</em>.',
    ku: 'Kartek karsaziyê<br /><em>ku her tim nû dimîne</em>.',
  },
  'kt.business.intro': {
    de: 'Der Gast hält sein Handy an die Karte, und Ihre Seite öffnet sich: Telefon, E-Mail, Adresse, Ihre Links. Ein Tippen speichert Sie in seinen Kontakten. Keine App, kein Abo — und wenn sich eine Nummer ändert, ändern wir die Seite, nicht die Karte.',
    fr: 'Le contact approche son téléphone et votre page s’ouvre : téléphone, e-mail, adresse, vos liens. Un geste et vous êtes dans son répertoire. Sans application, sans abonnement — et si un numéro change, nous modifions la page, pas la carte.',
    en: 'Your contact holds their phone against the card and your page opens: phone, e-mail, address, your links. One tap saves you into their contacts. No app, no subscription — and if a number changes we change the page, not the card.',
    tr: 'Karşınızdaki telefonunu karta yaklaştırıyor ve sayfanız açılıyor: telefon, e-posta, adres, linkleriniz. Bir dokunuşla rehberine kaydediliyorsunuz. Uygulama yok, abonelik yok — numara değişirse kartı değil sayfayı değiştiriyoruz.',
    ku: 'Mêvan telefona xwe nêzîkî kartê dike û rûpela we vedibe: telefon, e-name, navnîşan, girêdanên we. Bi destdanek hûn di pêwendiyên wî de tên tomarkirin. Ne sepan, ne abone — û ger hejmarek biguhere, em rûpelê diguherînin, ne kartê.',
  },
  'kt.business.long': {
    de: 'Gedacht für alle, die ihre Karte häufig weitergeben und deren Angaben sich ändern: Handwerk, Beratung, Immobilien, Vertrieb, Pflege. Eine gedruckte Karte mit falscher Nummer wandert in den Müll, und der Kontakt ist weg; eine Seite, die wir für Sie aktuell halten, bleibt richtig. Dazu kommt, was Papier nicht kann: der Gast speichert Sie mit einem Tippen, ruft direkt an, öffnet die Navigation zu Ihrer Adresse oder folgt Ihnen auf Instagram — ohne etwas abzutippen. Und wenn Sie es möchten, kann er auch seine eigenen Daten dalassen, damit Sie sich melden können.',
    fr: 'Pensée pour celles et ceux qui distribuent beaucoup de cartes et dont les coordonnées changent : artisanat, conseil, immobilier, commerce, soins. Une carte imprimée avec un mauvais numéro finit à la poubelle et le contact est perdu ; une page que nous tenons à jour reste juste. S’y ajoute ce que le papier ne sait pas faire : votre interlocuteur vous enregistre d’un geste, appelle directement, lance l’itinéraire vers votre adresse ou vous suit sur Instagram — sans rien saisir. Et si vous le souhaitez, il peut aussi laisser ses propres coordonnées pour que vous le rappeliez.',
    en: 'Meant for people who hand their card out often and whose details change: trades, consulting, property, sales, care. A printed card with the wrong number goes in the bin and the contact is lost; a page we keep current stays right. On top of that comes what paper cannot do: your contact saves you with one tap, calls straight away, opens navigation to your address or follows you on Instagram — without typing anything. And if you want, they can leave their own details so you can get back to them.',
    tr: 'Kartını sık veren ve bilgileri değişen herkes için: ustalar, danışmanlık, emlak, satış, bakım. Yanlış numaralı basılı kart çöpe gider ve o kişiyi kaybedersiniz; bizim güncel tuttuğumuz sayfa doğru kalır. Üstüne kâğıdın yapamadığı şeyler gelir: karşınızdaki tek dokunuşla sizi kaydeder, doğrudan arar, adresinize navigasyon açar ya da Instagram’da takip eder — hiçbir şey yazmadan. İsterseniz kendi bilgilerini de bırakabilir, siz dönersiniz.',
    ku: 'Ji bo wan kesan e ku kartê xwe gelek didin û agahiyên wan diguherin: pîşesaz, şêwirmendî, xanî, firotin, lênêrîn. Kartek çapkirî ya bi hejmarek şaş dikeve çopê û pêwendî tê windakirin; rûpelek ku em nû dihêlin rast dimîne. Li ser wê tê ya ku kaxez nikare: mêvan bi destdanek we tomar dike, rasterast telefon dike, navîgasyona navnîşana we vedike an li Instagram we dişopîne — bêyî ku tiştek binivîse. Û ger hûn bixwazin, ew dikare agahiyên xwe jî bihêle ku hûn pê re têkilî daynin.',
  },
  'kt.business.onit': { de: 'Was auf der Karte steht', fr: 'Ce que contient la carte', en: 'What is on the card', tr: 'Kartta neler var', ku: 'Li ser kartê çi heye' },
  'kt.business.p1': {
    de: 'Logo oder Portrait, Ihr Name und eine Zeile darunter',
    fr: 'Logo ou portrait, votre nom et une ligne en dessous',
    en: 'Logo or portrait, your name and a line beneath it',
    tr: 'Logo veya portre, adınız ve altında bir satır',
    ku: 'Logo an wêne, navê we û rêzek li binî',
  },
  'kt.business.p2': {
    de: 'Telefon, E-Mail, Adresse und Website — alles antippbar, die Adresse öffnet die Karte',
    fr: 'Téléphone, e-mail, adresse et site — tout cliquable, l’adresse ouvre le plan',
    en: 'Phone, e-mail, address and website — all tappable, the address opens the map',
    tr: 'Telefon, e-posta, adres ve web — hepsi dokunulabilir, adres haritayı açar',
    ku: 'Telefon, e-name, navnîşan û malper — hemû bi destdanê, navnîşan nexşeyê vedike',
  },
  'kt.business.p3': {
    de: 'Ihre Links: Instagram, WhatsApp, LinkedIn, Spotify, YouTube und mehr',
    fr: 'Vos liens : Instagram, WhatsApp, LinkedIn, Spotify, YouTube et d’autres',
    en: 'Your links: Instagram, WhatsApp, LinkedIn, Spotify, YouTube and more',
    tr: 'Linkleriniz: Instagram, WhatsApp, LinkedIn, Spotify, YouTube ve daha fazlası',
    ku: 'Girêdanên we: Instagram, WhatsApp, LinkedIn, Spotify, YouTube û hêj bêtir',
  },
  'kt.business.p4': {
    de: '„Zu Kontakten hinzufügen" — ein Tippen, und Sie stehen im Adressbuch',
    fr: '« Ajouter aux contacts » — un geste et vous êtes dans le répertoire',
    en: '“Save to contacts” — one tap and you are in the address book',
    tr: '“Rehbere kaydet” — bir dokunuş ve rehberdesiniz',
    ku: '„Têxe nav pêwendiyan" — destdanek û hûn di pêwendiyan de ne',
  },
  'kt.business.p5': {
    de: 'Auf Wunsch ein Kontaktbogen: der Gast lässt seine Daten bei Ihnen, Sie sehen sie im Portal',
    fr: 'En option, un formulaire : le visiteur laisse ses coordonnées, vous les voyez dans le portail',
    en: 'Optionally a contact form: the visitor leaves their details and you see them in the portal',
    tr: 'İsteğe bağlı bilgi formu: ziyaretçi bilgilerini bırakır, siz panelde görürsünüz',
    ku: 'Bi daxwaz formek: mêvan agahiyên xwe dihêle, hûn wan di portalê de dibînin',
  },
  'kt.business.p6': {
    de: 'Die Sprache der Karte: Deutsch, Französisch, Englisch, Türkisch oder Kurdisch',
    fr: 'La langue de la carte : allemand, français, anglais, turc ou kurde',
    en: 'The card’s language: German, French, English, Turkish or Kurdish',
    tr: 'Kartın dili: Almanca, Fransızca, İngilizce, Türkçe ya da Kürtçe',
    ku: 'Zimanê kartê: Almanî, Fransî, Îngilîzî, Tirkî an Kurdî',
  },

  // ── Geschenkkarte ─────────────────────────────────────────
  'kt.gift.title': {
    de: 'Eine Karte,<br /><em>die eine Seite erzählt</em>.',
    fr: 'Une carte<br /><em>qui raconte une page</em>.',
    en: 'A card<br /><em>that tells a page</em>.',
    tr: 'Bir sayfa anlatan<br /><em>bir kart</em>.',
    ku: 'Kartek<br /><em>ku rûpelek vedibêje</em>.',
  },
  'kt.gift.intro': {
    de: 'Zum Geburtstag, zur Hochzeit, zum Abschied: die Karte in der Hand, das Handy daran — und es öffnet sich eine Seite mit Ihren Fotos, Ihrem Text und dem Lied, das dazugehört.',
    fr: 'Pour un anniversaire, un mariage, un départ : la carte en main, le téléphone approché — et s’ouvre une page avec vos photos, votre texte et la chanson qui va avec.',
    en: 'For a birthday, a wedding, a farewell: the card in hand, the phone against it — and a page opens with your photos, your words and the song that belongs to it.',
    tr: 'Doğum günü, düğün, veda: kart elde, telefon yaklaşıyor — ve fotoğraflarınız, yazdıklarınız ve ona ait şarkının olduğu bir sayfa açılıyor.',
    ku: 'Ji bo rojbûn, dawet, xatirxwestin: kart di destê de, telefon nêzîk — û rûpelek vedibe bi wêneyên we, nivîsa we û strana ku lê tê.',
  },
  'kt.gift.long': {
    de: 'Ein Geschenk, das man behält, weil es nicht aufgebraucht wird: die Karte bleibt im Portemonnaie, und die Seite dahinter bleibt, solange sie soll. Sie schicken uns die Fotos, den Text und den Link zu einem Lied; wir bauen daraus eine Seite, die auf jedem Handy sofort lädt — ohne App, ohne Anmeldung, ohne Werbung. Wer die Karte antippt, sieht genau das, was Sie geschrieben haben, und niemand sonst bekommt die Adresse, denn die Seite steht in keiner Suchmaschine.',
    fr: 'Un cadeau qu’on garde parce qu’il ne s’épuise pas : la carte reste dans le portefeuille et la page derrière reste aussi longtemps qu’il le faut. Vous nous envoyez les photos, le texte et le lien d’une chanson ; nous en faisons une page qui s’ouvre aussitôt sur n’importe quel téléphone — sans application, sans compte, sans publicité. Celui qui approche la carte voit exactement ce que vous avez écrit, et personne d’autre n’obtient l’adresse : la page n’apparaît dans aucun moteur de recherche.',
    en: 'A present you keep because it does not get used up: the card stays in the wallet and the page behind it stays as long as it should. You send us the photos, the text and a link to a song; we make a page from it that loads at once on any phone — no app, no sign-up, no advertising. Whoever taps the card sees exactly what you wrote, and nobody else gets the address, because the page is in no search engine.',
    tr: 'Tükenmediği için saklanan bir hediye: kart cüzdanda kalır, arkasındaki sayfa da gerektiği kadar. Fotoğrafları, yazıyı ve bir şarkının linkini bize gönderirsiniz; biz bundan her telefonda anında açılan bir sayfa yaparız — uygulama yok, kayıt yok, reklam yok. Kartı okutan tam olarak sizin yazdığınızı görür; adresi başka kimse bulamaz, çünkü sayfa hiçbir arama motorunda yer almaz.',
    ku: 'Diyariyek ku tê parastin ji ber ku naqede: kart di berîkê de dimîne û rûpela li pişt wê bi qasî ku divê dimîne. Hûn wêne, nivîs û girêdana stranekê ji me re dişînin; em jê rûpelek çêdikin ku li her telefonê yekser vedibe — ne sepan, ne tomarkirin, ne reklam. Yê ku kartê destdide tam wê dibîne ku we nivîsî, û kesek din navnîşanê nabîne, ji ber ku rûpel di tu motora lêgerînê de nîne.',
  },
  'kt.gift.onit': { de: 'Was die Seite zeigt', fr: 'Ce que montre la page', en: 'What the page shows', tr: 'Sayfada neler var', ku: 'Rûpel çi nîşan dide' },
  'kt.gift.p1': {
    de: 'Eine Überschrift, für wen und von wem',
    fr: 'Un titre, pour qui et de qui',
    en: 'A headline, for whom and from whom',
    tr: 'Bir başlık, kime ve kimden',
    ku: 'Sernavek, ji bo kê û ji kê',
  },
  'kt.gift.p2': {
    de: 'Ihr Text, so lang wie Sie möchten — Zeilenumbrüche bleiben erhalten',
    fr: 'Votre texte, aussi long que vous voulez — les retours à la ligne sont conservés',
    en: 'Your text, as long as you like — line breaks are kept',
    tr: 'İstediğiniz kadar uzun metniniz — satır sonları korunur',
    ku: 'Nivîsa we, bi qasî ku hûn dixwazin — şikandinên rêzê tên parastin',
  },
  'kt.gift.p3': {
    de: 'Bis zu acht Fotos, in der Reihenfolge, die Sie festlegen',
    fr: 'Jusqu’à huit photos, dans l’ordre que vous choisissez',
    en: 'Up to eight photos, in the order you choose',
    tr: 'Sekize kadar fotoğraf, sizin belirlediğiniz sırada',
    ku: 'Heta heşt wêne, bi rêza ku hûn diyar dikin',
  },
  'kt.gift.p4': {
    de: 'Der Link zu einem Lied — Spotify, YouTube, Apple Music',
    fr: 'Le lien vers une chanson — Spotify, YouTube, Apple Music',
    en: 'A link to a song — Spotify, YouTube, Apple Music',
    tr: 'Bir şarkının linki — Spotify, YouTube, Apple Music',
    ku: 'Girêdana stranekê — Spotify, YouTube, Apple Music',
  },
  'kt.gift.p5': {
    de: 'Drei Gestaltungen: hell, dunkel oder warm',
    fr: 'Trois habillages : clair, sombre ou chaud',
    en: 'Three looks: light, dark or warm',
    tr: 'Üç tasarım: açık, koyu ya da sıcak',
    ku: 'Sê sêwiran: ronî, tarî an germ',
  },
  'kt.gift.p6': {
    de: 'Nicht in Suchmaschinen — die Seite findet nur, wer die Karte hat',
    fr: 'Absente des moteurs de recherche — seule la carte donne accès à la page',
    en: 'Not in search engines — only whoever holds the card finds the page',
    tr: 'Arama motorlarında yok — sayfayı sadece kartı olan bulur',
    ku: 'Di motorên lêgerînê de nîne — tenê yê ku kart pê re heye rûpelê dibîne',
  },

  // ── SEO ───────────────────────────────────────────────────
  'seo.kt.business.title': {
    de: 'Digitale Visitenkarte mit NFC — Breisgau Digital Freiburg',
    fr: 'Carte de visite numérique NFC — Breisgau Digital Fribourg',
    en: 'Digital business card with NFC — Breisgau Digital Freiburg',
    tr: 'NFC’li dijital kartvizit — Breisgau Digital Freiburg',
    ku: 'Karta karsaziyê ya dîjîtal bi NFC — Breisgau Digital Freiburg',
  },
  'seo.kt.gift.title': {
    de: 'NFC-Geschenkkarte mit Fotos und Musik — Breisgau Digital',
    fr: 'Carte cadeau NFC avec photos et musique — Breisgau Digital',
    en: 'NFC gift card with photos and music — Breisgau Digital',
    tr: 'Fotoğraflı ve müzikli NFC hediye kartı — Breisgau Digital',
    ku: 'Karta diyariyê ya NFC bi wêne û muzîk — Breisgau Digital',
  },
};
