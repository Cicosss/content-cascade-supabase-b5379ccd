
import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { 
  Home, 
  Calendar, 
  Camera,
  Grid3X3,
  Droplets,
  CloudSun,
  Settings
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const SidebarMenuItems = () => {
  const location = useLocation();

  // Menu principale
  const mainMenuItems: MenuItem[] = [
    {
      title: "Inbox",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Today", 
      url: "/events",
      icon: Calendar,
    }
  ];

  // My Channel section
  const channelItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Grid3X3,
    },
    {
      title: "Water quality",
      url: "/water-quality",
      icon: Droplets,
    },
    {
      title: "Weather",
      url: "/weather",
      icon: CloudSun,
    },
    {
      title: "Webcams",
      url: "/webcams",
      icon: Camera,
    }
  ];

  // Bottom items
  const bottomItems: MenuItem[] = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    }
  ];

  const renderMenuSection = (items: MenuItem[], showHeader?: boolean, headerTitle?: string) => (
    <SidebarGroup className={showHeader ? "" : "mt-auto"}>
      {showHeader && (
        <h2 className="mb-2 px-2 text-sm font-medium text-slate-600 group-data-[collapsible=icon]:hidden">
          {headerTitle}
        </h2>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                className="h-10 hover:bg-slate-200 data-[active=true]:text-[#3275F2] data-[active=true]:bg-transparent"
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <>
      {/* Menu principale */}
      {renderMenuSection(mainMenuItems)}

      {/* My Channel section */}
      {renderMenuSection(channelItems, true, "My Channel")}

      {/* Settings section */}
      {renderMenuSection(bottomItems)}
    </>
  );
};
