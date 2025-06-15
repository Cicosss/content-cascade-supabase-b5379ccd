
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordAuthProps {
  onAuthenticated: () => void;
}

const PasswordAuth: React.FC<PasswordAuthProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password inserita:', password);
    console.log('Lunghezza password:', password.length);
    
    // Trim della password per rimuovere spazi extra e controllo più robusto
    const trimmedPassword = password.trim();
    const correctPassword = 'Promotore101miaromagna';
    
    console.log('Password dopo trim:', trimmedPassword);
    console.log('Password corretta:', correctPassword);
    console.log('Passwords match:', trimmedPassword === correctPassword);
    
    if (trimmedPassword === correctPassword) {
      onAuthenticated();
      toast({
        title: "Accesso autorizzato",
        description: "Benvenuto nella sezione Promotore del Territorio",
      });
    } else {
      console.log('Password errata');
      toast({
        title: "Password errata",
        description: "La password inserita non è corretta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            🏛️ Promotore del Territorio
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Inserisci la password per accedere alla sezione riservata
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci la password"
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
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
