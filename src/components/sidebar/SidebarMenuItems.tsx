
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
  Settings,
  Zap
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useDailyEventsCount } from '@/hooks/useDailyEventsCount';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const SidebarMenuItems = () => {
  const location = useLocation();
  const { count: dailyEventsCount } = useDailyEventsCount();

  // Menu principale
  const mainMenuItems: MenuItem[] = [
    {
      title: "Messaggi",
      url: "/dashboard",
      icon: Home,
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

      {/* Oggi in Romagna Card */}
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 py-2">
            <Link 
              to="/events" 
              className="block relative"
            >
              <div 
                className="relative p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group-data-[collapsible=icon]:p-2"
                style={{
                  background: 'linear-gradient(to bottom, #EBF5FF, #FFFFFF)'
                }}
              >
                {/* Badge */}
                {dailyEventsCount > 0 && (
                  <div 
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1"
                    style={{ backgroundColor: '#F59E0B' }}
                  >
                    {dailyEventsCount}
                  </div>
                )}
                
                {/* Content */}
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                  <Zap className="h-5 w-5 text-blue-800" strokeWidth={1.5} />
                  <span className="font-bold text-blue-800 group-data-[collapsible=icon]:hidden">
                    Oggi in Romagna
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Area Personale section */}
      {renderMenuSection(channelItems, true, "Area Personale")}

      {/* Settings section */}
      {renderMenuSection(bottomItems)}
    </>
  );
};
