import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Produktseiten unter /bewertungskarten/<kurzname>.
 *
 * Preise stehen nirgends in diesen Texten — die kommen aus dem Katalog
 * (src/app/core/data/catalog.ts) und werden im Admin-Portal gepflegt. Sonst
 * müsste man bei jeder Preisänderung fünf Sprachen nachziehen.
 *
 * Die langen Texte je Produkt (`pd.<kurzname>.long`) sind die Seiten, die bei
 * Google landen: jede beschreibt ein Produkt, keine wiederholt die andere.
 */
export const PRODUCT_CONTENT: Record<string, Entry> = {
  // ── Seitengerüst ──────────────────────────────────────────
  'pd.back': { de: 'Alle Produkte', fr: 'Tous les produits', en: 'All products', tr: 'Tüm ürünler', ku: 'Hemû berhem' },
  'pd.incl': { de: 'Immer dabei', fr: 'Toujours inclus', en: 'Always included', tr: 'Her zaman dahil', ku: 'Her tim tê de' },
  'pd.inc1': {
    de: 'NFC-Chip und QR-Code — funktioniert mit jedem Handy, auch ohne App.',
    fr: 'Puce NFC et QR code — fonctionne avec tous les téléphones, sans application.',
    en: 'NFC chip and QR code — works with any phone, no app needed.',
    tr: 'NFC çipi ve QR kodu — uygulama olmadan her telefonda çalışır.',
    ku: 'Çîpa NFC û koda QR — bi her telefonê dixebite, bêyî sepan.',
  },
  'pd.inc2': {
    de: 'Druck mit Ihrem Logo und Ihren Farben, von uns eingerichtet.',
    fr: 'Impression avec votre logo et vos couleurs, configurée par nous.',
    en: 'Printed with your logo and colours, set up by us.',
    tr: 'Logonuz ve renklerinizle baskı, kurulumu bizden.',
    ku: 'Çap bi logo û rengên we, ji me ve tê sazkirin.',
  },
  'pd.inc3': {
    de: 'Verknüpfung mit Ihrem Google-Profil — Sie schicken uns nur den Link.',
    fr: 'Liaison avec votre fiche Google — vous nous envoyez juste le lien.',
    en: 'Linked to your Google profile — you just send us the link.',
    tr: 'Google profilinizle bağlantı — bize sadece linki gönderin.',
    ku: 'Girêdan bi profîla we ya Google — hûn tenê girêdanê dişînin.',
  },
  'pd.inc4': {
    de: 'Kein Abo, keine laufenden Kosten: einmal zahlen, dauerhaft nutzen.',
    fr: 'Sans abonnement ni frais récurrents : un paiement, utilisation illimitée.',
    en: 'No subscription, no running costs: pay once, use it for good.',
    tr: 'Abonelik yok, aylık ödeme yok: bir kez öde, sürekli kullan.',
    ku: 'Bê abone, bê lêçûnên mehane: carekê bide, her tim bikar bîne.',
  },
  'pd.contains': { de: 'Im Paket enthalten', fr: 'Contenu de la formule', en: "What's in the bundle", tr: 'Pakette neler var', ku: 'Di pakêtê de çi heye' },
  'pd.cart': { de: 'Zum Warenkorb', fr: 'Voir le panier', en: 'Go to cart', tr: 'Sepete git', ku: 'Biçe selikê' },
  'pd.inbasket': { de: 'Im Warenkorb', fr: 'Dans le panier', en: 'In your cart', tr: 'Sepette', ku: 'Di selikê de' },
  'pd.ask': { de: 'Per E-Mail anfragen', fr: 'Demander par e-mail', en: 'Ask by e-mail', tr: 'E-posta ile sor', ku: 'Bi e-nameyê bipirse' },
  'pd.closed': {
    de: 'Die Online-Bestellung ist gerade geschlossen. Schreiben Sie uns — wir melden uns am selben Werktag.',
    fr: 'La commande en ligne est momentanément fermée. Écrivez-nous : réponse le jour ouvré même.',
    en: 'Online ordering is closed right now. Write to us — we reply the same working day.',
    tr: 'Online sipariş şu an kapalı. Bize yazın — aynı iş günü dönüş yapıyoruz.',
    ku: 'Siparîşa serhêl niha girtî ye. Ji me re binivîsin — em heman rojê bersiv didin.',
  },
  'pd.faq': {
    de: 'Häufige Fragen und Beispiel-Designs finden Sie auf der Übersichtsseite.',
    fr: 'Questions fréquentes et exemples de design sur la page d’aperçu.',
    en: 'Frequently asked questions and design samples are on the overview page.',
    tr: 'Sık sorulan sorular ve örnek tasarımlar genel bakış sayfasında.',
    ku: 'Pirsên berbiçav û mînakên sêwiranê li rûpela giştî ne.',
  },
  'pd.notfound.title': { de: 'Dieses Produkt gibt es nicht.', fr: 'Ce produit n’existe pas.', en: 'No such product.', tr: 'Böyle bir ürün yok.', ku: 'Berhemek wiha tune.' },
  'pd.notfound.text': {
    de: 'Der Link zeigt auf ein Produkt, das es nicht (mehr) gibt. In der Übersicht finden Sie alle aktuellen Karten und Pakete.',
    fr: 'Ce lien renvoie vers un produit qui n’existe plus. L’aperçu présente toutes les cartes et formules actuelles.',
    en: 'This link points to a product that no longer exists. The overview lists all current cards and bundles.',
    tr: 'Bu link artık olmayan bir ürüne gidiyor. Güncel tüm kartlar ve paketler genel bakışta.',
    ku: 'Ev girêdan berhemek ku nema heye nîşan dide. Hemû kart û pakêtên heyî li rûpela giştî ne.',
  },
  'pd.details': { de: 'Details', fr: 'Détails', en: 'Details', tr: 'Detaylar', ku: 'Kîtekît' },

  // ── Einzelprodukte ────────────────────────────────────────
  'pd.karte.long': {
    de: 'Die Karte im Format einer Bankkarte ist das Stück, das am Tresen, am Tisch oder an der Kasse in die Hand gegeben wird. Der Gast hält sein Handy dran, die Google-Bewertung öffnet sich sofort — kein Suchen, kein Abtippen, kein Erklären. Gedruckt wird auf stabilem Kunststoff mit Ihrem Logo; der NFC-Chip sitzt innen und ist von außen nicht zu sehen. Wer kein NFC hat, scannt den QR-Code auf der Rückseite. Für Teams lohnt sich eine Karte pro Person: so fragt jeder selbst nach der Bewertung, statt sie an der Theke zu sammeln.',
    fr: 'Au format d’une carte bancaire, c’est l’objet que l’on tend au comptoir, à table ou à la caisse. Le client approche son téléphone, l’avis Google s’ouvre aussitôt : rien à chercher, rien à saisir, rien à expliquer. Impression sur plastique rigide avec votre logo ; la puce NFC est intégrée, invisible de l’extérieur. Sans NFC, le QR code au verso fait le travail. Pour une équipe, comptez une carte par personne : chacun demande son avis au lieu d’attendre au comptoir.',
    en: 'Bank-card sized, this is the piece you hand over at the counter, at the table or at the till. The guest holds their phone against it and the Google review opens straight away — nothing to search for, nothing to type, nothing to explain. Printed on solid plastic with your logo; the NFC chip sits inside and is invisible from the outside. No NFC? The QR code on the back does the job. For teams, one card per person pays off: everyone asks for their own review instead of leaving it at the counter.',
    tr: 'Banka kartı boyutundaki bu kart, tezgâhta, masada ya da kasada müşterinin eline verilen parçadır. Misafir telefonunu yaklaştırır, Google değerlendirmesi anında açılır — arama yok, yazma yok, anlatma yok. Logonuzla sağlam plastiğe basılır; NFC çipi içindedir, dışarıdan görünmez. NFC’si olmayan arkadaki QR kodu okutur. Ekipler için kişi başı bir kart mantıklı: herkes kendi değerlendirmesini ister, tezgâhta beklemez.',
    ku: 'Ev kart bi mezinahiya kartek bankê ye û ew perçe ye ku li ber tezgeh, li maseyê an li qasê tê dayîn. Mêvan telefona xwe nêzîk dike û nirxandina Google yekser vedibe — ne lêgerîn, ne nivîsîn, ne şirovekirin. Bi logoya we li ser plastîkek qewîn tê çapkirin; çîpa NFC li hundir e û ji derve nayê dîtin. Yê ku NFC tune koda QR ya li pişt dixwîne. Ji bo tîmê kartek ji bo her kesî hêja ye: her kes nirxandina xwe dixwaze.',
  },
  'pd.aufsteller.long': {
    de: 'Der Tischaufsteller steht dauerhaft da, wo gewartet oder gezahlt wird: auf dem Tresen, am Empfang, auf dem Tisch. Er fragt, ohne dass jemand fragen muss — gerade in Betrieben, in denen zum Bezahlen niemand mehr an die Kasse kommt. Massiver Standfuß, Druck beidseitig mit Ihrem Logo, NFC-Chip und QR-Code auf der Vorderseite. Zwei Aufsteller sind erfahrungsgemäß besser als einer: einer drinnen, einer auf der Terrasse oder am zweiten Ausgang.',
    fr: 'Le chevalet de table reste en place là où l’on attend ou l’on paie : sur le comptoir, à l’accueil, sur la table. Il demande sans que personne n’ait à demander — utile surtout là où plus personne ne passe en caisse. Socle massif, impression recto-verso avec votre logo, puce NFC et QR code en façade. Deux chevalets valent mieux qu’un : un à l’intérieur, un en terrasse ou à la seconde sortie.',
    en: 'The table stand stays where people wait or pay: on the counter, at reception, on the table. It asks without anyone having to ask — which matters in places where nobody walks up to the till any more. Solid base, printed on both sides with your logo, NFC chip and QR code on the front. Two stands beat one: one inside, one on the terrace or at the second exit.',
    tr: 'Masa standı, beklenen ya da ödeme yapılan yerde sürekli durur: tezgâhta, resepsiyonda, masada. Kimse sormak zorunda kalmadan o sorar — özellikle kimsenin kasaya gelmediği işletmelerde. Sağlam ayak, iki yüzü logonuzla baskılı, ön yüzde NFC çipi ve QR kodu. Tecrübeyle: iki stand birden iyidir — biri içeride, biri terasta ya da ikinci çıkışta.',
    ku: 'Sêpayê maseyê her tim li wê derê dimîne ku mirov li bendê dimîne an dide: li tezgeh, li pêşwazî, li maseyê. Ew dipirse bêyî ku kesek bipirse — bi taybetî li wan cihan ku kes nayê qasê. Bingehek qewîn, çap li herdu alî bi logoya we, çîpa NFC û koda QR li pêş. Du sêpa ji yekê çêtir in: yek hundir, yek li terasê an li derketina duyemîn.',
  },
  'pd.aufkleber.long': {
    de: 'Der Aufkleber geht dorthin, wo kein Platz für einen Aufsteller ist: auf das Kartenlesegerät, an die Tür, an den Spiegel, an die Theke. Er klebt auf glatten Flächen dauerhaft, hält Reinigungsmittel aus und lässt sich rückstandsfrei wieder abziehen. Der NFC-Chip liegt unter dem Druck; das Handy erkennt ihn, sobald es nah genug ist. Sie bekommen zwei Stück — meist einer beim Bezahlen und einer am Ausgang, denn genau dort entscheidet sich, ob eine Bewertung noch kommt.',
    fr: 'L’autocollant va là où un chevalet ne tient pas : sur le terminal de paiement, sur la porte, sur le miroir, sur le comptoir. Il adhère durablement aux surfaces lisses, résiste aux produits d’entretien et se retire sans résidu. La puce NFC est sous l’impression ; le téléphone la détecte dès qu’il est assez près. Deux exemplaires fournis — en général un au paiement et un à la sortie, car c’est là que l’avis se décide.',
    en: 'The sticker goes where a stand does not fit: on the card reader, on the door, on the mirror, on the counter. It sticks to smooth surfaces for good, survives cleaning products and peels off without residue. The NFC chip sits under the print; the phone picks it up as soon as it is close enough. You get two — usually one at the payment terminal and one at the exit, because that is where a review is won or lost.',
    tr: 'Etiket, standın sığmadığı yere gider: POS cihazına, kapıya, aynaya, tezgâha. Düz yüzeylere kalıcı yapışır, temizlik maddesine dayanır, iz bırakmadan sökülür. NFC çipi baskının altındadır; telefon yeterince yaklaşınca algılar. İki adet gelir — genelde biri ödeme noktasına, biri çıkışa, çünkü değerlendirme tam orada kazanılır.',
    ku: 'Etîket dere wê derê ku sêpa lê nagire: li ser cîhaza kartê, li derî, li neynikê, li tezgeh. Li rûyên şil bi awayek domdar dizeliqe, li hember maddeyên paqijkirinê disekine û bêyî şop tê rakirin. Çîpa NFC di bin çapê de ye; telefon gava nêzîk bibe wê dibîne. Du heb tên — yek li cihê dayinê, yek li derketinê.',
  },
  'pd.schluesselanhaenger.long': {
    de: 'Der Schlüsselanhänger ist die Karte für unterwegs: am Schlüsselbund, am Werkzeugkoffer, am Rucksack. Für Handwerk, Lieferdienste, Pflege und alle, die beim Kunden sind und nicht im Laden — die Bewertung wird direkt an der Haustür gefragt, solange der Eindruck frisch ist. Robustes Material, Druck mit Ihrem Logo, NFC-Chip innen und QR-Code auf der Rückseite. Gleiche Technik wie die Karte, nur handlicher.',
    fr: 'Le porte-clés, c’est la carte en déplacement : sur le trousseau, la caisse à outils, le sac à dos. Pour l’artisanat, la livraison, les soins à domicile et tous ceux qui sont chez le client plutôt qu’en boutique — l’avis se demande sur le pas de la porte, tant que l’impression est fraîche. Matériau robuste, impression avec votre logo, puce NFC à l’intérieur et QR code au verso. Même technique que la carte, en plus maniable.',
    en: 'The keyring is the card for the road: on the key ring, on the tool case, on the backpack. For trades, delivery, care work and anyone who is at the customer rather than in a shop — the review gets asked for at the front door, while the impression is still fresh. Tough material, printed with your logo, NFC chip inside and QR code on the back. Same technology as the card, just handier.',
    tr: 'Anahtarlık, yoldaki karttır: anahtar demetinde, takım çantasında, sırt çantasında. Ustalar, kurye, evde bakım ve dükkânda değil müşteride olan herkes için — değerlendirme kapının önünde, izlenim tazeyken istenir. Sağlam malzeme, logonuzla baskı, içinde NFC çipi, arkada QR kodu. Kartla aynı teknoloji, sadece daha pratik.',
    ku: 'Bendika kilîtê kartê rê ye: li gûzana kilîtan, li sindoqa amûran, li tûrikê pişt. Ji bo pîşesaz, gihandin, lênêrîn û her kesê ku li cem xerîdar e û ne di dikanê de — nirxandin li ber derî tê xwestin, hêj bandor nû ye. Materyalek qewîn, çap bi logoya we, çîpa NFC li hundir û koda QR li pişt. Heman teknîk wek kartê, tenê bikêrhatîtir.',
  },

  // ── Pakete ────────────────────────────────────────────────
  'pd.paket-einzel.long': {
    de: 'Das kleinste Paket für den Anfang: eine Karte, eingerichtet auf Ihr Google-Profil, fertig zum Hinlegen. Gedacht für Einzelbetriebe und für alle, die erst sehen wollen, ob das funktioniert, bevor sie mehr bestellen. Der Ablauf ist derselbe wie bei den großen Paketen — Sie schicken Logo und Google-Link, wir schicken den Entwurf zur Freigabe, danach kommt die Karte per Post. Nachbestellen können Sie jederzeit einzeln.',
    fr: 'La plus petite formule pour commencer : une carte, configurée sur votre fiche Google, prête à poser. Pensée pour les indépendants et pour ceux qui veulent d’abord vérifier que ça marche. Le déroulé est celui des grandes formules — vous envoyez logo et lien Google, nous envoyons la maquette à valider, puis la carte partira par la poste. Réassort possible à l’unité, à tout moment.',
    en: 'The smallest bundle to start with: one card, set up for your Google profile, ready to put down. Meant for one-person businesses and for anyone who wants to see whether this works before ordering more. The process is the same as for the bigger bundles — you send logo and Google link, we send the draft for approval, then the card goes out by post. You can reorder single items any time.',
    tr: 'Başlangıç için en küçük paket: bir kart, Google profilinize kurulmuş, koymaya hazır. Tek kişilik işletmeler ve önce işe yarayıp yaramadığını görmek isteyenler için. Akış büyük paketlerle aynı — logo ve Google linkini gönderirsiniz, biz taslağı onaya yollarız, sonra kart postayla gelir. Tek tek yeniden sipariş her zaman mümkün.',
    ku: 'Pakêta herî biçûk ji bo destpêkê: kartek, li gorî profîla we ya Google hatiye sazkirin, amade ye. Ji bo karsaziyên yek kesî û ji bo wan ên ku dixwazin pêşî bibînin ka ev dixebite. Rêvebirin wek pakêtên mezin e — hûn logo û girêdana Google dişînin, em pêşnûmeyê ji bo pejirandinê dişînin, paşê kart bi posteyê tê. Hûn her dem dikarin yek bi yek zêde bikin.',
  },
  'pd.paket-team.long': {
    de: 'Drei Karten für drei Personen — das Paket für Teams, in denen jeder selbst mit dem Gast spricht: Friseur, Werkstatt, Praxis, Restaurant mit Service. Jede Karte trägt dasselbe Design und zeigt auf dasselbe Google-Profil; wer möchte, bekommt den Namen der Person mit aufgedruckt. Drei Karten kosten weniger als drei einzelne, und im Alltag ist das der Unterschied zwischen „wir haben eine Karte irgendwo" und „jeder hat seine dabei".',
    fr: 'Trois cartes pour trois personnes — la formule des équipes où chacun parle au client : coiffeur, atelier, cabinet, restaurant avec service. Même design pour chaque carte, même fiche Google ; le prénom de la personne peut être imprimé. Trois cartes coûtent moins que trois à l’unité, et au quotidien c’est la différence entre « on a une carte quelque part » et « chacun a la sienne ».',
    en: 'Three cards for three people — the bundle for teams where everyone talks to the guest themselves: hairdresser, workshop, practice, restaurant with table service. Every card carries the same design and points at the same Google profile; the person’s name can be printed on it. Three cards cost less than three single ones, and day to day that is the difference between "there is a card somewhere" and "everyone has theirs on them".',
    tr: 'Üç kişi için üç kart — misafirle herkesin kendi konuştuğu ekipler için: kuaför, servis, muayenehane, garsonlu restoran. Her kart aynı tasarımı taşır ve aynı Google profiline gider; isteyene kişinin adı da basılır. Üç kart, üç tek karttan daha ucuz; günlük hayatta fark şu: “bir yerde bir kart var” yerine “herkesin kendi kartı yanında”.',
    ku: 'Sê kart ji bo sê kesan — pakêta tîmên ku her kes bi xwe bi mêvan dipeyive: berber, atolye, klînîk, xwaringeh bi xizmet. Her kart heman sêwiranê hildigire û heman profîla Google nîşan dide; navê kesê jî dikare li ser were çapkirin. Sê kart ji sê kartên yek bi yek erzantir in, û di rojane de ev cudahî ye: „kartek li derekê ye“ an „her kes ya xwe pê re ye“.',
  },
  'pd.paket-tresen.long': {
    de: 'Ein Tischaufsteller plus drei Karten: der Aufsteller fragt dauerhaft am Tresen, die Karten gehen mit dem Team an den Tisch oder in die Hand. Das ist der Zuschnitt für Gastronomie, Salons und alles mit Laufkundschaft — der feste Platz erwischt die, die warten, die Karten die, die schon gezahlt haben und gerade gehen. Gegenüber den Einzelpreisen sparen Sie mit dem Paket; eingerichtet und aufeinander abgestimmt ist beides sowieso.',
    fr: 'Un chevalet de table et trois cartes : le chevalet demande en continu au comptoir, les cartes accompagnent l’équipe en salle. C’est le bon format pour la restauration, les salons et tout commerce de passage — le poste fixe attrape ceux qui attendent, les cartes ceux qui ont payé et s’en vont. La formule coûte moins que les pièces séparées ; la configuration et le design assortis sont compris.',
    en: 'One table stand plus three cards: the stand keeps asking at the counter, the cards go with the team to the table or into someone’s hand. This is the fit for hospitality, salons and any walk-in trade — the fixed spot catches the ones who wait, the cards catch the ones who have paid and are leaving. The bundle costs less than the parts; set-up and matching design are included either way.',
    tr: 'Bir masa standı artı üç kart: stand tezgâhta sürekli sorar, kartlar ekiple masaya ya da elden ele gider. Restoran, kuaför ve yoldan müşteri alan her yer için doğru ölçü — sabit nokta bekleyenleri yakalar, kartlar ödeyip çıkanları. Paket, tek tek almaktan daha ucuz; kurulum ve uyumlu tasarım her hâlükârda dahil.',
    ku: 'Sêpayek maseyê û sê kart: sêpa li tezgeh bi domdarî dipirse, kart bi tîmê re diçin maseyê an destê mirov. Ev pîvana rast e ji bo xwaringeh, salon û her karê ku xerîdarên derbasbûyî hene — cihê sabît wan digire ku li bendê ne, kart wan ên ku dane û derdikevin. Pakêt ji perçeyan erzantir e; sazkirin û sêwirana lihevhatî di her rewşê de tê de ne.',
  },
};
