
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface LocationFieldsProps {
  formData: {
    address: string;
    location_name: string;
    latitude: string;
    longitude: string;
    organizer_info: string;
    poi_type: string;
  };
  onInputChange: (field: string, value: string) => void;
  onBatchUpdate?: (updates: Record<string, string>) => void;
  isAddressConfirmed?: boolean;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ 
  formData, 
  onInputChange, 
  onBatchUpdate,
  isAddressConfirmed = false 
}) => {
  const isEvent = formData.poi_type === 'event';
  const hasValidCoordinates = formData.latitude && formData.longitude && 
                              formData.latitude !== '' && formData.longitude !== '' &&
                              formData.latitude !== '0' && formData.longitude !== '0';

  const handleAddressSelect = (addressData: AddressData) => {
    try {
      console.log('🏠 Indirizzo selezionato da Google Places:', addressData);
      
      // Prepara tutti gli aggiornamenti in un singolo oggetto
      const updates: Record<string, string> = {
        address: addressData.address || '',
        latitude: addressData.latitude?.toString() || '',
        longitude: addressData.longitude?.toString() || ''
      };
      
      // Se c'è location_name vuoto e abbiamo una città, aggiungila
      if (!formData.location_name && addressData.city) {
        updates.location_name = addressData.city;
        console.log('📍 Aggiunto location_name dalla città:', addressData.city);
      }
      
      console.log('📦 Updates preparati:', updates);
      
      // Usa batch update se disponibile, altrimenti fallback a singoli update
      if (onBatchUpdate) {
        console.log('📦 Usando batch update per indirizzo');
        onBatchUpdate(updates);
      } else {
        console.log('⚠️ Fallback a singoli update per indirizzo');
        Object.entries(updates).forEach(([field, value]) => {
          onInputChange(field, value);
        });
      }
      
      console.log('✅ Indirizzo processato con successo');
      
    } catch (error) {
      console.error('❌ Errore in handleAddressSelect:', error);
      console.error('📋 AddressData ricevuto:', addressData);
      
      // Fallback: almeno tenta di salvare l'indirizzo base
      try {
        if (addressData?.address) {
          onInputChange('address', addressData.address);
        }
      } catch (fallbackError) {
        console.error('❌ Errore anche nel fallback:', fallbackError);
      }
    }
  };

  return (
    <>
      <div className="space-y-2">
        <AddressAutocomplete
          label="Indirizzo *"
          placeholder="Inizia a digitare l'indirizzo..."
          value={formData.address || ''}
          onAddressSelect={handleAddressSelect}
          required
        />
        
        {/* Feedback visivo migliorato con stato di conferma */}
        {hasValidCoordinates && formData.address && isAddressConfirmed && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            <span className="text-green-500">✓</span>
            <span>Indirizzo confermato e geolocalizzato</span>
          </div>
        )}
        
        {hasValidCoordinates && formData.address && !isAddressConfirmed && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
            <span className="text-blue-500">⏳</span>
            <span>Elaborazione coordinate in corso...</span>
          </div>
        )}
        
        {formData.address && !hasValidCoordinates && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
            <span className="text-amber-500">⚠️</span>
            <span>Seleziona un indirizzo dalla lista per completare la geolocalizzazione</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location_name">Nome Location</Label>
          <Input
            id="location_name"
            value={formData.location_name || ''}
            onChange={(e) => onInputChange('location_name', e.target.value)}
            placeholder="es. Centro Storico, Marina"
          />
        </div>
        
        <div>
          <Label htmlFor="organizer_info">
            {isEvent ? 'Informazioni Organizzatore' : 'Gestore/Proprietario'}
          </Label>
          <Input
            id="organizer_info"
            value={formData.organizer_info || ''}
            onChange={(e) => onInputChange('organizer_info', e.target.value)}
            placeholder={
              isEvent 
                ? 'es. Associazione Culturale XYZ' 
                : 'es. Famiglia Rossi, Comune di...'
            }
          />
        </div>
      </div>
    </>
  );
};

export default LocationFields;
