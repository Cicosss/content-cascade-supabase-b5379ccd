
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AuthHeader } from './AuthHeader';
import { AuthTabs } from './AuthTabs';
import { EmailConfirmationDialog } from '@/components/EmailConfirmationDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const AuthForm = () => {
  const { user, signIn, signUp, loading } = useAuth();
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

  return (
    <>
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <AuthHeader />
        <CardContent>
          <AuthTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            onInputChange={handleInputChange}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isSubmitting={isSubmitting}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Registrandoti accetti i nostri termini di servizio e la privacy policy
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation Dialog */}
      <EmailConfirmationDialog
        open={showEmailConfirmation}
        onClose={() => setShowEmailConfirmation(false)}
        email={pendingEmail}
        onResendEmail={handleResendEmail}
        isResending={isResendingEmail}
      />
    </>
  );
};
