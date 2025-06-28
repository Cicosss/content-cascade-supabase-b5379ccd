
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle = React.memo<MobileMenuToggleProps>(({ isOpen, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden p-2 hover:bg-slate-700 rounded-lg text-white hover:text-orange-300"
      onClick={onToggle}
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
});

MobileMenuToggle.displayName = 'MobileMenuToggle';

export default MobileMenuToggle;
