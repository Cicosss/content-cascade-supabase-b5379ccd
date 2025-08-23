
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings, Heart, LayoutDashboard, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigation } from '@/hooks/useNavigation';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { logoutAdmin, isAdmin } = useAdminAuth();
  const { handleNavigation } = useNavigation();

  const handleSignOut = async () => {
    await signOut();
    if (isAdmin) {
      logoutAdmin();
    }
    handleNavigation('/');
  };

  if (!user) return null;

  const displayName = profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-orange-400/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-slate-200 hover:text-orange-400"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="typography-small hidden sm:block font-medium">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 rounded-xl border border-slate-600/50 shadow-xl z-dropdown bg-slate-900 backdrop-blur-sm"
      >
        <DropdownMenuItem 
          onClick={() => handleNavigation('/dashboard')}
          className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-blue-200" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigation('/profile')}
          className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Settings className="h-4 w-4 mr-3 text-emerald-200" />
          Il Mio Profilo
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigation('/favorites')}
          className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Heart className="h-4 w-4 mr-3 text-red-200" />
          Preferiti
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem 
              onClick={() => handleNavigation('/admin')}
              className="typography-small rounded-lg hover:bg-orange-500/20 cursor-pointer text-orange-200 hover:text-orange-100 focus:bg-orange-500/20 focus:text-orange-100"
            >
              <Shield className="h-4 w-4 mr-3" />
              Pannello Admin
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logoutAdmin}
              className="typography-small rounded-lg hover:bg-yellow-500/20 cursor-pointer text-yellow-200 hover:text-yellow-100 focus:bg-yellow-500/20 focus:text-yellow-100"
            >
              <Shield className="h-4 w-4 mr-3" />
              Esci da Admin
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="typography-small rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 cursor-pointer focus:bg-red-500/20 focus:text-red-100"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
