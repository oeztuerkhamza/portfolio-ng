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
  'cg.img.choose': { de: 'Bild auswählen', en: 'Choose an image', tr: 'Görsel seç' },
  'cg.img.replace': { de: 'Ersetzen', en: 'Replace', tr: 'Değiştir' },
  'cg.img.remove': { de: 'Entfernen', en: 'Remove', tr: 'Kaldır' },
  'cg.img.uploading': { de: 'Wird hochgeladen …', en: 'Uploading …', tr: 'Yükleniyor …' },

  'cg.img.err.type': {
    de: 'Nur JPG, PNG, WebP, GIF oder AVIF — SVG geht aus Sicherheitsgründen nicht.',
    en: 'Only JPG, PNG, WebP, GIF or AVIF — SVG is excluded for security reasons.',
    tr: 'Yalnızca JPG, PNG, WebP, GIF veya AVIF — SVG güvenlik nedeniyle kabul edilmiyor.',
  },
  'cg.img.err.size': {
    de: 'Das Bild ist größer als 5 MB. Ein Foto aus der Kamera lässt sich meist verkleinern.',
    en: 'The image is larger than 5 MB. A camera photo can usually be scaled down.',
    tr: 'Görsel 5 MB’den büyük. Kameradan çıkan fotoğraf genellikle küçültülebilir.',
  },
  'cg.img.err.often': {
    de: 'Zu viele Bilder in kurzer Zeit. Bitte in einer Stunde noch einmal.',
    en: 'Too many images in a short time. Please try again in an hour.',
    tr: 'Kısa sürede çok fazla görsel. Bir saat sonra tekrar deneyin.',
  },
  'cg.img.err.failed': {
    de: 'Das Hochladen hat nicht geklappt. Bitte noch einmal versuchen.',
    en: 'The upload did not work. Please try again.',
    tr: 'Yükleme başarısız oldu. Lütfen tekrar deneyin.',
  },
};
