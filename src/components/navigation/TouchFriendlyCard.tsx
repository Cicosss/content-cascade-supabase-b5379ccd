import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ExternalLink } from 'lucide-react';

interface TouchFriendlyCardProps {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  showActions?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onShare?: () => void;
  href?: string;
}

export const TouchFriendlyCard: React.FC<TouchFriendlyCardProps> = ({
  children,
  className,
  onTap,
  onDoubleTap,
  onLongPress,
  showActions = false,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
  href
}) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [lastTap, setLastTap] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();
    setTouchStart(now);
    setIsPressed(true);

    // Long press detection
    const timer = setTimeout(() => {
      onLongPress?.();
      setIsPressed(false);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const touchDuration = now - touchStart;
    setIsPressed(false);

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Ignore if it was a long press
    if (touchDuration >= 500) return;

    // Double tap detection
    const timeSinceLastTap = now - lastTap;
    if (timeSinceLastTap < 300 && timeSinceLastTap > 50) {
      onDoubleTap?.();
      setLastTap(0); // Reset to prevent triple tap
    } else {
      setLastTap(now);
      // Single tap with delay to check for double tap
      setTimeout(() => {
        if (lastTap === now) {
          onTap?.();
        }
      }, 300);
    }
  };

  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      onTap?.();
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        "transition-all duration-200 ease-out touch-manipulation",
        "hover:shadow-md hover:scale-[1.02]",
        "active:scale-[0.98] active:shadow-sm",
        isPressed ? "scale-[0.98] shadow-sm" : "",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTap?.();
        }
      }}
    >
      {children}

      {/* Touch feedback overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-primary/5 transition-opacity duration-200",
          isPressed ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Action buttons overlay */}
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-1">
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 bg-white/90 hover:bg-white shadow-sm",
                isFavorite ? "text-red-500" : "text-slate-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle();
              }}
              aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "fill-current" : "")} />
            </Button>
          )}
          
          {onShare && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              aria-label="Condividi"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}

          {href && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                window.open(href, '_blank', 'noopener,noreferrer');
              }}
              aria-label="Apri link esterno"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TouchFriendlyCard;