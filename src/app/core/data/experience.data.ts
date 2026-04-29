export interface ExperienceDocument {
  label: string;
  url: string;
}

export interface ExperienceItem {
  id: number;
  date: string;
  title: string;
  institution: string;
  description: string;
  image: string;
  type: 'education' | 'work' | 'certificate';
  highlights?: string[];
  location?: string;
  documents?: ExperienceDocument[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    date: '02/2024 – 02/2026',
    title: 'Full-Stack Entwickler & Fachinformatiker (IHK)',
    institution: 'Dicom GmbH | Walther-Rathenau-Gewerbeschule, Freiburg',
    description:
      'End-to-End-Verantwortung für C#/.NET 10-APIs und Angular-Frontends. Migration von Legacy-Desktop-ERP zu webbasierter Lösung mittels Clean Architecture. Aufbau der Azure Cloud Infrastruktur und CI/CD-Pipelines.',
    image: 'assets/images/dicom.png',
    type: 'work',
    location: 'Freiburg, Deutschland',
    highlights: [
      'Legacy-Desktop ERP zu Web-App migriert',
      'Azure Cloud Infrastruktur aufgebaut',
      'CI/CD-Pipelines: Deployment-Zeit um 40% verkürzt',
      'Clean Architecture mit .NET 10 & Angular 19',
      'IHK Fachinformatiker-Prüfung bestanden',
    ],
    documents: [
      {
        label: 'Arbeitszeugnis',
        url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_arbeitszeugnis.pdf',
      },

    ],
  },
  {
    id: 2,
    date: '05/2022 – 03/2023',
    title: 'Zertifikat: Data Analytics',
    institution: 'Clarusway IT School',
    description:
      'Umfassende Weiterbildung im Bereich Datenanalyse, Python und Cloud-Technologien zur Vorbereitung auf moderne Datenverarbeitung und Softwareentwicklung.',
    image: 'assets/images/clarusway.png',
    type: 'certificate',
    location: 'Remote',
    highlights: [
      'Python & Data Science Fundamentals',
      'SQL & Datenbank-Management',
      'Machine Learning Grundlagen',
      'Cloud Computing mit AWS',
    ],
    documents: [
      {
        label: 'Data Analyst Zertifikate',
        url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_data_analyst _zertifikate.pdf',
      },
    ],
  },
  {
    id: 3,
    date: '10/2019 – 08/2022',
    title: 'Wirtschaftsingenieurwesen',
    institution: 'Technische Universität Istanbul (İTÜ)',
    description:
      'Studium an einer der renommiertesten technischen Universitäten mit Fokus auf interdisziplinäre Problemlösung, Prozesseffizienz und Systemarchitektur.',
    image: 'assets/images/itu.jpeg',
    type: 'education',
    location: 'Istanbul, Türkei',
    highlights: [
      'Top 3 technische Universität der Türkei',
      'Interdisziplinäre Problemlösung',
      'Operations Research & Optimierung',
      'Produktionsplanung & Systemarchitektur',
    ],
  },
  {
    id: 4,
    date: '08/2015 – 07/2018',
    title: 'Wirtschaftsingenieurwesen & Offizierausbildung',
    institution: 'Türkische Luftwaffenakademie, Istanbul',
    description:
      'Rigorose technische und auf Führung ausgerichtete Ausbildung, bei der eiserne Disziplin, schnelle Auffassungsgabe und strategisches Denken gefordert waren.',
    image: 'assets/images/military shule.jpg',
    type: 'education',
    location: 'Istanbul, Türkei',
    highlights: [
      'Militärische Führungsausbildung',
      'Technisches Ingenieurstudium',
      'Strategisches Denken & Disziplin',
      'Teamführung unter Druck',
    ],
  },
  {
    id: 5,
    date: '1996 – ...',
    title: 'Der Anfang meiner Reise',
    institution: 'Kindheit & Grundschule',
    description:
      'Hier begann alles. Meine ständige Neugier und der Drang, zu verstehen, wie Dinge funktionieren, haben schon früh den Grundstein für meinen analytischen Denkansatz gelegt.',
    image: 'assets/images/ilk okul.jpg',
    type: 'education',
    location: 'Türkei',
    highlights: [
      'Neugier & analytisches Denken',
      'Grundstein für technisches Verständnis',
    ],
  },
];
