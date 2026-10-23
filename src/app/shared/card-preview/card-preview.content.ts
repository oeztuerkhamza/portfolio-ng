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
  'cg.preview.title': { de: 'Vorschau der Karte', en: 'Card preview', tr: 'Kart önizlemesi' },
  'cg.preview.loading': { de: 'Vorschau wird gezeichnet …', en: 'Drawing the preview …', tr: 'Önizleme çiziliyor …' },
  'cg.preview.error': {
    de: 'Die Vorschau ließ sich gerade nicht laden. Ihre Eingaben sind gespeichert — es hilft, gleich noch einmal etwas zu ändern.',
    en: 'The preview could not be loaded just now. Your entries are saved — change something to try again.',
    tr: 'Önizleme şu anda yüklenemedi. Girdikleriniz kayıtlı — bir şey değiştirince yeniden denenir.',
  },
  'cg.preview.note': {
    de: 'So sieht Ihre Seite aus, wenn jemand die Karte ans Telefon hält. Knöpfe und Formular sind in der Vorschau abgeschaltet.',
    en: 'This is your page when someone holds the card to their phone. Buttons and the form are switched off in the preview.',
    tr: 'Biri kartı telefonuna tuttuğunda sayfanız böyle görünür. Önizlemede düğmeler ve form kapalıdır.',
  },
  'cg.preview.business.empty': {
    de: 'Tragen Sie den Namen des Betriebs ein — dann erscheint hier die Karte.',
    en: 'Enter the business name and the card appears here.',
    tr: 'İşletme adını girin — kart burada belirir.',
  },
  'cg.preview.gift.empty': {
    de: 'Tragen Sie die Überschrift ein — dann erscheint hier die Karte.',
    en: 'Enter the headline and the card appears here.',
    tr: 'Başlığı girin — kart burada belirir.',
  },
};
