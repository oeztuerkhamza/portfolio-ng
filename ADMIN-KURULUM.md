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
   `20260926140000_cards_shop_leads.sql` (kartların mağazada satışı, kart dili, ziyaretçi bilgileri).
   Dosyaları **isim sırasıyla** çalıştırın; her biri bir kez yeter, tekrar çalıştırmak zarar vermez.
3. **Authentication → Sign In / Providers → Email**:
   - **Allow new users to sign up** kapatın (kimse kendi hesap açamasın).
4. **Authentication → Users → Add user → Create new user**: kendi e-postanız ve şifreniz
   (“Auto Confirm User” işaretli).
5. **Authentication → URL Configuration → Site URL**: `https://breisgau-digital.de/admin`
   (şifre sıfırlama e-postası buraya döner).
6. **Settings → Data Processing Agreement (DPA)**: Supabase'in veri işleme sözleşmesini kabul edin
   (GDPR için gerekli).

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
   durur; "İlgilenildi" ile işaretlenir, silinebilir. Dışarıya gitmez, reklam için kullanılmaz —
   Datenschutzerklärung'da böyle yazılı, o yüzden öyle kalsın.
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

## Teknik notlar

- API: `src/server/` (Express, `src/server.ts` içine bağlı). Panel: `src/app/admin/`.
- Fiyatlar derleme sırasında `scripts/fetch-catalog.mjs` ile veritabanından
  `src/app/core/data/catalog.json` dosyasına yazılır. Veritabanı yoksa dosyadaki değerler kullanılır.
- Yerel test: `DATABASE_URL=postgres://… npm run build && npm run serve:ssr`.
- Otomatik testler: `npm run test:all` (Angular tarafı Karma ile, `src/server/`
  Node test runner ile). Ayrıntılar README'de.
- Sipariş onay e-postası sunucudan gider (`src/server/mail.ts`), Stripe'ın makbuz
  ayarına bağlı değil. Ödeme onaylandığında müşteriye bir kez yollanır — pozisyonlar,
  tutar, § 19 UStG notu, sonraki adım ve AGB/Widerruf/Versand linkleriyle; bu, aynı
  zamanda § 312f BGB'nin istediği metin halinde onaydır. Kopyası SMTP_USER'a BCC gider.
  SMTP ayarlı değilse sipariş yine kaydedilir, yalnızca e-posta çıkmaz.
