
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('Il file CSV deve contenere almeno una riga di header e una di dati');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const experiences = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          console.warn(`Riga ${i + 1} ignorata: numero di colonne non corrispondente`);
          continue;
        }

        const experience: any = {
          poi_type: 'experience',
          status: 'approved'
        };

        headers.forEach((header, index) => {
          const value = values[index];
          
          switch (header.toLowerCase()) {
            case 'name':
            case 'nome':
              experience.name = value;
              break;
            case 'description':
            case 'descrizione':
              experience.description = value;
              break;
            case 'category':
            case 'categoria':
              experience.category = value;
              break;
            case 'address':
            case 'indirizzo':
              experience.address = value;
              break;
            case 'latitude':
            case 'latitudine':
              experience.latitude = value ? parseFloat(value) : null;
              break;
            case 'longitude':
            case 'longitudine':
              experience.longitude = value ? parseFloat(value) : null;
              break;
            case 'price_info':
            case 'prezzo':
              experience.price_info = value;
              break;
            case 'duration_info':
            case 'durata':
              experience.duration_info = value;
              break;
            case 'target_audience':
            case 'pubblico':
              experience.target_audience = value || 'everyone';
              break;
            case 'website_url':
            case 'sito_web':
              experience.website_url = value;
              break;
            case 'phone':
            case 'telefono':
              experience.phone = value;
              break;
            case 'email':
              experience.email = value;
              break;
            case 'start_datetime':
            case 'data_inizio':
              experience.start_datetime = value || null;
              break;
            case 'end_datetime':
            case 'data_fine':
              experience.end_datetime = value || null;
              break;
            case 'location_name':
            case 'nome_location':
              experience.location_name = value;
              break;
            case 'organizer_info':
            case 'organizzatore':
              experience.organizer_info = value;
              break;
            case 'images':
            case 'immagini':
              // Parse images as pipe-separated URLs (up to 4 images)
              experience.images = value ? value.split('|').map(img => img.trim()).slice(0, 4) : [];
              break;
            case 'video_url':
            case 'video':
              experience.video_url = value;
              break;
          }
        });

        if (experience.name && experience.category) {
          experiences.push(experience);
        }
      }

      if (experiences.length === 0) {
        toast.error('Nessuna esperienza valida trovata nel CSV');
        return;
      }

      const { error } = await supabase
        .from('points_of_interest')
        .insert(experiences);

      if (error) {
        console.error('Error inserting experiences:', error);
        toast.error('Errore nell\'inserimento delle esperienze');
        return;
      }

      toast.success(`${experiences.length} esperienze inserite con successo!`);
      setCsvFile(null);
      onExperienceAdded();
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Errore nell\'elaborazione del file CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="csv-file">File CSV</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Formato CSV Richiesto
        </h4>
        <p className="text-sm text-blue-700 mb-2">
          Il file CSV deve contenere le seguenti colonne (nell'ordine che preferisci):
        </p>
        <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
          name,description,category,address,latitude,longitude,price_info,duration_info,target_audience,website_url,phone,email,start_datetime,end_datetime,location_name,organizer_info,images,video_url
        </code>
        <p className="text-xs text-blue-600 mt-2">
          * I campi obbligatori sono: name, category<br/>
          * Le coordinate latitude/longitude sono opzionali ma consigliate per la mappa<br/>
          * <strong>Date e ore:</strong> usa il formato ISO 8601 (es: 2024-12-25T15:30:00)<br/>
          * <strong>Per le immagini (max 4):</strong> separa gli URL con il carattere | (es: url1.jpg|url2.jpg|url3.jpg|url4.jpg)<br/>
          * Per i video: inserisci l'URL completo (YouTube, Vimeo, etc.)<br/>
          * Formato encoding: UTF-8
        </p>
      </div>

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
