import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenClaw para Filmmakers | Automatiza tu workflow creativo',
  description:
    'Guía práctica + consultoría para filmmakers que quieren automatizar agenda, emails, clientes y análisis de vídeo con OpenClaw.',
  keywords: [
    'OpenClaw',
    'filmmakers',
    'automatización',
    'videógrafos',
    'creadores de contenido',
    'consultoría IA',
  ],
  openGraph: {
    title: 'OpenClaw para Filmmakers',
    description:
      'Ahorra tiempo en operaciones y dedica más energía a rodar, editar y cerrar mejores proyectos.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw para Filmmakers',
    description:
      'Guía + consultoría para automatizar tu workflow creativo con IA.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
