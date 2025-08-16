import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseScrollStateProps {
  threshold?: number;
  debounceMs?: number;
}

interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  isVisible: boolean;
}

// Shared scroll state hook to prevent duplicate listeners
export const useScrollState = ({ 
  threshold = 50, 
  debounceMs = 16 
}: UseScrollStateProps = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Debounce scroll updates for performance
  const debouncedScrollY = useDebounce(scrollY, debounceMs);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.pageYOffset;
    setScrollY(currentScrollY);
  }, []);

  useEffect(() => {
    // Update states based on debounced scroll value
    setIsScrolled(debouncedScrollY > threshold);
    setIsVisible(debouncedScrollY > threshold * 6); // ScrollToTop appears later
  }, [debouncedScrollY, threshold]);

  useEffect(() => {
    // Single optimized scroll listener with passive flag
    const optimizedHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', optimizedHandleScroll, { passive: true });
    
    // Set initial values
    handleScroll();

    return () => {
      window.removeEventListener('scroll', optimizedHandleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return {
    isScrolled,
    scrollY: debouncedScrollY,
    isVisible,
    scrollToTop
  };
};