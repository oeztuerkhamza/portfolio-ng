import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Anfrage-Assistenten. Der Assistent führt in drei kurzen Schritten
 * zur Anfrage: Leistung wählen, Paket oder Größe wählen, Kontakt hinterlassen.
 * Jeder Schritt ist ein Tipp oder ein, zwei Felder — nichts davon ist Pflicht
 * außer Name und Erreichbarkeit.
 */
export const REQUEST_WIZARD_CONTENT: Record<string, Entry> = {
  'rw.progress': { de: 'Schritt {n} von {t}', fr: 'Étape {n} sur {t}', en: 'Step {n} of {t}', tr: 'Adım {n} / {t}', ku: 'Gav {n} ji {t}' },
  'rw.back': { de: 'Zurück', fr: 'Retour', en: 'Back', tr: 'Geri', ku: 'Vegere' },

  'rw.q1': { de: 'Was möchten Sie?', fr: 'Que souhaitez-vous ?', en: 'What would you like?', tr: 'Ne istiyorsunuz?', ku: 'Hûn çi dixwazin?' },
  'rw.q1.hint': {
    de: 'Ein Tipp genügt — Sie können im Gespräch alles noch ändern.',
    fr: 'Un clic suffit — vous pourrez tout modifier lors de l’échange.',
    en: 'One tap is enough — you can still change everything when we talk.',
    tr: 'Bir dokunuş yeter — görüşmede her şeyi değiştirebilirsiniz.',
    ku: 'Yek tikandin bes e — di axaftinê de hûn dikarin her tiştî biguherînin.',
  },
  'rw.s.new.t': { de: 'Neue Website', fr: 'Nouveau site', en: 'A new website', tr: 'Yeni web sitesi', ku: 'Malpera nû' },
  'rw.s.new.d': { de: 'Ich habe noch keine oder möchte eine ganz neue.', fr: 'Je n’en ai pas encore ou je veux repartir de zéro.', en: 'I don’t have one yet or want a completely new one.', tr: 'Henüz yok ya da tamamen yenisini istiyorum.', ku: 'Hê nîne an jî ez yeke bi tevahî nû dixwazim.' },
  'rw.s.update.t': { de: 'Bestehende Website aufbessern', fr: 'Améliorer mon site actuel', en: 'Improve my current website', tr: 'Mevcut siteyi yenilemek', ku: 'Malpera heyî başkirin' },
  'rw.s.update.d': { de: 'Neues Design, schneller, gut auf dem Handy — ab {p} €.', fr: 'Nouveau design, plus rapide, bien sur mobile — dès {p} €.', en: 'New design, faster, great on mobile — from €{p}.', tr: 'Yeni tasarım, daha hızlı, mobilde iyi — {p} €’dan.', ku: 'Sêwirana nû, bileztir, li ser mobîlê baş — ji {p} € ve.' },
  'rw.s.wartung.t': { de: 'Website betreuen lassen', fr: 'Faire suivre mon site', en: 'Have my website looked after', tr: 'Sitemin bakımını yaptırmak', ku: 'Malpera xwe bi lênêrînê bidim' },
  'rw.s.wartung.d': { de: 'Hosting, Updates, Backups, kleine Änderungen — ab {p} € im Monat.', fr: 'Hébergement, mises à jour, sauvegardes, petites modifications — dès {p} € par mois.', en: 'Hosting, updates, backups, small changes — from €{p} a month.', tr: 'Barındırma, güncelleme, yedek, küçük değişiklikler — aylık {p} €’dan.', ku: 'Hosting, nûkirin, paşkeftin, guhertinên biçûk — ji {p} € di mehê de.' },
  'rw.s.other.t': { de: 'Etwas anderes', fr: 'Autre chose', en: 'Something else', tr: 'Başka bir şey', ku: 'Tiştekî din' },
  'rw.s.other.d': { de: 'Online-Shop, Web-App, Buchungssystem oder eine Frage.', fr: 'Boutique en ligne, application web, réservation ou une question.', en: 'Online shop, web app, booking system or a question.', tr: 'Online mağaza, web uygulaması, randevu sistemi ya da bir soru.', ku: 'Firotgeha serhêl, sepana malperê, sîstema randevûyê an pirsek.' },

  'rw.q2.new': { de: 'Wie groß soll die Website werden?', fr: 'Quelle taille pour le site ?', en: 'How big should the website be?', tr: 'Web sitesi ne kadar büyük olmalı?', ku: 'Malper çiqas mezin be?' },
  'rw.q2.update': { de: 'Welches Paket passt?', fr: 'Quel forfait vous convient ?', en: 'Which package fits?', tr: 'Hangi paket uygun?', ku: 'Kîjan pakêt maqûl e?' },
  'rw.q2.wartung': { de: 'Wie viel Betreuung brauchen Sie?', fr: 'Quel niveau de suivi ?', en: 'How much support do you need?', tr: 'Ne kadar desteğe ihtiyacınız var?', ku: 'Hûn çiqas piştgiriyê dixwazin?' },
  'rw.q2.other': { de: 'Worum geht es?', fr: 'De quoi s’agit-il ?', en: 'What is it about?', tr: 'Konu nedir?', ku: 'Mijar çi ye?' },
  'rw.unsure': { de: 'Weiß ich noch nicht', fr: 'Je ne sais pas encore', en: 'Not sure yet', tr: 'Henüz bilmiyorum', ku: 'Hê nizanim' },
  'rw.unsure.d': { de: 'Kein Problem — wir klären das gemeinsam.', fr: 'Pas de souci — nous le déterminons ensemble.', en: 'No problem — we’ll work it out together.', tr: 'Sorun değil — birlikte netleştiririz.', ku: 'Pirsgirêk nîne — em bi hev re diyar dikin.' },

  'rw.size.small.t': { de: 'Klein', fr: 'Petit', en: 'Small', tr: 'Küçük', ku: 'Biçûk' },
  'rw.size.small.d': { de: 'Bis 5 Seiten: Start, Leistungen, Über uns, Kontakt.', fr: 'Jusqu’à 5 pages : accueil, services, à propos, contact.', en: 'Up to 5 pages: home, services, about, contact.', tr: '5 sayfaya kadar: ana sayfa, hizmetler, hakkımızda, iletişim.', ku: 'Heta 5 rûpel: serî, xizmet, derbarê me, têkilî.' },
  'rw.size.company.t': { de: 'Firmen-Website', fr: 'Site d’entreprise', en: 'Company website', tr: 'Kurumsal web sitesi', ku: 'Malpera karsaziyê' },
  'rw.size.company.d': { de: 'Bis etwa 15 Seiten, auf Wunsch mehrsprachig.', fr: 'Jusqu’à environ 15 pages, multilingue sur demande.', en: 'Up to about 15 pages, multilingual if you like.', tr: 'Yaklaşık 15 sayfaya kadar, isteğe bağlı çok dilli.', ku: 'Heta nêzîkî 15 rûpel, bi daxwazê pirzimanî.' },
  'rw.size.custom.t': { de: 'Mit Shop, Buchung oder App', fr: 'Avec boutique, réservation ou application', en: 'With shop, booking or app', tr: 'Mağaza, randevu veya uygulama ile', ku: 'Bi firotgeh, randevû an sepanê re' },
  'rw.size.custom.d': { de: 'Online verkaufen, Termine vergeben oder eigene Funktionen.', fr: 'Vendre en ligne, prendre des rendez-vous ou fonctions sur mesure.', en: 'Sell online, take bookings or custom features.', tr: 'Online satış, randevu ya da özel işlevler.', ku: 'Firotina serhêl, randevû an fonksiyonên taybet.' },

  'rw.other.shop': { de: 'Online-Shop', fr: 'Boutique en ligne', en: 'Online shop', tr: 'Online mağaza', ku: 'Firotgeha serhêl' },
  'rw.other.app': { de: 'Web-App oder Software', fr: 'Application web ou logiciel', en: 'Web app or software', tr: 'Web uygulaması veya yazılım', ku: 'Sepana malperê an nermalav' },
  'rw.other.booking': { de: 'Buchungssystem', fr: 'Système de réservation', en: 'Booking system', tr: 'Randevu sistemi', ku: 'Sîstema randevûyê' },
  'rw.other.question': { de: 'Nur eine Frage', fr: 'Juste une question', en: 'Just a question', tr: 'Sadece bir soru', ku: 'Tenê pirsek' },

  'rw.pkg.days': { de: 'Fertig in {p} Werktagen', fr: 'Prêt en {p} jours ouvrés', en: 'Done in {p} working days', tr: '{p} iş gününde hazır', ku: 'Di {p} rojên xebatê de amade' },
  'rw.pkg.month': { de: '{p} € im Monat', fr: '{p} € par mois', en: '€{p} a month', tr: 'Aylık {p} €', ku: '{p} € di mehê de' },

  'rw.q3': { de: 'Wie erreichen wir Sie?', fr: 'Comment vous joindre ?', en: 'How can we reach you?', tr: 'Size nasıl ulaşalım?', ku: 'Em çawa bigihînin we?' },
  'rw.q3.hint': { de: 'Zwei Angaben genügen. Der Rest ist freiwillig.', fr: 'Deux informations suffisent. Le reste est facultatif.', en: 'Two details are enough. The rest is optional.', tr: 'İki bilgi yeter. Gerisi isteğe bağlı.', ku: 'Du agahî bes in. Yên mayî bi dilxwazî ne.' },
  'rw.f.name': { de: 'Ihr Name', fr: 'Votre nom', en: 'Your name', tr: 'Adınız', ku: 'Navê we' },
  'rw.f.reach': { de: 'Telefon oder E-Mail', fr: 'Téléphone ou e-mail', en: 'Phone or email', tr: 'Telefon veya e-posta', ku: 'Telefon an e-name' },
  'rw.f.business': { de: 'Ihr Betrieb (freiwillig)', fr: 'Votre entreprise (facultatif)', en: 'Your business (optional)', tr: 'İşletmeniz (isteğe bağlı)', ku: 'Karsaziya we (bi dilxwazî)' },
  'rw.f.website': { de: 'Adresse Ihrer jetzigen Website (freiwillig)', fr: 'Adresse de votre site actuel (facultatif)', en: 'Address of your current website (optional)', tr: 'Mevcut web sitenizin adresi (isteğe bağlı)', ku: 'Navnîşana malpera we ya heyî (bi dilxwazî)' },
  'rw.f.slot': { de: 'Wann passt ein Rückruf?', fr: 'Quand vous rappeler ?', en: 'When suits a call back?', tr: 'Ne zaman aransın?', ku: 'Kengê têlefon maqûl e?' },
  'rw.slot.any': { de: 'Egal', fr: 'Peu importe', en: 'Any time', tr: 'Fark etmez', ku: 'Ferq nake' },
  'rw.slot.morning': { de: 'Vormittags', fr: 'Le matin', en: 'Mornings', tr: 'Sabah', ku: 'Berî nîvro' },
  'rw.slot.afternoon': { de: 'Nachmittags', fr: 'L’après-midi', en: 'Afternoons', tr: 'Öğleden sonra', ku: 'Piştî nîvro' },
  'rw.slot.evening': { de: 'Abends', fr: 'Le soir', en: 'Evenings', tr: 'Akşam', ku: 'Êvaran' },
  'rw.f.note': { de: 'Noch etwas, das wir wissen sollten? (freiwillig)', fr: 'Autre chose à savoir ? (facultatif)', en: 'Anything else we should know? (optional)', tr: 'Bilmemiz gereken başka bir şey var mı? (isteğe bağlı)', ku: 'Tiştekî din heye ku divê em bizanin? (bi dilxwazî)' },
  'rw.privacy': { de: 'Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben nutzen, um Ihre Anfrage zu beantworten.', fr: 'En envoyant, vous acceptez que nous utilisions vos données pour répondre à votre demande.', en: 'By sending, you agree that we use your details to answer your enquiry.', tr: 'Göndererek, bilgilerinizi talebinizi yanıtlamak için kullanmamızı kabul edersiniz.', ku: 'Bi şandinê re hûn razî dibin ku em agahiyên we ji bo bersivdana daxwaza we bikar bînin.' },
  'rw.privacy.link': { de: 'Datenschutzerklärung', fr: 'Politique de confidentialité', en: 'Privacy policy', tr: 'Gizlilik politikası', ku: 'Siyaseta nepenîtiyê' },
  'rw.send': { de: 'Anfrage senden', fr: 'Envoyer la demande', en: 'Send request', tr: 'Talebi gönder', ku: 'Daxwazê bişîne' },
  'rw.sending': { de: 'Wird gesendet …', fr: 'Envoi …', en: 'Sending …', tr: 'Gönderiliyor …', ku: 'Tê şandin …' },
  'rw.invalid': { de: 'Bitte Ihren Namen und Telefon oder E-Mail angeben.', fr: 'Merci d’indiquer votre nom et un téléphone ou e-mail.', en: 'Please enter your name and a phone number or email.', tr: 'Lütfen adınızı ve telefon ya da e-posta bilgisini girin.', ku: 'Ji kerema xwe navê xwe û telefon an e-nameyê binivîsin.' },

  'rw.done.title': { de: 'Danke, {name}!', fr: 'Merci, {name} !', en: 'Thank you, {name}!', tr: 'Teşekkürler, {name}!', ku: 'Spas, {name}!' },
  'rw.done.text': { de: 'Ihre Anfrage ist bei uns angekommen. Wir melden uns in der Regel am nächsten Werktag.', fr: 'Votre demande nous est bien parvenue. Nous vous répondons en général le jour ouvré suivant.', en: 'Your request has reached us. We usually get back to you the next working day.', tr: 'Talebiniz bize ulaştı. Genellikle bir sonraki iş günü size döneriz.', ku: 'Daxwaza we gihîşt me. Em bi gelemperî rojê xebatê ya dawî vedigerin.' },
  'rw.done.sum': { de: 'Ihre Auswahl', fr: 'Votre choix', en: 'Your choice', tr: 'Seçiminiz', ku: 'Hilbijartina we' },
  'rw.done.urgent': { de: 'Es eilt? Rufen Sie einfach an oder schreiben Sie uns.', fr: 'Urgent ? Appelez-nous ou écrivez-nous.', en: 'In a hurry? Just call or message us.', tr: 'Acil mi? Bizi arayın ya da yazın.', ku: 'Lez e? Têlefon bikin an ji me re binivîsin.' },
  'rw.err.title': { de: 'Das hat gerade nicht geklappt.', fr: 'Cela n’a pas fonctionné.', en: 'That didn’t work just now.', tr: 'Bu şu an olmadı.', ku: 'Ev niha neçû serî.' },
  'rw.err.text': { de: 'Schreiben Sie uns bitte direkt — Ihre Angaben sind schon vorbereitet.', fr: 'Écrivez-nous directement — vos informations sont déjà préparées.', en: 'Please write to us directly — your details are already filled in.', tr: 'Lütfen doğrudan yazın — bilgileriniz hazır.', ku: 'Ji kerema xwe rasterast ji me re binivîsin — agahiyên we amade ne.' },
  'rw.mail': { de: 'Per E-Mail', fr: 'Par e-mail', en: 'By email', tr: 'E-posta ile', ku: 'Bi e-nameyê' },
  'rw.wa': { de: 'Per WhatsApp', fr: 'Par WhatsApp', en: 'By WhatsApp', tr: 'WhatsApp ile', ku: 'Bi WhatsApp' },
  'rw.call': { de: 'Anrufen', fr: 'Appeler', en: 'Call', tr: 'Ara', ku: 'Têlefon bike' },
  'rw.alt': { de: 'Lieber direkt?', fr: 'Plutôt en direct ?', en: 'Rather go direct?', tr: 'Doğrudan mı tercih edersiniz?', ku: 'Rasterast tercîh dikin?' },
};
