import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QualityPromiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QualityPromiseModal: React.FC<QualityPromiseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-auto p-6 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground leading-tight">
              Ogni esperienza su Mia Romagna è una promessa di autenticità
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              Selezioniamo personalmente ogni luogo e attività per garantirti esperienze genuine, 
              gestite da persone del territorio con passione e competenza.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-2">
            <Button 
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 font-medium"
              size="default"
            >
              Inizia a esplorare
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityPromiseModal;