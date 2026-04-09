import type { Metadata } from 'next';
import './globals.css';
import { GoogleTagManagerScript, PageViewTracker } from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'IA para Filmmakers | Guía Práctica 2026 - Automatiza tu Workflow',
  description: 'La guía definitiva de IA para filmmakers y videógrafos. Automatiza emails, presupuestos y edición con OpenClaw. Ahorra 10+ horas semanales. Descarga gratis la guía.',
  keywords: [
    'IA para filmmakers',
    'IA para videografos', 
    'automatización filmmakers',
    'OpenClaw guia',
    'workflow creativo IA',
    'productividad filmmaker',
    'automatizar edicion video',
    'herramientas IA video',
    'inteligencia artificial filmmakers',
    'guia IA videografos 2026'
  ],
  authors: [{ name: 'Alberto Martín', url: 'https://www.iaparafilmmakers.es' }],
  creator: 'Alberto Martín',
  publisher: 'iaparafilmmakers',
  openGraph: {
    title: 'IA para Filmmakers | Guía Práctica 2026',
    description: 'Automatiza tu workflow creativo con IA. Guía paso a paso para filmmakers. Ahorra 10+ horas semanales.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.iaparafilmmakers.es',
    siteName: 'IA para Filmmakers',
    images: [{
      url: 'https://www.iaparafilmmakers.es/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'IA para Filmmakers - Guía práctica'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA para Filmmakers | Guía Práctica 2026',
    description: 'Automatiza tu workflow creativo con IA. Guía para filmmakers.',
    images: ['https://www.iaparafilmmakers.es/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.iaparafilmmakers.es',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'AÑADE-AQUÍ-TU-CÓDIGO-DE-SEARCH-CONSOLE',
  },
};

// Schema.org JSON-LD para SEO
function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IA para Filmmakers',
    url: 'https://www.iaparafilmmakers.es',
    logo: 'https://www.iaparafilmmakers.es/favicon.svg',
    sameAs: [
      'https://www.youtube.com/@iaparafilmmakers',
    ],
    founder: {
      '@type': 'Person',
      name: 'Alberto Martín',
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Guía OpenClaw para Filmmakers',
    image: 'https://www.iaparafilmmakers.es/og-image.jpg',
    description: 'Guía práctica de IA para filmmakers. Automatiza emails, presupuestos y edición con OpenClaw.',
    brand: {
      '@type': 'Brand',
      name: 'IA para Filmmakers',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.iaparafilmmakers.es',
      price: '29',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '12',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IA para Filmmakers',
    url: 'https://www.iaparafilmmakers.es',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.iaparafilmmakers.es/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Cookiebot CMP */}
        <script id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js" data-settings-id="NO0pP5iJI35NHN" async></script>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <GoogleTagManagerScript />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N34HG2X"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <StructuredData />
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
