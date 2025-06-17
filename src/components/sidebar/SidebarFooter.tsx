
import React from 'react';
import { SidebarFooter as BaseSidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const SidebarFooter = () => {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const handleLogout = () => {
    signOut();
  };

  return (
    <BaseSidebarFooter className="border-t border-slate-200 p-2 bg-[#F8F9FA]">
      {/* User profile section - solo quando aperta */}
      <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:hidden">
        <Avatar className="w-8 h-8">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar utente" />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500">
            <User className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {profile?.first_name || 'giulia'}
          </p>
          <p className="text-xs text-slate-500">Vai al profilo</p>
        </div>
      </div>
      
      {/* Social icons - solo quando aperta */}
      <div className="flex items-center gap-1 px-2 group-data-[collapsible=icon]:hidden">
        <img 
          src="https://i.ibb.co/Lbvqk8V/Progetto-senza-titolo-5.png" 
          alt="Instagram" 
          className="w-8 h-8 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
        />
        <img 
          src="https://i.ibb.co/3ythJs2P/Progetto-senza-titolo-4.png" 
          alt="Facebook" 
          className="w-8 h-8 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
        />
        <img 
          src="https://i.ibb.co/BHdw3VJd/Progetto-senza-titolo.png" 
          alt="LinkedIn" 
          className="w-8 h-8 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Logout */}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={handleLogout}
            className="h-10 hover:bg-red-100 hover:text-red-700 text-red-600"
            tooltip="Logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </BaseSidebarFooter>
  );
};
