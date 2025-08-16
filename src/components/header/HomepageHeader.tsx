import React from 'react';
import { cn } from '@/lib/utils';
import { HomepageNavbar } from './homepage/HomepageNavbar';

interface HomepageHeaderProps {
  className?: string;
}

export const HomepageHeader: React.FC<HomepageHeaderProps> = React.memo(({ className }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-header w-full",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <HomepageNavbar />
    </header>
  );
});

HomepageHeader.displayName = 'HomepageHeader';