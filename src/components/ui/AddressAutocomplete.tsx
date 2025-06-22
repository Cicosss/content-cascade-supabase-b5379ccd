
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMapsInit } from '@/hooks/useGoogleMapsInit';
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
  onChange: (value: string) => void;
  onAddressSelect: (addressData: AddressData) => void;
  onConfirmationChange: (isConfirmed: boolean) => void;
  isConfirmed: boolean;
  className?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label = "Indirizzo",
  placeholder = "Inizia a digitare l'indirizzo...",
  value,
  onChange,
  onAddressSelect,
  onConfirmationChange,
  isConfirmed,
  className = "",
  required = false
}) => {
  const { isLoaded } = useGoogleMapsInit();
  
  const { inputRef, isLoading } = useAddressAutocomplete({ 
    isApiLoaded: isLoaded, 
    onAddressSelect,
    onConfirmationChange
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Se l'utente digita manualmente, resetta immediatamente la conferma
    if (isConfirmed && newValue !== value) {
      console.log('🔄 Resetting address confirmation due to manual typing');
      onConfirmationChange(false);
    }
    
    // Aggiorna sempre il valore
    onChange(newValue);
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
          value={value}
          onChange={handleInputChange}
          className={`pr-10 ${isConfirmed ? 'border-green-300 bg-green-50' : ''}`}
          disabled={!isLoaded}
          required={required}
        />
        <AddressFeedback 
          isLoading={isLoading}
          isConfirmed={isConfirmed}
          isApiLoaded={isLoaded}
        />
      </div>
    </div>
  );
};

export default AddressAutocomplete;
