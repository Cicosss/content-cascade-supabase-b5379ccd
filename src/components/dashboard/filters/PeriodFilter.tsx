
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PeriodFilterProps {
  selectedPeriod: any;
  onPeriodChange: (period: any) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
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
              !selectedPeriod && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedPeriod ? format(selectedPeriod, "PPP") : <span>Seleziona data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedPeriod}
            onSelect={onPeriodChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PeriodFilter;
