import { ThemeId } from './invite.model';

/**
 * Titel der Beispiel-Einladungen — eigene Datei, damit die Startseite sie
 * zeigen kann, ohne alle Beispieltexte mitzuladen.
 */
export const DEMO_TITLES: Record<ThemeId, string> = {
  dolcevita: 'Giulia & Marco',
  klassik: 'Ayşe & Daniel',
  garten: 'Lea & Can',
  minimal: 'Sophie & Jonas',
  kina: 'Elif & Emre',
  orient: 'Layla & Omar',
  rosa: 'Marie & Luca',
  rustikal: 'Anna & Ben',
  mediterran: 'Sofia & Nikos',
  mitternacht: 'Selin wird 30',
  business: 'Jahrestagung & Sommerfest 2027',
};
