/**
 * SHARED PRESENTATIONAL COMPONENT: Badge
 * 
 * Responsabilità:
 * - Renderizzazione badge numerici
 * - Sizing responsivo (small/medium/large)
 * - Accessibilità con aria-label
 * - Styling consistente
 * 
 * Props:
 * - count: Numero da mostrare
 * - size: Dimensione del badge
 * - label: Label per screen readers
 * - variant: Stile del badge (default/warning/error)
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  variant?: 'default' | 'warning' | 'error';
}

const Badge = React.memo<BadgeProps>(({ 
  count, 
  size = 'medium', 
  label,
  variant = 'error'
}) => {
  const baseClasses = "absolute bg-red-600 rounded-full flex items-center justify-center text-white font-bold animate-pulse";
  
  const sizeClasses = {
    small: "-top-1 -right-1 w-3.5 h-3.5 text-[9px]",
    medium: "-top-2 -right-2 w-5 h-5 text-xs",
    large: "-top-2 -right-2 w-6 h-6 text-sm"
  };

  const variantClasses = {
    default: "bg-blue-600",
    warning: "bg-yellow-600", 
    error: "bg-red-600"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant]
      )}
      aria-label={label || `${count} notifiche`}
      role="status"
      aria-live="polite"
    >
      {count > 99 ? '99+' : count}
    </div>
  );
});

Badge.displayName = 'Badge';

export { Badge };