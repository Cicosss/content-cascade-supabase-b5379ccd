
import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu
} from '@/components/ui/sidebar';
import { MenuItem } from './MenuItem';
import { MenuSection as MenuSectionType } from '@/config/menuConfig';

interface MenuSectionProps {
  section: MenuSectionType;
  isActive: (url: string) => boolean;
  showAtBottom?: boolean;
}

const MenuSection = React.memo<MenuSectionProps>(({ section, isActive, showAtBottom }) => {
  return (
    <SidebarGroup className={showAtBottom ? "mt-auto" : ""}>
      {section.showHeader && (
        <h2 className="mb-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide group-data-[collapsible=icon]:hidden mt-8">
          {section.title}
        </h2>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={isActive(item.url)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

MenuSection.displayName = 'MenuSection';

export { MenuSection };
