export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string; level: number }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Backend',
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
    icon: '🗄️',
    skills: [
      { name: 'PostgreSQL', level: 88 },
      { name: 'SQL Server', level: 85 },
      { name: 'SQLite', level: 75 },
      { name: 'Git / GitHub', level: 92 },
      { name: 'Jira / Agile', level: 85 },
    ],
  },
];

export interface Stat {
  target: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { target: 3, suffix: '+', label: 'Jahre Erfahrung' },
  { target: 10, suffix: '+', label: 'Projekte' },
  { target: 5, suffix: '+', label: 'Technologien' },
  { target: 100, suffix: '%', label: 'Leidenschaft' },
];
