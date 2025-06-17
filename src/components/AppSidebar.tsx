
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
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
    <Sidebar 
      className="border-r border-slate-200 fixed left-0 top-16 h-[calc(100vh-4rem)]" 
      style={{ zIndex: 1000, position: 'fixed' }}
    >
      <SidebarContent>
        {/* Macro-Aree Principali */}
        <SidebarGroup>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-slate-900">
            Esplora
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {macroAreas.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-12"
                  >
                    <Link to={item.url} className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-7">
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
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-slate-900">
            La Tua Esperienza
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Utilità */}
        <SidebarGroup>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-slate-900">
            Altro
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
