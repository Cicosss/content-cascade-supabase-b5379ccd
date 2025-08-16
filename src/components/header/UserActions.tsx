
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
          <Button asChild variant="outline" size="sm" className="border-border text-foreground hover:bg-muted/50 hover:text-primary hover:border-primary/50 bg-transparent transition-all duration-300 font-medium tracking-wide relative group" data-ua="login">
            <a href="/auth">
              Accedi
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </a>
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-primary to-destructive text-primary-foreground hover:from-primary/90 hover:to-destructive/90 transition-all duration-300 font-semibold tracking-wide shadow-lg hover:shadow-primary/25 hover:scale-105" data-ua="signup">
            <a href="/auth">Registrati</a>
          </Button>
        </div>
      )}
    </div>
  );
};
