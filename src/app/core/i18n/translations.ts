import { Lang } from './i18n.service';
import { COMPANY_TRANSLATIONS } from './company-content';

export type Entry = Record<Lang, string>;

/**
 * UI translation table. Values may contain inline <em>/<br> markup and are
 * rendered with [innerHTML] where needed — content is author-controlled, never
 * user input.
 *
 * Scope: navigation, global chrome (footer), common actions and the home page.
 * Long-form editorial prose (case studies, detailed service copy) stays German.
 */
const BASE_TRANSLATIONS: Record<string, Entry> = {
  // ---- Navigation ----------------------------------------------------------
  'nav.home': { de: 'Start', en: 'Home', tr: 'Anasayfa' },
  'nav.leistungen': { de: 'Leistungen', en: 'Services', tr: 'Hizmetler' },
  'nav.contact': { de: 'Kontakt', en: 'Contact', tr: 'İletişim' },
  'nav.impressum': { de: 'Impressum', en: 'Imprint', tr: 'Künye' },
  'nav.datenschutz': { de: 'Datenschutz', en: 'Privacy', tr: 'Gizlilik' },
  // Die Namen der zwei eigenen Karten stehen im Fuß jeder Seite und in der
  // Navigation — darum global und nicht in der Tabelle des Shops.
  'shop.card.business': { de: 'Digitale Visitenkarte (NFC)', en: 'Digital business card (NFC)', tr: 'Dijital kartvizit (NFC)' },
  'shop.card.gift': { de: 'Geschenkkarte (NFC)', en: 'Gift card (NFC)', tr: 'Hediye kartı (NFC)' },
  'nav.nfc': { de: 'Digitale Karten', en: 'Digital cards', tr: 'Dijital kartlar' },
  'nav.cart': { de: 'Warenkorb', en: 'Cart', tr: 'Sepet' },
  'nav.agb': { de: 'AGB', en: 'Terms', tr: 'Satış koşulları' },
  'nav.widerruf': { de: 'Widerruf', en: 'Withdrawal', tr: 'Cayma hakkı' },
  'nav.versand': { de: 'Versand & Zahlung', en: 'Shipping & payment', tr: 'Kargo ve ödeme' },

  // ---- Common actions ------------------------------------------------------
  'cta.contact': {
    de: 'Kontakt aufnehmen', en: 'Get in touch', tr: 'İletişime geç',
  },
  'cta.read_case': {
    de: 'Fallstudie lesen →', en: 'Read case study →', tr: 'Vaka çalışmasını oku →',
  },
  'demo.open_tab': {
    de: 'In neuem Tab öffnen ↗', en: 'Open in new tab ↗', tr: 'Yeni sekmede aç ↗',
  },
  'demo.blocked': {
    de: 'Vorschau leer? Manche Seiten erlauben keine Einbettung —',
    en: 'Preview empty? Some sites block embedding —',
    tr: 'Önizleme boş mu? Bazı siteler gömmeyi engeller —',
  },
  'demo.loading': {
    de: 'Live-Vorschau wird geladen …', en: 'Loading live preview …', tr: 'Canlı önizleme yükleniyor …',
  },

  // ---- Hero ----------------------------------------------------------------
  'home.hero.eyebrow': {
    de: 'Webdesign & Webentwicklung · Freiburg, Ortenau & Südbaden',
    en: 'Web design & development · Freiburg, Ortenau & southern Baden',
    tr: 'Web tasarım ve geliştirme · Freiburg, Ortenau ve Güney Baden',
  },
  'home.hero.lede': {
    de: 'Breisgau Digital entwirft und entwickelt Websites, Online-Shops und Web-Apps für Betriebe in Freiburg, der Ortenau und Südbaden — jede Zeile selbst programmiert statt Baukasten, bei Google gut auffindbar, zum Festpreis.',
    en: 'Breisgau Digital designs and builds websites, online shops and web apps for businesses in Freiburg, the Ortenau and southern Baden — every line written by hand instead of a template, easy to find on Google, at a fixed price.',
    tr: 'Breisgau Digital; Freiburg, Ortenau ve Güney Baden’deki işletmeler için web siteleri, online mağazalar ve web uygulamaları tasarlar ve geliştirir — hazır şablon yerine her satırı elle yazılmış, Google’da kolay bulunan, sabit fiyatlı.',
  },

  // ---- Section: Stats ------------------------------------------------------
  'home.stats.years': {
    de: 'Jahre Erfahrung',
    en: 'Years of experience',
    tr: 'Yıl deneyim',
  },
  'home.stats.projects': {
    de: 'Kundenprojekte',
    en: 'Client projects',
    tr: 'Müşteri projesi',
  },

  // ---- Section: Services -----------------------------------------------------
  'svc.relaunch.title': {
    de: 'Lokal gefunden werden',
    en: 'Getting found locally',
    tr: 'Yerelde bulunmak',
  },
  'svc.app.title': {
    de: 'Abläufe digitalisieren',
    en: 'Digitalising your workflow',
    tr: 'Süreçleri dijitalleştirmek',
  },
  'svc.shop.title': {
    de: 'Shop, Buchung & Verleih',
    en: 'Shop, booking & rental',
    tr: 'Mağaza, rezervasyon & kiralama',
  },
  'home.services.more': {
    de: 'Alle Leistungen',
    en: 'All services',
    tr: 'Tüm hizmetler',
  },

  // ---- Section: CTA --------------------------------------------------------
  'home.cta.title': {
    de: 'Welche Website<br /><em>braucht Ihr Betrieb?</em>',
    en: 'Which website does<br /><em>your business need?</em>',
    tr: 'İşletmenizin<br /><em>nasıl bir web sitesine ihtiyacı var?</em>',
  },
  'home.cta.text': {
    de: 'Erzählen Sie uns, was Ihre Website leisten soll — mehr Anfragen, Online-Termine, ein Shop? Das Erstgespräch ist unverbindlich und kostenlos — danach wissen Sie, was sich lohnt und was nicht.',
    en: 'Tell us what your website should achieve — more enquiries, online appointments, a shop? The first conversation is free and without obligation — afterwards you’ll know what is worth doing and what isn’t.',
    tr: 'Web sitenizden ne beklediğinizi anlatın — daha fazla talep, online randevu, bir mağaza? İlk görüşme ücretsiz ve bağlayıcı değil — sonrasında neyin değdiğini, neyin değmediğini bilirsiniz.',
  },

  // ---- Footer --------------------------------------------------------------
  'footer.col.direct': { de: 'Direkt', en: 'Direct', tr: 'Doğrudan' },
  'company.hours': { de: 'Mo–Fr 9–18 Uhr', en: 'Mon–Fri 9 am–6 pm', tr: 'Pzt–Cum 09:00–18:00' },
  'footer.tagline': {
    de: 'Webdesign und Webentwicklung für kleine und mittlere Betriebe in Freiburg, der Ortenau und Südbaden.<br />Websites · Web-Apps · SEO · Wartung.',
    en: 'Web design and development for small and medium businesses in Freiburg, the Ortenau and southern Baden.<br />Websites · Web apps · SEO · Maintenance.',
    tr: 'Freiburg, Ortenau ve Güney Baden’deki küçük ve orta ölçekli işletmeler için web tasarım ve geliştirme.<br />Web siteleri · Web uygulamaları · SEO · Bakım.',
  },
  'footer.rights': {
    de: 'Alle Rechte vorbehalten', en: 'All rights reserved', tr: 'Tüm hakları saklıdır',
  },

  // ---- Common (extra) ------------------------------------------------------
  'common.live': { de: 'Live ansehen', en: 'View live', tr: 'Canlı gör' },
  'common.role': { de: 'Rolle', en: 'Role', tr: 'Rol' },
  'common.period': { de: 'Zeitraum', en: 'Period', tr: 'Süre' },

  // ---- Projects list -------------------------------------------------------
  'projects.label': {
    de: 'Referenzen', en: 'References', tr: 'Referanslar',
  },
  'projects.title': {
    de: 'Betriebe, die mit uns<br /><em>digital wurden</em>.',
    en: 'Businesses that went<br /><em>digital with us</em>.',
    tr: 'Bizimle<br /><em>dijitalleşen işletmeler</em>.',
  },
  'projects.subtitle': {
    de: 'Ausgewählte Arbeiten für kleine und mittlere Betriebe — von der Warenwirtschaft über Buchungssysteme bis zur mehrsprachigen Website.',
    en: 'Selected work for small and medium businesses — from inventory management through booking systems to multilingual websites.',
    tr: 'Küçük ve orta ölçekli işletmeler için seçilmiş işler — stok yönetiminden rezervasyon sistemlerine, çok dilli web sitelerine kadar.',
  },
  'projects.entries': {
    de: 'Projekte', en: 'projects', tr: 'proje',
  },

  // ---- Project detail ------------------------------------------------------
  'pd.back': {
    de: 'Alle Referenzen', en: 'All references', tr: 'Tüm referanslar',
  },
  'pd.about': { de: 'Über das Projekt', en: 'About the project', tr: 'Proje hakkında' },
  'pd.highlights': { de: 'Highlights', en: 'Highlights', tr: 'Öne çıkanlar' },
  'pd.tech': {
    de: 'Eingesetzte Technik', en: 'Technology used', tr: 'Kullanılan teknoloji',
  },
  'pd.cta.title': {
    de: 'Interesse an einer<br /><em>Zusammenarbeit?</em>',
    en: 'Interested in<br /><em>working together?</em>',
    tr: 'Birlikte çalışmaya<br /><em>ne dersiniz?</em>',
  },
  'pd.cta.text': {
    de: 'Erzählen Sie uns von Ihrem Vorhaben — wir sagen Ihnen ehrlich, was es braucht und was es kostet.',
    en: 'Tell us about your plan — we’ll tell you honestly what it takes and what it costs.',
    tr: 'Planınızı anlatın — neye ihtiyaç olduğunu ve ne tutacağını dürüstçe söyleyelim.',
  },
  'pd.nf.title': {
    de: 'Referenz nicht<br /><em>gefunden</em>.',
    en: 'Reference<br /><em>not found</em>.',
    tr: 'Referans<br /><em>bulunamadı</em>.',
  },
  'pd.nf.text': {
    de: 'Diese Seite gibt es nicht (mehr). In der Übersicht finden Sie alle aktuellen Referenzen.',
    en: 'This page doesn’t exist (any more). You’ll find all current references in the overview.',
    tr: 'Bu sayfa mevcut değil (artık yok). Tüm güncel referansları genel bakışta bulabilirsiniz.',
  },
  'pd.nf.cta': {
    de: 'Zu den Referenzen', en: 'Go to references', tr: 'Referanslara git',
  },

  // ---- Contact -------------------------------------------------------------
  'contact.label': { de: 'Kontakt', en: 'Contact', tr: 'İletişim' },
  'contact.title': {
    de: 'Lassen Sie uns<br /><em>zusammenarbeiten</em>.',
    en: 'Let’s <em>work</em><br />together.',
    tr: 'Hadi birlikte<br /><em>çalışalım</em>.',
  },
  'contact.subtitle': {
    de: 'Vielen Dank für Ihr Interesse. Ob neues Vorhaben, laufender Betrieb oder eine kurze Frage — wir freuen uns auf Ihre Nachricht.',
    en: 'Thank you for your interest. A new project, an existing system or just a quick question — we look forward to hearing from you.',
    tr: 'İlginiz için teşekkürler. Yeni bir iş, mevcut bir sistem ya da kısa bir soru — mesajınızı bekliyoruz.',
  },
  'contact.post': { de: 'Postanschrift', en: 'Postal address', tr: 'Posta adresi' },
  'contact.langsval': { de: 'Deutsch · Türkisch · Englisch', en: 'German · Turkish · English', tr: 'Almanca · Türkçe · İngilizce' },
  'contact.response': { de: 'Antwortzeit', en: 'Response time', tr: 'Yanıt süresi' },
  'contact.responseval': { de: '< 24 Stunden', en: '< 24 hours', tr: '< 24 saat' },

  // ---- Leistungen page -----------------------------------------------------
  'leist.label': { de: 'Leistungen', en: 'Services', tr: 'Hizmetler' },
  'leist.title': {
    de: 'Alles, was Ihr Betrieb<br /><em>online braucht</em>.',
    en: 'Everything your business<br /><em>needs online</em>.',
    tr: 'İşletmenizin internette<br /><em>ihtiyaç duyduğu her şey</em>.',
  },
  'leist.intro': {
    de: 'Wir sind <strong>Breisgau Digital</strong> aus <strong>Freiburg im Breisgau</strong> und digitalisieren kleine und mittlere Betriebe: Websites, die gefunden werden, Abläufe, die Zeit sparen, und Shops, die verkaufen — persönlich, direkt und ohne Agentur-Aufschlag.',
    en: 'We are <strong>Breisgau Digital</strong> from <strong>Freiburg, Germany</strong>, and we digitalise small and medium businesses: websites that get found, workflows that save time and shops that sell — personal, direct and without agency markup.',
    tr: 'Biz <strong>Freiburg im Breisgau</strong>’dan <strong>Breisgau Digital</strong>’iz; küçük ve orta ölçekli işletmeleri dijitalleştiriyoruz: bulunan web siteleri, zaman kazandıran süreçler ve satan mağazalar — birebir, doğrudan ve ajans zammı olmadan.',
  },
  // service detail texts
  'leist.s1.text': {
    de: 'Eine individuelle Website, die zu Ihrer Marke passt — kein Baukasten von der Stange. Modern, schnell und so gebaut, dass Google und Ihre Kunden sie lieben.',
    en: 'A custom website that fits your brand — not an off-the-shelf builder. Modern, fast and built so Google and your customers love it.',
    tr: 'Markanıza uygun, size özel bir web sitesi — hazır şablon değil. Modern, hızlı ve hem Google’ın hem müşterilerinizin seveceği şekilde.',
  },
  'leist.s1.p1': { de: 'Individuelles Design statt Template', en: 'Custom design, not a template', tr: 'Şablon değil, özel tasarım' },
  'leist.s1.p2': { de: 'Blitzschnell & für Mobilgeräte optimiert', en: 'Lightning-fast & mobile-optimised', tr: 'Çok hızlı & mobil uyumlu' },
  'leist.s1.p3': { de: 'SEO von Grund auf eingebaut', en: 'SEO built in from the ground up', tr: 'Baştan SEO uyumlu' },
  'leist.s1.p4': { de: 'Rechtssicher (Impressum, Datenschutz, Cookies)', en: 'Legally compliant (imprint, privacy, cookies)', tr: 'Hukuken uyumlu (künye, gizlilik, çerez)' },
  'leist.s2.text': {
    de: 'Ihre Seite ist in die Jahre gekommen, lädt langsam oder lässt sich nicht pflegen? Wir modernisieren Design, Technik und Sichtbarkeit — ohne dass Ihre bisherigen Inhalte oder Rankings verloren gehen.',
    en: 'Your site has aged, loads slowly or can’t be maintained? We modernise design, technology and visibility — without losing your existing content or rankings.',
    tr: 'Siteniz eskidi, yavaş açılıyor ya da güncellenemiyor mu? Tasarımı, teknolojiyi ve görünürlüğü yeniliyoruz — mevcut içeriğinizi ve sıralamanızı kaybetmeden.',
  },
  'leist.s2.p1': { de: 'Analyse von Tempo, Technik & Sichtbarkeit', en: 'Analysis of speed, tech & visibility', tr: 'Hız, teknik & görünürlük analizi' },
  'leist.s2.p2': { de: 'Modernes Redesign mit Ihrer Identität', en: 'Modern redesign with your identity', tr: 'Kimliğinizle modern yeniden tasarım' },
  'leist.s2.p3': { de: 'Sanfte Migration ohne Ranking-Verlust', en: 'Smooth migration with no ranking loss', tr: 'Sıralama kaybı olmadan sorunsuz geçiş' },
  'leist.s2.p4': { de: 'Messbar schnellere Ladezeiten', en: 'Measurably faster load times', tr: 'Ölçülebilir şekilde daha hızlı yükleme' },
  'leist.s3.text': {
    de: 'Wenn Standardsoftware nicht passt: Terminplanung, Bestand, Angebote oder ein Kundenportal — zugeschnitten auf Ihren Betrieb und so einfach, dass Ihr Team es ohne Schulung bedient.',
    en: 'When off-the-shelf software doesn’t fit: scheduling, stock, quotes or a customer portal — tailored to your business and simple enough for your team to use without training.',
    tr: 'Hazır yazılım yetmediğinde: randevu planlama, stok, teklifler veya müşteri portalı — işletmenize göre uyarlanmış ve ekibinizin eğitimsiz kullanabileceği kadar basit.',
  },
  'leist.s3.p1': { de: 'Kundenportale & interne Tools', en: 'Customer portals & internal tools', tr: 'Müşteri portalları & dahili araçlar' },
  'leist.s3.p2': { de: 'Schnittstellen (APIs) zu Ihren Systemen', en: 'Interfaces (APIs) to your systems', tr: 'Sistemlerinize arayüzler (API)' },
  'leist.s3.p3': {
    de: 'Einfach zu bedienen, auch auf dem Handy', en: 'Easy to use, even on a phone', tr: 'Telefonda bile kolay kullanım',
  },
  'leist.s3.p4': {
    de: 'Sicherer Betrieb mit Updates und Backups', en: 'Safe operation with updates and backups', tr: 'Güncelleme ve yedeklemeyle güvenli işletim',
  },
  'leist.s4.text': {
    de: 'Verkaufen Sie online — mit einem Shop, der schnell ist, Vertrauen schafft und sich leicht verwalten lässt. Inklusive Zahlungsanbindung und mehrsprachigem Auftritt.',
    en: 'Sell online — with a shop that’s fast, builds trust and is easy to manage. Payment integration and a multilingual presence included.',
    tr: 'Online satış yapın — hızlı, güven veren ve yönetimi kolay bir mağazayla. Ödeme entegrasyonu ve çok dilli yapı dahil.',
  },
  'leist.s4.p1': { de: 'Produkt- & Bestandsverwaltung', en: 'Product & inventory management', tr: 'Ürün & stok yönetimi' },
  'leist.s4.p2': { de: 'Sichere Zahlungsanbindung', en: 'Secure payment integration', tr: 'Güvenli ödeme entegrasyonu' },
  'leist.s4.p3': { de: 'Mehrsprachig (DE / EN / FR / TR)', en: 'Multilingual (DE / EN / FR / TR)', tr: 'Çok dilli (DE / EN / FR / TR)' },
  'leist.s4.p4': { de: 'Optimiert für Conversion & SEO', en: 'Optimised for conversion & SEO', tr: 'Dönüşüm & SEO için optimize' },
  // why
  'leist.why.label': {
    de: 'Warum wir',
    en: 'Why us',
    tr: 'Neden biz',
  },
  'leist.why.title': {
    de: 'Was Sie von uns<br /><em>erwarten können</em>.',
    en: 'What you can<br /><em>expect from us</em>.',
    tr: 'Bizden <em>ne</em><br />bekleyebilirsiniz.',
  },
  'leist.why1.t': { de: 'Direkt & persönlich', en: 'Direct & personal', tr: 'Doğrudan & kişisel' },
  'leist.why1.d': {
    de: 'Sie sprechen immer mit derselben Person — nicht mit einem Callcenter. Kurze Wege, schnelle Antworten.',
    en: 'You always speak to the same person — not a call centre. Short paths, quick answers.',
    tr: 'Her zaman aynı kişiyle konuşursunuz — çağrı merkeziyle değil. Kısa yol, hızlı cevap.',
  },
  'leist.why2.t': { de: 'Aus Freiburg', en: 'From Freiburg', tr: 'Freiburg’dan' },
  'leist.why2.d': {
    de: 'Lokal verankert in der Region. Auf Wunsch treffen wir uns persönlich auf einen Kaffee.',
    en: 'Locally rooted in the region. On request we meet in person over a coffee.',
    tr: 'Bölgede yerel olarak köklü. İsterseniz bir kahve eşliğinde yüz yüze görüşürüz.',
  },
  'leist.why3.t': {
    de: 'Schnell & sicher', en: 'Fast & secure', tr: 'Hızlı ve güvenli',
  },
  'leist.why3.d': {
    de: 'Kurze Ladezeiten, aktuelle Technik und regelmäßige Updates — darum kümmern wir uns, nicht Sie.',
    en: 'Fast loading, up-to-date technology and regular updates — we take care of it, not you.',
    tr: 'Kısa yüklenme süreleri, güncel teknoloji ve düzenli güncellemeler — bunlarla siz değil biz ilgileniriz.',
  },
  'leist.why4.t': { de: 'SEO inklusive', en: 'SEO included', tr: 'SEO dahil' },
  'leist.why4.d': {
    de: 'Suchmaschinenoptimierung ist eingebaut, kein teures Extra. Damit Sie gefunden werden.',
    en: 'Search engine optimisation is built in, not a costly extra. So you get found.',
    tr: 'Arama motoru optimizasyonu dahildir, pahalı bir ek değil. Bulunmanız için.',
  },
  'leist.why5.t': { de: 'Transparenter Festpreis', en: 'Transparent fixed price', tr: 'Şeffaf sabit fiyat' },
  'leist.why5.d': {
    de: 'Klares Angebot vor Projektstart. Keine versteckten Kosten, keine Überraschungen.',
    en: 'A clear quote before the project starts. No hidden costs, no surprises.',
    tr: 'Proje başlamadan net teklif. Gizli maliyet yok, sürpriz yok.',
  },
  'leist.why6.t': { de: 'Betreuung danach', en: 'Ongoing support', tr: 'Sonrasında destek' },
  'leist.why6.d': {
    de: 'Auch nach dem Start sind wir für Updates, Hosting und Weiterentwicklung da.',
    en: 'After launch we’re still there for updates, hosting and further development.',
    tr: 'Yayına aldıktan sonra da güncelleme, barındırma ve geliştirme için buradayız.',
  },
  // process
  'leist.proc.label': { de: 'Ablauf', en: 'Process', tr: 'Süreç' },
  'leist.proc.title': {
    de: 'So arbeiten wir<br /><em>zusammen</em>.',
    en: 'How we<br /><em>work together</em>.',
    tr: 'Birlikte nasıl<br /><em>çalışırız</em>.',
  },
  'leist.p1.t': { de: 'Erstgespräch', en: 'First conversation', tr: 'İlk görüşme' },
  'leist.p1.d': {
    de: 'Wir sprechen unverbindlich über Ihr Vorhaben, Ihre Ziele und Ihr Budget. Kostenlos und ohne Verpflichtung.',
    en: 'We talk freely about your plan, your goals and your budget. Free and without obligation.',
    tr: 'Projenizi, hedeflerinizi ve bütçenizi serbestçe konuşuruz. Ücretsiz ve bağlayıcı değil.',
  },
  'leist.p2.t': { de: 'Konzept & Angebot', en: 'Concept & quote', tr: 'Konsept & teklif' },
  'leist.p2.d': {
    de: 'Sie erhalten ein klares Konzept und ein transparentes Festpreis-Angebot — keine versteckten Kosten.',
    en: 'You get a clear concept and a transparent fixed-price quote — no hidden costs.',
    tr: 'Net bir konsept ve şeffaf bir sabit fiyat teklifi alırsınız — gizli maliyet yok.',
  },
  'leist.p3.t': { de: 'Design & Entwicklung', en: 'Design & development', tr: 'Tasarım & geliştirme' },
  'leist.p3.d': {
    de: 'Wir setzen Ihr Vorhaben um und halten Sie mit regelmäßigen Vorschauen auf dem Laufenden. Ihr Feedback fließt direkt ein.',
    en: 'We build it and keep you posted with regular previews. Your feedback goes straight in.',
    tr: 'İşi hayata geçirir, düzenli önizlemelerle sizi haberdar ederiz. Geri bildiriminiz doğrudan işlenir.',
  },
  'leist.p4.t': { de: 'Launch & Betreuung', en: 'Launch & support', tr: 'Lansman & destek' },
  'leist.p4.d': {
    de: 'Wir gehen gemeinsam online. Auf Wunsch betreuen wir Ihre Seite auch danach — Updates, Hosting und Weiterentwicklung.',
    en: 'We go live together. On request we keep looking after your site afterwards — updates, hosting and further development.',
    tr: 'Birlikte yayına alırız. İsterseniz sonrasında da sitenize bakarız — güncelleme, barındırma ve geliştirme.',
  },
  // faq
  'leist.faq.label': { de: 'Häufige Fragen', en: 'FAQ', tr: 'Sık sorulanlar' },
  'leist.faq.title': {
    de: 'Gut zu<br /><em>wissen</em>.', en: 'Good to<br /><em>know</em>.', tr: 'Bilinmesi<br /><em>gerekenler</em>.',
  },
  'leist.faq1.q': {
    de: 'Was kostet eine Website in Freiburg?',
    en: 'What does a website cost in Freiburg?',
    tr: 'Freiburg’da bir web sitesi ne kadar?',
  },
  'leist.faq1.a': {
    de: 'Das hängt vom Umfang ab. Eine moderne One-Page-Website beginnt im niedrigen vierstelligen Bereich, umfangreiche Web-Apps oder Shops entsprechend mehr. Sie erhalten immer ein transparentes Festpreis-Angebot vor Projektstart.',
    en: 'It depends on the scope. A modern one-page site starts in the low four figures; larger web apps or shops cost more accordingly. You always get a transparent fixed-price quote before the project starts.',
    tr: 'Kapsama bağlıdır. Modern bir tek sayfalık site dört haneli rakamların alt sınırında başlar; kapsamlı uygulamalar ya da mağazalar daha fazladır. Proje başlamadan her zaman şeffaf bir sabit fiyat teklifi alırsınız.',
  },
  'leist.faq2.q': {
    de: 'Wie lange dauert die Erstellung einer Website?',
    en: 'How long does building a website take?',
    tr: 'Bir web sitesi yapımı ne kadar sürer?',
  },
  'leist.faq2.a': {
    de: 'Eine klassische Unternehmenswebsite ist in der Regel in 2–4 Wochen fertig. Größere Projekte wie Web-Apps oder Online-Shops planen wir individuell.',
    en: 'A classic business website is usually ready in 2–4 weeks. Larger projects such as web apps or online shops are planned individually.',
    tr: 'Klasik bir kurumsal site genellikle 2–4 haftada hazır olur. Web uygulaması veya mağaza gibi büyük projeleri ayrıca planlarız.',
  },
  'leist.faq3.q': {
    de: 'Arbeiten Sie nur in Freiburg?',
    en: 'Do you only work in Freiburg?',
    tr: 'Sadece Freiburg’da mı çalışıyorsunuz?',
  },
  'leist.faq3.a': {
    de: 'Unser Sitz ist in Freiburg im Breisgau, und wir arbeiten gern persönlich mit Betrieben aus der Region. Aufträge außerhalb betreuen wir aber genauso — remote läuft vieles ohnehin besser als im Konferenzraum.',
    en: 'We’re based in Freiburg, Germany, and we like working in person with businesses from the region. We handle work elsewhere just as well — remotely, a lot runs better than in a meeting room anyway.',
    tr: 'Merkezimiz Freiburg im Breisgau’da; bölgedeki işletmelerle yüz yüze çalışmayı seviyoruz. Bölge dışındaki işleri de aynı şekilde yürütüyoruz — uzaktan çoğu şey zaten toplantı odasından daha iyi ilerliyor.',
  },
  'leist.faq4.q': {
    de: 'Kümmern Sie sich auch um SEO und Auffindbarkeit?',
    en: 'Do you also handle SEO and findability?',
    tr: 'SEO ve bulunabilirlikle de ilgileniyor musunuz?',
  },
  'leist.faq4.a': {
    de: 'Ja. Suchmaschinenoptimierung ist bei uns kein teures Extra, sondern von Anfang an eingebaut: schnelle Ladezeiten, sauberes HTML, strukturierte Daten und Texte, die für Menschen geschrieben sind.',
    en: 'Yes. Search optimisation isn’t an expensive add-on here, it’s built in from the start: fast load times, clean HTML, structured data and copy written for people.',
    tr: 'Evet. Arama motoru optimizasyonu bizde pahalı bir ek değil, baştan içine yerleşiktir: hızlı yükleme, temiz HTML, yapılandırılmış veri ve insanlar için yazılmış metinler.',
  },
  'leist.faq5.q': {
    de: 'Kann ich meine Inhalte später selbst pflegen?',
    en: 'Can I maintain my content myself later?',
    tr: 'İçeriğimi sonradan kendim güncelleyebilir miyim?',
  },
  'leist.faq5.a': {
    de: 'Auf Wunsch binden wir ein einfaches Redaktionssystem (CMS) ein, mit dem Sie Texte, Bilder und Inhalte selbst aktualisieren können — ohne technische Kenntnisse und ohne uns anrufen zu müssen.',
    en: 'On request we build in a simple content management system so you can update text, images and content yourself — without technical knowledge and without having to call us.',
    tr: 'İsterseniz basit bir içerik yönetim sistemi (CMS) ekliyoruz; metinleri, görselleri ve içerikleri kendiniz güncelleyebilirsiniz — teknik bilgi gerekmeden ve bizi aramadan.',
  },
  // cta
  'leist.cta.title': {
    de: 'Lassen Sie uns Ihr Projekt<br /><em>besprechen.</em>',
    en: 'Let’s discuss<br /><em>your project.</em>',
    tr: 'Projenizi<br /><em>konuşalım.</em>',
  },
  'leist.cta.text': {
    de: 'Kostenloses, unverbindliches Erstgespräch — schildern Sie uns einfach Ihr Vorhaben.',
    en: 'A free, no-obligation first conversation — just tell us what you have in mind.',
    tr: 'Ücretsiz ve bağlayıcı olmayan ilk görüşme — planınızı anlatmanız yeterli.',
  },

  // ---- SEO meta (per page, per locale) -------------------------------------
  'seo.home.title': {
    de: 'Webdesign Freiburg & individuelle Webentwicklung | Breisgau Digital',
    en: 'Breisgau Digital — web design & development in Freiburg',
    tr: 'Breisgau Digital — Freiburg’da web tasarım ve geliştirme',
  },
  'seo.home.desc': {
    de: 'Webdesign, Webentwicklung & SEO für Betriebe in Freiburg, der Ortenau und Südbaden: individuelle Websites, Shops und Web-Apps zum Festpreis. Persönlich vor Ort.',
    en: 'Web design, development and SEO for businesses in Freiburg, the Ortenau and southern Baden: custom websites, shops and web apps at a fixed price. In person.',
    tr: 'Freiburg, Ortenau ve Güney Baden’deki işletmeler için web tasarım, geliştirme ve SEO: özel web siteleri, mağazalar ve web uygulamaları, sabit fiyat. Yerinde hizmet.',
  },
  'seo.leist.title': {
    de: 'Website-Relaunch & Homepage-Update zum Festpreis | Breisgau Digital',
    en: 'Services — website, workflows & shop for SMEs | Breisgau Digital',
    tr: 'Hizmetler — KOBİ’ler için web sitesi, süreçler & mağaza | Breisgau Digital',
  },
  'seo.leist.desc': {
    de: 'Neue Website, Relaunch oder Homepage-Update zum Festpreis — dazu Shops, Buchungssysteme und individuelle Web-Apps für kleine und mittlere Betriebe in Südbaden.',
    en: 'Website and relaunch, local visibility, digital workflows, shop and booking — services and process for small and medium businesses in southern Baden.',
    tr: 'Web sitesi ve yenileme, yerel görünürlük, dijital süreçler, mağaza ve rezervasyon — Güney Baden’deki KOBİ’ler için hizmetler ve süreç.',
  },
  'seo.projects.title': {
    de: 'Kundenprojekte — Referenzen aus Südbaden | Breisgau Digital',
    en: 'Client projects — references from southern Baden | Breisgau Digital',
    tr: 'Müşteri projeleri — Güney Baden referansları | Breisgau Digital',
  },
  'seo.projects.desc': {
    de: 'Fahrradgeschäfte, Hotel, Fotostudio, Hochzeits-DJ, Kulturverein: Was wir für kleine und mittlere Betriebe gebaut haben — mit Technik, Zahlen und Live-Links.',
    en: 'Bicycle shops, a hotel, a photo studio, a wedding DJ, a cultural association: what we built for small and medium businesses — tech, numbers and live links.',
    tr: 'Bisiklet mağazaları, otel, fotoğraf stüdyosu, düğün DJ’i, kültür derneği: KOBİ’ler için ne yaptık — teknik detay, rakamlar ve canlı bağlantılar.',
  },
  'seo.contact.title': {
    de: 'Kontakt — Breisgau Digital, Freiburg im Breisgau',
    en: 'Contact — Breisgau Digital, Freiburg, Germany',
    tr: 'İletişim — Breisgau Digital, Freiburg im Breisgau',
  },
  'seo.contact.desc': {
    de: 'Erstgespräch vereinbaren: E-Mail, Telefon oder WhatsApp. Breisgau Digital digitalisiert kleine und mittlere Betriebe in Freiburg und Südbaden.',
    en: 'Book a first conversation: email, phone or WhatsApp. Breisgau Digital digitalises small and medium businesses in Freiburg and southern Baden.',
    tr: 'İlk görüşmeyi ayarlayın: e-posta, telefon veya WhatsApp. Breisgau Digital, Freiburg ve Güney Baden’deki KOBİ’leri dijitalleştirir.',
  },

  // ---- Navigation & Produkte (Nachtrag) -------------------------------------
  'nav.cards': {
    de: 'Bewertungskarten',
    en: 'Review cards',
    tr: 'Değerlendirme kartları',
  },
  'nav.about': {
    de: 'Über uns',
    en: 'About us',
    tr: 'Hakkımızda',
  },
  'home.stats.live': {
    de: 'Systeme im Betrieb',
    en: 'Systems in production',
    tr: 'Canlı sistem',
  },
  'home.stats.langs': {
    de: 'Sprachen ausgeliefert',
    en: 'Languages shipped',
    tr: 'Teslim edilen dil',
  },
  'seo.rc.title': {
    de: 'NFC-Bewertungskarten für Google ab 39 € | Breisgau Digital',
    en: 'Google review cards — NFC cards from €39 | Breisgau Digital',
    tr: 'Google değerlendirme kartları — 39 €’dan NFC kartlar | Breisgau Digital',
  },
  'seo.rc.desc': {
    de: 'NFC- und QR-Bewertungskarten für Ihr Google-Profil: Karte hinhalten, Bewertung abgeben. Fertig eingerichtet und bedruckt, ab 39 € — aus Freiburg.',
    en: 'NFC and QR review cards for your Google profile: hold the card up, leave a review. Set up and printed, from €39 — from Freiburg, Germany.',
    tr: 'Google profiliniz için NFC ve QR değerlendirme kartları: kartı yaklaştır, değerlendirme bırak. Kurulmuş ve basılmış hâlde, 39 €’dan itibaren — Freiburg’dan.',
  },
  'seo.about.title': {
    de: 'Über uns — Breisgau Digital, Freiburg im Breisgau',
    en: 'About us — Breisgau Digital, Freiburg, Germany',
    tr: 'Hakkımızda — Breisgau Digital, Freiburg im Breisgau',
  },
  'seo.about.desc': {
    de: 'Wer hinter Breisgau Digital steht, wie wir arbeiten und warum wir uns auf kleine und mittlere Betriebe in Südbaden konzentrieren.',
    en: 'Who is behind Breisgau Digital, how we work and why we focus on small and medium businesses in southern Baden.',
    tr: 'Breisgau Digital’in arkasında kim var, nasıl çalışıyoruz ve neden Güney Baden’deki KOBİ’lere odaklanıyoruz.',
  },
  'rc.folio': {
    de: 'Produkt',
    en: 'Product',
    tr: 'Ürün',
  },
  'rc.label': {
    de: 'Bewertungskarten',
    en: 'Review cards',
    tr: 'Değerlendirme kartları',
  },
  'rc.title': {
    de: 'Google-Bewertungen,<br /><em>ohne danach zu fragen</em>.',
    en: 'Google reviews,<br /><em>without having to ask</em>.',
    tr: 'İstemek zorunda kalmadan<br /><em>Google değerlendirmeleri</em>.',
  },
  'rc.title.plain': {
    de: 'Google-Bewertungskarten (NFC & QR)',
    en: 'Google review cards (NFC and QR)',
    tr: 'Google değerlendirme kartları (NFC ve QR)',
  },
  'rc.intro': {
    de: 'Eine Karte auf dem Tresen, am Tisch oder an der Kasse. Der Gast hält sein Handy dran — das Bewertungsformular Ihres Google-Profils öffnet sich sofort. <strong>Keine App, kein Ausdruck, kein Suchen.</strong> Wir richten die Karte auf Ihr Profil ein und schicken sie fertig zu.',
    en: 'A card on the counter, on the table or at the till. The guest holds their phone to it — the review form of your Google profile opens right away. <strong>No app, no printout, no searching.</strong> We set the card up for your profile and send it ready to use.',
    tr: 'Tezgâhta, masada ya da kasada bir kart. Misafir telefonunu yaklaştırıyor — Google profilinizin değerlendirme formu anında açılıyor. <strong>Uygulama yok, çıktı yok, arama yok.</strong> Kartı profilinize göre ayarlayıp kullanıma hazır gönderiyoruz.',
  },
  'rc.cta.order': {
    de: 'Karten anfragen',
    en: 'Request cards',
    tr: 'Kart talep et',
  },
  'rc.cta.whatsapp': {
    de: 'Per WhatsApp fragen',
    en: 'Ask via WhatsApp',
    tr: 'WhatsApp’tan sor',
  },
  'rc.steps.label': {
    de: 'So läuft es',
    en: 'How it works',
    tr: 'Nasıl işliyor',
  },
  'rc.steps.title': {
    de: 'Vier Schritte,<br /><em>dann liegt sie auf dem Tresen</em>.',
    en: 'Four steps,<br /><em>then it’s on your counter</em>.',
    tr: 'Dört adım,<br /><em>sonra tezgâhta</em>.',
  },
  // Schritt 1 beschreibt den Weg, den die Knöpfe auf der Seite gehen: seit der
  // Shop offen ist, wird bestellt und nicht angefragt. Ist der Shop zu, führen
  // die Knöpfe auf die E-Mail — der zweite Satz stimmt dann trotzdem.
  'rc.step1.t': {
    de: 'Bestellung',
    en: 'Order',
    tr: 'Sipariş',
  },
  'rc.step1.d': {
    de: 'Sie legen Ihr Produkt in den Warenkorb und bezahlen online — Name des Betriebs und der Link zu Ihrem Google-Profil gehören zur Bestellung. Wenn Sie den Link nicht finden, suchen wir ihn.',
    en: 'You add your product to the cart and pay online — your business name and the link to your Google profile are part of the order. If you can’t find the link, we will.',
    tr: 'Ürünü sepete ekleyip online ödersiniz — işletme adı ve Google profil linkiniz siparişin parçasıdır. Linki bulamazsanız biz buluruz.',
  },
  'rc.step2.t': {
    de: 'Einrichtung',
    en: 'Setup',
    tr: 'Kurulum',
  },
  'rc.step2.d': {
    de: 'Wir programmieren den NFC-Chip auf Ihre Bewertungsseite, drucken den QR-Code als Rückfallebene dazu und prüfen beides auf Android und iPhone.',
    en: 'We program the NFC chip to point at your review page, print the QR code as a fallback and test both on Android and iPhone.',
    tr: 'NFC çipini değerlendirme sayfanıza programlıyor, yedek olarak QR kodu basıyor ve ikisini de Android ile iPhone’da test ediyoruz.',
  },
  'rc.step3.t': {
    de: 'Versand',
    en: 'Shipping',
    tr: 'Gönderim',
  },
  'rc.step3.d': {
    de: 'Die Karte kommt per Post — in Freiburg und Umgebung bringen wir sie auch vorbei. Versand innerhalb Deutschlands ist im Preis enthalten.',
    en: 'The card arrives by post — in and around Freiburg we drop it off in person. Shipping within Germany is included in the price.',
    tr: 'Kart posta ile geliyor — Freiburg ve çevresinde elden de getiriyoruz. Almanya içi gönderim fiyata dahil.',
  },
  'rc.step4.t': {
    de: 'Hinlegen, fertig',
    en: 'Put it down, done',
    tr: 'Koy, bitti',
  },
  'rc.step4.d': {
    de: 'Ab da läuft sie ohne Sie: kein Konto, kein Pflicht-Abo, keine laufenden Kosten. Die Karte funktioniert, solange Ihr Google-Profil besteht.',
    en: 'From then on it runs without you: no account, no mandatory subscription, no running costs. The card works as long as your Google profile exists.',
    tr: 'Sonrası sizden bağımsız: hesap yok, zorunlu abonelik yok, aylık gider yok. Google profiliniz durdukça kart çalışır.',
  },
  'rc.pkg.label': {
    de: 'Pakete',
    en: 'Packages',
    tr: 'Paketler',
  },
  'rc.pkg.title': {
    de: 'Drei Pakete,<br /><em>alle fertig eingerichtet</em>.',
    en: 'Three packages,<br /><em>all ready to use</em>.',
    tr: 'Üç paket,<br /><em>hepsi kurulmuş hâlde</em>.',
  },
  'rc.pkg.badge': {
    de: 'Meistgewählt',
    en: 'Most chosen',
    tr: 'En çok tercih edilen',
  },
  'rc.pkg.einzel.name': {
    de: 'Einzelkarte',
    en: 'Single card',
    tr: 'Tek kart',
  },
  'rc.pkg.einzel.for': {
    de: 'Für einen Tresen, eine Kasse, einen Platz.',
    en: 'For one counter, one till, one spot.',
    tr: 'Tek tezgâh, tek kasa, tek nokta için.',
  },
  'rc.pkg.einzel.p1': {
    de: 'NFC-Chip auf Ihr Google-Profil programmiert',
    en: 'NFC chip programmed to your Google profile',
    tr: 'Google profilinize programlanmış NFC çipi',
  },
  'rc.pkg.einzel.p2': {
    de: 'QR-Code aufgedruckt — funktioniert auch ohne NFC',
    en: 'Printed QR code — works without NFC too',
    tr: 'Basılı QR kod — NFC olmadan da çalışır',
  },
  'rc.pkg.einzel.p3': {
    de: 'Ihr Name oder Logo auf der Karte',
    en: 'Your name or logo on the card',
    tr: 'Kartta adınız veya logonuz',
  },
  'rc.pkg.einzel.p4': {
    de: 'Versand innerhalb Deutschlands inklusive',
    en: 'Shipping within Germany included',
    tr: 'Almanya içi gönderim dahil',
  },
  'rc.pkg.team.name': {
    de: 'Dreier-Set',
    en: 'Set of three',
    tr: 'Üçlü set',
  },
  'rc.pkg.team.for': {
    de: 'Für mehrere Tische, Räume oder Mitarbeiter.',
    en: 'For several tables, rooms or staff.',
    tr: 'Birden fazla masa, oda veya çalışan için.',
  },
  'rc.pkg.team.p1': {
    de: 'Alles aus der Einzelkarte, dreimal',
    en: 'Everything from the single card, three times over',
    tr: 'Tek karttaki her şey, üç adet',
  },
  'rc.pkg.team.p2': {
    de: 'Alle Karten auf dasselbe Profil — oder auf verschiedene Filialen',
    en: 'All cards on the same profile — or on different branches',
    tr: 'Tüm kartlar aynı profile — ya da farklı şubelere',
  },
  'rc.pkg.team.p3': {
    de: 'Kurze Anleitung fürs Team, eine Seite',
    en: 'A one-page guide for your team',
    tr: 'Ekip için tek sayfalık kısa kılavuz',
  },
  'rc.pkg.team.p4': {
    de: 'Nachbestellung später zum gleichen Stückpreis',
    en: 'Reorders later at the same unit price',
    tr: 'Sonraki siparişler aynı birim fiyattan',
  },
  'rc.pkg.tresen.name': {
    de: 'Tresen-Set',
    en: 'Counter set',
    tr: 'Tezgâh seti',
  },
  'rc.pkg.tresen.for': {
    de: 'Für Gastronomie, Praxis und Laden mit Laufkundschaft.',
    en: 'For restaurants, practices and shops with walk-in customers.',
    tr: 'Gastronomi, muayenehane ve yoğun geçişli dükkânlar için.',
  },
  'rc.pkg.tresen.p1': {
    de: 'Alles aus dem Dreier-Set',
    en: 'Everything from the set of three',
    tr: 'Üçlü setteki her şey',
  },
  'rc.pkg.tresen.p2': {
    de: 'Gestaltung von Karten und Aufsteller passend zu Ihrem Auftritt',
    en: 'Cards and stand designed to match your branding',
    tr: 'Kurumsal görünümünüze uygun kart ve stand tasarımı',
  },
  'rc.pkg.tresen.p3': {
    de: 'Einrichtung Ihres Google-Profils, falls noch nicht vollständig',
    en: 'Setup of your Google profile if it isn’t complete yet',
    tr: 'Google profiliniz eksikse tamamlanması',
  },
  'rc.pkg.tresen.p4': {
    de: 'In Freiburg und Umgebung stellen wir es vor Ort auf und testen es',
    en: 'In and around Freiburg we set it up and test it on site',
    tr: 'Freiburg ve çevresinde yerinde kurup test ediyoruz',
  },
  'rc.unit.card': {
    de: 'Karte',
    en: 'card',
    tr: 'kart',
  },
  'rc.unit.cards': {
    de: 'Karten',
    en: 'cards',
    tr: 'kart',
  },
  'rc.unit.stand': {
    de: 'Aufsteller für den Tresen',
    en: 'counter stand',
    tr: 'tezgâh standı',
  },
  // Lieferzeit muss zur Angabe im Shop passen (`shop.legal.delivery`, AGB,
  // /versand und die Bestellbestätigung): 5–10 Werktage nach Freigabe. Zwei
  // verschiedene Fristen auf einer Website sind irreführende Werbung.
  'rc.price.note': {
    de: 'Alle Preise sind Endpreise inklusive Einrichtung und Versand innerhalb Deutschlands. Kleinunternehmer gemäß § 19 UStG — es wird keine Umsatzsteuer ausgewiesen. Lieferzeit in der Regel 5–10 Werktage nach Freigabe des Entwurfs.',
    en: 'All prices are final prices including setup and shipping within Germany. Small-business scheme under § 19 of the German VAT Act — no VAT is shown. Delivery usually 5–10 working days after the design is approved.',
    tr: 'Tüm fiyatlar, kurulum ve Almanya içi gönderim dahil nihai fiyatlardır. § 19 UStG uyarınca küçük işletme — KDV gösterilmez. Teslim süresi, tasarım onayından sonra genellikle 5–10 iş günüdür.',
  },
  'rc.why.label': {
    de: 'Warum',
    en: 'Why',
    tr: 'Neden',
  },
  'rc.why.title': {
    de: 'Bewertungen sind<br /><em>lokale Währung</em>.',
    en: 'Reviews are<br /><em>the local currency</em>.',
    tr: 'Değerlendirmeler<br /><em>yerel para birimidir</em>.',
  },
  'rc.why1.t': {
    de: 'Sichtbarkeit in der Karte',
    en: 'Visibility on the map',
    tr: 'Haritada görünürlük',
  },
  'rc.why1.d': {
    de: 'Wer in Google Maps weiter oben steht, wird angerufen. Anzahl und Aktualität der Bewertungen gehören zu den Faktoren, die dort mitspielen — und sind die einzigen, die Sie selbst beeinflussen können.',
    en: 'Whoever ranks higher in Google Maps gets the call. The number and recency of reviews are among the factors at play — and the only ones you can influence yourself.',
    tr: 'Google Haritalar’da üstte olan aranır. Değerlendirmelerin sayısı ve güncelliği bu sıralamada rol oynayan etkenlerdendir — ve kendiniz etkileyebileceğiniz tek etkendir.',
  },
  'rc.why2.t': {
    de: 'Vertrauen vor dem ersten Kontakt',
    en: 'Trust before the first contact',
    tr: 'İlk temastan önce güven',
  },
  'rc.why2.d': {
    de: 'Die meisten Kunden lesen Bewertungen, bevor sie anrufen. Zwölf aktuelle Meinungen wirken anders als drei aus dem Jahr 2019 — unabhängig davon, wie gut Ihre Arbeit ist.',
    en: 'Most customers read reviews before they call. Twelve recent opinions land differently than three from 2019 — no matter how good your work is.',
    tr: 'Çoğu müşteri aramadan önce yorumları okur. On iki güncel yorum, 2019’dan kalma üç yorumla aynı etkiyi yapmaz — işiniz ne kadar iyi olursa olsun.',
  },
  'rc.why3.t': {
    de: 'Der Moment zählt',
    en: 'The moment is what counts',
    tr: 'An önemli',
  },
  'rc.why3.d': {
    de: 'Zufriedene Kunden bewerten selten von zu Hause aus — sie tun es dort, wo sie gerade zufrieden sind. Genau dafür liegt die Karte auf dem Tresen.',
    en: 'Happy customers rarely leave a review once they’re home — they do it where they are happy. That is exactly why the card sits on the counter.',
    tr: 'Memnun müşteriler eve döndükten sonra nadiren yorum yazar — memnun oldukları yerde yazarlar. Kartın tezgâhta durmasının sebebi tam olarak bu.',
  },
  'rc.fair.label': {
    de: 'Fair bleiben',
    en: 'Playing fair',
    tr: 'Dürüst kalmak',
  },
  'rc.fair.title': {
    de: 'Wir verkaufen Karten, keine Bewertungen.',
    en: 'We sell cards, not reviews.',
    tr: 'Biz kart satıyoruz, yorum değil.',
  },
  'rc.fair.text': {
    de: 'Die Karte macht das Bewerten einfacher — mehr nicht. Gekaufte Bewertungen, Rabatte gegen Sterne oder das Vorfiltern unzufriedener Kunden verstoßen gegen Googles Richtlinien und können das Profil kosten. Wir machen so etwas nicht und raten davon ab. Was Sie bekommen, ist der kürzere Weg zum Formular; was dort steht, entscheidet Ihr Gast.',
    en: 'The card makes leaving a review easier — nothing more. Buying reviews, trading discounts for stars or filtering out unhappy customers breaks Google’s policies and can cost you the profile. We don’t do it and advise against it. What you get is a shorter path to the form; what ends up in it is your guest’s call.',
    tr: 'Kart yalnızca yorum bırakmayı kolaylaştırır — fazlası değil. Yorum satın almak, yıldız karşılığı indirim vermek veya memnuniyetsiz müşterileri elemek Google politikalarına aykırıdır ve profilinizi kaybettirebilir. Biz bunu yapmıyoruz ve önermiyoruz. Aldığınız şey forma giden kısa yol; orada ne yazacağına misafiriniz karar verir.',
  },
  'rc.faq.label': {
    de: 'Fragen',
    en: 'Questions',
    tr: 'Sorular',
  },
  'rc.faq.title': {
    de: 'Was Kunden<br /><em>vorher fragen</em>.',
    en: 'What customers<br /><em>ask first</em>.',
    tr: 'Müşterilerin<br /><em>önceden sorduğu şeyler</em>.',
  },
  'rc.faq1.q': {
    de: 'Funktioniert das auf jedem Handy?',
    en: 'Does it work on every phone?',
    tr: 'Her telefonda çalışır mı?',
  },
  'rc.faq1.a': {
    de: 'NFC beherrschen praktisch alle iPhones ab dem XR und nahezu alle Android-Geräte der letzten Jahre. Für ältere Geräte ist der QR-Code aufgedruckt — der funktioniert mit jeder Kamera-App.',
    en: 'NFC works on practically every iPhone from the XR onwards and on nearly all recent Android phones. For older devices the QR code is printed on the card — it works with any camera app.',
    tr: 'NFC, XR ve sonrası neredeyse tüm iPhone’larda ve son yılların hemen tüm Android cihazlarında çalışır. Daha eski cihazlar için kartta QR kod basılıdır — her kamera uygulamasıyla açılır.',
  },
  'rc.faq2.q': {
    de: 'Brauche ich ein Abo oder ein Konto bei Ihnen?',
    en: 'Do I need a subscription or an account with you?',
    tr: 'Abonelik veya sizde hesap gerekiyor mu?',
  },
  'rc.faq2.a': {
    de: 'Nein. Sie zahlen einmal für die Karte. Der Chip zeigt direkt auf Ihre Google-Bewertungsseite, nicht auf einen Dienst von uns — es gibt also nichts, was wir abschalten könnten. Das Digital-Abo ist nur eine Option für alle, die lieber monatlich zahlen und Website und Pflege gleich dazunehmen.',
    en: 'No. You pay once for the card. The chip points straight at your Google review page, not at a service of ours — so there is nothing we could switch off. The digital plan is just an option for those who would rather pay monthly and add a website and ongoing care.',
    tr: 'Hayır. Kart için bir kez ödeme yaparsınız. Çip doğrudan Google değerlendirme sayfanıza yönlendirir, bizim bir hizmetimize değil — yani kapatabileceğimiz bir şey yok. Dijital abonelik yalnızca aylık ödemeyi tercih edenler ve web sitesi ile bakımı da isteyenler için bir seçenektir.',
  },
  'rc.faq3.q': {
    de: 'Ist das erlaubt?',
    en: 'Is this allowed?',
    tr: 'Bu yasal mı?',
  },
  'rc.faq3.a': {
    de: 'Kunden um eine Bewertung zu bitten ist erlaubt und von Google ausdrücklich vorgesehen. Nicht erlaubt sind Gegenleistungen wie Rabatte oder Gratisbeigaben und das gezielte Aussortieren unzufriedener Kunden. Die Karte fragt neutral — was der Gast schreibt, steht ihm frei.',
    en: 'Asking customers for a review is allowed and explicitly supported by Google. What isn’t allowed is offering something in return — discounts, freebies — or deliberately screening out unhappy customers. The card asks neutrally; what the guest writes is up to them.',
    tr: 'Müşteriden yorum istemek serbesttir ve Google tarafından açıkça öngörülmüştür. Yasak olan, karşılığında indirim veya hediye vermek ve memnuniyetsiz müşterileri ayıklamaktır. Kart tarafsız sorar; misafirin ne yazacağı kendi bileceği iştir.',
  },
  'rc.faq4.q': {
    de: 'Was, wenn wir umziehen oder das Profil sich ändert?',
    en: 'What if we move or the profile changes?',
    tr: 'Taşınırsak veya profil değişirse ne olur?',
  },
  'rc.faq4.a': {
    de: 'Der NFC-Chip lässt sich neu beschreiben. Schicken Sie uns die Karten zu, wir programmieren sie auf das neue Ziel um — innerhalb des ersten Jahres kostenfrei. Nur der aufgedruckte QR-Code bleibt, wie er ist.',
    en: 'The NFC chip can be rewritten. Send the cards back and we’ll point them at the new destination — free of charge within the first year. Only the printed QR code stays as it is.',
    tr: 'NFC çipi yeniden yazılabilir. Kartları bize gönderin, yeni hedefe programlayalım — ilk yıl içinde ücretsiz. Sadece basılı QR kod olduğu gibi kalır.',
  },
  'rc.faq5.q': {
    de: 'Wir haben noch gar kein Google-Profil.',
    en: 'We don’t have a Google profile yet.',
    tr: 'Henüz Google profilimiz yok.',
  },
  'rc.faq5.a': {
    de: 'Dann fangen wir dort an. Das Unternehmensprofil ist kostenlos; wir legen es an, tragen Kategorien, Zeiten und Leistungen ein und begleiten die Verifizierung. Im Tresen-Set ist das enthalten, sonst berechnen wir es nach Aufwand.',
    en: 'Then that’s where we start. The Business Profile is free; we create it, fill in categories, hours and services and walk you through verification. It’s included in the counter set, otherwise billed by time.',
    tr: 'O zaman oradan başlıyoruz. İşletme profili ücretsizdir; biz oluşturur, kategorileri, saatleri ve hizmetleri girer ve doğrulama sürecinde eşlik ederiz. Tezgâh setine dahildir, aksi hâlde harcanan süreye göre ücretlendirilir.',
  },
  'rc.cta.title': {
    de: 'Karte hinlegen,<br /><em>Bewertungen einsammeln</em>.',
    en: 'Put the card down,<br /><em>collect the reviews</em>.',
    tr: 'Kartı koyun,<br /><em>yorumları toplayın</em>.',
  },
  'rc.cta.text': {
    de: 'Schreiben Sie uns, welches Paket passt und wie Ihr Betrieb heißt — den Rest klären wir in zwei Nachrichten.',
    en: 'Tell us which package fits and what your business is called — we’ll sort out the rest in two messages.',
    tr: 'Hangi paketin uyduğunu ve işletmenizin adını yazın — gerisini iki mesajda hallederiz.',
  },
  'rc.mail.subject': {
    de: 'Anfrage Google-Bewertungskarten',
    en: 'Enquiry: Google review cards',
    tr: 'Google değerlendirme kartları talebi',
  },
  'rc.mail.package': {
    de: 'Gewünschtes Paket',
    en: 'Chosen package',
    tr: 'İstenen paket',
  },
  'rc.mail.body': {
    de: 'Guten Tag,\n\nwir hätten gern Bewertungskarten.\n\nBetrieb: \nAdresse: \nLink zum Google-Profil (falls vorhanden): \nName oder Logo auf der Karte: \n\nViele Grüße',
    en: 'Hello,\n\nwe would like some review cards.\n\nBusiness: \nAddress: \nLink to the Google profile (if you have one): \nName or logo on the card: \n\nBest regards',
    tr: 'Merhaba,\n\ndeğerlendirme kartı almak istiyoruz.\n\nİşletme: \nAdres: \nGoogle profil bağlantısı (varsa): \nKartta yer alacak ad veya logo: \n\nİyi çalışmalar',
  },
  'about.folio': {
    de: 'Über uns',
    en: 'About us',
    tr: 'Hakkımızda',
  },
  'about.label': {
    de: 'Wer wir sind',
    en: 'Who we are',
    tr: 'Biz kimiz',
  },
  'about.title': {
    de: 'Ein Ansprechpartner,<br /><em>der auch abnimmt</em>.',
    en: 'One contact person<br /><em>who also picks up</em>.',
    tr: 'Telefonu da açan<br /><em>tek bir muhatap</em>.',
  },
  'about.intro': {
    de: 'Breisgau Digital ist ein kleines Unternehmen aus Freiburg im Breisgau. Wir digitalisieren Betriebe, für die eine eigene IT-Abteilung nie zur Debatte stand — und bleiben danach erreichbar.',
    en: 'Breisgau Digital is a small company from Freiburg, Germany. We digitalise businesses for which an in-house IT department was never on the table — and we stay reachable afterwards.',
    tr: 'Breisgau Digital, Freiburg im Breisgau merkezli küçük bir işletmedir. Kendi BT departmanı hiçbir zaman gündeme gelmemiş işletmeleri dijitalleştiriyor ve sonrasında da ulaşılabilir kalıyoruz.',
  },
  'about.story.p1': {
    de: 'Die meisten Betriebe, die bei uns anrufen, haben kein Digitalproblem. Sie haben ein Zeitproblem: Termine im Kalender an der Wand, Bestände im Kopf, Angebote abends am Küchentisch.',
    en: 'Most businesses that call us don’t have a digital problem. They have a time problem: appointments on the wall calendar, stock in someone’s head, quotes written at the kitchen table at night.',
    tr: 'Bizi arayan işletmelerin çoğunun dijital sorunu yok. Zaman sorunu var: randevular duvardaki takvimde, stok akılda, teklifler akşam mutfak masasında.',
  },
  'about.story.p2': {
    de: 'Wir fangen deshalb nicht mit Technik an, sondern mit dem Tag: Was passiert von morgens bis abends, und an welcher Stelle geht Zeit verloren? Daraus wird eine Liste — und aus der Liste das, was wirklich gebaut wird. Manchmal ist das eine Website. Manchmal ist es eine Oberfläche, die niemand außer Ihrem Team je sieht.',
    en: 'So we don’t start with technology, we start with the day: what happens from morning to evening, and where does time get lost? That produces a list — and from the list, what actually gets built. Sometimes that’s a website. Sometimes it’s an interface nobody but your team will ever see.',
    tr: 'Bu yüzden teknolojiden değil, günden başlıyoruz: Sabahtan akşama ne oluyor ve zaman nerede kaybediliyor? Ortaya bir liste çıkıyor — ve o listeden gerçekten yapılacak olan. Bazen bu bir web sitesi. Bazen de ekibiniz dışında kimsenin görmeyeceği bir arayüz.',
  },
  'about.story.p3': {
    de: 'Was wir bauen, betreiben wir meistens auch. Die Systeme unserer Kunden laufen auf eigenen Servern, die wir überwachen — nicht auf einem Baukasten, der nächstes Jahr die Preise verdoppelt.',
    en: 'What we build, we usually also run. Our clients’ systems live on servers we monitor — not on a website builder that doubles its prices next year.',
    tr: 'Yaptığımız işi çoğunlukla biz de işletiyoruz. Müşterilerimizin sistemleri, izlediğimiz kendi sunucularımızda çalışıyor — gelecek yıl fiyatını ikiye katlayacak bir hazır platformda değil.',
  },
  'about.fig.projects': {
    de: 'Kundenprojekte',
    en: 'Client projects',
    tr: 'Müşteri projesi',
  },
  'about.fig.live': {
    de: 'Systeme im Betrieb',
    en: 'Systems in production',
    tr: 'Canlı sistem',
  },
  'about.fig.langs': {
    de: 'Sprachen ausgeliefert',
    en: 'Languages shipped',
    tr: 'Teslim edilen dil',
  },
  'about.principles.label': {
    de: 'Grundsätze',
    en: 'Principles',
    tr: 'İlkeler',
  },
  'about.principles.title': {
    de: 'Vier Dinge, auf die<br /><em>Sie sich verlassen können</em>.',
    en: 'Four things<br /><em>you can rely on</em>.',
    tr: '<em>Güvenebileceğiniz</em><br />dört şey.',
  },
  'about.pr1.t': {
    de: 'Festpreis statt Stundenzettel',
    en: 'Fixed price, not an open meter',
    tr: 'Saat kartı değil, sabit fiyat',
  },
  'about.pr1.d': {
    de: 'Sie bekommen vorher eine Zahl und wissen, was drin ist. Wenn sich unterwegs etwas ändert, sagen wir es, bevor wir es tun.',
    en: 'You get a number up front and know what it covers. If something changes along the way, we say so before we do it.',
    tr: 'Önceden bir rakam alırsınız ve neyin dahil olduğunu bilirsiniz. Yolda bir şey değişirse, yapmadan önce söyleriz.',
  },
  'about.pr2.t': {
    de: 'Sie gehören Ihnen',
    en: 'It belongs to you',
    tr: 'Size ait',
  },
  'about.pr2.d': {
    de: 'Domain, Konten, Daten und Quellcode laufen auf Ihren Namen. Wenn Sie morgen zu jemand anderem wechseln, nehmen Sie alles mit.',
    en: 'Domain, accounts, data and source code are in your name. If you move to someone else tomorrow, you take everything with you.',
    tr: 'Alan adı, hesaplar, veriler ve kaynak kodu sizin adınıza. Yarın başkasına geçerseniz hepsini yanınızda götürürsünüz.',
  },
  'about.pr3.t': {
    de: 'Deutsch, Türkisch, Englisch',
    en: 'German, Turkish, English',
    tr: 'Almanca, Türkçe, İngilizce',
  },
  'about.pr3.d': {
    de: 'Beratung in der Sprache, in der Sie denken. Unsere Websites liefern wir auf Wunsch in bis zu fünfzehn Sprachen aus — das ist bei uns kein Aufpreis-Extra.',
    en: 'Advice in the language you think in. Our websites ship in up to fifteen languages if you want them — that isn’t a paid extra here.',
    tr: 'Düşündüğünüz dilde danışmanlık. Web sitelerimizi istediğinizde on beş dile kadar teslim ediyoruz — bu bizde ek ücretli bir özellik değil.',
  },
  'about.pr4.t': {
    de: 'Nach dem Launch ist nicht Schluss',
    en: 'Launch isn’t the end',
    tr: 'Yayına almakla bitmiyor',
  },
  'about.pr4.d': {
    de: 'Die meisten unserer Systeme betreuen wir seit dem ersten Tag. Updates, Zertifikate, Backups und die Frage um halb sieben abends gehören dazu.',
    en: 'We’ve looked after most of our systems since day one. Updates, certificates, backups and the question at half past six in the evening are part of it.',
    tr: 'Sistemlerimizin çoğuna ilk günden beri biz bakıyoruz. Güncellemeler, sertifikalar, yedekler ve akşam altı buçuktaki soru buna dahil.',
  },
  'about.process.label': {
    de: 'Ablauf',
    en: 'How we work',
    tr: 'Süreç',
  },
  'about.process.title': {
    de: 'Vom Gespräch<br /><em>zum laufenden Betrieb</em>.',
    en: 'From conversation<br /><em>to daily operation</em>.',
    tr: 'Görüşmeden<br /><em>günlük işleyişe</em>.',
  },
  'about.proc1.t': {
    de: 'Erstgespräch',
    en: 'First conversation',
    tr: 'İlk görüşme',
  },
  'about.proc1.d': {
    de: 'Eine halbe Stunde, telefonisch oder bei Ihnen vor Ort. Wir hören zu und sagen ehrlich, ob sich der Aufwand lohnt. Kostenlos und unverbindlich.',
    en: 'Half an hour, by phone or at your place. We listen and say honestly whether the effort is worth it. Free and without obligation.',
    tr: 'Yarım saat, telefonla ya da yerinizde. Dinliyoruz ve bu işin zahmete değip değmediğini dürüstçe söylüyoruz. Ücretsiz ve bağlayıcı değil.',
  },
  'about.proc2.t': {
    de: 'Angebot mit Festpreis',
    en: 'Fixed-price quote',
    tr: 'Sabit fiyatlı teklif',
  },
  'about.proc2.d': {
    de: 'Sie bekommen schriftlich, was gebaut wird, was es kostet und wann es fertig ist. Ohne Posten, die niemand versteht.',
    en: 'You get it in writing: what gets built, what it costs, when it’s done. No line items nobody understands.',
    tr: 'Neyin yapılacağını, ne kadar tutacağını ve ne zaman biteceğini yazılı alırsınız. Kimsenin anlamadığı kalemler olmadan.',
  },
  'about.proc3.t': {
    de: 'Bauen und zeigen',
    en: 'Build and show',
    tr: 'Yapmak ve göstermek',
  },
  'about.proc3.d': {
    de: 'Sie sehen Zwischenstände, nicht nur das Endergebnis. Änderungswünsche sind in dieser Phase normal und eingeplant.',
    en: 'You see work in progress, not just the final result. Change requests at this stage are normal and budgeted for.',
    tr: 'Sadece nihai sonucu değil, ara aşamaları da görürsünüz. Bu aşamada değişiklik talepleri normaldir ve planlanmıştır.',
  },
  'about.proc4.t': {
    de: 'Übergabe und Betrieb',
    en: 'Handover and operation',
    tr: 'Teslim ve işletme',
  },
  'about.proc4.d': {
    de: 'Einweisung für Ihr Team, Zugänge auf Ihren Namen, danach laufender Betrieb mit Updates und Sicherungen — oder Sie übernehmen selbst.',
    en: 'A walkthrough for your team, access in your name, then ongoing operation with updates and backups — or you take it over yourself.',
    tr: 'Ekibinize tanıtım, hesaplar sizin adınıza, sonrasında güncelleme ve yedeklerle işletme — ya da devralırsınız.',
  },
  'about.who.label': {
    de: 'Dahinter',
    en: 'Behind it',
    tr: 'Arkasında',
  },
  'about.who.title': {
    de: 'Wer <em>am Telefon</em> ist.',
    en: 'Who is <em>on the phone</em>.',
    tr: '<em>Telefondaki</em> kişi.',
  },
  'about.who.role': {
    de: 'Gründer · Fachinformatiker (IHK)',
    en: 'Founder · IT specialist (IHK)',
    tr: 'Kurucu · Bilişim uzmanı (IHK)',
  },
  'about.who.text': {
    de: 'Breisgau Digital ist das Einzelunternehmen von <strong>Hamza Öztürk</strong>. Ausgebildeter Fachinformatiker (IHK), vorher Full-Stack-Entwickler bei einem Freiburger Softwarehaus, wo unter anderem ein Desktop-ERP in eine Web-Anwendung überführt wurde. Für größere Vorhaben arbeiten wir mit festen Partnern für Gestaltung, Text und Fotografie — Ihr Ansprechpartner bleibt derselbe.',
    en: 'Breisgau Digital is the sole proprietorship of <strong>Hamza Öztürk</strong>. A qualified IT specialist (IHK), previously a full-stack developer at a Freiburg software company, where among other things a desktop ERP was migrated to a web application. For larger jobs we work with regular partners for design, copy and photography — your contact person stays the same.',
    tr: 'Breisgau Digital, <strong>Hamza Öztürk</strong>’ün şahıs işletmesidir. IHK diplomalı bilişim uzmanı; öncesinde Freiburg’da bir yazılım firmasında full-stack geliştirici olarak, diğer işlerin yanında bir masaüstü ERP’yi web uygulamasına taşıdı. Daha büyük işlerde tasarım, metin ve fotoğraf için sabit iş ortaklarıyla çalışıyoruz — muhatabınız aynı kişi kalıyor.',
  },
  'about.cta.title': {
    de: 'Erzählen Sie uns,<br /><em>wo es klemmt</em>.',
    en: 'Tell us<br /><em>where it jams</em>.',
    tr: 'Bize <em>nerede</em><br />takıldığını anlatın.',
  },
  'about.cta.text': {
    de: 'Ein Anruf, eine halbe Stunde, keine Verpflichtung. Danach wissen Sie, was sich für Ihren Betrieb lohnt — und was Sie sich sparen können.',
    en: 'One call, half an hour, no obligation. Afterwards you’ll know what is worth doing for your business — and what you can skip.',
    tr: 'Bir telefon, yarım saat, yükümlülük yok. Sonrasında işletmeniz için neyin değdiğini — ve neyden tasarruf edebileceğinizi bilirsiniz.',
  },
};

export const TRANSLATIONS: Record<string, Entry> = {
  ...BASE_TRANSLATIONS,
  ...COMPANY_TRANSLATIONS,
};
