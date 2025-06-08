
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onResendEmail: () => void;
  isResending: boolean;
}

export const EmailConfirmationDialog: React.FC<EmailConfirmationDialogProps> = ({
  open,
  onClose,
  email,
  onResendEmail,
  isResending
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Conferma la tua Email
          </DialogTitle>
          <DialogDescription className="text-slate-600 space-y-3">
            <p>
              Abbiamo inviato un'email di conferma a:
            </p>
            <p className="font-semibold text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
              {email}
            </p>
            <p>
              Clicca sul link nell'email per attivare il tuo account e poter effettuare il login.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <div className="flex items-center space-x-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span>Controlla anche la cartella spam</span>
          </div>
          
          <Button
            onClick={onResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? 'Invio in corso...' : 'Reinvia Email'}
          </Button>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400"
          >
            Ho Capito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
