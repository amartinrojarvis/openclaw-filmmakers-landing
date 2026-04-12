import type { Metadata } from 'next';
import { GraciasContent } from './GraciasContent';

export const metadata: Metadata = {
  title: 'Gracias por tu compra | IA para Filmmakers',
  description: 'Tu compra ha sido procesada correctamente. Recibirás un email con los detalles.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasPage() {
  return <GraciasContent />;
}
