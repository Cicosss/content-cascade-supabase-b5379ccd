import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface SwipeableBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: string[]; // e.g., ['25%', '50%', '90%']
  defaultSnapPoint?: number;
  className?: string;
}

export const SwipeableBottomSheet: React.FC<SwipeableBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = ['40%', '90%'],
  defaultSnapPoint = 0,
  className
}) => {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const currentSnapPoint = snapPoints[currentSnapIndex];

  // Handle swipe gestures
  const { swipeHandlers } = useSwipeGestures({
    onSwipeUp: () => {
      if (currentSnapIndex < snapPoints.length - 1) {
        setCurrentSnapIndex(currentSnapIndex + 1);
      }
    },
    onSwipeDown: () => {
      if (currentSnapIndex > 0) {
        setCurrentSnapIndex(currentSnapIndex - 1);
      } else {
        onClose();
      }
    },
    threshold: 30
  });

  // Handle touch events for drag
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;
    const threshold = 100;

    if (deltaY > threshold) {
      // Swipe down
      if (currentSnapIndex > 0) {
        setCurrentSnapIndex(currentSnapIndex - 1);
      } else {
        onClose();
      }
    } else if (deltaY < -threshold) {
      // Swipe up
      if (currentSnapIndex < snapPoints.length - 1) {
        setCurrentSnapIndex(currentSnapIndex + 1);
      }
    }
  };

  // Calculate transform based on drag
  const getTransform = () => {
    if (!isDragging) return `translateY(${isOpen ? '0' : '100%'})`;
    
    const deltaY = Math.max(0, currentY - startY);
    return `translateY(${deltaY}px)`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[5000] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[5001]",
          "bg-background rounded-t-2xl shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          "max-h-[95vh] overflow-hidden",
          className
        )}
        style={{
          height: currentSnapPoint,
          transform: getTransform(),
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div
          ref={dragHandleRef}
          className="flex flex-col items-center py-4 cursor-grab active:cursor-grabbing touch-manipulation"
          {...swipeHandlers}
        >
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mb-2" />
          
          {title && (
            <div className="flex items-center justify-between w-full px-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                aria-label="Chiudi"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {children}
        </div>

        {/* Snap Point Indicators */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          {snapPoints.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                currentSnapIndex === index 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() => setCurrentSnapIndex(index)}
              aria-label={`Snap to ${snapPoints[index]}`}
            >
              {index === 0 ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SwipeableBottomSheet;