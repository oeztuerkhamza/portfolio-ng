import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Startseite (Hero, Warum wir, Branchen, Ablauf, Referenzen,
 * Region, Ansprechpartner, FAQ). Werden von HomeComponent beim I18nService
 * registriert und landen so im Lazy-Chunk der Seite statt im Hauptbundle.
 */
export const HOME_CONTENT: Record<string, Entry> = {
  'home.hero.title': {
    de: 'Websites, die gut aussehen.<br /><em>Und Kunden bringen.</em>',
    en: 'Websites that look great.<br /><em>And bring in customers.</em>',
    tr: 'İyi görünen web siteleri.<br /><em>Üstelik müşteri getiren.</em>',
  },
  'home.trust1': { de: 'Festpreis vor Projektstart', en: 'Fixed price before we start', tr: 'Başlamadan önce sabit fiyat' },
  'home.trust2': { de: 'Persönlich vor Ort', en: 'In person, on site', tr: 'Yerinde, yüz yüze' },
  'home.trust3': { de: 'Erstgespräch kostenlos', en: 'Free first consultation', tr: 'İlk görüşme ücretsiz' },
  'home.trust4': { de: 'Einrichtung inklusive', en: 'Setup included', tr: 'Kurulum dahil' },
  'home.hero.badge': {
    de: 'Festpreis, schriftlich vorab',
    en: 'Fixed price, in writing',
    tr: 'Yazılı sabit fiyat',
  },
  'home.prod.title': {
    de: 'Neue Website oder Update?<br /><em>Beides zum Festpreis.</em>',
    en: 'New website or an update?<br /><em>Both at a fixed price.</em>',
    tr: 'Yeni web sitesi mi, güncelleme mi?<br /><em>İkisi de sabit fiyatla.</em>',
  },
  'home.prod.subtitle': {
    de: 'Von der ersten Skizze bis zum Livegang und danach: Design, Entwicklung, SEO und Hosting aus einer Hand — wir richten alles ein, erklären es Ihrem Team und bleiben erreichbar.',
    en: 'From the first sketch to going live and beyond: design, development, SEO and hosting from one source — we set everything up, explain it to your team and stay reachable.',
    tr: 'İlk taslaktan yayına almaya ve sonrasına: tasarım, geliştirme, SEO ve barındırma tek elden — her şeyi kurar, ekibinize anlatır ve ulaşılabilir kalırız.',
  },
  'home.prod.more.label': { de: 'Außerdem', en: 'Also', tr: 'Ayrıca' },
  'home.more1': { de: 'Online-Shops', en: 'Online shops', tr: 'Online mağazalar' },
  'home.more2': { de: 'Online-Terminbuchung', en: 'Online booking', tr: 'Online randevu' },
  'home.more3': { de: 'Google-Unternehmensprofil', en: 'Google Business Profile', tr: 'Google İşletme Profili' },
  'home.more4': {
    de: 'Web-Apps & individuelle Software',
    en: 'Web apps & custom software',
    tr: 'Web uygulamaları ve özel yazılım',
  },
  'home.why.label': { de: 'Warum wir', en: 'Why us', tr: 'Neden biz' },
  'home.why.title': {
    de: 'Digitalisierung ohne<br /><em>Fachchinesisch</em>.',
    en: 'Digitalisation<br /><em>without the jargon</em>.',
    tr: 'Teknik jargon olmadan<br /><em>dijitalleşme</em>.',
  },
  'home.why1.t': { de: 'Festpreis, schriftlich', en: 'Fixed price, in writing', tr: 'Yazılı sabit fiyat' },
  'home.why1.d': {
    de: 'Sie wissen vor dem Start, was es kostet. Keine Stundenzettel, keine Überraschungen auf der Rechnung.',
    en: 'You know the cost before we start. No timesheets, no surprises on the invoice.',
    tr: 'Başlamadan önce maliyeti bilirsiniz. Saat hesabı yok, faturada sürpriz yok.',
  },
  'home.why2.t': { de: 'Vor Ort in Südbaden', en: 'On site in southern Baden', tr: 'Güney Baden’de yerinde' },
  'home.why2.d': {
    de: 'Wir kommen in Ihren Betrieb, schauen uns die Abläufe an und richten alles direkt dort ein — kein Callcenter, kein Ticketsystem.',
    en: 'We come to your business, look at how you work and set everything up right there — no call centre, no ticket system.',
    tr: 'İşletmenize gelir, işleyişi yerinde görür ve her şeyi orada kurarız — çağrı merkezi yok, destek bileti yok.',
  },
  'home.why3.t': { de: 'Alles aus einer Hand', en: 'Everything from one source', tr: 'Her şey tek elden' },
  'home.why3.d': {
    de: 'Design, Entwicklung, SEO, Google-Profil und Hosting greifen ineinander. Ein Ansprechpartner kennt das ganze Bild — vom ersten Entwurf bis zum Betrieb.',
    en: 'Design, development, SEO, Google profile and hosting work together. One contact knows the whole picture — from the first draft to running it.',
    tr: 'Tasarım, geliştirme, SEO, Google profili ve barındırma birbirine bağlı. Tek muhatap resmin tamamını bilir — ilk taslaktan işletmeye kadar.',
  },
  'home.why4.t': { de: 'Ihre Daten gehören Ihnen', en: 'Your data stays yours', tr: 'Verileriniz size aittir' },
  'home.why4.d': {
    de: 'Domain, Inhalte und Zugänge laufen auf Ihren Namen. DSGVO-konform eingerichtet, ohne Knebelvertrag.',
    en: 'Domain, content and logins are in your name. Set up GDPR-compliant, with no lock-in contract.',
    tr: 'Alan adı, içerik ve erişimler sizin adınıza. GDPR uyumlu kurulum, bağlayıcı sözleşme yok.',
  },
  'home.ind.label': { de: 'Für wen', en: 'Who it’s for', tr: 'Kimler için' },
  'home.ind.title': {
    de: 'Gemacht für Betriebe<br /><em>mit Kundschaft vor Ort</em>.',
    en: 'Made for businesses<br /><em>with customers at the door</em>.',
    tr: 'Kapısına müşteri gelen<br /><em>işletmeler için</em>.',
  },
  'home.ind1.t': { de: 'Gastronomie & Cafés', en: 'Restaurants & cafés', tr: 'Restoran ve kafeler' },
  'home.ind1.d': {
    de: 'Website mit Speisekarte und Reservierungsanfrage, mobil schnell und bei Google gefunden.',
    en: 'Website with menu and reservation request, fast on mobile and found on Google.',
    tr: 'Menülü ve rezervasyon talepli site; mobilde hızlı, Google’da bulunur.',
  },
  'home.ind2.t': { de: 'Handwerk', en: 'Trades & crafts', tr: 'Zanaat ve ustalar' },
  'home.ind2.d': {
    de: 'Website mit Referenzfotos, Anfrageformular und Bewertungen nach jedem Auftrag.',
    en: 'Website with project photos, an enquiry form and reviews after every job.',
    tr: 'Referans fotoğraflı site, talep formu ve her işten sonra yorum.',
  },
  'home.ind3.t': { de: 'Einzelhandel', en: 'Retail', tr: 'Perakende' },
  'home.ind3.d': {
    de: 'Website oder Online-Shop mit Live-Bestand, Google-Profil mit Öffnungszeiten und lokaler Sichtbarkeit.',
    en: 'Website or online shop with live stock, a Google profile with opening hours and local visibility.',
    tr: 'Canlı stoklu web sitesi veya online mağaza, açılış saatli Google profili ve yerel görünürlük.',
  },
  'home.ind4.t': { de: 'Friseur & Kosmetik', en: 'Hair & beauty', tr: 'Kuaför ve güzellik' },
  'home.ind4.d': {
    de: 'Online-Terminbuchung, schnelle Website und gepflegtes Google-Profil.',
    en: 'Online booking, a fast website and a well-kept Google profile.',
    tr: 'Online randevu, hızlı web sitesi ve bakımlı Google profili.',
  },
  'home.ind5.t': { de: 'Praxen & Kanzleien', en: 'Practices & offices', tr: 'Muayenehane ve bürolar' },
  'home.ind5.d': {
    de: 'Seriöse, mehrsprachige Website, Terminanfrage online und DSGVO-konforme Einwilligung für Statistik.',
    en: 'A trustworthy multilingual website, online appointment requests and GDPR-compliant consent for analytics.',
    tr: 'Güven veren çok dilli site, online randevu talebi ve istatistik için GDPR uyumlu onay.',
  },
  'home.ind6.t': { de: 'Ferienwohnungen & Hotels', en: 'Holiday flats & hotels', tr: 'Tatil daireleri ve oteller' },
  'home.ind6.d': {
    de: 'Mehrsprachige Buchungsseite, Anfrage direkt beim Betrieb, gute Auffindbarkeit bei Google.',
    en: 'A multilingual booking site, enquiries straight to the business, good visibility on Google.',
    tr: 'Çok dilli rezervasyon sitesi, talepler doğrudan işletmeye, Google’da iyi görünürlük.',
  },
  'home.proc.label': { de: 'Ablauf', en: 'How it works', tr: 'Süreç' },
  'home.proc.title': {
    de: 'In vier Schritten<br /><em>digital</em>.',
    en: 'Digital<br /><em>in four steps</em>.',
    tr: 'Dört adımda<br /><em>dijital</em>.',
  },
  'home.proc1.t': { de: 'Erstgespräch', en: 'First conversation', tr: 'İlk görüşme' },
  'home.proc1.d': {
    de: 'Kostenlos, rund 30 Minuten, am Telefon oder bei Ihnen. Sie erzählen, wo es hakt.',
    en: 'Free, about 30 minutes, by phone or at your place. You tell us where it hurts.',
    tr: 'Ücretsiz, yaklaşık 30 dakika, telefonda ya da sizde. Nerede takıldığınızı anlatırsınız.',
  },
  'home.proc2.t': { de: 'Festpreis-Angebot', en: 'Fixed-price quote', tr: 'Sabit fiyat teklifi' },
  'home.proc2.d': {
    de: 'Wenige Tage später ein schriftliches Angebot — mit Umfang, Preis und Termin.',
    en: 'A few days later, a written quote — scope, price and timeline.',
    tr: 'Birkaç gün içinde yazılı teklif — kapsam, fiyat ve tarih.',
  },
  'home.proc3.t': { de: 'Umsetzung', en: 'Build & setup', tr: 'Uygulama' },
  'home.proc3.d': {
    de: 'Wir bauen und richten ein. Sie sehen Zwischenstände und entscheiden mit.',
    en: 'We build and set up. You see progress along the way and have your say.',
    tr: 'Biz kurar ve ayarlarız. Siz ara aşamaları görür, karara katılırsınız.',
  },
  'home.proc4.t': { de: 'Übergabe & Betreuung', en: 'Handover & support', tr: 'Teslim ve destek' },
  'home.proc4.d': {
    de: 'Einweisung für Ihr Team — danach bleiben wir Ihr Ansprechpartner.',
    en: 'A walkthrough for your team — and we stay your point of contact.',
    tr: 'Ekibinize kullanım eğitimi — sonrasında muhatabınız olmaya devam ederiz.',
  },
  'home.ref.label': { de: 'Referenzen', en: 'References', tr: 'Referanslar' },
  'home.ref.title': {
    de: 'Websites, die im Betrieb<br /><em>wirklich arbeiten</em>.',
    en: 'Websites that really<br /><em>work for the business</em>.',
    tr: 'İşletmede gerçekten<br /><em>çalışan web siteleri</em>.',
  },
  'home.ref.all': { de: 'Alle Referenzen', en: 'All references', tr: 'Tüm referanslar' },
  'home.region.label': { de: 'Region', en: 'Area', tr: 'Bölge' },
  'home.region.title': {
    de: 'Zuhause in Freiburg.<br /><em>Unterwegs in ganz Baden-Württemberg.</em>',
    en: 'Based in Freiburg.<br /><em>Working across Baden-Württemberg.</em>',
    tr: 'Merkezimiz Freiburg.<br /><em>Tüm Baden-Württemberg’deyiz.</em>',
  },
  'home.region.text': {
    de: 'Im Breisgau, in der Ortenau, im Markgräflerland und im Schwarzwald kommen wir persönlich vorbei. Betriebe im übrigen Baden-Württemberg betreuen wir per Video — und fahren zum Termin, wenn es nötig ist.',
    en: 'In the Breisgau, Ortenau, Markgräflerland and the Black Forest we come by in person. Businesses elsewhere in Baden-Württemberg we support by video — and travel for appointments when needed.',
    tr: 'Breisgau, Ortenau, Markgräflerland ve Kara Orman’da yüz yüze geliyoruz. Baden-Württemberg’in geri kalanındaki işletmelerle görüntülü çalışıyor, gerektiğinde yerinde buluşuyoruz.',
  },
  'home.region.city': {
    de: 'Ob Café in der Altstadt, Friseur in der Wiehre, Physiopraxis in Herdern, Werkstatt in Haslach oder Ferienwohnung in St. Georgen: In Freiburg entscheidet Google oft darüber, wer angerufen wird. Termine vor Ort machen wir im ganzen Stadtgebiet, von Zähringen bis Vauban, von Littenweiler bis Landwasser — meist direkt bei Ihnen im Laden, in der Praxis oder im Büro.',
    en: 'Whether it’s a café in the Altstadt, a hairdresser in Wiehre, a physio practice in Herdern, a workshop in Haslach or a holiday flat in St. Georgen: in Freiburg, Google often decides who gets the call. We meet in person anywhere in the city, from Zähringen to Vauban, from Littenweiler to Landwasser — usually right at your shop, practice or office.',
    tr: 'Altstadt’taki bir kafe, Wiehre’deki bir kuaför, Herdern’deki bir fizyoterapi muayenehanesi, Haslach’taki bir atölye ya da St. Georgen’deki bir tatil evi: Freiburg’da kimin aranacağına çoğu zaman Google karar verir. Zähringen’den Vauban’a, Littenweiler’den Landwasser’e kadar şehrin her yerinde yüz yüze görüşüyoruz — çoğunlukla doğrudan dükkânınızda, muayenehanenizde ya da ofisinizde.',
  },
  'home.region.onsite': { de: 'Persönlich vor Ort', en: 'On site', tr: 'Yerinde' },
  'home.region.remote': { de: 'Per Video & nach Absprache', en: 'By video & by arrangement', tr: 'Görüntülü ve randevuyla' },
  'home.team.label': { de: 'Ihr Ansprechpartner', en: 'Your contact', tr: 'Muhatabınız' },
  'home.team.title': {
    de: 'Ein Gesicht statt<br /><em>einer Hotline</em>.',
    en: 'A face instead of<br /><em>a hotline</em>.',
    tr: 'Çağrı merkezi değil,<br /><em>tanıdık bir yüz</em>.',
  },
  'home.team.text': {
    de: 'Hinter Breisgau Digital steht Hamza Öztürk, Fachinformatiker (IHK) und Gründer. Er hat Websites, Buchungssysteme und Warenwirtschaft für Betriebe in Südbaden gebaut — und ist für Sie direkt erreichbar, auf Deutsch, Englisch oder Türkisch.',
    en: 'Behind Breisgau Digital is Hamza Öztürk, IHK-certified IT specialist and founder. He has built websites, booking systems and inventory software for businesses in southern Baden — and you reach him directly, in German, English or Turkish.',
    tr: 'Breisgau Digital’in arkasında kurucu ve IHK sertifikalı bilişim uzmanı Hamza Öztürk var. Güney Baden’deki işletmeler için web siteleri, rezervasyon ve stok sistemleri geliştirdi — kendisine Almanca, İngilizce veya Türkçe doğrudan ulaşabilirsiniz.',
  },
  'home.team.role': {
    de: 'Gründer · Fachinformatiker (IHK)', en: 'Founder · IT specialist (IHK)', tr: 'Kurucu · Bilişim uzmanı (IHK)',
  },
  'home.faq.label': { de: 'Häufige Fragen', en: 'FAQ', tr: 'Sık sorulanlar' },
  'home.faq.title': {
    de: 'Was Betriebe<br /><em>uns zuerst fragen</em>.',
    en: 'What businesses<br /><em>ask us first</em>.',
    tr: 'İşletmelerin<br /><em>ilk sorduğu sorular</em>.',
  },
  'home.faq1.q': { de: 'Was kostet eine Website?', en: 'How much does a website cost?', tr: 'Bir web sitesi ne kadar?' },
  'home.faq1.a': {
    de: 'Eine kompakte Firmen-Website beginnt bei {p} € zum Festpreis. Shop, Online-Buchung oder mehrere Sprachen kalkulieren wir nach dem kostenlosen Erstgespräch — schriftlich und bevor wir anfangen.',
    en: 'A compact business website starts at €{p}, at a fixed price. Shops, online booking or multiple languages are quoted after the free first consultation — in writing, before we start.',
    tr: 'Kompakt bir kurumsal web sitesi sabit fiyatla {p} €’dan başlar. Mağaza, online rezervasyon veya birden fazla dil, ücretsiz ön görüşmeden sonra yazılı olarak ve başlamadan önce fiyatlandırılır.',
  },
  'home.faq2.q': { de: 'Muss ich monatlich etwas zahlen?', en: 'Do I have to pay monthly?', tr: 'Aylık ödeme yapmam gerekiyor mu?' },
  'home.faq2.a': {
    de: 'Nach dem Festpreis fallen bei einer Website nur Domain und Hosting an, meist wenige Euro im Monat. Wartung und Änderungen gibt es auf Wunsch als Monatspaket, monatlich kündbar — Pflicht ist das nicht.',
    en: 'After the fixed price, a website only adds domain and hosting, usually a few euros a month. Maintenance and changes are available as a monthly plan you can cancel any month — nothing mandatory.',
    tr: 'Sabit fiyattan sonra web sitesinde yalnızca alan adı ve barındırma eklenir, genellikle ayda birkaç euro. Bakım ve değişiklikler her ay iptal edilebilen aylık paket olarak sunulur — zorunlu değildir.',
  },
  'home.faq3.q': { de: 'Wie schnell geht das?', en: 'How long does it take?', tr: 'Ne kadar sürer?' },
  'home.faq3.a': {
    de: 'Eine Firmen-Website steht meist nach 2–4 Wochen. Ein Homepage-Update für eine bestehende Seite ist je nach Paket in 3 bis 14 Werktagen fertig.',
    en: 'A business website is typically ready in 2–4 weeks. A homepage update for an existing site takes 3 to 14 working days, depending on the plan.',
    tr: 'Kurumsal bir web sitesi çoğunlukla 2–4 haftada hazırdır. Mevcut bir site için güncelleme pakete göre 3 ila 14 iş gününde biter.',
  },
  'home.faq4.q': { de: 'Kommen Sie auch außerhalb von Freiburg?', en: 'Do you work outside Freiburg?', tr: 'Freiburg dışına da geliyor musunuz?' },
  'home.faq4.a': {
    de: 'Ja. Im Breisgau, in der Ortenau, im Markgräflerland und im Schwarzwald persönlich; im übrigen Baden-Württemberg per Video und bei Bedarf vor Ort.',
    en: 'Yes. In person across the Breisgau, Ortenau, Markgräflerland and Black Forest; elsewhere in Baden-Württemberg by video and on site when needed.',
    tr: 'Evet. Breisgau, Ortenau, Markgräflerland ve Kara Orman’da yüz yüze; Baden-Württemberg’in geri kalanında görüntülü ve gerektiğinde yerinde.',
  },
  'home.faq5.q': {
    de: 'Ich bin nicht technisch — ist das ein Problem?', en: 'I’m not technical — is that a problem?', tr: 'Teknolojiden anlamıyorum — sorun olur mu?',
  },
  'home.faq5.a': {
    de: 'Nein, genau dafür gibt es uns. Wir erklären alles ohne Fachbegriffe, richten alles fertig ein und zeigen Ihrem Team, wie es geht. Wenn später etwas ist, rufen Sie einfach an.',
    en: 'No — that’s exactly what we’re here for. We explain everything without jargon, set it all up and show your team how it works. If anything comes up later, just call.',
    tr: 'Hayır, biz tam da bunun için varız. Her şeyi teknik terim kullanmadan anlatır, hazır kurar ve ekibinize nasıl kullanılacağını gösteririz. Sonradan bir şey olursa aramanız yeterli.',
  },
  'home.faq6.q': {
    de: 'Kommen Sie für ein Gespräch zu uns in den Betrieb?', en: 'Will you come to our business for a meeting?', tr: 'Görüşme için işletmemize geliyor musunuz?',
  },
  'home.faq6.a': {
    de: 'Ja. In Freiburg kommen wir grundsätzlich vorbei — das Erstgespräch ist kostenlos und dauert meist 30 bis 45 Minuten. Erreichbar sind wir Montag bis Freitag von 9 bis 18 Uhr; Termine vor Ort auch nach Vereinbarung.',
    en: 'Yes. In Freiburg we always come by — the first consultation is free and usually takes 30 to 45 minutes. We’re available Monday to Friday, 9 am to 6 pm; on-site appointments also by arrangement.',
    tr: 'Evet. Freiburg’da her zaman geliyoruz — ilk görüşme ücretsizdir ve genellikle 30–45 dakika sürer. Pazartesi–Cuma 09:00–18:00 arası ulaşılabiliriz; yerinde randevular ayrıca anlaşmaya göre.',
  },
  'home.cta.or': { de: 'oder direkt', en: 'or directly', tr: 'ya da doğrudan' },
  'home.hero.cta2': {
    de: 'Referenzen ansehen',
    en: 'See our work',
    tr: 'Çalışmalarımızı gör',
  },
  'home.price.title': {
    de: 'Schon eine Website?<br />Ab {p} € wieder auf Stand.',
    en: 'Already have a website?<br />Back up to date from €{p}.',
    tr: 'Zaten bir web siteniz mi var?<br />{p} €’dan itibaren yeniden güncel.',
  },
  'home.price.all': {
    de: 'Alle Pakete ansehen',
    en: 'See all packages',
    tr: 'Tüm paketleri gör',
  },
  'home.ref.live': {
    de: 'Live ansehen',
    en: 'View live',
    tr: 'Canlı gör',
  },
};
