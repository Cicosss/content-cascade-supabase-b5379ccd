
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ExperienceFormFields from './ExperienceFormFields';
import MediaUploader from './MediaUploader';

interface ExperienceManualFormProps {
  onExperienceAdded: () => void;
}

const ExperienceManualForm: React.FC<ExperienceManualFormProps> = ({ onExperienceAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    macro_area: '',
    category: '',
    tags: [] as string[],
    address: '',
    latitude: '',
    longitude: '',
    price_info: '',
    duration_info: '',
    target_audience: 'everyone',
    website_url: '',
    phone: '',
    email: '',
    start_datetime: '',
    end_datetime: '',
    location_name: '',
    organizer_info: '',
    images: [] as string[],
    video_url: ''
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, video_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.macro_area || !formData.category) {
        toast.error('Nome, macro-area e categoria sono obbligatori');
        return;
      }

      const experienceData = {
        name: formData.name,
        description: formData.description,
        macro_area: formData.macro_area,
        category: formData.category,
        tags: formData.tags,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        website_url: formData.website_url,
        phone: formData.phone,
        email: formData.email,
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
        location_name: formData.location_name,
        organizer_info: formData.organizer_info,
        images: formData.images,
        video_url: formData.video_url,
        status: 'approved'
      };

      const { error } = await supabase
        .from('points_of_interest')
        .insert([experienceData]);

      if (error) {
        console.error('Error inserting experience:', error);
        toast.error('Errore nell\'inserimento dell\'esperienza');
        return;
      }

      toast.success('Esperienza inserita con successo!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        macro_area: '',
        category: '',
        tags: [],
        address: '',
        latitude: '',
        longitude: '',
        price_info: '',
        duration_info: '',
        target_audience: 'everyone',
        website_url: '',
        phone: '',
        email: '',
        start_datetime: '',
        end_datetime: '',
        location_name: '',
        organizer_info: '',
        images: [],
        video_url: ''
      });

      onExperienceAdded();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'inserimento dell\'esperienza');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ExperienceFormFields 
        formData={formData}
        onInputChange={handleInputChange}
      />

      <MediaUploader
        images={formData.images}
        videoUrl={formData.video_url}
        onImagesChange={handleImagesChange}
        onVideoUrlChange={handleVideoUrlChange}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Inserimento...' : 'Inserisci Esperienza'}
      </Button>
    </form>
  );
};

export default ExperienceManualForm;
