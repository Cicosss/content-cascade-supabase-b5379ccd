
import React from 'react';
import { Link } from 'react-router-dom';
import { navigationItems } from '@/constants/navigation';

const NavigationMenu = () => {
  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navigationItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className="px-4 py-2 text-white hover:text-orange-300 hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium text-sm"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
