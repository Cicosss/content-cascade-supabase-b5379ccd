
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CsvFileInputProps {
  csvFile: File | null;
  onFileChange: (file: File | null) => void;
}

const CsvFileInput: React.FC<CsvFileInputProps> = ({ csvFile, onFileChange }) => {
  return (
    <div>
      <Label htmlFor="csv-file">File CSV</Label>
      <Input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default CsvFileInput;
