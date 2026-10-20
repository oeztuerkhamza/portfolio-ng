import { INVITE_THEMES, InviteTheme, pexels } from './invite-themes';
import { DEMO_TITLES } from './invite-demo-titles';
import {
  EventKind,
  InviteBudgetItem,
  InviteEvent,
  InviteGuest,
  InviteLang,
  InvitePlan,
  InviteTask,
  LocalText,
  ScheduleItem,
  ThemeId,
} from './invite.model';

/**
 * Beispiel-Einladungen — eine je Gestaltung.
 *
 * Sie laufen ohne Server: Antworten, Fotos und der Plan des Gastgebers
 * bleiben im Browser des Besuchers (siehe InviteStore). Die Slugs beginnen
 * mit `demo-`; genau daran erkennt der Store, dass er nichts an die API
 * schickt.
 */

export const DEMO_PREFIX = 'demo-';
export const isDemoSlug = (slug: string) => slug.startsWith(DEMO_PREFIX);
export const demoSlug = (theme: ThemeId) => `${DEMO_PREFIX}${theme}`;

type L = Record<InviteLang, string>;

// ── Bausteine, aus denen die Beispiele zusammengesetzt sind ──
const P = {
  civil: { de: 'Standesamtliche Trauung', tr: 'Resmi nikâh', en: 'Civil ceremony', fr: 'Mariage civil', ku: 'Mehra fermî', ar: 'عقد القران المدني' },
  ceremony: { de: 'Freie Trauung', tr: 'Nikâh töreni', en: 'Wedding ceremony', fr: 'Cérémonie', ku: 'Merasîma mehrê', ar: 'مراسم الزفاف' },
  reception: { de: 'Sektempfang', tr: 'Kokteyl', en: 'Drinks reception', fr: 'Vin d’honneur', ku: 'Pêşwazî', ar: 'حفل الاستقبال' },
  photos: { de: 'Gruppenfotos', tr: 'Toplu fotoğraflar', en: 'Group photos', fr: 'Photos de groupe', ku: 'Wêneyên komê', ar: 'الصور الجماعية' },
  dinner: { de: 'Abendessen', tr: 'Akşam yemeği', en: 'Dinner', fr: 'Dîner', ku: 'Şîv', ar: 'العشاء' },
  dance: { de: 'Eröffnungstanz', tr: 'İlk dans', en: 'First dance', fr: 'Ouverture du bal', ku: 'Dîlana yekem', ar: 'الرقصة الأولى' },
  cake: { de: 'Torte', tr: 'Pasta kesimi', en: 'Cake cutting', fr: 'Pièce montée', ku: 'Pasta', ar: 'قطع الكعكة' },
  party: { de: 'Party bis in die Nacht', tr: 'Sabaha kadar eğlence', en: 'Party into the night', fr: 'Soirée dansante', ku: 'Şahî heta nîvê şevê', ar: 'سهرة حتى الصباح' },
  arrival: { de: 'Ankunft der Gäste', tr: 'Misafirlerin karşılanması', en: 'Guests arrive', fr: 'Accueil des invités', ku: 'Pêşwaziya mêvanan', ar: 'استقبال الضيوف' },
  henna: { de: 'Henna-Zeremonie', tr: 'Kına yakma', en: 'Henna ceremony', fr: 'Cérémonie du henné', ku: 'Merasîma hineyê', ar: 'مراسم الحناء' },
  halay: { de: 'Live-Musik & Halay', tr: 'Canlı müzik ve halay', en: 'Live music & folk dances', fr: 'Musique live & danses', ku: 'Muzîka zindî û govend', ar: 'موسيقى حية ودبكة' },
  zaffa: { de: 'Zaffa – Einzug des Brautpaars', tr: 'Zaffe – gelin ve damadın girişi', en: 'Zaffa – the couple’s entrance', fr: 'Zaffa – entrée des mariés', ku: 'Zaffa – ketina bûk û zava', ar: 'الزفة' },
  toast: { de: 'Anstoßen & Reden', tr: 'Kadeh kaldırma ve konuşmalar', en: 'Toasts & speeches', fr: 'Toasts & discours', ku: 'Gotar û pîrozbahî', ar: 'الكلمات والتهاني' },
  midnight: { de: 'Mitternachtssnack', tr: 'Gece yarısı ikramı', en: 'Midnight snack', fr: 'Encas de minuit', ku: 'Xwarina nîvê şevê', ar: 'وجبة منتصف الليل' },
  keynote: { de: 'Begrüßung & Keynote', tr: 'Açılış ve ana konuşma', en: 'Welcome & keynote', fr: 'Accueil & keynote', ku: 'Pêşwazî û axaftina sereke', ar: 'الترحيب والكلمة الرئيسية' },
  talks: { de: 'Vorträge & Workshops', tr: 'Sunumlar ve atölyeler', en: 'Talks & workshops', fr: 'Conférences & ateliers', ku: 'Pêşkêşî û xebat', ar: 'محاضرات وورش عمل' },
  lunch: { de: 'Mittagessen', tr: 'Öğle yemeği', en: 'Lunch', fr: 'Déjeuner', ku: 'Firavîn', ar: 'الغداء' },
  network: { de: 'Get-together & Networking', tr: 'Tanışma ve networking', en: 'Get-together & networking', fr: 'Networking', ku: 'Hevdîtin û torê', ar: 'لقاء وتعارف' },
  coffee: { de: 'Kaffee & Kuchen', tr: 'Kahve ve tatlı', en: 'Coffee & cake', fr: 'Café & gâteaux', ku: 'Qehwe û pasta', ar: 'قهوة وحلوى' },
  surprise: { de: 'Überraschung um Mitternacht', tr: 'Gece yarısı sürprizi', en: 'Midnight surprise', fr: 'Surprise à minuit', ku: 'Surprîza nîvê şevê', ar: 'مفاجأة منتصف الليل' },
} satisfies Record<string, L>;

