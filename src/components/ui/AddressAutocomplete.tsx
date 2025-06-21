
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMapsAPI } from '@/hooks/useGoogleMapsAPI';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import AddressFeedback from './AddressFeedback';

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
  const { isApiLoaded } = useGoogleMapsAPI();
  const [inputValue, setInputValue] = useState(value);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  
  const { inputRef, isLoading } = useAddressAutocomplete({ 
    isApiLoaded, 
    onAddressSelect: (addressData) => {
      console.log('🔄 AddressAutocomplete - Ricevuti dati da Google:', {
        address: addressData.address,
        lat: addressData.latitude,
        lng: addressData.longitude
      });
      
      // CORREZIONE: Aggiornamento sincrono dell'input value
      setInputValue(addressData.address);
      
      // Propaga i dati al componente padre
      onAddressSelect(addressData);
      
      console.log('✅ AddressAutocomplete - Dati propagati al form');
    },
    onAddressConfirmed: (isConfirmed) => {
      console.log('✅ AddressAutocomplete - Stato conferma aggiornato:', isConfirmed);
      setIsAddressConfirmed(isConfirmed);
    }
  });

  // Sincronizza il valore interno con il prop value
  useEffect(() => {
    if (value !== inputValue) {
      console.log('🔄 AddressAutocomplete - Sincronizzazione value:', { from: inputValue, to: value });
      setInputValue(value);
      
      // Se il valore viene modificato dall'esterno e non corrisponde all'input,
      // resetta lo stato di conferma
      if (value === '') {
        setIsAddressConfirmed(false);
        console.log('🔄 AddressAutocomplete - Reset conferma per valore vuoto');
      }
    }
  }, [value, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔄 AddressAutocomplete - Input change:', newValue);
    setInputValue(newValue);
    
    // Se l'utente digita manualmente, resetta lo stato di conferma
    if (isAddressConfirmed) {
      setIsAddressConfirmed(false);
      console.log('🔄 AddressAutocomplete - Reset conferma per input manuale');
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
        <AddressFeedback 
          isLoading={isLoading}
          isAddressConfirmed={isAddressConfirmed}
          isApiLoaded={isApiLoaded}
        />
      </div>
    </div>
  );
};

export default AddressAutocomplete;
