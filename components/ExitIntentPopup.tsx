'use client';

import { useEffect, useState } from 'react';
import { EmailCapture } from './EmailCapture';

const STORAGE_KEY = 'exit_intent_last_shown';
const COOLDOWN_DAYS = 7;

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Solo en desktop (hay mouse)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Verificar cooldown en localStorage
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < COOLDOWN_DAYS) return;
    }

    let shown = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (shown) return;
      // Solo cuando el raton sale por la parte superior de la pagina
      if (e.clientY <= 0) {
        shown = true;
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    // Pequeno retraso para no ser agresivo al cargar
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!hasMounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <EmailCapture
        variant="exit"
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
