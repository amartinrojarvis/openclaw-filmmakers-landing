'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export const GTM_ID = 'GTM-5N34HG2X';

// Google Tag Manager Script
export function GoogleTagManagerScript() {
  return (
    <Script
      id="gtm-script"
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
  if (typeof window !== 'undefined' && window.dataLayer) {
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
};

// Type declaration for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
