
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { ApprovedExperience } from '@/hooks/useApprovedExperiences';

interface DeleteConfirmModalProps {
  experience: ApprovedExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (experienceId: string) => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  experience,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (experience && confirmText === experience.name) {
      onConfirm(experience.id);
      setConfirmText('');
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!experience) return null;

  const isConfirmValid = confirmText === experience.name;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Elimina Definitivamente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-800 space-y-2">
              <p className="font-medium">⚠️ ATTENZIONE: Questa azione è irreversibile!</p>
              <p>
                Stai per eliminare definitivamente l'esperienza <strong>"{experience.name}"</strong> 
                da entrambe le tabelle del database.
              </p>
              <p>Tutti i dati associati andranno persi per sempre.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Per confermare, digita esattamente: <strong>{experience.name}</strong>
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Digita: ${experience.name}`}
              className={!isConfirmValid && confirmText ? 'border-red-300' : ''}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-600">Il nome non corrisponde</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annulla
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!isConfirmValid}
          >
            Elimina Definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
