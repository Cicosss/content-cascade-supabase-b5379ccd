import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
  className
}) => {
  const { isMobile } = useMobileOptimization();
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || !isMobile || window.scrollY > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [disabled, isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || disabled || !isMobile) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  }, [isPulling, disabled, isMobile, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [isPulling, disabled, pullDistance, threshold, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = isPulling && pullDistance > 20;

  // Non abilitare su desktop
  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-10",
          "flex items-center justify-center",
          "bg-primary/10 backdrop-blur-sm",
          "transition-all duration-200 ease-out",
          shouldShowIndicator || isRefreshing 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-full"
        )}
        style={{
          height: Math.max(pullDistance * 0.8, isRefreshing ? 60 : 0),
          transform: `translateY(${isPulling ? 0 : isRefreshing ? 0 : '-100%'})`
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <RefreshCw 
            className={cn(
              "h-6 w-6 text-primary transition-transform duration-200",
              isRefreshing && "animate-spin",
              !isRefreshing && progress >= 1 && "rotate-180"
            )}
            style={{
              transform: !isRefreshing ? `rotate(${progress * 180}deg)` : undefined
            }}
          />
          <span className="text-sm text-primary font-medium">
            {isRefreshing 
              ? "Aggiornamento..." 
              : progress >= 1 
                ? "Rilascia per aggiornare" 
                : "Trascina per aggiornare"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${isPulling ? pullDistance * 0.5 : isRefreshing ? 30 : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;