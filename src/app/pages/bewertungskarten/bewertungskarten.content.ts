import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Bewertungskarten-Seite für Produktformen und Beispiel-Designs.
 * Werden von BewertungskartenComponent registriert und kommen mit dem
 * Lazy-Chunk der Seite.
 */
export const REVIEW_CARDS_CONTENT: Record<string, Entry> = {
  // ---- Produktformen -------------------------------------------------------
  'rc.forms.label': { de: 'Produktformen', fr: 'Formats', en: 'Formats', tr: 'Ürün çeşitleri', ku: 'Cureyên berhemê' },
  'rc.forms.title': {
    de: 'Karte, Aufsteller, Aufkleber<br /><em>oder Schlüsselanhänger</em>.',
    fr: 'Carte, présentoir, autocollant<br /><em>ou porte-clés</em>.',
    en: 'Card, stand, sticker<br /><em>or keychain</em>.',
    tr: 'Kart, stand, çıkartma<br /><em>veya anahtarlık</em>.',
    ku: 'Kart, stand, pêvek<br /><em>an zincîra mifteyan</em>.',
  },
  'rc.forms.text': {
    de: 'Alle mit NFC-Chip und QR-Code, fertig eingerichtet auf Ihr Google-Profil. Jede Form ist einzeln bestellbar und lässt sich kombinieren.',
    fr: 'Tous avec puce NFC et QR code, configurés sur votre fiche Google. Chaque format se commande seul et se combine avec les autres.',
    en: 'All with an NFC chip and QR code, set up on your Google profile. Each format can be ordered on its own or combined.',
    tr: 'Hepsi NFC çip ve QR kodlu, Google profilinize göre hazır kurulmuş. Her biri tek başına sipariş edilebilir ve birleştirilebilir.',
    ku: 'Hemû bi çîpa NFC û koda QR, li gorî profîla we ya Google amade. Her cure bi tena serê xwe tê fermankirin û dikare bê hevgirtin.',
  },
  'rc.form.karte.name': { de: 'NFC-Karte', fr: 'Carte NFC', en: 'NFC card', tr: 'NFC kart', ku: 'Karta NFC' },
  'rc.form.karte.text': {
    de: 'Scheckkartengroß — für Tresen, Tisch und Kasse. Passt in jede Schublade.',
    fr: 'Format carte bancaire — pour le comptoir, la table et la caisse.',
    en: 'Credit-card size — for the counter, the table and the till.',
    tr: 'Kredi kartı boyutunda — tezgâh, masa ve kasa için.',
    ku: 'Bi mezinahiya karta bankê — ji bo tezgeh, mase û kaseyê.',
  },
  'rc.form.aufsteller.name': { de: 'Tischaufsteller', fr: 'Présentoir de table', en: 'Table stand', tr: 'Masa standı', ku: 'Standa maseyê' },
  'rc.form.aufsteller.text': {
    de: 'Acrylaufsteller mit großer Tippfläche — gut sichtbar am Empfang oder auf dem Tisch.',
    fr: 'Présentoir en acrylique avec grande zone de contact — bien visible à l’accueil ou sur la table.',
    en: 'Acrylic stand with a large tap area — clearly visible at reception or on the table.',
    tr: 'Geniş dokunma alanlı akrilik stand — resepsiyonda veya masada net görünür.',
    ku: 'Standa akrîlîk bi qadeke mezin a dest-lêdanê — li resepsiyonê an li ser maseyê baş xuya dike.',
  },
  'rc.form.aufkleber.name': { de: 'NFC-Aufkleber (2 Stück)', fr: 'Autocollants NFC (lot de 2)', en: 'NFC stickers (set of 2)', tr: 'NFC çıkartma (2 adet)', ku: 'Pêvekên NFC (2 heb)' },
  'rc.form.aufkleber.text': {
    de: 'Rund, wetterfest, selbstklebend — für Kasse, Kartenterminal, Tür oder Schaufenster.',
    fr: 'Rond, résistant aux intempéries, autocollant — pour la caisse, le terminal, la porte ou la vitrine.',
    en: 'Round, weatherproof, self-adhesive — for the till, card terminal, door or shop window.',
    tr: 'Yuvarlak, hava koşullarına dayanıklı, yapışkanlı — kasa, kart okuyucu, kapı veya vitrin için.',
    ku: 'Girover, li hember hewayê xweragir, xwe-zeliqîner — ji bo kase, termînala kartê, derî an vîtrînê.',
  },
  'rc.form.anhaenger.name': { de: 'Schlüsselanhänger', fr: 'Porte-clés', en: 'Keychain', tr: 'Anahtarlık', ku: 'Zincîra mifteyan' },
  'rc.form.anhaenger.text': {
    de: 'Für alle, die zum Kunden fahren: Handwerk, Pflege, Lieferdienst, Außendienst. Nach dem Auftrag kurz hinhalten.',
    fr: 'Pour ceux qui vont chez le client : artisans, soins, livraison, commerciaux. À présenter après la prestation.',
    en: 'For anyone who goes to the customer: trades, care, delivery, field service. Hold it out after the job.',
    tr: 'Müşteriye gidenler için: ustalar, bakım, teslimat, saha ekipleri. İş bitince kısaca uzatın.',
    ku: 'Ji bo kesên ku diçin cem xerîdar: pîşesaz, lênêrîn, gihandin, karê derve. Piştî karî bi kurtî nîşan bidin.',
  },
  'rc.form.unit': { de: 'Einzelpreis', fr: 'Prix unitaire', en: 'Single price', tr: 'Birim fiyat', ku: 'Bihayê yekane' },
  'rc.form.cta': { de: 'Anfragen', fr: 'Demander', en: 'Enquire', tr: 'Talep et', ku: 'Daxwaz bike' },

  // ---- Beispiel-Designs ----------------------------------------------------
  'rc.ex.label': { de: 'Beispiele', fr: 'Exemples', en: 'Examples', tr: 'Örnekler', ku: 'Mînak' },
  'rc.ex.title': {
    de: 'So kann Ihre Karte<br /><em>aussehen</em>.',
    fr: 'Voici à quoi votre carte<br /><em>peut ressembler</em>.',
    en: 'What your card<br /><em>could look like</em>.',
    tr: 'Kartınız<br /><em>böyle görünebilir</em>.',
    ku: 'Karta we<br /><em>dikare wiha xuya bike</em>.',
  },
  'rc.ex.text': {
    de: 'Sechs Beispiel-Designs für verschiedene Branchen. Ihre Karte gestalten wir in Ihren Farben, mit Ihrem Logo und Ihrem eigenen Satz — den Entwurf sehen Sie vor dem Druck.',
    fr: 'Six exemples pour différents secteurs. Nous créons votre carte à vos couleurs, avec votre logo et votre propre phrase — vous validez la maquette avant impression.',
    en: 'Six example designs for different industries. We design your card in your colours, with your logo and your own line — you see the draft before it is printed.',
    tr: 'Farklı sektörler için altı örnek tasarım. Kartınızı kendi renklerinizle, logonuzla ve size özel cümleyle tasarlarız — baskıdan önce taslağı görürsünüz.',
    ku: 'Şeş sêwiranên mînak ji bo sektorên cuda. Em karta we bi rengên we, logoya we û hevoka we ya taybet sêwiran dikin — hûn berî çapê reşnivîsê dibînin.',
  },
  'rc.ex.cafe': { de: 'Café & Bäckerei', fr: 'Café & boulangerie', en: 'Café & bakery', tr: 'Kafe ve fırın', ku: 'Kafe û nanpêjxane' },
  'rc.ex.salon': { de: 'Friseur & Kosmetik', fr: 'Coiffure & esthétique', en: 'Hair & beauty', tr: 'Kuaför ve güzellik', ku: 'Porçêker û bedewî' },
  'rc.ex.handwerk': { de: 'Handwerk', fr: 'Artisanat', en: 'Trades & crafts', tr: 'Zanaat', ku: 'Pîşesazî' },
  'rc.ex.praxis': { de: 'Praxis', fr: 'Cabinet', en: 'Practice', tr: 'Muayenehane', ku: 'Muayenexane' },
  'rc.ex.fewo': { de: 'Ferienwohnung', fr: 'Location de vacances', en: 'Holiday flat', tr: 'Tatil dairesi', ku: 'Xaniyê betlaneyê' },
  'rc.ex.restaurant': { de: 'Restaurant', fr: 'Restaurant', en: 'Restaurant', tr: 'Restoran', ku: 'Xwaringeh' },
  'rc.ex.alt': {
    de: 'Beispiel-Design einer Bewertungskarte:', fr: 'Exemple de carte d’avis :', en: 'Example review card design:', tr: 'Örnek değerlendirme kartı tasarımı:', ku: 'Sêwirana mînak a karta nirxandinê:',
  },
  'rc.ex.note': {
    de: 'Die Namen auf den Beispielen sind Platzhalter.',
    fr: 'Les noms figurant sur les exemples sont fictifs.',
    en: 'The names on the examples are placeholders.',
    tr: 'Örneklerdeki isimler temsilidir.',
    ku: 'Navên li ser mînakan tenê nimûne ne.',
  },
};
