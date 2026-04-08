'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Only run on client and after hydration
    if (typeof window === 'undefined') return;
    
    // Use requestAnimationFrame to ensure we're after hydration
    const scrollToTop = () => {
      try {
        // Remove hash from URL if present
        if (window.location.hash && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
      } catch (e) {
        // Silently fail if history API not available
        console.log('Scroll reset skipped');
      }
    };
    
    // Delay to ensure hydration is complete
    const timer = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}
