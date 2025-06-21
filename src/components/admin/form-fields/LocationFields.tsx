
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
  const hasValidCoordinates = formData.latitude && formData.longitude && formData.latitude !== '' && formData.longitude !== '';

  const handleAddressSelect = (addressData: any) => {
    console.log('📍 LocationFields - Ricevuti dati indirizzo:', {
      address: addressData.address,
      lat: addressData.latitude,
      lng: addressData.longitude,
      city: addressData.city
    });
    
    // CORREZIONE: Aggiornamenti sincroni e batch per evitare race conditions
    const latStr = addressData.latitude?.toString() || '';
    const lngStr = addressData.longitude?.toString() || '';
    
    console.log('📍 LocationFields - Preparazione aggiornamenti batch:', {
      address: addressData.address,
      lat: latStr,
      lng: lngStr
    });
    
    // CORREZIONE: Aggiornamenti sincroni immediati
    onInputChange('address', addressData.address || '');
    onInputChange('latitude', latStr);
    onInputChange('longitude', lngStr);
    
    // Aggiorna il nome della location se necessario
    if (!formData.location_name && addressData.city) {
      onInputChange('location_name', addressData.city);
      console.log('📍 LocationFields - Location name aggiornato:', addressData.city);
    }
    
    console.log('✅ LocationFields - Tutti gli aggiornamenti completati');
    
    // Debug: verifica immediata dello stato
    console.log('🔍 LocationFields - Verifica stato dopo aggiornamenti:', {
      currentLat: formData.latitude,
      currentLng: formData.longitude,
      expectedLat: latStr,
      expectedLng: lngStr
    });
  };

  return (
    <>
      {/* Indirizzo con autocompletamento e feedback visivo */}
      <div className="space-y-2">
        <AddressAutocomplete
          label="Indirizzo *"
          placeholder="Inizia a digitare l'indirizzo..."
          value={formData.address || ''}
          onAddressSelect={handleAddressSelect}
          required
        />
        
        {/* Feedback visivo per confermare che l'indirizzo è stato geolocalizzato */}
        {hasValidCoordinates && formData.address && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            <span className="text-green-500">✓</span>
            <span>Indirizzo confermato e geolocalizzato</span>
            <span className="text-xs text-gray-500 ml-2">
              ({parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)})
            </span>
          </div>
        )}
        
        {/* Messaggio di aiuto se l'indirizzo non è stato selezionato dalla lista */}
        {formData.address && !hasValidCoordinates && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
            <span className="text-amber-500">⚠️</span>
            <span>Seleziona un indirizzo dalla lista di suggerimenti per completare la geolocalizzazione</span>
          </div>
        )}

        {/* Debug info migliorato - rimuovi in produzione */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded space-y-1">
            <div>Debug address: "{formData.address}"</div>
            <div>Debug lat: "{formData.latitude}" (valid: {!!(formData.latitude && formData.latitude !== '') ? 'true' : 'false'})</div>
            <div>Debug lng: "{formData.longitude}" (valid: {!!(formData.longitude && formData.longitude !== '') ? 'true' : 'false'})</div>
            <div>Debug hasCoords: {hasValidCoordinates.toString()}</div>
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
