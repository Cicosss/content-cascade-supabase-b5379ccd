
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { POISubmission } from './POISubmission';

interface RejectSubmissionModalProps {
  submission: POISubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (submissionId: string, reason: string) => void;
}

const RejectSubmissionModal: React.FC<RejectSubmissionModalProps> = ({
  submission,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (submission) {
      onConfirm(submission.id, reason);
      setReason('');
      onClose();
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Rifiuta Proposta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              Stai per rifiutare la proposta: <strong>"{submission.name}"</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del rifiuto (opzionale)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="es. Informazioni incomplete, contenuto non appropriato..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Rifiuta Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectSubmissionModal;
