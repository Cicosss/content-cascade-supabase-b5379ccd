
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const UserGreeting = () => {
  const { user } = useAuth();
  
  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Benvenuto ${user.user_metadata.first_name}!`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Benvenuto ${emailName}!`;
    }
    return 'Benvenuto in Romagna!';
  };

  return (
    <h1 className="typography-hero text-white drop-shadow-2xl">
      {getUserGreeting()}
    </h1>
  );
};

export default UserGreeting;
