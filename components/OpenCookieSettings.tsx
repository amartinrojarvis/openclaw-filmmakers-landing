'use client';

import { SlidersHorizontal } from 'lucide-react';
import { openCookieSettings } from '@/lib/cookies';

export function OpenCookieSettings() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="inline-flex min-h-12 cursor-pointer items-center gap-3 border border-[#171612] bg-[#171612] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[#f2eee5] transition-colors hover:bg-[#ff5a2a] hover:text-[#171612]"
    >
      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
      Abrir gestor de cookies
    </button>
  );
}
