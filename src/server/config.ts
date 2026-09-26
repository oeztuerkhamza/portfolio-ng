/**
 * Server-Konfiguration aus Umgebungsvariablen (Vercel → Settings →
 * Environment Variables). Fehlt etwas, bleiben die betroffenen Funktionen
 * einfach aus — die Website selbst läuft immer.
 */
const env = (name: string): string => (process.env[name] ?? '').trim();

export const config = {
  /** Postgres-Verbindung (Supabase → Connect → Transaction pooler, Port 6543). */
  get databaseUrl() {
    return env('DATABASE_URL');
  },
  /** https://<projekt>.supabase.co — für die Anmeldung im Admin-Portal. */
  get supabaseUrl() {
    return env('SUPABASE_URL').replace(/\/+$/, '');
  },
  /** Öffentlicher Schlüssel: „publishable" (sb_publishable_…) oder der alte „anon"-Key. */
  get supabaseAnonKey() {
    return env('SUPABASE_PUBLISHABLE_KEY') || env('SUPABASE_ANON_KEY');
  },
  /**
   * Supabase-Dienstschlüssel — nur für den Datei-Upload in den Speicher
   * (src/server/storage.ts). Er umgeht die Zeilensperren, verlässt darum
   * niemals den Server und wird nie an den Browser gegeben. Die
   * Supabase-Integration legt ihn selbst in Vercel ab.
   */
  get supabaseServiceKey() {
    return env('SUPABASE_SERVICE_ROLE_KEY') || env('SUPABASE_SECRET_KEY');
  },
  /** Eimer im Supabase-Speicher für Karten-Bilder; öffentlich lesbar. */
  get storageBucket() {
    return env('SUPABASE_STORAGE_BUCKET') || 'cards';
  },
  /** Kommagetrennte E-Mail-Adressen, die das Admin-Portal nutzen dürfen. */
  get adminEmails(): string[] {
    return env('ADMIN_EMAILS')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  },
  /** Vercel → Settings → Git → Deploy Hooks. Baut die Seite mit neuen Preisen. */
  get deployHookUrl() {
    return env('VERCEL_DEPLOY_HOOK_URL');
  },
  get stripeSecretKey() {
    return env('STRIPE_SECRET_KEY');
  },
  /** Nur für Tests überschreibbar. */
  get stripeApiBase() {
    return env('STRIPE_API_BASE') || 'https://api.stripe.com';
  },
  get stripeWebhookSecret() {
    return env('STRIPE_WEBHOOK_SECRET');
  },
  /** Postausgang für Rechnungen, z. B. mail.bikehausfreiburg.com (Mailcow). */
  get smtpHost() {
    return env('SMTP_HOST');
  },
  /** 465 = TLS von Anfang an, 587 = STARTTLS. */
  get smtpPort() {
    return Number(env('SMTP_PORT')) || 465;
  },
  /** Anmeldename des Postfachs, zugleich Absender: info@breisgau-digital.de */
  get smtpUser() {
    return env('SMTP_USER');
  },
  get smtpPass() {
    return env('SMTP_PASS');
  },
  /** Öffentliche Adresse der Website, z. B. https://breisgau-digital.de */
  get siteUrl() {
    return env('SITE_URL').replace(/\/+$/, '');
  },
  /**
   * Schlüssel für die Google-Bewertungen (Places API). Nur serverseitig:
   * im Browser wäre er für jeden lesbar, der die Seite öffnet.
   */
  get googleApiKey() {
    return env('GOOGLE_API_KEY');
  },
  /**
   * Geheimnis für den täglichen Aufräumlauf (/api/cron/cleanup). Vercel
   * schickt es als `Authorization: Bearer …`, wenn es als Umgebungsvariable
   * gesetzt ist. Fehlt es, nimmt der Lauf niemanden an — lieber gar nicht
   * aufräumen als eine offene Strecke ins Netz stellen.
   */
  get cronSecret() {
    return env('CRON_SECRET');
  },
};
