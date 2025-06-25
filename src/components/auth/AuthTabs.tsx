
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignIn: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSubmitting: boolean;
  selectedAvatar: string | null;
  setSelectedAvatar: (avatar: string | null) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  onInputChange,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  showPassword,
  setShowPassword,
  isSubmitting,
  selectedAvatar,
  setSelectedAvatar
}) => {
  return (
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
        <LoginForm
          formData={formData}
          onInputChange={onInputChange}
          onSubmit={onSignIn}
          onGoogleSignIn={onGoogleSignIn}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isSubmitting={isSubmitting}
        />
      </TabsContent>

      <TabsContent value="signup">
        <SignupForm
          formData={formData}
          onInputChange={onInputChange}
          onSubmit={onSignUp}
          onGoogleSignIn={onGoogleSignIn}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isSubmitting={isSubmitting}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </TabsContent>
    </Tabs>
  );
};
