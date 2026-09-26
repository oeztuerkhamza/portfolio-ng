# Yönetim paneli — kurulum

Yönetim paneli `/admin` adresinde çalışır (ör. `https://breisgau-digital.de/admin`). Bu dosya,
paneli bir kez çalışır hale getirmek için gereken adımları sırayla anlatır.

## Panelde neler var

| Bölüm | Ne işe yarar |
|---|---|
| **Talepler** | İletişim formundan gelen her talep burada; durum, not, "müşteri oluştur". |
| **Müşteriler** | Müşteri kartları: iletişim, adres, Google linki, notlar. |
| **Abonelikler** | Paket, ücret, başlangıç, asgari süre sonu (60 gün kala uyarı), durum. |
| **Faturalar** | Logolu Rechnung: taslak → kesinleştir (RE-2026-0001 …) → PDF → ödendi. GiroCode QR, Storno, kopyala. |
| **NFC linkleri** | Kartlara yazılan kısa linkler (`/r/cafe-muster`). Hedefi istediğiniz an değiştirin, okutma sayısını görün, QR kodu SVG olarak indirin. |
| **NFC kartları** | Kendi alan adımızda kart sayfaları (`/k/cafe-krone`): firma kartı ya da özel gün kartı. Kart dili, tema, logo/fotoğraf yükleme, ziyaretçi bilgi formu, okutma sayısı, QR. |
| **Google yorumları** | Google'daki yorumlarınız sitede döner. Place ID'yi girip “Şimdi al”a basın; sonra günde bir kez kendi yenilenir. İstemediğiniz yorumu gizleyebilirsiniz. |
| **Fiyatlar** | Sitedeki tüm fiyatlar. Değiştirip **Siteyi güncelle**'ye basınca 2–4 dakikada sitede. |
| **Siparişler** | Online mağaza siparişleri (mağaza kapalıyken boş kalır). |
| **Ayarlar** | Online mağazayı açma / kapama. Varsayılan: **kapalı**. |

## 1. Supabase projesi (≈ 10 dk)

1. <https://supabase.com> → ücretsiz hesap → **New project**.
   - Region: **Central EU (Frankfurt)**.
   - Güçlü bir veritabanı şifresi belirleyin ve bir yere not edin.
2. **SQL Editor** → **New query** → bu depodaki
   `supabase/migrations/20260924120000_admin_portal.sql` dosyasının tamamını yapıştırın → **Run**.
   Tablolar ve mevcut fiyatlar oluşur. Tablolara internetten doğrudan erişim kapalıdır; verilere sadece site sunucusu erişir.
   Ardından aynı şekilde sıradaki dosyaları da çalıştırın:
   `20260924130000_invoices.sql` (faturalar), `20260925120000_invoice_sent.sql`,
   `20260926120000_cards.sql` (kart sayfaları) ve
   `20260926140000_cards_shop_leads.sql` (kartların mağazada satışı, kart dili, ziyaretçi bilgileri) ve
   `20260926150000_card_leads_consent.sql` (onay metninin kaydı) ve
   `20260926160000_reviews.sql` (Google yorumları) ve
   `20260926170000_touch_search_path.sql` (bir güvenlik sertleştirmesi).
   Dosyaları **isim sırasıyla** çalıştırın; her biri bir kez yeter, tekrar çalıştırmak zarar vermez.
3. **Authentication → Sign In / Providers → Email**:
   - **Allow new users to sign up** kapatın (kimse kendi hesap açamasın).
4. **Authentication → Users → Add user → Create new user**: kendi e-postanız ve şifreniz
   (“Auto Confirm User” işaretli).
5. **Authentication → URL Configuration → Site URL**: `https://breisgau-digital.de/admin`
   (şifre sıfırlama e-postası buraya döner).
6. **Settings → Data Processing Agreement (DPA)**: Supabase'in veri işleme sözleşmesini kabul edin
   (GDPR için gerekli).
