
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
      title: "Messaggi",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Oggi in Romagna", 
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
      title: "Esplora Categorie",
      url: "/categories",
      icon: Grid3X3,
    },
    {
      title: "Qualità del Mare",
      url: "/water-quality",
      icon: Droplets,
    },
    {
      title: "Meteo",
      url: "/weather",
      icon: CloudSun,
    },
    {
      title: "Webcam",
      url: "/webcams",
      icon: Camera,
    }
  ];

  // Bottom items
  const bottomItems: MenuItem[] = [
    {
      title: "Impostazioni",
      url: "/settings",
      icon: Settings,
    }
  ];

  const renderMenuSection = (items: MenuItem[], showHeader?: boolean, headerTitle?: string) => (
    <SidebarGroup className={showHeader ? "" : "mt-auto"}>
      {showHeader && (
        <h2 className="mb-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide group-data-[collapsible=icon]:hidden">
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
                className="h-10 hover:bg-gray-200 data-[active=true]:text-white data-[active=true]:bg-[#1e3a8a] data-[active=true]:hover:bg-[#1e40af]"
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

      {/* Area Personale section */}
      {renderMenuSection(channelItems, true, "Area Personale")}

      {/* Settings section */}
      {renderMenuSection(bottomItems)}
    </>
  );
};