const LOC = {
  ceremony: { de: 'Trauung', tr: 'Nikâh', en: 'Ceremony', fr: 'Cérémonie', ku: 'Mehr', ar: 'المراسم' },
  party: { de: 'Feier', tr: 'Kutlama', en: 'Celebration', fr: 'Fête', ku: 'Şahî', ar: 'الحفل' },
  venue: { de: 'Veranstaltungsort', tr: 'Etkinlik yeri', en: 'Venue', fr: 'Lieu', ku: 'Cihê bûyerê', ar: 'مكان الفعالية' },
} satisfies Record<string, L>;

const ROLE = {
  witness: { de: 'Trauzeugin', tr: 'Nikâh şahidi', en: 'Maid of honour', fr: 'Témoin', ku: 'Şahid', ar: 'الشاهدة' },
  witnessM: { de: 'Trauzeuge', tr: 'Nikâh şahidi', en: 'Best man', fr: 'Témoin', ku: 'Şahid', ar: 'الشاهد' },
  family: { de: 'Familie', tr: 'Aile', en: 'Family', fr: 'Famille', ku: 'Malbat', ar: 'العائلة' },
  orga: { de: 'Organisation', tr: 'Organizasyon', en: 'Organisation', fr: 'Organisation', ku: 'Rêxistin', ar: 'التنظيم' },
} satisfies Record<string, L>;

const WELCOME: Record<EventKind, L> = {
  wedding: {
    de: 'Wir sagen Ja! Und wir möchten diesen Tag mit den Menschen feiern, die uns am meisten bedeuten — mit euch.',
    tr: 'Evet diyoruz! Bu günü en çok değer verdiğimiz insanlarla, sizlerle kutlamak istiyoruz.',
    en: 'We’re saying yes! And we’d love to celebrate the day with the people who mean the most to us — you.',
    fr: 'Nous disons oui ! Et nous voulons fêter ce jour avec celles et ceux qui comptent le plus pour nous — vous.',
    ku: 'Em dibêjin erê! Û em dixwazin vê rojê bi kesên herî delal re — bi we re — pîroz bikin.',
    ar: 'لقد قلنا نعم! ونودّ أن نحتفل بهذا اليوم مع أغلى الناس على قلوبنا — معكم.',
  },
  henna: {
    de: 'Bevor es in die Ehe geht, feiern wir unsere Henna-Nacht — mit Musik, Tanz, Tradition und allen, die uns lieb sind.',
    tr: 'Evlilik yolculuğundan önce kına gecemizi müzik, dans ve geleneklerimizle, sevdiklerimizle birlikte kutluyoruz.',
    en: 'Before we tie the knot, we celebrate our henna night — with music, dancing, tradition and everyone we love.',
    fr: 'Avant le mariage, nous fêtons notre nuit du henné — musique, danse, traditions et tous ceux qu’on aime.',
    ku: 'Berî zewacê, em şeva xwe ya hineyê pîroz dikin — bi muzîk, govend û kevneşopiyê, bi hemû hezkiriyan re.',
    ar: 'قبل الزفاف نحتفل بليلة الحناء — بالموسيقى والرقص والتقاليد مع كل من نحب.',
  },
  engagement: {
    de: 'Sie hat Ja gesagt! Das wollen wir mit unseren Liebsten feiern — ganz entspannt im Garten.',
    tr: 'Evet dedi! Bunu sevdiklerimizle, bahçede rahat bir ortamda kutlamak istiyoruz.',
    en: 'She said yes! We’d love to celebrate with our favourite people — relaxed, in the garden.',
    fr: 'Elle a dit oui ! Fêtons ça entre proches — en toute simplicité, au jardin.',
    ku: 'Wê got erê! Em dixwazin bi hezkiriyên xwe re di baxçe de pîroz bikin.',
    ar: 'لقد قالت نعم! نودّ أن نحتفل مع أحبائنا في أجواء هادئة في الحديقة.',
  },
  birthday: {
    de: 'Ein runder Geburtstag verdient eine große Nacht. Zieht euch schick an — es wird glamourös!',
    tr: 'Yuvarlak bir yaş büyük bir geceyi hak eder. Şık giyinin — göz kamaştırıcı bir gece olacak!',
    en: 'A milestone birthday deserves a big night. Dress up — it’s going to be glamorous!',
    fr: 'Un anniversaire rond mérite une grande soirée. Sortez vos plus belles tenues !',
    ku: 'Rojbûneke taybet şeveke mezin heq dike. Xwe xweşik li xwe bikin!',
    ar: 'عيد ميلاد مميز يستحق ليلة كبيرة. ارتدوا أجمل ما لديكم — ستكون ليلة ساحرة!',
  },
  corporate: {
    de: 'Ein Jahr voller Projekte, ein Team, das zusammenhält: Wir laden Sie herzlich zu unserer Jahrestagung mit Sommerfest ein.',
    tr: 'Projelerle dolu bir yıl ve birbirine kenetlenmiş bir ekip: Sizi yıllık toplantımıza ve yaz şenliğimize davet ediyoruz.',
    en: 'A year full of projects and a team that sticks together: you are warmly invited to our annual meeting and summer party.',
    fr: 'Une année de projets, une équipe soudée : nous vous invitons à notre convention annuelle et fête d’été.',
    ku: 'Salek tije proje û tîmek yekbûyî: em we vedixwînin civîna salane û şahiya havînê.',
    ar: 'عام مليء بالمشاريع وفريق متماسك: يسعدنا دعوتكم إلى اجتماعنا السنوي وحفل الصيف.',
  },
  other: {
    de: 'Wir freuen uns auf euch!', tr: 'Sizi bekliyoruz!', en: 'We look forward to seeing you!', fr: 'Au plaisir de vous voir !', ku: 'Em li benda we ne!', ar: 'بانتظاركم!',
  },
};

