
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

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
}

const LocationFields: React.FC<LocationFieldsProps> = ({ formData, onInputChange }) => {
  const isEvent = formData.poi_type === 'event';

  const handleAddressSelect = (addressData: any) => {
    onInputChange('address', addressData.address);
    onInputChange('latitude', addressData.latitude.toString());
    onInputChange('longitude', addressData.longitude.toString());
    
    // Aggiorna anche il nome della location se non è già impostato
    if (!formData.location_name && addressData.city) {
      onInputChange('location_name', addressData.city);
    }
  };

  return (
    <>
      {/* Indirizzo con autocompletamento */}
      <div>
        <AddressAutocomplete
          label="Indirizzo *"
          placeholder="Inizia a digitare l'indirizzo..."
          value={formData.address || ''}
          onAddressSelect={handleAddressSelect}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location_name">Nome Location</Label>
          <Input
            id="location_name"
            value={formData.location_name}
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
            value={formData.organizer_info}
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
