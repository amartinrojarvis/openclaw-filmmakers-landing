'use client';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'cookie_consent_v1';

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function setConsent(consent: Omit<CookieConsent, 'timestamp'>): CookieConsent {
  const full: CookieConsent = {
    ...consent,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    // Emitir evento para que otros componentes reaccionen
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: full }));
    // Enviar prueba demostrable al backend (fire-and-forget)
    try {
      fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(full),
      }).catch(() => {
        // Silenciar errores de red para no romper la UX
      });
    } catch {
      // Ignorar errores de fetch
    }
  }
  return full;
}

export function hasConsent(category: keyof Omit<CookieConsent, 'timestamp'>): boolean {
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}

export function openCookieSettings(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openCookieBanner'));
  }
}
