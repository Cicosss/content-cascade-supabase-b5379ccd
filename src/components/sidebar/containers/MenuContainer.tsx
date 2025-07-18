
import React from 'react';
import { useMenuState } from '@/contexts/MenuStateContext';
import { MenuRenderer } from '../logic/MenuRenderer';

const MenuContainer = React.memo(() => {
  const { menuSections, isActive, specialItems } = useMenuState();

  return (
    <MenuRenderer
      sections={menuSections}
      isActive={isActive}
      specialItems={specialItems}
    />
  );
});

MenuContainer.displayName = 'MenuContainer';

export { MenuContainer };
