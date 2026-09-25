import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AdminConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  /** Grund, warum die Datenbank nicht erreichbar ist (null = alles gut). */
  dbError?: string | null;
  /** Die API selbst hat nicht geantwortet (z. B. Funktion abgestürzt). */
  apiError?: string;
  ready: { db: boolean; auth: boolean; stripe: boolean; deployHook: boolean; mail?: boolean };
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix-Sekunden
  email: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    /** Zusatzangaben des Servers, z. B. { reason, email } bei 401. */
    readonly detail: Record<string, unknown> = {},
  ) {
    super(code);
  }
}

const STORE = 'bd-admin-session';

/**
 * Anmeldung über Supabase Auth (REST, ohne SDK) und Zugriff auf /api/admin.
 * Die Sitzung liegt im localStorage dieses Browsers; der Server prüft das
 * Token bei jeder Anfrage selbst noch einmal.
 */
@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly config = signal<AdminConfig | null>(null);
  readonly session = signal<Session | null>(null);
  /** Nach einem Link „Passwort zurücksetzen" oder einer Einladung. */
  readonly mustSetPassword = signal(false);
  readonly email = computed(() => this.session()?.email ?? '');

  async init(): Promise<void> {
    if (!this.browser) return;
    const res = await fetch('/api/admin/config');
    const text = await res.text();
    try {
      this.config.set(JSON.parse(text) as AdminConfig);
    } catch {
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    // Rückkehr aus einer Supabase-E-Mail: #access_token=…&type=recovery
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.get('access_token')) {
      await this.adoptTokens(hash.get('access_token')!, hash.get('refresh_token') ?? '', Number(hash.get('expires_in') ?? 3600));
      this.mustSetPassword.set(['recovery', 'invite'].includes(hash.get('type') ?? ''));
      history.replaceState(null, '', location.pathname);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null') as Session | null;
      if (saved) this.session.set(saved);
    } catch {
      /* kein Speicher verfügbar */
    }
    if (this.session()) await this.freshToken().catch(() => this.clear());
  }

  private auth(path: string, init: RequestInit & { token?: string } = {}) {
    const cfg = this.config()!;
    return fetch(`${cfg.supabaseUrl}/auth/v1/${path}`, {
      ...init,
      headers: {
        apikey: cfg.supabaseAnonKey,
        'Content-Type': 'application/json',
        ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
      },
    });
  }

  private store(s: Session) {
    this.session.set(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {
      /* ignorieren */
    }
  }

  private clear() {
    this.session.set(null);
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* ignorieren */
    }
  }

  private async adoptTokens(access: string, refresh: string, expiresIn: number) {
    const res = await this.auth('user', { token: access });
    const user = res.ok ? ((await res.json()) as { email?: string }) : {};
    this.store({ access_token: access, refresh_token: refresh, expires_at: Date.now() / 1000 + expiresIn, email: user.email ?? '' });
  }

  private async tokenResponse(res: Response) {
    const data = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: { email?: string };
      error_description?: string;
      msg?: string;
    };
    if (!res.ok || !data.access_token) throw new ApiError(res.status, data.error_description ?? data.msg ?? 'login_failed');
    this.store({
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? '',
      expires_at: Date.now() / 1000 + (data.expires_in ?? 3600),
      email: data.user?.email ?? '',
    });
  }

  async login(email: string, password: string) {
    await this.tokenResponse(
      await this.auth('token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }),
    );
    // Prüfen, ob diese Adresse das Portal nutzen darf.
    await this.req('GET', '/me').catch((e) => {
      this.clear();
      throw e;
    });
  }

  async logout() {
    const token = this.session()?.access_token;
    this.clear();
    if (token) await this.auth('logout', { method: 'POST', token }).catch(() => undefined);
  }

  async recover(email: string) {
    const redirect = encodeURIComponent(`${location.origin}/admin`);
    const res = await this.auth(`recover?redirect_to=${redirect}`, { method: 'POST', body: JSON.stringify({ email }) });
    if (!res.ok) throw new ApiError(res.status, 'recover_failed');
  }

  async setPassword(password: string) {
    const token = await this.freshToken();
    const res = await this.auth('user', { method: 'PUT', token, body: JSON.stringify({ password }) });
    if (!res.ok) throw new ApiError(res.status, 'password_failed');
    this.mustSetPassword.set(false);
  }

  private async freshToken(): Promise<string> {
    const s = this.session();
    if (!s) throw new ApiError(401, 'unauthorized');
    if (s.expires_at - Date.now() / 1000 > 60) return s.access_token;
    await this.tokenResponse(
      await this.auth('token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: s.refresh_token }),
      }),
    );
    return this.session()!.access_token;
  }

  /** Aufruf von /api/admin<path>. */
  async req<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await this.freshToken();
    const res = await fetch(`/api/admin${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      const detail = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      this.clear();
      throw new ApiError(401, 'unauthorized', detail);
    }
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? 'error', data as Record<string, unknown>);
    return data as T;
  }
}

/** Fehlercodes des Servers in verständliche Sätze übersetzen. */
export function errorText(e: unknown): string {
  const code = e instanceof ApiError ? e.code : '';
  if (e instanceof ApiError && e.status === 401) {
    const d = e.detail;
    if (d['reason'] === 'not_admin')
      return Number(d['listed'])
        ? `Giriş yapılan adres (${d['email']}) Vercel'deki ADMIN_EMAILS listesinde yok. Yazımı kontrol edip Redeploy yapın.`
        : `ADMIN_EMAILS Vercel'de boş görünüyor. Değeri (${d['email']}) girip Redeploy yapın.`;
    if (String(d['reason'] ?? '').startsWith('token_rejected'))
      return `Sunucu oturumu doğrulayamadı (${d['reason']}). SUPABASE_URL ve SUPABASE_PUBLISHABLE_KEY aynı Supabase projesine ait olmalı.`;
    if (d['reason'] === 'supabase_not_configured') return 'SUPABASE_URL veya SUPABASE_PUBLISHABLE_KEY sunucuda eksik.';
  }
  if (e instanceof ApiError && code === 'missing_table')
    return `Veritabanında “${e.detail['table'] ?? '?'}” tablosu yok. Supabase SQL Editor'da supabase/migrations klasöründeki ilgili SQL dosyasını çalıştırın.`;
  if (e instanceof ApiError && code === 'server_error' && e.detail['code'])
    return `Sunucu hatası (kod ${e.detail['code']}). Lütfen tekrar deneyin.`;
  const map: Record<string, string> = {
    duplicate: 'Bu kayıt zaten var (ör. kısa link adı kullanılıyor).',
    invalid: 'Girilen değerlerden biri geçersiz.',
    invalid_value: 'Geçersiz değer.',
    not_configured: 'Veritabanı bağlı değil (DATABASE_URL eksik).',
    no_deploy_hook: 'VERCEL_DEPLOY_HOOK_URL tanımlı değil.',
    unauthorized: 'Oturum sona erdi, lütfen tekrar giriş yapın.',
    'Invalid login credentials': 'E-posta veya şifre hatalı.',
  };
  return map[code] ?? 'Bir hata oluştu. Lütfen tekrar deneyin.';
}
