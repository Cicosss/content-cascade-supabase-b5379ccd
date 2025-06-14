
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Users, Calendar as CalendarIcon, Filter, Clock, Star, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  setFilters: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, setFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const zones = ['tutto', 'centro', 'nord', 'sud', 'ovest', 'est'];
  const childrenOptions = ['no', 'sì'];
  const activityTypes = [
    { id: 'tutto', label: 'tutto', icon: '🎯' },
    { id: 'cibo', label: 'cibo', icon: '🍝' },
    { id: 'sport', label: 'sport', icon: '⚽' },
    { id: 'arte e cultura', label: 'arte e cultura', icon: '🎨' },
    { id: 'musica', label: 'musica', icon: '🎵' },
    { id: 'parchi e natura', label: 'parchi e natura', icon: '🌳' },
    { id: 'vita notturna', label: 'vita notturna', icon: '🌙' },
    { id: 'intrattenimento', label: 'intrattenimento', icon: '🎪' },
    { id: 'altro', label: 'altro', icon: '🔮' }
  ];

  const timeSlots = ['Mattina (6-12)', 'Pomeriggio (12-18)', 'Sera (18-24)', 'Notte (24-6)'];
  const budgetOptions = ['€0-25', '€25-50', '€50-100', '€100+'];
  const specialPreferences = ['Accessibile', 'Pet-friendly', 'Vegano/Vegetariano', 'Sostenibile'];

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

  const toggleAdvancedFilter = (filterType: 'timeSlots' | 'budgets' | 'specialPreferences', value: string) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v: string) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    updateFilter(filterType, newValues);
  };

  return (
    <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
          <Filter className="h-6 w-6 text-white" strokeWidth={1.5} fill="none" />
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

        {/* Periodo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            <Label className="font-bold text-gray-800 text-lg">Periodo</Label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.period && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.period ? format(filters.period, "PPP") : <span>Seleziona data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.period}
                onSelect={(date) => updateFilter('period', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Esperienza */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-purple-500" />
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

      {/* Tipi di attività - Sezione orizzontale */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">🎯</span>
          <Label className="font-bold text-gray-800 text-lg">Tipi di attività</Label>
        </div>
        <div className="flex flex-wrap gap-3">
          {activityTypes.map((type) => (
            <Button
              key={type.id}
              size="sm"
              variant={filters.activityTypes.includes(type.id) ? "default" : "outline"}
              onClick={() => toggleActivityType(type.id)}
              className={`text-sm font-medium flex items-center gap-2 ${
                filters.activityTypes.includes(type.id)
                  ? 'bg-green-500 hover:bg-green-600 shadow-lg' 
                  : 'hover:bg-green-50 hover:border-green-300 border-2'
              }`}
            >
              <span className="text-base">{type.icon}</span>
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Switch per Filtri Avanzati */}
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
              onCheckedChange={setShowAdvanced}
            />
          </div>
        </div>
      </div>

      {/* Filtri Avanzati - Condizionali */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Fascia oraria preferita */}
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              Fascia oraria preferita
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant={(filters.timeSlots || []).includes(time) ? "default" : "outline"}
                  onClick={() => toggleAdvancedFilter('timeSlots', time)}
                  className={`justify-start text-sm ${
                    (filters.timeSlots || []).includes(time)
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg'
                      : 'hover:bg-indigo-50 hover:border-indigo-300 border-2'
                  }`}
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
              {budgetOptions.map((budget) => (
                <Button
                  key={budget}
                  size="sm"
                  variant={(filters.budgets || []).includes(budget) ? "default" : "outline"}
                  onClick={() => toggleAdvancedFilter('budgets', budget)}
                  className={`justify-start text-sm ${
                    (filters.budgets || []).includes(budget)
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                      : 'hover:bg-emerald-50 hover:border-emerald-300 border-2'
                  }`}
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
              {specialPreferences.map((pref) => (
                <Button
                  key={pref}
                  size="sm"
                  variant={(filters.specialPreferences || []).includes(pref) ? "default" : "outline"}
                  onClick={() => toggleAdvancedFilter('specialPreferences', pref)}
                  className={`justify-start text-sm ${
                    (filters.specialPreferences || []).includes(pref)
                      ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg'
                      : 'hover:bg-pink-50 hover:border-pink-300 border-2'
                  }`}
                >
                  {pref}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AdvancedFilters;
