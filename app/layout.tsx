import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { GoogleTagManagerScript, MetaPixelScript } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

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
      url: 'https://www.iaparafilmmakers.es/perfil-alberto-v2.jpg',
      width: 400,
      height: 400,
      alt: 'Alberto Martín - Filmmaker & Creador de IA para Filmmakers'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA para Filmmakers | Guía Práctica 2026',
    description: 'Automatiza tu workflow creativo con IA. Guía para filmmakers.',
    images: ['https://www.iaparafilmmakers.es/perfil-alberto-v2.jpg'],
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
    image: 'https://www.iaparafilmmakers.es/perfil-alberto-v2.jpg',
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
        {/* Critical: Preload font for instant text render */}
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Inline critical CSS for instant hero render */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical CSS - Hero must render immediately */
          .hero-critical {
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #0a1a10 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-text {
            color: #ffffff;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            text-align: center;
            max-width: 800px;
            padding: 0 1rem;
          }
          .hero-text h1 {
            font-size: clamp(2rem, 8vw, 4rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1rem;
          }
          .hero-text p {
            font-size: clamp(1rem, 4vw, 1.25rem);
            color: rgba(255,255,255,0.7);
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            font-size: 1.1rem;
            min-width: 240px;
          }
          .btn-premium {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #ffd700, #ffaa00);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            font-size: 1.1rem;
            min-width: 240px;
          }
        `}} />
      </head>
      <body className="antialiased">
        <StructuredData />
        {children}
        
        {/* Cookie consent banner */}
        <CookieBanner />
        
        {/* Conditional marketing scripts */}
        <MetaPixelScript />
        
        {/* GTM loaded after page content */}
        <GoogleTagManagerScript />
      </body>
    </html>
  );
}
