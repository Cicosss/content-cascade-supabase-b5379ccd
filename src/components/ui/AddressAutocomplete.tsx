
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
  const { inputRef, isLoading } = useAddressAutocomplete({ isApiLoaded, onAddressSelect });
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
