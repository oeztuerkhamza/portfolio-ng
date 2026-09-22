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
    fr: {
      subtitle: 'Gestion commerciale numérique pour un magasin de vélos',
      category: 'Application web full-stack',
      description: 'Gestion des stocks numérique pour un magasin de vélos. API C#/.NET, client admin Angular 19 et extension Chrome.',
      role: 'Développeur full-stack & architecte',
      long: `Bikehaus Freiburg est un système complet de gestion commerciale conçu pour un magasin de vélos local. Il réunit une interface web moderne, une application de bureau et une extension Chrome afin de numériser tout le processus — de la gestion des stocks à la vente jusqu’à la communication client.

Le back-end repose sur .NET 10 avec une Clean Architecture et propose des API REST sécurisées par JWT. Le front-end utilise Angular 19 avec rendu côté serveur pour des performances et un SEO optimaux.`,
      features: [
        'Gestion complète des stocks en temps réel',
        'Tableau de bord admin Angular 19 responsive',
        'Extension Chrome pour comparer les prix rapidement',
        'Authentification & autorisation par JWT',
        'Multilingue (DE, EN, FR, TR)',
        'Pipeline CI/CD automatisé via Azure DevOps',
        'Génération de PDF pour factures et devis',
      ],
    },
    en: {
      subtitle: 'Digital inventory management for a bicycle shop',
      category: 'Full-stack web app',
      description: 'Digital inventory management for a bicycle shop. C#/.NET API, Angular 19 admin client and a Chrome extension.',
      role: 'Full-stack developer & architect',
      long: `Bikehaus Freiburg is a comprehensive inventory-management system built for a local bicycle shop. It combines a modern web interface, a desktop app and a Chrome extension to digitise the entire business process — from stock management through sales to customer communication.

The backend is built on .NET 10 with Clean Architecture and exposes JWT-secured REST APIs. The frontend uses Angular 19 with server-side rendering for optimal performance and SEO.`,
      features: [
        'Full inventory management with real-time tracking',
        'Responsive Angular 19 admin dashboard',
        'Chrome extension for quick price comparisons',
        'JWT-based authentication & authorisation',
        'Multilingual (DE, EN, FR, TR)',
        'Automated CI/CD pipeline via Azure DevOps',
        'PDF generation for invoices and quotes',
      ],
    },
    tr: {
      subtitle: 'Bir bisiklet mağazası için dijital stok yönetimi',
      category: 'Full-stack web uygulaması',
      description: 'Bir bisiklet mağazası için dijital stok yönetimi. C#/.NET API, Angular 19 yönetim paneli ve Chrome eklentisi.',
      role: 'Full-stack geliştirici & mimar',
      long: `Bikehaus Freiburg, yerel bir bisiklet mağazası için geliştirilmiş kapsamlı bir stok yönetim sistemidir. Modern bir web arayüzü, masaüstü uygulaması ve Chrome eklentisini bir araya getirerek tüm iş sürecini — stok yönetiminden satışa ve müşteri iletişimine kadar — dijitalleştirir.

Arka uç, Clean Architecture ile .NET 10 üzerine kuruludur ve JWT korumalı REST API’leri sunar. Ön uç, en iyi performans ve SEO için sunucu taraflı render’lı Angular 19 kullanır.`,
      features: [
        'Gerçek zamanlı takiple tam stok yönetimi',
        'Responsive Angular 19 yönetim paneli',
        'Hızlı fiyat karşılaştırması için Chrome eklentisi',
        'JWT tabanlı kimlik doğrulama & yetkilendirme',
        'Çok dilli (DE, EN, FR, TR)',
        'Azure DevOps ile otomatik CI/CD hattı',
        'Fatura ve teklifler için PDF üretimi',
      ],
    },
    ku: {
      subtitle: 'Rêveberiya stoka dîjîtal ji bo firotgehek bisîkletan',
      category: 'Sepana webê ya full-stack',
      description: 'Rêveberiya stoka dîjîtal ji bo firotgehek bisîkletan. API ya C#/.NET, klienta admin a Angular 19 û dirêjkirina Chrome.',
      role: 'Pêşvebirê full-stack & mîmar',
      long: `Bikehaus Freiburg pergalek berfireh a rêveberiya stokê ye ku ji bo firotgehek bisîkletan a herêmî hatiye çêkirin. Ew navrûyek webê ya nûjen, sepanek sermasîyê û dirêjkirinek Chrome dicivîne da ku tevahiya pêvajoya kar — ji rêveberiya stokê heta firotin û têkiliya xerîdaran — dîjîtal bike.

Backend li ser .NET 10 bi Clean Architecture hatiye avakirin û API yên REST ên bi JWT parastî pêşkêş dike. Frontend Angular 19 bi renderkirina aliyê serverê ji bo performans û SEO ya herî baş bi kar tîne.`,
      features: [
        'Rêveberiya stokê ya tam bi şopandina demreal',
        'Daşboarda admin a Angular 19 ya responsive',
        'Dirêjkirina Chrome ji bo berhevdana bilez a bihayan',
        'Erêkirin & destûrdayîn a li ser JWT',
        'Pirzimanî (DE, EN, FR, TR)',
        'Xeta CI/CD ya otomatîk bi Azure DevOps',
        'Çêkirina PDF ji bo fatûre û pêşniyaran',
      ],
    },
  },
  'benlirad': {
    fr: {
      subtitle: 'Plateforme vélo : showroom, location & service',
      category: 'Application web full-stack',
      description: 'Plateforme vélo moderne pour la vente, la location et la réparation à Lahr/Forêt-Noire. Multilingue, avec showroom et avis clients.',
      role: 'Développeur full-stack & architecte',
      long: `Benlirad est une plateforme web complète pour un magasin de vélos à Lahr/Forêt-Noire. Elle réunit un showroom de vélos neufs et d’occasion, un système de location, un service de réparation et un CMS complet — le tout dans une interface moderne et responsive.

La plateforme prend en charge quatre langues (allemand, anglais, français, turc) et s’intègre à des API externes pour des listings automatisés. Le back-end est en .NET 10 (Clean Architecture), le front-end en Angular 19 avec SSR.`,
      features: [
        'Showroom avec catalogue et filtres',
        'Quadrilingue : allemand, anglais, français, turc',
        'Système de location avec réservation en ligne',
        'Prise de rendez-vous réparation & service',
        'Intégration de l’API Kleinanzeigen pour les listings',
        'Avis clients et témoignages',
        'Galerie avec photos du magasin',
        'Optimisé SEO avec rendu côté serveur',
      ],
    },
    en: {
      subtitle: 'Bicycle platform with showroom, rental & service',
      category: 'Full-stack web app',
      description: 'Modern bicycle platform for sales, rental and repair service in Lahr/Black Forest. Multilingual, with showroom and customer reviews.',
      role: 'Full-stack developer & architect',
      long: `Benlirad is a comprehensive web platform for a bicycle shop in Lahr/Black Forest. It combines a showroom for new and used bikes, a rental system, a repair service and a full CMS — all in a modern, responsive interface.

The platform supports four languages (German, English, French, Turkish) and integrates external APIs for automated listings. The backend runs on .NET 10 (Clean Architecture), the frontend on Angular 19 with SSR.`,
      features: [
        'Showroom with product catalogue and filters',
        'Four languages: German, English, French, Turkish',
        'Rental system with online booking',
        'Repair & service appointment booking',
        'Kleinanzeigen API integration for listings',
        'Customer reviews and testimonials',
        'Gallery with shop impressions',
        'SEO-optimised with server-side rendering',
      ],
    },
    tr: {
      subtitle: 'Showroom, kiralama & servisli bisiklet platformu',
      category: 'Full-stack web uygulaması',
      description: 'Lahr/Kara Orman’da satış, kiralama ve onarım için modern bisiklet platformu. Çok dilli, showroom ve müşteri yorumlarıyla.',
      role: 'Full-stack geliştirici & mimar',
      long: `Benlirad, Lahr/Kara Orman’daki bir bisiklet mağazası için kapsamlı bir web platformudur. Yeni ve ikinci el bisikletler için bir showroom, kiralama sistemi, onarım servisi ve eksiksiz bir CMS’i modern, responsive bir arayüzde birleştirir.

Platform dört dili (Almanca, İngilizce, Fransızca, Türkçe) destekler ve otomatik ilanlar için dış API’lerle entegre olur. Arka uç .NET 10 (Clean Architecture), ön uç SSR’li Angular 19’dur.`,
      features: [
        'Ürün kataloğu ve filtreli showroom',
        'Dört dil: Almanca, İngilizce, Fransızca, Türkçe',
        'Online rezervasyonlu kiralama sistemi',
        'Onarım & servis randevu sistemi',
        'İlanlar için Kleinanzeigen API entegrasyonu',
        'Müşteri yorumları ve referanslar',
        'Mağaza fotoğraflarıyla galeri',
        'SSR ile SEO uyumlu',
      ],
    },
    ku: {
      subtitle: 'Platforma bisîkletan: showroom, kirê & servîs',
      category: 'Sepana webê ya full-stack',
      description: 'Platforma bisîkletan a nûjen ji bo firotin, kirê û tamîr li Lahr/Daristana Reş. Pirzimanî, bi showroom û nirxandinên xerîdaran.',
      role: 'Pêşvebirê full-stack & mîmar',
      long: `Benlirad platformek webê ya berfireh e ji bo firotgehek bisîkletan li Lahr/Daristana Reş. Ew showroomek ji bo bisîkletên nû û kevn, pergalek kirê, servîsek tamîrê û CMSek temam dicivîne — hemû di navrûyek nûjen û responsive de.

Platform çar zimanan (Almanî, Îngilîzî, Fransî, Tirkî) piştgirî dike û bi API yên derveyî re ji bo lîsteyên otomatîk entegre dibe. Backend bi .NET 10 (Clean Architecture), frontend bi Angular 19 û SSR e.`,
      features: [
        'Showroom bi katalog û fîlteran',
        'Çar ziman: Almanî, Îngilîzî, Fransî, Tirkî',
        'Pergala kirê bi rezervasyona serhêl',
        'Randevûya tamîr & servîsê',
        'Entegrasyona API ya Kleinanzeigen ji bo lîsteyan',
        'Nirxandin û şahidiyên xerîdaran',
        'Galerî bi wêneyên firotgehê',
        'Bi SSR ji bo SEO xweşkirî',
      ],
    },
  },
  'di-flux': {
    fr: {
      subtitle: 'Système intelligent de suivi du temps pour entreprises',
      category: 'Logiciel d’entreprise',
      description: 'Système de pointage intelligent avec calcul automatique des pauses, conformité au droit du travail et gestion des employés. Développé chez Dicom GmbH.',
      role: 'Développeur full-stack',
      long: `Di-Flux est un système de pointage d’entreprise développé chez Dicom GmbH. Il numérise toute la saisie du temps de travail, de la pointeuse au reporting des heures supplémentaires, et garantit automatiquement le respect du droit du travail allemand (ArbZG).

Le système détecte les pauses légales, valide les durées de travail maximales et gère la protection liée à l’âge. Le front-end Angular 19 offre un tableau de bord intuitif ; le back-end .NET suit une Clean Architecture entièrement testée.`,
      features: [
        'Calcul automatique des pauses selon l’ArbZG',
        'Conformité à la protection liée à l’âge (JArbSchG)',
        'Gestion des congés et absences avec calendrier',
        'Suivi des heures supplémentaires et statistiques',
        'Opérations en masse pour saisies groupées',
        'Gestion des employés et des rôles',
        'Authentification JWT avec intercepteur',
        'Système de notifications en temps réel',
      ],
    },
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
    ku: {
      subtitle: 'Pergala şehreza ya şopandina demê ji bo pargîdaniyan',
      category: 'Nermalava pargîdanî',
      description: 'Şopandina demê ya şehreza bi hesabê bêhnvedanê yê xweber, lihevhatina qanûna kar û rêveberiya karmendan. Li Dicom GmbH hatiye çêkirin.',
      role: 'Pêşvebirê full-stack',
      long: `Di-Flux pergalek pargîdanî ya şopandina demê ye ku li Dicom GmbH hatiye pêşxistin. Ew tevahiya tomarkirina dema karê, ji saeta mohrê heta raporkirina demê zêde, dîjîtal dike û bi awayekî xweber lihevhatina bi qanûna kar a Almanyayê (ArbZG) misoger dike.

Pergal bêhnvedanên qanûnî dibîne, demên kar ên herî zêde piştrast dike û parastina kar a li gorî temenî piştgirî dike. Frontenda Angular 19 daşboardek hêsan pêşkêş dike; backenda .NET Clean Architecture ya bi tevahî test-kirî dişopîne.`,
      features: [
        'Hesabê bêhnvedanê yê xweber li gorî ArbZG',
        'Lihevhatina parastina kar a li gorî temenî (JArbSchG)',
        'Rêveberiya betlane û tunebûnê bi salname',
        'Şopandina demê zêde û statîstîk',
        'Operasyonên komî ji bo têketinên gelemperî',
        'Rêveberiya karmend û rolan',
        'Erêkirina JWT bi interceptor',
        'Pergala agahdariyê ya demreal',
      ],
    },
  },
  'gkn-portraits': {
    fr: {
      subtitle: 'Studio photo pour photos de candidature à Fribourg, avec réservation en ligne',
      category: 'Site web & système de réservation',
      description:
        'Site web et réservation pour un studio de photos de candidature à Fribourg. Next.js 16, 15 langues, réservation en trois étapes — et un agenda de studio partagé par deux marques.',
      role: 'Développeur full-stack & designer',
      long: `GKN Portraits est le site d’un studio photo de Fribourg spécialisé dans les photos de candidature et les portraits professionnels. Le cœur n’est pas une vitrine mais une réservation : choisir une formule, cliquer sur un créneau libre, laisser ses coordonnées — trois étapes, confirmation par e-mail, lien d’annulation inclus. Les appels pour connaître les disponibilités, qui représentent l’essentiel du travail administratif sur des séances courtes, disparaissent.

Techniquement, le site tourne sous Next.js 16 avec React 19 et Tailwind 4. Quinze langues aux URL traduites couvrent qui, à Fribourg, a besoin d’une photo de candidature — y compris une mise en page de droite à gauche pour l’arabe. Les prix existent en deux listes (particuliers et entreprises), car ce n’est pas le travail qui diffère, mais l’usage de l’image.

La particularité est en coulisses : le studio exploite deux marques — portrait et mariage — mais il n’y a qu’une salle et qu’un agenda. Les deux sites écrivent donc dans le même calendrier, et chaque réservation retient par quelle marque elle est arrivée. Un index en base garantit qu’un créneau n’est jamais confirmé deux fois. L’ensemble se gère depuis un espace commun, avec une connexion sans mot de passe par lien à usage unique.`,
      features: [
        'Réservation en ligne en trois étapes, e-mail de confirmation et lien d’annulation',
        'Un agenda de studio commun à deux marques — double réservation techniquement impossible',
        '15 langues aux URL traduites, mise en page RTL pour l’arabe incluse',
        'Deux grilles tarifaires (particuliers / entreprises) et trois formules',
        'Pages locales pour les villes autour de Fribourg',
        'Guide pratique : tenue, déroulé, choix des images',
        'Connexion sans mot de passe à l’espace d’administration (lien unique, cookie JWT)',
        'Environ 285 URL indexables avec hreflang, JSON-LD et sitemap dédié',
      ],
    },
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
    ku: {
      subtitle: 'Studyoya wêneyên serîlêdanê li Freiburgê bi randevûya online',
      category: 'Malper & pergala randevûyê',
      description:
        'Malper û pergala randevûyê ji bo studyoyek wêneyên serîlêdanê li Freiburgê. Next.js 16, 15 ziman, randevû di sê gavan de — û salnameyek studyoyê ya ku du marka par vedikin.',
      role: 'Pêşvebirê full-stack & sêwirkar',
      long: `GKN Portraits malpera studyoyek wênegiriyê ya li Freiburgê ye ku li ser wêneyên serîlêdanê û portreyên karsaziyê pispor e. Di navenda wê de ne rûpelek nasandinê, lê randevûyek heye: paketê hilbijêre, saeta vala ya salnameyê bitikîne, agahiyên têkiliyê binivîse — sê gav, erêkirin bi e-nameyê, girêdana betalkirinê jî tê de. Bi vî awayî têlefonên „saetek vala heye?" — ku di kişandinên kurt de piraniya kar in — winda dibin.

Ji aliyê teknîkî ve malper li ser Next.js 16 bi React 19 û Tailwind 4 dixebite. Panzdeh ziman bi URLên wergerandî kesên ku li Freiburgê wêneyek serîlêdanê dixwazin digire nav xwe — bi rêzkirina ji rastê ber bi çepê ji bo erebî. Biha di du lîsteyan de ne (şexsî û karsazî), ji ber ku ne kar, lê bikaranîna wêneyê cuda ye.

Ya taybet li paş perdeyê ye: studyo du markan dimeşîne — portre û dawet — lê tenê jûrek û tenê bernameyek heye. Ji ber vê yekê her du malper jî di heman salnameyê de tomar dikin, û her randevû tomar dike ku bi kîjan markayê hatiye. Indexek di danegehê de misoger dike ku heman saet ducar nayê erêkirin. Rêveberî ji beşek hevpar tê kirin, bi têketina bê şîfre bi girêdaneke yek-carî.`,
      features: [
        'Randevûya online di sê gavan de bi e-nameya erêkirinê û girêdana betalkirinê',
        'Salnameyek studyoyê ji bo du markan — randevûya ducar bi teknîkî ne gengaz e',
        '15 ziman bi URLên wergerandî, bi rêzkirina RTL ji bo erebî',
        'Du lîsteyên biha (şexsî / karsazî) bi sê paketan',
        'Rûpelên herêmî ji bo bajarên dora Freiburgê',
        'Beşa rêbernameyê: cil, rêzik û hilbijartina wêneyan',
        'Têketina bê şîfre ji bo beşa rêveberiyê (girêdana yek-carî, cookie ya JWT)',
        'Nêzîkî 285 URLên indexbar bi hreflang, JSON-LD û sitemapa xwe',
      ],
    },
  },
  'dj-veys': {
    fr: {
      subtitle: 'Site et système de demandes pour un DJ de mariage',
      category: 'Site web & CMS',
      description:
        'Site pour un DJ de mariage de Stuttgart : Next.js 16 avec Payload CMS, huit langues, environ 270 pages pour la recherche locale — hébergé sur son propre serveur.',
      role: 'Développeur full-stack & designer',
      long: `DJ Veys est un DJ de mariage de Stuttgart qui anime la soirée en allemand, en turc et en anglais et joue en live du saz et de la guitare. Le site remplace l’ancien domaine et est conçu pour être trouvé dans un marché où la concurrence achète de la publicité depuis des années : environ 270 pages, huit langues aux URL traduites, des pages dédiées aux villes du Bade-Wurtemberg ainsi qu’aux mariages turcs et musulmans.

Côté contenu, le client gère tout lui-même. Payload CMS tourne dans le même processus Next.js sous /admin et pilote la galerie, les mariages réalisés, les avis, les articles de conseils et les emplacements d’images du site. Demandes, contacts WhatsApp et souhaits de date arrivent dans la même interface : aucune demande ne se perd dans une boîte mail. Un lecteur à forme d’onde permet d’écouter les mixes directement sur le site.

Le tout tourne sur un serveur dédié : Docker Compose avec nginx et certificat renouvelé automatiquement, SQLite sur un volume persistant, déploiement par GitHub Actions — avec une politique de sécurité de contenu stricte et un envoi d’e-mails autonome. Les prix restent volontairement sur demande, et aucun chiffre d’avis n’est publié tant qu’il n’est pas vérifiable.`,
      features: [
        'Huit langues (DE, TR, KU, AR, EN, NL, FR, ES) avec des URL traduites par langue',
        'Environ 270 pages : villes du Bade-Wurtemberg, pages européennes, pages thématiques',
        'Payload CMS sous /admin — galerie, références, avis et blog gérés par le client',
        'Parcours de demande et de disponibilité avec calendrier et raccourci WhatsApp',
        'Lecteur à forme d’onde pour les mixes (wavesurfer.js)',
        'Page EPK pour la presse et les organisateurs, remise de photos privée par lien',
        'Auto-hébergement : Docker Compose, nginx, TLS renouvelé, déploiement GitHub Actions',
        'Content-Security-Policy stricte et envoi d’e-mails autonome',
      ],
    },
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
    ku: {
      subtitle: 'Malper û pergala daxwazê ji bo DJ-yekî daweta',
      category: 'Malper & CMS',
      description:
        'Malper ji bo DJ-yekî daweta ji Stuttgartê: Next.js 16 bi Payload CMS, heşt ziman, nêzîkî 270 rûpel ji bo lêgerîna herêmî — li ser servera wî ya xwe tê hilanîn.',
      role: 'Pêşvebirê full-stack & sêwirkar',
      long: `DJ Veys DJ-yekî daweta ye ji Stuttgartê; êvarê bi almanî, tirkî û îngilîzî pêşkêş dike û saz û gîtarê jî zindî lê dixe. Malper cihê navparêza kevn digire û wisa hatiye avakirin ku di bazarek ku pêşbazî salan e reklamê dikire de were dîtin: nêzîkî 270 rûpel, heşt ziman bi URLên wergerandî, rûpelên taybet ji bo bajarên Baden-Württembergê û herwiha ji bo dawetên tirkî û îslamî.

Naverokê xerîdar bi xwe birêve dibe. Payload CMS di heman pêvajoya Next.js de li binê /admin dixebite û galerî, dawetên rastîn, nirxandin, gotarên rêbernameyê û cihên wêneyan ên malperê birêve dibe. Daxwaz, têkiliyên WhatsAppê û pirsên dîrokê jî têne heman panelê — bi vî awayî tu daxwaz di qutîka e-nameyê de winda nabe. Lêdana wave-formê dihêle ku mîks rasterast li ser rûpelê bêne guhdarîkirin.

Her tişt li ser servereke xwe dixebite: Docker Compose bi nginx û sertîfîkaya ku bixweber nû dibe, SQLite li ser cildeke mayînde, belavkirin bi GitHub Actions — digel polîtîkayeke hişk a ewlehiya naverokê û şandina e-nameyê ya serbixwe. Biha bi zanetî „li ser daxwazê" ne, û hejmarên nirxandinê heta ku nebin belgekirî nayên weşandin.`,
      features: [
        'Heşt ziman (DE, TR, KU, AR, EN, NL, FR, ES) bi URLên wergerandî ji bo her zimanî',
        'Nêzîkî 270 rûpel: bajarên Baden-Württembergê, rûpelên Ewropayê, rûpelên mijarê',
        'Payload CMS li binê /admin — galerî, referans, nirxandin û blog ji aliyê xerîdar ve',
        'Rêça daxwaz û vebûnê bi salname û kurteriya WhatsAppê',
        'Lêdana wave-formê ji bo mîksan (wavesurfer.js)',
        'Rûpela EPK ji bo çapemenî û organîzatoran, radestkirina wêneyan a taybet bi girêdanê',
        'Hilanîna xwe: Docker Compose, nginx, TLS ya otomatîk, belavkirin bi GitHub Actions',
        'Polîtîkayeke hişk a ewlehiya naverokê û şandina e-nameyê ya serbixwe',
      ],
    },
  },
  'zerin-gold': {
    fr: {
      subtitle: 'Site premium pour bijoutier & négociant en or à Fribourg',
      category: 'Site premium',
      description: 'Site premium « award-grade » pour un négociant en or à Fribourg. Next.js 16, multilingue (7 langues dont l’arabe RTL), en white-label.',
      role: 'Développeur & designer (solo)',
      long: `Zerin Gold est un site premium pour un négociant en or, bijoutier et atelier de joaillerie à Fribourg-en-Brisgau. Le projet mise sur un design « award-grade » avec une typographie soignée, des animations au défilement et une esthétique noir-or qui transmet la confiance et la valeur de la marque.

Techniquement, le site repose sur Next.js 16 avec React 19 et Tailwind 4. Il est entièrement multilingue (7 langues, dont l’arabe en RTL) et conçu en white-label comme modèle réutilisable. Authentification NextAuth, données via Prisma/PostgreSQL et e-mails transactionnels via Resend complètent le système.`,
      features: [
        'Design premium « award-grade » (esthétique noir-or)',
        '7 langues, dont l’arabe en RTL',
        'Architecture white-label réutilisable',
        'Next.js 16 avec React Server Components',
        'Authentification NextAuth & Prisma/PostgreSQL',
        'Animations au défilement (Framer Motion & Lenis)',
        'Formulaires avec anti-spam (hCaptcha)',
        'Entièrement optimisé SEO & ultra-rapide',
      ],
    },
    en: {
      subtitle: 'Premium website for a gold dealer & jeweller in Freiburg',
      category: 'Premium website',
      description: 'Award-grade premium website for a gold dealer in Freiburg. Next.js 16, multilingual (7 languages incl. RTL Arabic), built white-label.',
      role: 'Solo developer & designer',
      long: `Zerin Gold is a premium website for a gold dealer, jeweller and jewellery atelier in Freiburg. The project relies on award-grade design with refined typography, smooth scroll animations and an elegant black-and-gold aesthetic that conveys the brand’s trust and value.

Technically, it’s built on Next.js 16 with React 19 and Tailwind 4. It’s fully multilingual (7 languages, including right-to-left Arabic) and white-label, serving as a reusable template. NextAuth authentication, Prisma/PostgreSQL data and transactional email via Resend round out the system.`,
      features: [
        'Award-grade premium design (black-and-gold aesthetic)',
        '7 languages incl. right-to-left Arabic',
        'Reusable white-label architecture',
        'Next.js 16 with React Server Components',
        'NextAuth authentication & Prisma/PostgreSQL',
        'Smooth scroll animations (Framer Motion & Lenis)',
        'Contact forms with spam protection (hCaptcha)',
        'Fully SEO-optimised & lightning fast',
      ],
    },
    tr: {
      subtitle: 'Freiburg’da altın tüccarı & kuyumcu için premium site',
      category: 'Premium web sitesi',
      description: 'Freiburg’daki bir altın tüccarı için ödül seviyesinde premium site. Next.js 16, çok dilli (RTL Arapça dahil 7 dil), white-label.',
      role: 'Solo geliştirici & tasarımcı',
      long: `Zerin Gold, Freiburg’da bir altın tüccarı, kuyumcu ve mücevher atölyesi için premium bir web sitesidir. Proje; özenli tipografi, akıcı kaydırma animasyonları ve markanın güvenini ve değerini yansıtan zarif bir siyah-altın estetikle ödül seviyesinde bir tasarıma dayanır.

Teknik olarak Next.js 16, React 19 ve Tailwind 4 üzerine kuruludur. Tamamen çok dillidir (RTL Arapça dahil 7 dil) ve yeniden kullanılabilir bir şablon olarak white-label tasarlanmıştır. NextAuth kimlik doğrulama, Prisma/PostgreSQL veri ve Resend ile işlemsel e-postalar sistemi tamamlar.`,
      features: [
        'Ödül seviyesinde premium tasarım (siyah-altın estetik)',
        'RTL Arapça dahil 7 dil',
        'Yeniden kullanılabilir white-label mimari',
        'React Server Components ile Next.js 16',
        'NextAuth kimlik doğrulama & Prisma/PostgreSQL',
        'Akıcı kaydırma animasyonları (Framer Motion & Lenis)',
        'Spam korumalı iletişim formları (hCaptcha)',
        'Tamamen SEO uyumlu & çok hızlı',
      ],
    },
    ku: {
      subtitle: 'Malpera premium ji bo bazirganê zêr & zêrînger li Freiburgê',
      category: 'Malpera premium',
      description: 'Malpera premium a asta-xelatê ji bo bazirganek zêr li Freiburgê. Next.js 16, pirzimanî (7 ziman bi erebî ya RTL re), white-label.',
      role: 'Pêşvebir & dîzayner (solo)',
      long: `Zerin Gold malperek premium e ji bo bazirganek zêr, zêrînger û atolyeya zêran li Freiburgê. Proje li ser dîzaynek asta-xelatê bi tîpografiyek hûrgilî, anîmasyonên şemitandinê yên nerm û estetîkek reş-zêrîn a şik ku baweriya û nirxa markayê radigihîne, dilsoz e.

Bi teknîkî, ew li ser Next.js 16 bi React 19 û Tailwind 4 hatiye avakirin. Ew bi tevahî pirzimanî ye (7 ziman, bi erebî ya rast-bi-çep re) û white-label, wek şablonek ji nû ve bikaranînê. Erêkirina NextAuth, daneyên Prisma/PostgreSQL û e-nameyên transaksiyonel bi Resend pergalê temam dikin.`,
      features: [
        'Dîzayna premium a asta-xelatê (estetîka reş-zêrîn)',
        '7 ziman bi erebî ya rast-bi-çep re',
        'Mîmariya white-label a ji nû ve bikaranînê',
        'Next.js 16 bi React Server Components',
        'Erêkirina NextAuth & Prisma/PostgreSQL',
        'Anîmasyonên şemitandinê yên nerm (Framer Motion & Lenis)',
        'Formên têkiliyê bi parastina spam (hCaptcha)',
        'Bi tevahî ji bo SEO xweşkirî & pir bilez',
      ],
    },
  },
  'hotel-bergfrieden': {
    fr: {
      subtitle: 'Site pour un hôtel en Forêt-Noire (Löffingen)',
      category: 'Site web',
      description: 'Site moderne, rendu statiquement, pour l’hôtel Bergfrieden à Löffingen. Angular 21 avec prerendering, entièrement optimisé SEO.',
      role: 'Développeur full-stack & designer',
      long: `Un site web moderne et chaleureusement luxueux pour l’hôtel Bergfrieden en Forêt-Noire (Löffingen). Le design s’inspire d’une esthétique « luxueuse mais chaleureuse », avec une palette Forêt-Noire (vert forêt, crème, bronze) et une typographie classique Cormorant Garamond.

Techniquement, le site est réalisé en Angular 21 (composants standalone & signals) et entièrement rendu en statique (SSG) — toutes les routes sont pré-générées en HTML et hébergées sans runtime serveur. Des métadonnées par route, du JSON-LD Hotel Schema.org, un sitemap.xml et des cartes OG/Twitter assurent une visibilité maximale.`,
      features: [
        'Design chaleureux et luxueux (palette Forêt-Noire)',
        'Génération statique — ultra-rapide, sans serveur',
        'SEO par route avec JSON-LD Hotel Schema.org',
        'sitemap.xml, robots.txt, cartes OG/Twitter',
        'Pages chambres, offres et galerie',
        'Déploiement automatique via GitHub Actions',
        'Design responsive pour tous les appareils',
      ],
    },
    en: {
      subtitle: 'Website for a hotel in the Black Forest (Löffingen)',
      category: 'Website',
      description: 'Modern, statically rendered website for Hotel Bergfrieden in Löffingen. Angular 21 with prerendering, fully SEO-optimised.',
      role: 'Full-stack developer & designer',
      long: `A modern, warmly luxurious website for Hotel Bergfrieden in the Black Forest (Löffingen). The design is inspired by a “luxurious yet warm” aesthetic with a Black-Forest palette of forest green, cream and bronze, and classic Cormorant Garamond typography.

Technically, the site is built with Angular 21 (standalone components & signals) and fully statically rendered (SSG) — all routes are prerendered to HTML and hosted without a server runtime. Per-route meta tags, Hotel Schema.org JSON-LD, a sitemap.xml and OG/Twitter cards ensure maximum visibility.`,
      features: [
        'Warmly luxurious design (Black-Forest palette)',
        'Static site generation — fast, no server needed',
        'Per-route SEO with Hotel Schema.org JSON-LD',
        'sitemap.xml, robots.txt, OG/Twitter cards',
        'Room, offer and gallery pages',
        'Automatic deployment via GitHub Actions',
        'Responsive design for all devices',
      ],
    },
    tr: {
      subtitle: 'Kara Orman’da bir otel için web sitesi (Löffingen)',
      category: 'Web sitesi',
      description: 'Löffingen’deki Hotel Bergfrieden için modern, statik render edilen web sitesi. Prerendering’li Angular 21, tamamen SEO uyumlu.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `Kara Orman’daki (Löffingen) Hotel Bergfrieden için modern, sıcak-lüks bir web sitesi. Tasarım; orman yeşili, krem ve bronzdan oluşan Kara Orman paleti ve klasik Cormorant Garamond tipografisiyle “lüks ama sıcak” bir estetikten ilham alır.

Teknik olarak site Angular 21 (standalone bileşenler & signals) ile yapılmış ve tamamen statik render edilmiştir (SSG) — tüm rotalar HTML’e önceden render edilir ve sunucu çalışma zamanı olmadan barındırılır. Rota bazlı meta etiketleri, Hotel Schema.org JSON-LD, sitemap.xml ve OG/Twitter kartları maksimum görünürlük sağlar.`,
      features: [
        'Sıcak-lüks tasarım (Kara Orman paleti)',
        'Statik site üretimi — hızlı, sunucu gerekmez',
        'Hotel Schema.org JSON-LD ile rota bazlı SEO',
        'sitemap.xml, robots.txt, OG/Twitter kartları',
        'Oda, teklif ve galeri sayfaları',
        'GitHub Actions ile otomatik dağıtım',
        'Tüm cihazlar için responsive tasarım',
      ],
    },
    ku: {
      subtitle: 'Malper ji bo otêlek li Daristana Reş (Löffingen)',
      category: 'Malper',
      description: 'Malpera nûjen a statîk-render ji bo Hotel Bergfrieden li Löffingen. Angular 21 bi prerendering, bi tevahî ji bo SEO xweşkirî.',
      role: 'Pêşvebirê full-stack & dîzayner',
      long: `Malperek nûjen û germ-luks ji bo Hotel Bergfrieden li Daristana Reş (Löffingen). Dîzayn ji estetîkek "luks lê germ" îlham digire, bi paleta Daristana Reş a kesk, krem û bronz û tîpografiya klasîk a Cormorant Garamond.

Bi teknîkî, malper bi Angular 21 (komponentên standalone & signals) hatiye çêkirin û bi tevahî statîk hatiye render kirin (SSG) — hemû rê berê li HTML têne render kirin û bê runtime ya serverê têne mêvandar kirin. Meta-yên ji bo her rê, JSON-LD ya Hotel Schema.org, sitemap.xml û kartên OG/Twitter xuyangek herî zêde misoger dikin.`,
      features: [
        'Dîzayna germ-luks (paleta Daristana Reş)',
        'Çêkirina malpera statîk — bilez, bê server',
        'SEO ji bo her rê bi JSON-LD ya Hotel Schema.org',
        'sitemap.xml, robots.txt, kartên OG/Twitter',
        'Rûpelên ode, pêşniyar û galeriyê',
        'Deploya otomatîk bi GitHub Actions',
        'Dîzayna responsive ji bo hemû amûran',
      ],
    },
  },
  'kulturplattform-freiburg': {
    fr: {
      subtitle: 'Site d’association avec CMS et newsletter',
      category: 'Application web / CMS',
      description: 'Site d’association avec panneau d’admin, newsletter et bilinguisme. Développé avec .NET 10 (Clean Architecture) et React 19.',
      role: 'Développeur full-stack',
      long: `La Kulturplattform Freiburg est un site d’association moderne qui promeut les événements et initiatives culturels à Fribourg. Le projet comprend un système de gestion de contenu complet, la gestion de newsletters et un support multilingue.

L’architecture suit les principes de la Clean Architecture, avec un back-end .NET 10 et un front-end React 19. Le CMS permet à l’association de gérer ses contenus, créer des événements et envoyer des newsletters de façon autonome.`,
      features: [
        'Système de gestion de contenu (CMS)',
        'Newsletter avec envoi automatisé',
        'Bilingue : allemand & turc',
        'Calendrier d’événements avec inscription',
        'Panneau d’admin pour le comité',
        'Optimisé SEO avec SSR',
        'Intégration de services e-mail',
      ],
    },
    en: {
      subtitle: 'Association website with CMS and newsletter',
      category: 'Web app / CMS',
      description: 'Association website with admin panel, newsletter and bilingual support. Built with .NET 10 Clean Architecture and React 19.',
      role: 'Full-stack developer',
      long: `Kulturplattform Freiburg is a modern association website that promotes cultural events and initiatives in Freiburg. The project includes a full content-management system, newsletter management and multilingual support.

The architecture follows Clean Architecture principles with a .NET 10 backend and a React 19 frontend. The CMS lets the association maintain content, create events and send newsletters on its own.`,
      features: [
        'Content management system (CMS)',
        'Newsletter system with automated sending',
        'Bilingual: German & Turkish',
        'Event calendar with registration',
        'Admin panel for board members',
        'SEO-optimised with SSR',
        'Integration with email services',
      ],
    },
    tr: {
      subtitle: 'CMS ve bültenli dernek web sitesi',
      category: 'Web uygulaması / CMS',
      description: 'Yönetim paneli, bülten ve iki dil desteğiyle dernek web sitesi. .NET 10 Clean Architecture ve React 19 ile geliştirildi.',
      role: 'Full-stack geliştirici',
      long: `Kulturplattform Freiburg, Freiburg’daki kültürel etkinlikleri ve girişimleri destekleyen modern bir dernek web sitesidir. Proje; eksiksiz bir içerik yönetim sistemi, bülten yönetimi ve çok dilli destek içerir.

Mimari, .NET 10 arka uç ve React 19 ön uçla Clean Architecture ilkelerini izler. CMS, derneğin içerikleri kendi başına yönetmesine, etkinlik oluşturmasına ve bülten göndermesine olanak tanır.`,
      features: [
        'İçerik yönetim sistemi (CMS)',
        'Otomatik gönderimli bülten sistemi',
        'İki dilli: Almanca & Türkçe',
        'Kayıtlı etkinlik takvimi',
        'Yönetim kurulu için admin paneli',
        'SSR ile SEO uyumlu',
        'E-posta servisleriyle entegrasyon',
      ],
    },
    ku: {
      subtitle: 'Malpera komeleyê bi CMS û nûçename',
      category: 'Sepana webê / CMS',
      description: 'Malpera komeleyê bi panela admin, nûçename û piştgiriya duzimanî. Bi .NET 10 Clean Architecture û React 19 hatiye çêkirin.',
      role: 'Pêşvebirê full-stack',
      long: `Kulturplattform Freiburg malperek komeleyê ya nûjen e ku çalakî û destpêkên çandî li Freiburgê pêş dixe. Proje pergalek temam a rêveberiya naverokê, rêveberiya nûçenameyê û piştgiriya pirzimanî dihewîne.

Mîmarî prensîbên Clean Architecture bi backenda .NET 10 û frontenda React 19 dişopîne. CMS dihêle ku komele bi serê xwe naverokê biparêze, çalakiyan biafirîne û nûçenameyan bişîne.`,
      features: [
        'Pergala rêveberiya naverokê (CMS)',
        'Pergala nûçenameyê bi şandina otomatîk',
        'Duzimanî: Almanî & Tirkî',
        'Salnameya çalakiyan bi tomarkirin',
        'Panela admin ji bo endamên desteyê',
        'Bi SSR ji bo SEO xweşkirî',
        'Entegrasyon bi servîsên e-nameyê',
      ],
    },
  },
  'hochzeitseinladung': {
    fr: {
      subtitle: 'Site d’invitation interactif avec compte à rebours & galerie',
      category: 'Site web',
      description: 'Élégante invitation de mariage numérique avec compte à rebours, galerie photo, carte du lieu, espace cadeaux et sélecteur de langue.',
      role: 'Développeur full-stack',
      long: `Une élégante invitation de mariage numérique, développée en single-page application avec Angular 19. L’application remplace les invitations papier par une expérience web interactive et moderne, avec animations et compte à rebours en temps réel.

La page comprend un hero avec écran d’accueil, un compte à rebours live, une galerie photo, l’intégration de vidéos YouTube, une carte interactive du lieu, un espace cadeaux avec QR codes IBAN et PayPal, et un sélecteur de langue. Le déploiement est automatisé via GitHub Actions sur Netlify avec un domaine personnalisé.`,
      features: [
        'Écran d’accueil animé et hero',
        'Compte à rebours en temps réel',
        'Galerie photo avec lightbox',
        'Espace cadeaux avec QR codes IBAN & PayPal',
        'Carte interactive du lieu',
        'Intégration de vidéos YouTube',
        'Domaine personnalisé avec CI/CD GitHub Actions',
      ],
    },
    en: {
      subtitle: 'Interactive invitation site with countdown & gallery',
      category: 'Website',
      description: 'Elegant digital wedding invitation with countdown, photo gallery, venue map, gifts section and a language switcher.',
      role: 'Full-stack developer',
      long: `An elegant digital wedding invitation, built as a single-page application with Angular 19. The app replaces classic paper invitations with an interactive, modern web experience featuring animations and a real-time countdown.

The page includes a hero with splash screen, a live countdown, a photo gallery, YouTube video integration, an interactive venue map, a gifts section with IBAN and PayPal QR codes, and a language switcher. Deployment is automated via GitHub Actions to Netlify with a custom domain.`,
      features: [
        'Animated splash screen and hero',
        'Real-time countdown to the wedding',
        'Photo gallery with lightbox',
        'Gifts section with IBAN & PayPal QR codes',
        'Interactive venue map',
        'YouTube video integration',
        'Custom domain with GitHub Actions CI/CD',
      ],
    },
    tr: {
      subtitle: 'Geri sayım & galerili etkileşimli davetiye sitesi',
      category: 'Web sitesi',
      description: 'Geri sayım, foto galeri, mekân haritası, hediye bölümü ve dil seçiciyle şık dijital düğün davetiyesi.',
      role: 'Full-stack geliştirici',
      long: `Angular 19 ile single-page uygulama olarak geliştirilmiş şık bir dijital düğün davetiyesi. Uygulama, klasik kâğıt davetiyelerin yerini animasyonlar ve gerçek zamanlı geri sayımla etkileşimli, modern bir web deneyimine bırakır.

Sayfa; splash ekranlı hero, canlı geri sayım, foto galeri, YouTube video entegrasyonu, etkileşimli mekân haritası, IBAN ve PayPal QR kodlu hediye bölümü ve dil seçici içerir. Dağıtım, özel alan adıyla Netlify’a GitHub Actions üzerinden otomatikleştirilmiştir.`,
      features: [
        'Animasyonlu splash ekranı ve hero',
        'Düğüne gerçek zamanlı geri sayım',
        'Lightbox’lı foto galeri',
        'IBAN & PayPal QR kodlu hediye bölümü',
        'Etkileşimli mekân haritası',
        'YouTube video entegrasyonu',
        'GitHub Actions CI/CD ile özel alan adı',
      ],
    },
    ku: {
      subtitle: 'Malpera vexwendinê ya înteraktîf bi jimartin & galerî',
      category: 'Malper',
      description: 'Vexwendina daweta dîjîtal a xweşik bi jimartina paşvedanê, galeriya wêneyan, nexşeya cihê, beşa diyariyan û guhêrkera ziman.',
      role: 'Pêşvebirê full-stack',
      long: `Vexwendineke daweta dîjîtal a xweşik, ku wek sepana yek-rûpelî bi Angular 19 hatiye çêkirin. Sepan li şûna vexwendinên kaxezî yên klasîk ezmûnek webê ya înteraktîf û nûjen bi anîmasyon û jimartina paşvedanê ya demreal datîne.

Rûpel hero bi splash-screen, jimartina paşvedanê ya zindî, galeriya wêneyan, entegrasyona vîdyoyên YouTube, nexşeya cihê ya înteraktîf, beşa diyariyan bi QR-kodên IBAN û PayPal, û guhêrkera ziman dihewîne. Deploy bi awayekî otomatîk bi GitHub Actions li ser Netlify bi domaynek taybetî tê kirin.`,
      features: [
        'Splash-screen û hero ya anîmasyonkirî',
        'Jimartina paşvedanê ya demreal bo daweta',
        'Galeriya wêneyan bi lightbox',
        'Beşa diyariyan bi QR-kodên IBAN & PayPal',
        'Nexşeya cihê ya înteraktîf',
        'Entegrasyona vîdyoyên YouTube',
        'Domayna taybetî bi GitHub Actions CI/CD',
      ],
    },
  },
  'bewerbungs-manager': {
    fr: {
      subtitle: 'Automatisation de candidatures assistée par IA',
      category: 'Outil / automatisation',
      description: 'Automatisation de candidatures par IA. App Python pour la génération de PDF, la gestion de profils et l’analyse d’offres d’emploi.',
      role: 'Développeur (solo)',
      long: `Le Bewerbungs-Manager est un outil de candidature intelligent qui automatise tout le processus. De l’analyse de l’offre à l’adaptation du CV jusqu’à la génération de PDF — tout est optimisé par IA.

Le système analyse les offres d’emploi, en extrait les mots-clés pertinents et adapte automatiquement les documents de candidature. Des modèles évaluent l’adéquation et génèrent des lettres de motivation sur mesure.`,
      features: [
        'Analyse des offres d’emploi par IA',
        'Extraction et matching automatiques de mots-clés',
        'Génération de PDF pour CV et lettre',
        'Gestion de profils avec plusieurs modèles',
        'Score d’adéquation pour chaque poste',
        'Tableau de bord de suivi des candidatures',
      ],
    },
    en: {
      subtitle: 'AI-assisted job-application automation',
      category: 'Tool / automation',
      description: 'AI-assisted job-application automation. A Python app for PDF generation, profile management and AI-driven job-posting analysis.',
      role: 'Solo developer',
      long: `The Bewerbungs-Manager is an intelligent application tool that automates the entire process. From job-posting analysis through CV adaptation to PDF generation — everything is AI-optimised.

The system analyses job postings, extracts relevant keywords and automatically adapts application documents. Models score the fit and generate tailored cover letters.`,
      features: [
        'AI-driven analysis of job postings',
        'Automatic keyword extraction and matching',
        'PDF generation for CV and cover letter',
        'Profile management with multiple templates',
        'Fit score for each position',
        'Dashboard with application tracking',
      ],
    },
    tr: {
      subtitle: 'Yapay zekâ destekli başvuru otomasyonu',
      category: 'Araç / otomasyon',
      description: 'Yapay zekâ destekli iş başvurusu otomasyonu. PDF üretimi, profil yönetimi ve ilan analizi için Python uygulaması.',
      role: 'Solo geliştirici',
      long: `Bewerbungs-Manager, tüm süreci otomatikleştiren akıllı bir başvuru aracıdır. İlan analizinden CV uyarlamasına ve PDF üretimine kadar her şey yapay zekâ ile optimize edilir.

Sistem ilanları analiz eder, ilgili anahtar kelimeleri çıkarır ve başvuru belgelerini otomatik uyarlar. Modeller uygunluğu puanlar ve özel ön yazılar üretir.`,
      features: [
        'İlanların yapay zekâ ile analizi',
        'Otomatik anahtar kelime çıkarımı ve eşleştirme',
        'CV ve ön yazı için PDF üretimi',
        'Birden çok şablonlu profil yönetimi',
        'Her pozisyon için uygunluk skoru',
        'Başvuru takibi panosu',
      ],
    },
    ku: {
      subtitle: 'Otomasyona serîlêdanê ya bi alîkariya AI',
      category: 'Amûr / otomasyon',
      description: 'Otomasyona serîlêdana kar a bi AI. Sepanek Python ji bo çêkirina PDF, rêveberiya profîlan û analîza îlanên kar.',
      role: 'Pêşvebir (solo)',
      long: `Bewerbungs-Manager amûrek serîlêdanê ya şehreza ye ku tevahiya pêvajoyê otomatîk dike. Ji analîza îlanê heta adaptekirina CV û çêkirina PDF — her tişt bi AI tê xweşkirin.

Pergal îlanên kar analîz dike, peyvên mifteyî yên girîng derdixe û belgeyên serîlêdanê bi awayekî otomatîk adapte dike. Model lihevhatinê dinirxînin û nameyên motîvasyonê yên taybetî çêdikin.`,
      features: [
        'Analîza îlanên kar bi AI',
        'Derxistin û lihevkirina otomatîk a peyvên mifteyî',
        'Çêkirina PDF ji bo CV û nameyê',
        'Rêveberiya profîlan bi gelek şablonan',
        'Skora lihevhatinê ji bo her pozîsyonê',
        'Daşboarda şopandina serîlêdanê',
      ],
    },
  },
};
