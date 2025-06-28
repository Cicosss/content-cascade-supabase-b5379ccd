
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_CONFIG, MenuItem, MenuSection } from '@/config/menuConfig';

export const useMenuItems = () => {
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

  return {
    menuSections,
    isActive,
    activeSection,
    currentPath
  };
};
