import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Produktseite /digitale-einladung. Werden von EinladungComponent
 * beim I18nService registriert. `{p}` ist ein Preis (I18nService.tp).
 */
export const EINLADUNG_CONTENT: Record<string, Entry> = {
  // ── SEO ──
  'seo.inv.title': {
    de: 'Digitale Einladung & Hochzeitswebsite ab {p} € | Breisgau Digital',
    en: 'Digital Invitation & Wedding Website from €{p} | Breisgau Digital',
    tr: 'Dijital Davetiye ve Düğün Sitesi {p} €’dan | Breisgau Digital',
  },
  'seo.inv.desc': {
    de: 'Online-Einladung für Hochzeit, Henna-Abend, Verlobung & Firmenevent: Zusagen, Gästeliste, Sitzplan, Countdown, Route, IBAN/PayPal und Fotoalbum — 11 Designs, 6 Sprachen.',
    en: 'Online invitation for weddings, henna nights, engagements and company events: RSVPs, guest list, seating plan, countdown, directions, IBAN/PayPal and photo album — 11 designs, 6 languages.',
    tr: 'Düğün, kına gecesi, nişan ve kurumsal etkinlikler için online davetiye: LCV, misafir listesi, oturma planı, geri sayım, yol tarifi, IBAN/PayPal ve fotoğraf albümü — 11 tasarım, 6 dil.',
  },

  // ── Kopf ──
  'inv.label': { de: 'Digitale Einladung · Hochzeit · Kına · Events', en: 'Digital invitation · Wedding · Henna · Events', tr: 'Dijital davetiye · Düğün · Kına · Etkinlik' },
  'inv.title': {
    de: 'Eure Einladung als<br /><em>eigene Website</em>.',
    en: 'Your invitation as<br /><em>its own website</em>.',
    tr: 'Davetiyeniz artık<br /><em>kendi web sitenizde</em>.',
  },
  'inv.intro': {
    de: 'Ein Link für alles: Gäste sehen Datum, Ablauf und Anfahrt, sagen mit einem Tipp zu, schenken per IBAN oder PayPal und laden ihre Fotos hoch. Ihr behaltet im Gastgeber-Planer Gästeliste, Sitzplan und Budget im Blick.',
    en: 'One link for everything: guests see the date, schedule and directions, RSVP with one tap, give gifts via IBAN or PayPal and upload their photos. You manage guest list, seating and budget in the host planner.',
    tr: 'Her şey tek bir linkte: misafirler tarihi, programı ve yol tarifini görür, tek dokunuşla katılımını bildirir, IBAN veya PayPal ile hediye gönderir ve fotoğraflarını yükler. Siz de ev sahibi panelinde misafir listesini, oturma planını ve bütçeyi yönetirsiniz.',
  },
  'inv.from': { de: 'ab {p} € einmalig — kein Abo', en: 'from €{p} one-off — no subscription', tr: '{p} €’dan başlayan tek seferlik fiyat — abonelik yok' },
  'inv.cta.demos': { de: 'Beispiele ansehen', en: 'See the examples', tr: 'Örnekleri gör' },
  'inv.cta.request': { de: 'Einladung anfragen', en: 'Request an invitation', tr: 'Davetiye talep et' },
  'inv.trust1': { de: '11 Designs', en: '11 designs', tr: '11 tasarım' },
  'inv.trust2': { de: '6 Sprachen inkl. Arabisch', en: '6 languages incl. Arabic', tr: 'Arapça dahil 6 dil' },
  'inv.trust3': { de: 'Keine App nötig', en: 'No app needed', tr: 'Uygulama gerekmez' },
  'inv.trust4': { de: 'Ohne Tracking', en: 'No tracking', tr: 'Takip yok' },

  // ── Designs ──
  'inv.themes.label': { de: '11 Designs, live zum Ausprobieren', en: '11 designs to try live', tr: 'Canlı deneyebileceğiniz 11 tasarım' },
  'inv.themes.title': {
    de: 'Für jede Feier<br /><em>und jede Kultur</em>.',
    en: 'For every celebration<br /><em>and every culture</em>.',
    tr: 'Her kutlamaya<br /><em>ve her kültüre</em> uygun.',
  },
  'inv.themes.text': {
    de: 'Öffnet ein Beispiel, schaltet Design, Sprache und Musik um, sagt testweise zu, ladet ein Foto hoch — alles funktioniert. Das Design lässt sich auch später jederzeit wechseln, ohne dass ein Text verloren geht.',
    en: 'Open an example, switch design, language and music, send a test RSVP, upload a photo — it all works. You can change the design at any time later without losing any text.',
    tr: 'Bir örneği açın; tasarımı, dili ve müziği değiştirin, deneme amaçlı katılım bildirin, fotoğraf yükleyin — her şey çalışıyor. Tasarım daha sonra da metinler kaybolmadan istediğiniz zaman değiştirilebilir.',
  },
  'inv.themes.open': { de: 'Live ansehen', en: 'View live', tr: 'Canlı gör' },
  'inv.themes.planner': { de: 'Planer', en: 'Planner', tr: 'Panel' },

  // ── Funktionen ──
  'inv.feat.label': { de: 'Alles drin', en: 'Everything included', tr: 'Her şey dahil' },
  'inv.feat.title': {
    de: 'Was eure Gäste sehen —<br /><em>und was ihr planen könnt</em>.',
    en: 'What your guests see —<br /><em>and what you can plan</em>.',
    tr: 'Misafirlerinizin gördükleri —<br /><em>ve sizin planladıklarınız</em>.',
  },
  'inv.f.rsvp.t': { de: 'Zusage mit einem Tipp', en: 'One-tap RSVP', tr: 'Tek dokunuşla LCV' },
  'inv.f.rsvp.d': { de: 'Personen, Kinder, Menüwunsch, Allergien und Musikwunsch — alles landet sofort in eurer Gästeliste.', en: 'Adults, children, menu choice, allergies and song requests — straight into your guest list.', tr: 'Kişi sayısı, çocuklar, menü tercihi, alerjiler ve şarkı istekleri — hepsi anında misafir listenize düşer.' },
  'inv.f.countdown.t': { de: 'Countdown & Kalender', en: 'Countdown & calendar', tr: 'Geri sayım ve takvim' },
  'inv.f.countdown.d': { de: 'Tage, Stunden, Minuten bis zum großen Tag — und mit einem Klick im Google-, Apple- oder Outlook-Kalender.', en: 'Days, hours, minutes to the big day — and one click into Google, Apple or Outlook calendar.', tr: 'Büyük güne kalan gün, saat, dakika — tek tıkla Google, Apple veya Outlook takvimine.' },
  'inv.f.route.t': { de: 'Route mit einem Klick', en: 'One-click directions', tr: 'Tek tıkla konuma git' },
  'inv.f.route.d': { de: 'Trauung, Feier, Hotel: jeder Ort mit Knopf für Google Maps, Apple Karten und Waze.', en: 'Ceremony, party, hotel: every venue with buttons for Google Maps, Apple Maps and Waze.', tr: 'Nikâh, düğün salonu, otel: her mekân için Google Maps, Apple Haritalar ve Waze butonu.' },
  'inv.f.gift.t': { de: 'IBAN, GiroCode & PayPal', en: 'IBAN, GiroCode & PayPal', tr: 'IBAN, GiroCode ve PayPal' },
  'inv.f.gift.d': { de: 'IBAN mit einem Tipp kopieren, GiroCode mit der Banking-App scannen oder direkt per PayPal schenken.', en: 'Copy the IBAN with one tap, scan the GiroCode with a banking app or give directly via PayPal.', tr: 'IBAN’ı tek dokunuşla kopyalama, banka uygulamasıyla GiroCode okutma veya doğrudan PayPal ile hediye.' },
  'inv.f.photos.t': { de: 'Fotoalbum & Diashow', en: 'Photo album & slideshow', tr: 'Fotoğraf albümü ve slayt' },
  'inv.f.photos.d': { de: 'Gäste laden ihre Fotos hoch, ihr eure eigenen. Auf der Feier läuft alles live als Diashow auf Beamer oder TV.', en: 'Guests upload their photos, you add yours. At the party it all runs live as a slideshow on projector or TV.', tr: 'Misafirler fotoğraflarını, siz de kendi fotoğraflarınızı yüklersiniz. Düğünde hepsi projeksiyon veya TV’de canlı slayt olarak döner.' },
  'inv.f.music.t': { de: 'Hintergrundmusik', en: 'Background music', tr: 'Arka plan müziği' },
  'inv.f.music.d': { de: 'Klavier, Streicher, Oud, Gitarre, Lounge oder euer eigenes Lied — startet beim Öffnen des Umschlags.', en: 'Piano, strings, oud, guitar, lounge or your own song — starts when the envelope opens.', tr: 'Piyano, yaylılar, ud, gitar, lounge veya kendi şarkınız — zarf açılınca başlar.' },
  'inv.f.lang.t': { de: '6 Sprachen, auch von rechts nach links', en: '6 languages, right-to-left too', tr: 'Sağdan sola dahil 6 dil' },
  'inv.f.lang.d': { de: 'Deutsch, Türkisch, Englisch, Französisch, Kurdisch und Arabisch — jeder Gast liest in seiner Sprache.', en: 'German, Turkish, English, French, Kurdish and Arabic — every guest reads in their language.', tr: 'Almanca, Türkçe, İngilizce, Fransızca, Kürtçe ve Arapça — her misafir kendi dilinde okur.' },
  'inv.f.guests.t': { de: 'Gästeliste & persönliche Links', en: 'Guest list & personal links', tr: 'Misafir listesi ve kişisel linkler' },
  'inv.f.guests.d': { de: 'Jeder Gast bekommt seinen eigenen Link per WhatsApp — mit Namen begrüßt. Export als Excel-Liste für Location und Caterer.', en: 'Every guest gets their own link via WhatsApp — greeted by name. Export to Excel for venue and caterer.', tr: 'Her misafire WhatsApp ile kendi linki — adıyla karşılanır. Mekân ve catering için Excel çıktısı.' },
  'inv.f.seating.t': { de: 'Sitzplan', en: 'Seating plan', tr: 'Oturma planı' },
  'inv.f.seating.d': { de: 'Tische anlegen, Gäste per Tippen oder Ziehen verteilen, Plätze im Blick — und als Liste drucken.', en: 'Create tables, place guests by tap or drag, keep an eye on seats — and print the plan.', tr: 'Masalar oluşturun, misafirleri dokunarak veya sürükleyerek yerleştirin, planı yazdırın.' },
  'inv.f.plan.t': { de: 'Checkliste & Budget', en: 'Checklist & budget', tr: 'Yapılacaklar ve bütçe' },
  'inv.f.plan.d': { de: 'Fertige Checkliste vom Location-Termin bis zum Diashow-Test, dazu Budget mit Kosten pro Gast.', en: 'A ready-made checklist from venue booking to slideshow test, plus a budget with cost per guest.', tr: 'Mekân rezervasyonundan slayt testine hazır yapılacaklar listesi; misafir başı maliyetli bütçe.' },
  'inv.f.theme.t': { de: 'Design jederzeit wechseln', en: 'Switch design anytime', tr: 'Temayı istediğiniz an değiştirin' },
  'inv.f.theme.d': { de: 'Elf Designs, jedes mit eigener Öffnung (Umschlag, Tauben, Samtvorhang, Flügeltür), gezeichneten Ornamenten und Animationen — der Inhalt bleibt, nur das Kleid wechselt.', en: 'Eleven designs, each with its own opening (envelope, doves, velvet curtain, carved doors), hand-drawn ornaments and animations — the content stays, only the look changes.', tr: 'On bir tasarım; her birinin kendi açılışı (zarf, güvercinler, kadife perde, oymalı kapı), çizim süslemeleri ve animasyonları var — içerik kalır, sadece görünüm değişir.' },
  'inv.f.privacy.t': { de: 'Privat & datensparsam', en: 'Private & data-minimal', tr: 'Gizli ve veri dostu' },
  'inv.f.privacy.d': { de: 'Nicht in Suchmaschinen, kein Tracking, Planer nur mit eurem Schlüssel. Die Gästeliste sieht niemand außer euch.', en: 'Not in search engines, no tracking, planner only with your key. Nobody but you sees the guest list.', tr: 'Arama motorlarında görünmez, takip yok, panel sadece size özel anahtarla. Misafir listesini sizden başkası göremez.' },

  // ── Anlässe ──
  'inv.occ.label': { de: 'Anlässe', en: 'Occasions', tr: 'Etkinlikler' },
  'inv.occ.title': { de: 'Von der Kına bis zur <em>Jahrestagung</em>.', en: 'From henna night to <em>annual meeting</em>.', tr: 'Kına gecesinden <em>yıllık toplantıya</em>.' },
  'inv.occ.1': { de: 'Hochzeit & Standesamt', en: 'Wedding & civil ceremony', tr: 'Düğün ve nikâh' },
  'inv.occ.2': { de: 'Kına / Henna-Abend', en: 'Kına / henna night', tr: 'Kına gecesi' },
  'inv.occ.3': { de: 'Verlobung / Nişan', en: 'Engagement', tr: 'Nişan / söz' },
  'inv.occ.4': { de: 'Mehndi & arabische Hochzeit', en: 'Mehndi & Arab wedding', tr: 'Mehndi ve Arap düğünü' },
  'inv.occ.5': { de: 'Geburtstag & Jubiläum', en: 'Birthday & anniversary', tr: 'Doğum günü ve yıl dönümü' },
  'inv.occ.6': { de: 'Firmenevent, Meeting, Eröffnung', en: 'Company event, meeting, opening', tr: 'Kurumsal etkinlik, toplantı, açılış' },
  'inv.occ.7': { de: 'Taufe, Sünnet & Familienfeste', en: 'Christening, sünnet & family parties', tr: 'Sünnet, vaftiz ve aile kutlamaları' },

  // ── Pakete ──
  'inv.pkg.label': { de: 'Preise', en: 'Pricing', tr: 'Fiyatlar' },
  'inv.pkg.title': { de: 'Einmal zahlen, <em>ein Jahr online</em>.', en: 'Pay once, <em>online for a year</em>.', tr: 'Bir kez ödeyin, <em>bir yıl yayında</em>.' },
  'inv.pkg.price': { de: '{p} €', en: '€{p}', tr: '{p} €' },
  'inv.pkg.once': { de: 'einmalig je Event', en: 'one-off per event', tr: 'etkinlik başına tek sefer' },
  'inv.pkg.badge': { de: 'Meistgewählt', en: 'Most chosen', tr: 'En çok tercih edilen' },
  'inv.pkg.basis.name': { de: 'Basis', en: 'Basic', tr: 'Temel' },
  'inv.pkg.basis.for': { de: 'Für kleine Feiern, schnell online.', en: 'For small celebrations, online fast.', tr: 'Küçük kutlamalar için, hızlıca yayında.' },
  'inv.pkg.basis.p1': { de: '1 Design nach Wahl, 1 Sprache', en: '1 design of your choice, 1 language', tr: 'Seçtiğiniz 1 tasarım, 1 dil' },
  'inv.pkg.basis.p2': { de: 'Countdown, Ablauf, Route', en: 'Countdown, schedule, directions', tr: 'Geri sayım, program, yol tarifi' },
  'inv.pkg.basis.p3': { de: 'Online-Zusage mit Gästeliste', en: 'Online RSVP with guest list', tr: 'Online katılım ve misafir listesi' },
  'inv.pkg.basis.p4': { de: 'IBAN & PayPal mit Kopierknopf', en: 'IBAN & PayPal with copy button', tr: 'Kopyalama butonlu IBAN ve PayPal' },
  'inv.pkg.basis.p5': { de: '12 Monate online', en: '12 months online', tr: '12 ay yayında' },
  'inv.pkg.premium.name': { de: 'Premium', en: 'Premium', tr: 'Premium' },
  'inv.pkg.premium.for': { de: 'Für Hochzeit und Kına mit vielen Gästen.', en: 'For weddings and henna nights with many guests.', tr: 'Kalabalık düğün ve kına geceleri için.' },
  'inv.pkg.premium.p1': { de: 'Alles aus Basis, alle 6 Sprachen', en: 'Everything in Basic, all 6 languages', tr: 'Temel’deki her şey, 6 dil' },
  'inv.pkg.premium.p2': { de: 'Musik, Menüwahl, Musikwünsche', en: 'Music, menu choice, song requests', tr: 'Müzik, menü seçimi, şarkı istekleri' },
  'inv.pkg.premium.p3': { de: 'Fotoalbum der Gäste & Diashow', en: 'Guest photo album & slideshow', tr: 'Misafir fotoğraf albümü ve slayt' },
  'inv.pkg.premium.p4': { de: 'Persönliche Links & WhatsApp-Versand', en: 'Personal links & WhatsApp sending', tr: 'Kişisel linkler ve WhatsApp gönderimi' },
  'inv.pkg.premium.p5': { de: 'Gastgeber-Planer: Sitzplan, Checkliste, Budget', en: 'Host planner: seating, checklist, budget', tr: 'Ev sahibi paneli: oturma planı, yapılacaklar, bütçe' },
  'inv.pkg.premium.p6': { de: 'Eigene Fotos, Design jederzeit wechselbar', en: 'Your own photos, design changeable anytime', tr: 'Kendi fotoğraflarınız, tasarım her an değişebilir' },
  'inv.pkg.komplett.name': { de: 'Rundum', en: 'All-inclusive', tr: 'Her şey dahil' },
  'inv.pkg.komplett.for': { de: 'Wir richten alles für euch ein.', en: 'We set everything up for you.', tr: 'Her şeyi sizin için biz kuruyoruz.' },
  'inv.pkg.komplett.p1': { de: 'Alles aus Premium', en: 'Everything in Premium', tr: 'Premium’daki her şey' },
  'inv.pkg.komplett.p2': { de: 'Texte & Übersetzungen von uns eingepflegt', en: 'Texts & translations entered by us', tr: 'Metin ve çevirileri biz giriyoruz' },
  'inv.pkg.komplett.p3': { de: 'Farben & Schrift nach euren Wünschen', en: 'Colours & fonts to your wishes', tr: 'İsteğinize göre renk ve yazı tipi' },
  'inv.pkg.komplett.p4': { de: 'Eigene Adresse (z. B. ayse-und-daniel.de)', en: 'Your own address (e.g. ayse-and-daniel.com)', tr: 'Size özel alan adı (ör. ayse-daniel.de)' },
  'inv.pkg.komplett.p5': { de: 'QR-Karten für Tische & Druck-Einladung', en: 'QR cards for tables & printed invite', tr: 'Masalar için QR kartlar ve basılı davetiye' },
  'inv.pkg.komplett.p6': { de: 'Persönliche Betreuung bis nach der Feier', en: 'Personal support until after the party', tr: 'Düğün sonrasına kadar birebir destek' },
  'inv.pkg.cta': { de: 'Paket anfragen', en: 'Request package', tr: 'Paketi talep et' },

  // ── Ablauf ──
  'inv.steps.label': { de: 'So läuft es', en: 'How it works', tr: 'Nasıl çalışır' },
  'inv.steps.title': { de: 'In vier Schritten <em>zur Einladung</em>.', en: 'Four steps <em>to your invitation</em>.', tr: 'Dört adımda <em>davetiyeniz hazır</em>.' },
  'inv.step1.t': { de: 'Design aussuchen', en: 'Pick a design', tr: 'Tasarımı seçin' },
  'inv.step1.d': { de: 'Beispiele ansehen, Paket anfragen — wir melden uns noch am selben Tag.', en: 'Browse the examples, send a request — we reply the same day.', tr: 'Örneklere bakın, talep gönderin — aynı gün dönüyoruz.' },
  'inv.step2.t': { de: 'Link & Planer bekommen', en: 'Get link & planner', tr: 'Link ve paneli alın' },
  'inv.step2.d': { de: 'Ihr erhaltet eure Einladungsadresse und den Zugang zum Gastgeber-Planer.', en: 'You receive your invitation address and access to the host planner.', tr: 'Davetiye adresinizi ve ev sahibi paneli erişiminizi alırsınız.' },
  'inv.step3.t': { de: 'Inhalte eintragen', en: 'Fill in the content', tr: 'İçeriği girin' },
  'inv.step3.d': { de: 'Namen, Ablauf, Orte, Fotos, IBAN — selbst im Planer oder wir machen es (Rundum).', en: 'Names, schedule, venues, photos, IBAN — yourself in the planner, or we do it (All-inclusive).', tr: 'İsimler, program, mekânlar, fotoğraflar, IBAN — panelde kendiniz ya da biz (Her şey dahil).' },
  'inv.step4.t': { de: 'Per WhatsApp verschicken', en: 'Send via WhatsApp', tr: 'WhatsApp ile gönderin' },
  'inv.step4.d': { de: 'Link teilen, Zusagen sammeln, Sitzplan bauen — und am Tag selbst die Diashow starten.', en: 'Share the link, collect RSVPs, build the seating plan — and start the slideshow on the day.', tr: 'Linki paylaşın, yanıtları toplayın, oturma planını yapın — ve günü gelince slaytı başlatın.' },

  // ── FAQ ──
  'inv.faq.label': { de: 'Häufige Fragen', en: 'FAQ', tr: 'Sık sorulan sorular' },
  'inv.faq.title': { de: 'Gut zu <em>wissen</em>.', en: 'Good to <em>know</em>.', tr: 'Bilmeniz <em>gerekenler</em>.' },
  'inv.faq1.q': { de: 'Brauchen unsere Gäste eine App?', en: 'Do our guests need an app?', tr: 'Misafirlerimizin uygulama indirmesi gerekiyor mu?' },
  'inv.faq1.a': { de: 'Nein. Die Einladung ist eine Website und öffnet sich auf jedem Handy, Tablet und Computer direkt aus WhatsApp, SMS oder E-Mail.', en: 'No. The invitation is a website that opens on any phone, tablet or computer straight from WhatsApp, text or e-mail.', tr: 'Hayır. Davetiye bir web sitesidir; WhatsApp, SMS veya e-postadan her telefonda, tablette ve bilgisayarda doğrudan açılır.' },
  'inv.faq2.q': { de: 'Können wir Texte später noch ändern?', en: 'Can we change texts later?', tr: 'Metinleri sonradan değiştirebilir miyiz?' },
  'inv.faq2.a': { de: 'Jederzeit — im Gastgeber-Planer. Auch Design, Musik und Sprachen lassen sich bis zum Schluss wechseln; die Gäste sehen sofort den neuen Stand.', en: 'Any time — in the host planner. Design, music and languages can be switched right up to the end; guests see the update immediately.', tr: 'İstediğiniz zaman, ev sahibi panelinden. Tasarım, müzik ve diller de sonuna kadar değiştirilebilir; misafirler güncel hali hemen görür.' },
  'inv.faq3.q': { de: 'Wie kommen die Geldgeschenke an?', en: 'How do monetary gifts arrive?', tr: 'Para hediyeleri nasıl ulaşıyor?' },
  'inv.faq3.a': { de: 'Direkt auf euer Konto bzw. PayPal — wir sind nicht dazwischen. Die Seite zeigt nur IBAN, GiroCode und PayPal-Link an.', en: 'Straight into your account or PayPal — we are not in between. The page only shows IBAN, GiroCode and PayPal link.', tr: 'Doğrudan hesabınıza veya PayPal’ınıza — arada biz yokuz. Sayfa yalnızca IBAN, GiroCode ve PayPal linkini gösterir.' },
  'inv.faq4.q': { de: 'Wer kann die Gästeliste sehen?', en: 'Who can see the guest list?', tr: 'Misafir listesini kim görebilir?' },
  'inv.faq4.a': { de: 'Nur ihr, mit eurem persönlichen Planer-Schlüssel. Die Einladung steht nicht in Google, und Gäste sehen nur ihre eigene Antwort.', en: 'Only you, with your personal planner key. The invitation is not on Google, and guests only see their own reply.', tr: 'Sadece siz, kişisel panel anahtarınızla. Davetiye Google’da görünmez, misafirler yalnızca kendi yanıtlarını görür.' },
  'inv.faq5.q': { de: 'Wie lange bleibt die Einladung online?', en: 'How long does the invitation stay online?', tr: 'Davetiye ne kadar süre yayında kalır?' },
  'inv.faq5.a': { de: '12 Monate ab Freischaltung — also auch nach der Feier für Fotos und Dankesgrüße. Verlängern ist jederzeit möglich.', en: '12 months from activation — so also after the party for photos and thank-yous. Extensions are possible.', tr: 'Yayına alındıktan itibaren 12 ay — yani düğünden sonra fotoğraflar ve teşekkürler için de. Uzatma mümkündür.' },
  'inv.faq6.q': { de: 'Arbeitet ihr nur in Freiburg?', en: 'Do you only work in Freiburg?', tr: 'Sadece Freiburg’da mı çalışıyorsunuz?' },
  'inv.faq6.a': { de: 'Nein. Wir sitzen in Freiburg im Breisgau, die Einladungen machen wir für Feiern in ganz Deutschland, Österreich, der Schweiz und darüber hinaus — Beratung gern auf Deutsch, Türkisch oder Englisch.', en: 'No. We are based in Freiburg im Breisgau and make invitations for celebrations across Germany, Austria, Switzerland and beyond — advice in German, Turkish or English.', tr: 'Hayır. Freiburg im Breisgau’dayız; davetiyeleri tüm Almanya, Avusturya, İsviçre ve ötesindeki kutlamalar için hazırlıyoruz — Almanca, Türkçe veya İngilizce danışmanlık.' },

  // ── Abschluss ──
  'inv.cta.title': { de: 'Bereit für eure <em>Einladung</em>?', en: 'Ready for your <em>invitation</em>?', tr: '<em>Davetiyeniz</em> için hazır mısınız?' },
  'inv.cta.text': { de: 'Schreibt uns Datum, Anlass und Wunsch-Design — ihr bekommt noch am selben Tag Antwort.', en: 'Send us the date, occasion and preferred design — you’ll hear back the same day.', tr: 'Bize tarihi, etkinliği ve istediğiniz tasarımı yazın — aynı gün dönüş yapıyoruz.' },
  'inv.wa.text': { de: 'Hallo! Ich interessiere mich für eine digitale Einladung.', en: 'Hi! I’m interested in a digital invitation.', tr: 'Merhaba! Dijital davetiye ile ilgileniyorum.' },
};
