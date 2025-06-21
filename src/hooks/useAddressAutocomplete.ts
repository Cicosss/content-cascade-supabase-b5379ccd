
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
  onAddressConfirmed?: (isConfirmed: boolean) => void;
}

export const useAddressAutocomplete = ({ 
  isApiLoaded, 
  onAddressSelect, 
  onAddressConfirmed 
}: UseAddressAutocompleteProps) => {
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
      
      console.log('🗺️ Google Places - Selezione luogo:', place);
      
      if (!place.geometry?.location) {
        console.error('❌ Nessuna posizione trovata per questo indirizzo');
        onAddressConfirmed?.(false);
        return;
      }

      setIsLoading(true);
      console.log('🔄 useAddressAutocomplete - Inizio elaborazione indirizzo');

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

      console.log('✅ useAddressAutocomplete - Dati estratti:', {
        address: addressData.address,
        lat: addressData.latitude,
        lng: addressData.longitude,
        city: addressData.city
      });

      // CORREZIONE: Prima confermiamo l'indirizzo, poi inviamo i dati
      console.log('🔄 useAddressAutocomplete - Confermo indirizzo...');
      onAddressConfirmed?.(true);

      // CORREZIONE: Invio sincrono dei dati (no setTimeout)
      console.log('🔄 useAddressAutocomplete - Invio dati al form...');
      onAddressSelect(addressData);
      
      console.log('✅ useAddressAutocomplete - Processo completato con successo');
      setIsLoading(false);
    };

    autocomplete.addListener('place_changed', handlePlaceSelect);

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isApiLoaded, onAddressSelect, onAddressConfirmed]);

  return { inputRef, isLoading };
};
