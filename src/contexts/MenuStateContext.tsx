
import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_CONFIG, MenuSection } from '@/config/menuConfig';

interface MenuStateContextType {
  // Data
  menuSections: MenuSection[];
  currentPath: string;
  
  // Computed State
  isActive: (url: string) => boolean;
  activeSection: string | null;
  
  // Special Items
  specialItems: {
    oggi?: {
      badge?: number;
    };
  };
}

const MenuStateContext = createContext<MenuStateContextType | undefined>(undefined);

export const useMenuState = () => {
  const context = useContext(MenuStateContext);
  if (!context) {
    throw new Error('useMenuState must be used within MenuStateProvider');
  }
  return context;
};

interface MenuStateProviderProps {
  children: React.ReactNode;
}

export const MenuStateProvider: React.FC<MenuStateProviderProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuSections = useMemo(() => MENU_CONFIG, []);

  const isActive = useMemo(() => (url: string) => {
    return currentPath === url;
  }, [currentPath]);

  const activeSection = useMemo(() => {
    for (const section of menuSections) {
      const activeItem = section.items.find(item => isActive(item.url));
      if (activeItem) {
        return section.id;
      }
    }
    return null;
  }, [menuSections, isActive]);

  const specialItems = useMemo(() => {
    const specialSection = menuSections.find(section => section.id === 'special');
    const oggiItem = specialSection?.items.find(item => item.id === 'oggi');
    
    return {
      oggi: oggiItem ? {
        badge: oggiItem.badge
      } : undefined
    };
  }, [menuSections]);

  const value: MenuStateContextType = {
    menuSections,
    currentPath,
    isActive,
    activeSection,
    specialItems,
  };

  return (
    <MenuStateContext.Provider value={value}>
      {children}
    </MenuStateContext.Provider>
  );
};
