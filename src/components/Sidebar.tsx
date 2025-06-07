
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
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
  Mountain,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Today",
    url: "/dashboard",
    icon: Calendar,
  },
];

const channelItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
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
    icon: Cloud,
  },
  {
    title: "Webcams",
    url: "/webcams",
    icon: Camera,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center">
            <Mountain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Board</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                className="w-full justify-start"
              >
                <button
                  onClick={() => navigate(item.url)}
                  className="flex items-center space-x-3 px-3 py-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator className="my-4" />

        <div className="px-3 py-2">
          <h3 className="text-sm font-medium text-gray-500 mb-3">My Channel</h3>
          <SidebarMenu>
            {channelItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className="w-full justify-start"
                >
                  <button
                    onClick={() => navigate(item.url)}
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        <SidebarSeparator className="my-4" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <button
                onClick={() => navigate('/link-card')}
                className="flex items-center space-x-3 px-3 py-2"
              >
                <Plus className="h-4 w-4" />
                <span>Link the card</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {user && (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.first_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">Click to go</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>

        <div className="flex justify-center space-x-4 pt-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">IG</span>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">f</span>
          </div>
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
