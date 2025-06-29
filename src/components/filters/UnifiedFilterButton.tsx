
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnifiedFilterButtonProps {
  label: string;
  icon: React.ComponentType<any>;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const UnifiedFilterButton = React.memo<UnifiedFilterButtonProps>(({ 
  label, 
  icon: Icon,
  isSelected, 
  onClick, 
  disabled = false,
  className 
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
        isSelected
          ? 'bg-blue-900 text-white hover:bg-blue-800'
          : 'bg-gray-50 text-blue-900 hover:bg-gray-100 border border-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      variant="ghost"
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      <span>{label}</span>
    </Button>
  );
});

UnifiedFilterButton.displayName = 'UnifiedFilterButton';

export default UnifiedFilterButton;
