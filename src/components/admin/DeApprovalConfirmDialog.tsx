
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeApprovalConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  experienceName: string;
  isLoading?: boolean;
}

const DeApprovalConfirmDialog: React.FC<DeApprovalConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  experienceName,
  isLoading = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confermi di voler rimandare in moderazione?</AlertDialogTitle>
          <AlertDialogDescription>
            L'esperienza "{experienceName}" verrà temporaneamente rimossa dal sito pubblico 
            e spostata di nuovo nell'area "Proposte da Moderare" per essere modificata. 
            Sei sicuro di voler procedere?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Annulla
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Elaborazione...' : 'Sì, procedi'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeApprovalConfirmDialog;
