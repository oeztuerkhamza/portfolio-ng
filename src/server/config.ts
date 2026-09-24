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
  /** Öffentlicher „anon"-Schlüssel (Supabase → Project Settings → API). */
  get supabaseAnonKey() {
    return env('SUPABASE_ANON_KEY');
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
  /** Öffentliche Adresse der Website, z. B. https://breisgau-digital.de */
  get siteUrl() {
    return env('SITE_URL').replace(/\/+$/, '');
  },
};
