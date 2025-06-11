
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import ExperienceFormFields from './ExperienceFormFields';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  video_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
}

interface EditExperienceModalProps {
  experience: ApprovedExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedExperience: ApprovedExperience) => void;
}

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        name: experience.name || '',
        description: experience.description || '',
        category: experience.category || '',
        poi_type: experience.poi_type || 'experience',
        address: experience.address || '',
        latitude: experience.latitude || '',
        longitude: experience.longitude || '',
        price_info: experience.price_info || '',
        duration_info: experience.duration_info || '',
        target_audience: experience.target_audience || 'everyone',
        phone: experience.phone || '',
        email: experience.email || '',
        start_datetime: experience.start_datetime ? new Date(experience.start_datetime).toISOString().slice(0, 16) : '',
        end_datetime: experience.end_datetime ? new Date(experience.end_datetime).toISOString().slice(0, 16) : '',
        location_name: experience.location_name || '',
        organizer_info: experience.organizer_info || '',
        website_url: experience.video_url || '',
        images: experience.images || []
      });
    }
  }, [experience]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!experience) return;

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        poi_type: formData.poi_type,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        phone: formData.phone,
        email: formData.email,
        start_datetime: formData.start_datetime ? new Date(formData.start_datetime).toISOString() : null,
        end_datetime: formData.end_datetime ? new Date(formData.end_datetime).toISOString() : null,
        location_name: formData.location_name,
        organizer_info: formData.organizer_info,
        video_url: formData.website_url,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('points_of_interest')
        .update(updateData)
        .eq('id', experience.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating experience:', error);
        toast.error('Errore nell\'aggiornamento dell\'esperienza');
        return;
      }

      const updatedExperience = {
        ...experience,
        ...data
      };

      onSave(updatedExperience);
      toast.success('Esperienza aggiornata con successo');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'aggiornamento dell\'esperienza');
    } finally {
      setSaving(false);
    }
  };

  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Esperienza: {experience.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ExperienceFormFields
            formData={formData}
            onInputChange={handleInputChange}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Annulla
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salva Modifiche
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditExperienceModal;