7. **Authentication → Policies → Leaked password protection** açın. Supabase girilen şifreyi
   HaveIBeenPwned listesiyle karşılaştırır; başka bir sitede sızmış bir şifreyi panel hesabına
   koymanızı engeller. Tek tıklık bir ayar ve SQL'den yapılamıyor.

> **Ücretsiz plan hakkında:** Supabase, uzun süre kullanılmayan ücretsiz projeleri duraklatabilir.
> Proje duraklarsa NFC kısa linkleri müşterinin Google sayfası yerine ana sayfanıza yönlenir.
> Müşteri kartları bu linklere bağlı olduğunda Pro plana (aylık ≈ 25 $) geçmek güvenlidir.

## 2. Vercel ortam değişkenleri

Vercel → proje **breisgau-digital** → **Settings → Environment Variables** (Production ve Preview):

| Değişken | Nereden |
|---|---|
| `DATABASE_URL` | Supabase → **Connect** → **Transaction pooler** (port **6543**) → URI. `[YOUR-PASSWORD]` yerine 1. adımdaki şifre. |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys → **Publishable key** (`sb_publishable_…`). Eski projelerde `SUPABASE_ANON_KEY` adıyla `anon` key de olur. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnızca NFC kartlarının görsellerini Supabase deposuna yüklemek için gerekir (`SUPABASE_SECRET_KEY` adı da kabul edilir). Supabase entegrasyonu bunu Vercel'e kendisi ekler. Bu anahtar satır güvenliğini aşar: **sadece sunucuda kullanılır, tarayıcıya hiç gitmez.** Kart görseli yüklemeyecekseniz eklemeniz gerekmez. |
| `ADMIN_EMAILS` | Panele girebilecek e-postalar, virgülle: `hamza.oeztuerk@web.de` |
| `CRON_SECRET` | Kendi uydurduğunuz uzun rastgele bir metin (ör. `openssl rand -hex 32`). Vercel her gün `/api/cron/cleanup` adresini bununla çağırır ve **12 aydan eski ziyaretçi bilgileri silinir** — Datenschutzerklärung'da yazan söz budur. Girilmezse o adres kimseyi kabul etmez (açık bir silme ucu bırakmaktansa çalışmasın); temizlik o durumda da her yeni bilgi geldiğinde yapılır. |
| `GOOGLE_API_KEY` | Google yorumlarını çekmek için. Google Cloud Console → **APIs & Services → Credentials → Create credentials → API key**; sonra **Enabled APIs** listesine **Places API (New)** ekleyin. Anahtarı “API restrictions” ile sadece bu API'ye kısıtlayın. Girilmezse yorum bölümü sitede hiç görünmez, başka hiçbir şey etkilenmez. Bu anahtar **sadece sunucuda kullanılır, tarayıcıya hiç gitmez.** |
| `SITE_URL` | `https://breisgau-digital.de` |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel → Settings → Git → **Deploy Hooks** → ad: `fiyatlar`, branch: `main` → oluşan URL |
| `SMTP_HOST` | Faturaları e-postayla göndermek için: `mail.bikehausfreiburg.com` (Mailcow) |
| `SMTP_PORT` | `465` (boş bırakılırsa da 465) |
| `SMTP_USER` | `info@breisgau-digital.de` — gönderen adres de budur |
| `SMTP_PASS` | Bu posta kutusunun şifresi (IMAP'te kullandığınız) |

Kaydettikten sonra **Deployments → en üstteki → Redeploy**. Ardından `/admin` açılır,
4. adımdaki e-posta ve şifreyle giriş yapılır.

## 3. NFC kartlarını programlama

1. Panel → **NFC linkleri → + Yeni link**: açıklama, kısa ad (ör. `cafe-muster`), hedef
   (müşterinin Google yorum linki), müşteri.
2. Karta **hedef adresi değil**, kısa linki yazın: `https://breisgau-digital.de/r/cafe-muster`
   (NFC Tools gibi bir uygulamayla, “URL” kaydı).
3. **QR (SVG)** ile aynı linkin QR kodunu indirip kartın baskısına koyun.
4. Hedef değişirse (menü, Instagram, yeni Google linki) sadece paneldeki hedefi değiştirin.

> Alan adı değişirse eski alan adının Vercel'de yeni adrese **yönlendirilmeye devam etmesi** gerekir;
> yoksa eski adresle programlanmış kartlar çalışmaz.

## 4. Kart sayfaları (`/k/…`)

Kısa link (`/r/…`) müşteriyi başka bir adrese gönderir. Kart sayfası ise **bizim alan adımızda**
durur: dışarıya hiçbir şey gitmez, abonelik yok, sayfa müşterinin elimizdeki kartıyla yaşar.

1. Panel → **NFC kartları → + Yeni kart**.
2. **Tür**: *Profil* (kişi/firma kartviziti) ya da *Özel gün* (fotoğraf + müzik).
3. **Kısa ad** kartın adresi olur: `https://breisgau-digital.de/k/cafe-krone`. Kaydedildikten
   sonra **değişmez** — kart çoktan programlanmış olabilir.
4. **Kart dili**: sayfadaki yazılar (Telefon, E-posta, Adres, "Rehbere kaydet"…) bu dilde çıkar.
   Sitenin diliyle ilgisi yok: kart müşterinin misafirinin elinde, yazı onun dilinde olmalı.
5. **Tema**: açık, koyu, sıcak.
6. Logo ve fotoğrafları **dosya seçerek** yükleyin — Supabase deposuna gider, adresi kendisi
   yazılır. Elle `https://…` adresi de girebilirsiniz. SVG kabul edilmez (içinde kod olabilir).
7. Profil kartında **Rehbere kaydet** butonu kendiliğinden çıkar: telefon/e-posta/adres varsa
   ziyaretçi kartı tek dokunuşla rehberine ekler (vCard). Hiçbiri yoksa buton görünmez.
8. **Ziyaretçi bilgi formu** (isteğe bağlı, varsayılan kapalı): kartı okutan kişi kendi adını,
   e-postasını, telefonunu bırakabilir. Gelenler aynı sekmede **Bırakılan bilgiler** listesinde
   durur; "İlgilenildi" ile işaretlenir, silinebilir, **CSV indir** ile dışa aktarılır. Yeni bir
   bilgi gelince size e-posta gider; "Yanıtla" doğrudan ziyaretçiye gider.

   Hukuki tarafı koda bağlı, keyfî değil:
   - Formda **onay kutusu** var ve işaretlenmeden gönderilemez. Sunucu da ayrıca kontrol eder:
     onay olmadan hiçbir şey kaydedilmez (tarayıcıdaki `required` formu atlayan birini durdurmaz).
   - Kutu **önceden işaretli değil** — önceden işaretli bir onay, onay sayılmaz (Art. 4 Nr. 11).
   - Onayın **kanıtı** kaydediliyor: "evet" değil, ziyaretçinin onayladığı **tam cümle**, kartın
     dilinde, sunucudan (tarayıcıdan gelen metne güvenilmez). Zamanı `created_at`. Panelde her
     kaydın altında görünür ve CSV'ye de girer (Art. 7 Abs. 1 DSGVO).
   - Kartın altındaki kısa metin, bilgilerin **kartın sahibine** gittiğini söyler (Art. 13 DSGVO
     bilgilendirme yükümlülüğü). Metni değiştiren bir zorunlu beyanı değiştirir.
   - IP adresi **kaydedilmez**.
   - **12 aydan eski kayıtlar otomatik silinir** (`LEAD_RETENTION_MONTHS`, src/server/api.ts).
     Bu süre Datenschutzerklärung'da da yazılı; birini değiştiren ötekini de değiştirmeli — test
     bunu kontrol ediyor.
9. **Aktif** kapalıyken sayfa görünmez, adres ana sayfaya döner. Yeni kart hazır olana kadar
   kapalı tutabilirsiniz.
10. **QR (SVG)** ile kartın baskısı için QR kodunu indirin; **Kopyala** adresi verir.

### Kartı mağazadan sipariş alınca

Müşteri mağazadan **Digitale Visitenkarte** ya da **Geschenkkarte** sipariş edip ödeyince, panelde
o siparişe bağlı **kapalı bir kart taslağı** kendiliğinden oluşur ("Siparişten" etiketiyle) —
sipariş adedi kadar. Firma adı hem etikete hem karta yazılır. Onay maili müşteriden içerikleri
(logo, telefon, linkler; hediye kartında fotoğraf ve şarkı) ister. İçeriği girip **Aktif**
yapmanız yeter.

## 5. Faturalar (Rechnungen)

1. Gereken SQL dosyaları 1. adımda çalıştırıldıysa fatura tabloları hazırdır.
2. Panel → **Faturalar → Fatura bilgileri**: **Steuernummer** (Finanzamt Freiburg'un verdiği numara) ve
   **IBAN** girin. Steuernummer olmadan fatura kesinleşmez (§ 14 UStG zorunlu bilgisi).
3. **+ Yeni fatura** → müşteriyi seçin → kalemleri ekleyin (fiyat listesinden veya abonelikten tek tıkla)
   → **Kesinleştir ve numara ver**.
4. **PDF indir / Yazdır** → yazıcı olarak **“PDF olarak kaydet”** seçin. Dosya adı otomatik
   `Rechnung RE-2026-0001 Müşteri.pdf` olur. Alıcının e-postası girilmişse fatura **kesinleşince
   otomatik** PDF olarak `info@breisgau-digital.de` adresinden müşteriye gider; **Storno** ile kesilen
   iptal faturası da öyle. Bir kopyası (BCC) size gelir, gönderim tarihi faturada görünür;
   **Tekrar gönder** ile yeniden yollanır. Bunun için 2. adımdaki `SMTP_*` değişkenleri gerekir.
5. Para gelince **Ödendi**. Hatalı faturayı silmek yasak (GoBD): **Storno** ile iptal faturası kesilir,
   sonra **Kopyala → yeni taslak** ile doğrusu hazırlanır.

- Numaralar yıl bazında boşluksuz ve sıralıdır. Taslaklar numara almaz, silinebilir.
- Kleinunternehmer (§ 19 UStG) varsayılan açık: faturada KDV yoktur ve yasal not otomatik yazılır.
  KDV'ye geçerseniz “Fatura bilgileri”nde kapatın; yeni faturalar %19 USt ile hesaplanır.
- Faturalar 10 yıl saklanmalıdır. Veriler Supabase'te durur; PDF'leri ayrıca bir klasörde saklayın.

## 6. Online mağaza (hazır ama kapalı)

Mağaza tamamen kurulu, ancak iki kilitle kapalı: Stripe anahtarları olmadan ve panelde açılmadan çalışmaz.
Açmadan önce yapılacaklar:

1. **Hukuki sayfalar**: hazır — `/agb`, `/widerruf` (Muster-Widerrufsformular dahil) ve
   `/versand`. Sipariş sayfasında ödeme butonunun hemen üstünde linkli ve onay kutusu zorunlu.
   Footer'da her sayfadan erişilebilir. Metinler Almanca (Impressum/Datenschutz gibi).
   **Açmadan önce bir hukukçuya okutun** — özellikle cayma hakkı istisnasını ve teslim süresini.

   Hukukçuya ayrıca şu iki soruyu götürün:
   - **Ziyaretçi bilgi formu — sorumlu kim?** Kart müşterinin, sayfa ve veritabanı bizim. Metin
     bizi *Verantwortlicher* (sorumlu), müşteriyi *Empfänger* (alıcı) sayıyor. Hukukçu tersini
     söylerse — yani biz müşterinin *Auftragsverarbeiter*'i (veri işleyeni) isek — her kart
     müşterisiyle **AVV (Art. 28 DSGVO)** imzalanması gerekir. Bu, formu açan ilk müşteriden
     önce netleşmeli.
   - **Hukuki dayanak**: *Einwilligung* (Art. 6 Abs. 1 lit. a) olarak kuruldu — onay kutusu,
     sunucu tarafı zorunluluk ve Art. 7 Abs. 1 için onaylanan cümlenin kaydı dahil. Hukukçu
     bunun yerine lit. b/f'yi (iletişim talebi) daha uygun görürse metin değişir, kod aynı
     kalabilir — onay kutusu her hâlükârda zarar vermez.
2. **Stripe hesabı** (<https://stripe.com>): işletme bilgileri, banka hesabı, ödeme yöntemleri
   (kart, PayPal, Klarna…).
3. Stripe → Developers → **Webhooks → Add endpoint**:
   - URL: `https://breisgau-digital.de/api/stripe/webhook`
   - Olaylar: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
     `checkout.session.expired`, `checkout.session.async_payment_failed`
   - Bu adres ve tam olay listesi panelde de yazılı: **Ayarlar → Stripe ödemesi**.
4. Vercel'e ekleyin: `STRIPE_SECRET_KEY` (`sk_live_…`), `STRIPE_WEBHOOK_SECRET` (`whsec_…`) → Redeploy.
5. Panel → **Ayarlar → Stripe ödemesi**: anahtarın gerçekten çalıştığını, test mi canlı mı
   olduğunu ve hesabın ödeme alabildiğini burada görürsünüz.
6. Önce test anahtarlarıyla (`sk_test_…`) bir deneme siparişi verin.
7. Panel → **Ayarlar → Online mağaza** açın. "Bewertungskarten" sayfasında ve her ürün
   sayfasında **In den Warenkorb** butonları görünür. Mağaza kapalıysa aynı yerlerde e-posta ile
   talep butonu kalır — fiyat gösterip satın alma yolu bırakmamaktan iyidir.

Mağazada üç grup var: tek tek ürünler, paketler ve **eigene NFC-Karten** (kendi kart
sayfalarımız). Kart fiyatlarını **Fiyatlar** sekmesinde `card.business` / `card.gift`
satırlarından değiştirebilirsiniz.

Fiyatlar her zaman sunucuda veritabanından hesaplanır; tarayıcıdan gelen fiyat kullanılmaz.

Sepet müşterinin tarayıcısında durur (`localStorage`): sayfayı yenilemek ya da başka sayfaya
gitmek seçimi silmez, dolu sepet navbar'da rozetle görünür. Sepette yalnızca ürün anahtarı ve
adet tutulur — fiyat tutulmaz, o yüzden sepetten tutar oynatılamaz. Ödeme dönüşünde
"Danke" sayfası sepeti boşaltır.

## 7. Google yorumları (sitede)

Google'daki yorumlarınız ana sayfada ve “Bewertungskarten” sayfasında döner.

1. **Place ID'yi bulun:** Google'ın “Place ID Finder” sayfasında işletme adınızı yazın.
   `ChIJ…` diye başlayan uzun metni kopyalayın.
2. Panel → **Google yorumları** → Place ID alanına yapıştırın → **Şimdi al**.
3. Alınan yorumlar listede görünür. Her birinde **Sitede göster** işareti var; kaldırırsanız
   o yorum sitede çıkmaz.
4. İlk kez aldıktan sonra sitede görünmesi için bir yayın gerekir: panel →
   **Fiyatlar → Siteyi güncelle**. Yorumlar derleme sırasında sayfanın içine yazılır.
   Sonraki günlerde bu iş kendiliğinden olur: gece yenileme sırasında **görünen bir şey
   değiştiyse** (yeni yorum, silinen yorum, değişen not) site otomatik yeniden yayınlanır.
   Değişiklik yoksa boşuna derleme yapılmaz. Bunun için `VERCEL_DEPLOY_HOOK_URL` ve
   `CRON_SECRET` ayarlı olmalı.

Nasıl çalıştığı ve neden böyle:

- Yorumlar **sunucudan** alınır ve veritabanımızda durur. Ziyaretçinin tarayıcısı Google'a hiç
  bağlanmaz: ne bir script, ne bir resim, ne IP adresi. Bu yüzden yorumlar için **çerez onayı
  gerekmez** ve yorumlar ilk açılışta görünür. Yazarların profil fotoğrafları yerine baş
  harfleri gösterilir — fotoğraf Google'dan gelen bir istek olurdu.
- Google şartları yorumları uzun süre saklamaya izin vermiyor: **30 günden eski** kayıtlar
  otomatik silinir. Bu yüzden `CRON_SECRET` ayarlı olsun — günlük yenileme oradan çalışır.
  Ayarlı değilse yorumlar bir süre sonra kaybolur, sadece elle “Şimdi al” ile gelir.
- Google bir gün cevap vermezse ortalama not ve sayı **silinmez**, öylece kalır: geçici bir
  arıza yüzünden siteden “4,9 / 5” satırının kaybolması doğru olmazdı. Gerçekten eskiyen
  kayıtları 30 gün kuralı temizler.
- Yorum metinleri **olduğu gibi** gösterilir; kısaltmak veya düzeltmek Google şartlarına aykırı.
  Bir yorumu tamamen gizlemek serbest.
- Sitede **AggregateRating / Review şeması (JSON-LD) yoktur**, bilerek: başka bir platformdan
  gelen yorumları kendi yapılandırılmış verisi gibi işaretlemek Google'ın “self-serving markup”
  kuralına girer ve cezası zengin sonuçların tamamen kaybı olabilir.
- `GOOGLE_API_KEY` yoksa ya da Place ID girilmemişse bölüm sitede **hiç görünmez**; boş bir
  başlık kalmaz.
- Bir hata olursa panelde son denemenin altında yazar (ör. “403 — anahtar bu API'yi
  kullanamıyor”). Anahtarın kendisi hiçbir yerde görünmez.

## Teknik notlar

- API: `src/server/` (Express, `src/server.ts` içine bağlı). Panel: `src/app/admin/`.
- Fiyatlar derleme sırasında `scripts/fetch-catalog.mjs` ile veritabanından
  `src/app/core/data/catalog.json` dosyasına yazılır. Veritabanı yoksa dosyadaki değerler kullanılır.
- Google yorumları aynı şekilde: `scripts/fetch-reviews.mjs` → `src/app/core/data/reviews.json`.
  Veritabanı yoksa depodaki dosya olduğu gibi kalır, derleme yine tamamlanır.
- Yerel test: `DATABASE_URL=postgres://… npm run build && npm run serve:ssr`.
- Otomatik testler: `npm run test:all` (Angular tarafı Karma ile, `src/server/`
  Node test runner ile). Ayrıntılar README'de.
- Sipariş onay e-postası sunucudan gider (`src/server/mail.ts`), Stripe'ın makbuz
  ayarına bağlı değil. Ödeme onaylandığında müşteriye bir kez yollanır — pozisyonlar,
  tutar, § 19 UStG notu, sonraki adım ve AGB/Widerruf/Versand linkleriyle; bu, aynı
  zamanda § 312f BGB'nin istediği metin halinde onaydır. Kopyası SMTP_USER'a BCC gider.
  SMTP ayarlı değilse sipariş yine kaydedilir, yalnızca e-posta çıkmaz.
