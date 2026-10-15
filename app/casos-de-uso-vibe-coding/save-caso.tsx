'use client';

import { useCallback, useEffect, useState } from 'react';
import { CASOS } from '@/lib/casos-vibe-coding';
import { SAVED_CASOS_KEY, parseSavedIds } from './saved-casos';

const known = new Set(CASOS.map((caso) => caso.id));
let memory: string[] | null = null;

function readSaved(): string[] {
  if (memory) return memory;
  try {
    memory = parseSavedIds(window.localStorage.getItem(SAVED_CASOS_KEY), known);
  } catch {
    memory = [];
  }
  return memory;
}

function writeSaved(ids: string[]) {
  memory = ids;
  try {
    window.localStorage.setItem(SAVED_CASOS_KEY, JSON.stringify(ids));
  } catch {
    // En modo privado la lista sigue en memoria durante esta visita.
  }
  window.dispatchEvent(new Event(SAVED_CASOS_KEY));
}

export function useSavedCasos() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSaved(readSaved());
    sync();
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SAVED_CASOS_KEY) return;
      memory = parseSavedIds(event.newValue, known);
      setSaved(memory);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SAVED_CASOS_KEY, sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SAVED_CASOS_KEY, sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    if (!known.has(id)) return;
    const current = readSaved();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writeSaved(next);
    setSaved(next);
  }, []);

  return { saved, toggle };
}

export function SaveCasoButton({
  id,
  pressed,
  onToggle,
}: {
  id: string;
  pressed: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      className={`save${pressed ? ' on' : ''}`}
      type="button"
      aria-pressed={pressed}
      aria-label={pressed ? 'Quitar de guardados' : 'Guardar caso'}
      onClick={() => onToggle(id)}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      Guardar
    </button>
  );
}

export function SaveCasoControl({ id }: { id: string }) {
  const { saved, toggle } = useSavedCasos();
  return <SaveCasoButton id={id} pressed={saved.includes(id)} onToggle={toggle} />;
}
