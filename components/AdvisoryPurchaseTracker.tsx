'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/components/Analytics';
import { getConsent } from '@/lib/cookies';
import type { AdvisoryPlanKind } from '@/lib/stripe';

type Props = { sessionId: string; value: number; plan: AdvisoryPlanKind };

export function AdvisoryPurchaseTracker({ sessionId, value, plan }: Props) {
  useEffect(() => {
    const storageKey = `asesoria-purchase:${sessionId}`;
    const track = () => {
      if (!getConsent()?.analytics || sessionStorage.getItem(storageKey)) return;
      const items = plan === 'subscription_monthly'
        ? [{ id: 'suscripcion-mensual-primer-mes', name: 'Suscripción mensual · primer mes', price: 199 }]
        : [
            { id: 'asesoria-ia-audiovisual-90m', name: 'Sesión 1:1 · Herramientas de IA para filmmakers', price: 75 },
            ...(plan === 'followup_30d' ? [{ id: 'acompanamiento-30-dias', name: 'Implementación · modalidad anterior', price: 124 }] : []),
          ];
      AnalyticsEvents.purchase({
        id: sessionId,
        value,
        items,
      });
      sessionStorage.setItem(storageKey, '1');
    };
    track();
    window.addEventListener('cookieConsentChanged', track);
    return () => {
      window.removeEventListener('cookieConsentChanged', track);
    };
  }, [plan, sessionId, value]);

  return null;
}
