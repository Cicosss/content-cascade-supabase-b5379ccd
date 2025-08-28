/**
 * PRESENTATIONAL COMPONENT: MenuItem
 * 
 * Responsabilità:
 * - Renderizzazione singolo item menu
 * - Gestione stato attivo/inattivo
 * - Tooltip per modalità collassata
 * - Badge notifications
 * 
 * Props:
 * - item: Dati dell'item (icon, title, url, badge)
 * - isActive: Stato attivo
 * - isCollapsed: Stato sidebar
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem as MenuItemType } from '@/config/menuConfig';
import { Badge } from '../shared/Badge';

interface MenuItemProps {
  item: MenuItemType;
  isActive: boolean;
  isCollapsed: boolean;
}

const MenuItem = React.memo<MenuItemProps>(({ item, isActive, isCollapsed }) => {
  const { icon: Icon, title, url, badge } = item;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={`h-10 hover:bg-muted hover:text-primary data-[active=true]:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:hover:bg-primary/90 group-data-[collapsible=icon]:data-[active=true]:bg-transparent group-data-[collapsible=icon]:data-[active=true]:border-l-4 group-data-[collapsible=icon]:data-[active=true]:border-l-primary group-data-[collapsible=icon]:data-[active=true]:text-primary group-data-[collapsible=icon]:data-[active=true]:pl-3 ${isCollapsed ? 'justify-center px-0' : ''}`}
        tooltip={isCollapsed ? title : undefined}
      >
        <Link 
          to={url} 
          className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          aria-label={`Naviga a ${title}`}
        >
          {/* Icon Container con badge */}
          <div className="relative flex-shrink-0">
            <Icon className="h-5 w-5 transition-all duration-200 hover:animate-pulse" />
            {badge && !isCollapsed && (
              <Badge 
                count={badge}
                size="small"
                label={`${badge} notifiche`}
              />
            )}
          </div>
          
          {/* Title - nascosto quando collassato */}
          {!isCollapsed && (
            <span className="typography-small truncate">{title}</span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

MenuItem.displayName = 'MenuItem';

export { MenuItem };