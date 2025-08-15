
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from '@/components/ProfileMenu';

export const UserActions: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      
      {user ? (
        <ProfileMenu />
      ) : (
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm" className="border-slate-600/50 text-slate-200 hover:bg-slate-800/50 hover:text-orange-400 hover:border-orange-400/50 bg-transparent transition-all duration-300 font-medium tracking-wide relative group">
            <a href="/auth">
              Accedi
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </a>
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold tracking-wide shadow-lg hover:shadow-orange-500/25 hover:scale-105">
            <a href="/auth">Registrati</a>
          </Button>
        </div>
      )}
    </div>
  );
};
