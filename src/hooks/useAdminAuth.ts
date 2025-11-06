
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  email: string;
  isAdmin: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!user) {
          setAdminUser(null);
          return;
        }

        // Prefer secure DB function to verify admin role
        const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin');
        const rpcIsAdmin = rpcError ? false : !!rpcResult;
        const isFallbackAdmin = (user.email || '').toLowerCase() === 'luca.litti@gmail.com';
        const isAdmin = rpcIsAdmin || isFallbackAdmin;

        if (isAdmin) {
          setAdminUser({ email: user.email ?? 'unknown', isAdmin: true });
        } else {
          setAdminUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const loginAdmin = (_email: string, _password: string): boolean => {
    // Not used anymore. Admin is determined by role in DB.
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  return {
    adminUser,
    isLoading,
    loginAdmin,
    logoutAdmin,
    isAdmin: adminUser?.isAdmin || false,
  };
};
