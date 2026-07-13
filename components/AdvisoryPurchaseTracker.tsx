'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/components/Analytics';
import { getConsent } from '@/lib/cookies';

type Props = { sessionId: string };

export function AdvisoryPurchaseTracker({ sessionId }: Props) {
  useEffect(() => {
    const storageKey = `asesoria-purchase:${sessionId}`;

    const track = () => {
      const consent = getConsent();
      if ((!consent?.analytics && !consent?.marketing) || sessionStorage.getItem(storageKey)) return;

      AnalyticsEvents.purchase({
        id: sessionId,
        value: 75,
        currency: 'EUR',
        items: [{ id: 'asesoria-ia-audiovisual-90m', name: 'Sesión 1:1 · Herramientas de IA para filmmakers', price: 75 }],
      });
      sessionStorage.setItem(storageKey, 'true');
    };

    const timer = window.setTimeout(track, 900);
    window.addEventListener('cookieConsentChanged', track);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('cookieConsentChanged', track);
    };
  }, [sessionId]);

  return null;
}
