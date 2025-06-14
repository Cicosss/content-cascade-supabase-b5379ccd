import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarUpload } from '@/components/AvatarUpload';
import { EmailConfirmationDialog } from '@/components/EmailConfirmationDialog';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { createProfile } = useUserProfile();
  const { uploadAvatar } = useAvatarUpload();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('mode') || 'login');

  useEffect(() => {
    if (!loading && user) {
      // Check if user email is confirmed
      if (user.email_confirmed_at) {
        navigate('/dashboard');
      } else {
        // User exists but email not confirmed, show confirmation dialog
        setPendingEmail(user.email || '');
        setShowEmailConfirmation(true);
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'login') {
      setActiveTab(mode);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Inserisci email e password');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenziali non valide o email non confermata. Verifica email e password.');
        } else if (error.message.includes('Email not confirmed')) {
          setPendingEmail(formData.email);
          setShowEmailConfirmation(true);
          toast.info('Devi confermare la tua email prima di accedere');
        } else {
          toast.error('Errore durante il login: ' + error.message);
        }
      } else {
        toast.success('Login effettuato con successo!');
      }
    } catch (error) {
      toast.error('Errore durante il login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Le password non coincidono');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La password deve essere di almeno 6 caratteri');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Questo indirizzo email è già registrato');
        } else {
          toast.error('Errore durante la registrazione: ' + error.message);
        }
        return;
      }

      // Store avatar for later use
      if (selectedAvatar) {
        const pendingFile = (window as any).pendingAvatarFile;
        if (pendingFile) {
          (window as any).pendingAvatarData = {
            file: pendingFile,
            url: selectedAvatar,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
        } else {
          (window as any).pendingAvatarData = {
            url: selectedAvatar,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
        }
      } else {
        (window as any).pendingAvatarData = {
          firstName: formData.firstName,
          lastName: formData.lastName
        };
      }

      // Show email confirmation dialog
      setPendingEmail(formData.email);
      setShowEmailConfirmation(true);
      toast.success('Registrazione completata! Controlla la tua email per confermare l\'account.');
      
      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      setSelectedAvatar(null);
      
    } catch (error) {
      toast.error('Errore durante la registrazione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!pendingEmail) return;
    
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail
      });
      
      if (error) {
        toast.error('Errore nel reinvio dell\'email: ' + error.message);
      } else {
        toast.success('Email di conferma reinviata!');
      }
    } catch (error) {
      toast.error('Errore nel reinvio dell\'email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (user && user.email_confirmed_at) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <MiaRomagnaLogo width={80} height={80} />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Mia Romagna
            </CardTitle>
            <CardDescription className="text-slate-600">
              Il territorio è tra le tue mani
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Accedi</span>
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Registrati</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="tua@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="La tua password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Avatar Upload Section */}
                  <AvatarUpload 
                    selectedAvatar={selectedAvatar}
                    onAvatarChange={setSelectedAvatar}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Mario"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Cognome</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Rossi"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="tua@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimo 6 caratteri"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Conferma Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ripeti la password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registrazione in corso...' : 'Registrati Gratis'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Registrandoti accetti i nostri termini di servizio e la privacy policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Confirmation Dialog */}
      <EmailConfirmationDialog
        open={showEmailConfirmation}
        onClose={() => setShowEmailConfirmation(false)}
        email={pendingEmail}
        onResendEmail={handleResendEmail}
        isResending={isResendingEmail}
      />
    </div>
  );
};

export default Auth;