const STORY: Record<EventKind, L> = {
  wedding: {
    de: 'Kennengelernt haben wir uns an einem verregneten Herbsttag in Freiburg — beide ohne Schirm, beide auf der Suche nach demselben Café. Aus einem Kaffee wurden viele, aus vielen ein gemeinsames Leben. Jetzt wird es offiziell.',
    tr: 'Freiburg’da yağmurlu bir sonbahar gününde tanıştık — ikimiz de şemsiyesizdik ve aynı kafeyi arıyorduk. Bir kahve çoğaldı, çoğalan kahveler ortak bir hayata dönüştü. Şimdi resmileşiyor.',
    en: 'We met on a rainy autumn day in Freiburg — both without an umbrella, both looking for the same café. One coffee became many, and many became a life together. Now it’s official.',
    fr: 'Nous nous sommes rencontrés un jour de pluie à Fribourg — sans parapluie, à la recherche du même café. Un café en a amené d’autres, puis une vie à deux. Aujourd’hui, c’est officiel.',
    ku: 'Em di rojeke payîzê ya baranî de li Freiburgê nas bûn — herdu bê sîwan, herdu li heman qehwexaneyê digeriyan. Qehweyek bû gelek, û gelek bû jiyaneke hevpar.',
    ar: 'التقينا في يوم خريفي ماطر في فرايبورغ — كلانا بلا مظلة، وكلانا يبحث عن المقهى نفسه. فنجان قهوة صار فناجين، ثم صار حياة مشتركة. والآن أصبح الأمر رسمياً.',
  },
  henna: {
    de: 'Die Henna-Nacht ist für uns ein Abschied und ein Anfang zugleich: Die Braut verabschiedet sich von ihrem Elternhaus, und alle segnen den neuen Weg. Es wird gesungen, getanzt und — natürlich — Henna aufgetragen.',
    tr: 'Kına gecesi bizim için hem bir veda hem de bir başlangıç: Gelin baba evine veda eder, herkes yeni yolu kutsar. Türküler söylenir, oynanır ve elbette kına yakılır.',
    en: 'For us, the henna night is a farewell and a beginning at once: the bride says goodbye to her parents’ home and everyone blesses the new path. There will be singing, dancing and — of course — henna.',
    fr: 'La nuit du henné est à la fois un adieu et un commencement : la mariée quitte la maison familiale et chacun bénit le nouveau chemin. On chante, on danse — et bien sûr, on applique le henné.',
    ku: 'Şeva hineyê ji bo me hem xatirxwestin û hem destpêk e: bûk xatir ji mala bavê xwe dixwaze û her kes riya nû pîroz dike.',
    ar: 'ليلة الحناء بالنسبة لنا وداع وبداية في آن واحد: تودّع العروس بيت أهلها ويبارك الجميع الطريق الجديد بالغناء والرقص والحناء.',
  },
  engagement: {
    de: 'Nach fünf Jahren, zwei Umzügen und einem Antrag auf dem Schauinsland ist es so weit: Wir sind verlobt und feiern das mit Grillen, Musik und euch.',
    tr: 'Beş yıl, iki taşınma ve Schauinsland’da bir evlilik teklifinden sonra nişanlandık. Bunu mangal, müzik ve sizlerle kutluyoruz.',
    en: 'After five years, two moves and a proposal on the Schauinsland mountain, it’s official: we’re engaged — let’s celebrate with a barbecue, music and you.',
    fr: 'Après cinq ans, deux déménagements et une demande sur le Schauinsland : nous sommes fiancés ! Fêtons ça autour d’un barbecue.',
    ku: 'Piştî pênc salan û pêşniyarekê li çiyayê Schauinsland, em nîşan bûn — em bi goştbiraştin û muzîkê pîroz dikin.',
    ar: 'بعد خمس سنوات وانتقالين وطلب زواج على جبل شاوينسلاند — أصبحنا مخطوبين! لنحتفل بالشواء والموسيقى.',
  },
  birthday: {
    de: 'Dreißig Jahre, unzählige Abenteuer und die besten Freunde der Welt. Zeit, darauf anzustoßen — mit Champagner, DJ und einer Tanzfläche, die erst im Morgengrauen leer wird.',
    tr: 'Otuz yıl, sayısız macera ve dünyanın en iyi arkadaşları. Şampanya, DJ ve sabaha kadar dolu bir dans pistiyle kadeh kaldırma zamanı.',
    en: 'Thirty years, countless adventures and the best friends in the world. Time for a toast — with champagne, a DJ and a dance floor that won’t empty before dawn.',
    fr: 'Trente ans, mille aventures et les meilleurs amis du monde. Trinquons — champagne, DJ et piste de danse jusqu’à l’aube.',
    ku: 'Sî sal, gelek serpêhatî û hevalên herî baş. Dema pîrozbahiyê ye — bi DJ û dîlanê heta sibê.',
    ar: 'ثلاثون عاماً ومغامرات لا تُحصى وأفضل الأصدقاء في العالم. حان وقت الاحتفال مع DJ وحلبة رقص حتى الفجر.',
  },
  corporate: {
    de: 'Am Vormittag blicken wir gemeinsam auf das Jahr zurück und nach vorn: kurze Vorträge, offene Workshops, Zeit für Fragen. Danach wird gegrillt — Partnerinnen und Partner sind herzlich willkommen.',
    tr: 'Sabah birlikte yılı değerlendirip geleceğe bakıyoruz: kısa sunumlar, atölyeler ve soru-cevap. Ardından mangal partisi — eşler de davetlidir.',
    en: 'In the morning we look back on the year and ahead together: short talks, open workshops, time for questions. Afterwards: barbecue — partners are very welcome.',
    fr: 'Le matin, bilan et perspectives : courtes interventions, ateliers, questions. Puis barbecue — conjoints bienvenus.',
    ku: 'Serê sibê em li salê dinêrin: pêşkêşî, xebat û pirs. Paşê goştbiraştin — hevjîn jî bi xêr hatin.',
    ar: 'في الصباح نستعرض العام ونتطلع إلى المستقبل: كلمات قصيرة وورش عمل وأسئلة. ثم حفل شواء — الشركاء مرحب بهم.',
  },
  other: { de: '', tr: '', en: '', fr: '', ku: '', ar: '' },
};

