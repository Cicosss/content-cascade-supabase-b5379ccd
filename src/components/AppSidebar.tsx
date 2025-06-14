
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Inbox, 
  Calendar,
  LayoutDashboard,
  Grid3X3,
  Droplets,
  Cloud,
  Camera,
  Settings,
  Plus,
  LogOut,
  ArrowLeft,
  User
} from 'lucide-react';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const mainMenuItems = [
    {
      title: "Inbox",
      icon: Inbox,
      url: "/inbox",
    },
    {
      title: "Today",
      icon: Calendar,
      url: "/today",
    },
  ];

  const channelItems = [
    {
      title: "Dashboard",
      icon: ArrowLeft,
      url: user ? "/dashboard" : "/auth",
    },
    {
      title: "Categories",
      icon: Grid3X3,
      url: "/categories",
    },
    {
      title: "Water quality",
      icon: Droplets,
      url: "/water-quality",
    },
    {
      title: "Weather",
      icon: Cloud,
      url: "/weather",
    },
    {
      title: "Webcams",
      icon: Camera,
      url: "/webcams",
    },
  ];

  const bottomItems = [
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
    },
    {
      title: "Link the card",
      icon: Plus,
      url: "/link-card",
    },
  ];

  return (
    <Sidebar 
      className="border-r-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30 shadow-xl shadow-slate-200/50"
      collapsible="icon"
    >
      <SidebarHeader className="p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center space-x-3">
          <SidebarTrigger className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 hover:bg-gradient-to-br hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600" />
          <MiaRomagnaLogo width={48} height={48} className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:shadow-md rounded-xl mx-2 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 text-blue-500" />
                      <span>{item.title}</span>
                      {item.title === "Inbox" && (
                        <ArrowLeft className="h-4 w-4 ml-auto text-slate-400" />
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-gradient-to-r from-transparent via-white/40 to-transparent mx-4" />

        {/* My Channel Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 text-sm font-medium px-3 py-2 group-data-[collapsible=icon]:hidden bg-gradient-to-r from-slate-100/50 to-transparent rounded-lg mx-2">
            My Channel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {channelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:shadow-md rounded-xl mx-2 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      {item.title === "Dashboard" ? (
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                      ) : (
                        <item.icon className="h-5 w-5 text-blue-500" />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-gradient-to-r from-transparent via-white/40 to-transparent mx-4" />

        {/* Bottom Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:shadow-md rounded-xl mx-2 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 text-blue-500" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20 bg-gradient-to-t from-slate-50/80 via-white/40 to-transparent backdrop-blur-sm">
        {user ? (
          <>
            {/* User Profile Avatar (cliccabile e sempre aggiornato) */}
            <a
              href="/profile"
              className="flex items-center space-x-3 mb-4 group-data-[collapsible=icon]:justify-center bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm hover:bg-blue-50/70 transition"
              title="Modifica il profilo"
            >
              <Avatar className="h-12 w-12 ring-2 ring-blue-200/50 shadow-md transition">
                <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-700 font-semibold">
                  {profile?.first_name?.[0] 
                    || user.user_metadata?.first_name?.[0] 
                    || user.email?.[0]?.toUpperCase()
                    || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {profile?.first_name || user.user_metadata?.first_name || 'Utente'}
                </p>
                <p className="text-xs text-slate-500">Vai al profilo</p>
              </div>
            </a>

            {/* Logout */}
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50/80 w-full justify-start rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-red-200/50 hover:shadow-md"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </>
        ) : (
          <>
            {/* Login for guests */}
            <div className="flex items-center space-x-3 mb-4 group-data-[collapsible=icon]:justify-center bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm">
              <Avatar className="h-10 w-10 ring-2 ring-slate-200/50 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Ospite
                </p>
                <p className="text-xs text-slate-500">Non loggato</p>
              </div>
            </div>

            {/* Login Button */}
            <SidebarMenuButton 
              onClick={handleLogin}
              className="text-blue-600 hover:bg-blue-50/80 w-full justify-start rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-blue-200/50 hover:shadow-md"
            >
              <User className="h-5 w-5 text-blue-500" />
              <span className="group-data-[collapsible=icon]:hidden">Accedi</span>
            </SidebarMenuButton>
          </>
        )}

        {/* Social Icons */}
        <div className="flex space-x-3 mt-4 justify-center group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:space-y-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow duration-300 hover:scale-105 transform cursor-pointer backdrop-blur-sm">
            <span className="text-white text-sm font-bold">I</span>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow duration-300 hover:scale-105 transform cursor-pointer backdrop-blur-sm overflow-hidden">
            <img src="https://i.ibb.co/QjzpyXVF/2.png" alt="2" className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow duration-300 hover:scale-105 transform cursor-pointer backdrop-blur-sm">
            <span className="text-white text-sm font-bold">G</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
