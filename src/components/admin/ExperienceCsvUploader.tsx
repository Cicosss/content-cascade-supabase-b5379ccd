
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExperienceCsvUploaderProps {
  onExperienceAdded: () => void;
}

const ExperienceCsvUploader: React.FC<ExperienceCsvUploaderProps> = ({ onExperienceAdded }) => {
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Funzione per parsare CSV più robusta
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result.map(field => field.replace(/^"|"$/g, ''));
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Seleziona un file CSV');
      return;
    }

    setLoading(true);
    console.log('📄 Inizio elaborazione CSV:', csvFile.name);

    try {
      const text = await csvFile.text();
      console.log('📝 Contenuto CSV letto:', { size: text.length, preview: text.substring(0, 200) });
      
      // Normalizza le interruzioni di riga e rimuovi righe vuote
      const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const lines = normalizedText.split('\n').filter(line => line.trim().length > 0);
      
      console.log('📊 Righe trovate:', lines.length);
      
      if (lines.length < 2) {
        toast.error('Il file CSV deve contenere almeno una riga di header e una di dati');
        return;
      }

      // Parser più robusto per l'header
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      console.log('🏷️ Headers trovati:', headers);
      
      const experiences = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          console.log(`📝 Riga ${i + 1}:`, { values: values.slice(0, 5) }); // Log primi 5 valori
          
          if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
            console.log(`⏭️ Riga ${i + 1} vuota, saltata`);
            continue;
          }

          const experience: any = {
            poi_type: 'experience',
            status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          let hasRequiredFields = false;

          headers.forEach((header, index) => {
            const value = values[index] ? values[index].trim() : '';
            
            switch (header) {
              case 'name':
              case 'nome':
                if (value) {
                  experience.name = value;
                  hasRequiredFields = true;
                }
                break;
              case 'description':
              case 'descrizione':
                experience.description = value || null;
                break;
              case 'category':
              case 'categoria':
                if (value) {
                  experience.category = value;
                }
                break;
              case 'address':
              case 'indirizzo':
                experience.address = value || null;
                break;
              case 'latitude':
              case 'latitudine':
                if (value && !isNaN(parseFloat(value))) {
                  experience.latitude = parseFloat(value);
                }
                break;
              case 'longitude':
              case 'longitudine':
                if (value && !isNaN(parseFloat(value))) {
                  experience.longitude = parseFloat(value);
                }
                break;
              case 'price_info':
              case 'prezzo':
                experience.price_info = value || null;
                break;
              case 'duration_info':
              case 'durata':
                experience.duration_info = value || null;
                break;
              case 'target_audience':
              case 'pubblico':
                experience.target_audience = value || 'everyone';
                break;
              case 'website_url':
              case 'sito_web':
                experience.website_url = value || null;
                break;
              case 'phone':
              case 'telefono':
                experience.phone = value || null;
                break;
              case 'email':
                experience.email = value || null;
                break;
              case 'start_datetime':
              case 'data_inizio':
                if (value) {
                  try {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                      experience.start_datetime = date.toISOString();
                    }
                  } catch (e) {
                    console.warn(`Formato data non valido per start_datetime: ${value}`);
                  }
                }
                break;
              case 'end_datetime':
              case 'data_fine':
                if (value) {
                  try {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                      experience.end_datetime = date.toISOString();
                    }
                  } catch (e) {
                    console.warn(`Formato data non valido per end_datetime: ${value}`);
                  }
                }
                break;
              case 'location_name':
              case 'nome_location':
                experience.location_name = value || null;
                break;
              case 'organizer_info':
              case 'organizzatore':
                experience.organizer_info = value || null;
                break;
              case 'images':
              case 'immagini':
                if (value) {
                  try {
                    const imageUrls = value.split('|').map(img => img.trim()).filter(img => img.length > 0);
                    experience.images = imageUrls.slice(0, 4);
                  } catch (e) {
                    console.warn(`Errore nel parsing delle immagini: ${value}`);
                    experience.images = [];
                  }
                } else {
                  experience.images = [];
                }
                break;
              case 'video_url':
              case 'video':
                experience.video_url = value || null;
                break;
            }
          });

          // Imposta valori di default per campi obbligatori se mancanti
          if (!experience.category) {
            experience.category = 'esperienza';
          }

          if (hasRequiredFields && experience.name) {
            experiences.push(experience);
            successCount++;
            console.log(`✅ Esperienza ${successCount} aggiunta:`, experience.name);
          } else {
            errorCount++;
            console.warn(`❌ Riga ${i + 1} ignorata: mancano campi obbligatori (name)`);
          }
        } catch (rowError) {
          errorCount++;
          console.error(`❌ Errore nella riga ${i + 1}:`, rowError);
        }
      }

      console.log(`📊 Risultati parsing: ${successCount} successi, ${errorCount} errori`);

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
          Il file CSV deve contenere le seguenti colonne (nomi alternativi in italiano supportati):
        </p>
        <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
          name (nome), description (descrizione), category (categoria), address (indirizzo), latitude (latitudine), longitude (longitudine), price_info (prezzo), duration_info (durata), target_audience (pubblico), website_url (sito_web), phone (telefono), email, start_datetime (data_inizio), end_datetime (data_fine), location_name (nome_location), organizer_info (organizzatore), images (immagini), video_url (video)
        </code>
        <div className="mt-3 space-y-1 text-xs text-blue-600">
          <p><strong>• Campo obbligatorio:</strong> name/nome</p>
          <p><strong>• Encoding:</strong> UTF-8 (salva il CSV con encoding UTF-8)</p>
          <p><strong>• Separatore:</strong> virgola (,)</p>
          <p><strong>• Date:</strong> formato ISO 8601 (es: 2024-12-25T15:30:00) o formati standard</p>
          <p><strong>• Immagini:</strong> fino a 4 URL separati da | (es: url1.jpg|url2.jpg)</p>
          <p><strong>• Coordinate:</strong> numeri decimali (es: 44.0646, 12.5736)</p>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>Suggerimenti per risolvere errori:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Salva il CSV con encoding UTF-8</li>
              <li>Usa virgole come separatori</li>
              <li>Racchiudi i valori contenenti virgole tra virgolette</li>
              <li>Verifica che la prima riga contenga i nomi delle colonne</li>
            </ul>
          </div>
        </div>
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
