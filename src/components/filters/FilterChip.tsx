
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'default' | 'category' | 'preference' | 'budget';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const FilterChip = React.memo<FilterChipProps>(({ 
  label, 
  icon, 
  isSelected, 
  onClick, 
  variant = 'default',
  size = 'sm',
  disabled = false,
  className 
}) => {
  const getVariantClasses = () => {
    const baseClasses = "typography-small font-medium transition-all duration-200 border-2";
    
    switch (variant) {
      case 'category':
        return isSelected
          ? `${baseClasses} bg-blue-900 border-blue-900 text-white hover:bg-blue-800 hover:border-blue-800 shadow-md`
          : `${baseClasses} bg-white border-blue-900 text-blue-900 hover:bg-blue-50 hover:border-blue-800`;
      
      case 'preference':
        return isSelected
          ? `${baseClasses} bg-purple-500 border-purple-500 text-white hover:bg-purple-600 shadow-md`
          : `${baseClasses} bg-white border-purple-500 text-purple-500 hover:bg-purple-50 hover:border-purple-600`;
      
      case 'budget':
        return isSelected
          ? `${baseClasses} bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 shadow-md`
          : `${baseClasses} bg-white border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-600`;
      
      default:
        return isSelected
          ? `${baseClasses} bg-slate-900 border-slate-900 text-white hover:bg-slate-800 shadow-md`
          : `${baseClasses} bg-white border-slate-900 text-slate-900 hover:bg-slate-50 hover:border-slate-800`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'typography-body px-6 py-3 rounded-lg';
      case 'md':
        return 'typography-small px-4 py-2 rounded-lg';
      case 'sm':
      default:
        return 'typography-caption px-3 py-1.5 rounded-md';
    }
  };

  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        getVariantClasses(),
        getSizeClasses(),
        'flex items-center justify-center gap-2 text-center min-h-[2.5rem]',
        // Allow text wrapping on small sizes (mobile)
        size === 'sm' ? 'whitespace-normal break-words' : 'whitespace-nowrap',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-pressed={isSelected}
      role="button"
    >
      {icon && <span className="text-sm flex-shrink-0">{icon}</span>}
      <span className="leading-tight">{label}</span>
    </Button>
  );
});

FilterChip.displayName = 'FilterChip';

export default FilterChip;
