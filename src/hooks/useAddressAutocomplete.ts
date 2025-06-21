
import { useRef, useEffect, useState } from 'react';

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface UseAddressAutocompleteProps {
  isApiLoaded: boolean;
  onAddressSelect: (addressData: AddressData) => void;
}

export const useAddressAutocomplete = ({ isApiLoaded, onAddressSelect }: UseAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return { inputRef, isLoading };
};
