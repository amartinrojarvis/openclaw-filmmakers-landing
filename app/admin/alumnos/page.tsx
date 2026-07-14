import type { Metadata } from 'next';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminStudentsDashboard, type AdminStudentsFilter } from '@/components/AdminStudentsDashboard';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { listIafPurchases } from '@/lib/admin-students-stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Control de alumnos · Privado',
  description: 'Panel privado de seguimiento de alumnos de IA para Filmmakers.',
  robots: { index: false, follow: false, nocache: true },
};

type Search = {
  filter?: string;
  q?: string;
  updated?: string;
  error?: string;
  auth?: string;
};
type Props = { searchParams: Promise<Search> };

const VALID_FILTERS = new Set<AdminStudentsFilter>(['students', 'active', 'pending', 'all', 'internal']);

export default async function AdminStudentsPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!await isAdminAuthenticated()) return <AdminLogin invalid={params.auth === 'invalid'} />;

  const requestedFilter = params.filter as AdminStudentsFilter;
  const filter = VALID_FILTERS.has(requestedFilter) ? requestedFilter : 'students';
  try {
    const purchases = await listIafPurchases();
    return (
      <AdminStudentsDashboard
        purchases={purchases}
        filter={filter}
        query={(params.q || '').slice(0, 100)}
        updated={params.updated === '1'}
        updateError={params.error === 'update'}
      />
    );
  } catch (error) {
    console.error('Admin students Stripe read failed:', error instanceof Error ? error.message : String(error));
    return <AdminStudentsDashboard purchases={[]} filter={filter} query="" dataError />;
  }
}
