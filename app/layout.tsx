import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenClaw para Filmmakers | Automatiza tu workflow creativo',
  description: 'La guía práctica para filmmakers que quieren usar OpenClaw e IA para recuperar horas de administración y enfocarse en crear.',
  keywords: ['OpenClaw', 'filmmakers', 'automatización', 'IA', 'workflow creativo', 'productividad'],
  authors: [{ name: 'Alberto Martín' }],
  openGraph: {
    title: 'OpenClaw para Filmmakers',
    description: 'Automatiza tu workflow creativo con IA. La guía práctica para filmmakers.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw para Filmmakers',
    description: 'Automatiza tu workflow creativo con IA',
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
