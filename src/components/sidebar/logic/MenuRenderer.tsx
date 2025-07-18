
import React from 'react';
import { MenuSection } from '@/config/menuConfig';
import { StandardMenuSection } from '../views/StandardMenuSection';
import { SpecialMenuCard } from '../views/SpecialMenuCard';

interface MenuRendererProps {
  sections: MenuSection[];
  isActive: (url: string) => boolean;
  specialItems: {
    oggi?: {
      badge?: number;
    };
  };
}

const MenuRenderer = React.memo<MenuRendererProps>(({ sections, isActive, specialItems }) => {
  return (
    <>
      {sections.map((section) => {
        // Render special card for "oggi" section
        if (section.id === 'special' && specialItems.oggi?.badge) {
          return (
            <SpecialMenuCard
              key={section.id}
              badge={specialItems.oggi.badge}
            />
          );
        }

        // Render regular menu sections
        return (
          <StandardMenuSection
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

MenuRenderer.displayName = 'MenuRenderer';

export { MenuRenderer };
