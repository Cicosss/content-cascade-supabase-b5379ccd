
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mountain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Errore di accesso",
              description: "Email o password non corretti. Riprova.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Errore di accesso",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Benvenuto!",
            description: "Accesso effettuato con successo."
          });
          navigate('/');
        }
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Errore",
            description: "Le password non coincidono.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Utente già registrato",
              description: "Questo indirizzo email è già in uso. Prova ad effettuare l'accesso.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Errore di registrazione",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Registrazione completata!",
            description: "Controlla la tua email per confermare l'account."
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-2xl">
              <Mountain className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
            Mia Romagna
          </h1>
          <p className="text-gray-600 text-lg">
            {isLogin ? 'Bentornato! 🌿' : 'Inizia la tua avventura 🏔️'}
          </p>
        </div>

        <Card className="p-8 shadow-2xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Mario"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Cognome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Rossi"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mario@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Conferma Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                {isLogin ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
