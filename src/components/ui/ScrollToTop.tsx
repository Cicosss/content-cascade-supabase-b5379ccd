import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  threshold = 300,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useMobileOptimization();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > threshold);
    };

    const handleScroll = () => {
      requestAnimationFrame(toggleVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size={isMobile ? "lg" : "default"}
      className={cn(
        "fixed z-50 rounded-full shadow-lg",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 active:scale-95",
        "transition-all duration-300",
        isMobile 
          ? "bottom-20 right-4 h-14 w-14" 
          : "bottom-8 right-8 h-12 w-12",
        "animate-fade-in",
        className
      )}
      aria-label="Torna all'inizio"
    >
      <ArrowUp className={isMobile ? "h-6 w-6" : "h-5 w-5"} />
    </Button>
  );
};

export default ScrollToTop;