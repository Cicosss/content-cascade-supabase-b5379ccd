import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MobileMenuContent } from './MobileMenuContent';

interface MobileMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileMenuSheet: React.FC<MobileMenuSheetProps> = React.memo(({ isOpen, onOpenChange }) => {
  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="pr-0 bg-slate-900 border-slate-700 z-40 overflow-y-auto w-80" 
        portalContainer={typeof document !== 'undefined' ? document.body : undefined}
      >
        <MobileMenuContent onClose={handleClose} />
      </SheetContent>
    </Sheet>
  );
});

MobileMenuSheet.displayName = 'MobileMenuSheet';