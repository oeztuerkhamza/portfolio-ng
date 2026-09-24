export interface Stat {
  target: number;
  suffix: string;
  label: string;
  /** i18n key for the label. */
  key: string;
}

/**
 * Kennzahlen der Startseite. Jede Zahl muss sich an den Projektdaten
 * nachzaehlen lassen — „100 % Leidenschaft" stand hier mal und ist genau die
 * Sorte Angabe, die ein Kunde nicht pruefen kann und deshalb auch nicht glaubt.
 */
export const STATS: Stat[] = [
  { target: 10, suffix: '', label: 'Kundenprojekte', key: 'home.stats.projects' },
  { target: 8, suffix: '', label: 'Systeme im Betrieb', key: 'home.stats.live' },
  { target: 15, suffix: '', label: 'Sprachen ausgeliefert', key: 'home.stats.langs' },
  { target: 3, suffix: '+', label: 'Jahre Erfahrung', key: 'home.stats.years' },
];
