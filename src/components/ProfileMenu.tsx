
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Heart, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
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
          variant="outline" 
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block font-medium text-gray-700">
            {user.user_metadata?.first_name || user.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-200/50 shadow-lg">
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="rounded-lg hover:bg-blue-50 cursor-pointer"
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-blue-600" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="rounded-lg hover:bg-emerald-50 cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-3 text-emerald-600" />
          Il Mio Profilo
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/favorites')}
          className="rounded-lg hover:bg-emerald-50 cursor-pointer"
        >
          <Heart className="h-4 w-4 mr-3 text-red-500" />
          Preferiti
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200/50" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
