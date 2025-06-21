
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, CheckCircle } from 'lucide-react';

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface AddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onAddressSelect: (addressData: AddressData) => void;
  className?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label = "Indirizzo",
  placeholder = "Inizia a digitare l'indirizzo...",
  value,
  onAddressSelect,
  className = "",
  required = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  // Sincronizza il valore interno con il prop value
  useEffect(() => {
    setInputValue(value);
    // Reset dello stato di conferma se l'indirizzo cambia dall'esterno
    if (value !== inputValue) {
      setIsAddressConfirmed(false);
    }
  }, [value]);

  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      if (window.google?.maps?.places) {
        setIsApiLoaded(true);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsApiLoaded(true);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Errore nel caricamento Google Maps API:', error);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (!isApiLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'IT' },
      fields: ['formatted_address', 'geometry', 'address_components']
    });

    autocompleteRef.current = autocomplete;

    const handlePlaceSelect = () => {
      const place = autocomplete.getPlace();
      
      console.log('🗺️ Google Places - Luogo selezionato:', place);
      
      if (!place.geometry?.location) {
        console.error('❌ Nessuna posizione trovata per questo indirizzo');
        setIsAddressConfirmed(false);
        return;
      }

      setIsLoading(true);

      // Estrai i dati dall'address_components
      let city = '';
      let province = '';
      let postalCode = '';
      let country = '';

      if (place.address_components) {
        place.address_components.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            province = component.short_name;
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });
      }

      const addressData: AddressData = {
        address: place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        city,
        province,
        postalCode,
        country
      };

      console.log('✅ AddressAutocomplete - Dati estratti:', addressData);

      setInputValue(addressData.address);
      setIsAddressConfirmed(true);
      
      // Invia i dati al form padre
      setTimeout(() => {
        onAddressSelect(addressData);
        console.log('📤 AddressAutocomplete - Dati inviati al form padre');
      }, 0);
      
      setIsLoading(false);
    };

    autocomplete.addListener('place_changed', handlePlaceSelect);

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isApiLoaded, onAddressSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Se l'utente digita manualmente, resetta lo stato di conferma
    if (newValue !== value) {
      setIsAddressConfirmed(false);
      console.log('🔄 AddressAutocomplete - Input manuale, reset conferma indirizzo');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="address-autocomplete">
          {label} {required && '*'}
        </Label>
      )}
      <div className="relative">
        <Input
          id="address-autocomplete"
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className={`pr-10 ${isAddressConfirmed ? 'border-green-300 bg-green-50' : ''}`}
          disabled={!isApiLoaded}
          required={required}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : isAddressConfirmed ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      {!isApiLoaded && (
        <p className="text-xs text-gray-500">Caricamento servizio indirizzi...</p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
