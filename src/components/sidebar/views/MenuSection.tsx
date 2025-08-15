/**
 * PRESENTATIONAL COMPONENT: MenuSection
 * 
 * Responsabilità:
 * - Renderizzazione visual di una sezione menu
 * - Layout e styling della sezione
 * - Gestione header condizionale
 * 
 * Props:
 * - section: Dati della sezione
 * - isActive: Funzione per check stato attivo
 * - showAtBottom: Posizionamento sezione
 */

import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu,
  useSidebar
} from '@/components/ui/sidebar';
import { MenuSection as MenuSectionType } from '@/config/menuConfig';
import { MenuItem } from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
  isActive: (url: string) => boolean;
  showAtBottom?: boolean;
}

const MenuSection = React.memo<MenuSectionProps>(({ 
  section, 
  isActive, 
  showAtBottom = false
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup className={showAtBottom ? "mt-auto" : ""}>
      {/* Header condizionale - nascosto quando collassato */}
      {section.showHeader && !isCollapsed && (
        <h2 className="typography-caption mb-2 px-2 font-medium text-gray-500 uppercase tracking-wide mt-8">
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
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

MenuSection.displayName = 'MenuSection';

export { MenuSection };