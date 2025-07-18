
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileView } from '../views/UserProfileView';

const UserProfileContainer = React.memo(() => {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  return (
    <UserProfileView 
      profile={profile}
      onSignOut={signOut}
    />
  );
});

UserProfileContainer.displayName = 'UserProfileContainer';

export { UserProfileContainer };
