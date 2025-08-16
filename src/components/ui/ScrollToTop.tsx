import React, { memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useScrollState } from '@/hooks/useScrollState';
import { Z_INDEX } from '@/config/zIndex';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  className 
}) => {
  const { isMobile } = useMobileOptimization();
  const { isVisible, scrollToTop } = useScrollState({ threshold: 300 });

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size={isMobile ? "lg" : "default"}
      className={cn(
        `fixed z-[${Z_INDEX.scrollToTop}] rounded-full shadow-lg`,
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