import type { Metadata } from 'next';
import { ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta con Alberto Martín para dudas sobre la asesoría 1:1 de IA aplicada al trabajo audiovisual.',
};

export default function ContactoPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 border-b border-[#f2eee5]/20 pb-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Contacto</p>
          <div>
            <h1 className="font-editorial max-w-4xl text-balance text-[clamp(3.7rem,7vw,7.8rem)] font-medium leading-[0.86] tracking-[-0.065em]">Hablemos de tu caso.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#f2eee5]/58">Si tienes una duda antes de reservar, una incidencia con el pago o quieres saber si tu caso encaja, escríbeme directamente.</p>
          </div>
        </div>

        <div className="mt-4">
          <a href="mailto:alberto@tuvideopromocional.es" className="group grid gap-4 border-b border-[#f2eee5]/20 py-8 sm:grid-cols-[70px_1fr_auto] sm:items-center">
            <Mail className="h-6 w-6 text-[#ff5a2a]" aria-hidden="true" />
            <div><h2 className="text-2xl font-black tracking-[-0.03em]">Email</h2><p className="mt-2 text-sm text-[#f2eee5]/48">Respuesta habitual en 24–48 horas laborables.</p></div>
            <span className="inline-flex items-center gap-2 break-all text-sm font-bold text-[#ff5a2a]">alberto@tuvideopromocional.es <ArrowUpRight className="h-4 w-4 shrink-0" /></span>
          </a>
          <a href="https://www.instagram.com/amartinro/" target="_blank" rel="noopener noreferrer" className="group grid gap-4 border-b border-[#f2eee5]/20 py-8 sm:grid-cols-[70px_1fr_auto] sm:items-center">
            <Instagram className="h-6 w-6 text-[#ff5a2a]" aria-hidden="true" />
            <div><h2 className="text-2xl font-black tracking-[-0.03em]">Instagram</h2><p className="mt-2 text-sm text-[#f2eee5]/48">Trabajo audiovisual, herramientas y aprendizaje en público.</p></div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#ff5a2a]">@amartinro <ArrowUpRight className="h-4 w-4" /></span>
          </a>
          <div className="grid gap-4 py-8 sm:grid-cols-[70px_1fr] sm:items-center">
            <MapPin className="h-6 w-6 text-[#ff5a2a]" aria-hidden="true" />
            <div><h2 className="text-2xl font-black tracking-[-0.03em]">Salamanca · online</h2><p className="mt-2 text-sm text-[#f2eee5]/48">Las sesiones se realizan por videollamada.</p></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
