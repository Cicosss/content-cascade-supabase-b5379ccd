
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem as MenuItemType } from '@/config/menuConfig';

interface MenuItemProps {
  item: MenuItemType;
  isActive: boolean;
  isCollapsed?: boolean;
}

const MenuItem = React.memo<MenuItemProps>(({ item, isActive, isCollapsed }) => {
  const { icon: Icon, title, url, badge } = item;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className="h-10 hover:bg-gray-200 data-[active=true]:text-white data-[active=true]:bg-[#1e3a8a] data-[active=true]:hover:bg-[#1e40af] group-data-[collapsible=icon]:data-[active=true]:bg-transparent group-data-[collapsible=icon]:data-[active=true]:border-l-4 group-data-[collapsible=icon]:data-[active=true]:border-l-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:text-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:pl-3"
        tooltip={title}
      >
        <Link 
          to={url} 
          className="flex items-center gap-3 w-full"
          aria-label={`Naviga a ${title}`}
        >
          <div className="relative">
            <Icon className="h-5 w-5" />
            {badge && (
              <div 
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:-right-1 group-data-[collapsible=icon]:w-3.5 group-data-[collapsible=icon]:h-3.5 group-data-[collapsible=icon]:text-[9px]" 
                style={{ backgroundColor: '#FF0033' }}
                aria-label={`${badge} notifiche`}
              >
                {badge}
              </div>
            )}
          </div>
          <span className="group-data-[collapsible=icon]:hidden">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

MenuItem.displayName = 'MenuItem';

export { MenuItem };
