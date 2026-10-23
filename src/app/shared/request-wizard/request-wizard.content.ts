import type { Entry } from '../../core/i18n/translations';

/**
 * Texte des Anfrage-Assistenten. Der Assistent führt in drei kurzen Schritten
 * zur Anfrage: Leistung wählen, Paket oder Größe wählen, Kontakt hinterlassen.
 * Jeder Schritt ist ein Tipp oder ein, zwei Felder — nichts davon ist Pflicht
 * außer Name und Erreichbarkeit.
 */
export const REQUEST_WIZARD_CONTENT: Record<string, Entry> = {
  'rw.progress': { de: 'Schritt {n} von {t}', en: 'Step {n} of {t}', tr: 'Adım {n} / {t}' },
  'rw.back': { de: 'Zurück', en: 'Back', tr: 'Geri' },

  'rw.q1': { de: 'Was möchten Sie?', en: 'What would you like?', tr: 'Ne istiyorsunuz?' },
  'rw.q1.hint': {
    de: 'Ein Tipp genügt — Sie können im Gespräch alles noch ändern.',
    en: 'One tap is enough — you can still change everything when we talk.',
    tr: 'Bir dokunuş yeter — görüşmede her şeyi değiştirebilirsiniz.',
  },
  'rw.s.new.t': { de: 'Neue Website', en: 'A new website', tr: 'Yeni web sitesi' },
  'rw.s.new.d': { de: 'Ich habe noch keine oder möchte eine ganz neue.', en: 'I don’t have one yet or want a completely new one.', tr: 'Henüz yok ya da tamamen yenisini istiyorum.' },
  'rw.s.update.t': { de: 'Bestehende Website aufbessern', en: 'Improve my current website', tr: 'Mevcut siteyi yenilemek' },
  'rw.s.update.d': { de: 'Neues Design, schneller, gut auf dem Handy — ab {p} €.', en: 'New design, faster, great on mobile — from €{p}.', tr: 'Yeni tasarım, daha hızlı, mobilde iyi — {p} €’dan.' },
  'rw.s.wartung.t': { de: 'Website betreuen lassen', en: 'Have my website looked after', tr: 'Sitemin bakımını yaptırmak' },
  'rw.s.wartung.d': { de: 'Hosting, Updates, Backups, kleine Änderungen — ab {p} € im Monat.', en: 'Hosting, updates, backups, small changes — from €{p} a month.', tr: 'Barındırma, güncelleme, yedek, küçük değişiklikler — aylık {p} €’dan.' },
  'rw.s.other.t': { de: 'Etwas anderes', en: 'Something else', tr: 'Başka bir şey' },
  'rw.s.other.d': { de: 'Online-Shop, Web-App, Buchungssystem oder eine Frage.', en: 'Online shop, web app, booking system or a question.', tr: 'Online mağaza, web uygulaması, randevu sistemi ya da bir soru.' },

  'rw.q2.new': { de: 'Wie groß soll die Website werden?', en: 'How big should the website be?', tr: 'Web sitesi ne kadar büyük olmalı?' },
  'rw.q2.update': { de: 'Welches Paket passt?', en: 'Which package fits?', tr: 'Hangi paket uygun?' },
  'rw.q2.wartung': { de: 'Wie viel Betreuung brauchen Sie?', en: 'How much support do you need?', tr: 'Ne kadar desteğe ihtiyacınız var?' },
  'rw.q2.other': { de: 'Worum geht es?', en: 'What is it about?', tr: 'Konu nedir?' },
  'rw.unsure': { de: 'Weiß ich noch nicht', en: 'Not sure yet', tr: 'Henüz bilmiyorum' },
  'rw.unsure.d': { de: 'Kein Problem — wir klären das gemeinsam.', en: 'No problem — we’ll work it out together.', tr: 'Sorun değil — birlikte netleştiririz.' },

  'rw.size.small.t': { de: 'Klein', en: 'Small', tr: 'Küçük' },
  'rw.size.small.d': { de: 'Bis 5 Seiten: Start, Leistungen, Über uns, Kontakt.', en: 'Up to 5 pages: home, services, about, contact.', tr: '5 sayfaya kadar: ana sayfa, hizmetler, hakkımızda, iletişim.' },
  'rw.size.company.t': { de: 'Firmen-Website', en: 'Company website', tr: 'Kurumsal web sitesi' },
  'rw.size.company.d': { de: 'Bis etwa 15 Seiten, auf Wunsch mehrsprachig.', en: 'Up to about 15 pages, multilingual if you like.', tr: 'Yaklaşık 15 sayfaya kadar, isteğe bağlı çok dilli.' },
  'rw.size.custom.t': { de: 'Mit Shop, Buchung oder App', en: 'With shop, booking or app', tr: 'Mağaza, randevu veya uygulama ile' },
  'rw.size.custom.d': { de: 'Online verkaufen, Termine vergeben oder eigene Funktionen.', en: 'Sell online, take bookings or custom features.', tr: 'Online satış, randevu ya da özel işlevler.' },

  'rw.other.shop': { de: 'Online-Shop', en: 'Online shop', tr: 'Online mağaza' },
  'rw.other.app': { de: 'Web-App oder Software', en: 'Web app or software', tr: 'Web uygulaması veya yazılım' },
  'rw.other.booking': { de: 'Buchungssystem', en: 'Booking system', tr: 'Randevu sistemi' },
  'rw.other.invite': { de: 'Digitale Einladung (Hochzeit, Kına, Event)', en: 'Digital invitation (wedding, henna, event)', tr: 'Dijital davetiye (düğün, kına, etkinlik)' },
  'rw.other.question': { de: 'Nur eine Frage', en: 'Just a question', tr: 'Sadece bir soru' },

  'rw.pkg.days': { de: 'Fertig in {p} Werktagen', en: 'Done in {p} working days', tr: '{p} iş gününde hazır' },
  'rw.pkg.month': { de: '{p} € im Monat', en: '€{p} a month', tr: 'Aylık {p} €' },

  'rw.q3': { de: 'Wie erreichen wir Sie?', en: 'How can we reach you?', tr: 'Size nasıl ulaşalım?' },
  'rw.q3.hint': { de: 'Zwei Angaben genügen. Der Rest ist freiwillig.', en: 'Two details are enough. The rest is optional.', tr: 'İki bilgi yeter. Gerisi isteğe bağlı.' },
  'rw.f.name': { de: 'Ihr Name', en: 'Your name', tr: 'Adınız' },
  'rw.f.reach': { de: 'Telefon oder E-Mail', en: 'Phone or email', tr: 'Telefon veya e-posta' },
  'rw.f.business': { de: 'Ihr Betrieb (freiwillig)', en: 'Your business (optional)', tr: 'İşletmeniz (isteğe bağlı)' },
  'rw.f.website': { de: 'Adresse Ihrer jetzigen Website (freiwillig)', en: 'Address of your current website (optional)', tr: 'Mevcut web sitenizin adresi (isteğe bağlı)' },
  'rw.f.slot': { de: 'Wann passt ein Rückruf?', en: 'When suits a call back?', tr: 'Ne zaman aransın?' },
  'rw.slot.any': { de: 'Egal', en: 'Any time', tr: 'Fark etmez' },
  'rw.slot.morning': { de: 'Vormittags', en: 'Mornings', tr: 'Sabah' },
  'rw.slot.afternoon': { de: 'Nachmittags', en: 'Afternoons', tr: 'Öğleden sonra' },
  'rw.slot.evening': { de: 'Abends', en: 'Evenings', tr: 'Akşam' },
  'rw.f.note': { de: 'Noch etwas, das wir wissen sollten? (freiwillig)', en: 'Anything else we should know? (optional)', tr: 'Bilmemiz gereken başka bir şey var mı? (isteğe bağlı)' },
  'rw.privacy': { de: 'Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben nutzen, um Ihre Anfrage zu beantworten.', en: 'By sending, you agree that we use your details to answer your enquiry.', tr: 'Göndererek, bilgilerinizi talebinizi yanıtlamak için kullanmamızı kabul edersiniz.' },
  'rw.privacy.link': { de: 'Datenschutzerklärung', en: 'Privacy policy', tr: 'Gizlilik politikası' },
  'rw.send': { de: 'Anfrage senden', en: 'Send request', tr: 'Talebi gönder' },
  'rw.sending': { de: 'Wird gesendet …', en: 'Sending …', tr: 'Gönderiliyor …' },
  'rw.invalid': { de: 'Bitte Ihren Namen und Telefon oder E-Mail angeben.', en: 'Please enter your name and a phone number or email.', tr: 'Lütfen adınızı ve telefon ya da e-posta bilgisini girin.' },

  'rw.done.title': { de: 'Danke, {name}!', en: 'Thank you, {name}!', tr: 'Teşekkürler, {name}!' },
  'rw.done.text': { de: 'Ihre Anfrage ist bei uns angekommen. Wir melden uns in der Regel am nächsten Werktag.', en: 'Your request has reached us. We usually get back to you the next working day.', tr: 'Talebiniz bize ulaştı. Genellikle bir sonraki iş günü size döneriz.' },
  'rw.done.sum': { de: 'Ihre Auswahl', en: 'Your choice', tr: 'Seçiminiz' },
  'rw.done.urgent': { de: 'Es eilt? Rufen Sie einfach an oder schreiben Sie uns.', en: 'In a hurry? Just call or message us.', tr: 'Acil mi? Bizi arayın ya da yazın.' },
  'rw.err.title': { de: 'Das hat gerade nicht geklappt.', en: 'That didn’t work just now.', tr: 'Bu şu an olmadı.' },
  'rw.err.text': { de: 'Schreiben Sie uns bitte direkt — Ihre Angaben sind schon vorbereitet.', en: 'Please write to us directly — your details are already filled in.', tr: 'Lütfen doğrudan yazın — bilgileriniz hazır.' },
  'rw.mail': { de: 'Per E-Mail', en: 'By email', tr: 'E-posta ile' },
  'rw.wa': { de: 'Per WhatsApp', en: 'By WhatsApp', tr: 'WhatsApp ile' },
  'rw.call': { de: 'Anrufen', en: 'Call', tr: 'Ara' },
  'rw.alt': { de: 'Lieber direkt?', en: 'Rather go direct?', tr: 'Doğrudan mı tercih edersiniz?' },
};
