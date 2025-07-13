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
    <h2 className="typography-h2 text-white drop-shadow-lg text-center mb-6">
      {getUserGreeting()}
    </h2>
  );
};
export default UserGreeting;