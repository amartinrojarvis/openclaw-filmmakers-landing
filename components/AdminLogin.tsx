'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, LockKeyhole, MailCheck } from 'lucide-react';

type Props = { invalid?: boolean };

export function AdminLogin({ invalid = false }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(invalid ? 'error' : 'idle');
  const [message, setMessage] = useState(invalid ? 'El enlace ha caducado o no es válido.' : '');

  async function requestAccess() {
    setState('sending');
    setMessage('');
    try {
      const response = await fetch('/api/admin/auth/request', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo solicitar el acceso.');
      setState('sent');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo solicitar el acceso.');
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#171612] px-4 py-5 text-[#f2eee5] sm:grid sm:place-items-center sm:px-8 sm:py-8">
      <section className="mx-auto w-full max-w-xl border border-[#f2eee5]/15 bg-[#1d1b16] p-5 shadow-2xl sm:p-12">
        <div className="flex items-center justify-between border-b border-[#f2eee5]/12 pb-5 sm:pb-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">IA para Filmmakers</p>
          <LockKeyhole className="h-5 w-5 text-[#f2eee5]/35" aria-hidden="true" />
        </div>
        {state === 'sent' ? (
          <div className="py-8 sm:py-10">
            <span className="grid h-14 w-14 place-items-center bg-[#ff5a2a] text-[#171612]"><MailCheck className="h-7 w-7" /></span>
            <h1 className="font-editorial mt-7 text-[2.75rem] font-semibold leading-[0.92] tracking-[-0.05em] sm:mt-8 sm:text-5xl">Revisa tu correo.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#f2eee5]/58 sm:mt-6 sm:text-base sm:leading-7">He enviado el acceso únicamente a tu cuenta administradora. El enlace caduca en 15 minutos.</p>
          </div>
        ) : (
          <div className="py-8 sm:py-10">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f2eee5]/38">Acceso privado</p>
            <h1 className="font-editorial mt-5 text-[2.75rem] font-semibold leading-[0.92] tracking-[-0.05em] sm:text-6xl">Control de alumnos.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#f2eee5]/58 sm:mt-6 sm:text-base sm:leading-7">Compras, seguimiento y vencimientos de tus alumnos. Solo Alberto puede abrir este panel.</p>
            {state === 'error' && <p role="alert" className="mt-6 border border-red-300/30 bg-red-300/5 p-4 text-sm text-red-100">{message}</p>}
            <button type="button" onClick={requestAccess} disabled={state === 'sending'} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#ff5a2a] px-5 py-4 text-center text-[13px] font-extrabold uppercase leading-5 tracking-[0.07em] text-[#171612] transition hover:bg-[#f2eee5] disabled:cursor-wait disabled:opacity-60 sm:mt-8 sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.08em]">
              {state === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {state === 'sending' ? 'Enviando acceso' : 'Enviar acceso a mi correo'}
            </button>
          </div>
        )}
        <p className="border-t border-[#f2eee5]/12 pt-5 font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-[#f2eee5]/30 sm:text-[9px] sm:tracking-[0.14em]">Sesión privada · cookie segura · datos protegidos</p>
      </section>
    </main>
  );
}
