import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Druckvorschau. `cg.print.tap` und `cg.print.scan` stehen auf der
 * Karte selbst und sind darum kurz — auf 85,6 mm ist kein Platz für einen
 * Satz. `cg.print.note` steht darunter und gehört der Seite, nicht der Karte.
 */
export const CARD_PRINT_CONTENT: Record<string, Entry> = {
  'cg.print.tap': { de: 'Handy dranhalten', fr: 'Approcher le téléphone', en: 'Hold your phone here', tr: 'Telefonu yaklaştırın', ku: 'Telefonê nêzîk bikin' },
  'cg.print.scan': { de: 'oder scannen', fr: 'ou scanner', en: 'or scan', tr: 'ya da tarayın', ku: 'an bixwînin' },
  'cg.print.placeholder': { de: 'Ihr Name', fr: 'Votre nom', en: 'Your name', tr: 'Adınız', ku: 'Navê we' },
  'cg.print.note': {
    de: 'So wird die Karte gedruckt — im Maß einer Scheckkarte. Der QR-Code bekommt mit der Bestellung die Adresse Ihrer eigenen Seite; hier zeigt er auf uns.',
    fr: 'Voilà la carte imprimée, au format d’une carte bancaire. Le QR code recevra l’adresse de votre propre page avec la commande ; ici, il pointe vers nous.',
    en: 'This is how the card is printed, at bank-card size. The QR code gets the address of your own page with the order; here it points to us.',
    tr: 'Kart böyle basılır — banka kartı ölçüsünde. QR kod, siparişle birlikte kendi sayfanızın adresini alır; burada bize yönlendiriyor.',
    ku: 'Kart wusa tê çapkirin — bi pîvana karta bankê. QR bi siparîşê re navnîşana rûpela we distîne; li vir ew me nîşan dide.',
  },
};
