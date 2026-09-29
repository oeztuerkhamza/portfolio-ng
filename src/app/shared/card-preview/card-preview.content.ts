import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Kartenvorschau.
 *
 * Sie stehen bei der Vorschau und nicht beim Kartengestalter, weil die
 * Vorschau sie selbst anmeldet: sie wird irgendwann auch an anderer Stelle
 * stehen (im Portal etwa), und ein Baustein, dessen Beschriftungen von der
 * Seite kommen müssen, auf der er zufällig zuerst stand, ist kein Baustein.
 */
export const CARD_PREVIEW_CONTENT: Record<string, Entry> = {
  'cg.preview.title': { de: 'Vorschau der Karte', fr: 'Aperçu de la carte', en: 'Card preview', tr: 'Kart önizlemesi', ku: 'Pêşdîtina kartê' },
  'cg.preview.loading': { de: 'Vorschau wird gezeichnet …', fr: 'Aperçu en cours …', en: 'Drawing the preview …', tr: 'Önizleme çiziliyor …', ku: 'Pêşdîtin tê xêzkirin …' },
  'cg.preview.error': {
    de: 'Die Vorschau ließ sich gerade nicht laden. Ihre Eingaben sind gespeichert — es hilft, gleich noch einmal etwas zu ändern.',
    fr: 'L’aperçu n’a pas pu être chargé. Vos saisies sont enregistrées : modifiez quelque chose pour réessayer.',
    en: 'The preview could not be loaded just now. Your entries are saved — change something to try again.',
    tr: 'Önizleme şu anda yüklenemedi. Girdikleriniz kayıtlı — bir şey değiştirince yeniden denenir.',
    ku: 'Pêşdîtin niha nehat barkirin. Tiştên we tomarkirî ne — tiştekî biguherînin da ku dîsa were ceribandin.',
  },
  'cg.preview.note': {
    de: 'So sieht Ihre Seite aus, wenn jemand die Karte ans Telefon hält. Knöpfe und Formular sind in der Vorschau abgeschaltet.',
    fr: 'Voilà votre page quand quelqu’un approche la carte du téléphone. Boutons et formulaire sont désactivés dans l’aperçu.',
    en: 'This is your page when someone holds the card to their phone. Buttons and the form are switched off in the preview.',
    tr: 'Biri kartı telefonuna tuttuğunda sayfanız böyle görünür. Önizlemede düğmeler ve form kapalıdır.',
    ku: 'Rûpela we wusa xuya dike gava ku kesek kartê nêzî telefonê dike. Di pêşdîtinê de bişkok û form girtî ne.',
  },
  'cg.preview.business.empty': {
    de: 'Tragen Sie den Namen des Betriebs ein — dann erscheint hier die Karte.',
    fr: 'Saisissez le nom de l’entreprise : la carte apparaîtra ici.',
    en: 'Enter the business name and the card appears here.',
    tr: 'İşletme adını girin — kart burada belirir.',
    ku: 'Navê karsaziyê binivîsin — kart li vir xuya dibe.',
  },
  'cg.preview.gift.empty': {
    de: 'Tragen Sie die Überschrift ein — dann erscheint hier die Karte.',
    fr: 'Saisissez le titre : la carte apparaîtra ici.',
    en: 'Enter the headline and the card appears here.',
    tr: 'Başlığı girin — kart burada belirir.',
    ku: 'Sernavê binivîsin — kart li vir xuya dibe.',
  },
};
