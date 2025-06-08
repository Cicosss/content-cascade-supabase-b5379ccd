
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Calendar as CalendarIcon, Filter, Clock, Star, Heart } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
  setFilters: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, setFilters }) => {
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
    <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
          <Filter className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Personalizza la tua Esperienza
          </h2>
          <p className="text-slate-600 mt-1">
            Filtra e scopri la Romagna su misura per te
          </p>
        </div>
      </div>

      {/* Filtri Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        
        {/* Zone della Romagna */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-red-500" />
            <Label className="font-bold text-gray-800 text-lg">Zone della Romagna</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {zones.map((zone) => (
              <Button
                key={zone}
                size="sm"
                variant={filters.zone === zone ? "default" : "outline"}
                onClick={() => updateFilter('zone', zone)}
                className={`text-sm capitalize font-medium ${
                  filters.zone === zone 
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                    : 'hover:bg-red-50 hover:border-red-300 border-2'
                }`}
              >
                {zone}
              </Button>
            ))}
          </div>
        </div>

        {/* Con bambini */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-500" />
            <Label className="font-bold text-gray-800 text-lg">Con bambini</Label>
          </div>
          <div className="flex gap-3">
            {childrenOptions.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={filters.withChildren === option ? "default" : "outline"}
                onClick={() => updateFilter('withChildren', option)}
                className={`text-sm font-medium flex-1 ${
                  filters.withChildren === option 
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-lg' 
                    : 'hover:bg-blue-50 hover:border-blue-300 border-2'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Tipi di attività */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-xl">🎯</span>
            <Label className="font-bold text-gray-800 text-lg">Tipi di attività</Label>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {activityTypes.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filters.activityTypes.includes(type) ? "default" : "outline"}
                onClick={() => toggleActivityType(type)}
                className={`text-sm font-medium justify-start ${
                  filters.activityTypes.includes(type)
                    ? 'bg-green-500 hover:bg-green-600 shadow-lg' 
                    : 'hover:bg-green-50 hover:border-green-300 border-2'
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Esperienza */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-purple-500" />
            <Label className="font-bold text-gray-800 text-lg">Esperienza</Label>
          </div>
          <div className="space-y-3">
            <Button
              size="sm"
              variant={filters.isFirstVisit ? "default" : "outline"}
              onClick={() => updateFilter('isFirstVisit', true)}
              className={`w-full text-sm font-medium ${
                filters.isFirstVisit 
                  ? 'bg-purple-500 hover:bg-purple-600 shadow-lg' 
                  : 'hover:bg-purple-50 hover:border-purple-300 border-2'
              }`}
            >
              Prima visita
            </Button>
            <Button
              size="sm"
              variant={!filters.isFirstVisit ? "default" : "outline"}
              onClick={() => updateFilter('isFirstVisit', false)}
              className={`w-full text-sm font-medium ${
                !filters.isFirstVisit 
                  ? 'bg-purple-500 hover:bg-purple-600 shadow-lg' 
                  : 'hover:bg-purple-50 hover:border-purple-300 border-2'
              }`}
            >
              Locale/Esperto
            </Button>
          </div>
        </div>
      </div>

      {/* Filtri Avanzati */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Filtri Avanzati
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Fascia oraria preferita */}
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              Fascia oraria preferita
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {['Mattina (6-12)', 'Pomeriggio (12-18)', 'Sera (18-24)', 'Notte (24-6)'].map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant="outline"
                  className="justify-start text-sm hover:bg-indigo-50 hover:border-indigo-300"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700 flex items-center gap-2">
              💰 Budget per persona
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {['€0-25', '€25-50', '€50-100', '€100+'].map((budget) => (
                <Button
                  key={budget}
                  size="sm"
                  variant="outline"
                  className="justify-start text-sm hover:bg-emerald-50 hover:border-emerald-300"
                >
                  {budget}
                </Button>
              ))}
            </div>
          </div>

          {/* Preferenze speciali */}
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Preferenze speciali
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {['Accessibile', 'Pet-friendly', 'Vegano/Vegetariano', 'Sostenibile'].map((pref) => (
                <Button
                  key={pref}
                  size="sm"
                  variant="outline"
                  className="justify-start text-sm hover:bg-pink-50 hover:border-pink-300"
                >
                  {pref}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedFilters;
