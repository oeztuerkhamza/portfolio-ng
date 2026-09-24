import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Abo-Seite. Werden von AboComponent registriert und kommen mit
 * dem Lazy-Chunk der Seite. Paketnamen (`abo.plan.<id>.name`) liegen global,
 * weil auch das Anfrageformular sie braucht.
 */
export const ABO_CONTENT: Record<string, Entry> = {
  // ---- Kopf ----------------------------------------------------------------
  'abo.label': { de: 'Digital-Abo', fr: 'Abonnement numérique', en: 'Digital plan', tr: 'Dijital abonelik', ku: 'Abonetiya dîjîtal' },
  'abo.title': {
    de: 'Alles zum<br /><em>festen Monatspreis</em>.',
    fr: 'Tout compris,<br /><em>à prix mensuel fixe</em>.',
    en: 'Everything for<br /><em>one fixed monthly price</em>.',
    tr: 'Her şey<br /><em>sabit aylık fiyata</em>.',
    ku: 'Her tişt<br /><em>bi bihayekî mehane yê sabît</em>.',
  },
  'abo.intro': {
    de: 'Keine große Anfangsinvestition: Bewertungskarten, Website und laufende Pflege in einem festen Monatsbetrag — planbar, persönlich betreut und nach der Mindestlaufzeit monatlich kündbar.',
    fr: 'Pas de gros investissement de départ : cartes d’avis, site web et suivi pour un montant mensuel fixe — prévisible, accompagné personnellement et résiliable chaque mois après la durée minimale.',
    en: 'No big upfront investment: review cards, website and ongoing care for one fixed monthly amount — predictable, personally looked after and cancellable monthly after the minimum term.',
    tr: 'Büyük bir başlangıç yatırımı yok: değerlendirme kartları, web sitesi ve sürekli bakım sabit bir aylık tutarla — planlanabilir, birebir destekli ve asgari sürenin ardından aylık iptal edilebilir.',
    ku: 'Veberhênana destpêkê ya mezin tune: kartên nirxandinê, malper û lênêrîna domdar bi mîqdareke mehane ya sabît — plansazkirî, bi piştgiriya şexsî û piştî dema herî kêm her meh dikare bê betalkirin.',
  },

  // ---- Preistabelle --------------------------------------------------------
  'abo.toggle.label': { de: 'Zahlweise', fr: 'Paiement', en: 'Billing', tr: 'Ödeme şekli', ku: 'Awayê dayînê' },
  'abo.toggle.monthly': { de: 'Monatlich', fr: 'Mensuel', en: 'Monthly', tr: 'Aylık', ku: 'Mehane' },
  'abo.toggle.yearly': { de: 'Jährlich', fr: 'Annuel', en: 'Yearly', tr: 'Yıllık', ku: 'Salane' },
  'abo.toggle.save': { de: '2 Monate gratis', fr: '2 mois offerts', en: '2 months free', tr: '2 ay bedava', ku: '2 meh belaş' },
  'abo.price': { de: '{p} €', fr: '{p} €', en: '€{p}', tr: '{p} €', ku: '{p} €' },
  'abo.per.month': { de: 'pro Monat', fr: 'par mois', en: 'per month', tr: 'aylık', ku: 'di mehê de' },
  'abo.per.year': { de: 'pro Jahr', fr: 'par an', en: 'per year', tr: 'yıllık', ku: 'di salê de' },
  'abo.setup': {
    de: 'Einrichtung einmalig {p} €', fr: 'Mise en place unique {p} €', en: 'One-off setup €{p}', tr: 'Tek seferlik kurulum {p} €', ku: 'Sazkirina yekcarî {p} €',
  },
  'abo.setup.none': { de: 'Keine Einrichtungsgebühr', fr: 'Sans frais de mise en place', en: 'No setup fee', tr: 'Kurulum ücreti yok', ku: 'Bê heqê sazkirinê' },
  'abo.term': {
    de: 'Mindestlaufzeit {n} Monate', fr: 'Durée minimale {n} mois', en: 'Minimum term {n} months', tr: 'Asgari süre {n} ay', ku: 'Dema herî kêm {n} meh',
  },
  'abo.badge': { de: 'Beliebt', fr: 'Populaire', en: 'Popular', tr: 'Popüler', ku: 'Populer' },
  'abo.cta.request': { de: 'Abo anfragen', fr: 'Demander cette offre', en: 'Request this plan', tr: 'Bu paketi talep et', ku: 'Daxwaza vê pakêtê' },
  'abo.cta.subscribe': { de: 'Jetzt abonnieren', fr: 'S’abonner', en: 'Subscribe now', tr: 'Hemen abone ol', ku: 'Niha abone bibe' },

  'abo.plan.basis.for': {
    de: 'Für Betriebe, die mehr Bewertungen und ein gepflegtes Google-Profil wollen',
    fr: 'Pour les entreprises qui veulent plus d’avis et une fiche Google soignée',
    en: 'For businesses that want more reviews and a well-kept Google profile',
    tr: 'Daha fazla yorum ve bakımlı bir Google profili isteyen işletmeler için',
    ku: 'Ji bo karsaziyên ku bêtir nirxandin û profîleke Google ya xweşkirî dixwazin',
  },
  'abo.plan.basis.p1': {
    de: 'NFC-Karte oder Tischaufsteller inklusive', fr: 'Carte NFC ou présentoir inclus', en: 'NFC card or table stand included', tr: 'NFC kart veya masa standı dahil', ku: 'Karta NFC an standa maseyê tê de',
  },
  'abo.plan.basis.p2': {
    de: 'Ziel jederzeit änderbar — Google, Speisekarte, Instagram',
    fr: 'Destination modifiable à tout moment — Google, menu, Instagram',
    en: 'Target changeable any time — Google, menu, Instagram',
    tr: 'Hedef her an değiştirilebilir — Google, menü, Instagram',
    ku: 'Armanc her dem dikare bê guhertin — Google, menû, Instagram',
  },
  'abo.plan.basis.p3': {
    de: 'Google-Profil gepflegt: Öffnungszeiten, Feiertage, Fotos',
    fr: 'Fiche Google à jour : horaires, jours fériés, photos',
    en: 'Google profile kept up to date: hours, holidays, photos',
    tr: 'Google profili güncel: çalışma saatleri, tatiller, fotoğraflar',
    ku: 'Profîla Google nûkirî: demjimêr, betlane, wêne',
  },
  'abo.plan.basis.p4': {
    de: 'Monatlicher Kurzbericht zu Bewertungen und Aufrufen',
    fr: 'Bref rapport mensuel sur les avis et les vues',
    en: 'Short monthly report on reviews and views',
    tr: 'Yorumlar ve görüntülemeler hakkında aylık kısa rapor',
    ku: 'Rapora kurt a mehane li ser nirxandin û dîtinan',
  },
  'abo.plan.basis.p5': {
    de: 'Ersatz bei Verlust oder Defekt', fr: 'Remplacement en cas de perte ou de défaut', en: 'Replacement if lost or damaged', tr: 'Kayıp veya arızada yenisi', ku: 'Guhertin heke winda bibe an xera bibe',
  },

  'abo.plan.business.for': {
    de: 'Für Betriebe, die eine Website ohne hohe Anfangskosten wollen',
    fr: 'Pour les entreprises qui veulent un site sans gros coût de départ',
    en: 'For businesses that want a website without a big upfront cost',
    tr: 'Yüksek başlangıç maliyeti olmadan web sitesi isteyen işletmeler için',
    ku: 'Ji bo karsaziyên ku malperekê bê lêçûna destpêkê ya bilind dixwazin',
  },
  'abo.plan.business.p1': { de: 'Alles aus Basis', fr: 'Tout l’Essentiel', en: 'Everything in Basic', tr: 'Temel paketin tamamı', ku: 'Hemû tiştên Bingehîn' },
  'abo.plan.business.p2': {
    de: 'Professionelle Website bis 5 Seiten, gemacht fürs Handy',
    fr: 'Site professionnel jusqu’à 5 pages, pensé pour le mobile',
    en: 'Professional website up to 5 pages, built for mobile',
    tr: 'Mobil için tasarlanmış, 5 sayfaya kadar profesyonel web sitesi',
    ku: 'Malpereke profesyonel heta 5 rûpelan, ji bo mobîlê',
  },
  'abo.plan.business.p3': {
    de: 'Hosting, Domain, SSL, Updates und Backups inklusive',
    fr: 'Hébergement, domaine, SSL, mises à jour et sauvegardes inclus',
    en: 'Hosting, domain, SSL, updates and backups included',
    tr: 'Barındırma, alan adı, SSL, güncellemeler ve yedekler dahil',
    ku: 'Hosting, domain, SSL, nûkirin û paşeqeyd tê de',
  },
  'abo.plan.business.p4': {
    de: 'Änderungen an Texten und Bildern (bis 1 Std. im Monat)',
    fr: 'Modifications de textes et d’images (jusqu’à 1 h par mois)',
    en: 'Changes to text and images (up to 1 hour a month)',
    tr: 'Metin ve görsel değişiklikleri (ayda 1 saate kadar)',
    ku: 'Guhertinên nivîs û wêneyan (heta 1 saetê di mehê de)',
  },
  'abo.plan.business.p5': {
    de: 'Drei Bewertungsprodukte nach Wahl', fr: 'Trois produits d’avis au choix', en: 'Three review products of your choice', tr: 'Seçeceğiniz üç değerlendirme ürünü', ku: 'Sê berhemên nirxandinê li gorî bijartina we',
  },
  'abo.plan.business.p6': {
    de: 'Antwort innerhalb eines Werktags', fr: 'Réponse sous un jour ouvré', en: 'Reply within one working day', tr: 'Bir iş günü içinde yanıt', ku: 'Bersiv di nav rojeke kar de',
  },

  'abo.plan.premium.for': {
    de: 'Für Betriebe, die sich um nichts kümmern wollen',
    fr: 'Pour les entreprises qui ne veulent s’occuper de rien',
    en: 'For businesses that don’t want to think about any of it',
    tr: 'Hiçbir şeyle uğraşmak istemeyen işletmeler için',
    ku: 'Ji bo karsaziyên ku naxwazin bi tiştekî re mijûl bibin',
  },
  'abo.plan.premium.p1': { de: 'Alles aus Business', fr: 'Tout Business', en: 'Everything in Business', tr: 'Business paketinin tamamı', ku: 'Hemû tiştên Business' },
  'abo.plan.premium.p2': {
    de: 'Monatlich neue Google-Beiträge und Fotos', fr: 'Publications et photos Google chaque mois', en: 'New Google posts and photos every month', tr: 'Her ay yeni Google gönderileri ve fotoğraflar', ku: 'Her meh şandin û wêneyên nû yên Google',
  },
  'abo.plan.premium.p3': {
    de: 'Antworten auf Bewertungen — als Entwurf zur Freigabe',
    fr: 'Réponses aux avis — proposées pour validation',
    en: 'Replies to reviews — drafted for your approval',
    tr: 'Yorumlara yanıtlar — onayınıza sunulan taslak olarak',
    ku: 'Bersivên nirxandinan — wek reşnivîs ji bo pejirandinê',
  },
  'abo.plan.premium.p4': {
    de: 'Smart-Home-Fernwartung, falls vorhanden',
    fr: 'Maintenance à distance de la maison connectée, le cas échéant',
    en: 'Remote smart-home maintenance, if you have one',
    tr: 'Varsa akıllı ev uzaktan bakımı',
    ku: 'Lênêrîna ji dûr ve ya mala biaqil, heke hebe',
  },
  'abo.plan.premium.p5': {
    de: 'Ein Vor-Ort-Termin pro Quartal', fr: 'Un rendez-vous sur place par trimestre', en: 'One on-site visit per quarter', tr: 'Her çeyrekte bir yerinde ziyaret', ku: 'Her sê mehan serdanek li cih',
  },
  'abo.plan.premium.p6': {
    de: 'Bevorzugter Support, auch per WhatsApp', fr: 'Support prioritaire, aussi par WhatsApp', en: 'Priority support, also via WhatsApp', tr: 'Öncelikli destek, WhatsApp üzerinden de', ku: 'Piştgiriya bi pêşîn, bi WhatsAppê jî',
  },

  // ---- Ablauf --------------------------------------------------------------
  'abo.steps.label': { de: 'So läuft das Abo', fr: 'Comment ça marche', en: 'How the plan works', tr: 'Abonelik nasıl işler', ku: 'Abonetî çawa dixebite' },
  'abo.steps.title': {
    de: 'Einfach starten,<br /><em>flexibel bleiben</em>.',
    fr: 'Démarrer simplement,<br /><em>rester flexible</em>.',
    en: 'Easy to start,<br /><em>easy to adapt</em>.',
    tr: 'Kolay başlayın,<br /><em>esnek kalın</em>.',
    ku: 'Bi hêsanî dest pê bikin,<br /><em>nerm bimînin</em>.',
  },
  'abo.step1.t': { de: 'Paket wählen', fr: 'Choisir l’offre', en: 'Choose a plan', tr: 'Paket seçin', ku: 'Pakêtekê hilbijêrin' },
  'abo.step1.d': {
    de: 'Sie fragen ein Paket an — in einem kurzen Gespräch klären wir, was Ihr Betrieb wirklich braucht.',
    fr: 'Vous demandez une offre — un court échange permet de préciser ce dont votre entreprise a vraiment besoin.',
    en: 'You request a plan — a short conversation clarifies what your business really needs.',
    tr: 'Bir paket talep edersiniz — kısa bir görüşmede işletmenizin gerçekten neye ihtiyacı olduğunu netleştiririz.',
    ku: 'Hûn daxwaza pakêtekê dikin — di axaftineke kurt de em zelal dikin ka karsaziya we bi rastî çi hewce dike.',
  },
  'abo.step2.t': { de: 'Einrichtung', fr: 'Mise en place', en: 'Setup', tr: 'Kurulum', ku: 'Sazkirin' },
  'abo.step2.d': {
    de: 'Wir richten Karten, Google-Profil und — je nach Paket — Ihre Website ein.',
    fr: 'Nous préparons les cartes, la fiche Google et, selon l’offre, votre site web.',
    en: 'We set up the cards, the Google profile and — depending on the plan — your website.',
    tr: 'Kartları, Google profilini ve pakete göre web sitenizi kurarız.',
    ku: 'Em kart, profîla Google û — li gorî pakêtê — malpera we saz dikin.',
  },
  'abo.step3.t': { de: 'Laufende Betreuung', fr: 'Suivi continu', en: 'Ongoing care', tr: 'Sürekli destek', ku: 'Piştgiriya domdar' },
  'abo.step3.d': {
    de: 'Jeden Monat Pflege, Updates und ein kurzer Bericht — ohne dass Sie daran denken müssen.',
    fr: 'Chaque mois : entretien, mises à jour et un bref rapport — sans que vous ayez à y penser.',
    en: 'Every month: care, updates and a short report — without you having to think about it.',
    tr: 'Her ay bakım, güncellemeler ve kısa bir rapor — sizin düşünmenize gerek kalmadan.',
    ku: 'Her meh lênêrîn, nûkirin û raporeke kurt — bêyî ku hûn bifikirin.',
  },
  'abo.step4.t': { de: 'Flexibel bleiben', fr: 'Rester flexible', en: 'Stay flexible', tr: 'Esnek kalın', ku: 'Nerm bimînin' },
  'abo.step4.d': {
    de: 'Paket jederzeit erweitern; nach der Mindestlaufzeit monatlich kündbar.',
    fr: 'Passez à l’offre supérieure à tout moment ; résiliable chaque mois après la durée minimale.',
    en: 'Upgrade at any time; cancellable monthly after the minimum term.',
    tr: 'Paketi her an yükseltin; asgari süreden sonra aylık iptal edilebilir.',
    ku: 'Her dem pakêtê mezin bikin; piştî dema herî kêm her meh dikare bê betalkirin.',
  },

  // ---- FAQ -----------------------------------------------------------------
  'abo.faq.label': { de: 'Fragen zum Abo', fr: 'Questions sur l’abonnement', en: 'Questions about the plans', tr: 'Abonelikle ilgili sorular', ku: 'Pirsên li ser abonetiyê' },
  'abo.faq.title': {
    de: 'Fair und<br /><em>ohne Kleingedrucktes</em>.',
    fr: 'Clair et<br /><em>sans petits caractères</em>.',
    en: 'Fair and<br /><em>without small print</em>.',
    tr: 'Adil ve<br /><em>gizli şart olmadan</em>.',
    ku: 'Dadperwer û<br /><em>bê nivîsên veşartî</em>.',
  },
  'abo.faq1.q': { de: 'Gehört mir die Website?', fr: 'Le site m’appartient-il ?', en: 'Do I own the website?', tr: 'Web sitesi bana mı ait?', ku: 'Ma malper ya min e?' },
  'abo.faq1.a': {
    de: 'Domain und Inhalte laufen auf Ihren Namen. Endet das Abo, erhalten Sie Ihre Texte, Bilder und die Domain. Ob Sie die Website selbst übernehmen, regeln wir vorab im Angebot.',
    fr: 'Le domaine et les contenus sont à votre nom. À la fin de l’abonnement, vous récupérez vos textes, vos images et le domaine. La reprise du site lui-même est réglée à l’avance dans le devis.',
    en: 'The domain and content are in your name. When the plan ends, you get your texts, images and the domain. Whether you take over the website itself is agreed up front in the quote.',
    tr: 'Alan adı ve içerikler sizin adınıza kayıtlıdır. Abonelik bittiğinde metinlerinizi, görsellerinizi ve alan adını alırsınız. Web sitesini devralıp almayacağınızı teklifte önceden netleştiririz.',
    ku: 'Domain û naverok bi navê we ne. Dema ku abonetî diqede, hûn nivîs, wêne û domainê distînin. Ka hûn malperê bi xwe digirin an na, em di pêşniyarê de ji berê ve diyar dikin.',
  },
  'abo.faq2.q': { de: 'Kann ich das Paket wechseln?', fr: 'Puis-je changer d’offre ?', en: 'Can I switch plans?', tr: 'Paketi değiştirebilir miyim?', ku: 'Ma ez dikarim pakêtê biguherînim?' },
  'abo.faq2.a': {
    de: 'Ja. Ein größeres Paket geht jederzeit, ein kleineres zum Ende des Abrechnungszeitraums.',
    fr: 'Oui. Passer à une offre supérieure est possible à tout moment, à une offre inférieure à la fin de la période de facturation.',
    en: 'Yes. Upgrading works any time; downgrading at the end of the billing period.',
    tr: 'Evet. Daha büyük pakete her an, daha küçüğüne fatura döneminin sonunda geçebilirsiniz.',
    ku: 'Erê. Pakêteke mezintir her dem, ya biçûktir di dawiya dema fatûreyê de.',
  },
  'abo.faq3.q': { de: 'Wie wird abgerechnet?', fr: 'Comment se passe la facturation ?', en: 'How is it billed?', tr: 'Faturalama nasıl yapılır?', ku: 'Fatûre çawa tê kirin?' },
  'abo.faq3.a': {
    de: 'Per Rechnung oder Lastschrift, monatlich oder jährlich im Voraus. Bei jährlicher Zahlung zahlen Sie zehn statt zwölf Monate.',
    fr: 'Par facture ou prélèvement, chaque mois ou chaque année d’avance. En paiement annuel, vous payez dix mois au lieu de douze.',
    en: 'By invoice or direct debit, monthly or yearly in advance. Paying yearly, you pay ten months instead of twelve.',
    tr: 'Fatura veya otomatik ödeme ile, aylık ya da yıllık peşin. Yıllık ödemede on iki yerine on ay ödersiniz.',
    ku: 'Bi fatûreyê an debîta rasterast, mehane an salane ji pêş ve. Bi dayîna salane hûn li şûna diwanzdeh mehan deh mehan didin.',
  },
  'abo.faq4.q': {
    de: 'Was passiert nach der Mindestlaufzeit?', fr: 'Et après la durée minimale ?', en: 'What happens after the minimum term?', tr: 'Asgari süreden sonra ne olur?', ku: 'Piştî dema herî kêm çi dibe?',
  },
  'abo.faq4.a': {
    de: 'Das Abo läuft einfach weiter und ist dann monatlich kündbar — eine kurze E-Mail genügt.',
    fr: 'L’abonnement continue simplement et devient résiliable chaque mois — un court e-mail suffit.',
    en: 'The plan simply continues and can then be cancelled monthly — a short email is enough.',
    tr: 'Abonelik devam eder ve artık aylık iptal edilebilir — kısa bir e-posta yeterlidir.',
    ku: 'Abonetî bi tenê berdewam dike û paşê her meh dikare bê betalkirin — e-nameyeke kurt bes e.',
  },
  'abo.faq5.q': {
    de: 'Gibt es das Abo auch für Privatkunden?', fr: 'L’abonnement est-il ouvert aux particuliers ?', en: 'Is the plan available to private customers?', tr: 'Abonelik bireysel müşteriler için de var mı?', ku: 'Ma abonetî ji bo xerîdarên taybet jî heye?',
  },
  'abo.faq5.a': {
    de: 'Die Abos richten sich an Betriebe und Selbstständige. Für private Smart-Home-Projekte erstellen wir Ihnen gern ein Einzelangebot.',
    fr: 'Les abonnements s’adressent aux entreprises et indépendants. Pour un projet domotique privé, nous vous faisons volontiers une offre individuelle.',
    en: 'The plans are for businesses and the self-employed. For private smart-home projects we’re happy to make you an individual quote.',
    tr: 'Abonelikler işletmeler ve serbest çalışanlar içindir. Özel akıllı ev projeleri için size memnuniyetle ayrı bir teklif hazırlarız.',
    ku: 'Abonetî ji bo karsazî û xebatkarên serbixwe ne. Ji bo projeyên mala biaqil ên taybet em bi kêfxweşî pêşniyareke taybet amade dikin.',
  },

  // ---- Hinweis & Abschluss -------------------------------------------------
  'abo.note.label': { de: 'Gut zu wissen', fr: 'Bon à savoir', en: 'Good to know', tr: 'Bilmeniz iyi olur', ku: 'Baş e ku hûn bizanin' },
  'abo.note.title': {
    de: 'Klare Bedingungen vor dem Start.', fr: 'Des conditions claires avant de commencer.', en: 'Clear terms before we start.', tr: 'Başlamadan önce net şartlar.', ku: 'Şertên zelal berî destpêkê.',
  },
  'abo.note.text': {
    de: 'Alle Preise sind Endpreise — als Kleinunternehmer nach § 19 UStG wird keine Umsatzsteuer berechnet. Die Abos richten sich an Unternehmen und Selbstständige. Die genauen Leistungen und Bedingungen erhalten Sie schriftlich mit dem Angebot, bevor etwas beginnt.',
    fr: 'Tous les prix sont des prix finaux — petite entreprise au sens du § 19 UStG, sans TVA. Les abonnements s’adressent aux entreprises et indépendants. Les prestations et conditions exactes vous sont remises par écrit avec le devis, avant tout démarrage.',
    en: 'All prices are final prices — under the small-business scheme (§ 19 UStG) no VAT is charged. The plans are for businesses and the self-employed. You receive the exact services and terms in writing with the quote, before anything starts.',
    tr: 'Tüm fiyatlar nihai fiyatlardır — § 19 UStG kapsamında küçük işletme olarak KDV alınmaz. Abonelikler işletmeler ve serbest çalışanlar içindir. Hizmetlerin ve şartların ayrıntısını, hiçbir şey başlamadan önce teklifle birlikte yazılı olarak alırsınız.',
    ku: 'Hemû biha bihayên dawî ne — wek karsaziya biçûk li gorî § 19 UStG bac nayê girtin. Abonetî ji bo karsazî û xebatkarên serbixwe ne. Xizmet û şertên berfireh hûn berî destpêkê bi pêşniyarê re bi nivîskî distînin.',
  },
  'abo.cta.title': {
    de: 'Welches Paket<br /><em>passt zu Ihnen</em>?',
    fr: 'Quelle offre<br /><em>vous convient</em> ?',
    en: 'Which plan<br /><em>suits you</em>?',
    tr: 'Size hangi paket<br /><em>uygun</em>?',
    ku: 'Kîjan pakêt<br /><em>li we tê</em>?',
  },
  'abo.cta.text': {
    de: 'Rufen Sie an oder schreiben Sie uns — im kostenlosen Erstgespräch finden wir gemeinsam das passende Paket.',
    fr: 'Appelez-nous ou écrivez-nous — lors du premier échange gratuit, nous trouvons ensemble l’offre adaptée.',
    en: 'Call or write to us — in the free first consultation we’ll find the right plan together.',
    tr: 'Bizi arayın ya da yazın — ücretsiz ön görüşmede size uygun paketi birlikte buluruz.',
    ku: 'Telefon bikin an ji me re binivîsin — di hevdîtina yekem a belaş de em bi hev re pakêta guncav dibînin.',
  },

  // ---- SEO -----------------------------------------------------------------
  'seo.abo.title': {
    de: 'Digital-Abo für Betriebe — Website & Bewertungskarten ab {p} €/Monat | Breisgau Digital',
    fr: 'Abonnement numérique pour entreprises — site & cartes d’avis dès {p} €/mois | Breisgau Digital',
    en: 'Digital plans for businesses — website & review cards from €{p}/month | Breisgau Digital',
    tr: 'İşletmeler için dijital abonelik — web sitesi ve değerlendirme kartları ayda {p} €’dan | Breisgau Digital',
    ku: 'Abonetiya dîjîtal ji bo karsaziyan — malper û kartên nirxandinê ji {p} €/meh | Breisgau Digital',
  },
  'seo.abo.desc': {
    de: 'Bewertungskarten, Website und Pflege im Monatsabo für kleine Betriebe in Freiburg und Baden-Württemberg: keine hohe Anfangsinvestition, planbare Kosten, persönliche Betreuung.',
    fr: 'Cartes d’avis, site web et suivi en abonnement mensuel pour les petites entreprises à Fribourg et dans le Bade-Wurtemberg : pas de gros investissement, coûts prévisibles, accompagnement personnel.',
    en: 'Review cards, website and care as a monthly plan for small businesses in Freiburg and Baden-Württemberg: no big upfront investment, predictable costs, personal support.',
    tr: 'Freiburg ve Baden-Württemberg’deki küçük işletmeler için aylık abonelikle değerlendirme kartları, web sitesi ve bakım: yüksek başlangıç yatırımı yok, planlanabilir maliyet, birebir destek.',
    ku: 'Kartên nirxandinê, malper û lênêrîn bi abonetiya mehane ji bo karsaziyên biçûk li Freiburg û Baden-Württemberg: bê veberhênana mezin, lêçûnên plansazkirî, piştgiriya şexsî.',
  },
};
