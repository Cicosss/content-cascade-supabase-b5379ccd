
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parseCSV } from '@/utils/csvParser';
import { processCsvData } from '@/utils/experienceMapper';
import CsvFileInput from './CsvFileInput';
import CsvFormatGuide from './CsvFormatGuide';

interface ExperienceCsvUploaderProps {
  onExperienceAdded: () => void;
}

const ExperienceCsvUploader: React.FC<ExperienceCsvUploaderProps> = ({ onExperienceAdded }) => {
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Seleziona un file CSV');
      return;
    }

    setLoading(true);
    console.log('📄 Inizio elaborazione CSV:', csvFile.name);

    try {
      const text = await csvFile.text();
      const { headers, lines } = parseCSV(text);
      
      const { experiences, successCount, errorCount } = processCsvData(headers, lines);

      if (experiences.length === 0) {
        toast.error('Nessuna esperienza valida trovata nel CSV. Controlla che ci sia almeno una colonna "name" o "nome" con valori.');
        return;
      }

      console.log('💾 Inserimento in database...', experiences.length, 'esperienze');

      const { error } = await supabase
        .from('points_of_interest')
        .insert(experiences);

      if (error) {
        console.error('❌ Errore inserimento database:', error);
        toast.error(`Errore nell'inserimento: ${error.message}`);
        return;
      }

      const message = errorCount > 0 
        ? `${successCount} esperienze inserite con successo! ${errorCount} righe ignorate per errori.`
        : `${successCount} esperienze inserite con successo!`;
      
      toast.success(message);
      setCsvFile(null);
      onExperienceAdded();
    } catch (error) {
      console.error('💥 Errore generale:', error);
      toast.error(`Errore nell'elaborazione del file CSV: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CsvFileInput csvFile={csvFile} onFileChange={setCsvFile} />
      
      <CsvFormatGuide />

      <Button 
        onClick={handleCsvUpload} 
        disabled={!csvFile || loading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {loading ? 'Caricamento...' : 'Carica CSV'}
      </Button>
    </div>
  );
};

export default ExperienceCsvUploader;
