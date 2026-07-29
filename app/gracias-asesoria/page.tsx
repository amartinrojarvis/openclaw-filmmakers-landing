import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleAlert } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SessionIntakeForm } from '@/components/SessionIntakeForm';
import { AdvisoryPurchaseTracker } from '@/components/AdvisoryPurchaseTracker';
import {
  ASESORIA_PORTAL_LOGIN_URL,
  getAdvisoryPlanFromPriceIds,
  getStripe,
  type AdvisoryPlanKind,
} from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Prepara tu sesión 1:1',
  description: 'Formulario privado para preparar tu sesión individual con Alberto Martín.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function GraciasAsesoriaPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  let email = '';
  let valid = false;
  let alreadySubmitted = false;
  let plan: AdvisoryPlanKind | null = null;
  let purchaseValue = 75;

  if (sessionId?.startsWith('cs_')) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
      const priceIds = session.line_items?.data.map((item) => item.price?.id).filter(Boolean) || [];
      plan = getAdvisoryPlanFromPriceIds(priceIds);
      valid = session.payment_status === 'paid' && Boolean(plan);
      purchaseValue = (session.amount_total || 7500) / 100;
      email = session.customer_details?.email || session.customer_email || '';
      alreadySubmitted = session.metadata?.intake_submitted === 'true';
    } catch {
      valid = false;
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        {valid ? (
          <>
            <AdvisoryPurchaseTracker sessionId={sessionId!} value={purchaseValue} plan={plan!} />
            <header className="border-b border-[#f2eee5]/20 pb-12">
              <p className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]"><CheckCircle2 className="h-4 w-4" /> Pago confirmado</p>
              <h1 className="font-editorial mt-6 max-w-4xl text-balance text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">Ya tienes tu plaza. Ahora preparemos bien la sesión.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f2eee5]/58">Cuanto más concreto sea el punto de partida, más tiempo podremos dedicar a diseñar y construir sobre tu caso.</p>
              {plan !== 'session_90m' && <p className="mt-5 inline-flex border border-[#ff5a2a]/55 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#ff5a2a]">Implementación · primer mes incluido</p>}
              {plan === 'subscription_monthly' && (
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[#f2eee5]/58">
                  Puedes actualizar tu tarjeta, consultar facturas o cancelar al final del periodo desde el{' '}
                  <a href={ASESORIA_PORTAL_LOGIN_URL} target="_blank" rel="noreferrer" className="font-bold text-[#ff5a2a] underline underline-offset-4">portal seguro de Stripe</a>.
                </p>
              )}
            </header>

            <div className="mt-12">
              {alreadySubmitted ? (
                <div className="border border-[#f2eee5]/20 p-8 sm:p-12">
                  <span className="grid h-14 w-14 place-items-center bg-[#ff5a2a] text-[#171612]"><CheckCircle2 className="h-7 w-7" /></span>
                  <h2 className="font-editorial mt-7 text-4xl font-semibold tracking-[-0.04em]">Tu formulario ya está recibido.</h2>
                  <p className="mt-4 max-w-xl leading-7 text-[#f2eee5]/58">Alberto revisará tu caso y te escribirá para confirmar la fecha en un máximo de 48 horas laborables.</p>
                  <Link href="/" className="mt-8 inline-flex min-h-12 items-center gap-3 border border-[#f2eee5] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.07em] hover:border-[#ff5a2a] hover:text-[#ff5a2a]">Volver a la web <ArrowRight className="h-4 w-4" /></Link>
                </div>
              ) : <SessionIntakeForm sessionId={sessionId!} email={email} />}
            </div>
          </>
        ) : (
          <div className="border border-[#ff5a2a]/60 p-8 sm:p-12">
            <CircleAlert className="h-12 w-12 text-[#ff5a2a]" />
            <p className="mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Reserva no verificada</p>
            <h1 className="font-editorial mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">No puedo abrir todavía este formulario.</h1>
            <p className="mt-5 max-w-xl leading-7 text-[#f2eee5]/58">Solo se habilita después de un pago completado. Si ya has pagado, utiliza el enlace recibido por email o escribe indicando el correo de la compra.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:alberto@tuvideopromocional.es" className="inline-flex min-h-12 items-center bg-[#ff5a2a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.07em] text-[#171612]">Contactar con Alberto</a>
              <Link href="/" className="inline-flex min-h-12 items-center border border-[#f2eee5] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.07em]">Volver</Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