const DRESS: Record<string, L> = {
  festive: { de: 'Festlich elegant — Damen gern in Pastell, Herren im Anzug.', tr: 'Şık ve resmi — hanımlar pastel tonlarda, beyler takım elbiseyle.', en: 'Formal and elegant — pastels for ladies, suits for gentlemen.', fr: 'Tenue de soirée — pastels bienvenus, costume pour ces messieurs.', ku: 'Fermî û xweşik.', ar: 'رسمي وأنيق — ألوان الباستيل للسيدات والبدلات للرجال.' },
  red: { de: 'Traditionell willkommen — gern in Rot, Gold oder Bindallı.', tr: 'Geleneksel kıyafetler hoş karşılanır — kırmızı, altın veya bindallı.', en: 'Traditional dress welcome — red, gold or bindallı.', fr: 'Tenues traditionnelles bienvenues — rouge et or.', ku: 'Cilên kevneşopî bi xêr hatin — sor û zêr.', ar: 'الأزياء التقليدية مرحب بها — الأحمر والذهبي.' },
  garden: { de: 'Sommerlich leger — flache Schuhe, wir stehen auf Rasen.', tr: 'Yazlık ve rahat — çimde olacağız, düz ayakkabı önerilir.', en: 'Summery and relaxed — flat shoes, we’ll be on the lawn.', fr: 'Décontracté d’été — chaussures plates, nous serons sur la pelouse.', ku: 'Havînî û rehet.', ar: 'صيفي ومريح — أحذية مسطحة لأننا على العشب.' },
  black: { de: 'Black Tie & Glitzer — je mehr Glamour, desto besser.', tr: 'Black tie ve ışıltı — ne kadar göz alıcı o kadar iyi.', en: 'Black tie & sparkle — the more glamour the better.', fr: 'Black tie & paillettes — plus c’est glamour, mieux c’est.', ku: 'Black tie û biriqîn.', ar: 'ربطة عنق سوداء وبريق — كلما زاد البريق كان أفضل.' },
  business: { de: 'Business casual.', tr: 'İş şıklığı (business casual).', en: 'Business casual.', fr: 'Tenue de ville.', ku: 'Business casual.', ar: 'ملابس عمل غير رسمية.' },
};

const FAQ_PARKING = {
  q: { de: 'Gibt es Parkplätze?', tr: 'Otopark var mı?', en: 'Is there parking?', fr: 'Peut-on se garer ?', ku: 'Cihê parkê heye?', ar: 'هل توجد مواقف سيارات؟' },
  a: { de: 'Ja, direkt am Veranstaltungsort und im Parkhaus nebenan. Mit Bus und Bahn seid ihr in 10 Minuten vom Hauptbahnhof da.', tr: 'Evet, mekânın hemen yanında ve yandaki otoparkta. Ana istasyondan toplu taşımayla 10 dakika.', en: 'Yes, right at the venue and in the car park next door. By public transport it’s 10 minutes from the main station.', fr: 'Oui, sur place et au parking voisin. En transports, 10 minutes depuis la gare.', ku: 'Erê, li cih û li parka cîran.', ar: 'نعم، بجوار المكان مباشرة وفي المرآب المجاور.' },
};
const FAQ_KIDS = {
  q: { de: 'Sind Kinder willkommen?', tr: 'Çocuklar gelebilir mi?', en: 'Are children welcome?', fr: 'Les enfants sont-ils invités ?', ku: 'Zarok dikarin werin?', ar: 'هل الأطفال مرحب بهم؟' },
  a: { de: 'Sehr gern! Es gibt eine Spielecke mit Betreuung und ein Kindermenü.', tr: 'Elbette! Gözetmenli bir oyun alanı ve çocuk menüsü olacak.', en: 'Absolutely! There’s a supervised play corner and a kids’ menu.', fr: 'Bien sûr ! Coin jeux surveillé et menu enfant.', ku: 'Bê guman! Cihê lîstikê û xwarina zarokan heye.', ar: 'بالتأكيد! توجد زاوية ألعاب بإشراف ووجبة أطفال.' },
};
const FAQ_HOTEL = {
  q: { de: 'Wo können wir übernachten?', tr: 'Nerede konaklayabiliriz?', en: 'Where can we stay?', fr: 'Où dormir ?', ku: 'Em dikarin li ku bimînin?', ar: 'أين يمكننا المبيت؟' },
  a: { de: 'Wir haben ein Zimmerkontingent in einem Hotel in der Nähe reserviert — Stichwort steht in der Einladung, Buchung bis vier Wochen vorher.', tr: 'Yakındaki bir otelde oda bloğu ayırdık — rezervasyonu dört hafta öncesine kadar yapabilirsiniz.', en: 'We’ve reserved a block of rooms at a nearby hotel — book up to four weeks before.', fr: 'Un contingent de chambres est réservé dans un hôtel proche — à réserver quatre semaines avant.', ku: 'Me li otêlek nêzîk ode veqetandine.', ar: 'حجزنا مجموعة غرف في فندق قريب — يرجى الحجز قبل أربعة أسابيع.' },
};
const FAQ_ACCESS = {
  q: { de: 'Ist der Ort barrierefrei?', tr: 'Mekân engelli erişimine uygun mu?', en: 'Is the venue accessible?', fr: 'Le lieu est-il accessible ?', ku: 'Cih ji bo kêmendaman guncan e?', ar: 'هل المكان مهيأ لذوي الإعاقة؟' },
  a: { de: 'Ja, alle Räume sind stufenlos erreichbar.', tr: 'Evet, tüm alanlara basamaksız erişim var.', en: 'Yes, all rooms are step-free.', fr: 'Oui, toutes les salles sont de plain-pied.', ku: 'Erê, hemû ode bê derence ne.', ar: 'نعم، جميع القاعات بدون درج.' },
};

