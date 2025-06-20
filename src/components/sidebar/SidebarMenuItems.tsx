
import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { 
  MessageSquare, 
  Camera,
  Grid3X3,
  Droplets,
  CloudSun,
  Settings,
  Zap,
  LayoutDashboard,
  Trophy
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

const SidebarMenuItems = () => {
  const location = useLocation();

  // Menu principale
  const mainMenuItems: MenuItem[] = [
    {
      title: "Messaggi",
      url: "/dashboard",
      icon: MessageSquare,
    }
  ];

  // My Channel section
  const channelItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Il Mio Passaporto",
      url: "/my-passport",
      icon: Trophy,
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
        <h2 className="mb-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide group-data-[collapsible=icon]:hidden mt-8">
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
                className="h-10 hover:bg-gray-200 data-[active=true]:text-white data-[active=true]:bg-[#1e3a8a] data-[active=true]:hover:bg-[#1e40af] group-data-[collapsible=icon]:data-[active=true]:bg-transparent group-data-[collapsible=icon]:data-[active=true]:border-l-4 group-data-[collapsible=icon]:data-[active=true]:border-l-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:text-[#1e3a8a] group-data-[collapsible=icon]:data-[active=true]:pl-3"
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

  const OggiInRomagnaCard = () => (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 py-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <Link to="/oggi" className="block">
            <div className="relative p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md bg-gradient-to-b from-blue-50 to-white group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:bg-blue-50 group-data-[collapsible=icon]:border-blue-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto">
              
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 animate-pulse group-data-[collapsible=icon]:-top-0.5 group-data-[collapsible=icon]:-right-0.5 group-data-[collapsible=icon]:w-3.5 group-data-[collapsible=icon]:h-3.5 group-data-[collapsible=icon]:text-[9px]" style={{ backgroundColor: '#FF0033' }}>
                7
              </div>
              
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                <Zap className="h-5 w-5 text-blue-800 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" strokeWidth={1.5} />
                <span className="font-bold text-blue-800 group-data-[collapsible=icon]:hidden">
                  Oggi in Romagna
                </span>
              </div>
            </div>
          </Link>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <>
      {renderMenuSection(mainMenuItems)}
      <OggiInRomagnaCard />
      {renderMenuSection(channelItems, true, "Area Personale")}
      {renderMenuSection(bottomItems)}
    </>
  );
};

export { SidebarMenuItems };
