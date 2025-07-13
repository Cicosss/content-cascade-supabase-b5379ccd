import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
const UserGreeting = () => {
  const {
    user
  } = useAuth();
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
    <h2 className="typography-display-small text-white font-bold mb-4 drop-shadow-lg">
      {getUserGreeting()}
    </h2>
  );
};
export default UserGreeting;