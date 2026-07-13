'use client';

export const CONSENT_VERSION = '2026-07-v2';
export const CONSENT_MAX_AGE_DAYS = 180;
const STORAGE_KEY = 'iapf_cookie_consent_v2';
const COOKIE_KEY = 'iapf_consent_v2';

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  expiresAt: string;
  version: string;
  consentId: string;
}

export type ConsentChoice = Pick<CookieConsent, 'necessary' | 'analytics' | 'marketing'>;

function createConsentId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `consent-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function isValidConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== 'object') return false;
  const consent = value as Partial<CookieConsent>;
  return consent.necessary === true
    && typeof consent.analytics === 'boolean'
    && typeof consent.marketing === 'boolean'
    && consent.version === CONSENT_VERSION
    && typeof consent.consentId === 'string'
    && typeof consent.timestamp === 'string'
    && typeof consent.expiresAt === 'string'
    && Date.parse(consent.expiresAt) > Date.now();
}

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidConsent(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeReadableConsentCookie(consent: CookieConsent) {
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

export function clearKnownTrackingCookies() {
  if (typeof document === 'undefined') return;
  const names = ['_ga', '_gid', '_gat', '_fbp', '_fbc'];
  const gaNames = document.cookie.split(';').map((item) => item.trim().split('=')[0]).filter((name) => name.startsWith('_ga_'));
  const domains = ['', location.hostname, '.iaparafilmmakers.es', '.www.iaparafilmmakers.es'];
  for (const name of [...names, ...gaNames]) {
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    }
  }
}

export function setConsent(choice: ConsentChoice): CookieConsent {
  const now = new Date();
  const expires = new Date(now.getTime() + CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  const full: CookieConsent = {
    ...choice,
    necessary: true,
    timestamp: now.toISOString(),
    expiresAt: expires.toISOString(),
    version: CONSENT_VERSION,
    consentId: createConsentId(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    writeReadableConsentCookie(full);
    if (!full.analytics || !full.marketing) clearKnownTrackingCookies();
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: full }));
    fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(full),
      keepalive: true,
    }).catch(() => undefined);
  }
  return full;
}

export function hasConsent(category: 'necessary' | 'analytics' | 'marketing'): boolean {
  const consent = getConsent();
  return consent ? consent[category] === true : false;
}

export function openCookieSettings(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('openCookieBanner'));
}
