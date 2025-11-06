
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PasswordAuthProps {
  onAuthenticated: () => void;
}

const PasswordAuth: React.FC<PasswordAuthProps> = ({ onAuthenticated }) => {
  const { user } = useAuth();

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Accesso richiesto',
        description: 'Accedi per continuare come Promotore del Territorio',
      });
      return;
    }

    // Check role from secure DB instead of hardcoded password
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Errore di autorizzazione', description: 'Riprovare più tardi', variant: 'destructive' });
      return;
    }

    const allowed = Array.isArray(roles) && roles.some((r: any) => r.role === 'promoter' || r.role === 'admin');

    if (allowed) {
      onAuthenticated();
      toast({ title: 'Accesso autorizzato', description: 'Benvenuto nella sezione Promotore del Territorio' });
    } else {
      toast({
        title: 'Accesso negato',
        description: 'Non hai i permessi necessari. Contatta un amministratore.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🏛️ Promotore del Territorio</CardTitle>
          <p className="text-muted-foreground mt-2">
            {user ? 'Clicca su Accedi per verificare i tuoi permessi' : 'Accedi per continuare'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyAccess} className="space-y-4">
            <Button type="submit" className="w-full">
              Verifica Accesso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordAuth;
