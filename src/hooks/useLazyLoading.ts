import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface LazyLoadingState {
  isIntersecting: boolean;
  hasLoaded: boolean;
  isLoading: boolean;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    enabled = true
  } = options;

  const [state, setState] = useState<LazyLoadingState>({
    isIntersecting: false,
    hasLoaded: false,
    isLoading: false
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  const startLoading = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
  }, []);

  const finishLoading = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      hasLoaded: true 
    }));
  }, []);

  const resetLoading = useCallback(() => {
    setState({
      isIntersecting: false,
      hasLoaded: false,
      isLoading: false
    });
  }, []);

  useEffect(() => {
    if (!enabled || !elementRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(prev => ({
          ...prev,
          isIntersecting: entry.isIntersecting
        }));
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(elementRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, threshold, rootMargin]);

  return {
    ref: setRef,
    isIntersecting: state.isIntersecting,
    hasLoaded: state.hasLoaded,
    isLoading: state.isLoading,
    shouldLoad: state.isIntersecting && !state.hasLoaded && !state.isLoading,
    startLoading,
    finishLoading,
    resetLoading
  };
};

// Hook specifico per immagini lazy loading
export const useLazyImage = (src: string, options: UseLazyLoadingOptions = {}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  
  const {
    ref,
    shouldLoad,
    isLoading,
    hasLoaded,
    startLoading,
    finishLoading
  } = useLazyLoading(options);

  useEffect(() => {
    if (shouldLoad && src) {
      startLoading();
      
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImageError(false);
        finishLoading();
      };
      img.onerror = () => {
        setImageError(true);
        finishLoading();
      };
      img.src = src;
    }
  }, [shouldLoad, src, startLoading, finishLoading]);

  return {
    ref,
    src: imageSrc,
    isLoading,
    hasLoaded,
    error: imageError,
    placeholder: !imageSrc && !imageError
  };
};