function item(time: string, title: L, icon: ScheduleItem['icon'], location?: string): ScheduleItem {
  return { time, title, icon, location };
}

interface DemoSpec {
  title: string;
  hosts?: LocalText;
  date: string;
  langs: InviteLang[];
  schedule: ScheduleItem[];
  locations: InviteEvent['locations'];
  dress: keyof typeof DRESS;
  contacts: InviteEvent['contacts'];
  faq: InviteEvent['faq'];
  gifts?: InviteEvent['gifts'];
}

const KAUFHAUS = { name: 'Historisches Kaufhaus', address: 'Münsterplatz 24, 79098 Freiburg im Breisgau', lat: 47.9951, lng: 7.8521 };
const KONZERTHAUS = { name: 'Konzerthaus Freiburg', address: 'Konrad-Adenauer-Platz 1, 79098 Freiburg im Breisgau', lat: 47.9958, lng: 7.8414 };
const RATHAUS = { name: 'Standesamt Freiburg', address: 'Rathausplatz 2–4, 79098 Freiburg im Breisgau', lat: 47.9962, lng: 7.8492 };

const GIFTS_DEMO = (holder: string, ref: string): InviteEvent['gifts'] => ({
  accountHolder: holder,
  // Beispiel-IBAN aus der Dokumentation der Deutschen Bundesbank — gültige Prüfsumme, kein echtes Konto.
  iban: 'DE02120300000000202051',
  bic: 'BYLADEM1001',
  bank: 'Beispielbank',
  paypal: 'breisgaudigital',
  reference: ref,
});

