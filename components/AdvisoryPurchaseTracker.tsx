'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/components/Analytics';
import { getConsent } from '@/lib/cookies';

type Props = { sessionId: string; value: number; includesFollowup: boolean };

export function AdvisoryPurchaseTracker({ sessionId, value, includesFollowup }: Props) {
  useEffect(() => {
    const storageKey = `asesoria-purchase:${sessionId}`;

    const track = () => {
      const consent = getConsent();
      if ((!consent?.analytics && !consent?.marketing) || sessionStorage.getItem(storageKey)) return;

      AnalyticsEvents.purchase({
        id: sessionId,
        value,
        currency: 'EUR',
        items: [
          { id: 'asesoria-ia-audiovisual-90m', name: 'Sesión 1:1 · Herramientas de IA para filmmakers', price: 75 },
          ...(includesFollowup ? [{ id: 'acompanamiento-30-dias', name: 'Implementación · primer mes', price: 124 }] : []),
        ],
      });
      sessionStorage.setItem(storageKey, 'true');
    };

    const timer = window.setTimeout(track, 900);
    window.addEventListener('cookieConsentChanged', track);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('cookieConsentChanged', track);
    };
  }, [includesFollowup, sessionId, value]);

  return null;
}
