import { Lang } from './i18n.service';

/** Per-locale experience-timeline content, keyed by entry id. German lives in
 *  experience.data.ts and is the fallback. */
export interface ExperienceTx {
  title?: string;
  description?: string;
  highlights?: string[];
}

export const EXPERIENCE_CONTENT: Record<number, Partial<Record<Lang, ExperienceTx>>> = {
  1: {
    fr: {
      title: 'Développeur full-stack & informaticien (IHK)',
      description:
        'Responsabilité de bout en bout sur des API C#/.NET 10 et des front-ends Angular. Migration d’un ERP de bureau hérité vers une solution web via Clean Architecture. Mise en place de l’infrastructure cloud Azure et des pipelines CI/CD.',
      highlights: [
        'Migration de l’ERP de bureau hérité vers une app web',
        'Construction de l’infrastructure cloud Azure',
        'Pipelines CI/CD : temps de déploiement réduit de 40 %',
        'Clean Architecture avec .NET 10 & Angular 19',
        'Examen IHK d’informaticien réussi',
      ],
    },
    en: {
      title: 'Full-Stack Developer & IT Specialist (IHK)',
      description:
        'End-to-end responsibility for C#/.NET 10 APIs and Angular front-ends. Migration of a legacy desktop ERP to a web solution using Clean Architecture. Built the Azure cloud infrastructure and CI/CD pipelines.',
      highlights: [
        'Migrated legacy desktop ERP to a web app',
        'Built Azure cloud infrastructure',
        'CI/CD pipelines: deployment time cut by 40%',
        'Clean Architecture with .NET 10 & Angular 19',
        'Passed the IHK IT specialist examination',
      ],
    },
    tr: {
      title: 'Full-Stack Geliştirici & Bilişim Uzmanı (IHK)',
      description:
        'C#/.NET 10 API’leri ve Angular ön yüzleri için uçtan uca sorumluluk. Eski masaüstü ERP’nin Clean Architecture ile web çözümüne taşınması. Azure bulut altyapısı ve CI/CD hatlarının kurulması.',
      highlights: [
        'Eski masaüstü ERP web uygulamasına taşındı',
        'Azure bulut altyapısı kuruldu',
        'CI/CD hatları: dağıtım süresi %40 azaldı',
        '.NET 10 & Angular 19 ile Clean Architecture',
        'IHK Bilişim Uzmanı sınavı geçildi',
      ],
    },
    ku: {
      title: 'Pêşvebirê Full-Stack & Pisporê IT (IHK)',
      description:
        'Berpirsyariya ji destpêkê heta dawiyê ji bo API yên C#/.NET 10 û front-endên Angular. Veguhastina ERP ya kevn a sermasîyê bo çareseriyek webî bi Clean Architecture. Avakirina binesaziya ewr a Azure û xetên CI/CD.',
      highlights: [
        'ERP ya kevn a sermasîyê bo sepana webê hat veguhastin',
        'Binesaziya ewr a Azure hat avakirin',
        'Xetên CI/CD: dema deployê %40 kurt bû',
        'Clean Architecture bi .NET 10 & Angular 19',
        'Îmtîhana IHK ya pisporê IT hat derbaskirin',
      ],
    },
  },
  2: {
    fr: {
      title: 'Certificat : Data Analytics',
      description:
        'Formation complète en analyse de données, Python et technologies cloud, en préparation au traitement de données et au développement logiciel modernes.',
      highlights: ['Fondamentaux Python & data science', 'SQL & gestion de bases de données', 'Bases du machine learning', 'Cloud computing avec AWS'],
    },
    en: {
      title: 'Certificate: Data Analytics',
      description:
        'Comprehensive training in data analysis, Python and cloud technologies, preparing for modern data processing and software development.',
      highlights: ['Python & data science fundamentals', 'SQL & database management', 'Machine learning basics', 'Cloud computing with AWS'],
    },
    tr: {
      title: 'Sertifika: Veri Analitiği',
      description:
        'Modern veri işleme ve yazılım geliştirmeye hazırlık için veri analizi, Python ve bulut teknolojilerinde kapsamlı eğitim.',
      highlights: ['Python & veri bilimi temelleri', 'SQL & veritabanı yönetimi', 'Makine öğrenmesi temelleri', 'AWS ile bulut bilişim'],
    },
    ku: {
      title: 'Sertîfîka: Analîtîka Daneyan',
      description:
        'Perwerdehiyek berfireh di analîza daneyan, Python û teknolojiyên ewr de, ji bo amadekirina hilberandina daneyan û pêşxistina nermalavê ya nûjen.',
      highlights: ['Bingehên Python & zanista daneyan', 'SQL & rêveberiya danegehan', 'Bingehên fêrbûna makîneyê', 'Hesabkirina ewr bi AWS'],
    },
  },
  3: {
    fr: {
      title: 'Génie industriel',
      description:
        'Études dans l’une des universités techniques les plus réputées, axées sur la résolution interdisciplinaire de problèmes, l’efficacité des processus et l’architecture des systèmes.',
      highlights: ['Top 3 des universités techniques de Turquie', 'Résolution de problèmes interdisciplinaire', 'Recherche opérationnelle & optimisation', 'Planification de production & architecture système'],
    },
    en: {
      title: 'Industrial Engineering',
      description:
        'Studies at one of the most renowned technical universities, focused on interdisciplinary problem-solving, process efficiency and systems architecture.',
      highlights: ['Top 3 technical university in Turkey', 'Interdisciplinary problem-solving', 'Operations research & optimisation', 'Production planning & systems architecture'],
    },
    tr: {
      title: 'Endüstri Mühendisliği',
      description:
        'Disiplinler arası problem çözme, süreç verimliliği ve sistem mimarisine odaklanan, en saygın teknik üniversitelerden birinde eğitim.',
      highlights: ['Türkiye’nin ilk 3 teknik üniversitesi', 'Disiplinler arası problem çözme', 'Yöneylem araştırması & optimizasyon', 'Üretim planlama & sistem mimarisi'],
    },
    ku: {
      title: 'Endezyariya Pîşesaziyê',
      description:
        'Xwendin li yek ji zanîngehên teknîkî yên herî navdar, bi balkişandina li ser çareserkirina pirsgirêkan a navdîsîplînî, kêrhatîbûna pêvajoyê û mîmariya pergalan.',
      highlights: ['Di nav 3 zanîngehên teknîkî yên herî baş ên Tirkiyê de', 'Çareserkirina pirsgirêkan a navdîsîplînî', 'Lêkolîna operasyonan & xweşkirin', 'Plansaziya hilberînê & mîmariya pergalê'],
    },
  },
  4: {
    fr: {
      title: 'Génie industriel & formation d’officier',
      description:
        'Formation technique et axée sur le leadership, rigoureuse, exigeant une discipline de fer, une compréhension rapide et une pensée stratégique.',
      highlights: ['Formation militaire au leadership', 'Études techniques d’ingénierie', 'Pensée stratégique & discipline', 'Direction d’équipe sous pression'],
    },
    en: {
      title: 'Industrial Engineering & Officer Training',
      description:
        'Rigorous technical and leadership-oriented training that demanded iron discipline, quick comprehension and strategic thinking.',
      highlights: ['Military leadership training', 'Technical engineering studies', 'Strategic thinking & discipline', 'Team leadership under pressure'],
    },
    tr: {
      title: 'Endüstri Mühendisliği & Subay Eğitimi',
      description:
        'Demir disiplin, hızlı kavrama ve stratejik düşünme gerektiren, teknik ve liderlik odaklı zorlu bir eğitim.',
      highlights: ['Askerî liderlik eğitimi', 'Teknik mühendislik eğitimi', 'Stratejik düşünme & disiplin', 'Baskı altında takım liderliği'],
    },
    ku: {
      title: 'Endezyariya Pîşesaziyê & Perwerdehiya Efser',
      description:
        'Perwerdehiyek hişk a teknîkî û serokatî-navendî ku dîsîplînek hesinî, têgihiştina bilez û ramana stratejîk dixwest.',
      highlights: ['Perwerdehiya serokatiya leşkerî', 'Xwendina endezyariya teknîkî', 'Ramana stratejîk & dîsîplîn', 'Serokatiya tîmê di bin zextê de'],
    },
  },
  5: {
    fr: {
      title: 'Le début de mon parcours',
      description:
        'Tout a commencé ici. Ma curiosité constante et mon envie de comprendre le fonctionnement des choses ont très tôt posé les bases de mon approche analytique.',
      highlights: ['Curiosité & pensée analytique', 'Bases de la compréhension technique'],
    },
    en: {
      title: 'The beginning of my journey',
      description:
        'It all started here. My constant curiosity and urge to understand how things work laid the foundation for my analytical mindset early on.',
      highlights: ['Curiosity & analytical thinking', 'Foundation for technical understanding'],
    },
    tr: {
      title: 'Yolculuğumun başlangıcı',
      description:
        'Her şey burada başladı. Sürekli merakım ve işlerin nasıl yürüdüğünü anlama isteğim, analitik düşünce yapımın temelini erken yaşta attı.',
      highlights: ['Merak & analitik düşünme', 'Teknik anlayışın temeli'],
    },
    ku: {
      title: 'Destpêka rêwîtiya min',
      description:
        'Her tişt li vir dest pê kir. Meraqa min a domdar û daxwaza fêmkirina ka tişt çawa dixebitin ji zû ve bingeha ramana min a analîtîk danî.',
      highlights: ['Meraq & ramana analîtîk', 'Bingeha têgihiştina teknîkî'],
    },
  },
};
