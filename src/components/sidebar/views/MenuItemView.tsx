
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { MenuItem as MenuItemType } from '@/config/menuConfig';
import { BadgeView } from './BadgeView';

interface MenuItemViewProps {
  item: MenuItemType;
  isActive: boolean;
}

const MenuItemView = React.memo<MenuItemViewProps>(({ item, isActive }) => {
  const { icon: Icon, title, url, badge } = item;
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
          <div className="relative flex-shrink-0">
            <Icon className="h-5 w-5 transition-all duration-200 hover:animate-pulse" />
            {badge && !isCollapsed && (
              <BadgeView 
                count={badge}
                isCollapsed={isCollapsed}
                label={`${badge} notifiche`}
              />
            )}
          </div>
          {!isCollapsed && <span className="truncate">{title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

MenuItemView.displayName = 'MenuItemView';

export { MenuItemView };
