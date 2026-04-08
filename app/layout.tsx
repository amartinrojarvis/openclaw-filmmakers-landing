import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IA para Filmmakers | Automatiza tu workflow con OpenClaw',
  description: 'Guía práctica de IA para filmmakers y videógrafos. Aprende a automatizar emails, presupuestos, agenday edición con OpenClaw. Ahorra 10+ horas semanales.',
  keywords: ['IA para filmmakers', 'automatización videógrafos', 'OpenClaw guía', 'workflow creativo', 'productividad filmmaker', 'automatizar edición video', 'IA video', 'herramientas filmmakers'],
  authors: [{ name: 'Alberto Martín' }],
  openGraph: {
    title: 'IA para Filmmakers | Automatiza tu workflow',
    description: 'Guía práctica para automatizar tu workflow creativo con IA. Ahorra horas de administración y enfócate en crear.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.iaparafilmmakers.es',
    siteName: 'IA para Filmmakers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA para Filmmakers',
    description: 'Automatiza tu workflow creativo con IA. Guía práctica para filmmakers.',
  },
  alternates: {
    canonical: 'https://www.iaparafilmmakers.es',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
