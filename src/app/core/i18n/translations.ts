import { Lang } from './i18n.service';

type Entry = Record<Lang, string>;

/**
 * UI translation table. Values may contain inline <em>/<br> markup and are
 * rendered with [innerHTML] where needed — content is author-controlled, never
 * user input.
 *
 * Scope: navigation, global chrome (footer), common actions and the home page.
 * Long-form editorial prose (case studies, detailed service copy) stays German.
 */
export const TRANSLATIONS: Record<string, Entry> = {
  // ---- Navigation ----------------------------------------------------------
  'nav.available': {
    de: 'Verfügbar', fr: 'Disponible', en: 'Available', tr: 'Müsait', ku: 'Berdest',
  },
  'nav.home': { de: 'Index', fr: 'Accueil', en: 'Home', tr: 'Anasayfa', ku: 'Serûpel' },
  'nav.leistungen': { de: 'Leistungen', fr: 'Services', en: 'Services', tr: 'Hizmetler', ku: 'Xizmet' },
  'nav.projects': { de: 'Projekte', fr: 'Projets', en: 'Projects', tr: 'Projeler', ku: 'Proje' },
  'nav.experience': { de: 'Werdegang', fr: 'Parcours', en: 'Experience', tr: 'Deneyim', ku: 'Tecrûbe' },
  'nav.resume': { de: 'Lebenslauf', fr: 'CV', en: 'Résumé', tr: 'Özgeçmiş', ku: 'Jînenîgarî' },
  'nav.contact': { de: 'Kontakt', fr: 'Contact', en: 'Contact', tr: 'İletişim', ku: 'Têkilî' },
  'nav.impressum': { de: 'Impressum', fr: 'Mentions légales', en: 'Imprint', tr: 'Künye', ku: 'Impressum' },
  'nav.datenschutz': { de: 'Datenschutz', fr: 'Confidentialité', en: 'Privacy', tr: 'Gizlilik', ku: 'Nepenî' },

  // ---- Common actions ------------------------------------------------------
  'cta.contact': {
    de: 'Kontakt aufnehmen', fr: 'Me contacter', en: 'Get in touch', tr: 'İletişime geç', ku: 'Têkilî daînin',
  },
  'cta.request': {
    de: 'Projekt anfragen', fr: 'Demander un devis', en: 'Request a project', tr: 'Proje talep et', ku: 'Daxwaza projeyê',
  },
  'cta.all_projects': {
    de: 'Alle Projekte', fr: 'Tous les projets', en: 'All projects', tr: 'Tüm projeler', ku: 'Hemû proje',
  },
  'cta.read_case': {
    de: 'Fallstudie lesen →', fr: 'Lire l’étude de cas →', en: 'Read case study →', tr: 'Vaka çalışmasını oku →', ku: 'Lêkolînê bixwîne →',
  },
  'cta.cv_pdf': {
    de: 'Lebenslauf · PDF', fr: 'CV · PDF', en: 'Résumé · PDF', tr: 'Özgeçmiş · PDF', ku: 'Jînenîgarî · PDF',
  },
  'cta.view_work': {
    de: 'Arbeiten ansehen', fr: 'Voir mes travaux', en: 'View my work', tr: 'Çalışmalarımı gör', ku: 'Karên min bibîne',
  },
  'cta.start_demo': {
    de: 'Demo starten', fr: 'Lancer la démo', en: 'Start demo', tr: 'Demoyu başlat', ku: 'Demo dest pê bike',
  },
  'demo.open_tab': {
    de: 'In neuem Tab öffnen ↗', fr: 'Ouvrir dans un onglet ↗', en: 'Open in new tab ↗', tr: 'Yeni sekmede aç ↗', ku: 'Di tabek nû de veke ↗',
  },
  'demo.blocked': {
    de: 'Vorschau leer? Manche Seiten erlauben keine Einbettung —',
    fr: 'Aperçu vide ? Certains sites bloquent l’intégration —',
    en: 'Preview empty? Some sites block embedding —',
    tr: 'Önizleme boş mu? Bazı siteler gömmeyi engeller —',
    ku: 'Pêşdîtin vala ye? Hin malper hundirkirinê asteng dikin —',
  },
  'demo.loading': {
    de: 'Live-Vorschau wird geladen …', fr: 'Chargement de l’aperçu en direct …', en: 'Loading live preview …', tr: 'Canlı önizleme yükleniyor …', ku: 'Pêşdîtina zindî tê barkirin …',
  },
  'cta.services': {
    de: 'Leistungen ansehen', fr: 'Voir les services', en: 'View services', tr: 'Hizmetleri gör', ku: 'Xizmetan bibîne',
  },

  // ---- Hero ----------------------------------------------------------------
  'home.hero.eyebrow': {
    de: 'Freiberuflicher Webentwickler', fr: 'Développeur web indépendant', en: 'Freelance web developer', tr: 'Serbest web geliştirici', ku: 'Pêşvebirê webê yê serbixwe',
  },
  'home.hero.available': {
    de: 'Verfügbar für neue Projekte', fr: 'Disponible pour de nouveaux projets', en: 'Available for new projects', tr: 'Yeni projelere açık', ku: 'Ji bo projeyên nû berdest',
  },
  'home.hero.lede': {
    de: 'Ich entwerfe und entwickle moderne Websites, Web-Apps und Online-Shops aus Freiburg — schnell, SEO-optimiert und so gebaut, dass sie überzeugen. Von der Architektur bis zum letzten Pixel.',
    fr: 'Je conçois et développe des sites web, applications et boutiques en ligne modernes depuis Fribourg — rapides, optimisés pour le SEO et conçus pour convaincre. De l’architecture au moindre pixel.',
    en: 'I design and build modern websites, web apps and online shops from Freiburg — fast, SEO-optimised and crafted to convince. From the architecture to the last pixel.',
    tr: 'Freiburg’dan modern web siteleri, web uygulamaları ve online mağazalar tasarlayıp geliştiriyorum — hızlı, SEO uyumlu ve ikna edici. Mimariden son piksele kadar.',
    ku: 'Ez ji Freiburgê malperên nûjen, sepanên webê û firotgehên serhêl dîzayn dikim û çêdikim — bilez, ji bo SEO-yê xweşkirî û bawerker. Ji avahîsaziyê heta pîkselê dawî.',
  },

  // ---- Cover index ---------------------------------------------------------
  'home.idx.about': { de: 'Über', fr: 'À propos', en: 'About', tr: 'Hakkında', ku: 'Derbarê' },
  'home.idx.stats': { de: 'Statistik', fr: 'Chiffres', en: 'Stats', tr: 'İstatistik', ku: 'Statîstîk' },
  'home.idx.stack': { de: 'Stack', fr: 'Stack', en: 'Stack', tr: 'Stack', ku: 'Stack' },
  'home.idx.work': { de: 'Arbeiten', fr: 'Travaux', en: 'Work', tr: 'Çalışmalar', ku: 'Kar' },
  'home.idx.scroll': { de: 'Scrollen', fr: 'Défiler', en: 'Scroll', tr: 'Kaydır', ku: 'Bişemitîne' },

  // ---- Section: About ------------------------------------------------------
  'home.about.label': { de: 'Über', fr: 'À propos', en: 'About', tr: 'Hakkımda', ku: 'Derbarê min' },
  'home.about.title': {
    de: 'Entwickler mit Sinn für<br /><em>handwerkliche Präzision</em>.',
    fr: 'Un développeur épris de<br /><em>précision artisanale</em>.',
    en: 'A developer with a feel for<br /><em>craftsmanship</em>.',
    tr: 'El işçiliğine değer veren<br /><em>bir geliştirici</em>.',
    ku: 'Pêşvebirek bi hesta<br /><em>hostatiyê</em>.',
  },

  // ---- Section: Stats ------------------------------------------------------
  'home.stats.years': { de: 'Jahre Erfahrung', fr: 'Ans d’expérience', en: 'Years of experience', tr: 'Yıl deneyim', ku: 'Sal tecrûbe' },
  'home.stats.projects': { de: 'Projekte', fr: 'Projets', en: 'Projects', tr: 'Proje', ku: 'Proje' },
  'home.stats.tech': { de: 'Technologien', fr: 'Technologies', en: 'Technologies', tr: 'Teknoloji', ku: 'Teknolojî' },
  'home.stats.passion': { de: 'Leidenschaft', fr: 'Passion', en: 'Passion', tr: 'Tutku', ku: 'Dildarî' },

  // ---- Section: Stack ------------------------------------------------------
  'home.stack.label': { de: 'Stack', fr: 'Stack', en: 'Stack', tr: 'Stack', ku: 'Stack' },
  'home.stack.title': {
    de: 'Werkzeuge, die ich<br /><em>täglich beherrsche</em>.',
    fr: 'Les outils que je<br /><em>maîtrise au quotidien</em>.',
    en: 'Tools I<br /><em>master every day</em>.',
    tr: 'Her gün<br /><em>kullandığım araçlar</em>.',
    ku: 'Amûrên ku ez<br /><em>her roj bi kar tînim</em>.',
  },
  'home.stack.subtitle': {
    de: 'Eine Auswahl der Technologien, mit denen ich produktive, wartbare Systeme baue.',
    fr: 'Une sélection des technologies avec lesquelles je construis des systèmes productifs et maintenables.',
    en: 'A selection of the technologies I use to build productive, maintainable systems.',
    tr: 'Üretken ve sürdürülebilir sistemler kurmak için kullandığım teknolojilerden bir seçki.',
    ku: 'Hilbijartinek ji teknolojiyên ku ez pê pergalên berhemdar û domdar ava dikim.',
  },

  // ---- Section: Work -------------------------------------------------------
  'home.work.label': { de: 'Arbeiten', fr: 'Travaux', en: 'Work', tr: 'Çalışmalar', ku: 'Kar' },
  'home.work.title': {
    de: 'Ausgewählte<br /><em>Fallstudien</em>.',
    fr: 'Études de cas<br /><em>sélectionnées</em>.',
    en: 'Selected<br /><em>case studies</em>.',
    tr: 'Seçilmiş<br /><em>vaka çalışmaları</em>.',
    ku: 'Lêkolînên<br /><em>hilbijartî</em>.',
  },

  // ---- Section: Live demos -------------------------------------------------
  'home.demos.label': { de: 'Live-Demos', fr: 'Démos live', en: 'Live demos', tr: 'Canlı demolar', ku: 'Demoyên zindî' },
  'home.demos.title': {
    de: 'Nicht nur Worte —<br /><em>klicken &amp; ausprobieren</em>.',
    fr: 'Pas que des mots —<br /><em>cliquez &amp; essayez</em>.',
    en: 'Not just words —<br /><em>click &amp; try it</em>.',
    tr: 'Sadece söz değil —<br /><em>tıkla &amp; dene</em>.',
    ku: 'Ne tenê gotin —<br /><em>bitikîne &amp; biceribîne</em>.',
  },
  'home.demos.subtitle': {
    de: 'Wählen Sie ein Projekt und erleben Sie es direkt hier im eingebetteten Browser. Echte, live laufende Anwendungen — kein Mockup.',
    fr: 'Choisissez un projet et découvrez-le directement ici, dans le navigateur intégré. De vraies applications en ligne — pas une maquette.',
    en: 'Pick a project and experience it right here in the embedded browser. Real, live applications — not a mockup.',
    tr: 'Bir proje seçin ve doğrudan burada, gömülü tarayıcıda deneyimleyin. Gerçek, canlı uygulamalar — maket değil.',
    ku: 'Projeyek hilbijêre û rasterast li vir, di geroka veşartî de biceribîne. Sepanên rastîn ên zindî — ne mockup.',
  },

  // ---- Section: Services (teaser) -----------------------------------------
  'home.services.label': { de: 'Leistungen', fr: 'Services', en: 'Services', tr: 'Hizmetler', ku: 'Xizmet' },
  'home.services.title': {
    de: 'Ihr Projekt in<br /><em>guten Händen</em> — aus Freiburg.',
    fr: 'Votre projet entre<br /><em>de bonnes mains</em> — depuis Fribourg.',
    en: 'Your project in<br /><em>good hands</em> — from Freiburg.',
    tr: 'Projeniz<br /><em>emin ellerde</em> — Freiburg’dan.',
    ku: 'Projeya we di<br /><em>destên baş</em> de — ji Freiburgê.',
  },
  'home.services.subtitle': {
    de: 'Als freiberuflicher Webentwickler in Freiburg begleite ich Sie von der ersten Idee bis zum Launch — und darüber hinaus.',
    fr: 'Développeur web indépendant à Fribourg, je vous accompagne de la première idée au lancement — et au-delà.',
    en: 'As a freelance web developer in Freiburg, I guide you from the first idea to launch — and beyond.',
    tr: 'Freiburg’da serbest web geliştirici olarak, ilk fikirden lansmana — ve sonrasına — kadar yanınızdayım.',
    ku: 'Wek pêşvebirê webê yê serbixwe li Freiburgê, ez ji ramana yekem heta destpêkê — û jê wêdetir — bi we re me.',
  },
  'svc.new.title': { de: 'Neue Website', fr: 'Nouveau site web', en: 'New website', tr: 'Yeni web sitesi', ku: 'Malpera nû' },
  'svc.new.text': {
    de: 'Moderne, blitzschnelle und SEO-optimierte Websites, die Vertrauen schaffen und gefunden werden — individuell statt Baukasten.',
    fr: 'Des sites modernes, ultra-rapides et optimisés SEO qui inspirent confiance et se font trouver — sur mesure, pas un modèle.',
    en: 'Modern, lightning-fast, SEO-optimised websites that build trust and get found — custom-built, not a template.',
    tr: 'Güven veren ve bulunan modern, çok hızlı ve SEO uyumlu web siteleri — şablon değil, size özel.',
    ku: 'Malperên nûjen, pir bilez û ji bo SEO xweşkirî ku baweriyê çêdikin û têne dîtin — taybetî, ne şablon.',
  },
  'svc.relaunch.title': { de: 'Website-Relaunch', fr: 'Refonte de site', en: 'Website relaunch', tr: 'Web sitesi yenileme', ku: 'Nûkirina malperê' },
  'svc.relaunch.text': {
    de: 'Ihre bestehende Seite wirkt veraltet oder lädt langsam? Ich bringe Design, Technik und Sichtbarkeit auf den Stand von 2026.',
    fr: 'Votre site actuel semble dépassé ou lent ? Je remets le design, la technique et la visibilité au niveau de 2026.',
    en: 'Your current site looks dated or loads slowly? I bring design, technology and visibility up to 2026 standards.',
    tr: 'Mevcut siteniz eski mi görünüyor ya da yavaş mı? Tasarımı, tekniği ve görünürlüğü 2026 seviyesine taşırım.',
    ku: 'Malpera we ya heyî kevn xuya dike an hêdî bar dibe? Ez dîzayn, teknîk û xuyangê digihînim asta 2026.',
  },
  'svc.app.title': { de: 'Web-App & Software', fr: 'Application & logiciel', en: 'Web app & software', tr: 'Web uygulaması & yazılım', ku: 'Sepan & nermalav' },
  'svc.app.text': {
    de: 'Individuelle Web-Anwendungen, Kundenportale und Geschäftssoftware nach Maß — mit Angular, .NET und sauberer Architektur.',
    fr: 'Applications web, portails clients et logiciels métier sur mesure — avec Angular, .NET et une architecture propre.',
    en: 'Custom web applications, customer portals and business software — with Angular, .NET and clean architecture.',
    tr: 'Size özel web uygulamaları, müşteri portalları ve iş yazılımları — Angular, .NET ve temiz mimari ile.',
    ku: 'Sepanên webê yên taybetî, portalên xerîdaran û nermalava karsaziyê — bi Angular, .NET û avahiyek paqij.',
  },
  'svc.shop.title': { de: 'Online-Shop', fr: 'Boutique en ligne', en: 'Online shop', tr: 'Online mağaza', ku: 'Firotgeha serhêl' },
  'svc.shop.text': {
    de: 'E-Commerce-Lösungen mit Produktverwaltung, Zahlungsanbindung und mehrsprachigem Auftritt — bereit zum Verkaufen.',
    fr: 'Solutions e-commerce avec gestion des produits, paiement intégré et site multilingue — prêtes à vendre.',
    en: 'E-commerce solutions with product management, payment integration and a multilingual presence — ready to sell.',
    tr: 'Ürün yönetimi, ödeme entegrasyonu ve çok dilli yapıyla e-ticaret çözümleri — satışa hazır.',
    ku: 'Çareseriyên e-bazirganiyê bi rêveberiya hilberan, girêdana dravdanê û pirzimanî — ji bo firotinê amade.',
  },
  'home.services.more': {
    de: 'Alle Leistungen & Ablauf', fr: 'Tous les services & déroulé', en: 'All services & process', tr: 'Tüm hizmetler & süreç', ku: 'Hemû xizmet & pêvajo',
  },

  // ---- Section: CTA --------------------------------------------------------
  'home.cta.label': { de: 'Zusammenarbeit', fr: 'Collaboration', en: 'Let’s work together', tr: 'İş birliği', ku: 'Hevkarî' },
  'home.cta.title': {
    de: 'Haben Sie ein Projekt<br /><em>im Kopf?</em>',
    fr: 'Vous avez un projet<br /><em>en tête ?</em>',
    en: 'Got a project<br /><em>in mind?</em>',
    tr: 'Aklınızda bir proje<br /><em>var mı?</em>',
    ku: 'Projeyek di<br /><em>serê we de heye?</em>',
  },
  'home.cta.text': {
    de: 'Ob neue Website, Relaunch oder individuelle Software — erzählen Sie mir davon. Das Erstgespräch ist unverbindlich und kostenlos.',
    fr: 'Nouveau site, refonte ou logiciel sur mesure — parlez-m’en. Le premier échange est gratuit et sans engagement.',
    en: 'New website, relaunch or custom software — tell me about it. The first conversation is free and without obligation.',
    tr: 'Yeni site, yenileme ya da özel yazılım — bana anlatın. İlk görüşme ücretsiz ve bağlayıcı değil.',
    ku: 'Malpera nû, nûkirin an nermalava taybetî — ji min re bêje. Axaftina yekem belaş û bê mecbûrî ye.',
  },

  // ---- Footer --------------------------------------------------------------
  'footer.eyebrow': { de: 'Colophon', fr: 'Colophon', en: 'Colophon', tr: 'Künye', ku: 'Kolofon' },
  'footer.signoff': {
    de: 'Lassen Sie uns <em>etwas Bleibendes</em> bauen.',
    fr: 'Construisons <em>quelque chose qui dure</em>.',
    en: 'Let’s build <em>something that lasts</em>.',
    tr: 'Birlikte <em>kalıcı bir şey</em> inşa edelim.',
    ku: 'Werin em <em>tiştek mayînde</em> ava bikin.',
  },
  'footer.col.content': { de: 'Inhalt', fr: 'Contenu', en: 'Content', tr: 'İçerik', ku: 'Naverok' },
  'footer.col.elsewhere': { de: 'Anderswo', fr: 'Ailleurs', en: 'Elsewhere', tr: 'Başka yerde', ku: 'Ciyên din' },
  'footer.col.direct': { de: 'Direkt', fr: 'Direct', en: 'Direct', tr: 'Doğrudan', ku: 'Rasterast' },
  'footer.tagline': {
    de: 'Freiberuflicher Webentwickler aus Freiburg.<br />Websites · Web-Apps · Online-Shops.',
    fr: 'Développeur web indépendant à Fribourg.<br />Sites · Applications · Boutiques en ligne.',
    en: 'Freelance web developer from Freiburg.<br />Websites · Web apps · Online shops.',
    tr: 'Freiburg’dan serbest web geliştirici.<br />Web siteleri · Web uygulamaları · Online mağazalar.',
    ku: 'Pêşvebirê webê yê serbixwe ji Freiburgê.<br />Malper · Sepan · Firotgehên serhêl.',
  },
  'footer.rights': {
    de: 'Alle Rechte vorbehalten', fr: 'Tous droits réservés', en: 'All rights reserved', tr: 'Tüm hakları saklıdır', ku: 'Hemû maf parastî ne',
  },

  // ---- Common (extra) ------------------------------------------------------
  'common.live': { de: 'Live ansehen', fr: 'Voir en ligne', en: 'View live', tr: 'Canlı gör', ku: 'Zindî bibîne' },
  'common.github': { de: 'GitHub', fr: 'GitHub', en: 'GitHub', tr: 'GitHub', ku: 'GitHub' },
  'common.role': { de: 'Rolle', fr: 'Rôle', en: 'Role', tr: 'Rol', ku: 'Rol' },
  'common.period': { de: 'Zeitraum', fr: 'Période', en: 'Period', tr: 'Süre', ku: 'Dem' },
  'common.stack': { de: 'Stack', fr: 'Stack', en: 'Stack', tr: 'Stack', ku: 'Stack' },
  'common.resume_arrow': { de: 'Lebenslauf →', fr: 'CV →', en: 'Résumé →', tr: 'Özgeçmiş →', ku: 'Jînenîgarî →' },

  // ---- Projects list -------------------------------------------------------
  'projects.folio': { de: 'Werkverzeichnis', fr: 'Portfolio', en: 'Portfolio', tr: 'Eser listesi', ku: 'Lîsteya karan' },
  'projects.label': { de: 'Projekte', fr: 'Projets', en: 'Projects', tr: 'Projeler', ku: 'Proje' },
  'projects.title': {
    de: 'Ein Werk-<br /><em>verzeichnis</em>.',
    fr: 'Un <em>portfolio</em><br />de travaux.',
    en: 'A body of<br /><em>work</em>.',
    tr: 'Bir eser<br /><em>arşivi</em>.',
    ku: 'Arşîvek<br /><em>karan</em>.',
  },
  'projects.subtitle': {
    de: 'Eine kuratierte Auswahl meiner Arbeiten — von Full-Stack Web-Apps über Enterprise-Systeme bis hin zu KI-gestützter Automatisierung.',
    fr: 'Une sélection de mes travaux — des applications web full-stack aux systèmes d’entreprise et à l’automatisation par IA.',
    en: 'A curated selection of my work — from full-stack web apps to enterprise systems and AI-powered automation.',
    tr: 'Çalışmalarımdan seçilmiş bir derleme — full-stack web uygulamalarından kurumsal sistemlere ve yapay zekâ destekli otomasyona.',
    ku: 'Hilbijartinek ji karên min — ji sepanên webê yên full-stack heta pergalên mezin û otomasyona bi AI.',
  },
  'projects.entries': { de: 'Einträge', fr: 'Entrées', en: 'Entries', tr: 'Kayıt', ku: 'Tomar' },
  'projects.case': { de: 'Fallstudie', fr: 'Étude de cas', en: 'Case study', tr: 'Vaka çalışması', ku: 'Lêkolîn' },

  // ---- Project detail ------------------------------------------------------
  'pd.back': { de: 'Zurück zum Verzeichnis', fr: 'Retour au portfolio', en: 'Back to portfolio', tr: 'Listeye dön', ku: 'Vegere lîsteyê' },
  'pd.case': { de: 'Fallstudie', fr: 'Étude de cas', en: 'Case study', tr: 'Vaka çalışması', ku: 'Lêkolîn' },
  'pd.about': { de: 'Über das Projekt', fr: 'À propos du projet', en: 'About the project', tr: 'Proje hakkında', ku: 'Derbarê projeyê' },
  'pd.highlights': { de: 'Highlights', fr: 'Points forts', en: 'Highlights', tr: 'Öne çıkanlar', ku: 'Girîng' },
  'pd.tech': { de: 'Technologie-Stack', fr: 'Stack technique', en: 'Tech stack', tr: 'Teknoloji yığını', ku: 'Stacka teknolojiyê' },
  'pd.cta.title': {
    de: 'Interesse an einer<br /><em>Zusammenarbeit?</em>',
    fr: 'Envie de<br /><em>collaborer ?</em>',
    en: 'Interested in<br /><em>working together?</em>',
    tr: 'Birlikte çalışmaya<br /><em>ne dersiniz?</em>',
    ku: 'Hûn dixwazin<br /><em>bi hev re bixebitin?</em>',
  },
  'pd.cta.text': {
    de: 'Lassen Sie uns gemeinsam Ihr nächstes Projekt zum Erfolg führen. Ich freue mich darauf, von Ihnen zu hören.',
    fr: 'Menons ensemble votre prochain projet vers le succès. J’ai hâte de vous lire.',
    en: 'Let’s make your next project a success together. I look forward to hearing from you.',
    tr: 'Bir sonraki projenizi birlikte başarıya taşıyalım. Sizden haber almayı dört gözle bekliyorum.',
    ku: 'Werin em bi hev re projeya we ya bê serketî bikin. Ez li bendê me ku ji we bibihîzim.',
  },
  'pd.nf.title': {
    de: 'Eintrag nicht<br /><em>aufgefunden</em>.',
    fr: 'Entrée<br /><em>introuvable</em>.',
    en: 'Entry not<br /><em>found</em>.',
    tr: 'Kayıt<br /><em>bulunamadı</em>.',
    ku: 'Tomar nehat<br /><em>dîtin</em>.',
  },
  'pd.nf.text': {
    de: 'Das gesuchte Werk existiert nicht im Verzeichnis. Womöglich wurde es archiviert oder neu sortiert.',
    fr: 'Le projet recherché n’existe pas dans le portfolio. Il a peut-être été archivé ou réorganisé.',
    en: 'The work you’re looking for isn’t in the portfolio. It may have been archived or reorganised.',
    tr: 'Aradığınız çalışma listede yok. Arşivlenmiş veya yeniden düzenlenmiş olabilir.',
    ku: 'Kara ku hûn lê digerin di lîsteyê de tune. Dibe ku hatibe arşîvkirin an ji nû ve hatibe rêzkirin.',
  },
  'pd.nf.cta': { de: 'Zum Werkverzeichnis', fr: 'Voir le portfolio', en: 'To the portfolio', tr: 'Eser listesine', ku: 'Bo lîsteya karan' },

  // ---- Experience ----------------------------------------------------------
  'exp.folio': { de: 'Werdegang', fr: 'Parcours', en: 'Career', tr: 'Kariyer', ku: 'Kariyer' },
  'exp.label': { de: 'Chronik', fr: 'Chronologie', en: 'Chronicle', tr: 'Kronoloji', ku: 'Kronolojî' },
  'exp.title': {
    de: 'Eine Reise in<br /><em>Etappen</em>.',
    fr: 'Un voyage par<br /><em>étapes</em>.',
    en: 'A journey in<br /><em>stages</em>.',
    tr: 'Aşamalarla<br /><em>bir yolculuk</em>.',
    ku: 'Rêwîtiyek bi<br /><em>qonaxan</em>.',
  },
  'exp.subtitle': {
    de: 'Vom neugierigen Kind in einem türkischen Dorf zum Full-Stack Developer in Freiburg — eine Geschichte von Disziplin, Leidenschaft und kontinuierlichem Wachstum.',
    fr: 'D’un enfant curieux dans un village turc à développeur full-stack à Fribourg — une histoire de discipline, de passion et de croissance continue.',
    en: 'From a curious child in a Turkish village to a full-stack developer in Freiburg — a story of discipline, passion and continuous growth.',
    tr: 'Türkiye’de bir köydeki meraklı çocuktan Freiburg’da full-stack geliştiriciye — disiplin, tutku ve sürekli gelişimin hikâyesi.',
    ku: 'Ji zarokek meraqdar li gundekî tirkî heta pêşvebirê full-stack li Freiburgê — çîrokek dîsîplîn, dildarî û mezinbûna domdar.',
  },
  'exp.docs': { de: 'Dokumente', fr: 'Documents', en: 'Documents', tr: 'Belgeler', ku: 'Belge' },
  'exp.type.work': { de: 'Berufserfahrung', fr: 'Expérience pro.', en: 'Work experience', tr: 'İş deneyimi', ku: 'Tecrûbeya kar' },
  'exp.type.education': { de: 'Ausbildung', fr: 'Formation', en: 'Education', tr: 'Eğitim', ku: 'Perwerde' },
  'exp.type.certificate': { de: 'Zertifikat', fr: 'Certificat', en: 'Certificate', tr: 'Sertifika', ku: 'Sertîfîka' },

  // ---- Resume --------------------------------------------------------------
  'resume.of': { de: 'Lebenslauf von', fr: 'CV de', en: 'Résumé of', tr: 'Özgeçmiş —', ku: 'Jînenîgariya' },
  'resume.role': {
    de: 'Full-Stack Developer · .NET · Angular · Azure',
    fr: 'Développeur full-stack · .NET · Angular · Azure',
    en: 'Full-stack developer · .NET · Angular · Azure',
    tr: 'Full-stack geliştirici · .NET · Angular · Azure',
    ku: 'Pêşvebirê full-stack · .NET · Angular · Azure',
  },
  'resume.meta.date': { de: 'Stand', fr: 'Au', en: 'As of', tr: 'Tarih', ku: 'Roj' },
  'resume.meta.format': { de: 'Format', fr: 'Format', en: 'Format', tr: 'Biçim', ku: 'Format' },
  'resume.meta.lang': { de: 'Sprache', fr: 'Langue', en: 'Language', tr: 'Dil', ku: 'Ziman' },
  'resume.meta.langval': { de: 'Deutsch', fr: 'Allemand', en: 'German', tr: 'Almanca', ku: 'Almanî' },
  'resume.meta.place': { de: 'Ort', fr: 'Lieu', en: 'Location', tr: 'Konum', ku: 'Cî' },
  'resume.download': { de: 'PDF herunterladen', fr: 'Télécharger le PDF', en: 'Download PDF', tr: 'PDF indir', ku: 'PDF dakêşe' },
  'resume.newtab': { de: 'In neuem Tab öffnen', fr: 'Ouvrir dans un onglet', en: 'Open in new tab', tr: 'Yeni sekmede aç', ku: 'Di tabek nû de veke' },
  'resume.preview.label': { de: 'Vorschau', fr: 'Aperçu', en: 'Preview', tr: 'Önizleme', ku: 'Pêşdîtin' },
  'resume.preview.title': {
    de: 'Online <em>lesen</em>.', fr: 'Lire <em>en ligne</em>.', en: 'Read <em>online</em>.', tr: '<em>Çevrimiçi</em> oku.', ku: 'Bi <em>serhêl</em> bixwîne.',
  },
  'resume.fallback': {
    de: 'Falls die Vorschau nicht angezeigt wird:',
    fr: 'Si l’aperçu ne s’affiche pas :',
    en: 'If the preview doesn’t show:',
    tr: 'Önizleme görünmüyorsa:',
    ku: 'Eger pêşdîtin xuya nake:',
  },
  'resume.direct': { de: 'Direkt öffnen →', fr: 'Ouvrir directement →', en: 'Open directly →', tr: 'Doğrudan aç →', ku: 'Rasterast veke →' },
  'resume.attach.label': { de: 'Anhang', fr: 'Annexe', en: 'Attachments', tr: 'Ekler', ku: 'Pêvek' },
  'resume.attach.title': {
    de: 'Zeugnisse &amp; <em>Zertifikate</em>.', fr: 'Attestations &amp; <em>certificats</em>.', en: 'References &amp; <em>certificates</em>.', tr: 'Belgeler &amp; <em>sertifikalar</em>.', ku: 'Belge &amp; <em>sertîfîka</em>.',
  },
  'resume.attach.subtitle': {
    de: 'Alle relevanten Dokumente zum Download.',
    fr: 'Tous les documents pertinents à télécharger.',
    en: 'All relevant documents to download.',
    tr: 'İndirilebilir tüm ilgili belgeler.',
    ku: 'Hemû belgeyên girîng ji bo dakêşanê.',
  },

  // ---- Contact -------------------------------------------------------------
  'contact.folio': { de: 'Korrespondenz', fr: 'Correspondance', en: 'Correspondence', tr: 'Yazışma', ku: 'Nameyî' },
  'contact.label': { de: 'Kontakt', fr: 'Contact', en: 'Contact', tr: 'İletişim', ku: 'Têkilî' },
  'contact.title': {
    de: 'Lassen Sie uns<br /><em>zusammenarbeiten</em>.',
    fr: '<em>Travaillons</em><br />ensemble.',
    en: 'Let’s <em>work</em><br />together.',
    tr: 'Hadi birlikte<br /><em>çalışalım</em>.',
    ku: 'Werin bi hev re<br /><em>bixebitin</em>.',
  },
  'contact.subtitle': {
    de: 'Vielen Dank für Ihr Interesse. Ob neues Projekt, spannende Zusammenarbeit oder einfach ein fachlicher Austausch — ich freue mich, von Ihnen zu hören.',
    fr: 'Merci de votre intérêt. Nouveau projet, collaboration ou simple échange technique — je serai ravi de vous lire.',
    en: 'Thank you for your interest. A new project, an exciting collaboration or simply a technical exchange — I’d love to hear from you.',
    tr: 'İlginiz için teşekkürler. Yeni bir proje, heyecan verici bir iş birliği ya da sadece teknik bir sohbet — sizden haber almaktan mutluluk duyarım.',
    ku: 'Spas ji bo eleqeya we. Projeyek nû, hevkariyek balkêş an tenê axaftinek teknîkî — ez ê kêfxweş bibim ku ji we bibihîzim.',
  },
  'contact.channels': { de: 'Direkte Kanäle', fr: 'Canaux directs', en: 'Direct channels', tr: 'Doğrudan kanallar', ku: 'Kanalên rasterast' },
  'contact.ch.email': { de: 'E-Mail · Bevorzugt', fr: 'E-mail · Préféré', en: 'Email · Preferred', tr: 'E-posta · Tercih edilen', ku: 'E-name · Tercîh' },
  'contact.ch.phone': { de: 'Telefon · Mobil', fr: 'Téléphone · Mobile', en: 'Phone · Mobile', tr: 'Telefon · Mobil', ku: 'Telefon · Mobîl' },
  'contact.ch.linkedin': { de: 'LinkedIn · Beruflich', fr: 'LinkedIn · Pro', en: 'LinkedIn · Professional', tr: 'LinkedIn · Profesyonel', ku: 'LinkedIn · Pîşeyî' },
  'contact.ch.github': { de: 'GitHub · Code', fr: 'GitHub · Code', en: 'GitHub · Code', tr: 'GitHub · Kod', ku: 'GitHub · Kod' },
  'contact.ch.whatsapp': { de: 'WhatsApp · Schnell', fr: 'WhatsApp · Rapide', en: 'WhatsApp · Fast', tr: 'WhatsApp · Hızlı', ku: 'WhatsApp · Bilez' },
  'contact.ch.instagram': { de: 'Instagram · Persönlich', fr: 'Instagram · Personnel', en: 'Instagram · Personal', tr: 'Instagram · Kişisel', ku: 'Instagram · Şexsî' },
  'contact.ch.website': { de: 'Website · Diese Seite', fr: 'Site · Cette page', en: 'Website · This site', tr: 'Web sitesi · Bu sayfa', ku: 'Malper · Ev rûpel' },
  'contact.post': { de: 'Postanschrift', fr: 'Adresse postale', en: 'Postal address', tr: 'Posta adresi', ku: 'Navnîşana postê' },
  'contact.langs': { de: 'Sprachen', fr: 'Langues', en: 'Languages', tr: 'Diller', ku: 'Ziman' },
  'contact.langsval': { de: 'Deutsch · Türkisch · Englisch', fr: 'Allemand · Turc · Anglais', en: 'German · Turkish · English', tr: 'Almanca · Türkçe · İngilizce', ku: 'Almanî · Tirkî · Îngilîzî' },
  'contact.status': { de: 'Status', fr: 'Statut', en: 'Status', tr: 'Durum', ku: 'Rewş' },
  'contact.statusval': { de: 'Verfügbar für Projekte', fr: 'Disponible pour des projets', en: 'Available for projects', tr: 'Projelere açık', ku: 'Ji bo projeyan berdest' },
  'contact.response': { de: 'Antwortzeit', fr: 'Délai de réponse', en: 'Response time', tr: 'Yanıt süresi', ku: 'Dema bersivê' },
  'contact.responseval': { de: '< 24 Stunden', fr: '< 24 heures', en: '< 24 hours', tr: '< 24 saat', ku: '< 24 saet' },
  'contact.closing': { de: 'Hochachtungsvoll,', fr: 'Cordialement,', en: 'Sincerely,', tr: 'Saygılarımla,', ku: 'Bi rêz,' },
  'contact.portfolio': { de: 'Werkverzeichnis', fr: 'Portfolio', en: 'Portfolio', tr: 'Eser listesi', ku: 'Lîsteya karan' },

  // ---- Leistungen page -----------------------------------------------------
  'leist.folio': { de: 'Leistungen · Freiburg', fr: 'Services · Fribourg', en: 'Services · Freiburg', tr: 'Hizmetler · Freiburg', ku: 'Xizmet · Freiburg' },
  'leist.label': { de: 'Leistungen', fr: 'Services', en: 'Services', tr: 'Hizmetler', ku: 'Xizmet' },
  'leist.title': {
    de: 'Webentwicklung,<br />die <em>gefunden wird</em>.',
    fr: 'Du développement web<br />qui <em>se fait trouver</em>.',
    en: 'Web development<br />that <em>gets found</em>.',
    tr: '<em>Bulunan</em><br />web geliştirme.',
    ku: 'Pêşxistina webê<br /> ku <em>tê dîtin</em>.',
  },
  'leist.intro': {
    de: 'Ich bin <strong>Hamza Öztürk</strong>, freiberuflicher Webentwickler aus <strong>Freiburg im Breisgau</strong>. Ich baue Websites, Online-Shops und Web-Apps, die schnell laden, gut aussehen und bei Google vorne stehen — persönlich, direkt und ohne Agentur-Aufschlag.',
    fr: 'Je suis <strong>Hamza Öztürk</strong>, développeur web indépendant à <strong>Fribourg-en-Brisgau</strong>. Je crée des sites, boutiques et applications web rapides, élégants et bien placés sur Google — en direct, sans surcoût d’agence.',
    en: 'I’m <strong>Hamza Öztürk</strong>, a freelance web developer in <strong>Freiburg, Germany</strong>. I build websites, online shops and web apps that load fast, look great and rank well on Google — personal, direct and without agency markup.',
    tr: 'Ben <strong>Hamza Öztürk</strong>, <strong>Freiburg</strong>’da serbest web geliştiriciyim. Hızlı açılan, iyi görünen ve Google’da öne çıkan web siteleri, mağazalar ve uygulamalar yapıyorum — birebir, doğrudan ve ajans zammı olmadan.',
    ku: 'Ez <strong>Hamza Öztürk</strong> me, pêşvebirê webê yê serbixwe li <strong>Freiburgê</strong>. Ez malper, firotgeh û sepanên webê ava dikim ku bilez bar dibin, xweş xuya dikin û li Google pêşî ne — şexsî, rasterast û bê zêdekirina ajansê.',
  },
  // service detail texts
  'leist.s1.text': {
    de: 'Eine individuelle Website, die zu Ihrer Marke passt — kein Baukasten von der Stange. Modern, schnell und so gebaut, dass Google und Ihre Kunden sie lieben.',
    fr: 'Un site sur mesure, à l’image de votre marque — pas un modèle générique. Moderne, rapide et conçu pour plaire à Google comme à vos clients.',
    en: 'A custom website that fits your brand — not an off-the-shelf builder. Modern, fast and built so Google and your customers love it.',
    tr: 'Markanıza uygun, size özel bir web sitesi — hazır şablon değil. Modern, hızlı ve hem Google’ın hem müşterilerinizin seveceği şekilde.',
    ku: 'Malperek taybetî ku li markaya we tê — ne şablonek amade. Nûjen, bilez û wisa hatiye çêkirin ku Google û xerîdarên we jê hez dikin.',
  },
  'leist.s1.p1': { de: 'Individuelles Design statt Template', fr: 'Design sur mesure, pas un modèle', en: 'Custom design, not a template', tr: 'Şablon değil, özel tasarım', ku: 'Dîzayna taybetî, ne şablon' },
  'leist.s1.p2': { de: 'Blitzschnell & für Mobilgeräte optimiert', fr: 'Ultra-rapide & optimisé mobile', en: 'Lightning-fast & mobile-optimised', tr: 'Çok hızlı & mobil uyumlu', ku: 'Pir bilez & ji bo mobîlê xweşkirî' },
  'leist.s1.p3': { de: 'SEO von Grund auf eingebaut', fr: 'SEO intégré dès le départ', en: 'SEO built in from the ground up', tr: 'Baştan SEO uyumlu', ku: 'SEO ji bingehê ve tê de' },
  'leist.s1.p4': { de: 'Rechtssicher (Impressum, Datenschutz, Cookies)', fr: 'Conforme (mentions légales, RGPD, cookies)', en: 'Legally compliant (imprint, privacy, cookies)', tr: 'Hukuken uyumlu (künye, gizlilik, çerez)', ku: 'Li gorî qanûnê (impressum, nepenî, cookie)' },
  'leist.s2.text': {
    de: 'Ihre Seite ist in die Jahre gekommen, lädt langsam oder lässt sich nicht pflegen? Ich modernisiere Design, Technik und Sichtbarkeit — ohne Ihre bestehenden Rankings zu verlieren.',
    fr: 'Votre site a vieilli, charge lentement ou est difficile à maintenir ? Je modernise le design, la technique et la visibilité — sans perdre votre référencement.',
    en: 'Your site has aged, loads slowly or is hard to maintain? I modernise design, technology and visibility — without losing your existing rankings.',
    tr: 'Siteniz eskidi, yavaş açılıyor ya da güncellenemiyor mu? Tasarımı, tekniği ve görünürlüğü yenilerim — mevcut sıralamanızı kaybetmeden.',
    ku: 'Malpera we kevn bûye, hêdî bar dibe an nayê parastin? Ez dîzayn, teknîk û xuyangê nû dikim — bê windakirina rêza we ya heyî.',
  },
  'leist.s2.p1': { de: 'Analyse von Tempo, Technik & Sichtbarkeit', fr: 'Analyse vitesse, technique & visibilité', en: 'Analysis of speed, tech & visibility', tr: 'Hız, teknik & görünürlük analizi', ku: 'Analîza lez, teknîk & xuyang' },
  'leist.s2.p2': { de: 'Modernes Redesign mit Ihrer Identität', fr: 'Refonte moderne fidèle à votre identité', en: 'Modern redesign with your identity', tr: 'Kimliğinizle modern yeniden tasarım', ku: 'Redîzayna nûjen bi nasnameya we' },
  'leist.s2.p3': { de: 'Sanfte Migration ohne Ranking-Verlust', fr: 'Migration en douceur sans perte SEO', en: 'Smooth migration with no ranking loss', tr: 'Sıralama kaybı olmadan sorunsuz geçiş', ku: 'Veguhastina nerm bê windakirina rêzê' },
  'leist.s2.p4': { de: 'Messbar schnellere Ladezeiten', fr: 'Temps de chargement nettement réduits', en: 'Measurably faster load times', tr: 'Ölçülebilir şekilde daha hızlı yükleme', ku: 'Demên barkirinê yên bi pîvan zûtir' },
  'leist.s3.text': {
    de: 'Wenn Standardsoftware nicht reicht: maßgeschneiderte Web-Anwendungen, Kundenportale und Geschäftsprozesse — sauber architektiert mit Angular, .NET und der Azure Cloud.',
    fr: 'Quand les logiciels standards ne suffisent pas : applications web, portails clients et processus métier sur mesure — proprement architecturés avec Angular, .NET et Azure.',
    en: 'When off-the-shelf software falls short: tailor-made web applications, customer portals and business processes — cleanly architected with Angular, .NET and Azure.',
    tr: 'Hazır yazılım yetmediğinde: size özel web uygulamaları, müşteri portalları ve iş süreçleri — Angular, .NET ve Azure ile temiz mimaride.',
    ku: 'Gava nermalava standard têra nake: sepanên webê yên taybetî, portalên xerîdaran û pêvajoyên karsaziyê — bi Angular, .NET û Azure bi paqijî hatine avakirin.',
  },
  'leist.s3.p1': { de: 'Kundenportale & interne Tools', fr: 'Portails clients & outils internes', en: 'Customer portals & internal tools', tr: 'Müşteri portalları & dahili araçlar', ku: 'Portalên xerîdaran & amûrên hundirîn' },
  'leist.s3.p2': { de: 'Schnittstellen (APIs) zu Ihren Systemen', fr: 'Interfaces (API) vers vos systèmes', en: 'Interfaces (APIs) to your systems', tr: 'Sistemlerinize arayüzler (API)', ku: 'Navrûyên (API) bi pergalên we' },
  'leist.s3.p3': { de: 'Saubere, wartbare Clean Architecture', fr: 'Clean Architecture propre et maintenable', en: 'Clean, maintainable architecture', tr: 'Temiz, sürdürülebilir mimari', ku: 'Avahiyek paqij û domdar' },
  'leist.s3.p4': { de: 'Skalierbar in der Cloud (Azure)', fr: 'Évolutif dans le cloud (Azure)', en: 'Scalable in the cloud (Azure)', tr: 'Bulutta ölçeklenebilir (Azure)', ku: 'Di ewr de berfireh (Azure)' },
  'leist.s4.text': {
    de: 'Verkaufen Sie online — mit einem Shop, der schnell ist, Vertrauen schafft und sich leicht verwalten lässt. Inklusive Zahlungsanbindung und mehrsprachigem Auftritt.',
    fr: 'Vendez en ligne — avec une boutique rapide, rassurante et facile à gérer. Paiement intégré et site multilingue inclus.',
    en: 'Sell online — with a shop that’s fast, builds trust and is easy to manage. Payment integration and a multilingual presence included.',
    tr: 'Online satış yapın — hızlı, güven veren ve yönetimi kolay bir mağazayla. Ödeme entegrasyonu ve çok dilli yapı dahil.',
    ku: 'Bi serhêl bifroşe — bi firotgehek ku bilez e, baweriyê çêdike û rêvebirina wê hêsan e. Girêdana dravdanê û pirzimanî tê de.',
  },
  'leist.s4.p1': { de: 'Produkt- & Bestandsverwaltung', fr: 'Gestion produits & stock', en: 'Product & inventory management', tr: 'Ürün & stok yönetimi', ku: 'Rêveberiya hilber & stok' },
  'leist.s4.p2': { de: 'Sichere Zahlungsanbindung', fr: 'Paiement sécurisé', en: 'Secure payment integration', tr: 'Güvenli ödeme entegrasyonu', ku: 'Girêdana dravdanê ya ewle' },
  'leist.s4.p3': { de: 'Mehrsprachig (DE / EN / FR / TR)', fr: 'Multilingue (DE / EN / FR / TR)', en: 'Multilingual (DE / EN / FR / TR)', tr: 'Çok dilli (DE / EN / FR / TR)', ku: 'Pirzimanî (DE / EN / FR / TR)' },
  'leist.s4.p4': { de: 'Optimiert für Conversion & SEO', fr: 'Optimisé conversion & SEO', en: 'Optimised for conversion & SEO', tr: 'Dönüşüm & SEO için optimize', ku: 'Ji bo veguherîn & SEO xweşkirî' },
  // why
  'leist.why.label': { de: 'Warum ich', fr: 'Pourquoi moi', en: 'Why me', tr: 'Neden ben', ku: 'Çima ez' },
  'leist.why.title': {
    de: 'Was Sie von mir<br /><em>erwarten können</em>.',
    fr: 'Ce que vous pouvez<br /><em>attendre de moi</em>.',
    en: 'What you can<br /><em>expect from me</em>.',
    tr: 'Benden<br /><em>bekleyebilecekleriniz</em>.',
    ku: 'Tiştên ku hûn ji min<br /><em>hêvî dikin</em>.',
  },
  'leist.why1.t': { de: '🤝 Direkt & persönlich', fr: '🤝 Direct & personnel', en: '🤝 Direct & personal', tr: '🤝 Doğrudan & kişisel', ku: '🤝 Rasterast & şexsî' },
  'leist.why1.d': {
    de: 'Sie sprechen immer mit mir — nicht mit einem Callcenter. Kurze Wege, schnelle Antworten.',
    fr: 'Vous échangez toujours avec moi — pas un centre d’appels. Circuits courts, réponses rapides.',
    en: 'You always talk to me — not a call centre. Short paths, fast answers.',
    tr: 'Her zaman benimle konuşursunuz — çağrı merkeziyle değil. Kısa yollar, hızlı yanıtlar.',
    ku: 'Hûn herdem bi min re diaxivin — ne bi navendek bangan. Rêyên kurt, bersivên bilez.',
  },
  'leist.why2.t': { de: '📍 Aus Freiburg', fr: '📍 Depuis Fribourg', en: '📍 From Freiburg', tr: '📍 Freiburg’dan', ku: '📍 Ji Freiburgê' },
  'leist.why2.d': {
    de: 'Lokal verankert in der Region. Auf Wunsch treffen wir uns persönlich auf einen Kaffee.',
    fr: 'Ancré dans la région. Sur demande, on se voit autour d’un café.',
    en: 'Locally rooted in the region. On request we meet in person over a coffee.',
    tr: 'Bölgede yerel olarak köklü. İsterseniz bir kahve eşliğinde yüz yüze görüşürüz.',
    ku: 'Bi awayekî herêmî di herêmê de bi rehên xwe. Li ser daxwazê em rûbirû li ser qehweyekê hev dibînin.',
  },
  'leist.why3.t': { de: '⚡ Moderne Technik', fr: '⚡ Technologie moderne', en: '⚡ Modern technology', tr: '⚡ Modern teknoloji', ku: '⚡ Teknolojiya nûjen' },
  'leist.why3.d': {
    de: 'Aktueller Stack (Angular, .NET, Next.js), Server-Side-Rendering und Top-Ladezeiten.',
    fr: 'Stack actuel (Angular, .NET, Next.js), rendu côté serveur et temps de chargement au top.',
    en: 'Current stack (Angular, .NET, Next.js), server-side rendering and top load times.',
    tr: 'Güncel stack (Angular, .NET, Next.js), sunucu taraflı render ve üst düzey yükleme süreleri.',
    ku: 'Stacka heyî (Angular, .NET, Next.js), renderkirina aliyê serverê û demên barkirinê yên herî baş.',
  },
  'leist.why4.t': { de: '🔍 SEO inklusive', fr: '🔍 SEO inclus', en: '🔍 SEO included', tr: '🔍 SEO dahil', ku: '🔍 SEO tê de' },
  'leist.why4.d': {
    de: 'Suchmaschinenoptimierung ist eingebaut, kein teures Extra. Damit Sie gefunden werden.',
    fr: 'Le référencement est intégré, pas une option coûteuse. Pour être trouvé.',
    en: 'Search engine optimisation is built in, not a costly extra. So you get found.',
    tr: 'Arama motoru optimizasyonu dahildir, pahalı bir ek değil. Bulunmanız için.',
    ku: 'Xweşkirina motora lêgerînê tê de ye, ne zêdeyek biha. Da ku hûn werin dîtin.',
  },
  'leist.why5.t': { de: '💶 Transparenter Festpreis', fr: '💶 Prix fixe transparent', en: '💶 Transparent fixed price', tr: '💶 Şeffaf sabit fiyat', ku: '💶 Bihayê sabît ê zelal' },
  'leist.why5.d': {
    de: 'Klares Angebot vor Projektstart. Keine versteckten Kosten, keine Überraschungen.',
    fr: 'Devis clair avant le démarrage. Aucun coût caché, aucune surprise.',
    en: 'A clear quote before the project starts. No hidden costs, no surprises.',
    tr: 'Proje başlamadan net teklif. Gizli maliyet yok, sürpriz yok.',
    ku: 'Pêşniyarek zelal berî destpêka projeyê. Ti lêçûnên veşartî, ti sosret tune.',
  },
  'leist.why6.t': { de: '🛠️ Betreuung danach', fr: '🛠️ Suivi après-projet', en: '🛠️ Ongoing support', tr: '🛠️ Sonrasında destek', ku: '🛠️ Piştgiriya piştî' },
  'leist.why6.d': {
    de: 'Auch nach dem Launch bin ich für Updates, Hosting und Weiterentwicklung da.',
    fr: 'Après la mise en ligne aussi, je gère mises à jour, hébergement et évolutions.',
    en: 'After launch too, I’m there for updates, hosting and further development.',
    tr: 'Lansman sonrası da güncelleme, barındırma ve geliştirme için yanınızdayım.',
    ku: 'Piştî destpêkê jî ez ji bo nûkirin, hosting û pêşxistinê amade me.',
  },
  // process
  'leist.proc.label': { de: 'Ablauf', fr: 'Déroulé', en: 'Process', tr: 'Süreç', ku: 'Pêvajo' },
  'leist.proc.title': {
    de: 'So arbeiten wir<br /><em>zusammen</em>.',
    fr: 'Comment nous<br /><em>travaillons</em>.',
    en: 'How we<br /><em>work together</em>.',
    tr: 'Birlikte nasıl<br /><em>çalışırız</em>.',
    ku: 'Em çawa bi hev re<br /><em>dixebitin</em>.',
  },
  'leist.p1.t': { de: 'Erstgespräch', fr: 'Premier échange', en: 'First conversation', tr: 'İlk görüşme', ku: 'Axaftina yekem' },
  'leist.p1.d': {
    de: 'Wir sprechen unverbindlich über Ihr Vorhaben, Ihre Ziele und Ihr Budget. Kostenlos und ohne Verpflichtung.',
    fr: 'Nous parlons librement de votre projet, vos objectifs et votre budget. Gratuit et sans engagement.',
    en: 'We talk freely about your plan, your goals and your budget. Free and without obligation.',
    tr: 'Projenizi, hedeflerinizi ve bütçenizi serbestçe konuşuruz. Ücretsiz ve bağlayıcı değil.',
    ku: 'Em bê mecbûrî li ser plana we, armancên we û budceya we diaxivin. Belaş û bê erk.',
  },
  'leist.p2.t': { de: 'Konzept & Angebot', fr: 'Concept & devis', en: 'Concept & quote', tr: 'Konsept & teklif', ku: 'Konsept & pêşniyar' },
  'leist.p2.d': {
    de: 'Sie erhalten ein klares Konzept und ein transparentes Festpreis-Angebot — keine versteckten Kosten.',
    fr: 'Vous recevez un concept clair et un devis à prix fixe transparent — sans coûts cachés.',
    en: 'You get a clear concept and a transparent fixed-price quote — no hidden costs.',
    tr: 'Net bir konsept ve şeffaf bir sabit fiyat teklifi alırsınız — gizli maliyet yok.',
    ku: 'Hûn konseptek zelal û pêşniyarek bihayê sabît ê zelal werdigirin — bê lêçûnên veşartî.',
  },
  'leist.p3.t': { de: 'Design & Entwicklung', fr: 'Design & développement', en: 'Design & development', tr: 'Tasarım & geliştirme', ku: 'Dîzayn & pêşxistin' },
  'leist.p3.d': {
    de: 'Ich setze Ihr Projekt um und halte Sie mit regelmäßigen Vorschauen auf dem Laufenden. Ihr Feedback fließt direkt ein.',
    fr: 'Je réalise votre projet et vous tiens informé par des aperçus réguliers. Vos retours sont intégrés directement.',
    en: 'I build your project and keep you posted with regular previews. Your feedback flows in directly.',
    tr: 'Projenizi hayata geçirir, düzenli önizlemelerle sizi bilgilendiririm. Geri bildiriminiz doğrudan işlenir.',
    ku: 'Ez projeya we pêk tînim û bi pêşdîtinên birêkûpêk we agahdar dikim. Nêrîna we rasterast tê de tê.',
  },
  'leist.p4.t': { de: 'Launch & Betreuung', fr: 'Mise en ligne & suivi', en: 'Launch & support', tr: 'Lansman & destek', ku: 'Destpêk & piştgirî' },
  'leist.p4.d': {
    de: 'Wir gehen gemeinsam online. Auf Wunsch betreue ich Ihre Seite auch danach — Updates, Hosting und Weiterentwicklung.',
    fr: 'Nous mettons en ligne ensemble. Sur demande, je gère ensuite votre site — mises à jour, hébergement et évolutions.',
    en: 'We go live together. On request I look after your site afterwards too — updates, hosting and further development.',
    tr: 'Birlikte yayına alırız. İsterseniz sonrasında da sitenizi yönetirim — güncelleme, barındırma ve geliştirme.',
    ku: 'Em bi hev re zindî dibin. Li ser daxwazê ez piştre jî malpera we diparêzim — nûkirin, hosting û pêşxistin.',
  },
  // faq
  'leist.faq.label': { de: 'Häufige Fragen', fr: 'Questions fréquentes', en: 'FAQ', tr: 'Sık sorulanlar', ku: 'Pirsên pir' },
  'leist.faq.title': {
    de: 'Gut zu<br /><em>wissen</em>.', fr: 'Bon à<br /><em>savoir</em>.', en: 'Good to<br /><em>know</em>.', tr: 'Bilinmesi<br /><em>gerekenler</em>.', ku: 'Baş e ku<br /><em>bê zanîn</em>.',
  },
  'leist.faq1.q': {
    de: 'Was kostet eine Website in Freiburg?',
    fr: 'Combien coûte un site web à Fribourg ?',
    en: 'What does a website cost in Freiburg?',
    tr: 'Freiburg’da bir web sitesi ne kadar?',
    ku: 'Malperek li Freiburgê çiqas bi buha ye?',
  },
  'leist.faq1.a': {
    de: 'Das hängt vom Umfang ab. Eine moderne One-Page-Website beginnt im niedrigen vierstelligen Bereich, umfangreiche Web-Apps oder Shops entsprechend mehr. Sie erhalten immer ein transparentes Festpreis-Angebot vor Projektstart.',
    fr: 'Cela dépend de l’ampleur. Un site one-page moderne démarre dans le bas de la fourchette à quatre chiffres ; les applications ou boutiques plus complexes coûtent davantage. Vous recevez toujours un devis à prix fixe transparent avant le début.',
    en: 'It depends on the scope. A modern one-page site starts in the low four figures; larger web apps or shops cost more accordingly. You always get a transparent fixed-price quote before the project starts.',
    tr: 'Kapsama bağlıdır. Modern bir tek sayfalık site dört haneli rakamların alt sınırında başlar; kapsamlı uygulamalar ya da mağazalar daha fazladır. Proje başlamadan her zaman şeffaf bir sabit fiyat teklifi alırsınız.',
    ku: 'Ev bi mezinahiyê ve girêdayî ye. Malperek yek-rûpelî ya nûjen di asta çar-reqemî ya nizm de dest pê dike; sepan an firotgehên mezintir bêtir in. Hûn herdem berî destpêkê pêşniyarek bihayê sabît a zelal werdigirin.',
  },
  'leist.faq2.q': {
    de: 'Wie lange dauert die Erstellung einer Website?',
    fr: 'Combien de temps pour créer un site ?',
    en: 'How long does building a website take?',
    tr: 'Bir web sitesi yapımı ne kadar sürer?',
    ku: 'Çêkirina malperekê çiqas dem digire?',
  },
  'leist.faq2.a': {
    de: 'Eine klassische Unternehmenswebsite ist in der Regel in 2–4 Wochen fertig. Größere Projekte wie Web-Apps oder Online-Shops planen wir individuell.',
    fr: 'Un site vitrine classique est généralement prêt en 2 à 4 semaines. Les projets plus grands (applications, boutiques) sont planifiés sur mesure.',
    en: 'A classic business website is usually ready in 2–4 weeks. Larger projects such as web apps or online shops are planned individually.',
    tr: 'Klasik bir kurumsal site genellikle 2–4 haftada hazır olur. Web uygulaması veya mağaza gibi büyük projeleri ayrıca planlarız.',
    ku: 'Malperek karsaziyê ya klasîk bi gelemperî di 2–4 hefteyan de amade dibe. Projeyên mezintir wek sepan an firotgeh em bi taybetî plan dikin.',
  },
  'leist.faq3.q': {
    de: 'Arbeiten Sie nur in Freiburg?',
    fr: 'Travaillez-vous uniquement à Fribourg ?',
    en: 'Do you only work in Freiburg?',
    tr: 'Sadece Freiburg’da mı çalışıyorsunuz?',
    ku: 'Hûn tenê li Freiburgê dixebitin?',
  },
  'leist.faq3.a': {
    de: 'Mein Sitz ist in Freiburg im Breisgau und ich arbeite gern persönlich mit Kunden aus der Region. Remote betreue ich aber Auftraggeber in ganz Deutschland und darüber hinaus.',
    fr: 'Je suis basé à Fribourg-en-Brisgau et j’aime travailler en personne avec les clients de la région. Mais j’accompagne aussi des clients à distance dans toute l’Allemagne et au-delà.',
    en: 'I’m based in Freiburg and enjoy working in person with clients from the region. But I also serve clients remotely across Germany and beyond.',
    tr: 'Merkezim Freiburg’da ve bölgedeki müşterilerle yüz yüze çalışmayı severim. Ancak uzaktan tüm Almanya’da ve ötesinde de hizmet veriyorum.',
    ku: 'Navenda min li Freiburgê ye û ez hez dikim ku bi xerîdarên herêmê re rûbirû bixebitim. Lê ez ji dûr ve jî li seranserê Almanyayê û jê wêdetir xizmetê dikim.',
  },
  'leist.faq4.q': {
    de: 'Kümmern Sie sich auch um SEO und Auffindbarkeit?',
    fr: 'Vous occupez-vous aussi du SEO et de la visibilité ?',
    en: 'Do you also handle SEO and findability?',
    tr: 'SEO ve bulunabilirlikle de ilgileniyor musunuz?',
    ku: 'Hûn bi SEO û dîtbariyê re jî mijûl dibin?',
  },
  'leist.faq4.a': {
    de: 'Ja. Suchmaschinenoptimierung ist bei mir kein teures Extra, sondern von Anfang an eingebaut: schnelle Ladezeiten, sauberes HTML, strukturierte Daten und lokale SEO für Freiburg.',
    fr: 'Oui. Le SEO n’est pas une option coûteuse chez moi, mais intégré dès le départ : temps de chargement rapides, HTML propre, données structurées et SEO local pour Fribourg.',
    en: 'Yes. SEO isn’t a costly extra with me — it’s built in from the start: fast load times, clean HTML, structured data and local SEO for Freiburg.',
    tr: 'Evet. Bende SEO pahalı bir ek değil, baştan dahildir: hızlı yükleme, temiz HTML, yapılandırılmış veri ve Freiburg için yerel SEO.',
    ku: 'Erê. Li cem min SEO zêdeyek biha nine, ji destpêkê ve tê de ye: demên barkirinê yên bilez, HTMLek paqij, daneyên strukturkirî û SEO ya herêmî ji bo Freiburgê.',
  },
  'leist.faq5.q': {
    de: 'Kann ich meine Inhalte später selbst pflegen?',
    fr: 'Puis-je gérer mes contenus moi-même ensuite ?',
    en: 'Can I maintain my content myself later?',
    tr: 'İçeriğimi sonradan kendim güncelleyebilir miyim?',
    ku: 'Ez dikarim naveroka xwe paşê bi xwe biparêzim?',
  },
  'leist.faq5.a': {
    de: 'Auf Wunsch binde ich ein einfaches Redaktionssystem (CMS) ein, mit dem Sie Texte, Bilder und Inhalte selbst aktualisieren können — ganz ohne Programmierkenntnisse.',
    fr: 'Sur demande, j’intègre un système de gestion de contenu (CMS) simple qui vous permet de mettre à jour textes, images et contenus vous-même — sans aucune compétence technique.',
    en: 'On request I integrate a simple content management system (CMS) so you can update texts, images and content yourself — no coding knowledge needed.',
    tr: 'İsterseniz, metin, görsel ve içerikleri kendiniz güncelleyebileceğiniz basit bir içerik yönetim sistemi (CMS) entegre ederim — programlama bilgisi gerekmez.',
    ku: 'Li ser daxwazê ez pergalek rêveberiya naverokê (CMS) ya hêsan tê de dikim ku hûn dikarin nivîs, wêne û naverokê bi xwe nû bikin — bê zanîna kodkirinê.',
  },
  // cta
  'leist.cta.title': {
    de: 'Lassen Sie uns Ihr Projekt<br /><em>besprechen.</em>',
    fr: 'Discutons de<br /><em>votre projet.</em>',
    en: 'Let’s discuss<br /><em>your project.</em>',
    tr: 'Projenizi<br /><em>konuşalım.</em>',
    ku: 'Werin em projeya we<br /><em>biaxivin.</em>',
  },
  'leist.cta.text': {
    de: 'Kostenloses, unverbindliches Erstgespräch — schildern Sie mir einfach Ihr Vorhaben.',
    fr: 'Premier échange gratuit et sans engagement — décrivez-moi simplement votre projet.',
    en: 'Free, no-obligation first conversation — just tell me about your plan.',
    tr: 'Ücretsiz, bağlayıcı olmayan ilk görüşme — bana planınızı anlatmanız yeterli.',
    ku: 'Axaftina yekem a belaş û bê mecbûrî — tenê plana xwe ji min re vebêje.',
  },
  'leist.cta.btn': { de: 'Jetzt anfragen', fr: 'Demander maintenant', en: 'Get in touch now', tr: 'Şimdi iletişime geç', ku: 'Niha têkilî daîne' },

  // ---- SEO meta (per page, per locale) -------------------------------------
  'seo.home.title': {
    de: 'Webentwickler Freiburg — Websites, Web-Apps & Software | Hamza Öztürk',
    fr: 'Développeur web Freiburg — Sites, applications & logiciels | Hamza Öztürk',
    en: 'Web Developer Freiburg — Websites, Web Apps & Software | Hamza Öztürk',
    tr: 'Web Geliştirici Freiburg — Web Siteleri, Uygulamalar & Yazılım | Hamza Öztürk',
    ku: 'Pêşvebirê Webê Freiburg — Malper, Sepan & Nermalav | Hamza Öztürk',
  },
  'seo.home.desc': {
    de: 'Freiberuflicher Webentwickler aus Freiburg. Moderne, schnelle und SEO-optimierte Websites, Online-Shops und Web-Apps — von der Idee bis zum Launch. Jetzt unverbindlich anfragen.',
    fr: 'Développeur web indépendant à Fribourg. Sites, boutiques et applications web modernes, rapides et optimisés SEO — de l’idée au lancement. Demande gratuite.',
    en: 'Freelance web developer in Freiburg. Modern, fast, SEO-optimised websites, online shops and web apps — from idea to launch. Request a free quote.',
    tr: 'Freiburg’da serbest web geliştirici. Modern, hızlı ve SEO uyumlu web siteleri, mağazalar ve uygulamalar — fikirden lansmana. Ücretsiz teklif alın.',
    ku: 'Pêşvebirê webê yê serbixwe li Freiburgê. Malper, firotgeh û sepanên webê yên nûjen, bilez û ji bo SEO xweşkirî — ji ramanê heta destpêkê. Daxwaza belaş.',
  },
  'seo.leist.title': {
    de: 'Leistungen — Webentwicklung & Webdesign in Freiburg | Hamza Öztürk',
    fr: 'Services — Développement & design web à Fribourg | Hamza Öztürk',
    en: 'Services — Web Development & Design in Freiburg | Hamza Öztürk',
    tr: 'Hizmetler — Freiburg’da Web Geliştirme & Tasarım | Hamza Öztürk',
    ku: 'Xizmet — Pêşxistin & Dîzayna Webê li Freiburgê | Hamza Öztürk',
  },
  'seo.leist.desc': {
    de: 'Webseite erstellen lassen in Freiburg: neue Websites, Relaunch, Online-Shops und Web-Apps. Transparenter Festpreis, SEO inklusive. Jetzt anfragen.',
    fr: 'Faire créer un site web à Fribourg : nouveaux sites, refonte, boutiques et applications. Prix fixe transparent, SEO inclus. Demandez maintenant.',
    en: 'Have a website built in Freiburg: new sites, relaunch, online shops and web apps. Transparent fixed price, SEO included. Get in touch now.',
    tr: 'Freiburg’da web sitesi yaptırın: yeni siteler, yenileme, mağazalar ve uygulamalar. Şeffaf sabit fiyat, SEO dahil. Hemen iletişime geçin.',
    ku: 'Li Freiburgê malperek çêbike: malperên nû, nûkirin, firotgeh û sepan. Bihayê sabît ê zelal, SEO tê de. Niha têkilî daîne.',
  },
  'seo.projects.title': {
    de: 'Projekte & Referenzen — Webentwicklung Freiburg | Hamza Öztürk',
    fr: 'Projets & références — Développement web Fribourg | Hamza Öztürk',
    en: 'Projects & References — Web Development Freiburg | Hamza Öztürk',
    tr: 'Projeler & Referanslar — Web Geliştirme Freiburg | Hamza Öztürk',
    ku: 'Proje & Referans — Pêşxistina Webê Freiburg | Hamza Öztürk',
  },
  'seo.projects.desc': {
    de: 'Ausgewählte Projekte: Web-Apps, Online-Shops, Websites und Software aus Freiburg. Live-Demos von Bikehaus, Benlirad, Zerin Gold u. v. m.',
    fr: 'Projets sélectionnés : applications, boutiques, sites et logiciels depuis Fribourg. Démos live de Bikehaus, Benlirad, Zerin Gold, etc.',
    en: 'Selected projects: web apps, online shops, websites and software from Freiburg. Live demos of Bikehaus, Benlirad, Zerin Gold and more.',
    tr: 'Seçilmiş projeler: Freiburg’dan web uygulamaları, mağazalar, siteler ve yazılım. Bikehaus, Benlirad, Zerin Gold ve daha fazlasının canlı demoları.',
    ku: 'Projeyên hilbijartî: sepan, firotgeh, malper û nermalav ji Freiburgê. Demoyên zindî yên Bikehaus, Benlirad, Zerin Gold û hwd.',
  },
  'seo.exp.title': {
    de: 'Werdegang & Erfahrung — Hamza Öztürk, Webentwickler Freiburg',
    fr: 'Parcours & expérience — Hamza Öztürk, développeur web Fribourg',
    en: 'Career & Experience — Hamza Öztürk, Web Developer Freiburg',
    tr: 'Kariyer & Deneyim — Hamza Öztürk, Web Geliştirici Freiburg',
    ku: 'Kariyer & Tecrûbe — Hamza Öztürk, Pêşvebirê Webê Freiburg',
  },
  'seo.exp.desc': {
    de: 'Der Werdegang von Hamza Öztürk: Full-Stack Entwickler bei Dicom GmbH, Studium an der TU Istanbul, Data-Analytics-Zertifikat.',
    fr: 'Le parcours de Hamza Öztürk : développeur full-stack chez Dicom GmbH, études à l’université technique d’Istanbul, certificat en data analytics.',
    en: 'The career of Hamza Öztürk: full-stack developer at Dicom GmbH, studies at Istanbul Technical University, data analytics certificate.',
    tr: 'Hamza Öztürk’ün kariyeri: Dicom GmbH’de full-stack geliştirici, İstanbul Teknik Üniversitesi eğitimi, veri analitiği sertifikası.',
    ku: 'Kariyera Hamza Öztürk: pêşvebirê full-stack li Dicom GmbH, xwendin li Zanîngeha Teknîkî ya Stenbolê, sertîfîkaya analîtîka daneyan.',
  },
  'seo.contact.title': {
    de: 'Kontakt — Webentwickler in Freiburg beauftragen | Hamza Öztürk',
    fr: 'Contact — Engager un développeur web à Fribourg | Hamza Öztürk',
    en: 'Contact — Hire a Web Developer in Freiburg | Hamza Öztürk',
    tr: 'İletişim — Freiburg’da Web Geliştirici Tutun | Hamza Öztürk',
    ku: 'Têkilî — Pêşvebirê Webê li Freiburgê bigire | Hamza Öztürk',
  },
  'seo.contact.desc': {
    de: 'Sie suchen einen Webentwickler in Freiburg? Lassen Sie uns über Ihre Website, Ihren Online-Shop oder Ihre Web-App sprechen. Kostenloses Erstgespräch.',
    fr: 'Vous cherchez un développeur web à Fribourg ? Parlons de votre site, boutique ou application. Premier échange gratuit.',
    en: 'Looking for a web developer in Freiburg? Let’s talk about your website, online shop or web app. Free first conversation.',
    tr: 'Freiburg’da web geliştirici mi arıyorsunuz? Web sitenizi, mağazanızı veya uygulamanızı konuşalım. Ücretsiz ilk görüşme.',
    ku: 'Li Freiburgê li pêşvebirê webê digerin? Werin em li ser malper, firotgeh an sepana we biaxivin. Axaftina yekem belaş.',
  },
  'seo.resume.title': {
    de: 'Lebenslauf — Hamza Öztürk, Full-Stack Entwickler Freiburg',
    fr: 'CV — Hamza Öztürk, développeur full-stack Fribourg',
    en: 'Résumé — Hamza Öztürk, Full-Stack Developer Freiburg',
    tr: 'Özgeçmiş — Hamza Öztürk, Full-Stack Geliştirici Freiburg',
    ku: 'Jînenîgarî — Hamza Öztürk, Pêşvebirê Full-Stack Freiburg',
  },
  'seo.resume.desc': {
    de: 'Lebenslauf von Hamza Öztürk: Full-Stack Entwickler (IHK) aus Freiburg. Erfahrung mit C#/.NET, Angular, React und Azure Cloud. Als PDF.',
    fr: 'CV de Hamza Öztürk : développeur full-stack à Fribourg. Expérience en C#/.NET, Angular, React et Azure. En PDF.',
    en: 'Résumé of Hamza Öztürk: full-stack developer from Freiburg. Experience with C#/.NET, Angular, React and Azure Cloud. As PDF.',
    tr: 'Hamza Öztürk’ün özgeçmişi: Freiburg’dan full-stack geliştirici. C#/.NET, Angular, React ve Azure deneyimi. PDF olarak.',
    ku: 'Jînenîgariya Hamza Öztürk: pêşvebirê full-stack ji Freiburgê. Tecrûbe bi C#/.NET, Angular, React û Azure. Wek PDF.',
  },

  // ---- Home: About prose (innerHTML, dropcap baked in) ---------------------
  'home.about.lead': {
    de: '<span class="dropcap">M</span>ein Name ist Hamza Öztürk. Ich bin Full-Stack Developer aus Freiburg im Breisgau und arbeite am liebsten dort, wo <em>Architektur</em>, <em>Design</em> und <em>Engineering</em> aufeinandertreffen.',
    fr: '<span class="dropcap">J</span>e m’appelle Hamza Öztürk. Développeur full-stack à Fribourg-en-Brisgau, j’aime travailler là où <em>architecture</em>, <em>design</em> et <em>ingénierie</em> se rencontrent.',
    en: '<span class="dropcap">M</span>y name is Hamza Öztürk. I’m a full-stack developer from Freiburg, Germany, and I love working where <em>architecture</em>, <em>design</em> and <em>engineering</em> meet.',
    tr: '<span class="dropcap">A</span>dım Hamza Öztürk. Freiburg’da full-stack geliştiriciyim ve en çok <em>mimari</em>, <em>tasarım</em> ve <em>mühendisliğin</em> buluştuğu yerde çalışmayı severim.',
    ku: '<span class="dropcap">N</span>avê min Hamza Öztürk e. Ez pêşvebirê full-stack im ji Freiburgê û ji xebata li wir ku <em>avahîsazî</em>, <em>dîzayn</em> û <em>endezyarî</em> li hev dicivin hez dikim.',
  },
  'home.about.p2': {
    de: 'In den letzten Jahren habe ich Legacy-Desktop-ERP-Systeme in moderne webbasierte Lösungen überführt, Cloud-Infrastrukturen auf Azure aufgebaut und CI/CD-Pipelines etabliert, die Deployment-Zeiten um über 40 % verkürzt haben.',
    fr: 'Ces dernières années, j’ai migré des systèmes ERP de bureau hérités vers des solutions web modernes, bâti des infrastructures cloud sur Azure et mis en place des pipelines CI/CD réduisant les temps de déploiement de plus de 40 %.',
    en: 'In recent years I’ve migrated legacy desktop ERP systems to modern web-based solutions, built cloud infrastructure on Azure and set up CI/CD pipelines that cut deployment times by over 40%.',
    tr: 'Son yıllarda eski masaüstü ERP sistemlerini modern web tabanlı çözümlere taşıdım, Azure’da bulut altyapıları kurdum ve dağıtım sürelerini %40’tan fazla kısaltan CI/CD hatları oluşturdum.',
    ku: 'Di salên dawî de min pergalên ERP yên kevn ên sermasîyê veguhastin çareseriyên webî yên nûjen, li ser Azure binesaziya ewr ava kir û xetên CI/CD yên ku demên deployê ji %40 zêdetir kurt kirin saz kir.',
  },
  'home.about.p3': {
    de: 'Mein Anspruch: Software, die <em>nicht nur funktioniert, sondern altert wie ein gut gemachtes Buch</em> — lesbar, klar gegliedert, frei von unnötigem Lärm.',
    fr: 'Mon exigence : un logiciel qui <em>ne se contente pas de fonctionner, mais vieillit comme un beau livre</em> — lisible, clairement structuré, sans bruit inutile.',
    en: 'My standard: software that <em>doesn’t just work but ages like a well-made book</em> — readable, clearly structured, free of unnecessary noise.',
    tr: 'Standardım: <em>sadece çalışan değil, iyi yapılmış bir kitap gibi yaşlanan</em> yazılım — okunabilir, net yapılı, gereksiz gürültüden uzak.',
    ku: 'Pîvana min: nermalavek ku <em>ne tenê dixebite, lê wek pirtûkek baş hatî çêkirin kal dibe</em> — xwendin, bi rêkûpêk, bê dengê nepêwîst.',
  },
  'home.about.caption': {
    de: 'Hamza Öztürk, Freiburg, 2026.', fr: 'Hamza Öztürk, Fribourg, 2026.', en: 'Hamza Öztürk, Freiburg, 2026.', tr: 'Hamza Öztürk, Freiburg, 2026.', ku: 'Hamza Öztürk, Freiburg, 2026.',
  },

  // ---- Skill category titles ----------------------------------------------
  'skills.backend': { de: 'Backend', fr: 'Backend', en: 'Backend', tr: 'Backend', ku: 'Backend' },
  'skills.frontend': { de: 'Frontend', fr: 'Frontend', en: 'Frontend', tr: 'Frontend', ku: 'Frontend' },
  'skills.devops': { de: 'DevOps & Cloud', fr: 'DevOps & Cloud', en: 'DevOps & Cloud', tr: 'DevOps & Bulut', ku: 'DevOps & Ewr' },
  'skills.data': { de: 'Datenbanken & Tools', fr: 'Bases de données & outils', en: 'Databases & Tools', tr: 'Veritabanları & Araçlar', ku: 'Danegeh & Amûr' },
};
