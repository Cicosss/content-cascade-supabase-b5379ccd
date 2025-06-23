
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
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { adminUser, logoutAdmin, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // Also logout admin if logged in
    if (isAdmin) {
      logoutAdmin();
    }
    navigate('/');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-slate-300 hover:text-white"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block font-medium">
            {profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 rounded-xl border border-slate-200 shadow-xl bg-white dark:bg-slate-800 dark:border-slate-700 z-50"
      >
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300"
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-emerald-50 dark:focus:bg-emerald-900/20 focus:text-emerald-700 dark:focus:text-emerald-300"
        >
          <Settings className="h-4 w-4 mr-3 text-emerald-600 dark:text-emerald-400" />
          Il Mio Profilo
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/favorites')}
          className="rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-pink-50 dark:focus:bg-pink-900/20 focus:text-pink-700 dark:focus:text-pink-300"
        >
          <Heart className="h-4 w-4 mr-3 text-pink-600 dark:text-pink-400" />
          Preferiti
        </DropdownMenuItem>
        
        {/* Admin Section - Only visible to admin users */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
            
            <DropdownMenuItem 
              onClick={handleAdminAccess}
              className="rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer text-orange-700 dark:text-orange-300 focus:bg-orange-50 dark:focus:bg-orange-900/20 focus:text-orange-800 dark:focus:text-orange-200"
            >
              <Shield className="h-4 w-4 mr-3" />
              Pannello Admin
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleAdminLogout}
              className="rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer text-yellow-700 dark:text-yellow-300 focus:bg-yellow-50 dark:focus:bg-yellow-900/20 focus:text-yellow-800 dark:focus:text-yellow-200"
            >
              <Shield className="h-4 w-4 mr-3" />
              Esci da Admin
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-800 dark:focus:text-red-200"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
