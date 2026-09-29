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
  'cg.label': { de: 'Karte gestalten', fr: 'Créer la carte', en: 'Design your card', tr: 'Kartı tasarla', ku: 'Kartê çêke' },
  'cg.business.title': { de: 'Ihre digitale Visitenkarte, jetzt schon sichtbar', fr: 'Votre carte de visite numérique, visible dès maintenant', en: 'Your digital business card, visible right now', tr: 'Dijital kartvizitiniz, şimdiden görünür', ku: 'Karta we ya karsaziyê ya dîjîtal, ji niha ve xuya ye' },
  'cg.gift.title': { de: 'Ihre Geschenkkarte, jetzt schon sichtbar', fr: 'Votre carte cadeau, visible dès maintenant', en: 'Your gift card, visible right now', tr: 'Hediye kartınız, şimdiden görünür', ku: 'Karta we ya diyariyê, ji niha ve xuya ye' },
  'cg.intro': {
    de: 'Füllen Sie aus, was auf die Karte soll — daneben sehen Sie sofort, wie die fertige Seite aussieht. Erst danach bestellen Sie. Ihre Eingaben fahren mit der Bestellung mit; wir müssen nichts mehr nachfragen.',
    fr: 'Renseignez ce qui doit figurer sur la carte : à côté, vous voyez immédiatement la page finale. Vous ne commandez qu’ensuite. Vos saisies accompagnent la commande ; nous n’avons plus rien à vous demander.',
    en: 'Fill in what goes on the card — next to it you see the finished page straight away. You order only afterwards. What you entered travels with the order, so we have nothing left to ask.',
    tr: 'Kartta ne yazacaksa doldurun — yanında bitmiş sayfanın nasıl göründüğünü anında görürsünüz. Sipariş ise sonra. Girdikleriniz siparişle birlikte bize ulaşır; ayrıca bir şey sormamıza gerek kalmaz.',
    ku: 'Tijî bikin çi divê li ser kartê be — li kêleka wê hûn tavilê dibînin rûpela temam çawa ye. Hûn tenê piştre siparîş dikin. Tiştên we nivîsandine bi siparîşê re tên; ji me re tiştekî din nema ku em bipirsin.',
  },
  'cg.back': { de: 'Zurück zum Produkt', fr: 'Retour au produit', en: 'Back to the product', tr: 'Ürüne dön', ku: 'Vegere berhemê' },

  // Die Texte der Vorschau stehen bei der Vorschau selbst
  // (src/app/shared/card-preview/card-preview.content.ts) — sie meldet sie an.

  // ── Abschnitte des Bogens ─────────────────────────────────
  'cg.sec.basics': { de: 'Das Wichtigste', fr: 'L’essentiel', en: 'The essentials', tr: 'En önemlisi', ku: 'Ya herî girîng' },
  'cg.sec.contact': { de: 'Kontakt', fr: 'Contact', en: 'Contact', tr: 'İletişim', ku: 'Têkilî' },
  'cg.sec.links': { de: 'Links', fr: 'Liens', en: 'Links', tr: 'Bağlantılar', ku: 'Girêdan' },
  'cg.sec.photos': { de: 'Bilder', fr: 'Photos', en: 'Photos', tr: 'Fotoğraflar', ku: 'Wêne' },
  'cg.sec.extras': { de: 'Zugabe', fr: 'En plus', en: 'Extras', tr: 'Ekstra', ku: 'Zêde' },
  'cg.sec.look': { de: 'Aussehen', fr: 'Apparence', en: 'Look', tr: 'Görünüm', ku: 'Xuyang' },

  // ── Farbschema ────────────────────────────────────────────
  'cg.theme.brand': { de: 'Hell', fr: 'Clair', en: 'Light', tr: 'Açık', ku: 'Ronî' },
  'cg.theme.dark': { de: 'Dunkel', fr: 'Sombre', en: 'Dark', tr: 'Koyu', ku: 'Tarî' },
  'cg.theme.warm': { de: 'Warm', fr: 'Chaud', en: 'Warm', tr: 'Sıcak', ku: 'Germ' },

  // ── Felder der Visitenkarte ───────────────────────────────
  'cg.f.company': { de: 'Name des Betriebs', fr: 'Nom de l’entreprise', en: 'Business name', tr: 'İşletme adı', ku: 'Navê karsaziyê' },
  'cg.f.tagline': { de: 'Zeile darunter', fr: 'Ligne en dessous', en: 'Line underneath', tr: 'Altındaki satır', ku: 'Rêza jêr' },
  'cg.f.logoUrl': { de: 'Logo (Adresse des Bildes)', fr: 'Logo (adresse de l’image)', en: 'Logo (image address)', tr: 'Logo (görsel adresi)', ku: 'Logo (navnîşana wêneyê)' },
  'cg.f.avatarUrl': { de: 'Portrait (Adresse des Bildes)', fr: 'Portrait (adresse de l’image)', en: 'Portrait (image address)', tr: 'Portre (görsel adresi)', ku: 'Portre (navnîşana wêneyê)' },
  'cg.f.phone': { de: 'Telefon', fr: 'Téléphone', en: 'Phone', tr: 'Telefon', ku: 'Telefon' },
  'cg.f.email': { de: 'E-Mail', fr: 'E-mail', en: 'E-mail', tr: 'E-posta', ku: 'E-name' },
  'cg.f.web': { de: 'Website', fr: 'Site web', en: 'Website', tr: 'Web sitesi', ku: 'Malper' },
  'cg.f.address': { de: 'Adresse', fr: 'Adresse', en: 'Address', tr: 'Adres', ku: 'Navnîşan' },
  'cg.f.leads': { de: 'Kontaktbogen auf der Karte zeigen', fr: 'Afficher le formulaire de contact sur la carte', en: 'Show the contact form on the card', tr: 'Kartta iletişim formu göster', ku: 'Forma têkiliyê li ser kartê nîşan bide' },
  'cg.f.leads.hint': {
    de: 'Ihr Gegenüber kann seine eigenen Daten dalassen. Sie bekommen sie im Portal — wir speichern sie sechs Monate.',
    fr: 'Votre interlocuteur peut laisser ses coordonnées. Vous les recevez dans le portail ; nous les conservons six mois.',
    en: 'The person you meet can leave their own details. You get them in the portal; we keep them for six months.',
    tr: 'Karşınızdaki kişi kendi bilgilerini bırakabilir. Portalda size gelir; altı ay saklıyoruz.',
    ku: 'Kesê hember dikare agahiyên xwe bihêle. Hûn wan di portalê de distînin; em wan şeş mehan diparêzin.',
  },

  // ── Felder der Geschenkkarte ──────────────────────────────
  'cg.f.headline': { de: 'Überschrift', fr: 'Titre', en: 'Headline', tr: 'Başlık', ku: 'Sernav' },
  'cg.f.to': { de: 'Für', fr: 'Pour', en: 'To', tr: 'Kime', ku: 'Ji bo' },
  'cg.f.from': { de: 'Von', fr: 'De', en: 'From', tr: 'Kimden', ku: 'Ji' },
  'cg.f.message': { de: 'Ihre Zeilen', fr: 'Votre message', en: 'Your message', tr: 'Mesajınız', ku: 'Peyama we' },
  'cg.f.songUrl': { de: 'Lied (Adresse)', fr: 'Chanson (adresse)', en: 'Song (address)', tr: 'Şarkı (adres)', ku: 'Stran (navnîşan)' },
  'cg.f.songLabel': { de: 'Name des Liedes', fr: 'Titre de la chanson', en: 'Song title', tr: 'Şarkının adı', ku: 'Navê stranê' },

  // ── Listen ────────────────────────────────────────────────
  'cg.link.add': { de: 'Link hinzufügen', fr: 'Ajouter un lien', en: 'Add a link', tr: 'Bağlantı ekle', ku: 'Girêdanê zêde bike' },
  'cg.link.net': { de: 'Netzwerk', fr: 'Réseau', en: 'Network', tr: 'Ağ', ku: 'Tor' },
  'cg.link.own': { de: 'Eigener Link', fr: 'Lien libre', en: 'Own link', tr: 'Kendi bağlantım', ku: 'Girêdana xwe' },
  'cg.link.label': { de: 'Beschriftung', fr: 'Libellé', en: 'Label', tr: 'Etiket', ku: 'Nîşan' },
  'cg.link.url': { de: 'Adresse', fr: 'Adresse', en: 'Address', tr: 'Adres', ku: 'Navnîşan' },
  'cg.link.none': { de: 'Noch kein Link.', fr: 'Aucun lien pour l’instant.', en: 'No link yet.', tr: 'Henüz bağlantı yok.', ku: 'Hêj girêdan tune.' },
  'cg.photo.add': { de: 'Bild hinzufügen', fr: 'Ajouter une photo', en: 'Add a photo', tr: 'Fotoğraf ekle', ku: 'Wêne zêde bike' },
  'cg.photo.url': { de: 'Adresse des Bildes', fr: 'Adresse de l’image', en: 'Image address', tr: 'Görsel adresi', ku: 'Navnîşana wêneyê' },
  'cg.photo.none': { de: 'Noch kein Bild.', fr: 'Aucune photo pour l’instant.', en: 'No photo yet.', tr: 'Henüz fotoğraf yok.', ku: 'Hêj wêne tune.' },
  'cg.remove': { de: 'Entfernen', fr: 'Retirer', en: 'Remove', tr: 'Kaldır', ku: 'Rake' },

  // ── Hinweise ──────────────────────────────────────────────
  'cg.hint.https': {
    de: 'Adressen müssen mit https:// beginnen. Bilder, die noch nicht im Netz stehen, schicken Sie uns nach der Bestellung — wir setzen sie ein.',
    fr: 'Les adresses doivent commencer par https://. Les images qui ne sont pas encore en ligne, envoyez-les après la commande : nous les intégrons.',
    en: 'Addresses must start with https://. Images that are not online yet you send us after ordering — we put them in.',
    tr: 'Adresler https:// ile başlamalı. Henüz internette olmayan görselleri sipariş sonrası bize gönderin — biz ekleriz.',
    ku: 'Navnîşan divê bi https:// dest pê bikin. Wêneyên ku hêj li torê nînin piştî siparîşê ji me re bişînin — em wan datînin.',
  },
  'cg.hint.saved': {
    de: 'Ihr Entwurf bleibt in diesem Browser gespeichert, bis Sie bestellen. Auf unseren Server kommt er erst mit der Bestellung.',
    fr: 'Votre brouillon reste enregistré dans ce navigateur jusqu’à la commande. Il n’arrive sur notre serveur qu’avec celle-ci.',
    en: 'Your draft stays saved in this browser until you order. It only reaches our server with the order.',
    tr: 'Taslağınız siparişe kadar bu tarayıcıda kalır. Sunucumuza ancak siparişle birlikte ulaşır.',
    ku: 'Şixula we heta siparîşê di vê gerokê de tomarkirî dimîne. Ew tenê bi siparîşê digihîje servera me.',
  },
  'cg.hint.later': {
    de: 'Sie können alles auch nach der Bestellung noch ändern — bis zur Freigabe.',
    fr: 'Tout reste modifiable après la commande, jusqu’à la validation.',
    en: 'You can still change everything after ordering, right up to sign-off.',
    tr: 'Siparişten sonra da her şeyi değiştirebilirsiniz — onaya kadar.',
    ku: 'Hûn dikarin piştî siparîşê jî her tiştî biguherînin — heta pejirandinê.',
  },

  // ── Knöpfe ────────────────────────────────────────────────
  'cg.toCart': { de: 'Zur Bestellung', fr: 'Vers la commande', en: 'To the order', tr: 'Siparişe git', ku: 'Biçe siparîşê' },
  'cg.reset': { de: 'Entwurf leeren', fr: 'Vider le brouillon', en: 'Clear the draft', tr: 'Taslağı temizle', ku: 'Şixul vala bike' },
  'cg.design': { de: 'Karte selbst gestalten', fr: 'Créer la carte soi-même', en: 'Design the card yourself', tr: 'Kartı kendin tasarla', ku: 'Kartê bi xwe çêke' },
  'cg.design.d': {
    de: 'Sehen Sie Ihre Karte, bevor Sie bestellen — dauert zwei Minuten.',
    fr: 'Voyez votre carte avant de commander : deux minutes suffisent.',
    en: 'See your card before you order — it takes two minutes.',
    tr: 'Sipariş vermeden önce kartınızı görün — iki dakika sürer.',
    ku: 'Berî ku siparîş bidin kartê xwe bibînin — du deqîqe dikişîne.',
  },

  // ── SEO ───────────────────────────────────────────────────
  'seo.cg.business.title': { de: 'Digitale Visitenkarte selbst gestalten · Breisgau Digital', fr: 'Créer soi-même sa carte de visite numérique · Breisgau Digital', en: 'Design your digital business card · Breisgau Digital', tr: 'Dijital kartviziti kendin tasarla · Breisgau Digital', ku: 'Karta karsaziyê ya dîjîtal bi xwe çêke · Breisgau Digital' },
  'seo.cg.gift.title': { de: 'Geschenkkarte selbst gestalten · Breisgau Digital', fr: 'Créer soi-même sa carte cadeau · Breisgau Digital', en: 'Design your gift card · Breisgau Digital', tr: 'Hediye kartını kendin tasarla · Breisgau Digital', ku: 'Karta diyariyê bi xwe çêke · Breisgau Digital' },
};
