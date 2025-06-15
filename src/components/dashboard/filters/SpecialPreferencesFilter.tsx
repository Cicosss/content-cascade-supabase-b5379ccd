
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SpecialPreferencesFilterProps {
  selectedPreferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
  includeChildrenFriendly?: boolean;
}

const SpecialPreferencesFilter: React.FC<SpecialPreferencesFilterProps> = ({ 
  selectedPreferences, 
  onPreferencesChange,
  includeChildrenFriendly = false
}) => {
  const basePreferences = [
    'Pet-Friendly',
    'Accessibile',
    'Romantico',
    'Opzioni Vegetariane',
    'Gratuito',
    'All\'aperto',
    'Al coperto',
    'Prenotazione richiesta',
    'Parcheggio disponibile'
  ];

  // Aggiungi "Adatto ai bambini" se richiesto
  const preferences = includeChildrenFriendly 
    ? ['Adatto ai bambini', ...basePreferences]
    : basePreferences;

  const togglePreference = (preference: string) => {
    const newPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference];
    
    onPreferencesChange(newPreferences);
  };

  const getButtonClassName = (preference: string) => {
    const isSelected = selectedPreferences.includes(preference);
    return `text-xs ${
      isSelected
        ? 'bg-purple-500 hover:bg-purple-600' 
        : 'hover:bg-purple-50 hover:border-purple-300'
    }`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-purple-500">✨</span>
        <Label className="font-semibold text-gray-700">Preferenze Speciali</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        {preferences.map((preference) => (
          <Button
            key={preference}
            size="sm"
            variant={selectedPreferences.includes(preference) ? "default" : "outline"}
            onClick={() => togglePreference(preference)}
            className={getButtonClassName(preference)}
          >
            {preference}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SpecialPreferencesFilter;
