
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Calendar as CalendarIcon, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
  setFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const zones = ['tutto', 'centro', 'nord', 'sud', 'ovest', 'est'];
  const childrenOptions = ['no', 'sì'];
  const activityTypes = [
    'tutto', 'cibo', 'sport', 'arte e cultura', 'musica', 
    'parchi e natura', 'vita notturna', 'intrattenimento', 'altro'
  ];

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleActivityType = (type: string) => {
    if (type === 'tutto') {
      updateFilter('activityTypes', ['tutto']);
    } else {
      let newTypes = filters.activityTypes.filter(t => t !== 'tutto');
      if (newTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type);
      }
      if (newTypes.length === 0) {
        newTypes = ['tutto'];
      }
      updateFilter('activityTypes', newTypes);
    }
  };

  return (
    <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
          <Filter className="h-5 w-5 text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Personalizza la tua Esperienza
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Zone della Romagna */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" strokeWidth={1.5} />
            <Label className="font-semibold text-gray-700">Zone della Romagna</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {zones.map((zone) => (
              <Button
                key={zone}
                size="sm"
                variant={filters.zone === zone ? "default" : "outline"}
                onClick={() => updateFilter('zone', zone)}
                className={`text-xs capitalize ${
                  filters.zone === zone 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'hover:bg-red-50 hover:border-red-300'
                }`}
              >
                {zone}
              </Button>
            ))}
          </div>
        </div>

        {/* Con bambini */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" strokeWidth={1.5} />
            <Label className="font-semibold text-gray-700">Con bambini</Label>
          </div>
          <div className="flex gap-2">
            {childrenOptions.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={filters.withChildren === option ? "default" : "outline"}
                onClick={() => updateFilter('withChildren', option)}
                className={`text-xs ${
                  filters.withChildren === option 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Tipi di attività */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-green-500">🎯</span>
            <Label className="font-semibold text-gray-700">Tipi di attività</Label>
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
            {activityTypes.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filters.activityTypes.includes(type) ? "default" : "outline"}
                onClick={() => toggleActivityType(type)}
                className={`text-xs ${
                  filters.activityTypes.includes(type)
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Prima visita */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-purple-500" strokeWidth={1.5} />
            <Label className="font-semibold text-gray-700">Esperienza</Label>
          </div>
          <div className="space-y-2">
            <Button
              size="sm"
              variant={filters.isFirstVisit ? "default" : "outline"}
              onClick={() => updateFilter('isFirstVisit', true)}
              className={`w-full text-xs ${
                filters.isFirstVisit 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              Prima visita
            </Button>
            <Button
              size="sm"
              variant={!filters.isFirstVisit ? "default" : "outline"}
              onClick={() => updateFilter('isFirstVisit', false)}
              className={`w-full text-xs ${
                !filters.isFirstVisit 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              Locale/Esperto
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
