
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PasswordAuthProps {
  onAuthenticated: () => void;
}

const PasswordAuth: React.FC<PasswordAuthProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
          <CardTitle className="text-2xl font-bold text-slate-800">🏛️ Promotore del Territorio</CardTitle>
          <p className="text-slate-600 mt-2">Verifica il tuo accesso per entrare nella sezione riservata</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Verifica</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={user ? 'Premi Accedi per continuare' : 'Accedi per continuare'}
                  className="pr-10"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Accedi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordAuth;
