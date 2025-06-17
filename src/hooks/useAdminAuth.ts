
import { useState, useEffect } from 'react';

interface AdminUser {
  email: string;
  isAdmin: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = (email: string, password: string): boolean => {
    console.log('Tentativo login admin:', { email, password });
    // Fixed admin credentials
    if (email === 'Admin' && password === 'Latakia2024!') {
      const admin = { email: 'Admin', isAdmin: true };
      setAdminUser(admin);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      console.log('Login admin riuscito');
      return true;
    }
    console.log('Login admin fallito - credenziali errate');
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
