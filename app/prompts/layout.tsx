import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '5 Prompts de OpenClaw Gratis | IA para Filmmakers',
  description: 'Descarga 5 prompts probados de OpenClaw que me ahorran 10 horas semanales. PDF gratuito. Copia y pega. Sin teoría, solo resultados.',
  keywords: [
    'prompts openclaw',
    'openclaw filmmakers',
    'automatización video',
    'prompts IA filmmaking',
    'openclaw gratis',
    'workflow filmmaker IA',
  ],
  openGraph: {
    title: '5 Prompts de OpenClaw que me ahorran 10 horas semanales',
    description: 'PDF gratuito con 5 prompts probados. Copia y pega en tu OpenClaw.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.iaparafilmmakers.es/prompts',
    images: [{
      url: 'https://www.iaparafilmmakers.es/perfil-alberto-v2.jpg',
      width: 400,
      height: 400,
      alt: '5 Prompts de OpenClaw para Filmmakers',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Prompts de OpenClaw Gratis | IA para Filmmakers',
    description: 'Descarga 5 prompts probados que me ahorran 10h semanales.',
    images: ['https://www.iaparafilmmakers.es/perfil-alberto-v2.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
