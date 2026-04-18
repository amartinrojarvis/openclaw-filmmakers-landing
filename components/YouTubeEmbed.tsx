'use client';

import { useEffect, useState } from 'react';
import { Play, ShieldAlert } from 'lucide-react';
import { hasConsent } from '@/lib/cookies';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = 'Video de YouTube' }: YouTubeEmbedProps) {
  const [canLoad, setCanLoad] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setCanLoad(hasConsent('marketing'));
    const handler = () => setCanLoad(hasConsent('marketing'));
    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
  }, []);

  if (canLoad && !showPlaceholder) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-2xl shadow-cyan/5">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Placeholder con previsualizacion y boton de carga condicional
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-2xl shadow-cyan/5">
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-6">
        {canLoad ? (
          <>
            <button
              onClick={() => setShowPlaceholder(false)}
              className="group flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 transition mb-4"
              aria-label="Reproducir video"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </button>
            <p className="text-sm text-white/80">Haz clic para reproducir el video de YouTube</p>
          </>
        ) : (
          <>
            <ShieldAlert className="w-10 h-10 text-white/70 mb-3" />
            <p className="text-sm text-white/80 max-w-md">
              Este video utiliza cookies de terceros de YouTube (Google LLC).
              Acepta las cookies de <strong>Marketing</strong> en el banner de cookies para reproducirlo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
