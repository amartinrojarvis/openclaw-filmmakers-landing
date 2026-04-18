'use client';

export function OpenCookieSettings() {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('openCookieBanner'));
        }
      }}
      className="text-[#00ff88] hover:underline cursor-pointer bg-transparent border-none"
    >
      Abrir configuracion de cookies →
    </button>
  );
}
