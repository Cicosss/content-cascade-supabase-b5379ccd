
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignupFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSubmitting: boolean;
  selectedAvatar: string | null;
  setSelectedAvatar: (avatar: string | null) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  showPassword,
  setShowPassword,
  isSubmitting,
  selectedAvatar,
  setSelectedAvatar
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
  );
};
