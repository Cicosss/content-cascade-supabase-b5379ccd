
import { useState, useEffect, useRef } from 'react';

interface UseServiceVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useServiceVisibility = (options: UseServiceVisibilityOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnetti l'observer una volta che l'elemento è visibile
          // per ottimizzare le performance
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { isVisible, elementRef };
};
