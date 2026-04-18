import type { Metadata } from 'next';
import { PageLayout } from '@/components/PageLayout';
import { GraciasPromptsContent } from './GraciasPromptsContent';

export const metadata: Metadata = {
  title: 'PDF en camino | IA para Filmmakers',
  description: 'Recibirás el PDF con los 5 prompts de OpenClaw en tu email en breve.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GraciasPromptsPage() {
  return (
    <PageLayout showBackButton={true} fullHeight={true}>
      <GraciasPromptsContent />
    </PageLayout>
  );
}
