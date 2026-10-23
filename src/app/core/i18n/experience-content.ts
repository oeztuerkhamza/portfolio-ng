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
  },
  2: {
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
  },
  3: {
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
  },
  5: {
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
  },
};
