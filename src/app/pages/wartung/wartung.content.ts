import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Wartungsseite (/wartung). Banner und Navigation stehen in
 * company-content.ts, weil sie auf mehreren Seiten gebraucht werden.
 * Werden von WartungComponent beim I18nService registriert.
 */
export const WARTUNG_CONTENT: Record<string, Entry> = {
  'wart.label': { de: 'Wartung & Pflege', en: 'Maintenance', tr: 'Bakım' },
  'wart.title': {
    de: 'Ihre Website bleibt<br /><em>aktuell und sicher</em>.',
    en: 'Your website stays<br /><em>current and secure</em>.',
    tr: 'Web siteniz her zaman<br /><em>güncel ve güvende</em>.',
  },
  'wart.intro': {
    de: 'Hosting, Updates, Backups und kleine Änderungen zum festen Monatspreis. Monatlich kündbar, ohne Einrichtungsgebühr.',
    en: 'Hosting, updates, backups and small changes at a fixed monthly price. Cancel monthly, no setup fee.',
    tr: 'Barındırma, güncellemeler, yedekler ve küçük değişiklikler sabit aylık fiyatla. Her ay iptal edilebilir, kurulum ücreti yok.',
  },
  'wart.badge': { de: 'Meistgewählt', en: 'Most chosen', tr: 'En çok tercih edilen' },
  'wart.price': { de: '{p} €', en: '€{p}', tr: '{p} €' },
  'wart.per': { de: 'pro Monat', en: 'per month', tr: 'aylık' },
  'wart.setup.none': { de: 'Keine Einrichtungsgebühr', en: 'No setup fee', tr: 'Kurulum ücreti yok' },
  'wart.term': { de: 'Monatlich kündbar', en: 'Cancel monthly', tr: 'Her ay iptal edilebilir' },
  'wart.cta.request': { de: 'Paket anfragen', en: 'Request this plan', tr: 'Paketi talep et' },

  'wart.plan.basis.name': { de: 'Basis', en: 'Basic', tr: 'Temel' },
  'wart.plan.basis.for': {
    de: 'Für alle, die selbst pflegen und nur Ruhe wollen.',
    en: 'For those who update it themselves and just want peace of mind.',
    tr: 'Kendi güncelleyip sadece huzur isteyenler için.',
  },
  'wart.plan.basis.p1': { de: 'Hosting auf deutschem Server mit SSL', en: 'Hosting on a German server with SSL', tr: 'Almanya’daki sunucuda barındırma ve SSL' },
  'wart.plan.basis.p2': { de: 'Tägliche Backups', en: 'Daily backups', tr: 'Günlük yedekler' },
  'wart.plan.basis.p3': { de: 'Sicherheits- und Software-Updates', en: 'Security and software updates', tr: 'Güvenlik ve yazılım güncellemeleri' },
  'wart.plan.basis.p4': { de: 'Erreichbarkeits-Überwachung mit Alarm', en: 'Uptime monitoring with alerts', tr: 'Erişilebilirlik izleme ve alarm' },

  'wart.plan.pflege.name': { de: 'Pflege', en: 'Care', tr: 'Bakım' },
  'wart.plan.pflege.for': {
    de: 'Für Betriebe, die ab und zu etwas geändert haben möchten.',
    en: 'For businesses that want something changed now and then.',
    tr: 'Ara sıra bir şeyin değişmesini isteyen işletmeler için.',
  },
  'wart.plan.pflege.p1': { de: 'Alles aus Basis', en: 'Everything in Basic', tr: 'Temel paketteki her şey' },
  'wart.plan.pflege.p2': { de: 'Bis zu 30 Minuten Änderungen pro Monat (Texte, Bilder, Öffnungszeiten)', en: 'Up to 30 minutes of changes per month (copy, images, opening hours)', tr: 'Ayda 30 dakikaya kadar değişiklik (metin, görsel, çalışma saatleri)' },
  'wart.plan.pflege.p3': { de: 'Monatlicher Bericht zu Besuchern und Suchanfragen', en: 'Monthly report on visitors and searches', tr: 'Ziyaretçi ve aramalar hakkında aylık rapor' },
  'wart.plan.pflege.p4': { de: 'Antwort innerhalb eines Werktags', en: 'Reply within one working day', tr: 'Bir iş günü içinde yanıt' },

  'wart.plan.plus.name': { de: 'Plus', en: 'Plus', tr: 'Plus' },
  'wart.plan.plus.for': {
    de: 'Für Betriebe, deren Website laufend mitwachsen soll.',
    en: 'For businesses whose website should keep growing.',
    tr: 'Web sitesi sürekli gelişmesi gereken işletmeler için.',
  },
  'wart.plan.plus.p1': { de: 'Alles aus Pflege', en: 'Everything in Care', tr: 'Bakım paketindeki her şey' },
  'wart.plan.plus.p2': { de: 'Bis zu 2 Stunden Änderungen pro Monat', en: 'Up to 2 hours of changes per month', tr: 'Ayda 2 saate kadar değişiklik' },
  'wart.plan.plus.p3': { de: 'Eine SEO-Verbesserung pro Monat und Pflege Ihres Google-Unternehmensprofils', en: 'One SEO improvement per month and upkeep of your Google Business Profile', tr: 'Ayda bir SEO iyileştirmesi ve Google İşletme Profili bakımı' },
  'wart.plan.plus.p4': { de: 'Antwort am selben Werktag', en: 'Same-working-day reply', tr: 'Aynı iş günü yanıt' },

  'wart.note.label': { de: 'Gut zu wissen', en: 'Good to know', tr: 'Bilmekte fayda var' },
  'wart.note.title': {
    de: 'Auch für Websites, die wir nicht gebaut haben.',
    en: 'Also for websites we didn’t build.',
    tr: 'Biz yapmamış olsak da her web sitesi için.',
  },
  'wart.note.text': {
    de: 'Wir übernehmen bestehende Websites nach einem kurzen Check. Nicht genutzte Änderungszeit verfällt am Monatsende; größere Wünsche bieten wir vorab schriftlich an.',
    en: 'We take over existing websites after a short check. Unused change time lapses at the end of the month; bigger requests are quoted in writing up front.',
    tr: 'Mevcut web sitelerini kısa bir kontrolden sonra devralırız. Kullanılmayan değişiklik süresi ay sonunda sona erer; daha büyük istekler önceden yazılı olarak teklif edilir.',
  },

  'wart.steps.label': { de: 'Ablauf', en: 'How it works', tr: 'Süreç' },
  'wart.steps.title': {
    de: 'In vier Schritten<br /><em>betreut</em>.',
    en: 'Looked after<br /><em>in four steps</em>.',
    tr: 'Dört adımda<br /><em>bakımda</em>.',
  },
  'wart.step1.t': { de: 'Kurzer Check', en: 'Quick check', tr: 'Kısa kontrol' },
  'wart.step1.d': { de: 'Wir sehen uns Ihre Website an — kostenlos und ohne Verpflichtung.', en: 'We look at your website — free and without obligation.', tr: 'Web sitenize bakarız — ücretsiz ve bağlayıcı değil.' },
  'wart.step2.t': { de: 'Paket wählen', en: 'Pick a plan', tr: 'Paket seçimi' },
  'wart.step2.d': { de: 'Sie entscheiden, wie viel Betreuung Sie brauchen.', en: 'You decide how much support you need.', tr: 'Ne kadar desteğe ihtiyacınız olduğuna siz karar verirsiniz.' },
  'wart.step3.t': { de: 'Übernahme', en: 'Handover', tr: 'Devralma' },
  'wart.step3.d': { de: 'Wir richten Backups und Überwachung ein; Ihre Zugänge bleiben auf Ihren Namen.', en: 'We set up backups and monitoring; your logins stay in your name.', tr: 'Yedekleme ve izlemeyi kurarız; erişimleriniz sizin adınıza kalır.' },
  'wart.step4.t': { de: 'Laufende Betreuung', en: 'Ongoing care', tr: 'Sürekli bakım' },
  'wart.step4.d': { de: 'Ab jetzt melden Sie sich, wenn etwas geändert werden soll — wir kümmern uns um den Rest.', en: 'From now on you get in touch when something needs changing — we handle the rest.', tr: 'Bundan sonra bir şey değişecekse bize yazarsınız — gerisini biz hallederiz.' },

  'wart.faq.label': { de: 'Häufige Fragen', en: 'FAQ', tr: 'Sık sorulanlar' },
  'wart.faq.title': {
    de: 'Was Kunden<br /><em>zur Wartung fragen</em>.',
    en: 'What customers<br /><em>ask about maintenance</em>.',
    tr: 'Müşterilerin<br /><em>bakım hakkında sorduğu sorular</em>.',
  },
  'wart.faq1.q': { de: 'Gilt das auch für Websites, die Sie nicht gebaut haben?', en: 'Does this also apply to websites you didn’t build?', tr: 'Bu, sizin yapmadığınız web siteleri için de geçerli mi?' },
  'wart.faq1.a': { de: 'Ja, nach einem kurzen Check. Manche Systeme und Baukästen lassen sich nicht sauber betreuen — dann sagen wir Ihnen das vorher und nennen eine Alternative.', en: 'Yes, after a short check. Some systems and site builders can’t be looked after properly — if so we tell you beforehand and suggest an alternative.', tr: 'Evet, kısa bir kontrolden sonra. Bazı sistemler ve site kurucular düzgün bakılamaz — öyleyse bunu önceden söyler ve bir alternatif öneririz.' },
  'wart.faq2.q': { de: 'Was zählt als kleine Änderung?', en: 'What counts as a small change?', tr: 'Küçük değişiklik neyi kapsar?' },
  'wart.faq2.a': { de: 'Texte tauschen, Fotos ersetzen, Öffnungszeiten oder Preise anpassen, einen Abschnitt ergänzen. Neue Seiten oder Funktionen sind ein eigenes Angebot.', en: 'Swapping copy, replacing photos, adjusting opening hours or prices, adding a section. New pages or features are quoted separately.', tr: 'Metin değiştirme, fotoğraf yenileme, çalışma saati veya fiyat güncelleme, bir bölüm ekleme. Yeni sayfalar veya işlevler ayrı teklif konusudur.' },
  'wart.faq3.q': { de: 'Kann ich monatlich kündigen?', en: 'Can I cancel monthly?', tr: 'Her ay iptal edebilir miyim?' },
  'wart.faq3.a': { de: 'Ja. Es gibt keine Mindestlaufzeit und keine Einrichtungsgebühr. Zum Ende des Monats können Sie jederzeit beenden; Ihre Daten und Zugänge übergeben wir Ihnen vollständig.', en: 'Yes. There is no minimum term and no setup fee. You can stop at the end of any month; we hand over all your data and logins.', tr: 'Evet. Asgari süre ve kurulum ücreti yoktur. Herhangi bir ayın sonunda bitirebilirsiniz; tüm verilerinizi ve erişimlerinizi eksiksiz teslim ederiz.' },
  'wart.faq4.q': { de: 'Was, wenn die Änderungszeit nicht reicht?', en: 'What if the change time isn’t enough?', tr: 'Değişiklik süresi yetmezse ne olur?' },
  'wart.faq4.a': { de: 'Dann sagen wir es vorab und nennen den Aufwand schriftlich — Sie entscheiden, ob wir ihn umsetzen.', en: 'Then we tell you up front and put the effort in writing — you decide whether we do it.', tr: 'O zaman önceden söyler ve emeği yazılı bildiririz — yapıp yapmayacağımıza siz karar verirsiniz.' },
  'wart.faq5.q': { de: 'Ist die Domain im Preis enthalten?', en: 'Is the domain included?', tr: 'Alan adı fiyata dahil mi?' },
  'wart.faq5.a': { de: 'Die Domain bleibt auf Ihren Namen. Ihre Jahresgebühr dafür (meist 10 bis 20 €) nennen wir Ihnen vorab; sie fällt unabhängig vom Wartungspaket an.', en: 'The domain stays in your name. We tell you its annual fee (usually €10 to €20) up front; it applies regardless of the maintenance plan.', tr: 'Alan adı sizin adınıza kalır. Yıllık ücretini (genellikle 10 ila 20 €) önceden söyleriz; bakım paketinden bağımsız olarak ödenir.' },

  'wart.cta.title': {
    de: 'Ihre Website<br /><em>in guten Händen</em>.',
    en: 'Your website<br /><em>in good hands</em>.',
    tr: 'Web siteniz<br /><em>güvenilir ellerde</em>.',
  },
  'wart.cta.text': {
    de: 'Schicken Sie uns die Adresse Ihrer Website. Wir schauen sie uns an und sagen Ihnen, welches Paket passt.',
    en: 'Send us your website address. We’ll take a look and tell you which plan fits.',
    tr: 'Web sitenizin adresini bize gönderin. Bakıp hangi paketin uygun olduğunu söyleriz.',
  },

  'seo.wart.title': {
    de: 'Website-Wartung & Pflege ab {p} € im Monat | Breisgau Digital',
    en: 'Website maintenance from €{p} a month | Breisgau Digital',
    tr: 'Web sitesi bakımı aylık {p} €’dan | Breisgau Digital',
  },
  'seo.wart.desc': {
    de: 'Website-Wartung in Freiburg und Südbaden: Hosting, Updates, Backups und kleine Änderungen zum festen Monatspreis. Monatlich kündbar, auch für bestehende Websites.',
    en: 'Website maintenance in Freiburg and southern Baden: hosting, updates, backups and small changes at a fixed monthly price. Cancel monthly, also for existing websites.',
    tr: 'Freiburg ve Güney Baden’de web sitesi bakımı: barındırma, güncellemeler, yedekler ve küçük değişiklikler sabit aylık fiyatla. Her ay iptal edilebilir.',
  },
};
