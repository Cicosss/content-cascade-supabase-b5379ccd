
import React from 'react';
import { SidebarFooter as BaseSidebarFooter } from '@/components/ui/sidebar';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export const SidebarFooter = () => {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
  };

  const handleProfileSettings = () => {
    navigate('/profile');
  };

  return (
    <BaseSidebarFooter className="border-t border-slate-200 p-2 bg-[#F8F9FA]">
      {/* Profile dropdown section - solo quando aperta */}
      <div className="group-data-[collapsible=icon]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar utente" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500">
                  <User className="h-5 w-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {profile?.first_name || 'giulia'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Promotore Bronzo
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 rounded-lg border border-slate-300 shadow-lg bg-white z-50"
          >
            <DropdownMenuItem 
              onClick={handleProfileSettings}
              className="rounded-md hover:bg-gray-100 cursor-pointer text-slate-700 focus:bg-gray-100 focus:text-slate-700"
            >
              <Settings className="h-4 w-4 mr-3 text-slate-500" />
              Impostazioni Profilo
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar solo quando compressa */}
      <div className="group-data-[collapsible=icon]:block hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-center p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar utente" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500">
                  <User className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 rounded-lg border border-slate-300 shadow-lg bg-white z-50"
          >
            <DropdownMenuItem 
              onClick={handleProfileSettings}
              className="rounded-md hover:bg-gray-100 cursor-pointer text-slate-700 focus:bg-gray-100 focus:text-slate-700"
            >
              <Settings className="h-4 w-4 mr-3 text-slate-500" />
              Impostazioni Profilo
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </BaseSidebarFooter>
  );
};
