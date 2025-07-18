
import React from 'react';

interface BadgeViewProps {
  count: number;
  isCollapsed?: boolean;
  label?: string;
}

const BadgeView = React.memo<BadgeViewProps>(({ count, isCollapsed = false, label }) => {
  const baseClasses = "absolute bg-red-600 rounded-full flex items-center justify-center text-white font-bold animate-pulse";
  const collapsedClasses = isCollapsed 
    ? "-top-1 -right-1 w-3.5 h-3.5 text-[9px]"
    : "-top-2 -right-2 w-5 h-5 text-xs";

  return (
    <div 
      className={`${baseClasses} ${collapsedClasses}`}
      aria-label={label}
    >
      {count}
    </div>
  );
});

BadgeView.displayName = 'BadgeView';

export { BadgeView };
