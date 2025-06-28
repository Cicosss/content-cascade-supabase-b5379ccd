
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuestMenuProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const GuestMenu = React.memo<GuestMenuProps>(({ isMobile = false, onMobileClose }) => {
  const navigate = useNavigate();

  const handleLogin = React.useCallback(() => {
    navigate('/auth?mode=login');
    onMobileClose?.();
  }, [navigate, onMobileClose]);

  const handleSignup = React.useCallback(() => {
    navigate('/auth?mode=signup');
    onMobileClose?.();
  }, [navigate, onMobileClose]);

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 mt-4 px-4">
        <Button 
          onClick={handleLogin}
          className="auth-button-primary w-full"
          aria-label="Accedi al tuo account"
        >
          <User className="h-4 w-4 mr-2" />
          Accedi
        </Button>
        <Button 
          onClick={handleSignup}
          className="auth-button-secondary w-full"
          aria-label="Registrati per un nuovo account"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Registrati
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={handleLogin}
        className="auth-button-primary"
        aria-label="Accedi al tuo account"
      >
        <User className="h-4 w-4 mr-2" />
        Accedi
      </Button>
      <Button 
        onClick={handleSignup}
        className="auth-button-secondary"
        aria-label="Registrati per un nuovo account"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Registrati
      </Button>
    </div>
  );
});

GuestMenu.displayName = 'GuestMenu';

export default GuestMenu;
