import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuTriggerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const MobileMenuTrigger: React.FC<MobileMenuTriggerProps> = React.memo(({ onClick, isOpen }) => {
  return (
    <Button
      variant="ghost"
      size="touch"
      onClick={onClick}
      className="text-base hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white hover:text-white transition-all duration-300 active:scale-95 relative group touch-manipulation min-h-[44px] min-w-[44px]"
      aria-label="Apri menu di navigazione"
      style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
    >
      <Menu className={`h-7 w-7 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:rotate-90'}`} />
    </Button>
  );
});

MobileMenuTrigger.displayName = 'MobileMenuTrigger';