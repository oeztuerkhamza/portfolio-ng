import { Lang } from './i18n.service';

/**
 * Per-locale project content. German is NOT stored here — it lives in
 * project.data.ts and is used as the fallback. So a missing locale/field
 * gracefully shows the German original (never breaks, partial is fine).
 */
export interface ProjectTx {
  subtitle?: string;
  category?: string;
  description?: string;
  role?: string;
  /** Multi-paragraph body (split on \n\n by the template). */
  long?: string;
  features?: string[];
}

export const PROJECT_CONTENT: Record<string, Partial<Record<Lang, ProjectTx>>> = {
  'bikehaus-freiburg': {
    en: {
      subtitle: 'How a bicycle shop got purchasing, sales, rental and its online presence into one system',
      category: 'Full-stack platform',
      description:
        'A bicycle shop in Freiburg where the same bike is bought in, sold, rented out and offered online. Today it all runs in one system — including a website with online rental in twelve languages.',
      role: 'Full-stack developer & architect',
      long: `Bikehaus Freiburg is a bicycle shop with several lines of business: bikes are bought in, refurbished, sold, rented out and taken back. Every one of those steps needs a document, a signature, often a PDF — and all of it should also be visible online, for locals and visitors in many languages. Anyone who tries to manage that with spreadsheets, slips of paper and a site-builder page spends their time on admin instead of on bikes.

So our answer was not a website but a model of the business itself. In the admin area every bike has its path: purchase, stock, sale or rental, return — each station with its own document number, signature and PDF. Around 28 areas cover what a shop needs every day, from customers and invoices to expenses and refurbishment costs, statistics, export and backup. What used to live in several places now lives in one.

Facing outward, the site speaks twelve languages, each on its own addresses: showroom, e-bikes, new bikes, accessories, service, guides and pages for the towns around Freiburg. Rental is fully online — check availability, choose accessories, pay via Mollie. The booking lands in the admin area for approval and turns into a rental contract there. Nobody has to call back to ask whether a bike is still free on Saturday.

On top comes what a shop otherwise does by hand: every four hours a background service syncs the Kleinanzeigen listings, a Chrome extension edits them in bulk, and customer enquiries run as a chat through the connected mailbox. There is a Windows version for the shop counter, and everything runs on a dedicated, monitored server. The result: a business with one system instead of many tools — and a platform that has proven itself so well that it now runs in further shops too.`,
      features: [
        'Every bike has its path: purchase, stock, sale or rental, return — with document number, signature and PDF',
        'Online rental: availability, accessories and payment via Mollie — the booking becomes the rental contract',
        'Twelve languages on their own addresses, for locals and visitors',
        'Kleinanzeigen listings sync every four hours, bulk editing via a Chrome extension',
        'Customer enquiries as a chat in the admin area instead of scattered mailboxes',
        'Around 28 areas: customers, invoices, expenses, refurbishment, statistics, export, backup',
        'Windows version for the shop counter',
        'Dedicated, monitored and backed-up server — no dependence on site-builder vendors',
      ],
    },
    tr: {
      subtitle: 'Bir bisiklet dükkânı alım, satış, kiralama ve çevrimiçi görünürlüğü nasıl tek sisteme kavuşturdu',
      category: 'Full-stack platform',
      description:
        'Freiburg’da aynı bisikletin alındığı, satıldığı, kiralandığı ve çevrimiçi sunulduğu bir bisiklet dükkânı. Bugün her şey tek sistemde çalışıyor — on iki dilde çevrimiçi kiralamalı web sitesi dahil.',
      role: 'Full-stack geliştirici & mimar',
      long: `Bikehaus Freiburg, birden fazla ayağı olan bir bisiklet dükkânı: bisikletler alınıyor, bakımdan geçiriliyor, satılıyor, kiralanıyor ve geri alınıyor. Bu adımların her biri bir belge, bir imza, çoğu zaman bir PDF istiyor — üstelik hepsinin çevrimiçi de, yerel halk ve misafirler için birçok dilde görünür olması gerekiyor. Bunu tablolar, kâğıt notlar ve hazır site oluşturucuyla yürütmeye çalışan biri zamanını bisikletlere değil, idareye harcar.

Cevabımız bu yüzden bir web sitesi değil, işletmenin kendisinin bir yansıması oldu. Yönetim panelinde her bisikletin bir yolu var: alım, stok, satış veya kiralama, iade — her istasyonun kendi belge numarası, imzası ve PDF’i ile. Yaklaşık 28 bölüm bir dükkânın günlük ihtiyacını karşılıyor; müşteriler ve faturalardan giderlere, yenileme masraflarına, istatistik, dışa aktarma ve yedeğe kadar. Eskiden birkaç yerde duran şey artık tek yerde duruyor.

Dışarıya dönük site on iki dil konuşuyor, her birinin kendi adresleri var: showroom, e-bisikletler, yeni bisikletler, aksesuar, servis, rehber ve Freiburg çevresindeki yerler için sayfalar. Kiralama tamamen çevrimiçi — müsaitliği kontrol et, aksesuar seç, Mollie ile öde. Rezervasyon onay için yönetim paneline düşüyor ve orada kira sözleşmesine dönüşüyor. Cumartesi için hâlâ boş bisiklet var mı diye kimsenin geri araması gerekmiyor.

Üstüne bir dükkânın normalde elle yaptığı işler geliyor: bir arka plan servisi dört saatte bir Kleinanzeigen ilanlarını eşitliyor, bir Chrome eklentisi bunları toplu düzenliyor, müşteri talepleri bağlı posta kutusu üzerinden sohbet olarak akıyor. Tezgâh için bir Windows sürümü var ve her şey izlenen, kendi sunucusunda çalışıyor. Sonuç: birçok araç yerine tek sistemli bir işletme — ve kendini o kadar kanıtlamış bir platform ki bugün başka dükkânlarda da çalışıyor.`,
      features: [
        'Her bisikletin bir yolu var: alım, stok, satış veya kiralama, iade — belge numarası, imza ve PDF ile',
        'Çevrimiçi kiralama: müsaitlik, aksesuar ve Mollie ile ödeme — rezervasyon kira sözleşmesine dönüşür',
        'Kendi adreslerine sahip on iki dil, yerel halk ve misafirler için',
        'Kleinanzeigen ilanları dört saatte bir eşitlenir, Chrome eklentisiyle toplu düzenleme',
        'Müşteri talepleri dağınık posta kutuları yerine yönetim panelinde sohbet olarak',
        'Yaklaşık 28 bölüm: müşteriler, faturalar, giderler, yenileme, istatistik, dışa aktarma, yedek',
        'Tezgâh için Windows sürümü',
        'Kendi sunucusu, izlenen ve yedekli — site oluşturucu sağlayıcılara bağımlılık yok',
      ],
    },
  },
  'di-flux': {
    en: {
      subtitle: 'Time tracking that keeps an eye on working-time law by itself',
      category: 'Enterprise software',
      description:
        'A time-tracking system that checks breaks, maximum working hours and youth protection automatically — so HR and employees no longer have to calculate and look things up. Built in a team at Dicom GmbH.',
      role: 'Full-stack developer',
      long: `Anyone recording working time soon stands between two sides: employees want to clock in quickly, HR has to comply with the German Working Time Act — statutory breaks, maximum working hours, special rules for young people. With spreadsheets and hand calculation that is error-prone and uncomfortable in an audit. At Dicom GmbH, Di-Flux was created to hand that burden to the system instead of the people.

Our answer: the system knows the rules. It recognises statutory breaks automatically, warns when maximum working hours are exceeded and applies age-dependent protection rules. Employees see their times in a calendar on a clear dashboard, plan leave, report absences and receive notifications in real time. HR manages employees and roles and can correct entries in bulk instead of touching every line one by one.

What makes the difference with software like this lies beneath the surface: a time tracker that calculates wrongly is worse than none. So the back end follows a clear layered architecture with the business logic fully covered by unit tests, and sign-in is secured through tokens. The result is a system you can trust with your working-time data — and one that can be adapted traceably with every change in the law.`,
      features: [
        'Breaks under the Working Time Act are detected and calculated automatically',
        'Youth protection rules applied according to age',
        'Plan and approve leave and absences in a calendar',
        'Overtime and statistics at a glance',
        'Bulk entries for HR instead of line by line',
        'Employees and roles managed centrally',
        'Real-time notifications, secured sign-in',
        'Business logic fully covered by unit tests',
      ],
    },
    tr: {
      subtitle: 'Çalışma süresi yasasını kendisi gözeten zaman takibi',
      category: 'Kurumsal yazılım',
      description:
        'Molaları, azami çalışma sürelerini ve genç çalışan korumasını otomatik denetleyen bir zaman takip sistemi — böylece insan kaynakları ve çalışanlar artık hesap yapmak ve bir şeylere bakmak zorunda kalmıyor. Dicom GmbH’de ekip olarak geliştirildi.',
      role: 'Full-stack geliştirici',
      long: `Çalışma süresini kaydeden herkes kısa sürede iki taraf arasında kalır: çalışanlar hızlıca giriş yapmak ister, insan kaynakları Alman Çalışma Süresi Yasası’na uymak zorundadır — yasal molalar, azami çalışma süreleri, gençler için özel kurallar. Tablolar ve elle hesapla bu hataya açıktır ve denetimde can sıkıcıdır. Dicom GmbH’de Di-Flux, bu yükü insanlardan alıp sisteme vermek için doğdu.

Cevabımız: sistem kuralları biliyor. Yasal olarak zorunlu molaları otomatik tanıyor, azami çalışma süresi aşıldığında uyarıyor ve yaşa bağlı koruma kurallarını dikkate alıyor. Çalışanlar net bir panoda sürelerini takvimde görüyor, izin planlıyor, devamsızlık bildiriyor ve anlık bildirim alıyor. İnsan kaynakları çalışanları ve rolleri yönetiyor, kayıtları satır satır uğraşmak yerine toplu düzeltebiliyor.

Böyle yazılımlarda farkı yaratan şey yüzeyin altında: yanlış hesaplayan bir zaman takibi, hiç olmamasından kötüdür. Bu yüzden arka uç net bir katmanlı mimariyi izliyor, iş mantığı birim testleriyle tamamen kapsanıyor ve oturum açma belirteçlerle güvence altında. Sonuç: çalışma süresi verinize güvenebileceğiniz bir sistem — ve her yasa değişikliğinde izlenebilir biçimde uyarlanabilen.`,
      features: [
        'Çalışma Süresi Yasası’na göre molalar otomatik tanınır ve hesaplanır',
        'Genç çalışan koruma kuralları yaşa göre uygulanır',
        'İzin ve devamsızlık takvimde planlanır ve onaylanır',
        'Fazla mesai ve istatistikler tek bakışta',
        'İnsan kaynakları için satır satır yerine toplu kayıt',
        'Çalışanlar ve roller merkezi olarak yönetilir',
        'Anlık bildirimler, güvenli oturum açma',
        'İş mantığı birim testleriyle tamamen güvence altında',
      ],
    },
  },
  'gkn-portraits': {
    en: {
      subtitle: 'A photo studio that no longer negotiates its appointments on the phone',
      category: 'Website & booking system',
      description:
        'A job-application photo studio in Freiburg now books its clients in three clicks — in 15 languages, with a calendar in which an appointment is never given out twice.',
      role: 'Full-stack developer & designer',
      long: `GKN Portraits is a photo studio in Freiburg specialising in application and business portraits. Such shoots are short — which is exactly why finding appointments by phone and message eats a disproportionate amount of time: when does it suit, who comes when, has anyone cancelled? What was needed was a website that is less an image brochure than a booking counter: choose a package, click a free slot, enter contact details, done.

That is exactly how it works today. Three steps, confirmation by e-mail, a cancellation link for anyone who has to reschedule. Prices come in two lists — private and business — because what differs is not the effort but how the image is used. Anyone who needs an application photo in Freiburg does not only speak German: the site exists in 15 languages with translated addresses, Arabic with right-to-left layout. A guide on clothing, process and picking images takes away the uncertainty before the first appointment, and pages for the towns around Freiburg provide visibility in the region.

The real challenge lay behind the scenes: the studio has one room and one schedule, and with short shoots minutes matter. Booking therefore checks every slot against the calendar, and it is technically ruled out that the same slot is confirmed twice — even if two requests arrive at the same moment. Everything is managed in one place, with a sign-in by one-time link instead of a password that nobody can forget or pass on.

The result: less phone, no double bookings, and a site that is found in the region — with around 285 indexable addresses.`,
      features: [
        'Booking in three steps with confirmation e-mail and cancellation link',
        'Studio calendar with free slots — double booking technically ruled out',
        '15 languages with translated addresses, Arabic with right-to-left layout',
        'Two price lists (private and business) with three packages',
        'Guide on clothing, process and picking images',
        'Pages for the towns around Freiburg',
        'Passwordless sign-in by one-time link for the back office',
        'Around 285 findable addresses with clean search-engine markup',
      ],
    },
    tr: {
      subtitle: 'Randevularını artık telefonda pazarlık etmeyen bir fotoğraf stüdyosu',
      category: 'Web sitesi & randevu sistemi',
      description:
        'Freiburg’daki bir başvuru fotoğrafı stüdyosu artık müşterilerini üç tıkla randevuya alıyor — 15 dilde, hiçbir randevunun iki kez verilmediği bir takvimle.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `GKN Portraits, Freiburg’da başvuru ve iş portrelerinde uzmanlaşmış bir fotoğraf stüdyosu. Bu çekimler kısa sürüyor — tam da bu yüzden telefon ve mesajla randevu bulmak orantısız çok zaman yiyor: ne zaman uygun, kim ne zaman geliyor, biri iptal etti mi? İhtiyaç, bir imaj broşüründen çok bir rezervasyon gişesi olan bir siteydi: paketi seç, boş saati tıkla, iletişim bilgilerini gir, bitti.

Bugün tam olarak böyle işliyor. Üç adım, e-postayla onay, ertelemek zorunda kalanlar için bir iptal bağlantısı. Fiyatlar iki listede — özel ve ticari — çünkü fark emek değil, görüntünün kullanımı. Freiburg’da başvuru fotoğrafı isteyen herkes yalnızca Almanca konuşmuyor: site 15 dilde, çevrilmiş adreslerle, Arapça sağdan sola düzenle. Kıyafet, süreç ve fotoğraf seçimi üzerine bir rehber ilk randevudan önceki tereddüdü alıyor, Freiburg çevresindeki şehirler için sayfalar bölgede görünürlük sağlıyor.

Asıl zorluk perde arkasındaydı: stüdyonun tek bir odası ve tek bir takvimi var, kısa çekimlerde de dakikalar önemli. Rezervasyon bu yüzden her saati takvime karşı kontrol ediyor ve aynı zaman diliminin iki kez onaylanması — iki talep aynı anda gelse bile — teknik olarak imkânsız. Her şey tek yerden yönetiliyor, unutulabilecek ya da başkasına verilebilecek bir parola yerine tek kullanımlık bağlantıyla girişle.

Sonuç: daha az telefon, çift rezervasyon yok ve bölgede bulunan bir site — yaklaşık 285 dizinlenebilir adresle.`,
      features: [
        'Onay e-postası ve iptal bağlantısıyla üç adımda rezervasyon',
        'Boş saatli stüdyo takvimi — çift rezervasyon teknik olarak imkânsız',
        'Çevrilmiş adreslerle 15 dil, Arapça sağdan sola düzenle',
        'Üç paketli iki fiyat listesi (özel ve ticari)',
        'Kıyafet, süreç ve fotoğraf seçimi üzerine rehber',
        'Freiburg çevresindeki şehirler için sayfalar',
        'Yönetim için tek kullanımlık bağlantıyla parolasız giriş',
        'Temiz arama motoru işaretlemesiyle yaklaşık 285 bulunabilir adres',
      ],
    },
  },
  'dj-veys': {
    en: {
      subtitle: 'A wedding DJ gets found in a competitive market — and maintains the site himself',
      category: 'Website & CMS',
      description:
        'A wedding DJ from Stuttgart who hosts the evening in three languages got a website that holds its own in search against paid ads: around 270 pages, eight languages, maintainable by the client.',
      role: 'Full-stack developer & designer',
      long: `DJ Veys is a wedding DJ in Stuttgart. He hosts the evening in German, Turkish and English and plays live on saz and guitar — for couples whose families often bring several languages and traditions together. The market for wedding services is fiercely contested: the competition has been running ads for years and fills the first search results. An old domain with a handful of pages is no match. What was needed was a presence that is found where couples really search — and that the DJ can maintain himself, without calling a developer for every change.

Our answer: around 270 pages in eight languages, each with translated addresses. Pages of their own for the towns in Baden-Württemberg and for Turkish and Islamic weddings pick up exactly the couples searching for exactly that combination. Behind it sits an editorial system under /admin: gallery, real weddings, reviews, guide articles and even the image slots of the site are maintained by the DJ in a single interface. Enquiries, WhatsApp contacts and date requests all come together there — no enquiry gets lost in a mailbox.

Because a DJ lives by sound, you can hear him on the site: a player makes mixes audible right on the page. For press and organisers there is an information page of its own, and he hands over photos privately by link. And because trust is everything in the wedding business, prices are deliberately on request, and review figures are only shown once they are proven.

The site runs on a dedicated server with an automatically renewed certificate, a strict security policy and its own mail delivery. The result: a presence that is visible in Stuttgart and beyond — and that its owner has in his own hands.`,
      features: [
        'Eight languages with translated addresses, for couples and families of all backgrounds',
        'Around 270 pages: towns in Baden-Württemberg, Europe pages, Turkish and Islamic weddings',
        'Editorial system under /admin: gallery, real weddings, reviews and blog maintained by the client',
        'Enquiries, availability and WhatsApp contact in one flow — nothing gets lost',
        'Mixes audible right on the page',
        'A page of its own for press and organisers, private photo hand-over by link',
        'Prices on request, review figures only with proof',
        'Dedicated server with automatic certificates, a strict security policy and its own mail delivery',
      ],
    },
    tr: {
      subtitle: 'Bir düğün DJ’i rekabetçi bir pazarda bulunuyor — ve sitesini kendisi yönetiyor',
      category: 'Web sitesi & CMS',
      description:
        'Akşamı üç dilde yöneten Stuttgart’lı bir düğün DJ’i, aramada ücretli reklamlara karşı ayakta kalan bir web sitesi aldı: yaklaşık 270 sayfa, sekiz dil, müşteri tarafından kendisi yönetilebilir.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `DJ Veys, Stuttgart’ta düğün DJ’i. Akşamı Almanca, Türkçe ve İngilizce yönetiyor, saz ve gitarla canlı çalıyor — aileleri çoğu zaman birden fazla dili ve geleneği bir araya getiren çiftler için. Düğün hizmetleri pazarı çetin bir rekabet alanı: rakipler yıllardır reklam veriyor ve ilk arama sonuçlarını dolduruyor. Birkaç sayfalık eski bir alan adı buna karşı yetmez. İhtiyaç, çiftlerin gerçekten aradığı yerde bulunan ve DJ’in her değişiklik için bir yazılımcıyı aramadan kendisinin yönetebildiği bir görünümdü.

Cevabımız: sekiz dilde, her biri çevrilmiş adreslerle yaklaşık 270 sayfa. Baden-Württemberg’deki şehirler ile Türk ve İslami düğünler için ayrı sayfalar, tam da bu kombinasyonu arayan çiftleri karşılıyor. Arkasında /admin altında bir içerik yönetim sistemi var: galeri, gerçek düğünler, yorumlar, rehber makaleleri ve sitenin görsel alanlarını bile DJ tek bir arayüzden yönetiyor. Talepler, WhatsApp iletişimleri ve tarih istekleri orada birleşiyor — hiçbir talep bir posta kutusunda kaybolmuyor.

Bir DJ sesiyle yaşadığı için sitede onu duyabiliyorsunuz: bir oynatıcı miksleri doğrudan sayfada dinletiyor. Basın ve organizatörler için ayrı bir bilgi sayfası var, fotoğrafları özel bir bağlantıyla teslim ediyor. Ve düğün işinde güven her şey olduğu için fiyatlar bilerek talep üzerine, yorum rakamları ise ancak belgelendiğinde gösteriliyor.

Site kendi sunucusunda, otomatik yenilenen sertifika, sıkı bir güvenlik politikası ve kendi e-posta gönderimiyle çalışıyor. Sonuç: Stuttgart’ta ve ötesinde görünür — ve sahibinin elinde olan bir görünüm.`,
      features: [
        'Her kökenden çiftler ve aileler için çevrilmiş adreslerle sekiz dil',
        'Yaklaşık 270 sayfa: Baden-Württemberg şehirleri, Avrupa sayfaları, Türk ve İslami düğünler',
        '/admin altında içerik yönetimi: galeri, gerçek düğünler, yorumlar ve blog müşteri tarafından yönetilir',
        'Talep, müsaitlik ve WhatsApp iletişimi tek akışta — hiçbir şey kaybolmaz',
        'Miksler doğrudan sayfada dinlenir',
        'Basın ve organizatörler için ayrı sayfa, bağlantıyla özel fotoğraf teslimi',
        'Fiyatlar talep üzerine, yorum rakamları yalnızca belgeyle',
        'Otomatik sertifika, sıkı güvenlik politikası ve kendi e-posta gönderimiyle kendi sunucusu',
      ],
    },
  },
  'zerin-gold': {
    en: {
      subtitle: 'A jeweller makes its daily price visible — and wins trust with it',
      category: 'Premium website',
      description:
        'Gold dealer, jeweller and atelier in Freiburg: a calm black-and-gold site with live precious-metal prices, four calculators and a margin system the dealer controls himself — in seven languages.',
      role: 'Solo developer & designer',
      long: `Zerin Gold is a gold dealer, jeweller and jewellery atelier in Freiburg im Breisgau. With gold every customer asks the same thing first: what is my piece worth today, and can I believe the dealer? A business-card page does not answer that. What was needed was a presence that radiates solidity, shows the daily price openly and reaches people of different languages — because customers who prefer to ask in Turkish or Arabic also come with scrap gold and wedding rings.

Our answer: a calm black-and-gold site with fine serif type and gentle movement — with gold it is not loudness that sells but the impression of reliability. The price is the heart of it: the site reads precious-metal rates live, converts them via the current euro rate into cents per gram of fine weight and shows them as a ticker at the top of the page. Four calculators turn that into answers: what is my scrap gold worth? What do 585 or 750 mean in carats? What does a Krugerrand cost? And what does a savings plan yield? Anyone who knows before the visit what to expect comes with trust instead of scepticism.

The dealer stays in charge of his prices: he controls his margins himself in the protected admin area, secured with strong password protection and a second factor. Forms are protected by invisible spam protection instead of annoying image puzzles. Seven languages, Arabic with right-to-left layout, and around 290 pages for the search terms that are really used in this trade — from “Gramm Altın” to wedding rings.

The outcome is visible: the site is a reference for the business, and both Zerin Gold and Bikehaus have publicly rated their satisfaction on Google. It is hosted in Germany and tested before every change.`,
      features: [
        'Live precious-metal prices as a ticker, converted into cents per gram of fine weight',
        'Four calculators: scrap-gold value, carat conversion, Krugerrand, savings plan',
        'The dealer controls his margins himself in the admin area',
        'Seven languages, Arabic with right-to-left layout',
        'Calm black-and-gold design with fine typography and gentle movement',
        'Protected admin area with strong password protection and a second factor',
        'Forms with invisible spam protection instead of image puzzles',
        'Around 290 pages for the trade’s search terms, tested before every change',
      ],
    },
    tr: {
      subtitle: 'Bir kuyumcu günlük fiyatını görünür kılıyor — ve bununla güven kazanıyor',
      category: 'Premium web sitesi',
      description:
        'Freiburg’da altın tüccarı, kuyumcu ve atölye: canlı değerli maden fiyatları, dört hesaplayıcı ve tüccarın kendisinin yönettiği bir kâr payı sistemiyle sakin bir siyah-altın site — yedi dilde.',
      role: 'Solo geliştirici & tasarımcı',
      long: `Zerin Gold, Freiburg im Breisgau’da altın tüccarı, kuyumcu ve mücevher atölyesi. Altında her müşteri önce aynı şeyi sorar: parçam bugün ne kadar eder ve tüccara inanabilir miyim? Bir kartvizit sayfası buna cevap vermez. İhtiyaç, sağlamlık yayan, günlük fiyatı açıkça gösteren ve farklı dillerdeki insanlara ulaşan bir görünümdü — çünkü Türkçe veya Arapça sormayı tercih eden müşteriler de bozma altın ve alyansla geliyor.

Cevabımız: ince serif yazı ve yumuşak hareketlerle sakin bir siyah-altın site — altında satan şey gürültü değil, güvenilirlik izlenimidir. Fiyat işin kalbi: site değerli maden kurlarını canlı okuyor, güncel euro kuruyla saf ağırlık gram başına cent’e çeviriyor ve sayfanın tepesinde bir kayan şerit olarak gösteriyor. Dört hesaplayıcı bunu cevaba çeviriyor: bozma altınım ne eder? 585 veya 750 kaç ayar demek? Bir Krugerrand ne kadar? Ve bir birikim planı ne getirir? Ziyaretten önce neyle karşılaşacağını bilen biri şüpheyle değil güvenle geliyor.

Tüccar fiyatlarının efendisi olarak kalıyor: kâr paylarını korumalı yönetim bölümünde güçlü parola koruması ve ikinci faktörle kendisi yönetiyor. Formları can sıkıcı resim bulmacaları yerine görünmez bir spam koruması koruyor. Yedi dil, sağdan sola düzenle Arapça ve bu sektörde gerçekten aranan terimler için — “Gramm Altın”dan alyanslara — yaklaşık 290 sayfa.

Sonuç görünür: site işletme için bir referans ve hem Zerin Gold hem Bikehaus memnuniyetlerini Google’da herkese açık olarak değerlendirdi. Almanya’da barındırılıyor ve her değişiklikten önce test ediliyor.`,
      features: [
        'Saf ağırlık gram başına cent’e çevrilmiş canlı değerli maden fiyatları, kayan şerit olarak',
        'Dört hesaplayıcı: bozma altın değeri, ayar çevirme, Krugerrand, birikim planı',
        'Kâr paylarını tüccar yönetim bölümünde kendisi yönetir',
        'Yedi dil, sağdan sola düzenle Arapça',
        'İnce tipografi ve yumuşak hareketlerle sakin siyah-altın tasarım',
        'Güçlü parola koruması ve ikinci faktörlü korumalı yönetim bölümü',
        'Resim bulmacaları yerine görünmez spam korumalı formlar',
        'Sektörün arama terimleri için yaklaşık 290 sayfa, her değişiklikten önce test edilir',
      ],
    },
  },
  'benlirad': {
    en: {
      subtitle: 'A bicycle shop in Lahr whose stock goes online with no detours',
      category: 'Website & inventory system',
      description:
        'A family business in Lahr: whatever is booked in at the shop appears in the online showroom with no extra step. Plus repair appointments, warranty, four languages and a clearly named catchment area.',
      role: 'Concept, development & operation',
      long: `Benlirad is a family business in Lahr in the Black Forest, selling new and checked used bicycles since 2021. The shop had a problem many small retailers know: bikes come and go every day, and a website that has to be updated by hand is always a few days behind. What was needed was an online presence as current as the shop floor — without anyone keeping a second list on the side.

Our answer: the inventory system and the website are connected. When a bike is booked in at the shop, it shows up in the showroom with photos, price and a counter of how many bikes are available right now. When it is sold, it disappears again. Customers filter by condition, category and tyre size and find their bike without having to call first. The groundwork was laid at Bikehaus Freiburg; for Lahr we tailored it to a shop that sells and repairs rather than rents.

Around the showroom sits what builds trust: the repair service with appointment requests, a page of its own for the warranty, the bike buy-back offer, opening hours, WhatsApp contact and a clear statement of who the shop serves — from Lahr to Offenburg. The site comes in German, English, French and Turkish, so customers who prefer to read in their own language find their way around.`,
      features: [
        'Online showroom with the real stock: photos, prices and a counter of available bikes',
        'No double entry: booked in at the shop means visible online, sold means gone',
        'Finding the right bike: filters for condition, category and tyre size',
        'Repair service with appointment request right on the home page',
        'A warranty page of its own — clear on what applies to new and used bikes',
        'Bike buy-back as an offer of its own, contact via WhatsApp too',
        'Four languages: German, English, French, Turkish',
        'Catchment area from Lahr to Offenburg named so the shop is found locally',
      ],
    },
    tr: {
      subtitle: 'Lahr’daki bir bisiklet dükkânı: stok, dolambaçsız çevrimiçi',
      category: 'Web sitesi & stok sistemi',
      description:
        'Lahr’da bir aile işletmesi: dükkâna girilen her bisiklet ek bir adım olmadan çevrimiçi showroom’da görünür. Ayrıca tamir randevusu, garanti, dört dil ve net tanımlı hizmet bölgesi.',
      role: 'Konsept, geliştirme & işletme',
      long: `Benlirad, Kara Orman’daki Lahr’da 2021’den beri yeni ve kontrol edilmiş ikinci el bisiklet satan bir aile işletmesi. Dükkânın birçok küçük esnafın bildiği bir sorunu vardı: bisikletler her gün gelip gidiyor ve elle güncellenmesi gereken bir web sitesi hep birkaç gün geride kalıyor. İhtiyaç, tezgâh kadar güncel bir çevrimiçi görünümdü — kimsenin yanında ikinci bir liste tutmasına gerek kalmadan.

Cevabımız: stok sistemi ile web sitesini birbirine bağladık. Dükkânda bir bisiklet kaydedilince fotoğrafları, fiyatı ve şu an kaç bisiklet müsait olduğunu gösteren bir sayaçla showroom’da görünüyor. Satılınca yeniden kayboluyor. Müşteriler duruma, kategoriye ve lastik ölçüsüne göre filtreleyip önce aramak zorunda kalmadan bisikletini buluyor. Temeli Bikehaus Freiburg’da atılmıştı; Lahr için kiralayan değil satan ve tamir eden bir dükkâna göre uyarladık.

Showroom’un çevresinde güven veren şeyler duruyor: randevu talepli tamir servisi, garanti için ayrı bir sayfa, bisiklet alım teklifi, çalışma saatleri, WhatsApp iletişimi ve dükkânın kime hizmet verdiğinin net bir ifadesi — Lahr’dan Offenburg’a kadar. Site Almanca, İngilizce, Fransızca ve Türkçe; kendi dilinde okumayı tercih eden müşteriler de yolunu bulsun diye.`,
      features: [
        'Gerçek stokla çevrimiçi showroom: fotoğraf, fiyat ve müsait bisiklet sayacı',
        'Çift kayıt yok: dükkânda kaydedilen çevrimiçi görünür, satılan kaybolur',
        'Doğru bisikleti bulmak: durum, kategori ve lastik ölçüsü filtreleri',
        'Ana sayfada doğrudan randevu talepli tamir servisi',
        'Ayrı bir garanti sayfası — yeni ve ikinci el bisikletlerde neyin geçerli olduğu net',
        'Ayrı bir teklif olarak bisiklet alımı, WhatsApp ile de iletişim',
        'Dört dil: Almanca, İngilizce, Fransızca, Türkçe',
        'Dükkânın bölgesel olarak bulunması için Lahr’dan Offenburg’a hizmet bölgesi',
      ],
    },
  },
  'karaarslan-bike': {
    en: {
      subtitle: 'A family business in Lünen puts its bike stock in the shop window of the internet',
      category: 'Full-stack web app',
      description:
        'A family business in Lünen got what big dealers have long had: an online showroom with the real stock, an admin that shows the cost per bike, and automatic review requests.',
      role: 'Full-stack developer & architect',
      long: `Karaarslan Bike is a bicycle shop in Lünen in the Ruhr area, a family business since 2021. Like many small dealers it sells used and new bikes — and like many small dealers it depended on customers finding it through classified-ad portals. There the cheapest wins; what was missing was a shop window of its own, where the shop decides how it presents itself. What was needed was an online presence that gives the business a face, gets found locally and never shows a page that is out of date.

Our answer: the showroom shows the real stock — currently around 90 bikes — with filters for condition, category and price. What is booked in at the shop appears online without an extra step; what is sold disappears. Add accessories, new bikes, guides, an FAQ and a warranty page that builds trust before anyone picks up the phone. Pages of their own for the towns around Lünen make sure the shop turns up where people actually search — in four languages, because customers in the Ruhr area do not only read German.

Behind the window the back office works: purchasing, sales, returns, customers, invoices, expenses and statistics — and per bike the refurbishment costs and the parts fitted. So the owner sees for every bike what it really cost and what it earns, instead of just guessing. After a purchase an e-mail campaign asks the customer for a Google review, so satisfied buyers become visible recommendations.

What makes this project special: it is the proof of the pudding. The platform that was created at Bikehaus Freiburg had to carry over to a new business — different name, different city, different range, same core. It did, on a dedicated server with its own mail server and no dependence on site-builder vendors.`,
      features: [
        'Online showroom with the real stock and filters for condition, category and price',
        'Booked in at the shop means visible online — sold means gone',
        'Warranty page, FAQ and guides that answer questions before anyone calls',
        'Pages of their own for the towns around Lünen, in four languages',
        'Refurbishment costs and parts per bike: the owner sees what a bike really earns',
        'Back office for purchasing, sales, returns, customers, invoices, expenses, statistics',
        'Automatic request for a Google review after the purchase',
        'Dedicated server and mail server instead of site-builder dependence',
      ],
    },
    tr: {
      subtitle: 'Lünen’deki bir aile işletmesi bisiklet stokunu internetin vitrinine koyuyor',
      category: 'Full-stack web uygulaması',
      description:
        'Lünen’deki bir aile işletmesi büyük satıcıların çoktan sahip olduğu şeyi aldı: gerçek stoklu bir çevrimiçi showroom, bisiklet başına maliyeti gösteren bir yönetim ve otomatik yorum talepleri.',
      role: 'Full-stack geliştirici & mimar',
      long: `Karaarslan Bike, Ruhr bölgesindeki Lünen’de 2021’den beri aile işletmesi olarak çalışan bir bisiklet dükkânı. Birçok küçük satıcı gibi ikinci el ve yeni bisiklet satıyor — ve birçok küçük satıcı gibi müşterilerin onu ilan portalları üzerinden bulmasına bağlıydı. Orada en ucuz olan kazanır; eksik olan, dükkânın kendini nasıl göstereceğine kendisinin karar verdiği, kendine ait bir vitrindi. İhtiyaç, işletmeye yüz veren, yerelde bulunan ve asla güncelliğini yitirmiş bir sayfa göstermeyen bir çevrimiçi görünümdü.

Cevabımız: showroom gerçek stoku gösteriyor — şu an yaklaşık 90 bisiklet — durum, kategori ve fiyat filtreleriyle. Dükkânda kaydedilen ek bir adım olmadan çevrimiçi görünüyor; satılan kayboluyor. Buna aksesuar, yeni bisikletler, rehber, SSS ve kimse telefonu açmadan önce güven veren bir garanti sayfası ekleniyor. Lünen çevresindeki yerler için ayrı sayfalar, dükkânın insanların gerçekten aradığı yerde çıkmasını sağlıyor — dört dilde, çünkü Ruhr bölgesindeki müşteriler yalnızca Almanca okumuyor.

Vitrinin arkasında yönetim çalışıyor: alım, satış, iade, müşteriler, faturalar, giderler ve istatistik — ve bisiklet başına yenileme masrafları ile takılan parçalar. Böylece sahibi her bisikletin gerçekte neye mal olduğunu ve ne kazandırdığını tahmin etmek yerine görüyor. Satın alımdan sonra bir e-posta kampanyası müşteriden Google yorumu istiyor; memnun alıcılar görünür tavsiyelere dönüşüyor.

Bu projeyi özel kılan şey: bir deneme taşı olması. Bikehaus Freiburg’da doğan platformun yeni bir işletmeye taşınabilmesi gerekiyordu — farklı ad, farklı şehir, farklı ürün yelpazesi, aynı çekirdek. Taşındı; kendi sunucusunda, kendi posta sunucusuyla ve site oluşturucu sağlayıcılara bağımlılık olmadan.`,
      features: [
        'Gerçek stokla çevrimiçi showroom; durum, kategori ve fiyat filtreleri',
        'Dükkânda kaydedilen çevrimiçi görünür — satılan kaybolur',
        'Kimse aramadan önce soruları yanıtlayan garanti sayfası, SSS ve rehber',
        'Lünen çevresindeki yerler için dört dilde ayrı sayfalar',
        'Bisiklet başına yenileme masrafı ve parçalar: sahibi bir bisikletin gerçekte ne kazandırdığını görür',
        'Alım, satış, iade, müşteriler, faturalar, giderler ve istatistik için yönetim',
        'Satın alımdan sonra otomatik Google yorum talebi',
        'Site oluşturucu bağımlılığı yerine kendi sunucusu ve posta sunucusu',
      ],
    },
  },
  'praxis-gueltekin': {
    en: {
      subtitle: 'A family practice that meets its patients in their own language',
      category: 'Practice website',
      description:
        'A family practice in Hofheim am Taunus answers the most important questions before the call: who treats, what is offered, when it is open — in ten languages, fast and privacy-friendly.',
      role: 'Full-stack developer & designer',
      long: `Fazilet Gültekin’s family practice is in Hofheim am Taunus and treats patients with statutory and private insurance — in German and Turkish, in a region where many people prefer to read up on health questions in their own language. A practice website has a clear job: answer questions before the phone rings. Who treats here? What is offered? When is it open? How do I get an appointment? And: can I trust this practice?

Our answer: a site that reflects exactly that — in ten languages, Arabic with right-to-left layout. A service overview puts the focus on infectious diseases and in-house diagnostics. Opening hours, the note on the on-call service and the link to book an appointment appear on every page, not hidden in a menu. A health guide with expert articles and frequent questions answers what patients google anyway — and shows them that someone with expertise is speaking here.

Because it is about health, the site takes privacy seriously: visitor statistics only run after active consent and can be withdrawn at any time, fonts and images sit on the practice’s own server instead of with third parties. It is deliberately simple — a fast static site without a database and with almost no scripts, with security settings on the server. It loads quickly even on a phone in the waiting room.

The result: 93 findable pages that mark up doctor, practice and opening hours clearly for search engines — and a practice that is found in its region even where people do not search in German.`,
      features: [
        'Ten languages with translated addresses, Arabic with right-to-left layout',
        'Service overview with a focus on infectious diseases and in-house diagnostics',
        'Opening hours, on-call note and appointment link on every page',
        'Health guide with expert articles and frequent questions',
        '93 findable pages with clean markup for doctor, practice and opening hours',
        'Visitor statistics only after consent, withdrawable at any time',
        'Fast static site without a database, hardly any scripts',
        'Fonts and images from the practice’s own server, security settings included',
      ],
    },
    tr: {
      subtitle: 'Hastalarını kendi dillerinde karşılayan bir aile hekimliği muayenehanesi',
      category: 'Muayenehane web sitesi',
      description:
        'Hofheim am Taunus’taki bir aile hekimliği muayenehanesi en önemli soruları aramadan önce yanıtlıyor: kim tedavi ediyor, neler sunuluyor, ne zaman açık — on dilde, hızlı ve veri koruma dostu.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `Fazilet Gültekin’in aile hekimliği muayenehanesi Hofheim am Taunus’ta ve hem yasal hem özel sigortalı hastalara hizmet veriyor — Almanca ve Türkçe, sağlık sorularını kendi dillerinde okumayı tercih eden çok sayıda insanın yaşadığı bir bölgede. Bir muayenehane sitesinin net bir görevi var: telefon çalmadan önce soruları yanıtlamak. Burada kim tedavi ediyor? Neler sunuluyor? Ne zaman açık? Nasıl randevu alırım? Ve: Bu muayenehaneye güvenebilir miyim?

Cevabımız: tam bunu yansıtan bir site — on dilde, sağdan sola düzenle Arapça. Bir hizmet özeti enfeksiyon hastalıkları odağını ve muayenehanede yapılan tanıyı öne çıkarıyor. Çalışma saatleri, nöbetçi hizmet notu ve randevu bağlantısı her sayfada duruyor, bir menünün içinde gizlenmiyor. Uzman makaleleri ve sık sorulan sorularla bir sağlık rehberi, hastaların zaten Google’da aradığı şeyleri yanıtlıyor — ve onlara burada uzmanlığı olan birinin konuştuğunu gösteriyor.

Konu sağlık olduğu için site veri korumayı ciddiye alıyor: ziyaretçi istatistiği yalnızca aktif onaydan sonra çalışıyor ve istediği zaman geri alınabiliyor; yazı tipleri ve görseller üçüncü taraflarda değil kendi sunucusunda duruyor. Bilerek sade yapıldı — veritabanı olmadan ve neredeyse hiç betik olmadan hızlı, statik bir site; sunucuda güvenlik ayarlarıyla. Bekleme odasında telefondan bile hızlı açılıyor.

Sonuç: hekimi, muayenehaneyi ve çalışma saatlerini arama motorlarına net işaretleyen 93 bulunabilir sayfa — ve insanların Almanca aramadığı yerlerde bile bölgesinde bulunan bir muayenehane.`,
      features: [
        'Çevrilmiş adreslerle on dil, sağdan sola düzenle Arapça',
        'Enfeksiyon hastalıkları ve muayenehanede tanı odaklı hizmet özeti',
        'Çalışma saatleri, nöbetçi hizmet notu ve randevu bağlantısı her sayfada',
        'Uzman makaleleri ve sık sorulan sorularla sağlık rehberi',
        'Hekim, muayenehane ve çalışma saatleri için temiz işaretlemeli 93 bulunabilir sayfa',
        'Ziyaretçi istatistiği yalnızca onaydan sonra, istendiği zaman geri alınabilir',
        'Veritabanı olmadan hızlı statik site, neredeyse hiç betik yok',
        'Muayenehanenin kendi sunucusundan yazı tipleri ve görseller, güvenlik ayarları dahil',
      ],
    },
  },
  'seelenfreunde-coaching': {
    en: {
      subtitle: 'A website that builds trust: animal communication and coaching with Jessica Hug',
      category: 'Coaching website',
      description:
        'Jessica Hug accompanies people and their animals. Her website explains calmly what an animal conversation is, builds trust and leads to an appointment request in a few clicks.',
      role: 'Concept, design & build',
      long: `Since 2018 Jessica Hug has accompanied people and their animals — with animal communication, coaching and courses. Her offer needs explaining and is very personal: anyone who opens up to an animal conversation has to feel trust first. So what was needed was not a loud sales page but a presence that makes her calm and warmth tangible and makes it easy for visitors with no prior knowledge to get started.

Our answer: the site is built like a first conversation. It starts with what animal owners are dealing with — sudden restlessness, changes in behaviour, the feeling of not quite understanding their own animal — and then shows three clear paths: coaching, animal conversation and courses. “How an animal conversation works” explains in three steps what happens after the first message, and the difference between written report and LIVE session is put in plain words. Qualifications, client voices and frequent questions answer doubts before anyone has to voice them.

Every offer has its own page with exactly one next step. The appointment page leads to a request in one click, packages included. The animal communication course shows its three modules and puts interested people on a waiting list while it is being revised. The annual “Open Heart” seminar gets a stage of its own. Colours, type and gentle movement follow the brand: warm, earthy, calm. Privacy, cookie notice and the note that the offers do not replace veterinary treatment are part of it from the start.`,
      features: [
        'Entry through the questions animal owners ask rather than technical terms',
        'Three clear paths — coaching, animal conversation, courses — each with one next step',
        '“How an animal conversation works”: three steps, report or LIVE',
        'Trust through qualifications, client voices and frequent questions',
        'Appointment request in one click, packages included',
        'Course page with three modules and a waiting list with a bonus',
        'A page of its own for the annual “Open Heart” seminar',
        'A warm brand world: colours, type and movement like a calm room',
        'Privacy, cookie notice and disclaimer from the start',
      ],
    },
    tr: {
      subtitle: 'Güven veren bir web sitesi: Jessica Hug ile hayvan iletişimi ve koçluk',
      category: 'Koçluk web sitesi',
      description:
        'Jessica Hug insanlara ve hayvanlarına eşlik ediyor. Web sitesi hayvan görüşmesinin ne olduğunu sakin bir dille anlatıyor, güven kuruyor ve birkaç tıkla randevu talebine götürüyor.',
      role: 'Konsept, tasarım & uygulama',
      long: `Jessica Hug 2018’den beri insanlara ve hayvanlarına eşlik ediyor — hayvan iletişimi, koçluk ve kurslarla. Teklifi açıklama gerektiriyor ve çok kişisel: bir hayvan görüşmesine açılan kişinin önce güven duyması gerekir. Bu yüzden gereken şey gürültülü bir satış sayfası değil, onun sakinliğini ve sıcaklığını hissettiren ve ön bilgisi olmayan ziyaretçilere başlangıcı kolaylaştıran bir görünümdü.

Cevabımız: site, ilk bir sohbet gibi kurgulandı. Hayvan sahiplerini meşgul eden şeyle başlıyor — ani huzursuzluk, davranış değişiklikleri, kendi hayvanını tam anlayamama hissi — sonra üç net yol gösteriyor: koçluk, hayvan görüşmesi ve kurslar. “Hayvan görüşmesi nasıl işler” ilk mesajdan sonra ne olduğunu üç adımda anlatıyor; yazılı rapor ile CANLI görüşme arasındaki fark sade bir dille yazılı. Nitelikler, müşteri yorumları ve sık sorulan sorular, şüpheleri kimse dile getirmek zorunda kalmadan yanıtlıyor.

Her teklifin kendi sayfası ve tam olarak bir sonraki adımı var. Randevu sayfası paketler dahil tek tıkla talebe götürüyor. Hayvan iletişimi kursu üç modülünü gösteriyor ve gözden geçirilirken ilgilenenleri bekleme listesine alıyor. Yıllık “Open Heart” semineri kendi sahnesine sahip. Renkler, yazı tipi ve yumuşak hareket markayı izliyor: sıcak, toprak tonlu, sakin. Gizlilik, çerez bildirimi ve tekliflerin veteriner tedavisinin yerini tutmadığı notu baştan itibaren işin parçası.`,
      features: [
        'Teknik terimler yerine hayvan sahiplerinin sorularıyla giriş',
        'Üç net yol — koçluk, hayvan görüşmesi, kurslar — her biri tek bir sonraki adımla',
        '“Hayvan görüşmesi nasıl işler”: üç adım, rapor veya CANLI',
        'Nitelikler, müşteri yorumları ve sık sorulan sorularla güven',
        'Paketler dahil tek tıkla randevu talebi',
        'Üç modüllü kurs sayfası ve bonuslu bekleme listesi',
        'Yıllık “Open Heart” semineri için ayrı bir sayfa',
        'Sıcak bir marka dünyası: sakin bir oda gibi renkler, yazı ve hareket',
        'Baştan itibaren gizlilik, çerez bildirimi ve sorumluluk notu',
      ],
    },
  },
  'kulturplattform-freiburg': {
    en: {
      subtitle: 'A cultural association maintains its platform itself — without needing a developer for every text',
      category: 'Web app / CMS',
      description:
        'A cultural association in Freiburg manages events, courses, volunteering and newsletter in one place. The board maintains content and translations itself, and the newsletter is built to be legally sound.',
      role: 'Full-stack developer',
      long: `Kulturplattform Freiburg e. V. organises events, courses and meeting formats in Freiburg — carried by people who do this alongside job and family. For an association like that a website only helps if the board can maintain it itself: a new date, a changed course, a text in German and Turkish — without having to ask someone who can code every time. And the newsletter that holds people together has to run legally flawlessly.

Our answer: a platform that reflects what the association actually does. Activities with categories, search and detail pages, courses, partners, statutes, donations and a form for people who want to volunteer. The board maintains everything in the admin area, translations included: they live in the database, not in the program text. A new text in German and Turkish therefore needs no programming and no release by a developer.

The newsletter is not a mailto link but a complete process: whoever signs up confirms by link (double opt-in), every mail contains an unsubscribe option, campaigns exist per language and sending runs in batches so mailboxes are not overloaded. If the main sending service fails, a second one steps in. So what the association wants to say gets through.

Because an association plans for years, the technology underneath is built for maintainability: clear layers and tested business logic so later changes do not endanger everything that exists. The platform runs on a dedicated server with its own mailboxes, with backup and restore scripts. The result: an association that has its digital work in its own hands.`,
      features: [
        'Activities with categories, search and detail pages',
        'Courses, partners, statutes, donations and a form for volunteers',
        'Bilingual (German and Turkish) — the board maintains translations itself in the admin area',
        'Newsletter with confirmation by link, unsubscribe in every mail and campaigns per language',
        'Sending in batches with a second sending route as fallback',
        'Clear structure and tested business logic for later changes',
        'Dedicated server with its own mailboxes',
        'Backup and restore scripts included',
      ],
    },
    tr: {
      subtitle: 'Bir kültür derneği platformunu kendisi yönetiyor — her metin için bir yazılımcıya ihtiyaç duymadan',
      category: 'Web uygulaması / CMS',
      description:
        'Freiburg’daki bir kültür derneği etkinlikleri, kursları, gönüllülüğü ve bültenini tek yerden yönetiyor. Yönetim kurulu içerik ve çevirileri kendisi yönetiyor, bülten hukuka uygun kurgulandı.',
      role: 'Full-stack geliştirici',
      long: `Kulturplattform Freiburg e. V., Freiburg’da etkinlikler, kurslar ve buluşma formatları düzenliyor — bunu iş ve aile yanında yapan insanlar tarafından yürütülüyor. Böyle bir dernek için web sitesi ancak yönetim kurulu onu kendisi yönetebiliyorsa işe yarar: yeni bir tarih, değişen bir kurs, Almanca ve Türkçe bir metin — her seferinde kod yazabilen birine sormak zorunda kalmadan. Ve insanları bir arada tutan bülten hukuken kusursuz çalışmak zorunda.

Cevabımız: derneğin gerçekte yaptığı şeyi yansıtan bir platform. Kategorili, aramalı ve ayrıntı sayfalı etkinlikler, kurslar, ortaklar, tüzük, bağışlar ve gönüllü olmak isteyenler için bir form. Yönetim kurulu her şeyi yönetim bölümünden yönetiyor, çeviriler dahil: çeviriler program metninde değil veritabanında duruyor. Almanca ve Türkçe yeni bir metin bu yüzden programlama ya da bir yazılımcının yayına alması gerektirmiyor.

Bülten bir mailto bağlantısı değil, eksiksiz bir süreç: kaydolan bağlantıyla onaylıyor (çift onay), her e-postada abonelikten çıkma imkânı var, kampanyalar dil başına yapılıyor ve gönderim posta kutularını aşırı yüklememek için gruplar halinde ilerliyor. Ana gönderim servisi çökerse ikincisi devreye giriyor. Böylece derneğin söylemek istediği ulaşıyor.

Dernek yıllar için planladığından altındaki teknoloji bakım kolaylığı için kuruldu: net katmanlar ve test edilmiş iş mantığı, sonraki değişikliklerin mevcut her şeyi tehlikeye atmaması için. Platform kendi sunucusunda, kendi posta kutularıyla, yedekleme ve geri yükleme betikleriyle çalışıyor. Sonuç: dijital işini kendi elinde tutan bir dernek.`,
      features: [
        'Kategorili, aramalı ve ayrıntı sayfalı etkinlikler',
        'Kurslar, ortaklar, tüzük, bağışlar ve gönüllüler için form',
        'İki dilli (Almanca ve Türkçe) — çevirileri yönetim kurulu yönetim bölümünde kendisi yönetir',
        'Bağlantıyla onaylı bülten, her e-postada abonelikten çıkma ve dil başına kampanyalar',
        'İkinci bir gönderim yoluyla yedeklenmiş, gruplar halinde gönderim',
        'Sonraki değişiklikler için net yapı ve test edilmiş iş mantığı',
        'Kendi posta kutularıyla kendi sunucusu',
        'Yedekleme ve geri yükleme betikleri dahil',
      ],
    },
  },
};
