import type { Entry } from '../../core/i18n/translations';

/**
 * Texte der Wartungsseite (/wartung). Banner und Navigation stehen in
 * company-content.ts, weil sie auf mehreren Seiten gebraucht werden.
 * Werden von WartungComponent beim I18nService registriert.
 */
export const WARTUNG_CONTENT: Record<string, Entry> = {
  'wart.label': { de: 'Wartung & Pflege', fr: 'Maintenance', en: 'Maintenance', tr: 'Bakım', ku: 'Lênêrîn' },
  'wart.title': {
    de: 'Ihre Website bleibt<br /><em>aktuell und sicher</em>.',
    fr: 'Votre site reste<br /><em>à jour et sûr</em>.',
    en: 'Your website stays<br /><em>current and secure</em>.',
    tr: 'Web siteniz her zaman<br /><em>güncel ve güvende</em>.',
    ku: 'Malpera we her dem<br /><em>nû û ewle dimîne</em>.',
  },
  'wart.intro': {
    de: 'Hosting, Updates, Backups und kleine Änderungen zum festen Monatspreis. Monatlich kündbar, ohne Einrichtungsgebühr.',
    fr: 'Hébergement, mises à jour, sauvegardes et petites modifications à prix mensuel fixe. Résiliable chaque mois, sans frais de mise en place.',
    en: 'Hosting, updates, backups and small changes at a fixed monthly price. Cancel monthly, no setup fee.',
    tr: 'Barındırma, güncellemeler, yedekler ve küçük değişiklikler sabit aylık fiyatla. Her ay iptal edilebilir, kurulum ücreti yok.',
    ku: 'Hosting, nûkirin, paşkeftin û guhertinên biçûk bi bihayê mehane yê sabît. Meh bi meh tê betalkirin, bê lêçûna sazkirinê.',
  },
  'wart.badge': { de: 'Meistgewählt', fr: 'Le plus choisi', en: 'Most chosen', tr: 'En çok tercih edilen', ku: 'Herî zêde tê hilbijartin' },
  'wart.price': { de: '{p} €', fr: '{p} €', en: '€{p}', tr: '{p} €', ku: '{p} €' },
  'wart.per': { de: 'pro Monat', fr: 'par mois', en: 'per month', tr: 'aylık', ku: 'di mehê de' },
  'wart.setup.none': { de: 'Keine Einrichtungsgebühr', fr: 'Pas de frais de mise en place', en: 'No setup fee', tr: 'Kurulum ücreti yok', ku: 'Bê lêçûna sazkirinê' },
  'wart.term': { de: 'Monatlich kündbar', fr: 'Résiliable chaque mois', en: 'Cancel monthly', tr: 'Her ay iptal edilebilir', ku: 'Meh bi meh tê betalkirin' },
  'wart.cta.request': { de: 'Paket anfragen', fr: 'Demander ce forfait', en: 'Request this plan', tr: 'Paketi talep et', ku: 'Pakêtê bipirse' },

  'wart.plan.basis.name': { de: 'Basis', fr: 'Essentiel', en: 'Basic', tr: 'Temel', ku: 'Bingehîn' },
  'wart.plan.basis.for': {
    de: 'Für alle, die selbst pflegen und nur Ruhe wollen.',
    fr: 'Pour ceux qui gèrent seuls et veulent la tranquillité.',
    en: 'For those who update it themselves and just want peace of mind.',
    tr: 'Kendi güncelleyip sadece huzur isteyenler için.',
    ku: 'Ji bo wan ên ku bi xwe nû dikin û tenê aramî dixwazin.',
  },
  'wart.plan.basis.p1': { de: 'Hosting auf deutschem Server mit SSL', fr: 'Hébergement sur serveur allemand avec SSL', en: 'Hosting on a German server with SSL', tr: 'Almanya’daki sunucuda barındırma ve SSL', ku: 'Hosting li ser serverê Almanyayê bi SSL' },
  'wart.plan.basis.p2': { de: 'Tägliche Backups', fr: 'Sauvegardes quotidiennes', en: 'Daily backups', tr: 'Günlük yedekler', ku: 'Paşkeftinên rojane' },
  'wart.plan.basis.p3': { de: 'Sicherheits- und Software-Updates', fr: 'Mises à jour de sécurité et logicielles', en: 'Security and software updates', tr: 'Güvenlik ve yazılım güncellemeleri', ku: 'Nûkirinên ewlehiyê û nermalavê' },
  'wart.plan.basis.p4': { de: 'Erreichbarkeits-Überwachung mit Alarm', fr: 'Surveillance de disponibilité avec alerte', en: 'Uptime monitoring with alerts', tr: 'Erişilebilirlik izleme ve alarm', ku: 'Çavdêriya gihîştinê bi hişyarî' },

  'wart.plan.pflege.name': { de: 'Pflege', fr: 'Suivi', en: 'Care', tr: 'Bakım', ku: 'Lênêrîn' },
  'wart.plan.pflege.for': {
    de: 'Für Betriebe, die ab und zu etwas geändert haben möchten.',
    fr: 'Pour les entreprises qui veulent de temps en temps une modification.',
    en: 'For businesses that want something changed now and then.',
    tr: 'Ara sıra bir şeyin değişmesini isteyen işletmeler için.',
    ku: 'Ji bo karsaziyên ku carinan guhertinekê dixwazin.',
  },
  'wart.plan.pflege.p1': { de: 'Alles aus Basis', fr: 'Tout le forfait Essentiel', en: 'Everything in Basic', tr: 'Temel paketteki her şey', ku: 'Her tiştê di Bingehîn de' },
  'wart.plan.pflege.p2': { de: 'Bis zu 30 Minuten Änderungen pro Monat (Texte, Bilder, Öffnungszeiten)', fr: 'Jusqu’à 30 minutes de modifications par mois (textes, images, horaires)', en: 'Up to 30 minutes of changes per month (copy, images, opening hours)', tr: 'Ayda 30 dakikaya kadar değişiklik (metin, görsel, çalışma saatleri)', ku: 'Heta 30 deqe guhertin di mehê de (nivîs, wêne, demjimêr)' },
  'wart.plan.pflege.p3': { de: 'Monatlicher Bericht zu Besuchern und Suchanfragen', fr: 'Rapport mensuel sur les visiteurs et les recherches', en: 'Monthly report on visitors and searches', tr: 'Ziyaretçi ve aramalar hakkında aylık rapor', ku: 'Raporta mehane ya li ser mêvan û lêgerînan' },
  'wart.plan.pflege.p4': { de: 'Antwort innerhalb eines Werktags', fr: 'Réponse sous un jour ouvré', en: 'Reply within one working day', tr: 'Bir iş günü içinde yanıt', ku: 'Bersiv di nav rojekê ya xebatê de' },

  'wart.plan.plus.name': { de: 'Plus', fr: 'Plus', en: 'Plus', tr: 'Plus', ku: 'Plus' },
  'wart.plan.plus.for': {
    de: 'Für Betriebe, deren Website laufend mitwachsen soll.',
    fr: 'Pour les entreprises dont le site doit évoluer en continu.',
    en: 'For businesses whose website should keep growing.',
    tr: 'Web sitesi sürekli gelişmesi gereken işletmeler için.',
    ku: 'Ji bo karsaziyên ku malpera wan divê bi domdarî mezin bibe.',
  },
  'wart.plan.plus.p1': { de: 'Alles aus Pflege', fr: 'Tout le forfait Suivi', en: 'Everything in Care', tr: 'Bakım paketindeki her şey', ku: 'Her tiştê di Lênêrînê de' },
  'wart.plan.plus.p2': { de: 'Bis zu 2 Stunden Änderungen pro Monat', fr: 'Jusqu’à 2 heures de modifications par mois', en: 'Up to 2 hours of changes per month', tr: 'Ayda 2 saate kadar değişiklik', ku: 'Heta 2 saet guhertin di mehê de' },
  'wart.plan.plus.p3': { de: 'Eine SEO-Verbesserung pro Monat und Pflege Ihres Google-Unternehmensprofils', fr: 'Une amélioration SEO par mois et suivi de votre fiche Google', en: 'One SEO improvement per month and upkeep of your Google Business Profile', tr: 'Ayda bir SEO iyileştirmesi ve Google İşletme Profili bakımı', ku: 'Di mehê de yek başkirina SEO û lênêrîna profîla Google ya karsaziyê' },
  'wart.plan.plus.p4': { de: 'Antwort am selben Werktag', fr: 'Réponse le jour ouvré même', en: 'Same-working-day reply', tr: 'Aynı iş günü yanıt', ku: 'Bersiv di heman rojê ya xebatê de' },

  'wart.note.label': { de: 'Gut zu wissen', fr: 'Bon à savoir', en: 'Good to know', tr: 'Bilmekte fayda var', ku: 'Baş e bê zanin' },
  'wart.note.title': {
    de: 'Auch für Websites, die wir nicht gebaut haben.',
    fr: 'Aussi pour les sites que nous n’avons pas créés.',
    en: 'Also for websites we didn’t build.',
    tr: 'Biz yapmamış olsak da her web sitesi için.',
    ku: 'Ji bo malperên ku me çênekirine jî.',
  },
  'wart.note.text': {
    de: 'Wir übernehmen bestehende Websites nach einem kurzen Check. Nicht genutzte Änderungszeit verfällt am Monatsende; größere Wünsche bieten wir vorab schriftlich an.',
    fr: 'Nous reprenons les sites existants après un court contrôle. Le temps de modification non utilisé expire en fin de mois ; les demandes plus importantes font l’objet d’un devis écrit préalable.',
    en: 'We take over existing websites after a short check. Unused change time lapses at the end of the month; bigger requests are quoted in writing up front.',
    tr: 'Mevcut web sitelerini kısa bir kontrolden sonra devralırız. Kullanılmayan değişiklik süresi ay sonunda sona erer; daha büyük istekler önceden yazılı olarak teklif edilir.',
    ku: 'Em malperên heyî piştî kontrolek kurt digirin ser xwe. Dema guhertinê ya nehatiye bikaranîn di dawiya mehê de diqede; daxwazên mezintir berê bi nivîskî têne pêşniyar kirin.',
  },

  'wart.steps.label': { de: 'Ablauf', fr: 'Déroulement', en: 'How it works', tr: 'Süreç', ku: 'Pêvajo' },
  'wart.steps.title': {
    de: 'In vier Schritten<br /><em>betreut</em>.',
    fr: 'Suivi<br /><em>en quatre étapes</em>.',
    en: 'Looked after<br /><em>in four steps</em>.',
    tr: 'Dört adımda<br /><em>bakımda</em>.',
    ku: 'Di çar gavan de<br /><em>tê lênêrîn</em>.',
  },
  'wart.step1.t': { de: 'Kurzer Check', fr: 'Court contrôle', en: 'Quick check', tr: 'Kısa kontrol', ku: 'Kontrola kurt' },
  'wart.step1.d': { de: 'Wir sehen uns Ihre Website an — kostenlos und ohne Verpflichtung.', fr: 'Nous examinons votre site — gratuitement et sans engagement.', en: 'We look at your website — free and without obligation.', tr: 'Web sitenize bakarız — ücretsiz ve bağlayıcı değil.', ku: 'Em li malpera we dinêrin — belaş û bê mecbûrî.' },
  'wart.step2.t': { de: 'Paket wählen', fr: 'Choisir un forfait', en: 'Pick a plan', tr: 'Paket seçimi', ku: 'Hilbijartina pakêtê' },
  'wart.step2.d': { de: 'Sie entscheiden, wie viel Betreuung Sie brauchen.', fr: 'Vous décidez de l’ampleur du suivi dont vous avez besoin.', en: 'You decide how much support you need.', tr: 'Ne kadar desteğe ihtiyacınız olduğuna siz karar verirsiniz.', ku: 'Hûn biryar didin ku hûn çiqas piştgiriyê dixwazin.' },
  'wart.step3.t': { de: 'Übernahme', fr: 'Reprise', en: 'Handover', tr: 'Devralma', ku: 'Girtina ser xwe' },
  'wart.step3.d': { de: 'Wir richten Backups und Überwachung ein; Ihre Zugänge bleiben auf Ihren Namen.', fr: 'Nous mettons en place sauvegardes et surveillance ; vos accès restent à votre nom.', en: 'We set up backups and monitoring; your logins stay in your name.', tr: 'Yedekleme ve izlemeyi kurarız; erişimleriniz sizin adınıza kalır.', ku: 'Em paşkeftin û çavdêriyê saz dikin; gihîştinên we bi navê we dimînin.' },
  'wart.step4.t': { de: 'Laufende Betreuung', fr: 'Suivi continu', en: 'Ongoing care', tr: 'Sürekli bakım', ku: 'Lênêrîna domdar' },
  'wart.step4.d': { de: 'Ab jetzt melden Sie sich, wenn etwas geändert werden soll — wir kümmern uns um den Rest.', fr: 'Dès lors, contactez-nous pour toute modification — nous nous occupons du reste.', en: 'From now on you get in touch when something needs changing — we handle the rest.', tr: 'Bundan sonra bir şey değişecekse bize yazarsınız — gerisini biz hallederiz.', ku: 'Ji niha ve gava tiştek bê guhertin hûn bi me re têkilî datînin — yê mayî em dikin.' },

  'wart.faq.label': { de: 'Häufige Fragen', fr: 'Questions fréquentes', en: 'FAQ', tr: 'Sık sorulanlar', ku: 'Pirsên pir tên pirsîn' },
  'wart.faq.title': {
    de: 'Was Kunden<br /><em>zur Wartung fragen</em>.',
    fr: 'Ce que les clients<br /><em>demandent sur la maintenance</em>.',
    en: 'What customers<br /><em>ask about maintenance</em>.',
    tr: 'Müşterilerin<br /><em>bakım hakkında sorduğu sorular</em>.',
    ku: 'Xerîdar<br /><em>derbarê lênêrînê çi dipirsin</em>.',
  },
  'wart.faq1.q': { de: 'Gilt das auch für Websites, die Sie nicht gebaut haben?', fr: 'Est-ce valable aussi pour les sites que vous n’avez pas créés ?', en: 'Does this also apply to websites you didn’t build?', tr: 'Bu, sizin yapmadığınız web siteleri için de geçerli mi?', ku: 'Ma ev ji bo malperên ku we çênekirine jî derbas dibe?' },
  'wart.faq1.a': { de: 'Ja, nach einem kurzen Check. Manche Systeme und Baukästen lassen sich nicht sauber betreuen — dann sagen wir Ihnen das vorher und nennen eine Alternative.', fr: 'Oui, après un court contrôle. Certains systèmes ne se prêtent pas à un suivi propre — nous vous le disons alors à l’avance et proposons une alternative.', en: 'Yes, after a short check. Some systems and site builders can’t be looked after properly — if so we tell you beforehand and suggest an alternative.', tr: 'Evet, kısa bir kontrolden sonra. Bazı sistemler ve site kurucular düzgün bakılamaz — öyleyse bunu önceden söyler ve bir alternatif öneririz.', ku: 'Erê, piştî kontrolek kurt. Hin pergal û avakerên malperê bi rêkûpêk nayên lênêrîn — wê demê em berê ji we re dibêjin û alternatîfekê pêşniyar dikin.' },
  'wart.faq2.q': { de: 'Was zählt als kleine Änderung?', fr: 'Qu’est-ce qu’une petite modification ?', en: 'What counts as a small change?', tr: 'Küçük değişiklik neyi kapsar?', ku: 'Guhertina biçûk çi ye?' },
  'wart.faq2.a': { de: 'Texte tauschen, Fotos ersetzen, Öffnungszeiten oder Preise anpassen, einen Abschnitt ergänzen. Neue Seiten oder Funktionen sind ein eigenes Angebot.', fr: 'Changer des textes, remplacer des photos, adapter horaires ou prix, ajouter une section. Les nouvelles pages ou fonctions font l’objet d’un devis séparé.', en: 'Swapping copy, replacing photos, adjusting opening hours or prices, adding a section. New pages or features are quoted separately.', tr: 'Metin değiştirme, fotoğraf yenileme, çalışma saati veya fiyat güncelleme, bir bölüm ekleme. Yeni sayfalar veya işlevler ayrı teklif konusudur.', ku: 'Guhertina nivîsan, guhertina wêneyan, sererastkirina demjimêr an biyan, zêdekirina beşekê. Rûpel an fonksiyonên nû pêşniyareke cuda ne.' },
  'wart.faq3.q': { de: 'Kann ich monatlich kündigen?', fr: 'Puis-je résilier chaque mois ?', en: 'Can I cancel monthly?', tr: 'Her ay iptal edebilir miyim?', ku: 'Ma ez dikarim her meh betal bikim?' },
  'wart.faq3.a': { de: 'Ja. Es gibt keine Mindestlaufzeit und keine Einrichtungsgebühr. Zum Ende des Monats können Sie jederzeit beenden; Ihre Daten und Zugänge übergeben wir Ihnen vollständig.', fr: 'Oui. Il n’y a ni durée minimale ni frais de mise en place. Vous pouvez arrêter à la fin de chaque mois ; nous vous remettons l’ensemble de vos données et accès.', en: 'Yes. There is no minimum term and no setup fee. You can stop at the end of any month; we hand over all your data and logins.', tr: 'Evet. Asgari süre ve kurulum ücreti yoktur. Herhangi bir ayın sonunda bitirebilirsiniz; tüm verilerinizi ve erişimlerinizi eksiksiz teslim ederiz.', ku: 'Erê. Ne demeke herî kêm û ne lêçûna sazkirinê heye. Hûn dikarin di dawiya her mehê de biqedînin; em hemû daneyên we û gihîştinan radest dikin.' },
  'wart.faq4.q': { de: 'Was, wenn die Änderungszeit nicht reicht?', fr: 'Et si le temps de modification ne suffit pas ?', en: 'What if the change time isn’t enough?', tr: 'Değişiklik süresi yetmezse ne olur?', ku: 'Heke dema guhertinê têrê neke çi dibe?' },
  'wart.faq4.a': { de: 'Dann sagen wir es vorab und nennen den Aufwand schriftlich — Sie entscheiden, ob wir ihn umsetzen.', fr: 'Nous vous le disons à l’avance et indiquons l’effort par écrit — vous décidez si nous le réalisons.', en: 'Then we tell you up front and put the effort in writing — you decide whether we do it.', tr: 'O zaman önceden söyler ve emeği yazılı bildiririz — yapıp yapmayacağımıza siz karar verirsiniz.', ku: 'Wê demê em berê ji we re dibêjin û xebatê bi nivîskî dibêjin — hûn biryar didin ka em wê bikin an na.' },
  'wart.faq5.q': { de: 'Ist die Domain im Preis enthalten?', fr: 'Le nom de domaine est-il inclus ?', en: 'Is the domain included?', tr: 'Alan adı fiyata dahil mi?', ku: 'Ma domain di bihayê de ye?' },
  'wart.faq5.a': { de: 'Die Domain bleibt auf Ihren Namen. Ihre Jahresgebühr dafür (meist 10 bis 20 €) nennen wir Ihnen vorab; sie fällt unabhängig vom Wartungspaket an.', fr: 'Le domaine reste à votre nom. Les frais annuels correspondants (généralement 10 à 20 €) vous sont indiqués à l’avance ; ils s’ajoutent indépendamment du forfait de maintenance.', en: 'The domain stays in your name. We tell you its annual fee (usually €10 to €20) up front; it applies regardless of the maintenance plan.', tr: 'Alan adı sizin adınıza kalır. Yıllık ücretini (genellikle 10 ila 20 €) önceden söyleriz; bakım paketinden bağımsız olarak ödenir.', ku: 'Domain bi navê we dimîne. Lêçûna wê ya salane (bi gelemperî 10 heta 20 €) em berê ji we re dibêjin; ew ji pakêta lênêrînê serbixwe ye.' },

  'wart.cta.title': {
    de: 'Ihre Website<br /><em>in guten Händen</em>.',
    fr: 'Votre site<br /><em>entre de bonnes mains</em>.',
    en: 'Your website<br /><em>in good hands</em>.',
    tr: 'Web siteniz<br /><em>güvenilir ellerde</em>.',
    ku: 'Malpera we<br /><em>di destên ewle de</em>.',
  },
  'wart.cta.text': {
    de: 'Schicken Sie uns die Adresse Ihrer Website. Wir schauen sie uns an und sagen Ihnen, welches Paket passt.',
    fr: 'Envoyez-nous l’adresse de votre site. Nous l’examinons et vous disons quel forfait convient.',
    en: 'Send us your website address. We’ll take a look and tell you which plan fits.',
    tr: 'Web sitenizin adresini bize gönderin. Bakıp hangi paketin uygun olduğunu söyleriz.',
    ku: 'Navnîşana malpera xwe ji me re bişînin. Em lê dinêrin û ji we re dibêjin kîjan pakêt maqûl e.',
  },

  'seo.wart.title': {
    de: 'Website-Wartung & Pflege ab {p} € im Monat | Breisgau Digital',
    fr: 'Maintenance de site web dès {p} € par mois | Breisgau Digital',
    en: 'Website maintenance from €{p} a month | Breisgau Digital',
    tr: 'Web sitesi bakımı aylık {p} €’dan | Breisgau Digital',
    ku: 'Lênêrîna malperê ji {p} € di mehê de | Breisgau Digital',
  },
  'seo.wart.desc': {
    de: 'Website-Wartung in Freiburg und Südbaden: Hosting, Updates, Backups und kleine Änderungen zum festen Monatspreis. Monatlich kündbar, auch für bestehende Websites.',
    fr: 'Maintenance de site web à Fribourg et dans le sud du Bade : hébergement, mises à jour, sauvegardes et petites modifications à prix mensuel fixe. Résiliable chaque mois.',
    en: 'Website maintenance in Freiburg and southern Baden: hosting, updates, backups and small changes at a fixed monthly price. Cancel monthly, also for existing websites.',
    tr: 'Freiburg ve Güney Baden’de web sitesi bakımı: barındırma, güncellemeler, yedekler ve küçük değişiklikler sabit aylık fiyatla. Her ay iptal edilebilir.',
    ku: 'Lênêrîna malperê li Freiburg û başûrê Badenê: hosting, nûkirin, paşkeftin û guhertinên biçûk bi bihayê mehane yê sabît. Meh bi meh tê betalkirin.',
  },
};
