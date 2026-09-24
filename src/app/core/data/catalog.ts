import catalog from './catalog.json';

/**
 * Preise der Website. Die Werte kommen aus der Tabelle `prices` im
 * Admin-Portal: `scripts/fetch-catalog.mjs` schreibt sie vor jedem Build in
 * catalog.json. Ohne Datenbank bleibt die eingecheckte Datei gültig.
 */
const prices: Record<string, number> = catalog;

export function price(key: string): number {
  const v = prices[key];
  if (typeof v !== 'number') throw new Error(`Preis fehlt im Katalog: ${key}`);
  return v;
}
