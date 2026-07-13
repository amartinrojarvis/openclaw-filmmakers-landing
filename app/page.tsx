import { SessionLanding } from '@/components/SessionLanding';
import { getAdvisoryInventory } from '@/lib/stripe';

export const revalidate = 300;

export default async function HomePage() {
  let remainingSlots: number | null = null;

  try {
    remainingSlots = (await getAdvisoryInventory()).remaining;
  } catch {
    // La landing sigue disponible con copy no numérico si Stripe no responde.
  }

  return <SessionLanding remainingSlots={remainingSlots} />;
}
