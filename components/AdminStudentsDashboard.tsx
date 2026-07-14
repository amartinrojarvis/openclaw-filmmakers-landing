import Link from 'next/link';
import { CalendarClock, CheckCircle2, ChevronDown, CircleAlert, Search, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import type { AccessState, IafPurchase } from '@/lib/admin-students';

type Filter = 'students' | 'active' | 'pending' | 'all' | 'internal';
type Props = {
  purchases: IafPurchase[];
  filter: Filter;
  query: string;
  updated?: boolean;
  updateError?: boolean;
  dataError?: boolean;
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'students', label: 'Alumnos' },
  { key: 'active', label: 'Activos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'all', label: 'Todas las compras' },
  { key: 'internal', label: 'Pruebas internas' },
];

function isAdvisory(item: IafPurchase) {
  return item.productKind === 'followup_30d' || item.productKind === 'session_90m';
}

function filterPurchases(purchases: IafPurchase[], filter: Filter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return purchases.filter((item) => {
    if (filter === 'students' && (!isAdvisory(item) || item.isInternal)) return false;
    if (filter === 'active' && (item.isInternal || item.accessState !== 'active')) return false;
    if (filter === 'pending' && (item.isInternal || !['pending_start', 'session_pending'].includes(item.accessState))) return false;
    if (filter === 'all' && item.isInternal) return false;
    if (filter === 'internal' && !item.isInternal) return false;
    if (!normalizedQuery) return true;
    return `${item.customerName} ${item.customerEmail} ${item.productLabel}`.toLowerCase().includes(normalizedQuery);
  });
}

function stateLabel(state: AccessState) {
  const labels: Record<AccessState, string> = {
    pending_start: 'Falta fecha de inicio',
    active: 'Activo',
    expired: 'Vencido',
    completed: 'Completado',
    cancelled: 'Cancelado',
    session_pending: 'Pendiente de sesión',
    lifetime: 'Sin caducidad',
  };
  return labels[state];
}

function stateClass(state: AccessState) {
  if (state === 'active' || state === 'lifetime') return 'border-lime-300/35 bg-lime-300/8 text-lime-200';
  if (state === 'pending_start' || state === 'session_pending') return 'border-amber-300/35 bg-amber-300/8 text-amber-100';
  if (state === 'expired' || state === 'cancelled') return 'border-red-300/35 bg-red-300/8 text-red-100';
  return 'border-[#f2eee5]/20 bg-[#f2eee5]/5 text-[#f2eee5]/70';
}

function formatDate(value: string | null, includeTime = false) {
  if (!value) return 'Sin definir';
  const date = value.length === 10 ? new Date(`${value}T12:00:00Z`) : new Date(value);
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit', month: 'short', year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
}

export function AdminStudentsDashboard({ purchases, filter, query, updated, updateError, dataError }: Props) {
  const visible = filterPurchases(purchases, filter, query);
  const realAdvisory = purchases.filter((item) => isAdvisory(item) && !item.isInternal);
  const active = realAdvisory.filter((item) => item.accessState === 'active').length;
  const pending = realAdvisory.filter((item) => item.accessState === 'pending_start' || item.accessState === 'session_pending').length;
  const endingSoon = realAdvisory.filter((item) => item.daysRemaining !== null && item.daysRemaining <= 7 && item.accessState === 'active').length;
  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: 'Alumnos reales', value: realAdvisory.length, Icon: Users },
    { label: 'Activos', value: active, Icon: CheckCircle2 },
    { label: 'Pendientes', value: pending, Icon: CalendarClock },
    { label: 'Terminan ≤ 7 días', value: endingSoon, Icon: CircleAlert },
  ];

  return (
    <main className="min-h-screen bg-[#171612] text-[#f2eee5]">
      <header className="border-b border-[#f2eee5]/12 px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-5">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">IA para Filmmakers · privado</p>
            <p className="mt-2 text-sm font-bold">Control de alumnos</p>
          </div>
          <form action="/api/admin/auth/logout" method="post">
            <button className="min-h-11 border border-[#f2eee5]/20 px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#f2eee5]/55 hover:border-[#ff5a2a] hover:text-[#ff5a2a]">Cerrar sesión</button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-[92rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <section className="grid gap-8 border-b border-[#f2eee5]/12 pb-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#ff5a2a]" /><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f2eee5]/42">Datos protegidos</span></div>
            <h1 className="font-editorial mt-6 text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.85] tracking-[-0.06em]">Tus alumnos,<br />sin perder fechas.</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#f2eee5]/52 lg:justify-self-end">Solo aparecen compras pagadas con productos de IA para Filmmakers. El vencimiento del acompañamiento se calcula desde la sesión inicial.</p>
        </section>

        {(updated || updateError) && (
          <div className={`mt-6 flex items-center gap-3 border p-4 text-sm ${updated ? 'border-lime-300/30 bg-lime-300/5 text-lime-100' : 'border-red-300/30 bg-red-300/5 text-red-100'}`}>
            {updated ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
            {updated ? 'Seguimiento actualizado.' : 'No se pudo guardar el cambio. Revisa los datos.'}
          </div>
        )}

        {dataError && (
          <div className="mt-6 flex items-center gap-3 border border-red-300/30 bg-red-300/5 p-4 text-sm text-red-100">
            <CircleAlert className="h-5 w-5" /> No se pudieron consultar los datos. No se muestran cifras para evitar información engañosa.
          </div>
        )}

        <section className="mt-8 grid gap-px bg-[#f2eee5]/12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, Icon }) => (
            <article key={label} className="bg-[#1b1915] p-5 sm:p-6">
              <Icon className="h-5 w-5 text-[#ff5a2a]" aria-hidden="true" />
              <strong className="mt-7 block text-4xl font-semibold tracking-[-0.04em]">{String(value).padStart(2, '0')}</strong>
              <span className="mt-2 block font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#f2eee5]/35">{label}</span>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-5 border-b border-[#f2eee5]/12 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtros de compras">
              {FILTERS.map((item) => (
                <Link key={item.key} href={`/admin/alumnos?filter=${item.key}`} className={`shrink-0 border px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${filter === item.key ? 'border-[#ff5a2a] bg-[#ff5a2a] text-[#171612]' : 'border-[#f2eee5]/15 text-[#f2eee5]/45 hover:border-[#f2eee5]/45'}`}>{item.label}</Link>
              ))}
            </nav>
            <form className="flex w-full max-w-md" method="get">
              <input type="hidden" name="filter" value={filter} />
              <label className="sr-only" htmlFor="student-search">Buscar alumno</label>
              <input id="student-search" name="q" defaultValue={query} placeholder="Nombre, email o producto" className="min-h-12 min-w-0 flex-1 border border-[#f2eee5]/15 bg-transparent px-4 text-sm placeholder:text-[#f2eee5]/25" />
              <button className="grid min-h-12 w-12 place-items-center bg-[#f2eee5] text-[#171612]" aria-label="Buscar"><Search className="h-4 w-4" /></button>
            </form>
          </div>

          <div className="mt-6 space-y-4">
            {visible.length === 0 && <div className="border border-dashed border-[#f2eee5]/18 p-10 text-center text-[#f2eee5]/42">No hay compras en este filtro.</div>}
            {visible.map((item) => (
              <article key={item.id} className="border border-[#f2eee5]/14 bg-[#1b1915]">
                <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[1.3fr_1fr_.85fr_auto] xl:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`border px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] ${stateClass(item.accessState)}`}>{stateLabel(item.accessState)}</span>
                      {item.isInternal && <span className="border border-cyan-300/30 px-2.5 py-1 font-mono text-[8px] uppercase text-cyan-100">Interna</span>}
                    </div>
                    <h2 className="mt-4 truncate text-2xl font-bold tracking-[-0.03em] sm:text-3xl" title={item.customerName}>{item.customerName}</h2>
                    <a href={`mailto:${item.customerEmail}`} className="mt-2 block truncate text-sm text-[#f2eee5]/45 hover:text-[#ff5a2a]">{item.customerEmail}</a>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#f2eee5]/28">Compró</p>
                    <p className="mt-2 font-semibold leading-6">{item.productLabel}</p>
                    <p className="mt-1 text-sm text-[#f2eee5]/42">{formatMoney(item.amountTotal, item.currency)} · {formatDate(item.purchasedAt, true)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
                    <div><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/28">Inicio</p><p className="mt-1 text-sm font-bold">{formatDate(item.serviceStart)}</p></div>
                    <div><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/28">Finaliza</p><p className="mt-1 text-sm font-bold">{item.accessState === 'lifetime' ? 'No caduca' : formatDate(item.serviceEnd)}</p></div>
                  </div>
                  <div className="xl:text-right">
                    {item.daysRemaining !== null ? <><strong className="text-4xl text-[#ff5a2a]">{item.daysRemaining}</strong><span className="ml-2 font-mono text-[8px] uppercase text-[#f2eee5]/35">días</span></> : <span className="font-mono text-[9px] uppercase text-[#f2eee5]/35">{item.intakeSubmitted ? 'Briefing recibido' : 'Briefing pendiente'}</span>}
                  </div>
                </div>

                {isAdvisory(item) && (
                  <details className="border-t border-[#f2eee5]/10 group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#f2eee5]/45 hover:text-[#ff5a2a] sm:px-7">Gestionar seguimiento <ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></summary>
                    <form action={`/api/admin/students/${encodeURIComponent(item.id)}`} method="post" className="grid gap-5 border-t border-[#f2eee5]/10 bg-[#171612]/55 p-5 sm:p-7 lg:grid-cols-2 xl:grid-cols-4">
                      <label className="text-sm"><span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/35">Fecha sesión inicial</span><input type="date" name="serviceStart" defaultValue={item.serviceStart || ''} className="min-h-12 w-full border border-[#f2eee5]/15 bg-[#171612] px-3 [color-scheme:dark]" /></label>
                      <label className="text-sm"><span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/35">Fecha final</span><input type="date" name="serviceEnd" defaultValue={item.serviceEnd || ''} className="min-h-12 w-full border border-[#f2eee5]/15 bg-[#171612] px-3 [color-scheme:dark]" /><small className="mt-2 block text-xs text-[#f2eee5]/28">Vacía = inicio + 30 días</small></label>
                      <label className="text-sm"><span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/35">Estado</span><select name="status" defaultValue={item.adminStatus} className="min-h-12 w-full border border-[#f2eee5]/15 bg-[#171612] px-3"><option value="pending">Pendiente</option><option value="scheduled">Programado</option><option value="active">Activo</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></label>
                      <label className="text-sm"><span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#f2eee5]/35">Nota privada</span><textarea name="note" defaultValue={item.adminNote} maxLength={500} rows={3} className="w-full resize-y border border-[#f2eee5]/15 bg-[#171612] p-3" placeholder="Próxima acción, acuerdo o contexto" /></label>
                      <div className="lg:col-span-2 xl:col-span-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#f2eee5]/10 pt-5">
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#f2eee5]/25">Referencia · {item.id.slice(-10)}</span>
                        <button className="min-h-12 bg-[#ff5a2a] px-6 text-sm font-extrabold uppercase tracking-[0.07em] text-[#171612] hover:bg-[#f2eee5]">Guardar cambios</button>
                      </div>
                    </form>
                  </details>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export type { Filter as AdminStudentsFilter };
