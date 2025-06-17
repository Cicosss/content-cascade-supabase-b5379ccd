
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUser {
  email: string;
  isAdmin: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the current authenticated user is admin
    if (user && user.email === 'luca.litti@gmail.com') {
      const admin = { email: user.email, isAdmin: true };
      setAdminUser(admin);
      localStorage.setItem('adminUser', JSON.stringify(admin));
    } else {
      setAdminUser(null);
      localStorage.removeItem('adminUser');
    }
    setIsLoading(false);
  }, [user]);

  const loginAdmin = (email: string, password: string): boolean => {
    // This function is no longer needed as admin privileges are automatic
    // for the designated email when they're authenticated
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  return {
    adminUser,
    isLoading,
    loginAdmin,
    logoutAdmin,
    isAdmin: adminUser?.isAdmin || false
  };
};
