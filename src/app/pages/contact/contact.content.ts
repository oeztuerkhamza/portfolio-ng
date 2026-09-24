import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Kontaktseite: die drei direkten Wege, das Anfrageformular und
 * „So geht es weiter". Werden von ContactComponent registriert und kommen mit
 * dem Lazy-Chunk der Seite.
 */
export const CONTACT_CONTENT: Record<string, Entry> = {
  // ---- Direkte Wege --------------------------------------------------------
  'contact.c.phone': { de: 'Telefon', fr: 'Téléphone', en: 'Phone', tr: 'Telefon', ku: 'Telefon' },
  'contact.c.phone.hint': {
    de: 'Am schnellsten für kurze Fragen', fr: 'Le plus rapide pour une question courte', en: 'Quickest for short questions', tr: 'Kısa sorular için en hızlısı', ku: 'Ji bo pirsên kurt ya herî bilez',
  },
  'contact.c.wa.hint': {
    de: 'Nachricht, Foto oder Sprachnachricht', fr: 'Message, photo ou message vocal', en: 'Text, photo or voice message', tr: 'Mesaj, fotoğraf veya sesli mesaj', ku: 'Peyam, wêne an peyama dengî',
  },
  'contact.c.mail': { de: 'E-Mail', fr: 'E-mail', en: 'Email', tr: 'E-posta', ku: 'E-name' },
  'contact.c.mail.hint': {
    de: 'Für Unterlagen und ausführliche Anfragen', fr: 'Pour les documents et les demandes détaillées', en: 'For documents and detailed enquiries', tr: 'Belgeler ve ayrıntılı talepler için', ku: 'Ji bo belge û daxwazên berfireh',
  },

  // ---- Formular ------------------------------------------------------------
  'contact.form.label': { de: 'Anfrage', fr: 'Demande', en: 'Enquiry', tr: 'Talep formu', ku: 'Forma daxwazê' },
  'contact.form.title': {
    de: 'Schreiben Sie uns —<br /><em>in zwei Minuten</em>.',
    fr: 'Écrivez-nous —<br /><em>en deux minutes</em>.',
    en: 'Write to us —<br /><em>in two minutes</em>.',
    tr: 'Bize yazın —<br /><em>iki dakikada</em>.',
    ku: 'Ji me re binivîsin —<br /><em>di du deqeyan de</em>.',
  },
  'contact.form.intro': {
    de: 'Ein paar Stichworte genügen. Wir melden uns mit einem Terminvorschlag für das kostenlose Erstgespräch.',
    fr: 'Quelques mots suffisent. Nous revenons vers vous avec une proposition de rendez-vous pour le premier échange gratuit.',
    en: 'A few keywords are enough. We’ll get back to you with a suggested time for the free first consultation.',
    tr: 'Birkaç anahtar kelime yeterli. Ücretsiz ön görüşme için bir randevu önerisiyle size döneriz.',
    ku: 'Çend peyv bes in. Em ê bi pêşniyareke demê ji bo hevdîtina yekem a belaş vegerin.',
  },
  'contact.f.name': { de: 'Ihr Name', fr: 'Votre nom', en: 'Your name', tr: 'Adınız', ku: 'Navê we' },
  'contact.f.business': { de: 'Betrieb (optional)', fr: 'Entreprise (facultatif)', en: 'Business (optional)', tr: 'İşletme (isteğe bağlı)', ku: 'Karsazî (vebijarkî)' },
  'contact.f.business.short': { de: 'Betrieb', fr: 'Entreprise', en: 'Business', tr: 'İşletme', ku: 'Karsazî' },
  'contact.f.reach': { de: 'Telefon oder E-Mail', fr: 'Téléphone ou e-mail', en: 'Phone or email', tr: 'Telefon veya e-posta', ku: 'Telefon an e-name' },
  'contact.f.interest': { de: 'Worum geht es?', fr: 'De quoi s’agit-il ?', en: 'What is it about?', tr: 'Konu nedir?', ku: 'Mijar çi ye?' },
  'contact.f.opt.cards': { de: 'Bewertungskarten', fr: 'Cartes d’avis', en: 'Review cards', tr: 'Değerlendirme kartları', ku: 'Kartên nirxandinê' },
  'contact.f.opt.web': { de: 'Website', fr: 'Site web', en: 'Website', tr: 'Web sitesi', ku: 'Malper' },
  'contact.f.opt.sh': { de: 'Smart Home', fr: 'Maison connectée', en: 'Smart home', tr: 'Akıllı ev', ku: 'Mala biaqil' },
  'contact.f.opt.abo': { de: 'Digital-Abo', fr: 'Abonnement', en: 'Digital plan', tr: 'Dijital abonelik', ku: 'Abonetiya dîjîtal' },
  'contact.f.plan.msg': {
    de: 'Ich interessiere mich für das Digital-Abo „{plan}“ ({billing}).',
    fr: 'L’abonnement « {plan} » ({billing}) m’intéresse.',
    en: 'I’m interested in the “{plan}” plan ({billing}).',
    tr: '“{plan}” dijital aboneliğiyle ({billing}) ilgileniyorum.',
    ku: 'Ez bi abonetiya “{plan}” ({billing}) re eleqedar im.',
  },
  'contact.f.billing.monthly': { de: 'monatliche Zahlung', fr: 'paiement mensuel', en: 'monthly billing', tr: 'aylık ödeme', ku: 'dayîna mehane' },
  'contact.f.billing.yearly': { de: 'jährliche Zahlung', fr: 'paiement annuel', en: 'yearly billing', tr: 'yıllık ödeme', ku: 'dayîna salane' },
  'contact.f.opt.other': { de: 'Etwas anderes', fr: 'Autre chose', en: 'Something else', tr: 'Başka bir konu', ku: 'Tiştekî din' },
  'contact.f.message': { de: 'Ihre Nachricht', fr: 'Votre message', en: 'Your message', tr: 'Mesajınız', ku: 'Peyama we' },
  'contact.f.message.ph': {
    de: 'Kurz beschreiben, was Sie vorhaben oder wo es hakt.',
    fr: 'Décrivez brièvement votre projet ou ce qui coince.',
    en: 'Briefly describe what you have in mind or where things get stuck.',
    tr: 'Ne yapmak istediğinizi veya nerede takıldığınızı kısaca yazın.',
    ku: 'Bi kurtî binivîsin ka hûn çi dixwazin an li ku derê asteng heye.',
  },
  'contact.f.send.mail': { de: 'Per E-Mail senden', fr: 'Envoyer par e-mail', en: 'Send by email', tr: 'E-posta ile gönder', ku: 'Bi e-name bişîne' },
  'contact.f.send.wa': { de: 'Per WhatsApp senden', fr: 'Envoyer par WhatsApp', en: 'Send via WhatsApp', tr: 'WhatsApp ile gönder', ku: 'Bi WhatsAppê bişîne' },
  'contact.f.privacy': {
    de: 'Diese Website speichert Ihre Angaben nicht. Die Nachricht öffnet sich fertig ausgefüllt in Ihrem E-Mail-Programm oder in WhatsApp — abgeschickt wird sie erst von Ihnen.',
    fr: 'Ce site n’enregistre pas vos données. Le message s’ouvre déjà rempli dans votre messagerie ou dans WhatsApp — c’est vous qui l’envoyez.',
    en: 'This website doesn’t store your details. The message opens pre-filled in your email app or WhatsApp — you are the one who sends it.',
    tr: 'Bu site bilgilerinizi kaydetmez. Mesaj, e-posta uygulamanızda veya WhatsApp’ta hazır doldurulmuş olarak açılır — gönderen sizsiniz.',
    ku: 'Ev malper agahiyên we tomar nake. Peyam di sepana we ya e-nameyê an di WhatsAppê de amade vedibe — hûn bi xwe dişînin.',
  },
  'contact.f.sent': {
    de: 'Hat sich nichts geöffnet? Schreiben Sie uns direkt:', fr: 'Rien ne s’est ouvert ? Écrivez-nous directement :', en: 'Nothing opened? Write to us directly:', tr: 'Hiçbir şey açılmadı mı? Doğrudan yazın:', ku: 'Tiştek venebû? Rasterast ji me re binivîsin:',
  },
  'contact.mail.greeting': { de: 'Guten Tag,', fr: 'Bonjour,', en: 'Hello,', tr: 'Merhaba,', ku: 'Rojbaş,' },
  'contact.mail.subject': {
    de: 'Anfrage über die Website', fr: 'Demande via le site web', en: 'Enquiry via the website', tr: 'Web sitesi üzerinden talep', ku: 'Daxwaz bi rêya malperê',
  },

  // ---- So geht es weiter ---------------------------------------------------
  'contact.next.label': { de: 'So geht es weiter', fr: 'La suite', en: 'What happens next', tr: 'Sonra ne olur?', ku: 'Paşê çi dibe' },
  'contact.next1': {
    de: 'Wir melden uns innerhalb von 24 Stunden (werktags).',
    fr: 'Nous vous répondons sous 24 heures (jours ouvrés).',
    en: 'We get back to you within 24 hours (working days).',
    tr: '24 saat içinde (iş günleri) size döneriz.',
    ku: 'Em di nav 24 saetan de (rojên kar) vedigerin.',
  },
  'contact.next2': {
    de: 'Kostenloses Erstgespräch — am Telefon oder bei Ihnen vor Ort.',
    fr: 'Premier échange gratuit — par téléphone ou chez vous.',
    en: 'Free first consultation — by phone or at your premises.',
    tr: 'Ücretsiz ön görüşme — telefonda veya sizin yerinizde.',
    ku: 'Hevdîtina yekem a belaş — bi telefonê an li cem we.',
  },
  'contact.next3': {
    de: 'Sie erhalten ein schriftliches Angebot zum Festpreis.',
    fr: 'Vous recevez un devis écrit à prix fixe.',
    en: 'You receive a written fixed-price quote.',
    tr: 'Yazılı, sabit fiyatlı bir teklif alırsınız.',
    ku: 'Hûn pêşniyareke nivîskî bi bihayê sabît distînin.',
  },
  'contact.visit.text': {
    de: 'Termine nach Vereinbarung — meistens kommen wir zu Ihnen in den Betrieb.',
    fr: 'Rendez-vous sur demande — le plus souvent, nous venons chez vous.',
    en: 'Appointments by arrangement — usually we come to your business.',
    tr: 'Randevu ile — çoğunlukla biz işletmenize geliriz.',
    ku: 'Randevû bi lihevkirinê — pir caran em tên karsaziya we.',
  },
};
