
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  const activityTypes = [
    { id: 'tutto', label: 'Tutto', icon: '🎯' },
    { id: 'cibo', label: 'Cibo', icon: '🍝' },
    { id: 'sport', label: 'Sport', icon: '⚽' },
    { id: 'arte e cultura', label: 'Arte e Cultura', icon: '🎭' },
    { id: 'musica', label: 'Musica', icon: '🎵' },
    { id: 'parchi e natura', label: 'Parchi e Natura', icon: '🌳' },
    { id: 'vita notturna', label: 'Vita Notturna', icon: '🌙' },
    { id: 'intrattenimento', label: 'Intrattenimento', icon: '🎪' },
    { id: 'altro', label: 'Altro', icon: '📍' }
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
    <Card className="mt-6 p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Filtri Avanzati
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Con Bambini */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <Label className="font-semibold text-gray-700">Con bambini</Label>
          </div>
          <RadioGroup 
            value={filters.withChildren} 
            onValueChange={(value) => updateFilter('withChildren', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-children" />
              <Label htmlFor="no-children" className="text-sm font-medium">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sì" id="with-children" />
              <Label htmlFor="with-children" className="text-sm font-medium">Sì</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Periodo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-green-500" />
            <Label className="font-semibold text-gray-700">Periodo</Label>
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
                {filters.period ? (
                  filters.period.from ? (
                    filters.period.to ? (
                      <>
                        {format(filters.period.from, "dd LLL")} -{" "}
                        {format(filters.period.to, "dd LLL y")}
                      </>
                    ) : (
                      format(filters.period.from, "dd LLL y")
                    )
                  ) : (
                    "Seleziona periodo"
                  )
                ) : (
                  "Seleziona periodo"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.period?.from}
                selected={filters.period}
                onSelect={(range) => updateFilter('period', range)}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Prima Visita */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <Label className="font-semibold text-gray-700">Tipo di esperienza</Label>
          </div>
          <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200">
            <Switch
              checked={filters.isFirstVisit}
              onCheckedChange={(checked) => updateFilter('isFirstVisit', checked)}
            />
            <div>
              <Label className="text-sm font-medium">
                {filters.isFirstVisit ? 'Prima visita' : 'Locale/Esperto'}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                {filters.isFirstVisit 
                  ? 'Mostra attrazioni turistiche principali' 
                  : 'Mostra esperienze autentiche e locali'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tipi di Attività */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-500">🎯</span>
          <Label className="font-semibold text-gray-700">Tipi di attività</Label>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {activityTypes.map((type) => (
            <div key={type.id} className="flex flex-col items-center">
              <Button
                variant={filters.activityTypes.includes(type.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleActivityType(type.id)}
                className={cn(
                  "w-full h-16 flex-col gap-1 text-xs transition-all duration-200",
                  filters.activityTypes.includes(type.id)
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
                    : "hover:bg-purple-50 hover:border-purple-300 hover:shadow-md"
                )}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="leading-tight">{type.label}</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Filtri Attivi */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600">Filtri attivi:</span>
          
          {filters.withChildren === 'sì' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Con bambini
            </span>
          )}
          
          {filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto') && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {filters.activityTypes.length} attività selezionate
            </span>
          )}
          
          {filters.period?.from && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Periodo selezionato
            </span>
          )}
          
          {filters.isFirstVisit && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Prima visita
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdvancedFilters;
