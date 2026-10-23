import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Kontaktseite: die drei direkten Wege, das Anfrageformular und
 * „So geht es weiter". Werden von ContactComponent registriert und kommen mit
 * dem Lazy-Chunk der Seite.
 */
export const CONTACT_CONTENT: Record<string, Entry> = {
  // ---- Direkte Wege --------------------------------------------------------
  'contact.c.phone': { de: 'Telefon', en: 'Phone', tr: 'Telefon' },
  'contact.c.phone.hint': {
    de: 'Am schnellsten für kurze Fragen', en: 'Quickest for short questions', tr: 'Kısa sorular için en hızlısı',
  },
  'contact.c.wa.hint': {
    de: 'Nachricht, Foto oder Sprachnachricht', en: 'Text, photo or voice message', tr: 'Mesaj, fotoğraf veya sesli mesaj',
  },
  'contact.c.mail': { de: 'E-Mail', en: 'Email', tr: 'E-posta' },
  'contact.c.mail.hint': {
    de: 'Für Unterlagen und ausführliche Anfragen', en: 'For documents and detailed enquiries', tr: 'Belgeler ve ayrıntılı talepler için',
  },

  // ---- Formular ------------------------------------------------------------
  'contact.form.label': { de: 'Anfrage', en: 'Enquiry', tr: 'Talep formu' },
  'contact.form.title': {
    de: 'Schreiben Sie uns —<br /><em>in zwei Minuten</em>.',
    en: 'Write to us —<br /><em>in two minutes</em>.',
    tr: 'Bize yazın —<br /><em>iki dakikada</em>.',
  },
  'contact.form.intro': {
    de: 'Ein paar Stichworte genügen. Wir melden uns mit einem Terminvorschlag für das kostenlose Erstgespräch.',
    en: 'A few keywords are enough. We’ll get back to you with a suggested time for the free first consultation.',
    tr: 'Birkaç anahtar kelime yeterli. Ücretsiz ön görüşme için bir randevu önerisiyle size döneriz.',
  },
  'contact.f.name': { de: 'Ihr Name', en: 'Your name', tr: 'Adınız' },
  'contact.f.business': { de: 'Betrieb (optional)', en: 'Business (optional)', tr: 'İşletme (isteğe bağlı)' },
  'contact.f.business.short': { de: 'Betrieb', en: 'Business', tr: 'İşletme' },
  'contact.f.reach': { de: 'Telefon oder E-Mail', en: 'Phone or email', tr: 'Telefon veya e-posta' },
  'contact.f.interest': { de: 'Worum geht es?', en: 'What is it about?', tr: 'Konu nedir?' },
  'contact.f.opt.cards': { de: 'Bewertungskarten', en: 'Review cards', tr: 'Değerlendirme kartları' },
  'contact.f.opt.web': { de: 'Website', en: 'Website', tr: 'Web sitesi' },
  'contact.f.opt.sh': { de: 'Smart Home', en: 'Smart home', tr: 'Akıllı ev' },
  'contact.f.opt.wartung': {
    de: 'Website-Wartung',
    en: 'Website maintenance',
    tr: 'Web sitesi bakımı',
  },
  'contact.f.plan.msg': {
    de: 'Ich interessiere mich für das Wartungspaket „{plan}“. Meine Website: ',
    en: 'I’m interested in the “{plan}” maintenance plan. My website: ',
    tr: '“{plan}” bakım paketiyle ilgileniyorum. Web sitem: ',
  },
  'contact.f.opt.other': { de: 'Etwas anderes', en: 'Something else', tr: 'Başka bir konu' },
  'contact.f.message': { de: 'Ihre Nachricht', en: 'Your message', tr: 'Mesajınız' },
  'contact.f.message.ph': {
    de: 'Kurz beschreiben, was Sie vorhaben oder wo es hakt.',
    en: 'Briefly describe what you have in mind or where things get stuck.',
    tr: 'Ne yapmak istediğinizi veya nerede takıldığınızı kısaca yazın.',
  },
  'contact.f.send.mail': { de: 'Per E-Mail senden', en: 'Send by email', tr: 'E-posta ile gönder' },
  'contact.f.send.wa': { de: 'Per WhatsApp senden', en: 'Send via WhatsApp', tr: 'WhatsApp ile gönder' },
  'contact.f.privacy': {
    de: 'Wir speichern Ihre Angaben, um Ihre Anfrage zu bearbeiten, und löschen sie, wenn sie nicht mehr gebraucht werden. Zusätzlich öffnet sich die Nachricht fertig ausgefüllt in Ihrem E-Mail-Programm oder in WhatsApp. Mehr in der Datenschutzerklärung.',
    en: 'We store your details to handle your enquiry and delete them once they are no longer needed. The message also opens pre-filled in your email app or WhatsApp. More in the privacy policy.',
    tr: 'Bilgilerinizi talebinizi işlemek için kaydeder, artık gerekmediğinde sileriz. Mesaj ayrıca e-posta uygulamanızda veya WhatsApp’ta hazır doldurulmuş olarak açılır. Ayrıntılar gizlilik politikasında.',
  },
  'contact.f.sent': {
    de: 'Hat sich nichts geöffnet? Schreiben Sie uns direkt:', en: 'Nothing opened? Write to us directly:', tr: 'Hiçbir şey açılmadı mı? Doğrudan yazın:',
  },
  'contact.mail.greeting': { de: 'Guten Tag,', en: 'Hello,', tr: 'Merhaba,' },
  'contact.mail.subject': {
    de: 'Anfrage über die Website', en: 'Enquiry via the website', tr: 'Web sitesi üzerinden talep',
  },

  // ---- So geht es weiter ---------------------------------------------------
  'contact.next.label': { de: 'So geht es weiter', en: 'What happens next', tr: 'Sonra ne olur?' },
  'contact.next1': {
    de: 'Wir melden uns innerhalb von 24 Stunden (werktags).',
    en: 'We get back to you within 24 hours (working days).',
    tr: '24 saat içinde (iş günleri) size döneriz.',
  },
  'contact.next2': {
    de: 'Kostenloses Erstgespräch — am Telefon oder bei Ihnen vor Ort.',
    en: 'Free first consultation — by phone or at your premises.',
    tr: 'Ücretsiz ön görüşme — telefonda veya sizin yerinizde.',
  },
  'contact.next3': {
    de: 'Sie erhalten ein schriftliches Angebot zum Festpreis.',
    en: 'You receive a written fixed-price quote.',
    tr: 'Yazılı, sabit fiyatlı bir teklif alırsınız.',
  },
  'contact.visit.text': {
    de: 'Erreichbar Mo–Fr 9–18 Uhr. Termine vor Ort nach Vereinbarung — meistens kommen wir zu Ihnen in den Betrieb.',
    en: 'Available Mon–Fri 9 am–6 pm. On-site appointments by arrangement — usually we come to your business.',
    tr: 'Pzt–Cum 09:00–18:00 arası ulaşılabiliriz. Yerinde randevu anlaşmaya göre — çoğunlukla biz işletmenize geliriz.',
  },
};
