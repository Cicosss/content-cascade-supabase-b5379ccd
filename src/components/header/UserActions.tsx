
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
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent transition-colors duration-200">
            <a href="/auth">Accedi</a>
          </Button>
          <Button asChild size="sm" className="bg-white text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
            <a href="/auth">Registrati</a>
          </Button>
        </div>
      )}
    </div>
  );
};
