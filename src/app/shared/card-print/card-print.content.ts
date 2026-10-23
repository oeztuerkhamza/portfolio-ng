import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Druckvorschau. `cg.print.tap` und `cg.print.scan` stehen auf der
 * Karte selbst und sind darum kurz — auf 85,6 mm ist kein Platz für einen
 * Satz. `cg.print.note` steht darunter und gehört der Seite, nicht der Karte.
 */
export const CARD_PRINT_CONTENT: Record<string, Entry> = {
  'cg.print.tap': { de: 'Handy dranhalten', en: 'Hold your phone here', tr: 'Telefonu yaklaştırın' },
  'cg.print.scan': { de: 'oder scannen', en: 'or scan', tr: 'ya da tarayın' },
  'cg.print.placeholder': { de: 'Ihr Name', en: 'Your name', tr: 'Adınız' },
  'cg.print.note': {
    de: 'So wird die Karte gedruckt — im Maß einer Scheckkarte. Der QR-Code bekommt mit der Bestellung die Adresse Ihrer eigenen Seite; hier zeigt er auf uns.',
    en: 'This is how the card is printed, at bank-card size. The QR code gets the address of your own page with the order; here it points to us.',
    tr: 'Kart böyle basılır — banka kartı ölçüsünde. QR kod, siparişle birlikte kendi sayfanızın adresini alır; burada bize yönlendiriyor.',
  },
};
