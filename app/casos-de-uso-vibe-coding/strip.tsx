'use client';

import { useState } from 'react';

const BOOKING_HREF = '/#sesion';

function StripItems({ hidden }: { hidden?: boolean }) {
  const tab = hidden ? -1 : undefined;
  return (
    <>
      <a className="it" href={BOOKING_HREF} aria-hidden={hidden || undefined} tabIndex={tab}>
        <span className="lbl">Implementación</span><b>Te monto el flujo con IA, 199 €/mes</b><em>Llamada de 15 min ↗</em>
      </a>
      <a className="it" href="https://tuvideopromocional.es/" aria-hidden={hidden || undefined} tabIndex={tab}>
        <span className="lbl">Producción</span><b>Tu Vídeo Promocional</b><span>vídeo para tu marca, rodado y editado</span>
      </a>
      <a className="it" href="/casos-de-uso-vibe-coding#newsletter" aria-hidden={hidden || undefined} tabIndex={tab}>
        <span className="lbl">Newsletter</span><b>Un caso nuevo cada jueves</b>
      </a>
      <span className="it" aria-hidden={hidden || undefined}>
        <span className="lbl">Dirección y montaje</span><b>Alberto Martín</b>
      </span>
    </>
  );
}

export function CasosStrip() {
  const [hidden, setHidden] = useState(false);

  return (
    <div className={`strip${hidden ? ' is-hidden' : ''}`} role="complementary" aria-label="Créditos" hidden={hidden}>
      <span className="tit">
        <span className="lbl ln">Producido por</span>
        {'\u00A0'}
        <b>IA para Filmmakers</b>
      </span>
      <div className="rail">
        <div className="tr">
          <StripItems />
          <StripItems hidden />
        </div>
      </div>
      <button className="x" type="button" aria-label="Cerrar" onClick={() => setHidden(true)}>✕</button>
    </div>
  );
}
