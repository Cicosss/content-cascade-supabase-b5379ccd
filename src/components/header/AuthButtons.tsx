
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from '@/components/ProfileMenu';

interface AuthButtonsProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false, onMobileClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth?mode=login');
    onMobileClose?.();
  };

  const handleSignup = () => {
    navigate('/auth?mode=signup');
    onMobileClose?.();
  };

  if (user) {
    return <ProfileMenu />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 mt-4 px-4">
        <Button 
          onClick={handleLogin}
          className="auth-button-primary w-full"
        >
          <User className="h-4 w-4 mr-2" />
          Accedi
        </Button>
        <Button 
          onClick={handleSignup}
          className="auth-button-secondary w-full"
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
      >
        <User className="h-4 w-4 mr-2" />
        Accedi
      </Button>
      <Button 
        onClick={handleSignup}
        className="auth-button-secondary"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Registrati
      </Button>
    </div>
  );
};

export default AuthButtons;
