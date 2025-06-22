
import { useRef, useEffect, useState, useCallback } from 'react';

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

export const useAddressAutocomplete = ({ 
  isApiLoaded, 
  onAddressSelect
}: UseAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Memoizza la callback per evitare re-render inutili
  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry?.location) {
      console.log('⚠️ Luogo selezionato senza geometria valida');
      setIsConfirmed(false);
      return;
    }

    console.log('🌍 Elaborazione luogo da Google Places:', place);
    setIsLoading(true);

    // Estrai componenti indirizzo in modo più sicuro
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

    console.log('📍 Dati indirizzo processati:', addressData);

    // Usa un breve timeout per assicurarsi che tutti i dati siano processati
    setTimeout(() => {
      setIsConfirmed(true);
      onAddressSelect(addressData);
      setIsLoading(false);
      console.log('✅ Indirizzo confermato e inviato al form');
    }, 50);

  }, [onAddressSelect]);

  useEffect(() => {
    if (!isApiLoaded || !inputRef.current || autocompleteRef.current) return;

    console.log('🔧 Inizializzazione Google Places Autocomplete');

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'IT' },
      fields: ['formatted_address', 'geometry', 'address_components']
    });

    autocompleteRef.current = autocomplete;
    autocomplete.addListener('place_changed', handlePlaceSelect);

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        console.log('🧹 Cleanup Google Places Autocomplete');
      }
    };
  }, [isApiLoaded, handlePlaceSelect]);

  const resetConfirmation = useCallback(() => {
    console.log('🔄 Reset conferma indirizzo');
    setIsConfirmed(false);
  }, []);

  return { 
    inputRef, 
    isLoading, 
    isConfirmed,
    resetConfirmation
  };
};
