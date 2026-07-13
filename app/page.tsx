import { SessionLanding } from '@/components/SessionLanding';
import { ASESORIA_PAYMENT_LINK_ID, getStripe } from '@/lib/stripe';

export const revalidate = 300;

export default async function HomePage() {
  let remainingSlots: number | null = null;

  try {
    const paymentLink = await getStripe().paymentLinks.retrieve(ASESORIA_PAYMENT_LINK_ID);
    const completed = paymentLink.restrictions?.completed_sessions;
    if (completed) remainingSlots = Math.max(0, completed.limit - completed.count);
  } catch {
    // La landing sigue disponible con copy no numérico si Stripe no responde.
  }

  return <SessionLanding remainingSlots={remainingSlots} />;
}
