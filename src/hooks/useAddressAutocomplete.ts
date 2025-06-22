
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
  onConfirmationChange: (isConfirmed: boolean) => void;
}

export const useAddressAutocomplete = ({ 
  isApiLoaded, 
  onAddressSelect,
  onConfirmationChange
}: UseAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) {
      console.log('❌ Autocomplete ref not available');
      return;
    }
    
    const place = autocompleteRef.current.getPlace();
    console.log('📍 Place selected:', place);
    
    if (!place.geometry?.location) {
      console.log('❌ No geometry/location in selected place');
      onConfirmationChange(false);
      return;
    }

    setIsLoading(true);
    console.log('🔄 Processing place selection...');

    try {
      // Extract address components safely
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

      console.log('✅ Address data processed:', addressData);

      // Call callbacks immediatamente e atomicamente
      onAddressSelect(addressData);
      onConfirmationChange(true);
      
    } catch (error) {
      console.error('❌ Error processing address:', error);
      onConfirmationChange(false);
    } finally {
      setIsLoading(false);
    }

  }, [onAddressSelect, onConfirmationChange]);

  useEffect(() => {
    if (!isApiLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }

    console.log('🔧 Initializing Google Places Autocomplete...');

    try {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'IT' },
        fields: ['formatted_address', 'geometry', 'address_components']
      });

      autocompleteRef.current = autocomplete;
      autocomplete.addListener('place_changed', handlePlaceSelect);
      
      console.log('✅ Google Places Autocomplete initialized');
    } catch (error) {
      console.error('❌ Error initializing autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        console.log('🧹 Cleaned up autocomplete listeners');
      }
    };
  }, [isApiLoaded, handlePlaceSelect]);

  return { 
    inputRef, 
    isLoading
  };
};
