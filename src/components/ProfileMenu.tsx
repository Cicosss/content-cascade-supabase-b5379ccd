
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
      <DropdownMenuContent 
        align="end" 
        className="w-48 rounded-xl border border-slate-300 shadow-xl z-50"
        style={{ backgroundColor: '#2A3385' }}
      >
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-blue-200" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Settings className="h-4 w-4 mr-3 text-emerald-200" />
          Il Mio Profilo
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/favorites')}
          className="rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Heart className="h-4 w-4 mr-3 text-red-200" />
          Preferiti
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 cursor-pointer focus:bg-red-500/20 focus:text-red-100"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
