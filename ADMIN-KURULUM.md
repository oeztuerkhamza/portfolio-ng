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
   Ardından aynı şekilde `supabase/migrations/20260924130000_invoices.sql` dosyasını da çalıştırın (faturalar).
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
| `SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys → **Publishable key** (`sb_publishable_…`). Eski projelerde `SUPABASE_ANON_KEY` adıyla `anon` key de olur. **Secret key'i hiçbir yere eklemeyin; gerekmiyor.** |
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

## 4. Faturalar (Rechnungen)

1. Supabase SQL Editor'da `supabase/migrations/20260924130000_invoices.sql`, ardından
   `supabase/migrations/20260925120000_invoice_sent.sql` dosyasını bir kez çalıştırın.
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

## 5. Online mağaza (hazır ama kapalı)

Mağaza tamamen kurulu, ancak iki kilitle kapalı: Stripe anahtarları olmadan ve panelde açılmadan çalışmaz.
Açmadan önce yapılacaklar:

1. **Hukuki sayfalar**: AGB, Widerrufsbelehrung (+ Muster-Widerrufsformular), Versand- und
   Zahlungsbedingungen. Sayfalar hazır olunca sipariş sayfasına link eklenmeli
   (`src/app/pages/shop/shop.component.ts`).
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
7. Panel → **Ayarlar → Online mağaza** açın. "Bewertungskarten" sayfasında **Online bestellen** butonu görünür.

Fiyatlar her zaman sunucuda veritabanından hesaplanır; tarayıcıdan gelen fiyat kullanılmaz.

## Teknik notlar

- API: `src/server/` (Express, `src/server.ts` içine bağlı). Panel: `src/app/admin/`.
- Fiyatlar derleme sırasında `scripts/fetch-catalog.mjs` ile veritabanından
  `src/app/core/data/catalog.json` dosyasına yazılır. Veritabanı yoksa dosyadaki değerler kullanılır.
- Yerel test: `DATABASE_URL=postgres://… npm run build && npm run serve:ssr`.
