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
  'nav.smarthome': { de: 'Smart Home', fr: 'Maison connectée', en: 'Smart home', tr: 'Akıllı ev', ku: 'Mala biaqil' },
  'nav.references': { de: 'Referenzen', fr: 'Références', en: 'References', tr: 'Referanslar', ku: 'Referans' },
  'nav.cta': { de: 'Erstgespräch', fr: 'Premier échange', en: 'Free consultation', tr: 'Ücretsiz görüşme', ku: 'Hevdîtina belaş' },
  'nav.menu': { de: 'Menü', fr: 'Menu', en: 'Menu', tr: 'Menü', ku: 'Menû' },
  'cta.consult': {
    de: 'Kostenloses Erstgespräch', fr: 'Premier échange gratuit', en: 'Free consultation', tr: 'Ücretsiz ön görüşme', ku: 'Hevdîtina yekem a belaş',
  },
  'cta.products': { de: 'Produkte ansehen', fr: 'Voir les produits', en: 'See products', tr: 'Ürünleri gör', ku: 'Berheman bibîne' },
  'cta.call': { de: 'Anrufen', fr: 'Appeler', en: 'Call', tr: 'Ara', ku: 'Telefon bike' },
  'cta.whatsapp': { de: 'WhatsApp', fr: 'WhatsApp', en: 'WhatsApp', tr: 'WhatsApp', ku: 'WhatsApp' },
  'cta.request_short': { de: 'Anfrage', fr: 'Demande', en: 'Enquire', tr: 'Talep', ku: 'Daxwaz' },
  'cta.more_about': { de: 'Mehr über uns', fr: 'En savoir plus', en: 'More about us', tr: 'Hakkımızda', ku: 'Bêtir derbarê me' },
  'price.from': { de: 'ab {p} €', fr: 'dès {p} €', en: 'from €{p}', tr: '{p} €’dan itibaren', ku: 'ji {p} € ve' },
  'home.prod.label': { de: 'Produkte', fr: 'Produits', en: 'Products', tr: 'Ürünler', ku: 'Berhem' },
  'home.prod.cards.tag': { de: 'Bestseller', fr: 'Best-seller', en: 'Bestseller', tr: 'En çok satan', ku: 'Herî zêde tê firotin' },
  'home.prod.cards.title': {
    de: 'Google-Bewertungskarten', fr: 'Cartes d’avis Google', en: 'Google review cards', tr: 'Google değerlendirme kartları', ku: 'Kartên nirxandinê yên Google',
  },
  'home.prod.cards.text': {
    de: 'Ihr Kunde hält das Handy an die Karte, Ihr Google-Bewertungsformular öffnet sich. Mehr Bewertungen, ohne jedes Mal zu fragen.',
    fr: 'Le client approche son téléphone de la carte et votre formulaire d’avis Google s’ouvre. Plus d’avis, sans devoir demander à chaque fois.',
    en: 'Customers hold their phone to the card and your Google review form opens. More reviews without asking every time.',
    tr: 'Müşteriniz telefonunu karta yaklaştırır, Google yorum formunuz açılır. Her seferinde rica etmeden daha fazla yorum.',
    ku: 'Xerîdar telefonê nêzîkî kartê dike û forma nirxandina we ya Google vedibe. Bêtir nirxandin, bêyî ku her carê bipirsin.',
  },
  'home.prod.cards.p1': { de: 'NFC-Chip plus QR-Code', fr: 'Puce NFC et QR code', en: 'NFC chip plus QR code', tr: 'NFC çip ve QR kod', ku: 'Çîpa NFC û koda QR' },
  'home.prod.cards.p2': { de: 'Mit Ihrem Namen oder Logo', fr: 'Avec votre nom ou logo', en: 'With your name or logo', tr: 'Adınız veya logonuzla', ku: 'Bi nav an logoya we' },
  'home.prod.cards.p3': { de: 'Für iPhone und Android', fr: 'Pour iPhone et Android', en: 'Works on iPhone and Android', tr: 'iPhone ve Android ile çalışır', ku: 'Ji bo iPhone û Android' },
  'home.prod.cards.cta': { de: 'Pakete & Preise', fr: 'Offres et prix', en: 'Packages & prices', tr: 'Paketler ve fiyatlar', ku: 'Pakêt û biha' },
  'home.prod.cards.alt': {
    de: 'NFC-Bewertungskarte mit QR-Code auf einem Holztresen, daneben ein Smartphone mit geöffnetem Bewertungsformular',
    fr: 'Carte d’avis NFC avec QR code sur un comptoir en bois, à côté d’un smartphone affichant le formulaire d’avis',
    en: 'NFC review card with a QR code on a wooden counter, next to a smartphone showing the review form',
    tr: 'Ahşap tezgâhta QR kodlu NFC değerlendirme kartı ve yanında yorum formu açık bir akıllı telefon',
    ku: 'Karta nirxandinê ya NFC bi koda QR li ser tezgeheke darîn, li teniştê telefoneke ku forma nirxandinê vekirî ye',
  },
  'home.prod.web.tag': { de: 'Neukunden gewinnen', fr: 'Gagner des clients', en: 'Win new customers', tr: 'Yeni müşteri kazanın', ku: 'Xerîdarên nû bi dest bixin' },
  'home.prod.web.title': { de: 'Websites & Homepages', fr: 'Sites web', en: 'Websites', tr: 'Web siteleri', ku: 'Malper' },
  'home.prod.web.text': {
    de: 'Eine Website, die auf dem Handy überzeugt, bei Google gefunden wird und aus Besuchern Anfragen macht — mit Texten, Fotos und Pflege aus einer Hand.',
    fr: 'Un site qui convainc sur mobile, qu’on trouve sur Google et qui transforme les visiteurs en demandes — textes, photos et suivi compris.',
    en: 'A website that convinces on mobile, gets found on Google and turns visitors into enquiries — copy, photos and upkeep from one source.',
    tr: 'Mobilde ikna eden, Google’da bulunan ve ziyaretçileri talebe dönüştüren bir web sitesi — metin, fotoğraf ve bakım tek elden.',
    ku: 'Malperek ku li ser mobîlê qanih dike, li Google tê dîtin û mêvanan dike daxwaz — bi nivîs, wêne û lênêrînê ji destekî.',
  },
  'home.prod.web.p1': { de: 'Für das Handy gebaut, schnell geladen', fr: 'Pensé pour le mobile, rapide', en: 'Built for mobile, fast to load', tr: 'Mobil için tasarlanmış, hızlı', ku: 'Ji bo mobîlê hatiye çêkirin, zû bar dibe' },
  'home.prod.web.p2': { de: 'Lokal auffindbar bei Google', fr: 'Visible localement sur Google', en: 'Found locally on Google', tr: 'Google’da yerel olarak bulunur', ku: 'Li Google herêmî tê dîtin' },
  'home.prod.web.p3': { de: 'DSGVO-konform mit Impressum', fr: 'Conforme RGPD, mentions légales incluses', en: 'GDPR-compliant, imprint included', tr: 'GDPR (DSGVO) uyumlu, künye dahil', ku: 'Li gorî DSGVO, bi Impressum' },
  'home.prod.web.cta': { de: 'Leistungen ansehen', fr: 'Voir les services', en: 'View services', tr: 'Hizmetleri gör', ku: 'Xizmetan bibîne' },
  'home.prod.web.alt': {
    de: 'Kundenwebsite von Zerin Gold auf einem Laptop und die mobile Website von GKN Bewerbungsfoto auf einem Smartphone',
    fr: 'Site client de Zerin Gold sur un ordinateur portable et site mobile de GKN Bewerbungsfoto sur un smartphone',
    en: 'Client website for Zerin Gold on a laptop and the mobile site of GKN Bewerbungsfoto on a smartphone',
    tr: 'Dizüstü bilgisayarda müşterimiz Zerin Gold’un sitesi, akıllı telefonda GKN Bewerbungsfoto’nun mobil sitesi',
    ku: 'Malpera xerîdar Zerin Gold li ser laptopê û malpera mobîl a GKN Bewerbungsfoto li ser telefonê',
  },
  'home.prod.sh.tag': { de: 'Neu', fr: 'Nouveau', en: 'New', tr: 'Yeni', ku: 'Nû' },
  'home.prod.sh.title': {
    de: 'Smart Home & Automatisierung', fr: 'Maison connectée & automatisation', en: 'Smart home & automation', tr: 'Akıllı ev ve otomasyon', ku: 'Mala biaqil û otomasyon',
  },
  'home.prod.sh.text': {
    de: 'Heizung nach Öffnungszeiten, Licht nach Plan, Türcode für Gäste: Laden, Praxis oder Ferienwohnung steuern sich selbst — lokal und ohne neue Kabel.',
    fr: 'Chauffage selon les horaires, éclairage programmé, code d’accès pour les hôtes : commerce, cabinet ou location se pilotent tout seuls — en local, sans nouveaux câbles.',
    en: 'Heating by opening hours, lighting on schedule, door codes for guests: shops, practices and holiday flats run themselves — locally and without rewiring.',
    tr: 'Açılış saatlerine göre ısıtma, programlı aydınlatma, misafirler için kapı kodu: dükkân, muayenehane veya tatil dairesi kendi kendini yönetir — yerel ve yeni kablo çekmeden.',
    ku: 'Germkirin li gorî demjimêrên vekirinê, ronahî li gorî plan, koda derî ji bo mêvanan: dikan, muayenexane an xaniyê betlaneyê xwe bi xwe birêve diçin — herêmî û bê kabloyên nû.',
  },
  'home.prod.sh.p1': { de: 'Heizkosten senken', fr: 'Réduire les frais de chauffage', en: 'Cut heating costs', tr: 'Isıtma masrafını düşürün', ku: 'Lêçûnên germkirinê kêm bikin' },
  'home.prod.sh.p2': { de: 'Self-Check-in per Türcode', fr: 'Arrivée autonome par code', en: 'Self check-in with door codes', tr: 'Kapı koduyla kendi kendine giriş', ku: 'Ketina xweser bi koda derî' },
  'home.prod.sh.p3': { de: 'Eine App statt fünf', fr: 'Une appli au lieu de cinq', en: 'One app instead of five', tr: 'Beş yerine tek uygulama', ku: 'Li şûna pêncan, sepanek' },
  'home.prod.sh.cta': { de: 'Smart Home entdecken', fr: 'Découvrir', en: 'Explore smart home', tr: 'Akıllı evi keşfet', ku: 'Mala biaqil bibîne' },
  'home.prod.sh.alt': {
    de: 'Smartphone mit Smart-Home-App, daneben Thermostat, Türschloss-Tastatur, Zwischenstecker und Sensoren',
    fr: 'Smartphone avec une appli domotique, à côté d’un thermostat, d’un clavier de serrure, d’une prise connectée et de capteurs',
    en: 'Smartphone with a smart-home app next to a thermostat, a door-lock keypad, a smart plug and sensors',
    tr: 'Akıllı ev uygulaması açık telefon; yanında termostat, kapı kilidi tuş takımı, akıllı priz ve sensörler',
    ku: 'Telefonek bi sepana mala biaqil, li teniştê termostat, klavyeya kilîta derî, prîza biaqil û sensor',
  },
  'footer.col.products': { de: 'Produkte', fr: 'Produits', en: 'Products', tr: 'Ürünler', ku: 'Berhem' },
  'footer.col.company': { de: 'Unternehmen', fr: 'Entreprise', en: 'Company', tr: 'Şirket', ku: 'Şirket' },
};
