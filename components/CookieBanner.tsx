'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Shield } from 'lucide-react';
import cookieConfig from '@/config/cookies.json';
import { getConsent, setConsent, type CookieConsent } from '@/lib/cookies';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsentState] = useState<Omit<CookieConsent, 'timestamp'>>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setConsentState({
        necessary: existing.necessary,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener('openCookieBanner', handleOpen);
    return () => window.removeEventListener('openCookieBanner', handleOpen);
  }, []);

  const saveAndClose = (next: Omit<CookieConsent, 'timestamp'>) => {
    setConsent(next);
    setConsentState(next);
    setVisible(false);
    setExpanded(false);
    // Recargar para activar scripts condicionales si es necesario
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const acceptAll = () => {
    saveAndClose({ necessary: true, analytics: true, marketing: true });
  };

  const rejectNonEssential = () => {
    saveAndClose({ necessary: true, analytics: false, marketing: false });
  };

  const savePreferences = () => {
    saveAndClose({ ...consent });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md p-6 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 pr-0">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {cookieConfig.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {cookieConfig.description}{' '}
                  <a
                    href={cookieConfig.cookiesLink}
                    className="text-[#00ff88] hover:underline"
                  >
                    Mas informacion
                  </a>{' '}
                  ·{' '}
                  <a
                    href={cookieConfig.privacyLink}
                    className="text-[#00ff88] hover:underline"
                  >
                    Politica de Privacidad
                  </a>
                </p>
              </div>
            </div>

            {expanded && (
              <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                {cookieConfig.categories.map((cat) => {
                  const checked =
                    cat.id === 'necessary' ? true : (consent as any)[cat.id];
                  return (
                    <div
                      key={cat.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              cat.required
                                ? 'bg-[#00ff88]'
                                : cat.id === 'analytics'
                                ? 'bg-[#aa00ff]'
                                : 'bg-cyan-400'
                            }`}
                          />
                          <span className="font-medium text-white">
                            {cat.name}
                          </span>
                          {cat.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 uppercase tracking-wider">
                              Siempre activa
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          {cat.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={cat.required}
                          onChange={(e) =>
                            setConsentState((prev) => ({
                              ...prev,
                              [cat.id]: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors ${
                            cat.required
                              ? 'bg-white/20'
                              : checked
                              ? 'bg-[#00ff88]'
                              : 'bg-white/10'
                          }`}
                        />
                        <span
                          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            checked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="order-3 sm:order-1 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white flex items-center justify-center gap-1 transition"
              >
                {expanded ? 'Ocultar preferencias' : 'Configurar preferencias'}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div className="flex-1" />

              <button
                onClick={rejectNonEssential}
                className="order-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition"
              >
                Rechazar no esenciales
              </button>

              {expanded ? (
                <button
                  onClick={savePreferences}
                  className="order-1 sm:order-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black text-sm font-bold hover:opacity-90 transition"
                >
                  Guardar preferencias
                </button>
              ) : (
                <button
                  onClick={acceptAll}
                  className="order-1 sm:order-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black text-sm font-bold hover:opacity-90 transition"
                >
                  Aceptar todas
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
