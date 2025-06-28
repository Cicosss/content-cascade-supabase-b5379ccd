
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';

interface AuthButtonsProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const AuthButtons = React.memo<AuthButtonsProps>(({ isMobile = false, onMobileClose }) => {
  const { user } = useAuth();

  if (user) {
    return <UserMenu />;
  }

  return <GuestMenu isMobile={isMobile} onMobileClose={onMobileClose} />;
});

AuthButtons.displayName = 'AuthButtons';

export default AuthButtons;
