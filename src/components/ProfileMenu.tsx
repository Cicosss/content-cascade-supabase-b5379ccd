
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings, Heart, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
      <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-600 bg-slate-800/98 backdrop-blur-sm shadow-lg">
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="rounded-lg hover:bg-slate-700 cursor-pointer text-white"
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-blue-400" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="rounded-lg hover:bg-slate-700 cursor-pointer text-white"
        >
          <Settings className="h-4 w-4 mr-3 text-emerald-400" />
          Il Mio Profilo
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/favorites')}
          className="rounded-lg hover:bg-slate-700 cursor-pointer text-white"
        >
          <Heart className="h-4 w-4 mr-3 text-red-400" />
          Preferiti
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-600/50" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
