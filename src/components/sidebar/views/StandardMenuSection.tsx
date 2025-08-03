
import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu,
  useSidebar
} from '@/components/ui/sidebar';
import { MenuSection } from '@/config/menuConfig';
import { MenuItemView } from './MenuItemView';

interface StandardMenuSectionProps {
  section: MenuSection;
  isActive: (url: string) => boolean;
  showAtBottom?: boolean;
}

const StandardMenuSection = React.memo<StandardMenuSectionProps>(({ 
  section, 
  isActive, 
  showAtBottom 
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup className={showAtBottom ? "mt-auto" : ""}>
      {section.showHeader && (
        <h2 className={`mb-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide mt-8 ${isCollapsed ? 'hidden' : ''}`}>
          {section.title}
        </h2>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item) => (
            <MenuItemView
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

StandardMenuSection.displayName = 'StandardMenuSection';

export { StandardMenuSection };
