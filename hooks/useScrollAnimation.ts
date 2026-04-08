'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function useScrollAnimationGroup(
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('[data-animate-item]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-animate-index') || '0');
          
          if (entry.isIntersecting) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [itemCount, threshold, rootMargin, triggerOnce]);

  return { containerRef, visibleItems };
}
