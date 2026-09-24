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
      subtitle: 'Gestion commerciale, site web et location en ligne pour un magasin de vélos',
      category: 'Plateforme full-stack',
      description:
        'Gestion commerciale, site public et location en ligne pour un magasin de vélos à Fribourg. API .NET, deux front-ends Angular, extension Chrome et application Windows — auto-hébergé.',
      role: 'Développeur full-stack & architecte',
      long: `Bikehaus Freiburg n’est pas un modèle de boutique, c’est l’atelier lui-même : un vélo est racheté, entre en stock, puis est vendu, loué ou repris — et chacune de ces étapes a son numéro de pièce, sa signature et, au bout, un PDF. L’interface d’administration couvre cela en près de 28 modules, des clients et factures aux dépenses et coûts de remise en état, jusqu’aux statistiques, exports et sauvegardes.

Côté public : Angular 17 avec rendu serveur, douze langues aux URL dédiées et une centaine de routes pré-rendues au build — showroom, vélos électriques, vélos neufs, accessoires, service, guides et pages locales pour les communes alentour. La location se fait entièrement en ligne : vérifier la disponibilité, choisir les accessoires, payer via Mollie. La réservation arrive dans l’administration pour validation et devient un contrat de location.

S’y ajoute tout ce qu’un magasin ferait autrement à la main : un service de fond synchronise les annonces Kleinanzeigen toutes les quatre heures, une extension Chrome les modifie en masse, les demandes clients arrivent sous forme de conversation depuis une boîte mail connectée. Le tout tourne sur un serveur dédié : Docker Compose avec cinq services, nginx devant, certificats renouvelés automatiquement et surveillés chaque jour par GitHub Actions. Pour le comptoir, il existe en plus une version Windows qui embarque l’API.`,
      features: [
        'Flux complet : rachat → stock → vente → reprise, avec numéros de pièce et signature',
        'Location en ligne avec vérification de disponibilité et paiement (Mollie)',
        '12 langues aux URL dédiées, environ 100 routes pré-rendues (Angular SSR)',
        'Synchronisation Kleinanzeigen toutes les 4 h et extension Chrome pour l’édition en masse',
        'Administration en ~28 modules : clients, factures, dépenses, statistiques, export, sauvegarde',
        'Génération de PDF pour contrats de location, factures et justificatifs',
        'Version Windows (Electron) avec API embarquée pour le magasin',
        'Auto-hébergement : Docker Compose à cinq services, nginx, TLS automatique, serveur mail propre',
      ],
    },
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
    ku: {
      subtitle: 'Rêveberiya stokê, malper û kirêkirina online ji bo firotgehek bisîkletan',
      category: 'Platforma full-stack',
      description:
        'Rêveberiya stokê, malpera giştî û kirêkirina online ji bo firotgehek bisîkletan li Freiburgê. API ya .NET, du navrûyên Angular, dirêjkirina Chrome û sepanek Windows — li ser servera xwe.',
      role: 'Pêşvebirê full-stack & mîmar',
      long: `Bikehaus Freiburg ne şablonek firotgehê ye, kar bi xwe ye: Bisîklet tê kirîn, dikeve stokê, tê firotin, kirê kirin an vegerandin — û her gaveke wan hejmara xwe ya belgeyê, îmzeya xwe û di dawiyê de PDFek xwe heye. Navrûya rêveberiyê vê yekê di nêzîkî 28 beşan de dide: ji xerîdar û fatûreyan heta lêçûn û mesrefên nûkirinê, û heta amar, derxistin û paşekêş.

Berbi derve rûpela giştî ye: Angular 17 bi renderkirina aliyê serverê, donzdeh ziman bi URLên xwe û nêzîkî 100 rêyên ku di dema avakirinê de hatine amadekirin — showroom, e-bike, bisîkletên nû, alav, servis, rêbername û rûpelên herêmî ji bo bajarên dorûberê. Kirêkirin bi tevahî online e: vebûnê kontrol bike, alavan hilbijêre, bi Mollie bide. Rezervasyon ji bo pejirandinê dikeve beşa rêveberiyê û li wir dibe peymana kirêyê.

Li ser vê yekê tiştê ku firotgehek bi destan dikira tê: Karûbarek paşperdeyê her çar saetan îlanên Kleinanzeigen hevaheng dike, dirêjkirineke Chrome wan bi komî diguherîne, daxwazên xerîdaran ji qutîkeke e-nameyê ya girêdayî wek sohbet tên. Her tişt li ser servereke xwe dixebite: Docker Compose bi pênc karûbaran, nginx li pêş, sertîfîkayên ku bixweber nû dibin û bi GitHub Actions rojane têne şopandin. Ji bo ser masê guhertoyeke Windows jî heye ku API bi xwe re tîne.`,
      features: [
        'Herikîna tevahî: kirîn → stok → firotin → vegerandin, bi hejmarên belgeyê û îmze',
        'Kirêkirina giştî bi kontrola vebûnê û dayîna online (Mollie)',
        '12 ziman bi URLên xwe, nêzîkî 100 rêyên pêş-amadekirî (Angular SSR)',
        'Hevahengiya Kleinanzeigen her çar saetan û dirêjkirina Chrome ji bo guhertina komî',
        'Beşa rêveberiyê bi ~28 modulan: xerîdar, fatûre, lêçûn, amar, derxistin, paşekêş',
        'Çêkirina PDF ji bo peymanên kirêyê, fatûre û belgeyan',
        'Guhertoya Windows (Electron) bi API ya tê de ji bo firotgehê',
        'Hilanîna xwe: Docker Compose bi pênc karûbaran, nginx, TLS ya otomatîk, servera e-nameyê ya xwe',
      ],
    },
  },
  'benlirad': {
    fr: {
      subtitle: 'Gestion commerciale et site web pour un magasin de vélos à Lahr',
      category: 'Application web full-stack',
      description:
        'Deuxième magasin, même plateforme : API .NET 9, administration Angular et site public en SSR avec showroom, accessoires et service réparation — en quatre langues, sur serveur dédié.',
      role: 'Développeur full-stack & architecte',
      long: `Benlirad est un magasin de vélos à Lahr, en Forêt-Noire. La plateforme née pour Bikehaus Freiburg tourne ici dans sa propre déclinaison : même noyau — rachat, stock, vente, reprise, clients, factures, dépenses et statistiques — mais taillé pour un magasin qui vend et répare plutôt qu’il ne loue. C’est précisément là qu’était le travail : qu’est-ce qui appartient vraiment au noyau, et qu’est-ce qui n’existait que pour le premier client ?

Le site public tourne sous Angular 17 avec rendu serveur, en quatre langues (DE, EN, FR, TR). Il tire son contenu directement de la gestion commerciale : le showroom affiche le stock réel avec le compteur de vélos disponibles, à quoi s’ajoutent les vélos neufs, les accessoires, le service réparation, les guides, la FAQ, la garantie et des pages locales pour la région. Ce qui est saisi en magasin est en ligne sans étape intermédiaire.

L’ensemble tourne sur un serveur dédié avec Docker et nginx : API, interface d’administration et front SSR comme services séparés, SQLite comme base, JWT pour la connexion. S’y ajoutent les mêmes outils que dans le projet frère — synchronisation Kleinanzeigen, extension Chrome et une version Windows pour le poste du magasin.`,
      features: [
        'Gestion commerciale : rachat, stock, vente, reprise, clients, factures, dépenses',
        'Site public alimenté en direct par la même base de données',
        'Quatre langues (DE, EN, FR, TR) aux URL dédiées, avec SSR',
        'Showroom, vélos neufs, accessoires, service réparation, guides et FAQ',
        'Pages locales pour la recherche autour de Lahr',
        'Synchronisation Kleinanzeigen et extension Chrome pour les annonces',
        'Version Windows avec API embarquée',
        'Auto-hébergement : Docker, nginx, TLS automatique',
      ],
    },
    en: {
      subtitle: 'Inventory management and website for a bicycle shop in Lahr',
      category: 'Full-stack web app',
      description:
        'Second shop, same platform: .NET 9 API, Angular admin and a public SSR website with showroom, accessories and repair service — four languages, on a dedicated server.',
      role: 'Full-stack developer & architect',
      long: `Benlirad is a bicycle shop in Lahr in the Black Forest. The platform originally built for Bikehaus Freiburg runs here in its own cut: the same core — purchasing, stock, sales, returns, customers, invoices, expenses and statistics — but shaped for a shop that sells and repairs rather than rents. That was exactly the work: what actually belongs to the core, and what only existed for the first client?

The public site runs on Angular 17 with server-side rendering in four languages (DE, EN, FR, TR). It pulls its content straight from the inventory system: the showroom shows real stock including a counter of available bikes, alongside new bikes, accessories, repair service, guides, FAQ, warranty and local landing pages for the region. What gets booked in at the shop is online without an intermediate step.

It all runs on a dedicated server with Docker and nginx: API, admin interface and SSR front-end as separate services, SQLite as the database, JWT for sign-in. On top come the same tools as in the sibling project — Kleinanzeigen sync, Chrome extension and a Windows build for the machine at the shop.`,
      features: [
        'Inventory management: purchasing, stock, sales, returns, customers, invoices, expenses',
        'Public website with live stock from the same database',
        'Four languages (DE, EN, FR, TR) on their own URLs, with SSR',
        'Showroom, new bikes, accessories, repair service, guides and FAQ',
        'Local landing pages for search around Lahr',
        'Kleinanzeigen sync plus Chrome extension for the listings',
        'Windows desktop build with a bundled API',
        'Self-hosted: Docker, nginx, automatic TLS',
      ],
    },
    tr: {
      subtitle: 'Lahr’daki bir bisiklet mağazası için stok yönetimi ve web sitesi',
      category: 'Full-stack web uygulaması',
      description:
        'İkinci mağaza, aynı platform: .NET 9 API, Angular yönetim paneli ve showroom, aksesuar ve tamir servisiyle SSR’li halka açık site — dört dil, kendi sunucusunda.',
      role: 'Full-stack geliştirici & mimar',
      long: `Benlirad, Kara Orman’daki Lahr’da bir bisiklet mağazası. Bikehaus Freiburg için doğan platform burada kendi kesimiyle çalışıyor: aynı çekirdek — alım, stok, satış, iade, müşteriler, faturalar, giderler ve istatistik — ama kiralayan değil, satan ve tamir eden bir mağazaya göre biçilmiş. İşin özü de tam buradaydı: Gerçekten çekirdeğe ait olan ne, sadece ilk müşteri için var olan ne?

Halka açık site, sunucu taraflı render’lı Angular 17 ile dört dilde çalışıyor (DE, EN, FR, TR). İçeriğini doğrudan stok sisteminden alıyor: Showroom gerçek stoğu, müsait bisiklet sayacıyla birlikte gösteriyor; yanında yeni bisikletler, aksesuar, tamir servisi, rehber, SSS, garanti ve bölge için yerel sayfalar. Mağazada kaydedilen, aradan bir adım geçmeden internette.

Tamamı kendi sunucusunda, Docker ve nginx ile çalışıyor: API, yönetim arayüzü ve SSR ön yüzü ayrı servisler, veritabanı SQLite, giriş için JWT. Üstüne kardeş projedeki araçların aynısı geliyor — Kleinanzeigen eşitlemesi, Chrome eklentisi ve mağazadaki bilgisayar için Windows sürümü.`,
      features: [
        'Stok yönetimi: alım, stok, satış, iade, müşteriler, faturalar, giderler',
        'Aynı veritabanından canlı stokla beslenen halka açık site',
        'Kendi URL’leriyle dört dil (DE, EN, FR, TR) ve SSR',
        'Showroom, yeni bisikletler, aksesuar, tamir servisi, rehber ve SSS',
        'Lahr çevresindeki arama için yerel sayfalar',
        'İlanlar için Kleinanzeigen eşitlemesi ve Chrome eklentisi',
        'API’yi içeren Windows masaüstü sürümü',
        'Kendi sunucusu: Docker, nginx, otomatik TLS',
      ],
    },
    ku: {
      subtitle: 'Rêveberiya stokê û malper ji bo firotgehek bisîkletan li Lahrê',
      category: 'Sepana webê ya full-stack',
      description:
        'Firotgeha duyem, heman platform: API ya .NET 9, panela rêveberiyê ya Angular û malpera giştî ya bi SSR bi showroom, alav û servisa tamîrê — çar ziman, li ser servera xwe.',
      role: 'Pêşvebirê full-stack & mîmar',
      long: `Benlirad firotgehek bisîkletan e li Lahra Daristana Reş. Platforma ku ji bo Bikehaus Freiburg hatibû afirandin li vir bi birrîna xwe dixebite: heman navend — kirîn, stok, firotin, vegerandin, xerîdar, fatûre, lêçûn û amar — lê li gorî firotgehek ku difiroşe û tamîr dike, ne ku kirê dide. Kar jî tam li vir bû: Bi rastî çi ya navendê ye û çi tenê ji bo xerîdarê yekem hebû?

Rûpela giştî bi Angular 17 û renderkirina aliyê serverê di çar zimanan de dixebite (DE, EN, FR, TR). Naveroka xwe rasterast ji pergala stokê digire: Showroom stoka rastîn bi jimarvana bisîkletên berdest nîşan dide, li kêleka wê bisîkletên nû, alav, servisa tamîrê, rêbername, FAQ, garantî û rûpelên herêmî yên herêmê. Tiştê ku li firotgehê tê tomarkirin, bê gavek navber li ser înternetê ye.

Her tişt li ser servereke xwe bi Docker û nginx dixebite: API, navrûya rêveberiyê û frontenda SSR wek karûbarên cuda, SQLite wek danegeh, JWT ji bo têketinê. Li ser wan heman amûrên projeya xwişkê tên — hevahengiya Kleinanzeigen, dirêjkirina Chrome û guhertoyeke Windows ji bo komputera firotgehê.`,
      features: [
        'Rêveberiya stokê: kirîn, stok, firotin, vegerandin, xerîdar, fatûre, lêçûn',
        'Malpera giştî bi stoka zindî ji heman danegehê',
        'Çar ziman (DE, EN, FR, TR) bi URLên xwe û SSR',
        'Showroom, bisîkletên nû, alav, servisa tamîrê, rêbername û FAQ',
        'Rûpelên herêmî ji bo lêgerîna li dora Lahrê',
        'Hevahengiya Kleinanzeigen û dirêjkirina Chrome ji bo îlanan',
        'Guhertoya Windows bi API ya tê de',
        'Hilanîna xwe: Docker, nginx, TLS ya otomatîk',
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
      subtitle: 'Site premium avec cours des métaux en direct pour un bijoutier',
      category: 'Site premium',
      description:
        'Site pour un négociant en or, bijoutier et atelier à Fribourg : cours des métaux en direct, calculateurs et catalogue. Next.js 16, sept langues dont l’arabe en RTL.',
      role: 'Développeur & designer (solo)',
      long: `Zerin Gold est négociant en or, bijoutier et atelier de joaillerie à Fribourg-en-Brisgau. Le site adopte une esthétique noir et or posée, avec une typographie à empattements fine et des animations de défilement discrètes — pour l’or, ce n’est pas le volume sonore qui vend, mais l’impression de solidité. Sept langues couvrent la clientèle, l’arabe avec une mise en page de droite à gauche.

La partie techniquement intéressante, c’est le prix. Un provider maison lit les cotations des métaux chez Kitco, convertit le bid/ask à l’once troy via le taux de change BCE en centimes par gramme de métal fin, et met le résultat en cache deux minutes — le site affiche donc des chiffres fiables sans solliciter la source à chaque visite. Là-dessus reposent un moteur de marges que le commerçant pilote depuis l’administration et quatre calculateurs : valeur de l’or usagé, convertisseur de carats, Krugerrand et plan d’épargne. Le bandeau en haut de page vient de la même source.

En dessous : Next.js 16 avec React Server Components et Server Actions, Prisma 7 sur PostgreSQL, Redis en cache, Auth.js v5 avec Argon2 et second facteur TOTP pour l’administration, Resend pour les e-mails et Cloudflare Turnstile contre le spam. Environ 290 URL avec des pages dédiées aux requêtes réellement recherchées — de « gram altın » aux alliances — plus des tests Vitest et Playwright, hébergé en Allemagne derrière Cloudflare.`,
      features: [
        'Cours en direct : cotations Kitco + taux BCE → centimes par gramme fin, cache de 2 minutes',
        'Quatre calculateurs : or usagé, convertisseur de carats, Krugerrand, plan d’épargne',
        'Moteur de marges — le commerçant règle lui-même ses marges dans l’administration',
        '7 langues dont l’arabe en RTL, architecture white-label',
        'Next.js 16 avec Server Components, Prisma 7/PostgreSQL et Redis',
        'Connexion admin avec Argon2 et second facteur TOTP (Auth.js v5)',
        'Formulaires protégés par Cloudflare Turnstile, sans énigmes de captcha',
        'Environ 290 URL avec pages de destination ciblées, tests Vitest et Playwright',
      ],
    },
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
    ku: {
      subtitle: 'Malpera premium bi bihayên madenan ên zindî ji bo zêrkerekî',
      category: 'Malpera premium',
      description:
        'Malper ji bo bazirganê zêr, zêrker û atolyeyê li Freiburgê: bihayên madenên hêja yên zindî, hesabker û katalog. Next.js 16, heft ziman bi erebiya RTL.',
      role: 'Pêşvebir & sêwirkar (solo)',
      long: `Zerin Gold li Freiburg im Breisgau bazirganê zêr, zêrker û atolyeya xemlan e. Malper li ser estetîkeke aram a reş-zêrîn, tîpografiyeke serif a nazik û anîmasyonên hûrgilî yên scrollê ava ye — li cem zêr ne dengbilindî difiroşe, lê bandora saxlemiyê. Heft ziman xerîdaran digire nav xwe, erebî bi rêzkirina ji rastê ber bi çepê.

Beşa ku ji aliyê teknîkî ve balkêş e biha ye. Pêşkêşkerekî taybet bihayên madenên hêja ji Kitco dixwîne, bid/ask ya her onsê bi kursa Banka Navendî ya Ewropî dizivirîne sent li ser her gramê madenê safî, û encamê du deqîqeyan di cacheyê de digire — malper bêyî ku her carê serî li çavkaniyê bide jimareyên pêbawer nîşan dide. Li ser vê yekê motorek marjê heye ku bazirgan bi xwe ji beşa rêveberiyê birêve dibe, û çar hesabker: nirxa zêrê kevn, veguhêzerê karatê, Krugerrand û plana teserûfê. Rêzika li serê rûpelê jî ji heman çavkaniyê tê.

Di bin de: Next.js 16 bi React Server Components û Server Actions, Prisma 7 li ser PostgreSQL, Redis wek cache, Auth.js v5 bi Argon2 û faktora duyem a TOTP ji bo rêveberiyê, Resend ji bo e-nameyan û Cloudflare Turnstile li dijî spama formê. Nêzîkî 290 URL bi rûpelên taybet ji bo peyvên ku bi rastî têne lêgerîn — ji „gram altın" heta gustîlkên zewacê — û testên Vitest û Playwright, li Almanyayê li pişt Cloudflare.`,
      features: [
        'Bihayên zindî: quoteên Kitco + kursa BNE → sent li ser gramê safî, cache ya 2 deqîqeyan',
        'Çar hesabker: nirxa zêrê kevn, veguhêzerê karatê, Krugerrand, plana teserûfê',
        'Motora marjê — bazirgan marjên xwe bi xwe di beşa rêveberiyê de diyar dike',
        '7 ziman bi erebiya RTL, avahiyeke white-label',
        'Next.js 16 bi Server Components, Prisma 7/PostgreSQL û Redis',
        'Têketina rêveber bi Argon2 û faktora duyem a TOTP (Auth.js v5)',
        'Form bi Cloudflare Turnstile têne parastin, ne bi mamikên captcha',
        'Nêzîkî 290 URL bi rûpelên peyvên mifteyî, test bi Vitest û Playwright',
      ],
    },
  },
  'hotel-bergfrieden': {
    fr: {
      subtitle: 'Site d’hôtel entièrement pré-rendu en Haute-Forêt-Noire',
      category: 'Site web',
      description:
        'Site pour un hôtel familial à Löffingen. Angular 21, chaque route pré-rendue en HTML, quatre langues — sans runtime serveur.',
      role: 'Développeur full-stack & designer',
      long: `L’Hôtel Bergfrieden est une maison familiale à Löffingen, en Haute-Forêt-Noire. Le projet suit une consigne plus facile à énoncer qu’à construire : luxueux, mais chaleureux. Cela repose sur une palette Forêt-Noire — vert forêt, crème et bronze —, Cormorant Garamond pour les titres et Inter pour le texte courant : de grandes images, beaucoup de blanc, aucun effet superflu.

Côté contenu, le site couvre ce dont une maison de cette taille a réellement besoin : cinq types de chambres avec bouton de demande, le petit-déjeuner bio et régional avec ses producteurs, une page région avec la Hochschwarzwald Card, une galerie avec lightbox, un blog, un contact avec demande et WhatsApp — en quatre langues. Pour un hôtel qui reçoit ses réservations via les portails et les demandes directes, c’est le bon format : pas de moteur de réservation à entretenir, mais un site qui convainc et déclenche la demande.

Techniquement, c’est volontairement la solution la plus simple qui tienne. Angular 21 avec composants standalone et signals ; au build, toutes les routes sont pré-rendues en HTML et déposées sur GitHub Pages — pas de serveur, pas de coût d’exécution, rien qui puisse tomber la nuit. Balises méta par route, JSON-LD Hotel Schema.org, sitemap.xml, robots.txt et manifeste PWA sont intégrés, le déploiement part automatiquement à chaque push.`,
      features: [
        'Design chaleureux et luxueux : palette Forêt-Noire, Cormorant Garamond + Inter',
        'Génération statique — chaque route en HTML fini, aucun serveur nécessaire',
        'Quatre langues (DE, EN, FR, TR) aux URL dédiées',
        'Chambres, petit-déjeuner bio régional, région avec Hochschwarzwald Card, galerie, blog',
        'Parcours de demande avec raccourci WhatsApp plutôt qu’un moteur de réservation',
        'SEO par route : JSON-LD Hotel Schema.org, sitemap.xml, cartes OG/Twitter',
        'Manifeste PWA et llms.txt',
        'Déploiement automatique via GitHub Actions sur GitHub Pages',
      ],
    },
    en: {
      subtitle: 'Statically rendered hotel website in the High Black Forest',
      category: 'Website',
      description:
        'Website for a family-run hotel in Löffingen. Angular 21, every route pre-rendered to HTML, four languages — with no server runtime.',
      role: 'Full-stack developer & designer',
      long: `Hotel Bergfrieden is a family-run house in Löffingen in the High Black Forest. The design follows a brief that is easier said than built: luxurious, but warm. That is carried by a Black Forest palette of forest green, cream and bronze, with Cormorant Garamond for headlines and Inter for body text — generous images, plenty of white space, no effects for their own sake.

In terms of content the site covers what a house this size actually needs: five room types with an enquiry button, the organic regional breakfast including its suppliers, a region page with the Hochschwarzwald Card, a gallery with lightbox, a blog, and contact with an enquiry form and WhatsApp — in four languages. For a hotel that gets its bookings through portals and direct enquiries, that is the right cut: no booking engine to maintain, but a site that convinces and triggers the enquiry.

Technically it is deliberately the simplest thing that works. Angular 21 with standalone components and signals; at build time every route is pre-rendered to finished HTML and served from GitHub Pages — no server, no runtime cost, nothing that can fall over at night. Per-route meta tags, Hotel Schema.org JSON-LD, sitemap.xml, robots.txt and a PWA manifest are built in, and deployment runs automatically on every push.`,
      features: [
        'Warm, luxurious design: Black Forest palette, Cormorant Garamond + Inter',
        'Static site generation — every route as finished HTML, no server needed',
        'Four languages (DE, EN, FR, TR) on their own URLs',
        'Rooms, organic regional breakfast, region page with Hochschwarzwald Card, gallery, blog',
        'Enquiry flow with a WhatsApp shortcut instead of a booking engine',
        'Per-route SEO with Hotel Schema.org JSON-LD, sitemap.xml, OG/Twitter cards',
        'PWA manifest and llms.txt',
        'Automatic deployment via GitHub Actions to GitHub Pages',
      ],
    },
    tr: {
      subtitle: 'Yüksek Kara Orman’da statik üretilmiş otel sitesi',
      category: 'Web sitesi',
      description:
        'Löffingen’deki aile işletmesi bir otel için web sitesi. Angular 21, her sayfa önceden HTML olarak üretiliyor, dört dil — sunucu çalışma zamanı olmadan.',
      role: 'Full-stack geliştirici & tasarımcı',
      long: `Hotel Bergfrieden, Yüksek Kara Orman’daki Löffingen’de aile işletmesi bir otel. Tasarım, söylemesi yapmasından kolay bir briefi izliyor: lüks ama sıcak. Bunu orman yeşili, krem ve bronzdan oluşan bir Kara Orman paleti taşıyor; başlıklarda Cormorant Garamond, metinde Inter — geniş görseller, bol beyaz alan, gösteri olsun diye efekt yok.

İçerik olarak site, bu büyüklükte bir işletmenin gerçekten ihtiyaç duyduğu şeyi kapsıyor: talep butonuyla beş oda tipi, tedarikçileriyle birlikte organik bölgesel kahvaltı, Hochschwarzwald Card’lı bölge sayfası, lightbox’lı galeri, blog ve WhatsApp’lı iletişim — dört dilde. Rezervasyonlarını portallardan ve doğrudan taleplerden alan bir otel için doğru kesim bu: bakımı gereken bir rezervasyon motoru değil, ikna eden ve talebi başlatan bir site.

Teknik olarak bilinçli biçimde işe yarayan en basit çözüm. Standalone bileşenler ve signals ile Angular 21; derleme sırasında tüm sayfalar hazır HTML’e dönüşüyor ve GitHub Pages üzerinde duruyor — sunucu yok, çalışma maliyeti yok, gece çökebilecek bir şey yok. Sayfa başına meta etiketler, Hotel Schema.org JSON-LD, sitemap.xml, robots.txt ve PWA manifesti yerleşik; dağıtım her push’ta otomatik çalışıyor.`,
      features: [
        'Sıcak-lüks tasarım: Kara Orman paleti, Cormorant Garamond + Inter',
        'Statik üretim — her sayfa hazır HTML, sunucuya gerek yok',
        'Kendi URL’leriyle dört dil (DE, EN, FR, TR)',
        'Odalar, organik bölgesel kahvaltı, Hochschwarzwald Card’lı bölge sayfası, galeri, blog',
        'Rezervasyon motoru yerine WhatsApp kısayollu talep akışı',
        'Sayfa bazlı SEO: Hotel Schema.org JSON-LD, sitemap.xml, OG/Twitter kartları',
        'PWA manifesti ve llms.txt',
        'GitHub Actions ile GitHub Pages’e otomatik dağıtım',
      ],
    },
    ku: {
      subtitle: 'Malpera otêlê ya statîk a li Daristana Reş a Bilind',
      category: 'Malper',
      description:
        'Malper ji bo otêleke malbatî li Löffingenê. Angular 21, her rê wek HTML pêş-amadekirî, çar ziman — bê runtimeya serverê.',
      role: 'Pêşvebirê full-stack & sêwirkar',
      long: `Hotel Bergfrieden otêleke malbatî ye li Löffingena Daristana Reş a Bilind. Sêwirandin li gorî daxwazek e ku gotina wê ji çêkirina wê hêsantir e: bi şkoh, lê germ. Vê yekê paletek Daristana Reş hildigire — kesk, krem û bronz —, Cormorant Garamond ji bo sernavan û Inter ji bo nivîsê: wêneyên fireh, cihê spî yê dewlemend, bê bandorên zêde.

Ji hêla naverokê ve malper tiştê ku xaniyekî vî qasî bi rastî hewce dike digire nav xwe: pênc cureyên odeyan bi bişkoka daxwazê, taştêya organîk a herêmî bi çavkaniyên wê, rûpela herêmê bi Hochschwarzwald Card, galerî bi lightbox, blog û têkilî bi daxwaz û WhatsApp — di çar zimanan de. Ji bo otêlek ku rezervasyonên xwe ji portalan û daxwazên rasterast digire, ev birrîna rast e: ne motorek rezervasyonê ku divê were parastin, lê malperek ku qanî dike û daxwazê dide destpêkirin.

Ji aliyê teknîkî ve bi zanetî sadetirîn çareseriya ku dixebite ye. Angular 21 bi standalone components û signals; di dema avakirinê de hemû rê dibin HTMLya amade û li ser GitHub Pages radiwestin — ne server, ne lêçûna xebitandinê, ne tiştek ku bi şev bikeve. Meta-etîket ji bo her rêyê, JSON-LD ya Hotel Schema.org, sitemap.xml, robots.txt û manifesta PWA hatine danîn, belavkirin bi her push otomatîk dixebite.`,
      features: [
        'Sêwirana germ-şkodar: paleta Daristana Reş, Cormorant Garamond + Inter',
        'Çêkirina statîk — her rê wek HTMLya amade, server ne hewce ye',
        'Çar ziman (DE, EN, FR, TR) bi URLên xwe',
        'Ode, taştêya organîk a herêmî, rûpela herêmê bi Hochschwarzwald Card, galerî, blog',
        'Rêça daxwazê bi kurteriya WhatsAppê, ne motorek rezervasyonê',
        'SEO ji bo her rêyê: JSON-LD ya Hotel Schema.org, sitemap.xml, kartên OG/Twitter',
        'Manifesta PWA û llms.txt',
        'Belavkirina otomatîk bi GitHub Actions li ser GitHub Pages',
      ],
    },
  },
  'kulturplattform-freiburg': {
    fr: {
      subtitle: 'Plateforme associative avec CMS, cours et newsletter',
      category: 'Application web / CMS',
      description:
        'Plateforme pour une association culturelle à Fribourg : événements, cours, bénévolat et newsletter en double opt-in. Back-end .NET 10 en CQRS, front React, bilingue.',
      role: 'Développeur full-stack',
      long: `La Kulturplattform Freiburg e. V. organise des événements, des cours et des formats de rencontre à Fribourg. La plateforme reflète ce que l’association fait réellement : des activités avec catégories, recherche et pages de détail, des cours, des partenaires, les statuts, les dons et un formulaire pour les bénévoles. Tout est maintenu par le bureau lui-même — y compris les traductions, stockées comme ressources en base et modifiables depuis l’administration. Un nouveau texte en allemand et en turc ne demande donc aucun déploiement.

Le back-end est un service .NET 10 en Clean Architecture avec CQRS via MediatR, FluentValidation pour les entrées, JWT et BCrypt pour la connexion et Entity Framework Core sur SQL Server — environ 22 contrôleurs, avec des tests aux niveaux domaine, application et intégration. La newsletter n’est pas un lien mailto mais un vrai parcours : double opt-in avec lien de confirmation, jeton de désinscription dans chaque message, campagnes par langue et envoi par lots, via Azure Communication Services avec SMTP en repli.

Le tout tourne sur un serveur dédié : Docker Compose avec SQL Server, l’API et nginx, des boîtes mail propres pour l’envoi et, à côté, des scripts de sauvegarde et de restauration. Le front est une application React monopage qui attaque la même API.`,
      features: [
        'Activités avec filtre par catégorie, recherche et pages de détail',
        'Cours, partenaires, statuts, dons et formulaire de bénévolat',
        'Bilingue (DE/TR) — les traductions sont en base, pas dans le code',
        'Newsletter en double opt-in, jeton de désinscription et campagnes par langue',
        'Envoi via Azure Communication Services avec SMTP en repli',
        'Clean Architecture avec CQRS (MediatR) et FluentValidation',
        'Tests aux niveaux domaine, application et intégration',
        'Auto-hébergement : Docker Compose avec SQL Server, API et nginx, boîtes mail propres',
      ],
    },
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
    ku: {
      subtitle: 'Platforma komeleyê bi CMS, kurs û nûçenameyê',
      category: 'Sepana webê / CMS',
      description:
        'Platform ji bo komeleyeke çandî li Freiburgê: çalakî, kurs, dilxwazî û nûçenameya bi opt-ina ducar. Backenda .NET 10 bi CQRS, frontenda React, du zimanî.',
      role: 'Pêşvebirê full-stack',
      long: `Kulturplattform Freiburg e. V. li Freiburgê çalakî, kurs û bernameyên hevdîtinê organîze dike. Platform tiştê ku komele bi rastî dike nîşan dide: çalakî bi kategorî, lêgerîn û rûpelên hûrgilî, bernameyên kursan, hevkar, rêzikname, bexşîn û formek ji bo dilxwazan. Her tiştî desteya rêveber bi xwe diparêze — wergerî jî tê de; werger wek çavkanî di danegehê de ne û di beşa rêveberiyê de têne guhertin. Nivîseke nû bi almanî û tirkî loma ti belavkirinê naxwaze.

Backend karûbarekî .NET 10 e bi Clean Architecture û CQRS bi MediatR: FluentValidation ji bo têketinan, JWT û BCrypt ji bo têketinê, Entity Framework Core li ser SQL Server — nêzîkî 22 controller, û test li asta domain, sepanê û entegrasyonê. Nûçename ne girêdanek mailto ye, lê rêçeke rastîn e: opt-ina ducar bi girêdana erêkirinê, tokena derketinê di her peyamê de, kampanya li gorî zimanan û şandin bi koman, bi Azure Communication Services û SMTP wek paşxan.

Her tişt li ser servereke xwe dixebite: Docker Compose bi SQL Server, API û nginx, qutîkên e-nameyê yên xwe ji bo şandinê, û li kêleka wan skrîptên paşekêş û vegerandinê. Frontend sepanek React a yek-rûpelî ye ku bi heman API re dipeyive.`,
      features: [
        'Çalakî bi parzûna kategoriyê, lêgerîn û rûpelên hûrgilî',
        'Bernameyên kursan, hevkar, rêzikname, bexşîn û forma dilxwaziyê',
        'Du zimanî (DE/TR) — werger di danegehê de ne, ne di kodê de',
        'Nûçename bi opt-ina ducar, tokena derketinê û kampanya li gorî zimanan',
        'Şandin bi Azure Communication Services, bi SMTP wek paşxan',
        'Clean Architecture bi CQRS (MediatR) û FluentValidation',
        'Test li asta domain, sepanê û entegrasyonê',
        'Hilanîna xwe: Docker Compose bi SQL Server, API û nginx, qutîkên e-nameyê yên xwe',
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
