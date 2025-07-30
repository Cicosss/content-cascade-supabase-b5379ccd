import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'button' | 'link' | 'card';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  asChild?: boolean;
}

const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  className,
  variant = 'button',
  size = 'md',
  onClick,
  disabled = false,
  asChild = false
}) => {
  const { isMobile, getTouchTargetClasses } = useMobileOptimization();

  const baseClasses = "relative transition-all duration-200 ease-out";
  
  const variantClasses = {
    button: cn(
      "inline-flex items-center justify-center rounded-md font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      isMobile ? "active:scale-95" : "hover:scale-105"
    ),
    link: cn(
      "inline-flex items-center text-primary underline-offset-4 hover:underline",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    ),
    card: cn(
      "block rounded-lg border bg-card text-card-foreground shadow-sm",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md",
      isMobile ? "active:scale-98" : "hover:scale-102"
    )
  };

  const sizeClasses = {
    sm: isMobile ? "min-h-[40px] min-w-[40px] px-2 py-1 text-sm" : "h-8 px-3 py-2 text-sm",
    md: isMobile ? "min-h-[44px] min-w-[44px] px-3 py-2" : "h-10 px-4 py-2",
    lg: isMobile ? "min-h-[48px] min-w-[48px] px-4 py-3 text-lg" : "h-12 px-6 py-3 text-lg"
  };

  const Component = asChild ? React.Fragment : 'button';
  const componentProps = asChild ? {} : {
    onClick: disabled ? undefined : onClick,
    disabled,
    type: 'button' as const
  };

  const targetClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    getTouchTargetClasses(),
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn((children as React.ReactElement).props.className, targetClasses)
    });
  }

  return (
    <Component
      className={targetClasses}
      {...componentProps}
    >
      {children}
    </Component>
  );
};

export default TouchTarget;