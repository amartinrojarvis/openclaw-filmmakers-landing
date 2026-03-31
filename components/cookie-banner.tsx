"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#07111f]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-slate-300 sm:text-left">
            Esta web utiliza cookies para mejorar la experiencia. Al continuar, aceptas su uso.
          </p>
          <button
            onClick={acceptCookies}
            className="shrink-0 rounded-full bg-cyan px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
