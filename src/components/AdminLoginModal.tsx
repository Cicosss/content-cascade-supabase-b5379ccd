
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = loginAdmin(email, password);
      
      if (success) {
        toast.success('Accesso amministratore effettuato con successo!');
        onClose();
        navigate('/admin');
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        toast.error('Credenziali amministratore non valide');
      }
    } catch (error) {
      toast.error('Errore durante il login amministratore');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Accesso Amministratore
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email Amministratore</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="admin-email"
                type="text"
                placeholder="Admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password amministratore"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Accesso...' : 'Accedi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
