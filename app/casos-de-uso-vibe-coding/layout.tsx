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

const title = 'Casos de vibe editing · IA para Filmmakers';
const description = 'Casos reales de edición con IA en DaVinci Resolve, con su prompt, sacados de proyectos de Alberto Martín.';

const robots: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
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
