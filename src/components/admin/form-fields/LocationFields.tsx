
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
    console.log('📍 LocationFields - Ricevuti dati indirizzo:', addressData);
    
    // Aggiorna tutti i campi correlati all'indirizzo in sequenza
    onInputChange('address', addressData.address || '');
    onInputChange('latitude', addressData.latitude?.toString() || '');
    onInputChange('longitude', addressData.longitude?.toString() || '');
    
    // Aggiorna anche il nome della location se non è già impostato e abbiamo una città
    if (!formData.location_name && addressData.city) {
      onInputChange('location_name', addressData.city);
    }
    
    console.log('✅ LocationFields - Tutti i campi aggiornati');
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

      {/* Campi di debug per latitudine e longitudine (visibili in modalità sviluppo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitudine (Auto)</Label>
          <Input
            id="latitude"
            value={formData.latitude || ''}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            placeholder="Auto da indirizzo"
            className="bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitudine (Auto)</Label>
          <Input
            id="longitude"
            value={formData.longitude || ''}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            placeholder="Auto da indirizzo"
            className="bg-gray-50"
            readOnly
          />
        </div>
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
