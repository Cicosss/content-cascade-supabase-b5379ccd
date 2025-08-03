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
        className="h-10 hover:bg-gray-200 hover:text-[#1e3a8a] data-[active=true]:text-white data-[active=true]:bg-[#1e3a8a] data-[active=true]:hover:bg-[#1e40af] group-data-[collapsible=icon]:data-[active=true]:bg-transparent group-data-[collapsible=icon]:data-[active=true]:border-l-4 group-data-[collapsible=icon]:data-[active=true]:border-l-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:text-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:pl-3"
        tooltip={isCollapsed ? title : undefined}
      >
        <Link 
          to={url} 
          className="flex items-center gap-3 w-full"
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
            <span className="truncate">{title}</span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

MenuItem.displayName = 'MenuItem';

export { MenuItem };