'use client';

import { useEffect, useState, type FormEvent } from 'react';

type Phase = 'idle' | 'sending' | 'sent' | 'error';

export function NewsletterForm() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('alta') === 'ok') setConfirmed(true);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPhase('sending');
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          honeypot: data.get('honeypot'),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setPhase('error');
        setError(payload && typeof payload.error === 'string'
          ? payload.error
          : 'No he podido apuntarte. Prueba de nuevo en unos minutos.');
        return;
      }
      setPhase('sent');
    } catch {
      setPhase('error');
      setError('No he podido apuntarte. Revisa tu conexión y prueba de nuevo.');
    }
  }

  const className = `nl${phase === 'sent' ? ' sent' : ''}${confirmed ? ' confirmed' : ''}`;

  return (
    <section className={className} id="newsletter">
      <span className="lbl ln">Newsletter</span>
      <h2><span className="st week">Un caso por semana,</span> los jueves</h2>
      <p>Te lo escribo yo. Qué he probado con ChatGPT y Resolve, qué ha funcionado y qué no. Te das de baja con un clic.</p>
      {confirmed ? <p className="done">¡Alta confirmada!</p> : null}
      <form onSubmit={onSubmit} aria-busy={phase === 'sending'}>
        <input type="email" name="email" required placeholder="tu@email.com" aria-label="Email" autoComplete="email" disabled={phase === 'sending'} />
        <input className="hp" type="text" name="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
        <button className="btn pri" type="submit" disabled={phase === 'sending'}>
          {phase === 'sending' ? 'Enviando…' : 'Apuntarme'}
        </button>
      </form>
      {confirmed ? null : <p className="ok">Revisa tu email para confirmar</p>}
      {phase === 'error' ? <p className="err" role="alert">{error}</p> : null}
    </section>
  );
}
