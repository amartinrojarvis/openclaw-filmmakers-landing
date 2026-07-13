'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import cookieConfig from '@/config/cookies.json';
import { clearKnownTrackingCookies, getConsent, setConsent, type ConsentChoice } from '@/lib/cookies';

const DEFAULT_CHOICE: ConsentChoice = { necessary: true, analytics: false, marketing: false };
const actionClass = 'min-h-12 w-full cursor-pointer border px-5 py-3 text-sm font-extrabold uppercase tracking-[0.06em] transition-colors sm:w-64 sm:flex-none';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(DEFAULT_CHOICE);

  useEffect(() => {
    const existing = getConsent();
    if (existing) {
      setChoice({ necessary: true, analytics: existing.analytics, marketing: existing.marketing });
    } else {
      setVisible(true);
    }

    const handleOpen = () => {
      const current = getConsent();
      setChoice(current ? { necessary: true, analytics: current.analytics, marketing: current.marketing } : DEFAULT_CHOICE);
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener('openCookieBanner', handleOpen);
    return () => window.removeEventListener('openCookieBanner', handleOpen);
  }, []);

  const persist = (next: ConsentChoice) => {
    const previous = getConsent();
    setConsent(next);
    if (!next.analytics || !next.marketing) clearKnownTrackingCookies();
    setVisible(false);
    setExpanded(false);

    const revokedLoadedCategory = Boolean(previous && ((previous.analytics && !next.analytics) || (previous.marketing && !next.marketing)));
    window.setTimeout(() => window.location.reload(), revokedLoadedCategory ? 250 : 350);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/45 p-3 sm:p-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
        className="mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto border border-[#f2eee5]/25 bg-[#171612] text-[#f2eee5] shadow-[0_-20px_70px_rgba(0,0,0,.35)]"
      >
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-[#ff5a2a] text-[#171612]"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Privacidad · RGPD / LSSI</p>
            </div>
            <h2 id="cookie-title" className="font-editorial mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{cookieConfig.title}</h2>
            <p id="cookie-description" className="mt-3 max-w-xl text-sm leading-6 text-[#f2eee5]/62">
              {cookieConfig.description}{' '}
              <Link href={cookieConfig.cookiesLink} className="text-[#ff5a2a] underline">Política de cookies</Link>
              {' · '}
              <Link href={cookieConfig.privacyLink} className="text-[#ff5a2a] underline">Privacidad</Link>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:max-w-lg lg:flex-wrap lg:justify-end">
            <button type="button" onClick={() => persist(DEFAULT_CHOICE)} className={`${actionClass} border-[#f2eee5] bg-transparent text-[#f2eee5] hover:bg-[#f2eee5] hover:text-[#171612]`}>
              Rechazar no esenciales
            </button>
            <button type="button" onClick={() => persist({ necessary: true, analytics: true, marketing: true })} className={`${actionClass} border-[#ff5a2a] bg-[#ff5a2a] text-[#171612] hover:border-[#f2eee5] hover:bg-[#f2eee5]`}>
              Aceptar todas
            </button>
            <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.08em] text-[#f2eee5]/65 hover:text-[#ff5a2a] sm:w-full">
              {expanded ? 'Ocultar preferencias' : 'Configurar preferencias'}
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-[#f2eee5]/20 p-5 sm:p-7">
            <div className="grid gap-px border border-[#f2eee5]/20 bg-[#f2eee5]/20 md:grid-cols-3">
              {cookieConfig.categories.map((category) => {
                const id = category.id as keyof ConsentChoice;
                const checked = id === 'necessary' ? true : choice[id];
                return (
                  <div key={category.id} className="flex min-h-40 flex-col justify-between bg-[#171612] p-5">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-black">{category.name}</h3>
                        {category.required && <span className="font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-[#ff5a2a]">Siempre activa</span>}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#f2eee5]/52">{category.description}</p>
                    </div>
                    <label className="mt-5 inline-flex cursor-pointer items-center gap-3 self-start">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={category.required}
                        onChange={(event) => setChoice((current) => ({ ...current, [id]: event.target.checked }))}
                        className="peer sr-only"
                        aria-label={`${category.name}: ${checked ? 'activada' : 'desactivada'}`}
                      />
                      <span className="relative h-6 w-11 border border-[#f2eee5]/35 bg-transparent after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:bg-[#f2eee5] after:transition-transform peer-checked:border-[#ff5a2a] peer-checked:bg-[#ff5a2a] peer-checked:after:translate-x-5 peer-checked:after:bg-[#171612] peer-disabled:cursor-not-allowed peer-disabled:opacity-60" aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#f2eee5]/65">{checked ? 'Activada' : 'Desactivada'}</span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => persist(choice)} className={`${actionClass} border-[#ff5a2a] bg-[#ff5a2a] text-[#171612] hover:border-[#f2eee5] hover:bg-[#f2eee5]`}>
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
