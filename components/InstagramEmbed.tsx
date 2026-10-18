'use client';

import { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/cookies';

interface InstagramEmbedProps {
  shortcode: string;
  title?: string;
  onPlay?: () => void;
}

/**
 * Embed diferido de Instagram: el iframe solo se carga tras consentimiento de
 * marketing y tras interacción voluntaria. Sin consentimiento (o sin embed
 * disponible) el bloque muestra un enlace directo al reel original.
 */
export function InstagramEmbed({ shortcode, title = 'Video de Instagram', onPlay }: InstagramEmbedProps) {
  const [canLoad, setCanLoad] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    setCanLoad(hasConsent('marketing'));
    const handler = () => setCanLoad(hasConsent('marketing'));
    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
  }, []);

  const postUrl = `https://www.instagram.com/reel/${shortcode}/`;

  if (canLoad && !showPlayer) {
    return (
      <div className="mx-auto w-full max-w-md">
        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/captioned/`}
          title={title}
          loading="lazy"
          className="aspect-[4/5] w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 border border-[#f2eee5]/15 bg-[#f2eee5]/[0.03] p-8 text-center">
        {canLoad ? (
          <>
            <button
              type="button"
              onClick={() => { setShowPlayer(true); onPlay?.(); }}
              className="min-h-11 cursor-pointer border border-[#ff5a2a] bg-[#ff5a2a] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#171612] transition-colors hover:bg-[#f2eee5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a2a]"
            >
              Reproducir el reel
            </button>
            <p className="text-xs leading-5 text-[#f2eee5]/55">El reproductor se carga desde Instagram y puede usar cookies de terceros.</p>
          </>
        ) : (
          <p className="text-sm leading-6 text-[#f2eee5]/60">
            El reproductor de Instagram está desactivado mientras no aceptes las cookies de terceros en el aviso de cookies. Puedes ver el reel directamente en Instagram.
          </p>
        )}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 inline-flex items-center px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#ff5a2a] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a2a]"
        >
          Ver en Instagram
        </a>
      </div>
    </div>
  );
}
