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
      subtitle: 'Inventory management, website and online rental for a bicycle shop',
      category: 'Full-stack platform',
      description:
        'Inventory management, public website and online rental for a bicycle shop in Freiburg. .NET API, two Angular front-ends, a Chrome extension and a Windows app — self-hosted.',
      role: 'Full-stack developer & architect',
      long: `Bikehaus Freiburg isn’t a shop template, it’s the business itself: a bike is bought in, enters stock, then gets sold, rented out or returned — and every one of those steps carries its own document number, a signature and a PDF at the end. The admin interface covers that across roughly 28 modules, from customers and invoices through expenses and refurbishment costs to statistics, exports and backups.

Facing outward is the public site: Angular 17 with server-side rendering, twelve languages on their own URLs and around 100 routes pre-rendered at build time — showroom, e-bikes, new bikes, accessories, service, guides and local landing pages for the surrounding towns. Rentals run entirely online: check availability, pick accessories, pay via Mollie. The booking lands in the admin area for approval and turns into a rental contract there.

On top of that sits everything a single shop would otherwise do by hand: a background service syncs the Kleinanzeigen listings every four hours, a Chrome extension edits them in bulk, and customer enquiries arrive as a chat from a connected mailbox. It all runs on a dedicated server: Docker Compose with five services, nginx in front, certificates renewed automatically and monitored daily by GitHub Actions. For the counter there is also a Windows build that bundles the API.`,
      features: [
        'Full goods flow: purchase → stock → sale → return, with document numbers and signature',
        'Public rental booking with availability check and online payment (Mollie)',
        '12 languages on their own URLs, around 100 pre-rendered routes (Angular SSR)',
        'Kleinanzeigen sync every four hours plus a Chrome extension for bulk editing',
        'Admin area with ~28 modules: customers, invoices, expenses, statistics, export, backup',
        'PDF generation for rental contracts, invoices and receipts',
        'Windows desktop build (Electron) with a bundled API for in-store use',
        'Self-hosted: five-service Docker Compose, nginx, automatic TLS, own mail server',
      ],
    },
    tr: {
      subtitle: 'Bir bisiklet mağazası için stok yönetimi, web sitesi ve online kiralama',
      category: 'Full-stack platform',
      description:
        'Freiburg’daki bir bisiklet mağazası için stok yönetimi, halka açık web sitesi ve online kiralama. .NET API, iki Angular arayüzü, Chrome eklentisi ve Windows uygulaması — kendi sunucusunda.',
      role: 'Full-stack geliştirici & mimar',
      long: `Bikehaus Freiburg hazır bir mağaza şablonu değil, işin kendisi: Bisiklet satın alınır, stoğa girer, satılır, kiralanır ya da iade alınır — ve bu adımların her birinin kendi belge numarası, imzası ve sonunda bir PDF’i vardır. Yönetim arayüzü bunu yaklaşık 28 modülde kapsıyor: müşteriler ve faturalardan giderlere ve yenileme maliyetlerine, oradan istatistik, dışa aktarma ve yedeklemeye kadar.

Dışarıya bakan yüz ise halka açık site: sunucu taraflı render’lı Angular 17, kendi URL’leriyle on iki dil ve derleme sırasında önceden üretilmiş yaklaşık 100 sayfa — showroom, e-bike, yeni bisikletler, aksesuar, servis, rehber ve çevredeki şehirler için yerel sayfalar. Kiralama tamamen online: müsaitliği kontrol et, aksesuarı seç, Mollie ile öde. Rezervasyon onay için yönetim paneline düşer ve orada kira sözleşmesine dönüşür.

Üstüne, tek bir mağazanın normalde elle yaptığı her şey geliyor: Bir arka plan servisi Kleinanzeigen ilanlarını dört saatte bir eşitliyor, bir Chrome eklentisi ilanları toplu düzenliyor, müşteri mesajları bağlı bir posta kutusundan sohbet olarak geliyor. Tamamı kendi sunucusunda çalışıyor: beş servisli Docker Compose, önünde nginx, otomatik yenilenen sertifikalar ve GitHub Actions ile her gün yapılan kontrol. Tezgâh için ayrıca API’yi de içinde taşıyan bir Windows sürümü var.`,
      features: [
        'Eksiksiz mal akışı: alım → stok → satış → iade, belge numaraları ve imzayla',
        'Müsaitlik kontrolü ve online ödemeli (Mollie) halka açık kiralama',
        'Kendi URL’leriyle 12 dil, yaklaşık 100 önceden üretilmiş sayfa (Angular SSR)',
        'Dört saatte bir Kleinanzeigen eşitlemesi ve toplu düzenleme için Chrome eklentisi',
        '~28 modüllü yönetim paneli: müşteri, fatura, gider, istatistik, dışa aktarma, yedek',
        'Kira sözleşmesi, fatura ve belgeler için PDF üretimi',
        'Mağazada kullanım için API’yi içeren Windows sürümü (Electron)',
        'Kendi sunucusu: beş servisli Docker Compose, nginx, otomatik TLS, kendi mail sunucusu',
      ],
    },
  },
  'di-flux': {
    en: {
      subtitle: 'Intelligent time-tracking system for companies',
      category: 'Enterprise software',
      description: 'Intelligent time-tracking with automatic break calculation, working-time-law compliance and employee management. Built at Dicom GmbH.',
      role: 'Full-stack developer',
      long: `Di-Flux is an enterprise time-tracking system developed at Dicom GmbH. It digitises the entire working-time recording, from the time clock to overtime reporting, and automatically ensures compliance with the German Working Hours Act (ArbZG).

The system detects statutory breaks, validates maximum working times and supports age-dependent labour protection. The Angular 19 frontend offers an intuitive dashboard; the .NET backend follows a fully unit-tested Clean Architecture.`,
      features: [
        'Automatic break calculation per ArbZG',
        'Age-dependent labour-protection compliance (JArbSchG)',
        'Leave and absence management with calendar',
        'Overtime tracking and statistics',
        'Bulk operations for mass entries',
        'Employee and role management',
        'JWT-based authentication with interceptor',
        'Real-time notification system',
      ],
    },
    tr: {
      subtitle: 'Şirketler için akıllı zaman takip sistemi',
      category: 'Kurumsal yazılım',
      description: 'Otomatik mola hesabı, çalışma yasası uyumu ve personel yönetimiyle akıllı zaman takibi. Dicom GmbH’de geliştirildi.',
      role: 'Full-stack geliştirici',
      long: `Di-Flux, Dicom GmbH’de geliştirilen kurumsal bir zaman takip sistemidir. Çalışma süresi kaydını mesai saatinden fazla mesai raporlamasına kadar tümüyle dijitalleştirir ve Alman Çalışma Saatleri Yasası’na (ArbZG) uyumu otomatik sağlar.

Sistem yasal molaları algılar, azami çalışma sürelerini doğrular ve yaşa bağlı işçi korumasını destekler. Angular 19 ön yüzü sezgisel bir panel sunar; .NET arka ucu tamamen test edilmiş Clean Architecture izler.`,
      features: [
        'ArbZG’ye göre otomatik mola hesabı',
        'Yaşa bağlı işçi koruması uyumu (JArbSchG)',
        'Takvimle izin ve devamsızlık yönetimi',
        'Fazla mesai takibi ve istatistikler',
        'Toplu girişler için bulk işlemler',
        'Personel ve rol yönetimi',
        'Interceptor’lı JWT kimlik doğrulama',
        'Gerçek zamanlı bildirim sistemi',
      ],
    },
  },
  'gkn-portraits': {
    en: {
      subtitle: 'Application-photo studio in Freiburg with online booking',
      category: 'Website & booking system',
      description:
        'Website and booking flow for an application-photo studio in Freiburg. Next.js 16, 15 languages, booking in three steps — with one studio calendar shared by two brands.',
      role: 'Full-stack developer & designer',
      long: `GKN Portraits is the website of a Freiburg photo studio specialising in application and business portraits. The core isn’t a brochure page, it’s a booking: pick a package, click a free slot, leave your details — three steps, confirmation by email, cancellation link included. That removes the phone calls about open slots, which take up most of the admin work on short shoots.

Technically the site runs on Next.js 16 with React 19 and Tailwind 4. Fifteen languages with translated URLs cover who actually needs an application photo in Freiburg — including a right-to-left layout for Arabic. Prices come in two lists (private and business), because what differs isn’t the work but how the picture is used.

The interesting part is behind the scenes: the studio runs two brands — portrait and wedding — but there is one room and one schedule. Both websites therefore book into the same calendar, and every booking records which brand it came through. A database index makes sure the same slot is never confirmed twice. Everything is managed from a shared admin area with passwordless one-time-link login.`,
      features: [
        'Three-step online booking with confirmation email and cancellation link',
        'One studio calendar for two brands — double booking ruled out at database level',
        '15 languages with translated URLs, including RTL layout for Arabic',
        'Two price lists (private / business) with three packages',
        'Local landing pages for the towns around Freiburg',
        'Guide section on clothing, process and picture selection',
        'Passwordless login for the admin area (one-time link, JWT cookie)',
        'Around 285 indexable URLs with hreflang, JSON-LD and its own sitemap',
      ],
    },
    tr: {
      subtitle: 'Freiburg’da online randevulu vesikalık/başvuru fotoğrafı stüdyosu',
      category: 'Web sitesi & randevu sistemi',
      description:
        'Freiburg’daki bir başvuru fotoğrafı stüdyosu için web sitesi ve randevu sistemi. Next.js 16, 15 dil, üç adımda randevu — ve iki markanın paylaştığı tek bir stüdyo takvimi.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `GKN Portraits, Freiburg’da başvuru ve kurumsal portre fotoğrafına odaklanan bir stüdyonun web sitesidir. Merkezinde bir tanıtım sayfası değil, randevu var: paketi seç, takvimden boş saati tıkla, iletişim bilgilerini bırak — üç adım, e-posta ile onay, iptal bağlantısı dahil. Böylece kısa çekimlerde işin büyük kısmını oluşturan „boş saat var mı" telefonları ortadan kalkıyor.

Teknik olarak site Next.js 16, React 19 ve Tailwind 4 üzerinde çalışıyor. URL’leri de çevrilmiş on beş dil, Freiburg’da başvuru fotoğrafına ihtiyaç duyan herkesi kapsıyor — Arapça için sağdan sola yerleşim dahil. Fiyatlar iki listede: özel ve kurumsal. Çünkü fark eden şey emek değil, fotoğrafın kullanım biçimi.

Asıl mesele perde arkasında: stüdyonun iki markası var — portre ve düğün — ama tek bir mekân ve tek bir takvim. Bu yüzden iki site de aynı takvime yazıyor ve her randevu hangi marka üzerinden geldiğini saklıyor. Veritabanındaki bir indeks, aynı saatin iki kez onaylanmasını imkânsız kılıyor. Yönetim ise tek bir ortak panelden, tek kullanımlık bağlantıyla şifresiz girişle yapılıyor.`,
      features: [
        'Üç adımda online randevu: onay e-postası ve iptal bağlantısı',
        'İki marka için tek stüdyo takvimi — çift rezervasyon teknik olarak imkânsız',
        'URL’leri çevrilmiş 15 dil, Arapça için RTL yerleşim dahil',
        'İki fiyat listesi (özel / kurumsal) ve üç paket',
        'Freiburg çevresindeki şehirler için yerel sayfalar',
        'Kıyafet, akış ve fotoğraf seçimi üzerine rehber bölümü',
        'Yönetim paneline şifresiz giriş (tek kullanımlık bağlantı, JWT çerezi)',
        'hreflang, JSON-LD ve kendi site haritasıyla yaklaşık 285 indekslenebilir URL',
      ],
    },
  },
  'dj-veys': {
    en: {
      subtitle: 'Website and enquiry system for a wedding DJ',
      category: 'Website & CMS',
      description:
        'Website for a wedding DJ from Stuttgart: Next.js 16 with Payload CMS, eight languages, around 270 pages for local search — self-hosted on his own server.',
      role: 'Full-stack developer & designer',
      long: `DJ Veys is a wedding DJ from Stuttgart who hosts the evening in German, Turkish and English and plays saz and guitar live. The site replaces the old domain and is built to be found in a market where the competition has been buying ads for years: around 270 pages, eight languages with translated URLs, dedicated pages for the towns of Baden-Württemberg as well as for Turkish and Islamic weddings.

The client maintains all the content himself. Payload CMS runs inside the same Next.js process under /admin and drives the gallery, real weddings, reviews, guide articles and the site’s image slots. Enquiries, WhatsApp contacts and date requests land in the same interface, so nothing gets lost in an inbox. A waveform player makes the mixes audible right on the page.

It all runs on a dedicated server: Docker Compose with nginx and an automatically renewed certificate, SQLite on a persistent volume, deployment through GitHub Actions — plus a strict content security policy and self-hosted mail. Prices deliberately stay on request, and review numbers are only shown once they can be backed up.`,
      features: [
        'Eight languages (DE, TR, KU, AR, EN, NL, FR, ES) with per-language translated URLs',
        'Around 270 pages: Baden-Württemberg towns, European pages, topic pages',
        'Payload CMS under /admin — gallery, references, reviews and blog edited by the client',
        'Enquiry and availability flow with calendar and WhatsApp shortcut',
        'Waveform player for mixes (wavesurfer.js)',
        'EPK page for press and organisers, private photo handover by link',
        'Self-hosted: Docker Compose, nginx, automatic TLS renewal, GitHub Actions deploy',
        'Strict content security policy and self-hosted mail delivery',
      ],
    },
    tr: {
      subtitle: 'Bir düğün DJ’i için web sitesi ve talep sistemi',
      category: 'Web sitesi & CMS',
      description:
        'Stuttgart’lı bir düğün DJ’i için web sitesi: Payload CMS ile Next.js 16, sekiz dil, yerel arama için yaklaşık 270 sayfa — kendi sunucusunda barındırılıyor.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `DJ Veys, Stuttgart’ta yaşayan bir düğün DJ’i: geceyi Almanca, Türkçe ve İngilizce sunuyor, ayrıca canlı saz ve gitar çalıyor. Site eski alan adının yerini alıyor ve rakiplerin yıllardır reklam verdiği bir pazarda bulunabilmek üzere kurgulandı: yaklaşık 270 sayfa, URL’leri çevrilmiş sekiz dil, Baden-Württemberg şehirleri için ayrı sayfalar ve Türk düğünleri ile İslami düğünler için özel bölümler.

İçeriği müşteri kendisi yönetiyor. Payload CMS aynı Next.js süreci içinde /admin altında çalışıyor; galeri, gerçek düğünler, yorumlar, rehber yazıları ve sitedeki görsel alanları oradan yönetiliyor. Talepler, WhatsApp mesajları ve tarih sorguları da aynı panele düşüyor — böylece hiçbir talep bir posta kutusunda kaybolmuyor. Dalga formu oynatıcısı sayesinde mixler doğrudan sitede dinlenebiliyor.

Her şey kendi sunucusunda çalışıyor: nginx ve otomatik yenilenen sertifikayla Docker Compose, kalıcı bir birimde SQLite, GitHub Actions ile dağıtım — buna sıkı bir içerik güvenlik politikası ve kendi mail gönderimi eşlik ediyor. Fiyatlar bilinçli olarak „talep üzerine" duruyor, puan ve yorum sayıları ise belgelenene kadar yayımlanmıyor.`,
      features: [
        'Sekiz dil (DE, TR, KU, AR, EN, NL, FR, ES), her dil için çevrilmiş URL’ler',
        'Yaklaşık 270 sayfa: Baden-Württemberg şehirleri, Avrupa sayfaları, konu sayfaları',
        '/admin altında Payload CMS — galeri, referanslar, yorumlar ve blog müşteride',
        'Takvimli talep ve müsaitlik akışı, WhatsApp kısayoluyla',
        'Mixler için dalga formu oynatıcısı (wavesurfer.js)',
        'Basın ve organizatörler için EPK sayfası, bağlantıyla özel fotoğraf teslimi',
        'Kendi sunucusu: Docker Compose, nginx, otomatik TLS, GitHub Actions ile dağıtım',
        'Sıkı içerik güvenlik politikası ve kendi mail sunucusu',
      ],
    },
  },
  'zerin-gold': {
    en: {
      subtitle: 'Premium website with live metal prices for a jeweller',
      category: 'Premium website',
      description:
        'Website for a gold dealer, jeweller and atelier in Freiburg: live precious-metal prices, calculators and a product catalogue. Next.js 16, seven languages including RTL Arabic.',
      role: 'Solo developer & designer',
      long: `Zerin Gold is a gold dealer, jeweller and jewellery atelier in Freiburg im Breisgau. The site runs on a calm black-and-gold aesthetic with fine serif typography and restrained scroll animations — with gold, it isn’t volume that sells but the impression of solidity. Seven languages cover the customer base, Arabic including a right-to-left layout.

The technically interesting part is the price. A custom provider reads precious-metal quotes from Kitco, converts bid/ask per troy ounce into cents per gram of fine metal using the ECB exchange rate, and caches the result for two minutes — so the site shows dependable numbers without hitting the source on every visit. On top of that sit a margin engine the dealer controls from the admin area and four calculators: scrap-gold value, karat converter, Krugerrand and savings plan. The ticker in the header comes from the same source.

Underneath: Next.js 16 with React Server Components and Server Actions, Prisma 7 on PostgreSQL, Redis for caching, Auth.js v5 with Argon2 and a TOTP second factor for the admin area, Resend for email and Cloudflare Turnstile against form spam. Around 290 URLs with landing pages for the terms people actually search — from “gram altın” to wedding rings — plus Vitest and Playwright tests, hosted in Germany behind Cloudflare.`,
      features: [
        'Live metal prices: Kitco quotes + ECB rate → cents per gram fine, two-minute cache',
        'Four calculators: scrap-gold value, karat converter, Krugerrand, savings plan',
        'Margin engine — the dealer sets his own margins in the admin area',
        '7 languages including RTL Arabic, built white-label',
        'Next.js 16 with Server Components, Prisma 7/PostgreSQL and Redis',
        'Admin login with Argon2 and a TOTP second factor (Auth.js v5)',
        'Forms protected by Cloudflare Turnstile instead of captcha puzzles',
        'Around 290 URLs with keyword landing pages, tested with Vitest and Playwright',
      ],
    },
    tr: {
      subtitle: 'Bir kuyumcu için canlı maden fiyatlı premium web sitesi',
      category: 'Premium web sitesi',
      description:
        'Freiburg’daki altın alım-satımcısı, kuyumcu ve atölye için web sitesi: canlı değerli maden fiyatları, hesaplayıcılar ve ürün kataloğu. Next.js 16, RTL Arapça dahil yedi dil.',
      role: 'Solo geliştirici & tasarımcı',
      long: `Zerin Gold, Freiburg im Breisgau’da altın alım-satımcısı, kuyumcu ve mücevher atölyesi. Site sakin bir siyah-altın estetiğine, ince serif tipografiye ve ölçülü kaydırma animasyonlarına dayanıyor — altında satan şey ses yüksekliği değil, sağlamlık izlenimi. Yedi dil müşteri kitlesini kapsıyor; Arapça sağdan sola yerleşimiyle birlikte.

Teknik olarak asıl ilginç kısım fiyat. Kendi yazdığım bir sağlayıcı, değerli maden kotasyonlarını Kitco’dan okuyor, ons başına alış/satışı AMB kuruyla gram saf maden başına kuruşa çeviriyor ve sonucu iki dakika önbellekte tutuyor — yani site her ziyarette kaynağa yüklenmeden güvenilir rakam gösteriyor. Bunun üzerine, satıcının yönetim panelinden kontrol ettiği bir marj motoru ve dört hesaplayıcı geliyor: hurda altın değeri, karat çevirici, Krugerrand ve birikim planı. Başlıktaki şerit de aynı kaynaktan besleniyor.

Altında ise: React Server Components ve Server Actions ile Next.js 16, PostgreSQL üzerinde Prisma 7, önbellek için Redis, yönetim paneli için Argon2 ve TOTP ikinci faktörlü Auth.js v5, e-posta için Resend ve form spam’ine karşı Cloudflare Turnstile. Gerçekten aranan terimler için açılış sayfalarıyla yaklaşık 290 URL — „gram altın"dan alyanslara — ayrıca Vitest ve Playwright testleri; Almanya’da, Cloudflare arkasında barındırılıyor.`,
      features: [
        'Canlı maden fiyatı: Kitco kotasyonu + AMB kuru → gram saf başına kuruş, 2 dakika önbellek',
        'Dört hesaplayıcı: hurda altın değeri, karat çevirici, Krugerrand, birikim planı',
        'Marj motoru — satıcı kendi kâr marjını yönetim panelinden belirliyor',
        'RTL Arapça dahil 7 dil, white-label mimari',
        'Server Components ile Next.js 16, Prisma 7/PostgreSQL ve Redis',
        'Argon2 ve TOTP ikinci faktörlü yönetici girişi (Auth.js v5)',
        'Captcha bulmacası yerine Cloudflare Turnstile korumalı formlar',
        'Anahtar kelime açılış sayfalarıyla ~290 URL, Vitest ve Playwright testleri',
      ],
    },
  },
  'karaarslan-bike': {
    en: {
      subtitle: 'Inventory system and website for a bicycle shop in Lünen',
      category: 'Full-stack web app',
      description:
        'Second shop, same platform: .NET 9 API, Angular admin and a public SSR website with live stock for a family business in Lünen — four languages, self-hosted.',
      role: 'Full-stack developer & architect',
      long: `Karaarslan Bike is a bicycle shop in Lünen in the Ruhr area, a family business since 2021. It gets the same platform as Bikehaus Freiburg — and that was exactly the test of whether it really carries over to a new business: different name, different city, different region, different range, the same core of purchase, stock, sale, return, customers, invoices, expenses and statistics.

The public site runs on Angular 17 with server-side rendering in four languages (DE, EN, FR, TR). It pulls its content straight from the inventory system: the showroom shows the real stock with filters for condition, category and price, plus accessories, new bikes, guides, FAQ, warranty and city landing pages for the towns around Lünen. What is booked in at the shop is online without an intermediate step — currently around 90 bikes.

Behind it sits the admin area with modules for purchases, sales, returns, customers, invoices, expenses, renovation costs, parts and statistics, plus an email campaign that asks customers for a Google review after purchase. Everything runs on its own server with Docker and nginx: API, admin interface and SSR frontend as separate services, its own mail server, automatic certificate renewal.`,
      features: [
        'Inventory system: purchase, stock, sale, return, customers, invoices, expenses',
        'Public showroom with live stock and filters for condition, category and price',
        'Four languages (DE, EN, FR, TR) with their own URLs and SSR',
        'Accessories, new bikes, guides, FAQ and warranty page',
        'City landing pages and structured data for local search around Lünen',
        'Email campaign asking customers for a Google review after purchase',
        'Renovation costs and parts per bike in the admin area',
        'Self-hosting: Docker, nginx, own mail server, certificate automation',
      ],
    },
    tr: {
      subtitle: 'Lünen’deki bir bisiklet dükkânı için stok sistemi ve web sitesi',
      category: 'Full-stack web uygulaması',
      description:
        'İkinci dükkân, aynı platform: Lünen’deki bir aile işletmesi için .NET 9 API, Angular yönetim paneli ve canlı stoklu herkese açık SSR web sitesi — dört dil, kendi sunucusunda.',
      role: 'Full-stack geliştirici & mimar',
      long: `Karaarslan Bike, Ruhr bölgesindeki Lünen’de 2021’den beri aile işletmesi olarak çalışan bir bisiklet dükkânı. Bikehaus Freiburg ile aynı platformu kullanıyor — ve asıl sınav da buydu: platform gerçekten yeni bir işletmeye taşınabiliyor mu? Farklı isim, farklı şehir, farklı bölge, farklı ürün yelpazesi; ama alım, stok, satış, iade, müşteri, fatura, gider ve istatistikten oluşan aynı çekirdek.

Herkese açık site, dört dilde (DE, EN, FR, TR) sunucu tarafı render’lı Angular 17 ile çalışıyor. İçeriğini doğrudan stok sisteminden çekiyor: showroom gerçek stoğu durum, kategori ve fiyat filtreleriyle gösteriyor; ayrıca aksesuar, yeni bisiklet, rehber, SSS, garanti ve Lünen çevresindeki yerler için şehir sayfaları var. Dükkânda kaydedilen şey ara adım olmadan çevrimiçi görünüyor — şu an yaklaşık 90 bisiklet.

Arkasında alım, satış, iade, müşteri, fatura, gider, yenileme maliyeti, parça ve istatistik modüllerinden oluşan bir yönetim alanı ile müşterilerden alışveriş sonrası Google yorumu isteyen bir e-posta kampanyası var. Her şey kendi sunucusunda Docker ve nginx ile çalışıyor: API, yönetim arayüzü ve SSR ön yüzü ayrı servisler, kendi posta sunucusu, otomatik sertifika yenileme.`,
      features: [
        'Stok sistemi: alım, stok, satış, iade, müşteri, fatura, gider',
        'Canlı stoklu, durum, kategori ve fiyat filtreli herkese açık showroom',
        'Kendi URL’leri ve SSR ile dört dil (DE, EN, FR, TR)',
        'Aksesuar, yeni bisiklet, rehber, SSS ve garanti sayfası',
        'Lünen çevresinde yerel arama için şehir sayfaları ve yapılandırılmış veri',
        'Müşterilerden alışveriş sonrası Google yorumu isteyen e-posta kampanyası',
        'Yönetimde bisiklet başına yenileme maliyeti ve parçalar',
        'Self-hosting: Docker, nginx, kendi posta sunucusu, sertifika otomasyonu',
      ],
    },
  },
  'praxis-gueltekin': {
    en: {
      subtitle: 'Multilingual practice website for a GP in Hofheim am Taunus',
      category: 'Practice website',
      description:
        'Website for a general practice in Hofheim am Taunus: general medicine, internal medicine and infectious diseases in ten languages, with a health guide, FAQ and consent for analytics — built as a fast static site.',
      role: 'Full-stack developer & designer',
      long: `Fazilet Gültekin’s general practice is in Hofheim am Taunus and treats patients with statutory and private insurance — in German and Turkish, but also for patients in the region who prefer to read in their own language. The website is therefore built around language: ten languages (DE, TR, EN, AR, RU, UK, PL, RO, IT, ES) with their own translated URLs, Arabic with a right-to-left layout, 93 indexable pages in total with hreflang references and a sitemap.

Content-wise it answers what a practice really has to answer: who treats here, what is offered, when is it open, how do I get an appointment? On top of that come a service overview focused on infectious diseases, frequently asked questions and a health guide with articles on topics such as high blood pressure, iron deficiency, adult vaccinations or check-ups. Opening hours, the on-call service notice (116 117) and contact options are in the header or footer of every page.

Technically the site is deliberately plain: Astro generates pure HTML with minimal JavaScript at build time, fonts and images are self-hosted, served by nginx with security headers. Analytics via Google Tag Manager only runs after active consent, which can be withdrawn at any time — a must for a medical practice. Legal notice and privacy policy exist in every language.`,
      features: [
        'Ten languages with translated URLs, including RTL layout for Arabic',
        '93 indexable pages with hreflang, sitemap and structured data (physician, practice, opening hours)',
        'Service overview focused on infectious diseases and in-practice diagnostics',
        'Health guide with articles and FAQ for patients',
        'Opening hours, on-call service notice and appointment link on every page',
        'Consent banner: Google Tag Manager only after consent, revocable at any time',
        'Built statically with Astro — fast, no database, hardly any JavaScript',
        'Self-hosted fonts and images, security headers on nginx',
      ],
    },
    tr: {
      subtitle: 'Hofheim am Taunus’taki bir aile hekimi için çok dilli muayenehane sitesi',
      category: 'Muayenehane web sitesi',
      description:
        'Hofheim am Taunus’taki bir aile hekimliği muayenehanesi için web sitesi: on dilde genel tıp, iç hastalıkları ve enfeksiyon hastalıkları; sağlık rehberi, SSS ve istatistik için onay mekanizmasıyla — hızlı bir statik site olarak.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `Fazilet Gültekin’in aile hekimliği muayenehanesi Hofheim am Taunus’ta; yasal ve özel sigortalı hastalara Almanca ve Türkçe hizmet veriyor, ayrıca bölgede kendi dilinde okumayı tercih eden hastalara da. Bu yüzden site dil üzerine kurulu: kendi çevrilmiş URL’leriyle on dil (DE, TR, EN, AR, RU, UK, PL, RO, IT, ES), sağdan sola yerleşimli Arapça, hreflang bağlantıları ve site haritasıyla toplam 93 indekslenebilir sayfa.

İçerik olarak bir muayenehanenin gerçekten yanıtlaması gerekenleri karşılıyor: Burada kim tedavi ediyor, neler sunuluyor, ne zaman açık, nasıl randevu alırım? Bunlara enfeksiyon hastalıkları odaklı hizmet özeti, sık sorulan sorular ve yüksek tansiyon, demir eksikliği, yetişkin aşıları ya da check-up gibi konularda makaleler içeren bir sağlık rehberi ekleniyor. Çalışma saatleri, nöbetçi hizmet notu (116 117) ve iletişim yolları her sayfanın üstünde veya altında.

Teknik olarak site bilinçli olarak sade: Astro, derleme sırasında asgari JavaScript’li saf HTML üretiyor; yazı tipleri ve görseller kendi sunucumuzdan geliyor, nginx üzerinde güvenlik başlıklarıyla. Google Tag Manager ile istatistik yalnızca aktif onaydan sonra çalışıyor ve her an geri alınabiliyor — bir muayenehane için şart. Künye ve gizlilik politikası tüm dillerde mevcut.`,
      features: [
        'Çevrilmiş URL’lerle on dil, Arapça için RTL yerleşim dahil',
        'hreflang, site haritası ve yapılandırılmış veriyle (hekim, muayenehane, çalışma saatleri) 93 indekslenebilir sayfa',
        'Enfeksiyon hastalıkları odaklı hizmet özeti ve muayenehanede tanı',
        'Hastalar için makaleli sağlık rehberi ve SSS',
        'Her sayfada çalışma saatleri, nöbetçi hizmet notu ve randevu bağlantısı',
        'Onay bannerı: Google Tag Manager yalnızca onaydan sonra, her an geri alınabilir',
        'Astro ile statik derleme — hızlı, veritabanı yok, neredeyse hiç JavaScript yok',
        'Kendi sunucumuzdan yazı tipleri ve görseller, nginx üzerinde güvenlik başlıkları',
      ],
    },
  },
  'kulturplattform-freiburg': {
    en: {
      subtitle: 'Association platform with CMS, courses and newsletter',
      category: 'Web app / CMS',
      description:
        'Platform for a cultural association in Freiburg: events, courses, volunteering and a double-opt-in newsletter. .NET 10 backend with CQRS, React front-end, bilingual.',
      role: 'Full-stack developer',
      long: `Kulturplattform Freiburg e. V. runs events, courses and community formats in Freiburg. The platform maps what the association actually does: activities with categories, search and detail pages, course offerings, partners, the statutes, donations and a form for volunteers. The board maintains all of it themselves — including the translations, which live as resources in the database and are edited in the admin area. A new text in German and Turkish therefore needs no deployment.

The backend is a .NET 10 service in Clean Architecture with CQRS via MediatR, FluentValidation for input, JWT and BCrypt for sign-in, and Entity Framework Core on SQL Server — around 22 controllers, plus tests at domain, application and integration level. The newsletter isn’t a mailto link but a proper flow: double opt-in with a confirmation link, an unsubscribe token in every message, campaigns per language and batched sending, through Azure Communication Services with SMTP as a fallback.

It all runs on a dedicated server: Docker Compose with SQL Server, the API and nginx, dedicated mailboxes for sending, and backup and restore scripts alongside. The front-end is a React single-page app talking to the same API.`,
      features: [
        'Activities with category filter, search and detail pages',
        'Course offerings, partners, statutes, donations and a volunteer form',
        'Bilingual (DE/TR) — translations live in the database, not in the code',
        'Newsletter with double opt-in, unsubscribe token and per-language campaigns',
        'Delivery via Azure Communication Services with SMTP fallback',
        'Clean Architecture with CQRS (MediatR) and FluentValidation',
        'Tests at domain, application and integration level',
        'Self-hosted: Docker Compose with SQL Server, API and nginx, dedicated mailboxes',
      ],
    },
    tr: {
      subtitle: 'CMS, kurslar ve bülten içeren dernek platformu',
      category: 'Web uygulaması / CMS',
      description:
        'Freiburg’daki bir kültür derneği için platform: etkinlikler, kurslar, gönüllülük ve çift onaylı bülten. CQRS’li .NET 10 arka uç, React ön yüz, iki dilli.',
      role: 'Full-stack geliştirici',
      long: `Kulturplattform Freiburg e. V., Freiburg’da etkinlikler, kurslar ve buluşma programları düzenliyor. Platform derneğin gerçekten yaptığı işi yansıtıyor: kategorili, aramalı ve detay sayfalı etkinlikler, kurs programları, partnerler, tüzük, bağış ve gönüllüler için bir form. Hepsini yönetim kurulu kendisi güncelliyor — çeviriler dahil; çeviriler veritabanında kaynak olarak duruyor ve yönetim panelinden düzenleniyor. Almanca ve Türkçe yeni bir metin için dağıtım gerekmiyor.

Arka uç, MediatR üzerinden CQRS kullanan Clean Architecture mimarisinde bir .NET 10 servisi: girdiler için FluentValidation, giriş için JWT ve BCrypt, SQL Server üzerinde Entity Framework Core — yaklaşık 22 controller ve alan, uygulama ve entegrasyon düzeyinde testler. Bülten bir mailto bağlantısı değil, gerçek bir akış: onay bağlantılı çift opt-in, her mesajda abonelikten çıkma token’ı, dile göre kampanyalar ve gruplar hâlinde gönderim; Azure Communication Services ile, yedek olarak SMTP.

Tamamı kendi sunucusunda çalışıyor: SQL Server, API ve nginx içeren Docker Compose, gönderim için kendi posta kutuları, yanında yedekleme ve geri yükleme betikleri. Ön yüz, aynı API ile konuşan bir React tek sayfa uygulaması.`,
      features: [
        'Kategori filtresi, arama ve detay sayfalarıyla etkinlikler',
        'Kurs programları, partnerler, tüzük, bağış ve gönüllü formu',
        'İki dilli (DE/TR) — çeviriler kodda değil, veritabanında',
        'Çift onaylı bülten, abonelikten çıkma token’ı ve dile göre kampanyalar',
        'Azure Communication Services ile gönderim, SMTP yedeğiyle',
        'CQRS (MediatR) ve FluentValidation ile Clean Architecture',
        'Alan, uygulama ve entegrasyon düzeyinde testler',
        'Kendi sunucusu: SQL Server, API ve nginx’li Docker Compose, kendi posta kutuları',
      ],
    },
  },
};
