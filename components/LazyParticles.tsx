'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load particles only after initial render
const FloatingParticles = dynamic(() => import('./Particles').then(mod => mod.FloatingParticles), {
  ssr: false,
  loading: () => null,
});

export function LazyParticles() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile - be aggressive
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || // Tablets and phones
        /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window && navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // Delay particles load until after text renders - only on desktop
    const timer = setTimeout(() => {
      if (!isMobile && !window.matchMedia('(pointer: coarse)').matches) {
        setShouldLoad(true);
      }
    }, 500); // Delay 500ms to ensure text renders first

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Don't render on mobile/tablet at all for performance
  if (isMobile) return null;

  // Don't render until after initial paint
  if (!shouldLoad) return null;

  return <FloatingParticles />;
}
