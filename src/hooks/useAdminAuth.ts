
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

        // Fallback admin by email, plus role-based admin from user_roles
        const isFallbackAdmin = user.email === 'luca.litti@gmail.com';
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const hasAdminRole = Array.isArray(roles) && roles.some((r: any) => r.role === 'admin');
        const isAdmin = isFallbackAdmin || hasAdminRole;

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
