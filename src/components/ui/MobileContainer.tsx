import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'tight' | 'wide';
  paddingTop?: 'none' | 'sm' | 'md' | 'lg';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg';
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  variant = 'default',
  paddingTop = 'md',
  paddingBottom = 'md'
}) => {
  const variantClasses = {
    default: 'px-3 md:px-4 lg:px-6 max-w-screen-2xl mx-auto',
    tight: 'px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto',
    wide: 'px-2 md:px-4 lg:px-6 max-w-full'
  };

  const paddingTopClasses = {
    none: '',
    sm: 'pt-2 md:pt-3',
    md: 'pt-4 md:pt-6 lg:pt-8',
    lg: 'pt-6 md:pt-8 lg:pt-12'
  };

  const paddingBottomClasses = {
    none: '',
    sm: 'pb-2 md:pb-3',
    md: 'pb-4 md:pb-6 lg:pb-8',
    lg: 'pb-6 md:pb-8 lg:pb-12'
  };

  return (
    <div className={cn(
      variantClasses[variant],
      paddingTopClasses[paddingTop],
      paddingBottomClasses[paddingBottom],
      className
    )}>
      {children}
    </div>
  );
};

export default MobileContainer;