'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Force scroll to top on page load/reload
    if (typeof window !== 'undefined') {
      // Remove any hash from URL
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Also reset scroll behavior after a short delay to ensure hydration is complete
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
