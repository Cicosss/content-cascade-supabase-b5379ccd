
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateTimeFieldsProps {
  formData: {
    start_datetime: string;
    end_datetime: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ formData, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
        <Input
          id="start_datetime"
          type="datetime-local"
          value={formData.start_datetime}
          onChange={(e) => onInputChange('start_datetime', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="end_datetime">Data e Ora Fine</Label>
        <Input
          id="end_datetime"
          type="datetime-local"
          value={formData.end_datetime}
          onChange={(e) => onInputChange('end_datetime', e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateTimeFields;
