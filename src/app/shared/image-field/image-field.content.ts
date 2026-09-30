import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Bildfelds. Sie stehen beim Feld selbst und nicht beim
 * Kartengestalter: das Feld meldet sie an und ist damit überall einsetzbar,
 * auch im Portal.
 *
 * Die Fehlertexte nennen die Grenze, statt nur „hat nicht geklappt" zu sagen —
 * wer ein 12-MB-Foto aus der Kamera hochlädt, soll wissen, woran es lag.
 */
export const IMAGE_FIELD_CONTENT: Record<string, Entry> = {
  'cg.img.choose': { de: 'Bild auswählen', fr: 'Choisir une image', en: 'Choose an image', tr: 'Görsel seç', ku: 'Wêneyekê hilbijêre' },
  'cg.img.replace': { de: 'Ersetzen', fr: 'Remplacer', en: 'Replace', tr: 'Değiştir', ku: 'Biguherîne' },
  'cg.img.remove': { de: 'Entfernen', fr: 'Retirer', en: 'Remove', tr: 'Kaldır', ku: 'Rake' },
  'cg.img.uploading': { de: 'Wird hochgeladen …', fr: 'Envoi en cours …', en: 'Uploading …', tr: 'Yükleniyor …', ku: 'Tê barkirin …' },

  'cg.img.err.type': {
    de: 'Nur JPG, PNG, WebP, GIF oder AVIF — SVG geht aus Sicherheitsgründen nicht.',
    fr: 'Uniquement JPG, PNG, WebP, GIF ou AVIF — le SVG est exclu pour des raisons de sécurité.',
    en: 'Only JPG, PNG, WebP, GIF or AVIF — SVG is excluded for security reasons.',
    tr: 'Yalnızca JPG, PNG, WebP, GIF veya AVIF — SVG güvenlik nedeniyle kabul edilmiyor.',
    ku: 'Tenê JPG, PNG, WebP, GIF an AVIF — SVG ji ber ewlehiyê nayê qebûlkirin.',
  },
  'cg.img.err.size': {
    de: 'Das Bild ist größer als 5 MB. Ein Foto aus der Kamera lässt sich meist verkleinern.',
    fr: 'L’image dépasse 5 Mo. Une photo d’appareil peut généralement être réduite.',
    en: 'The image is larger than 5 MB. A camera photo can usually be scaled down.',
    tr: 'Görsel 5 MB’den büyük. Kameradan çıkan fotoğraf genellikle küçültülebilir.',
    ku: 'Wêne ji 5 MB mezintir e. Wêneyê kamerayê bi gelemperî tê biçûkkirin.',
  },
  'cg.img.err.often': {
    de: 'Zu viele Bilder in kurzer Zeit. Bitte in einer Stunde noch einmal.',
    fr: 'Trop d’images en peu de temps. Réessayez dans une heure.',
    en: 'Too many images in a short time. Please try again in an hour.',
    tr: 'Kısa sürede çok fazla görsel. Bir saat sonra tekrar deneyin.',
    ku: 'Di demek kurt de gelek wêne. Ji kerema xwe piştî saetekê dîsa biceribînin.',
  },
  'cg.img.err.failed': {
    de: 'Das Hochladen hat nicht geklappt. Bitte noch einmal versuchen.',
    fr: 'L’envoi a échoué. Merci de réessayer.',
    en: 'The upload did not work. Please try again.',
    tr: 'Yükleme başarısız oldu. Lütfen tekrar deneyin.',
    ku: 'Barkirin bi ser neket. Ji kerema xwe dîsa biceribînin.',
  },
};
