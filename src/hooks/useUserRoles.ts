import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type AppRole = 'admin' | 'moderator' | 'promoter' | 'user';

export interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: AppRole[];
}

export const useUserRoles = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsersWithRoles = async () => {
    setIsLoading(true);
    try {
      // Fetch all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email || 'No email',
        created_at: profile.created_at || '',
        roles: (rolesData || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole)
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile caricare gli utenti',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: 'Ruolo aggiunto',
        description: `Ruolo "${role}" assegnato con successo`
      });

      await fetchUsersWithRoles();
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiungere il ruolo',
        variant: 'destructive'
      });
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: 'Ruolo rimosso',
        description: `Ruolo "${role}" rimosso con successo`
      });

      await fetchUsersWithRoles();
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile rimuovere il ruolo',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  return {
    users,
    isLoading,
    fetchUsersWithRoles,
    addRole,
    removeRole
  };
};
