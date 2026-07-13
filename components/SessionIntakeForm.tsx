'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { AnalyticsEvents } from '@/components/Analytics';

type Props = { sessionId: string; email: string };

const initialForm = {
  name: '', activity: '', website: '', experience: 'principiante', priority: '', tools: '', availability: '', context: '', privacyAccepted: false, serviceStartPreference: '',
};

export function SessionIntakeForm({ sessionId, email }: Props) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const update = (key: keyof typeof initialForm, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus('submitting'); setError('');
    try {
      const response = await fetch('/api/asesoria/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sessionId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar el formulario.');
      AnalyticsEvents.intakeSubmitted();
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el formulario.'); setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-[#f2eee5]/20 p-8 sm:p-12">
        <span className="grid h-14 w-14 place-items-center bg-[#ff5a2a] text-[#171612]"><CheckCircle2 className="h-7 w-7" /></span>
        <h2 className="font-editorial mt-7 text-4xl font-semibold tracking-[-0.04em]">Ya tengo todo lo necesario.</h2>
        <p className="mt-4 max-w-xl leading-7 text-[#f2eee5]/58">Alberto ha recibido tu briefing asociado a <strong className="text-[#f2eee5]">{email}</strong>. Revisará tu caso y te escribirá para confirmar la fecha en un máximo de 48 horas laborables.</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center gap-3 border border-[#f2eee5] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.07em] hover:border-[#ff5a2a] hover:text-[#ff5a2a]">Volver a la web <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  const inputClass = 'mt-2 w-full border border-[#f2eee5]/20 bg-transparent px-4 py-3.5 text-[#f2eee5] placeholder:text-[#f2eee5]/25 outline-none transition focus:border-[#ff5a2a] focus:bg-[#f2eee5]/[0.03]';
  const labelClass = 'block text-sm font-bold text-[#f2eee5]/78';

  return (
    <form onSubmit={submit} className="border border-[#f2eee5]/20 p-5 sm:p-9">
      <div className="mb-9 flex items-start gap-4 border-b border-[#f2eee5]/20 pb-7 text-sm leading-6 text-[#f2eee5]/55">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5a2a]" />
        <p>El pago está confirmado para <strong className="text-[#f2eee5]">{email}</strong>. Estas respuestas se usan únicamente para preparar y coordinar tu sesión.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelClass}>Nombre y apellidos *<input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required maxLength={100} autoComplete="name" /></label>
        <label className={labelClass}>Actividad o tipo de negocio *<input className={inputClass} value={form.activity} onChange={(e) => update('activity', e.target.value)} required maxLength={150} placeholder="Filmmaker, videógrafa, productora…" /></label>
        <label className={labelClass}>Web o perfil profesional<input className={inputClass} value={form.website} onChange={(e) => update('website', e.target.value)} maxLength={240} placeholder="https:// o @usuario" /></label>
        <label className={labelClass}>Experiencia con IA *<select className={`${inputClass} [&_option]:bg-[#171612]`} value={form.experience} onChange={(e) => update('experience', e.target.value)} required><option value="principiante">Estoy empezando</option><option value="ocasional">Uso alguna herramienta de vez en cuando</option><option value="habitual">Ya la utilizo habitualmente</option><option value="avanzado">Tengo flujos o automatizaciones propias</option></select></label>
      </div>

      <label className={`${labelClass} mt-6`}>¿Qué problema concreto te gustaría trabajar? *<textarea className={`${inputClass} min-h-32 resize-y`} value={form.priority} onChange={(e) => update('priority', e.target.value)} required maxLength={1600} placeholder="Describe una tarea, bloqueo o proceso que te quite tiempo o no esté funcionando bien." /></label>
      <label className={`${labelClass} mt-6`}>¿Qué herramientas utilizas ahora?<textarea className={`${inputClass} min-h-24 resize-y`} value={form.tools} onChange={(e) => update('tools', e.target.value)} maxLength={900} placeholder="Edición, gestión, IA, correo, agenda… No pasa nada si la respuesta es ninguna." /></label>
      <label className={`${labelClass} mt-6`}>Propón tres opciones de día y horario *<textarea className={`${inputClass} min-h-28 resize-y`} value={form.availability} onChange={(e) => update('availability', e.target.value)} required maxLength={900} placeholder="Incluye tu zona horaria. Por ejemplo: martes 10:00–13:00…" /></label>
      <label className={`${labelClass} mt-6`}>¿Hay algo más que Alberto deba saber?<textarea className={`${inputClass} min-h-24 resize-y`} value={form.context} onChange={(e) => update('context', e.target.value)} maxLength={1200} /></label>

      <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#f2eee5]/60"><input type="checkbox" checked={form.privacyAccepted} onChange={(e) => update('privacyAccepted', e.target.checked)} required className="mt-1 h-4 w-4 accent-[#ff5a2a]" /><span>Acepto que estos datos se utilicen para preparar y coordinar la sesión conforme a la <Link href="/privacidad" target="_blank" className="text-[#ff5a2a] underline">política de privacidad</Link>. *</span></label>

      <fieldset className="mt-6 border border-[#f2eee5]/20 p-4 sm:p-5">
        <legend className="px-2 text-sm font-bold text-[#f2eee5]/78">¿Cuándo puede comenzar el servicio? *</legend>
        <p className="mb-4 text-sm leading-6 text-[#f2eee5]/55">Esta elección nos permite confirmar una fecha compatible con el plazo legal de desistimiento.</p>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#f2eee5]/65"><input type="radio" name="serviceStartPreference" value="within14" checked={form.serviceStartPreference === 'within14'} onChange={(e) => update('serviceStartPreference', e.target.value)} required className="mt-1 h-4 w-4 accent-[#ff5a2a]" /><span>Puede celebrarse dentro de los próximos 14 días. Solicito expresamente el inicio anticipado y entiendo que el derecho de desistimiento termina cuando la sesión se haya prestado completamente.</span></label>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#f2eee5]/65"><input type="radio" name="serviceStartPreference" value="after14" checked={form.serviceStartPreference === 'after14'} onChange={(e) => update('serviceStartPreference', e.target.value)} required className="mt-1 h-4 w-4 accent-[#ff5a2a]" /><span>Prefiero que la sesión se celebre una vez transcurridos los próximos 14 días.</span></label>
      </fieldset>

      {error && <p role="alert" className="mt-5 border border-red-400/40 p-4 text-sm text-red-200">{error} Si continúa, escribe a alberto@tuvideopromocional.es.</p>}
      <button type="submit" disabled={status === 'submitting'} className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#ff5a2a] px-7 py-4 font-extrabold uppercase tracking-[0.06em] text-[#171612] transition hover:bg-[#f2eee5] disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {status === 'submitting' ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</> : <>Enviar y solicitar fecha <ArrowRight className="h-5 w-5" /></>}
      </button>
    </form>
  );
}
