
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface SpecialPreferencesFilterProps {
  selectedPreferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
}

const SpecialPreferencesFilter: React.FC<SpecialPreferencesFilterProps> = ({ 
  selectedPreferences, 
  onPreferencesChange 
}) => {
  const specialPreferences = ['Accessibile', 'Pet-friendly', 'Vegano/Vegetariano', 'Sostenibile'];

  const togglePreference = (preference: string) => {
    let newPreferences;
    if (selectedPreferences.includes(preference)) {
      newPreferences = selectedPreferences.filter(p => p !== preference);
    } else {
      newPreferences = [...selectedPreferences, preference];
    }
    onPreferencesChange(newPreferences);
  };

  return (
    <div className="space-y-3">
      <Label className="font-semibold text-gray-700 flex items-center gap-2">
        <Heart className="h-4 w-4 text-pink-500" />
        Preferenze speciali
      </Label>
      <div className="grid grid-cols-1 gap-2">
        {specialPreferences.map((pref) => (
          <Button
            key={pref}
            size="sm"
            variant={selectedPreferences.includes(pref) ? "default" : "outline"}
            onClick={() => togglePreference(pref)}
            className={`justify-start text-sm ${
              selectedPreferences.includes(pref)
                ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg'
                : 'hover:bg-pink-50 hover:border-pink-300 border-2'
            }`}
          >
            {pref}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SpecialPreferencesFilter;
