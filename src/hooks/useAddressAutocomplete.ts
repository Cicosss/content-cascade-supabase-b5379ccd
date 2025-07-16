
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
    console.log('🔄 handlePlaceSelect called');
    
    if (!autocompleteRef.current) {
      console.error('❌ Autocomplete ref not available');
      onConfirmationChange(false);
      return;
    }
    
    const place = autocompleteRef.current.getPlace();
    console.log('📍 Raw place object from Google:', place);
    
    // Validate place object
    if (!place) {
      console.error('❌ No place object returned');
      onConfirmationChange(false);
      return;
    }

    if (!place.geometry?.location) {
      console.error('❌ No geometry/location in place object:', place);
      onConfirmationChange(false);
      return;
    }

    setIsLoading(true);
    console.log('🔄 Processing place selection...');

    try {
      // Extract coordinates safely
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      console.log('🌍 Extracted coordinates:', { lat, lng });

      // Extract address components safely
      let city = '';
      let province = '';
      let postalCode = '';
      let country = '';

      if (place.address_components) {
        console.log('📋 Processing address components:', place.address_components);
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
        address: place.formatted_address || place.name || '',
        latitude: lat,
        longitude: lng,
        city,
        province,
        postalCode,
        country
      };

      console.log('✅ Final address data:', addressData);

      // Verify we have valid coordinates
      if (!lat || !lng || lat === 0 || lng === 0) {
        console.error('❌ Invalid coordinates:', { lat, lng });
        onConfirmationChange(false);
        return;
      }

      // Call callbacks immediately and atomically
      onAddressSelect(addressData);
      onConfirmationChange(true);
      console.log('✅ Address selection completed successfully');
      
    } catch (error) {
      console.error('❌ Error processing address:', error);
      onConfirmationChange(false);
    } finally {
      setIsLoading(false);
    }

  }, [onAddressSelect, onConfirmationChange]);

  useEffect(() => {
    console.log('🔧 useEffect triggered - isApiLoaded:', isApiLoaded, 'inputRef.current:', !!inputRef.current, 'autocompleteRef.current:', !!autocompleteRef.current);
    
    if (!isApiLoaded) {
      console.log('⏳ Google Maps API not loaded yet');
      return;
    }

    if (!inputRef.current) {
      console.log('⏳ Input ref not available yet');
      return;
    }

    if (autocompleteRef.current) {
      console.log('✅ Autocomplete already initialized');
      return;
    }

    console.log('🔧 Initializing Google Places Autocomplete...');

    try {
      // Verify Google Maps API is available
      if (!window.google?.maps?.places?.Autocomplete) {
        console.error('❌ Google Places API not available');
        return;
      }

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'IT' },
        fields: ['formatted_address', 'geometry', 'address_components', 'name', 'place_id']
      });

      autocompleteRef.current = autocomplete;
      autocomplete.addListener('place_changed', handlePlaceSelect);
      
      console.log('✅ Google Places Autocomplete initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
        console.log('🧹 Cleaned up autocomplete listeners');
      }
    };
  }, [isApiLoaded, handlePlaceSelect]);

  return { 
    inputRef, 
    isLoading
  };
};
