'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/cookies';

export const GA4_ID = 'G-6C53BM67BD';

// GA4 directo: solo carga con consentimiento analítico. Evita que un contenedor
// GTM pueda disparar etiquetas de marketing dentro de la categoría de analítica.
export function GoogleTagManagerScript() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    setCanLoad(hasConsent('analytics'));
    const handler = () => setCanLoad(hasConsent('analytics'));
    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
  }, []);

  if (!canLoad) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
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
  if (typeof window !== 'undefined' && hasConsent('analytics') && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
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
  },

  beginCheckout: (items: Array<{ id: string; name: string; price: number }>) => {
    trackEvent('begin_checkout', {
      ecommerce: {
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
        })),
      },
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
    setCanLoad(hasConsent('marketing'));
    const handler = () => setCanLoad(hasConsent('marketing'));
    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
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
  }
}
