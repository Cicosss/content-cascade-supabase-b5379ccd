
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = () => {
  const navigationItems = [
    { to: "/gusto-sapori", label: "Gusto & Sapori" },
    { to: "/cultura-territorio", label: "Cultura & Territorio" },
    { to: "/eventi-spettacoli", label: "Eventi & Spettacoli" },
    { to: "/divertimento-famiglia", label: "Divertimento & Famiglia" }
  ];

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
