
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSubmitting: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  showPassword,
  setShowPassword,
  isSubmitting
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={onInputChange}
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

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
      </Button>
    </form>
  );
};
