
import React from 'react';
import { Link } from 'react-router-dom';
import { navigationItems } from '@/constants/navigation';

interface MobileNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigationMenu: React.FC<MobileNavigationMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden py-3 border-t border-slate-700 relative z-popover-custom">
      <nav className="flex flex-col space-y-1">
        {navigationItems.map((item) => (
          <Link 
            key={item.to}
            to={item.to} 
            className="px-4 py-2 text-white hover:text-orange-300 hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium text-sm"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigationMenu;
