import { useState, useRef, useCallback, TouchEvent } from 'react';

interface SwipeGestureOptions {
  threshold?: number;
  preventDefaultTouchMove?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  disabled?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (options: SwipeGestureOptions = {}) => {
  const {
    threshold = 50,
    preventDefaultTouchMove = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    disabled = false
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    const touch = e.targetTouches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;
    setIsSwiping(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !touchStart.current) return;

    if (preventDefaultTouchMove) {
      e.preventDefault();
    }

    const touch = e.targetTouches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [disabled, preventDefaultTouchMove]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;
    
    // Ignore if swipe was too slow (> 500ms)
    if (deltaTime > 500) {
      setIsSwiping(false);
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    setIsSwiping(false);
    touchStart.current = null;
    touchEnd.current = null;
  }, [disabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    swipeHandlers,
    isSwiping
  };
};