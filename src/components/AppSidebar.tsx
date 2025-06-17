
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
  SidebarFooter,
  SidebarTrigger
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
  TreePine,
  Settings,
  LogOut,
  Grid3X3,
  Droplets,
  CloudSun
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const AppSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  // Menu principale con icone come negli screenshot
  const mainMenuItems = [
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
  const channelItems = [
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
  const bottomItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    }
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white z-[1000] fixed" collapsible="icon">
      <SidebarHeader className="border-b border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-slate-800 group-data-[collapsible=icon]:hidden">ROMAGNA</span>
          </div>
          <SidebarTrigger className="h-6 w-6 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Menu principale */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-10 hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-800"
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

        {/* My Channel section */}
        <SidebarGroup>
          <h2 className="mb-2 px-2 text-sm font-medium text-slate-600 group-data-[collapsible=icon]:hidden">
            My Channel
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              {channelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-10 hover:bg-slate-100 hover:text-slate-800 data-[active=true]:bg-slate-200 data-[active=true]:text-slate-900"
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

        {/* Settings section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-10 hover:bg-slate-100 hover:text-slate-800 data-[active=true]:bg-slate-200 data-[active=true]:text-slate-900"
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
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-2">
        {/* User profile section */}
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">G</span>
          </div>
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-slate-900">giulia</p>
            <p className="text-xs text-slate-500">Vai al profilo</p>
          </div>
        </div>
        
        {/* Social icons */}
        <div className="flex items-center gap-1 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs">I</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center group-data-[collapsible=icon]:hidden">
            <span className="text-white text-xs">f</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center group-data-[collapsible=icon]:hidden">
            <span className="text-white text-xs">G</span>
          </div>
        </div>

        {/* Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="h-10 hover:bg-red-50 hover:text-red-700 text-red-600"
              tooltip="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
