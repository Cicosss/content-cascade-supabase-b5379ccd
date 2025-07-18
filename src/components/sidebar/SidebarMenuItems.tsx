
import React from 'react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { MenuSection } from './MenuSection';
import { OggiCard } from './OggiCard';

const SidebarMenuItems = React.memo(() => {
  const { menuSections, isActive } = useMenuItems();

  return (
    <>
      {menuSections.map((section) => {
        // Render special card for "oggi" section
        if (section.id === 'special') {
          const oggiItem = section.items.find(item => item.id === 'oggi');
          return oggiItem ? (
            <OggiCard key={section.id} badge={oggiItem.badge} />
          ) : null;
        }

        // Render regular menu sections
        return (
          <MenuSection
            key={section.id}
            section={section}
            isActive={isActive}
            showAtBottom={section.id === 'bottom'}
          />
        );
      })}
    </>
  );
});

SidebarMenuItems.displayName = 'SidebarMenuItems';

export { SidebarMenuItems };
