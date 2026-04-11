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
    // Detect mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();

    // Delay particles load until after text renders
    const timer = setTimeout(() => {
      if (!isMobile) {
        setShouldLoad(true);
      }
    }, 100); // Load 100ms after mount

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Don't render on mobile at all for performance
  if (isMobile) return null;

  // Don't render until after initial paint
  if (!shouldLoad) return null;

  return <FloatingParticles />;
}
