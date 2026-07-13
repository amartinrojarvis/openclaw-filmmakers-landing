'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getConsent, hasConsent } from '@/lib/cookies';

export const GA4_ID = 'G-6C53BM67BD';
export const GTM_ID = 'GTM-5N34HG2X';

// Si se aceptan analítica y marketing, GTM carga ambos proveedores una sola vez.
// Con consentimiento parcial usamos el proveedor directo de esa categoría para
// impedir que el contenedor dispare etiquetas no consentidas.
export function GoogleTagManagerScript() {
  const [choice, setChoice] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const sync = () => {
      const consent = getConsent();
      setChoice({ analytics: Boolean(consent?.analytics), marketing: Boolean(consent?.marketing) });
    };
    sync();
    window.addEventListener('cookieConsentChanged', sync);
    return () => window.removeEventListener('cookieConsentChanged', sync);
  }, []);

  if (!choice.analytics) return null;

  if (choice.marketing) {
    return (
      <Script
        id="gtm-container"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    );
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA4_ID}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

// Track page views - simplified version to avoid hydration issues
export function PageViewTracker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        pagePath: window.location.pathname,
        pageTitle: document.title,
      });
    }
  }, []);

  return null;
}

// Helper function to track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined' || !hasConsent('analytics')) return;
  const consent = getConsent();

  if (consent?.marketing) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...eventParams });
    return;
  }

  if (window.gtag) {
    const params = eventParams?.ecommerce
      ? { ...eventParams, ...eventParams.ecommerce, ecommerce: undefined }
      : eventParams;
    window.gtag('event', eventName, params);
  }
}

function trackMetaDirect(eventName: string, params?: Record<string, unknown>) {
  const consent = getConsent();
  if (typeof window !== 'undefined' && consent?.marketing && !consent.analytics && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

// Predefined events for common actions
export const AnalyticsEvents = {
  // E-commerce events
  viewItem: (item: { id: string; name: string; price: number; currency?: string }) => {
    trackEvent('view_item', {
      ecommerce: {
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          currency: item.currency || 'EUR',
        }],
      },
    });
    trackMetaDirect('ViewContent', { content_ids: [item.id], content_name: item.name, value: item.price, currency: item.currency || 'EUR' });
  },

  beginCheckout: (items: Array<{ id: string; name: string; price: number }>) => {
    trackEvent('begin_checkout', {
      ecommerce: {
        currency: 'EUR',
        value: items.reduce((total, item) => total + item.price, 0),
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
        })),
      },
    });
    trackMetaDirect('InitiateCheckout', {
      content_ids: items.map((item) => item.id),
      value: items.reduce((total, item) => total + item.price, 0),
      currency: 'EUR',
    });
  },

  purchase: (transaction: {
    id: string;
    value: number;
    currency?: string;
    items: Array<{ id: string; name: string; price: number }>;
  }) => {
    trackEvent('purchase', {
      ecommerce: {
        transaction_id: transaction.id,
        value: transaction.value,
        currency: transaction.currency || 'EUR',
        items: transaction.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
        })),
      },
    });
    trackMetaDirect('Purchase', {
      content_ids: transaction.items.map((item) => item.id),
      value: transaction.value,
      currency: transaction.currency || 'EUR',
    });
  },

  intakeSubmitted: () => {
    trackEvent('intake_submitted', { product: 'asesoria-ia-audiovisual-90m' });
    trackMetaDirect('Lead', { content_name: 'Briefing asesoría IA 1:1' });
  },

  // Engagement events
  clickPricing: (plan: string) => {
    trackEvent('click_pricing', { plan });
  },

  clickCTA: (location: string, text: string) => {
    trackEvent('click_cta', { location, text });
  },

  scrollToSection: (section: string) => {
    trackEvent('scroll_to_section', { section });
  },

  viewFAQ: (question: string) => {
    trackEvent('view_faq', { question });
  },

  timeOnPage: (minutes: number) => {
    trackEvent('time_on_page', { minutes });
  },

  // Lead event for lead magnet conversions
  lead: (params: {
    source: string;
    email?: string;
    currency?: string;
    value?: number;
  }) => {
    trackEvent('generate_lead', {
      currency: params.currency || 'EUR',
      value: params.value || 0,
      source: params.source,
      email: params.email || 'unknown',
    });
  },
};

// Meta Pixel: solo se carga tras consentimiento expreso de marketing.
export function MetaPixelScript() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const sync = () => setCanLoad(hasConsent('marketing') && !hasConsent('analytics'));
    sync();
    window.addEventListener('cookieConsentChanged', sync);
    return () => window.removeEventListener('cookieConsentChanged', sync);
  }, []);

  if (!canLoad) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      onLoad={() => {
        // Fire PageView immediately when pixel script loads
        if ((window as any).fbq) {
          (window as any).fbq('track', 'PageView');
        }
      }}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '4396076083961602');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

// Type declaration for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    gtag?: (...args: any[]) => void;
  }
}
