
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  Home, 
  Calendar, 
  Users, 
  Heart,
  User,
  Camera,
  MapPin,
  Route,
  Map,
  Crown,
  Utensils,
  Building2,
  Music,
  TreePine
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const AppSidebar = () => {
  const location = useLocation();

  // Macro-Aree principali
  const macroAreas = [
    {
      title: "Gusto & Sapori",
      url: "/gusto-sapori",
      icon: Utensils,
      description: "Tradizioni culinarie"
    },
    {
      title: "Cultura & Territorio", 
      url: "/cultura-territorio",
      icon: Building2,
      description: "Arte e storia"
    },
    {
      title: "Eventi & Spettacoli",
      url: "/eventi-spettacoli", 
      icon: Music,
      description: "Intrattenimento"
    },
    {
      title: "Divertimento & Famiglia",
      url: "/divertimento-famiglia",
      icon: TreePine,
      description: "Attività per tutti"
    }
  ];

  // Menu secondario
  const secondaryItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Eventi",
      url: "/events",
      icon: Calendar,
    },
    {
      title: "Preferiti",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Itinerari",
      url: "/itineraries",
      icon: Route,
    }
  ];

  // Menu utilità
  const utilityItems = [
    {
      title: "Webcam",
      url: "/webcams",
      icon: Camera,
    },
    {
      title: "Partner",
      url: "/partner",
      icon: Crown,
    },
    {
      title: "Chi Siamo",
      url: "/chi-siamo",
      icon: Users,
    },
    {
      title: "Profilo",
      url: "/profile",
      icon: User,
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white" collapsible="icon">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <MiaRomagnaLogo width={120} height={40} />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Macro-Aree Principali */}
        <SidebarGroup>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
            Esplora
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {macroAreas.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-12 group-data-[collapsible=icon]:h-10"
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex flex-col items-start group-data-[collapsible=icon]:flex-row group-data-[collapsible=icon]:items-center">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-7 group-data-[collapsible=icon]:hidden">
                        {item.description}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Secondario */}
        <SidebarGroup>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
            La Tua Esperienza
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Utilità */}
        <SidebarGroup>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
            Altro
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-2">
        <div className="text-xs text-slate-500 text-center group-data-[collapsible=icon]:hidden">
          MiaRomagna © 2024
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
