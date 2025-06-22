
import { useState, useEffect, useRef } from 'react';
import { FormData } from './POIFormData';

export const useGoogleMaps = (
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setIsAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Caricamento Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Inizializzazione Google Places Autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !addressInputRef.current || autocompleteRef.current) {
      return;
    }

    try {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'IT' },
        fields: ['formatted_address', 'geometry', 'address_components']
      });

      autocompleteRef.current = autocomplete;
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          console.log('❌ Nessuna geometria nel luogo selezionato');
          return;
        }

        let city = '';
        if (place.address_components) {
          place.address_components.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
          });
        }

        setFormData(prev => ({
          ...prev,
          address: place.formatted_address || '',
          latitude: place.geometry!.location!.lat().toString(),
          longitude: place.geometry!.location!.lng().toString(),
          location_name: prev.location_name || city
        }));

        setIsAddressConfirmed(true);
        console.log('✅ Indirizzo confermato da Google Places');
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, setFormData, setIsAddressConfirmed]);

  return {
    isGoogleMapsLoaded,
    addressInputRef
  };
};
