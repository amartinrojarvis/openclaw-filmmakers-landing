import type { Metadata } from 'next';
import { PageLayout } from '@/components/PageLayout';
import { VibeEditingLanding } from '@/components/VibeEditingLanding';

export const metadata: Metadata = {
  title: 'Aprende vibe editing con DaVinci y ChatGPT | Alberto Martín',
  description:
    'Delega tareas de edición en ChatGPT y DaVinci Resolve sin perder tu criterio. ' +
    'Sesión puntual de 90 minutos o acompañamiento mensual, trabajando con tu material real.',
  alternates: { canonical: '/vibe-editing' },
  openGraph: {
    type: 'website',
    title: 'Aprende vibe editing con DaVinci y ChatGPT',
    description:
      'Delega la edición sin contratar a nadie: sesiones y acompañamiento mensual con DaVinci Resolve y ChatGPT, con tu material real.',
    url: 'https://www.iaparafilmmakers.es/vibe-editing',
    images: [
      {
        url: '/og-vibe-editing.png',
        width: 1200,
        height: 630,
        alt: 'Delega la edición. Sin contratar a nadie. Aprende con Alberto Martín · DaVinci + ChatGPT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aprende vibe editing con DaVinci y ChatGPT',
    description:
      'Delega la edición sin contratar a nadie: sesiones y acompañamiento mensual con DaVinci Resolve y ChatGPT.',
    images: ['/og-vibe-editing.png'],
  },
};

export default function VibeEditingPage() {
  return (
    <PageLayout fullHeight={false} backLabel="Volver a la home" secondaryHref="#modalidades" secondaryLabel="Ver modalidades">
      <VibeEditingLanding />
    </PageLayout>
  );
}
