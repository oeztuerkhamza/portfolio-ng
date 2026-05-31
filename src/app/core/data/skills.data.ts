export interface SkillCategory {
  title: string;
  /** i18n key for the category title. */
  key: string;
  icon: string;
  skills: { name: string; level: number }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Backend',
    key: 'skills.backend',
    icon: '⚙️',
    skills: [
      { name: 'C# / .NET 10', level: 95 },
      { name: 'Clean Architecture', level: 90 },
      { name: 'REST API Design', level: 92 },
      { name: 'Entity Framework', level: 88 },
      { name: 'Python / FastAPI', level: 75 },
    ],
  },
  {
    title: 'Frontend',
    key: 'skills.frontend',
    icon: '🎨',
    skills: [
      { name: 'Angular 17/19', level: 92 },
      { name: 'React 19', level: 80 },
      { name: 'TypeScript', level: 93 },
      { name: 'SCSS / Tailwind', level: 88 },
      { name: 'RxJS', level: 85 },
    ],
  },
  {
    title: 'DevOps & Cloud',
    key: 'skills.devops',
    icon: '☁️',
    skills: [
      { name: 'Azure Cloud', level: 85 },
      { name: 'Docker', level: 82 },
      { name: 'CI/CD Pipelines', level: 88 },
      { name: 'GitHub Actions', level: 80 },
      { name: 'Linux / Bash', level: 75 },
    ],
  },
  {
    title: 'Datenbanken & Tools',
    key: 'skills.data',
    icon: '🗄️',
    skills: [
      { name: 'SQL Server', level: 95 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'SQLite', level: 80 },
      { name: 'Git / GitHub', level: 92 },
      { name: 'Jira / Agile', level: 85 },
    ],
  },
];

export interface Stat {
  target: number;
  suffix: string;
  label: string;
  /** i18n key for the label. */
  key: string;
}

export const STATS: Stat[] = [
  { target: 3, suffix: '+', label: 'Jahre Erfahrung', key: 'home.stats.years' },
  { target: 10, suffix: '+', label: 'Projekte', key: 'home.stats.projects' },
  { target: 5, suffix: '+', label: 'Technologien', key: 'home.stats.tech' },
  { target: 100, suffix: '%', label: 'Leidenschaft', key: 'home.stats.passion' },
];
