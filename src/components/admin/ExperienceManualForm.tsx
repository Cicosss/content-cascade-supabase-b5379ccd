
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ExperienceFormFields from './ExperienceFormFields';

interface ExperienceManualFormProps {
  onExperienceAdded: () => void;
}

const ExperienceManualForm: React.FC<ExperienceManualFormProps> = ({ onExperienceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    poi_type: 'place',
    macro_area: 'Gusto & Sapori',
    category: 'Ristoranti',
    address: '',
    latitude: '',
    longitude: '',
    price_info: '',
    duration_info: '',
    target_audience: 'everyone',
    website_url: '',
    phone: '',
    email: '',
    images: [] as string[],
    tags: [] as string[],
    start_datetime: '',
    end_datetime: '',
    location_name: '',
    organizer_info: '',
    opening_hours: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    console.log(`🔄 Form update - ${field}:`, value);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Log dello stato aggiornato per debug
      if (field === 'latitude' || field === 'longitude' || field === 'address' || field === 'name') {
        console.log('📊 Stato form aggiornato:', {
          name: updated.name,
          address: updated.address,
          latitude: updated.latitude,
          longitude: updated.longitude,
          hasCoordinates: !!(updated.latitude && updated.longitude)
        });
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Tentativo di submit con dati:', {
      name: formData.name,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      poi_type: formData.poi_type
    });

    // Validazione semplificata e migliorata
    const errors = [];
    
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
    }
    
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
    }
    
    // Controllo semplificato: se c'è un indirizzo, deve avere coordinate da Google Maps
    if (formData.address && (!formData.latitude || !formData.longitude || formData.latitude === '' || formData.longitude === '')) {
      errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
    }

    if (errors.length > 0) {
      const errorMessage = `Campi mancanti o incompleti: ${errors.join(', ')}`;
      console.error('❌ Validazione fallita:', errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Verifica che le coordinate siano numeri validi
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Coordinate non valide. Assicurati di aver selezionato un indirizzo dalla lista di Google Maps.');
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        name: formData.name,
        description: formData.description || null,
        poi_type: formData.poi_type,
        macro_area: formData.macro_area,
        category: formData.category,
        address: formData.address || null,
        latitude: lat,
        longitude: lng,
        price_info: formData.price_info || null,
        duration_info: formData.duration_info || null,
        target_audience: formData.target_audience,
        website_url: formData.website_url || null,
        phone: formData.phone || null,
        email: formData.email || null,
        images: formData.images.length > 0 ? formData.images : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        status: 'approved',
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        location_name: formData.poi_type === 'event' ? (formData.location_name || null) : null,
        organizer_info: formData.poi_type === 'event' ? (formData.organizer_info || null) : null,
        opening_hours: formData.poi_type === 'place' ? (formData.opening_hours || null) : null,
      };

      console.log('🔄 Inserimento POI:', submissionData);

      const { data, error } = await supabase
        .from('points_of_interest')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore inserimento POI:', error);
        throw error;
      }

      console.log('✅ POI inserito con successo:', data);
      
      toast.success('POI inserito con successo! L\'indirizzo è stato geolocalizzato correttamente.');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        poi_type: 'place',
        macro_area: 'Gusto & Sapori',
        category: 'Ristoranti',
        address: '',
        latitude: '',
        longitude: '',
        price_info: '',
        duration_info: '',
        target_audience: 'everyone',
        website_url: '',
        phone: '',
        email: '',
        images: [],
        tags: [],
        start_datetime: '',
        end_datetime: '',
        location_name: '',
        organizer_info: '',
        opening_hours: ''
      });

      onExperienceAdded();

    } catch (error) {
      console.error('❌ Errore nell\'inserimento:', error);
      toast.error('Errore nell\'inserimento del POI. Controlla la console per dettagli.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-1">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Come funziona la geolocalizzazione</h4>
            <p className="text-sm text-blue-700">
              Quando inserisci l'indirizzo, inizia a digitare e seleziona una delle opzioni dalla lista di Google Maps. 
              Questo garantisce che il luogo venga geolocalizzato automaticamente sulla mappa interattiva.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ExperienceFormFields
          formData={formData}
          onInputChange={handleInputChange}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Inserimento...' : 'Inserisci POI'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              console.log('🔍 Stato completo del form:', formData);
              const hasCoordinates = !!(formData.latitude && formData.longitude);
              console.log('📍 Ha coordinate valide:', hasCoordinates);
              toast.info('Stato del form stampato nella console');
            }}
          >
            Debug Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceManualForm;
