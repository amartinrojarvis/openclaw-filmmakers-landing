import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { AltaBanner } from './alta-banner';
import { CasosStrip } from './strip';
import './casos.css';

const casosMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-casos-mono',
  display: 'swap',
});

const title = 'Vibe editing: casos de edición con IA en DaVinci Resolve';
const description = 'Casos reales de edición con IA en DaVinci Resolve, con su prompt, sacados de proyectos de Alberto Martín, filmmaker e ingeniero informático. Prompts listos para copiar.';

const robots: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots,
  alternates: { canonical: '/casos-de-uso-vibe-coding' },
  openGraph: {
    title,
    description,
    url: '/casos-de-uso-vibe-coding',
  },
  twitter: {
    title,
    description,
  },
};

export default function CasosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`casos ${casosMono.variable}`}>
      <AltaBanner />
      {children}
      <CasosStrip />
    </div>
  );
}
