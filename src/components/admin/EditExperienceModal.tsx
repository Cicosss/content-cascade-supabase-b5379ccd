
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  poi_type: string;
  opening_hours: string;
}

interface EditExperienceModalProps {
  experience: ApprovedExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: ApprovedExperience) => void;
}

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave
}) => {
  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifica Esperienza</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Funzionalità di modifica in fase di sviluppo
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Esperienza: <strong>{experience.name}</strong>
          </p>
          <Button onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditExperienceModal;
