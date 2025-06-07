
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle,
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

const AppSidebar = () => {
  const { user, signOut } = useAuth();
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
      className="border-r border-slate-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      collapsible="icon"
    >
      <SidebarHeader className="p-6 bg-gradient-to-r from-blue-50/50 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900 group-data-[collapsible=icon]:hidden">Board</span>
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
                    className="text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 rounded-lg mx-2 transition-all duration-200"
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

        <SidebarSeparator className="bg-slate-200/60" />

        {/* My Channel Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-sm font-medium px-3 py-2 group-data-[collapsible=icon]:hidden">
            My Channel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {channelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 rounded-lg mx-2 transition-all duration-200"
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

        <SidebarSeparator className="bg-slate-200/60" />

        {/* Bottom Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 rounded-lg mx-2 transition-all duration-200"
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

      <SidebarFooter className="p-4 border-t border-slate-200/60 bg-gradient-to-t from-slate-50/50 to-transparent">
        {user ? (
          <>
            {/* User Profile */}
            <div className="flex items-center space-x-3 mb-4 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                  {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.user_metadata?.first_name || 'Giulia M.'}
                </p>
                <p className="text-xs text-slate-500">Click to go</p>
              </div>
            </div>

            {/* Logout */}
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50/70 w-full justify-start rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </>
        ) : (
          <>
            {/* Login for guests */}
            <div className="flex items-center space-x-3 mb-4 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-slate-200">
                <AvatarFallback className="bg-slate-100">
                  <User className="h-5 w-5 text-slate-600" />
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
              className="text-blue-600 hover:bg-blue-50/70 w-full justify-start rounded-lg transition-all duration-200"
            >
              <User className="h-5 w-5 text-blue-500" />
              <span className="group-data-[collapsible=icon]:hidden">Accedi</span>
            </SidebarMenuButton>
          </>
        )}

        {/* Social Icons */}
        <div className="flex space-x-3 mt-4 justify-center group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:space-y-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-white text-sm font-bold">I</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-white text-sm font-bold">f</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-white text-sm font-bold">G</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
