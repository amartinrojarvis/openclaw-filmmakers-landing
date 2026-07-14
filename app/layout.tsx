import type { Metadata, Viewport } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import './globals.css';
import { GoogleTagManagerScript, MetaPixelScript } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const siteUrl = 'https://www.iaparafilmmakers.es';
const shareTitle = 'Desbloquea el uso de la IA en tu negocio audiovisual';
const shareDescription = 'Sesión práctica 1:1 de 90 minutos para detectar casos de uso reales y crear un plan para empezar a implementarlos.';
const shareImage = '/social-preview-asesoria-v2.png';

const reloadScrollResetScript = `
  (() => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      const isReload = navigation
        ? navigation.type === 'reload'
        : performance.navigation && performance.navigation.type === 1;

      if (isReload && !window.location.hash) {
        history.scrollRestoration = 'manual';
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousBehavior;
      } else {
        history.scrollRestoration = 'auto';
      }
    } catch {}
  })();
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171612',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Asesoría 1:1 de IA para Filmmakers | Alberto Martín',
    template: '%s | IA para Filmmakers',
  },
  description: shareDescription,
  keywords: [
    'asesoría IA filmmakers',
    'inteligencia artificial audiovisual',
    'IA para videógrafos',
    'consultoría IA creadores',
    'automatización negocio audiovisual',
    'IA aplicada filmmaking',
  ],
  authors: [{ name: 'Alberto Martín', url: 'https://www.instagram.com/amartinro/' }],
  creator: 'Alberto Martín',
  publisher: 'IA para Filmmakers',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: 'IA para Filmmakers',
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, width: 1200, height: 630, alt: 'Desbloquea el uso de la IA en tu negocio audiovisual con Alberto Martín' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/favicon.svg' },
};

function StructuredData() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Alberto Martín',
      url: siteUrl,
      image: `${siteUrl}/perfil-alberto-v2.jpg`,
      jobTitle: 'Filmmaker y creador de productos de IA',
      sameAs: ['https://www.instagram.com/amartinro/', 'https://vilens.es'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Sesión 1:1 de IA aplicada al negocio audiovisual',
      description: 'Sesión online individual de 90 minutos para trabajar una prioridad real de un negocio audiovisual con inteligencia artificial.',
      provider: { '@type': 'Person', name: 'Alberto Martín' },
      areaServed: 'ES',
      serviceType: 'Asesoría individual de inteligencia artificial para profesionales audiovisuales',
      offers: {
        '@type': 'Offer',
        price: '75.00',
        priceCurrency: 'EUR',
        url: `${siteUrl}/#sesion`,
        availability: 'https://schema.org/LimitedAvailability',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '75.00',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'IA para Filmmakers',
      url: siteUrl,
      inLanguage: 'es-ES',
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: reloadScrollResetScript }} />
        <StructuredData />
      </head>
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        <GoogleTagManagerScript />
        <MetaPixelScript />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
