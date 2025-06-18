
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
          className="brand-blue-gradient text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 text-sm w-full shadow-md hover:shadow-lg transition-all duration-300 font-medium"
        >
          <User className="h-4 w-4 mr-2" />
          Accedi
        </Button>
        <Button 
          onClick={handleSignup}
          className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white text-sm w-full"
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
        className="brand-blue-gradient text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 text-sm px-4 py-2 h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
      >
        <User className="h-4 w-4 mr-2" />
        Accedi
      </Button>
      <Button 
        onClick={handleSignup}
        className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white text-sm px-4 py-2 h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Registrati
      </Button>
    </div>
  );
};

export default AuthButtons;