const SPECS: Record<ThemeId, DemoSpec> = {
  dolcevita: {
    title: DEMO_TITLES.dolcevita,
    hosts: { de: 'Mit Liebe und Limoncello laden wir euch ein', tr: 'Sevgiyle ve limoncello eşliğinde sizi davet ediyoruz', en: 'With love and limoncello we invite you', fr: 'Avec amour et limoncello, nous vous invitons', ku: 'Bi evîn û limoncello em we vedixwînin', ar: 'بكل الحب ندعوكم' },
    date: '2027-06-19T16:00:00+02:00',
    langs: ['de', 'en', 'tr', 'fr'],
    schedule: [
      item('16:00', P.ceremony, 'ring', 'ceremony'),
      item('17:00', P.reception, 'glass', 'ceremony'),
      item('19:00', P.dinner, 'dinner', 'party'),
      item('21:30', P.dance, 'heart', 'party'),
      item('22:00', P.cake, 'cake', 'party'),
      item('22:30', P.party, 'music', 'party'),
    ],
    locations: [
      { id: 'ceremony', label: LOC.ceremony, name: 'Freiburger Münster', address: 'Münsterplatz, 79098 Freiburg im Breisgau', lat: 47.9955, lng: 7.8529 },
      { id: 'party', label: LOC.party, ...KAUFHAUS },
    ],
    dress: 'garden',
    contacts: [
      { role: ROLE.witness, name: 'Chiara', phone: '+49 155 66859378' },
      { role: ROLE.witnessM, name: 'Luca', phone: '+49 155 66859378' },
    ],
    faq: [FAQ_PARKING, FAQ_KIDS, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Giulia Romano', 'Hochzeit Giulia & Marco'),
  },
  klassik: {
    title: DEMO_TITLES.klassik,
    hosts: { de: 'Gemeinsam mit unseren Familien laden wir euch ein', tr: 'Ailelerimizle birlikte sizi davet ediyoruz', en: 'Together with our families we invite you', fr: 'Avec nos familles, nous vous invitons', ku: 'Bi malbatên xwe re em we vedixwînin', ar: 'مع عائلتينا ندعوكم' },
    date: '2027-06-12T14:00:00+02:00',
    langs: ['de', 'tr', 'en', 'fr', 'ku', 'ar'],
    schedule: [
      item('14:00', P.ceremony, 'ring', 'ceremony'),
      item('15:30', P.reception, 'glass', 'ceremony'),
      item('16:30', P.photos, 'camera', 'ceremony'),
      item('18:30', P.dinner, 'dinner', 'party'),
      item('21:00', P.dance, 'heart', 'party'),
      item('22:00', P.cake, 'cake', 'party'),
      item('22:30', P.party, 'music', 'party'),
    ],
    locations: [
      { id: 'ceremony', label: LOC.ceremony, ...RATHAUS },
      { id: 'party', label: LOC.party, ...KAUFHAUS },
    ],
    dress: 'festive',
    contacts: [
      { role: ROLE.witness, name: 'Merve', phone: '+49 155 66859378' },
      { role: ROLE.witnessM, name: 'Jonas', phone: '+49 155 66859378' },
    ],
    faq: [FAQ_PARKING, FAQ_KIDS, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Ayşe Yılmaz', 'Hochzeit Ayşe & Daniel'),
  },
  garten: {
    title: DEMO_TITLES.garten,
    date: '2027-05-22T15:00:00+02:00',
    langs: ['de', 'tr', 'en'],
    schedule: [
      item('15:00', P.arrival, 'glass', 'venue'),
      item('15:30', P.toast, 'heart', 'venue'),
      item('16:00', P.coffee, 'coffee', 'venue'),
      item('18:00', P.dinner, 'dinner', 'venue'),
      item('20:00', P.party, 'music', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, name: 'Mundenhof', address: 'Mundenhof 37, 79111 Freiburg im Breisgau', lat: 48.0109, lng: 7.7915 }],
    dress: 'garden',
    contacts: [{ role: ROLE.family, name: 'Can', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_KIDS],
  },
  minimal: {
    title: DEMO_TITLES.minimal,
    date: '2027-04-17T11:00:00+02:00',
    langs: ['de', 'en', 'fr'],
    schedule: [
      item('11:00', P.civil, 'ring', 'ceremony'),
      item('12:00', P.reception, 'glass', 'ceremony'),
      item('13:30', P.lunch, 'dinner', 'party'),
      item('16:00', P.coffee, 'coffee', 'party'),
    ],
    locations: [
      { id: 'ceremony', label: LOC.ceremony, ...RATHAUS },
      { id: 'party', label: LOC.party, ...KAUFHAUS },
    ],
    dress: 'festive',
    contacts: [{ role: ROLE.witness, name: 'Clara', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING],
    gifts: GIFTS_DEMO('Sophie Weber', 'Hochzeit Sophie & Jonas'),
  },
  kina: {
    title: DEMO_TITLES.kina,
    hosts: { de: 'Familie Kaya lädt herzlich ein', tr: 'Kaya ailesi sizleri davet eder', en: 'The Kaya family warmly invites you', fr: 'La famille Kaya vous invite', ku: 'Malbata Kaya we vedixwîne', ar: 'تدعوكم عائلة كايا' },
    date: '2027-07-09T19:00:00+02:00',
    langs: ['tr', 'de', 'ku', 'en', 'ar'],
    schedule: [
      item('19:00', P.arrival, 'glass', 'venue'),
      item('20:00', P.halay, 'music', 'venue'),
      item('21:30', P.henna, 'henna', 'venue'),
      item('22:30', P.dinner, 'dinner', 'venue'),
      item('23:00', P.party, 'music', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, ...KONZERTHAUS }],
    dress: 'red',
    contacts: [
      { role: ROLE.family, name: 'Fatma Kaya', phone: '+49 155 66859378' },
    ],
    faq: [FAQ_PARKING, FAQ_KIDS],
    gifts: { ...GIFTS_DEMO('Elif Kaya', 'Kına Elif & Emre'), paypal: undefined },
  },
  orient: {
    title: DEMO_TITLES.orient,
    hosts: { de: 'Die Familien Haddad und Nasser laden ein', tr: 'Haddad ve Nasser aileleri davet eder', en: 'The Haddad and Nasser families invite you', fr: 'Les familles Haddad et Nasser vous invitent', ku: 'Malbatên Haddad û Nasser we vedixwînin', ar: 'تتشرف عائلتا حداد وناصر بدعوتكم' },
    date: '2027-08-21T18:00:00+02:00',
    langs: ['de', 'ar', 'en', 'tr', 'fr'],
    schedule: [
      item('18:00', P.arrival, 'glass', 'venue'),
      item('19:00', P.zaffa, 'music', 'venue'),
      item('20:00', P.dinner, 'dinner', 'venue'),
      item('21:30', P.cake, 'cake', 'venue'),
      item('22:00', P.party, 'music', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, ...KONZERTHAUS }],
    dress: 'festive',
    contacts: [{ role: ROLE.family, name: 'Sami Haddad', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_KIDS, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Layla Haddad', 'Hochzeit Layla & Omar'),
  },
  rosa: {
    title: DEMO_TITLES.rosa,
    date: '2027-06-26T13:30:00+02:00',
    langs: ['de', 'en', 'fr'],
    schedule: [
      item('13:30', P.ceremony, 'ring', 'ceremony'),
      item('15:00', P.reception, 'glass', 'ceremony'),
      item('18:00', P.dinner, 'dinner', 'party'),
      item('21:00', P.dance, 'heart', 'party'),
      item('23:30', P.midnight, 'cake', 'party'),
    ],
    locations: [
      { id: 'ceremony', label: LOC.ceremony, name: 'Freiburger Münster', address: 'Münsterplatz, 79098 Freiburg im Breisgau', lat: 47.9955, lng: 7.8529 },
      { id: 'party', label: LOC.party, ...KAUFHAUS },
    ],
    dress: 'festive',
    contacts: [{ role: ROLE.witness, name: 'Julia', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Marie Schneider', 'Hochzeit Marie & Luca'),
  },
  rustikal: {
    title: DEMO_TITLES.rustikal,
    date: '2027-09-04T14:00:00+02:00',
    langs: ['de', 'en'],
    schedule: [
      item('14:00', P.ceremony, 'ring', 'venue'),
      item('15:00', P.coffee, 'coffee', 'venue'),
      item('18:00', P.dinner, 'dinner', 'venue'),
      item('21:00', P.party, 'music', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, name: 'Mundenhof', address: 'Mundenhof 37, 79111 Freiburg im Breisgau', lat: 48.0109, lng: 7.7915 }],
    dress: 'garden',
    contacts: [{ role: ROLE.witnessM, name: 'Paul', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_KIDS, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Anna Fischer', 'Hochzeit Anna & Ben'),
  },
  mediterran: {
    title: DEMO_TITLES.mediterran,
    date: '2027-07-31T16:00:00+02:00',
    langs: ['de', 'en', 'fr', 'tr'],
    schedule: [
      item('16:00', P.ceremony, 'ring', 'venue'),
      item('17:00', P.reception, 'glass', 'venue'),
      item('19:00', P.dinner, 'dinner', 'venue'),
      item('21:30', P.dance, 'heart', 'venue'),
      item('22:00', P.party, 'music', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, ...KAUFHAUS }],
    dress: 'garden',
    contacts: [{ role: ROLE.witness, name: 'Eleni', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_HOTEL],
    gifts: GIFTS_DEMO('Sofia Papadopoulou', 'Hochzeit Sofia & Nikos'),
  },
  mitternacht: {
    title: DEMO_TITLES.mitternacht,
    date: '2027-03-13T20:00:00+01:00',
    langs: ['de', 'tr', 'en'],
    schedule: [
      item('20:00', P.reception, 'glass', 'venue'),
      item('21:00', P.dinner, 'dinner', 'venue'),
      item('22:30', P.toast, 'mic', 'venue'),
      item('23:00', P.party, 'music', 'venue'),
      item('00:00', P.surprise, 'cake', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, ...KONZERTHAUS }],
    dress: 'black',
    contacts: [{ role: ROLE.orga, name: 'Deniz', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING],
    gifts: { text: { de: 'Keine Geschenke, bitte! Wer mag, legt etwas in die Reisekasse für Japan.', tr: 'Lütfen hediye getirmeyin! İsteyen Japonya seyahat kumbarasına katkıda bulunabilir.', en: 'No presents, please! If you like, chip in to the Japan travel fund.' }, paypal: 'breisgaudigital' },
  },
  business: {
    title: DEMO_TITLES.business,
    hosts: { de: 'Muster Technik GmbH', tr: 'Muster Technik GmbH', en: 'Muster Technik GmbH', fr: 'Muster Technik GmbH', ku: 'Muster Technik GmbH', ar: 'Muster Technik GmbH' },
    date: '2027-06-18T09:30:00+02:00',
    langs: ['de', 'en', 'tr', 'fr'],
    schedule: [
      item('09:30', P.arrival, 'coffee', 'venue'),
      item('10:00', P.keynote, 'mic', 'venue'),
      item('11:00', P.talks, 'mic', 'venue'),
      item('13:00', P.lunch, 'dinner', 'venue'),
      item('17:00', P.network, 'glass', 'venue'),
    ],
    locations: [{ id: 'venue', label: LOC.venue, ...KONZERTHAUS }],
    dress: 'business',
    contacts: [{ role: ROLE.orga, name: 'Team Events', phone: '+49 155 66859378' }],
    faq: [FAQ_PARKING, FAQ_ACCESS],
  },
};

/** Foto neben der Geschichte, je Beispiel (Pexels, siehe CREDITS.md). */
const STORY_PHOTOS: Record<ThemeId, number> = {
  dolcevita: 34061566,
  klassik: 13470038,
  garten: 11626283,
  minimal: 10133743,
  kina: 27164132,
  orient: 32029488,
  rosa: 20645194,
  rustikal: 28834571,
  mediterran: 34061566,
  mitternacht: 9214852,
  business: 8761324,
};

export function demoEvent(themeId: ThemeId): InviteEvent {
  const theme: InviteTheme = INVITE_THEMES.find((t) => t.id === themeId) ?? INVITE_THEMES[0];
  const s = SPECS[theme.id];
  const kind = theme.demoKind;
  return {
    slug: demoSlug(theme.id),
    kind,
    theme: theme.id,
    music: theme.music,
    langs: s.langs,
    title: s.title,
    hosts: s.hosts,
    date: s.date,
    // Zusage sechs Wochen vorher.
    rsvpUntil: new Date(new Date(s.date).getTime() - 42 * 864e5).toISOString().slice(0, 10),
    welcome: WELCOME[kind],
    story: STORY[kind],
    dressCode: DRESS[s.dress],
    schedule: s.schedule,
    locations: s.locations,
    contacts: s.contacts,
    faq: s.faq,
    gifts: s.gifts,
    heroImage: theme.image,
    gallery: [pexels(STORY_PHOTOS[theme.id], 1000)],
    sections: {
      countdown: true,
      story: true,
      schedule: true,
      locations: true,
      rsvp: true,
      gifts: !!s.gifts,
      photos: true,
      faq: true,
    },
    rsvp: { menu: kind !== 'corporate', maxPersons: 6, song: kind !== 'corporate' },
    guestUploads: true,
  };
}

// ── Beispiel-Daten für den Planer ──

const GUESTS: [string, InviteGuest['status'], number, number, InviteGuest['menu'], string, string?, string?][] = [
  ['Familie Yılmaz', 'yes', 4, 2, 'meat', 'Braut', 'Laktose', 'Tarkan – Şımarık'],
  ['Familie Becker', 'yes', 2, 1, 'fish', 'Bräutigam'],
  ['Merve Demir', 'yes', 1, 0, 'veggie', 'Freunde', undefined, 'ABBA – Dancing Queen'],
  ['Jonas Klein', 'yes', 2, 0, 'meat', 'Freunde'],
  ['Oma Hatice', 'yes', 1, 0, 'meat', 'Braut'],
  ['Lisa & Tim', 'maybe', 2, 0, '', 'Kollegen'],
  ['Familie Öztürk', 'yes', 3, 1, 'meat', 'Braut', 'Nüsse'],
  ['Clara Wagner', 'no', 1, 0, '', 'Freunde'],
  ['Onkel Mehmet', 'invited', 2, 0, '', 'Braut'],
  ['Familie Hoffmann', 'invited', 2, 2, '', 'Bräutigam'],
  ['Sarah Schulz', 'yes', 1, 0, 'vegan', 'Kollegen', 'Gluten'],
  ['Kemal & Aylin', 'yes', 2, 0, 'fish', 'Freunde', undefined, 'Sezen Aksu – Firuze'],
];

const MESSAGES = ['Wir freuen uns so für euch! ❤️', 'Çok mutlu olun, gözünüz aydın!', '', 'Wir kommen mit Tanzschuhen!'];

function rid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function demoGuests(): InviteGuest[] {
  const now = Date.now();
  return GUESTS.map(([name, status, adults, children, menu, group, allergies, song], i) => ({
    id: rid(),
    code: rid().slice(0, 6),
    name,
    status,
    adults,
    children,
    menu,
    group,
    allergies,
    song,
    message: status === 'yes' ? MESSAGES[i % MESSAGES.length] || undefined : undefined,
    table: undefined,
    respondedAt: status !== 'invited' ? new Date(now - (i + 1) * 36e5 * 20).toISOString() : undefined,
    createdAt: new Date(now - 30 * 864e5).toISOString(),
  }));
}

/** Aufgaben relativ zum Datum: Tage vor dem Event. */
const TASKS: { days: number; title: Partial<L>; category: string }[] = [
  { days: 300, title: { de: 'Budget festlegen', tr: 'Bütçeyi belirle', en: 'Set the budget' }, category: 'plan' },
  { days: 270, title: { de: 'Location besichtigen und buchen', tr: 'Mekânı gez ve rezerve et', en: 'Visit and book the venue' }, category: 'venue' },
  { days: 240, title: { de: 'Fotograf & Musik buchen', tr: 'Fotoğrafçı ve müzik ayarla', en: 'Book photographer & music' }, category: 'vendors' },
  { days: 180, title: { de: 'Gästeliste erstellen', tr: 'Davetli listesini hazırla', en: 'Draw up the guest list' }, category: 'guests' },
  { days: 150, title: { de: 'Digitale Einladung verschicken', tr: 'Dijital davetiyeyi gönder', en: 'Send the digital invitation' }, category: 'guests' },
  { days: 120, title: { de: 'Outfit aussuchen', tr: 'Kıyafeti seç', en: 'Choose the outfits' }, category: 'style' },
  { days: 90, title: { de: 'Menü mit dem Caterer abstimmen', tr: 'Menüyü catering ile belirle', en: 'Agree the menu with the caterer' }, category: 'food' },
  { days: 60, title: { de: 'Zusagen nachfassen', tr: 'Yanıt vermeyenleri ara', en: 'Chase missing replies' }, category: 'guests' },
  { days: 30, title: { de: 'Sitzplan fertigstellen', tr: 'Oturma planını tamamla', en: 'Finish the seating plan' }, category: 'guests' },
  { days: 14, title: { de: 'Endgültige Gästezahl an Location melden', tr: 'Kesin kişi sayısını mekâna bildir', en: 'Confirm final numbers with the venue' }, category: 'venue' },
  { days: 7, title: { de: 'Ablauf an Trauzeugen & Dienstleister schicken', tr: 'Programı şahitlere ve tedarikçilere gönder', en: 'Send the schedule to helpers & vendors' }, category: 'plan' },
  { days: 1, title: { de: 'Diashow auf der Leinwand testen', tr: 'Perdede slayt gösterisini test et', en: 'Test the slideshow on the screen' }, category: 'plan' },
];

export function taskTemplate(eventDate: string, lang: InviteLang): InviteTask[] {
  const at = new Date(eventDate).getTime();
  return TASKS.map((t) => ({
    id: rid(),
    title: t.title[lang] ?? t.title.en ?? t.title.de ?? '',
    due: new Date(at - t.days * 864e5).toISOString().slice(0, 10),
    done: false,
    category: t.category,
  }));
}

export function demoPlan(event: InviteEvent): InvitePlan {
  const tasks = taskTemplate(event.date, 'de');
  tasks.slice(0, 5).forEach((t) => (t.done = true));
  const budget: InviteBudgetItem[] = [
    { id: rid(), item: 'Location & Catering', planned: 9500, paid: 3000 },
    { id: rid(), item: 'Fotograf', planned: 1800, paid: 500 },
    { id: rid(), item: 'Musik / DJ', planned: 1200, paid: 0 },
    { id: rid(), item: 'Deko & Blumen', planned: 1400, paid: 300 },
    { id: rid(), item: 'Outfits', planned: 2500, paid: 1900 },
    { id: rid(), item: 'Digitale Einladung', planned: 149, paid: 149 },
  ];
  return {
    tasks,
    budget,
    budgetTotal: 18000,
    tables: [
      { id: 't1', name: 'Familie', seats: 10 },
      { id: 't2', name: 'Freunde', seats: 8 },
      { id: 't3', name: 'Kollegen', seats: 8 },
    ],
    notes: '',
  };
}
