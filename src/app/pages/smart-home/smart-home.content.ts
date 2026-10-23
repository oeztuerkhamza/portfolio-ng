import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Smart-Home-Seite. Werden von SmartHomeComponent beim
 * I18nService registriert und landen so im Lazy-Chunk der Seite.
 */
export const SMART_HOME_CONTENT: Record<string, Entry> = {
  'sh.folio': { de: 'Smart Home', en: 'Smart home', tr: 'Akıllı ev' },
  'sh.label': { de: 'Produkt', en: 'Product', tr: 'Ürün' },
  'sh.title': {
    de: 'Smart Home, das<br /><em>Energie und Wege spart</em>.',
    en: 'Smart home tech that<br /><em>saves energy and trips</em>.',
    tr: 'Enerji ve zaman<br /><em>kazandıran akıllı ev</em>.',
  },
  'sh.title.plain': {
    de: 'Smart Home & Automatisierung für Betriebe und Vermieter',
    en: 'Smart home & automation for businesses and landlords',
    tr: 'İşletmeler ve ev sahipleri için akıllı ev ve otomasyon',
  },
  'sh.intro': {
    de: 'Heizung, Licht und Zutritt, die sich selbst steuern — im Laden, in der Praxis, im Büro oder in der Ferienwohnung. <strong>Funkbasiert, ohne neue Kabel, lokal gesteuert statt über eine fremde Cloud.</strong>',
    en: 'Heating, lighting and access that run themselves — in your shop, practice, office or holiday flat. <strong>Wireless, no new cables, controlled locally instead of through someone else’s cloud.</strong>',
    tr: 'Kendi kendini yöneten ısıtma, aydınlatma ve giriş — dükkânda, muayenehanede, ofiste veya tatil dairesinde. <strong>Kablosuz, yeni kablo yok, yabancı bir bulut yerine yerel kontrol.</strong>',
  },
  'sh.cta.check': { de: 'Smart-Home-Check buchen', en: 'Book a smart-home check', tr: 'Akıllı ev kontrolü ayarla' },
  'sh.cta.order': { de: 'Anfragen', en: 'Enquire', tr: 'Talep et' },
  'sh.img.alt': {
    de: 'Smart-Home-Geräte von oben: Smartphone mit Steuerungs-App, Thermostat, Türschloss-Tastatur, Zwischenstecker, Tür- und Bewegungssensor',
    en: 'Smart-home devices from above: smartphone with control app, thermostat, door-lock keypad, smart plug, door and motion sensors',
    tr: 'Üstten akıllı ev cihazları: kontrol uygulamalı telefon, termostat, kapı kilidi tuş takımı, akıllı priz, kapı ve hareket sensörü',
  },
  'sh.use.label': { de: 'Anwendungen', en: 'Use cases', tr: 'Kullanım alanları' },
  'sh.use.title': {
    de: 'Wo sich Automatisierung<br /><em>wirklich rechnet</em>.',
    en: 'Where automation<br /><em>actually pays off</em>.',
    tr: 'Otomasyonun<br /><em>gerçekten kazandırdığı yerler</em>.',
  },
  'sh.use1.t': { de: 'Heizung nach Öffnungszeiten', en: 'Heating by opening hours', tr: 'Açılış saatine göre ısıtma' },
  'sh.use1.d': {
    de: 'Smarte Thermostate heizen nur, wenn geöffnet ist, und senken nachts und am Wochenende ab. Fenster auf? Heizung aus.',
    en: 'Smart thermostats only heat while you are open and turn down at night and at weekends. Window open? Heating off.',
    tr: 'Akıllı termostatlar yalnızca açıkken ısıtır, gece ve hafta sonu düşürür. Pencere açık mı? Isıtma kapanır.',
  },
  'sh.use2.t': { de: 'Self-Check-in für Gäste', en: 'Guest self check-in', tr: 'Misafir için kendi kendine giriş' },
  'sh.use2.d': {
    de: 'Smartes Türschloss mit eigenem Code pro Gast. Keine Schlüsselübergabe, der Code verfällt nach der Abreise.',
    en: 'A smart lock with its own code per guest. No key handover, and the code expires after check-out.',
    tr: 'Her misafire ayrı kodlu akıllı kilit. Anahtar teslimi yok, kod ayrılıştan sonra geçersiz olur.',
  },
  'sh.use3.t': { de: 'Licht & Schaufenster', en: 'Lighting & shop window', tr: 'Işık ve vitrin' },
  'sh.use3.d': {
    de: 'Licht nach Zeitplan oder Bewegung, das Schaufenster abends automatisch an und nachts aus.',
    en: 'Lights on a schedule or by motion, the shop window on in the evening and off at night — automatically.',
    tr: 'Zaman planına veya harekete göre ışık; vitrin akşam otomatik açılır, gece kapanır.',
  },
  'sh.use4.t': { de: 'Energie im Blick', en: 'Energy at a glance', tr: 'Enerji kontrolde' },
  'sh.use4.d': {
    de: 'Zwischenstecker und Zähler-Auslesung zeigen, welche Geräte Strom fressen — übersichtlich auf dem Handy.',
    en: 'Smart plugs and meter readings show which devices eat power — clearly laid out on your phone.',
    tr: 'Akıllı prizler ve sayaç okuma hangi cihazın elektrik yediğini gösterir — telefonunuzda net biçimde.',
  },
  'sh.use5.t': { de: 'Sicherheit & Meldungen', en: 'Security & alerts', tr: 'Güvenlik ve bildirimler' },
  'sh.use5.d': {
    de: 'Tür- und Fenstersensoren, Wassermelder im Keller: eine Nachricht aufs Handy statt einer bösen Überraschung am Montag.',
    en: 'Door and window sensors, a leak detector in the basement: a message on your phone instead of a nasty surprise on Monday.',
    tr: 'Kapı ve pencere sensörleri, bodrumda su kaçağı dedektörü: pazartesi kötü sürpriz yerine telefona bildirim.',
  },
  'sh.use6.t': { de: 'Eine App für alles', en: 'One app for everything', tr: 'Her şey için tek uygulama' },
  'sh.use6.d': {
    de: 'Statt fünf Hersteller-Apps eine Oberfläche — auf dem Handy, als Tablet an der Wand oder per Sprachbefehl.',
    en: 'One interface instead of five vendor apps — on your phone, a wall-mounted tablet or by voice.',
    tr: 'Beş üretici uygulaması yerine tek arayüz — telefonda, duvardaki tablette veya sesli komutla.',
  },
  'sh.pkg.label': { de: 'Pakete', en: 'Packages', tr: 'Paketler' },
  'sh.pkg.title': {
    de: 'Klein anfangen,<br /><em>später erweitern</em>.',
    en: 'Start small,<br /><em>grow later</em>.',
    tr: 'Küçük başlayın,<br /><em>sonra büyütün</em>.',
  },
  'sh.pkg.badge': { de: 'Beliebt', en: 'Popular', tr: 'Popüler' },
  'sh.pkg.check.name': { de: 'Smart-Home-Check', en: 'Smart-home check', tr: 'Akıllı ev kontrolü' },
  'sh.pkg.check.for': {
    de: 'Für alle, die erst wissen wollen, was sich lohnt', en: 'For anyone who wants to know what pays off first', tr: 'Önce neyin değdiğini bilmek isteyenler için',
  },
  'sh.pkg.check.p1': {
    de: 'Termin vor Ort, ca. 60 Minuten', en: 'On-site visit, about 60 minutes', tr: 'Yerinde ziyaret, yaklaşık 60 dakika',
  },
  'sh.pkg.check.p2': {
    de: 'Bestandsaufnahme: Heizung, Licht, Türen, WLAN', en: 'Survey: heating, lighting, doors, Wi-Fi', tr: 'Mevcut durum: ısıtma, ışık, kapılar, Wi-Fi',
  },
  'sh.pkg.check.p3': {
    de: 'Schriftliche Empfehlung mit Geräteliste und Festpreis', en: 'Written recommendation with device list and fixed price', tr: 'Cihaz listesi ve sabit fiyatlı yazılı öneri',
  },
  'sh.pkg.check.p4': {
    de: 'Wird bei Beauftragung voll angerechnet', en: 'Fully credited if you go ahead', tr: 'Sipariş verirseniz tamamen düşülür',
  },
  'sh.pkg.start.name': { de: 'Starter', en: 'Starter', tr: 'Başlangıç' },
  'sh.pkg.start.for': {
    de: 'Für einen Laden, eine Praxis oder eine Ferienwohnung', en: 'For one shop, practice or holiday flat', tr: 'Bir dükkân, muayenehane veya tatil dairesi için',
  },
  'sh.pkg.start.p1': {
    de: 'Lokale Zentrale inklusive Einrichtung', en: 'Local hub including setup', tr: 'Kurulum dahil yerel merkez',
  },
  'sh.pkg.start.p2': {
    de: 'Bis zu 6 Geräte: Thermostate, Sensoren, Zwischenstecker', en: 'Up to 6 devices: thermostats, sensors, smart plugs', tr: '6 cihaza kadar: termostat, sensör, akıllı priz',
  },
  'sh.pkg.start.p3': {
    de: 'Zeitpläne passend zu Ihren Öffnungszeiten', en: 'Schedules that match your opening hours', tr: 'Açılış saatlerinize uygun programlar',
  },
  'sh.pkg.start.p4': {
    de: 'Einweisung und 30 Tage Nachbetreuung', en: 'Walkthrough and 30 days of follow-up support', tr: 'Kullanım eğitimi ve 30 gün destek',
  },
  'sh.pkg.betrieb.name': { de: 'Betrieb', en: 'Business', tr: 'İşletme' },
  'sh.pkg.betrieb.for': {
    de: 'Für mehrere Räume, Mitarbeitende oder Wohnungen', en: 'For several rooms, staff or flats', tr: 'Birden fazla oda, çalışan veya daire için',
  },
  'sh.pkg.betrieb.p1': {
    de: 'Alles aus Starter, bis zu 20 Geräte', en: 'Everything in Starter, up to 20 devices', tr: 'Başlangıç paketinin tamamı, 20 cihaza kadar',
  },
  'sh.pkg.betrieb.p2': {
    de: 'Smartes Türschloss oder Zutritt per Code', en: 'Smart lock or keypad access', tr: 'Akıllı kilit veya kodla giriş',
  },
  'sh.pkg.betrieb.p3': {
    de: 'Energie-Übersicht und Push-Meldungen', en: 'Energy overview and push alerts', tr: 'Enerji özeti ve anlık bildirimler',
  },
  'sh.pkg.betrieb.p4': {
    de: 'Fernwartung nach Absprache', en: 'Remote maintenance by arrangement', tr: 'Anlaşmaya göre uzaktan bakım',
  },
  'sh.price.note': {
    de: 'Preise für Beratung, Einrichtung und Konfiguration. Geräte berechnen wir zum Einkaufspreis — oder Sie kaufen sie selbst nach unserer Liste. Kleinunternehmer gemäß § 19 UStG — es wird keine Umsatzsteuer ausgewiesen.',
    en: 'Prices cover consulting, setup and configuration. Devices are charged at cost — or you buy them yourself from our list. Small-business scheme under § 19 of the German VAT Act — no VAT is shown.',
    tr: 'Fiyatlar danışmanlık, kurulum ve yapılandırmayı kapsar. Cihazları alış fiyatına faturalandırırız — ya da listemize göre kendiniz alırsınız. § 19 UStG uyarınca küçük işletme — KDV gösterilmez.',
  },
  'sh.steps.label': { de: 'So läuft es', en: 'How it works', tr: 'Nasıl işler' },
  'sh.steps.title': {
    de: 'Vom Check bis zur<br /><em>fertigen Automatik</em>.',
    en: 'From the check<br /><em>to finished automation</em>.',
    tr: 'Kontrolden<br /><em>hazır otomasyona</em>.',
  },
  'sh.step1.t': { de: 'Check vor Ort', en: 'On-site check', tr: 'Yerinde kontrol' },
  'sh.step1.d': {
    de: 'Wir schauen uns Räume, Heizung, Türen und WLAN an und hören zu, was Sie nervt.',
    en: 'We look at rooms, heating, doors and Wi-Fi — and listen to what annoys you.',
    tr: 'Odalara, ısıtmaya, kapılara ve Wi-Fi’a bakar, sizi neyin rahatsız ettiğini dinleriz.',
  },
  'sh.step2.t': { de: 'Plan & Festpreis', en: 'Plan & fixed price', tr: 'Plan ve sabit fiyat' },
  'sh.step2.d': {
    de: 'Sie bekommen eine Geräteliste und einen Festpreis. Nichts wird gekauft, bevor Sie zustimmen.',
    en: 'You get a device list and a fixed price. Nothing is bought before you agree.',
    tr: 'Cihaz listesi ve sabit fiyat alırsınız. Onayınız olmadan hiçbir şey satın alınmaz.',
  },
  'sh.step3.t': { de: 'Einrichtung', en: 'Setup', tr: 'Kurulum' },
  'sh.step3.d': {
    de: 'Meist an einem Tag — der laufende Betrieb bleibt dabei ungestört.',
    en: 'Usually in a single day — without disrupting your business.',
    tr: 'Çoğunlukla tek günde — işleriniz aksamadan.',
  },
  'sh.step4.t': { de: 'Einweisung', en: 'Walkthrough', tr: 'Kullanım eğitimi' },
  'sh.step4.d': {
    de: 'Wir zeigen Ihnen und Ihrem Team die App und bleiben danach erreichbar.',
    en: 'We show you and your team the app — and stay reachable afterwards.',
    tr: 'Uygulamayı size ve ekibinize gösterir, sonrasında ulaşılabilir kalırız.',
  },
  'sh.fair.label': { de: 'Datenschutz & Sicherheit', en: 'Privacy & safety', tr: 'Gizlilik ve güvenlik' },
  'sh.fair.title': {
    de: 'Ihre Daten bleiben im Haus.', en: 'Your data stays on the premises.', tr: 'Verileriniz evde kalır.',
  },
  'sh.fair.text': {
    de: 'Wir setzen auf offene Standards wie Matter und Zigbee. Die Steuerung läuft lokal auf einem kleinen Gerät bei Ihnen — nicht über die Server eines Herstellers. Kameras in Geschäftsräumen richten wir nur DSGVO-konform ein, mit Hinweisschild und ohne Mitarbeiterüberwachung. Arbeiten an der festen 230-Volt-Installation übernimmt ein Elektrofachbetrieb aus der Region.',
    en: 'We rely on open standards such as Matter and Zigbee. Control runs locally on a small device at your premises — not on a manufacturer’s servers. Cameras in business premises are only installed GDPR-compliant, with signage and no staff monitoring. Any work on fixed 230-volt wiring is done by a licensed local electrician.',
    tr: 'Matter ve Zigbee gibi açık standartlar kullanırız. Kontrol, bir üreticinin sunucularında değil, sizdeki küçük bir cihazda yerel olarak çalışır. İş yerlerindeki kameraları yalnızca GDPR’a uygun, uyarı levhasıyla ve çalışan takibi olmadan kurarız. Sabit 230 volt tesisattaki işleri bölgeden yetkili bir elektrik firması üstlenir.',
  },
  'sh.faq.label': { de: 'Fragen', en: 'Questions', tr: 'Sorular' },
  'sh.faq.title': {
    de: 'Was Kunden<br /><em>vorher wissen wollen</em>.',
    en: 'What customers<br /><em>want to know first</em>.',
    tr: 'Müşterilerin<br /><em>önceden bilmek istedikleri</em>.',
  },
  'sh.faq1.q': { de: 'Muss ich dafür Kabel verlegen lassen?', en: 'Do I need new cables?', tr: 'Kablo çektirmem gerekir mi?' },
  'sh.faq1.a': {
    de: 'In der Regel nicht. Wir arbeiten mit Funkgeräten, die mit Batterie oder über die Steckdose laufen. Wo doch einmal an die feste Elektrik muss, holen wir einen Elektrofachbetrieb dazu.',
    en: 'Usually not. We use wireless devices that run on batteries or plug into a socket. Where fixed wiring is involved, we bring in a licensed electrician.',
    tr: 'Genellikle hayır. Pille veya prizden çalışan kablosuz cihazlar kullanırız. Sabit elektrik tesisatına dokunmak gerekirse yetkili bir elektrikçiyle çalışırız.',
  },
  'sh.faq2.q': { de: 'Funktioniert das auch ohne Internet?', en: 'Does it work without internet?', tr: 'İnternet olmadan da çalışır mı?' },
  'sh.faq2.a': {
    de: 'Ja. Zeitpläne und Automationen laufen lokal weiter. Nur der Fernzugriff per Handy braucht Internet.',
    en: 'Yes. Schedules and automations keep running locally. Only remote access from your phone needs internet.',
    tr: 'Evet. Programlar ve otomasyonlar yerel olarak çalışmaya devam eder. Yalnızca telefondan uzaktan erişim internet ister.',
  },
  'sh.faq3.q': { de: 'Welche Geräte verwenden Sie?', en: 'Which devices do you use?', tr: 'Hangi cihazları kullanıyorsunuz?' },
  'sh.faq3.a': {
    de: 'Wir sind an keinen Hersteller gebunden und wählen Geräte mit offenen Standards wie Matter oder Zigbee. Vorhandene Geräte und Sprachassistenten binden wir, wo möglich, mit ein.',
    en: 'We are not tied to any manufacturer and choose devices built on open standards such as Matter or Zigbee. Existing devices and voice assistants are integrated where possible.',
    tr: 'Hiçbir üreticiye bağlı değiliz; Matter veya Zigbee gibi açık standartlı cihazlar seçeriz. Mevcut cihazlarınızı ve sesli asistanlarınızı mümkünse entegre ederiz.',
  },
  'sh.faq4.q': { de: 'Lohnt sich das für mich?', en: 'Is it worth it for me?', tr: 'Bu benim için değer mi?' },
  'sh.faq4.a': {
    de: 'Das hängt von Gebäude, Heizung und Öffnungszeiten ab. Genau dafür gibt es den Smart-Home-Check: Danach wissen Sie schwarz auf weiß, was es kostet und wo Sie sparen.',
    en: 'It depends on the building, the heating and your opening hours. That’s what the smart-home check is for: afterwards you know in black and white what it costs and where you save.',
    tr: 'Bina, ısıtma ve açılış saatlerine bağlıdır. Akıllı ev kontrolü tam bunun için var: sonrasında maliyeti ve nerede tasarruf edeceğinizi yazılı olarak bilirsiniz.',
  },
  'sh.faq5.q': { de: 'Machen Sie das auch privat?', en: 'Do you also work for private homes?', tr: 'Özel evlere de yapıyor musunuz?' },
  'sh.faq5.a': {
    de: 'Ja. Die Pakete funktionieren im Einfamilienhaus oder in der Mietwohnung genauso — gerade Heizung und Türschloss sind privat sehr beliebt.',
    en: 'Yes. The packages work just as well in a house or a rented flat — heating and smart locks are especially popular at home.',
    tr: 'Evet. Paketler müstakil evde veya kiralık dairede de aynı şekilde çalışır — özellikle ısıtma ve akıllı kilit çok tercih edilir.',
  },
  'sh.cta.title': {
    de: 'Wo läuft die Heizung<br /><em>gerade umsonst</em>?',
    en: 'Where is the heating<br /><em>running for nothing</em>?',
    tr: 'Isıtma şu an<br /><em>boşuna nerede çalışıyor</em>?',
  },
  'sh.cta.text': {
    de: 'Buchen Sie den Smart-Home-Check. Nach einer Stunde vor Ort wissen Sie, was sich rechnet — und der Betrag wird bei Beauftragung angerechnet.',
    en: 'Book the smart-home check. After an hour on site you know what pays off — and the fee is credited if you go ahead.',
    tr: 'Akıllı ev kontrolünü ayarlayın. Yerinde bir saat sonra neyin kazandırdığını bilirsiniz — sipariş verirseniz ücret düşülür.',
  },
  'sh.mail.subject': {
    de: 'Anfrage Smart Home', en: 'Smart home enquiry', tr: 'Akıllı ev talebi',
  },
  'sh.mail.package': { de: 'Paket', en: 'Package', tr: 'Paket' },
  'sh.mail.body': {
    de: 'Guten Tag,\n\nwir interessieren uns für Smart Home.\n\nBetrieb / Objekt: \nOrt: \nWas soll automatisiert werden: \nTelefon für Rückruf: \n\nViele Grüße',
    en: 'Hello,\n\nwe are interested in smart home tech.\n\nBusiness / property: \nLocation: \nWhat should be automated: \nPhone number for a call back: \n\nBest regards',
    tr: 'Merhaba,\n\nakıllı ev ile ilgileniyoruz.\n\nİşletme / mülk: \nYer: \nNe otomatikleştirilmeli: \nGeri arama için telefon: \n\nİyi çalışmalar',
  },
  'seo.sh.title': {
    de: 'Smart Home Freiburg — Heizung, Licht & Türschloss für Betriebe | Breisgau Digital',
    en: 'Smart home in Freiburg — heating, lighting & smart locks | Breisgau Digital',
    tr: 'Freiburg’da akıllı ev — ısıtma, ışık ve akıllı kilit | Breisgau Digital',
  },
  'seo.sh.desc': {
    de: 'Smart Home für Läden, Praxen, Büros und Ferienwohnungen in Freiburg und Südbaden: smarte Heizung, Self-Check-in, Licht und Energie-Übersicht. Funkbasiert, lokal gesteuert, zum Festpreis.',
    en: 'Smart home for shops, practices, offices and holiday flats in Freiburg and southern Baden: smart heating, self check-in, lighting and energy overview. Wireless, locally controlled, fixed price.',
    tr: 'Freiburg ve Güney Baden’de dükkân, muayenehane, ofis ve tatil daireleri için akıllı ev: akıllı ısıtma, kendi kendine giriş, aydınlatma ve enerji takibi. Kablosuz, yerel kontrol, sabit fiyat.',
  },
};
