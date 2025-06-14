
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Star } from 'lucide-react';

interface AdvancedFiltersToggleProps {
  showAdvanced: boolean;
  onToggle: (show: boolean) => void;
}

const AdvancedFiltersToggle: React.FC<AdvancedFiltersToggleProps> = ({ showAdvanced, onToggle }) => {
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-yellow-500" />
          <Label className="text-xl font-bold text-slate-900">Filtri Avanzati</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="advanced-filters" className="text-sm font-medium">
            Mostra filtri avanzati
          </Label>
          <Switch
            id="advanced-filters"
            checked={showAdvanced}
            onCheckedChange={onToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersToggle;
