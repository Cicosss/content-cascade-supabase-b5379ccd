
import React from 'react';
import { Link } from 'react-router-dom';
import { navigationItems } from '@/constants/navigation';

const NavigationMenu = React.memo(() => {
  return (
    <nav 
      className="hidden lg:flex items-center space-x-1"
      role="navigation"
      aria-label="Menu di navigazione principale"
    >
      {navigationItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className="px-4 py-2 text-white hover:text-orange-300 hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-800"
          tabIndex={0}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
