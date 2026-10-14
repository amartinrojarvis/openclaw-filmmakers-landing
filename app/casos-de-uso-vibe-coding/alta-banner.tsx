'use client';

import { useEffect, useState } from 'react';

let altaConfirmada: boolean | null = null;

/** Lee ?alta=ok una sola vez y lo quita de la URL sin recargar. */
export function detectAltaConfirmada(): boolean {
  if (altaConfirmada === true) return true;
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get('alta') !== 'ok') return false;

  altaConfirmada = true;
  params.delete('alta');
  const search = params.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`,
  );
  return true;
}

export function AltaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (detectAltaConfirmada()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="alta-banner" role="status">
      <p>¡Alta confirmada! Te llegará un caso nuevo cada jueves.</p>
      <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar aviso">
        ×
      </button>
    </div>
  );
}
