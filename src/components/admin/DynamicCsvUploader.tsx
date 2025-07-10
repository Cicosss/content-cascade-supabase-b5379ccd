import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSchemaColumns } from '@/hooks/useSchemaColumns';
import { parseCSVLine } from '@/utils/csvParser';

interface DynamicCsvUploaderProps {
  onSuccess: () => void;
}

const DynamicCsvUploader: React.FC<DynamicCsvUploaderProps> = ({ onSuccess }) => {
  const { columns, requiredColumns, optionalColumns, loading, error, downloadTemplate } = useSchemaColumns();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
    setPreviewData([]);
    setIsValidated(false);
  };

  const validateAndPreviewCsv = async () => {
    if (!csvFile) {
      toast.error('Seleziona un file CSV');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('Il file deve contenere almeno una riga di intestazione e una di dati');
        return;
      }

      // Parsing intestazione
      const headerLine = lines[0];
      const fileHeaders = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());
      const expectedHeaders = columns.map(col => col.column_name.toLowerCase());

      console.log('🔍 Intestazioni del file:', fileHeaders);
      console.log('🎯 Intestazioni attese:', expectedHeaders);

      // Validazione intestazioni
      const missingRequired = requiredColumns
        .map(col => col.column_name.toLowerCase())
        .filter(req => !fileHeaders.includes(req));

      if (missingRequired.length > 0) {
        toast.error(`Colonne obbligatorie mancanti: ${missingRequired.join(', ')}`);
        return;
      }

      // Preview dati (prime 5 righe)
      const dataLines = lines.slice(1, 6);
      const preview = dataLines.map((line, idx) => {
        const values = parseCSVLine(line);
        const rowData: any = { _rowNumber: idx + 2 };
        
        fileHeaders.forEach((header, colIdx) => {
          if (values[colIdx] !== undefined) {
            rowData[header] = values[colIdx];
          }
        });
        
        return rowData;
      });

      setPreviewData(preview);
      setIsValidated(true);
      toast.success(`File validato! ${lines.length - 1} righe di dati trovate.`);

    } catch (error) {
      console.error('Errore validazione CSV:', error);
      toast.error('Errore nella lettura del file CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCsvUpload = async () => {
    if (!csvFile || !isValidated) return;

    setIsProcessing(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headerLine = lines[0];
      const fileHeaders = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());
      
      const dataRows = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          const rowData: any = {
            submitter_email: 'admin@miaromagna.it', // Default admin
            status: 'pending'
          };

          // Mapping dei valori
          fileHeaders.forEach((header, colIdx) => {
            if (values[colIdx] && values[colIdx].trim()) {
              const value = values[colIdx].trim();
              
              // Conversioni per tipi specifici
              if (header === 'latitude' || header === 'longitude') {
                const num = parseFloat(value);
                if (!isNaN(num)) rowData[header] = num;
              } else if (header === 'tags' && value) {
                rowData[header] = value.split(',').map(t => t.trim()).filter(t => t);
              } else if (header === 'images' && value) {
                rowData[header] = value.split(',').map(t => t.trim()).filter(t => t);
              } else {
                rowData[header] = value;
              }
            }
          });

          // Controllo campi obbligatori
          const hasRequiredFields = requiredColumns.every(col => 
            col.column_name === 'submitter_email' || rowData[col.column_name]
          );

          if (hasRequiredFields) {
            dataRows.push(rowData);
            successCount++;
          } else {
            console.warn(`Riga ${i + 1} saltata: campi obbligatori mancanti`);
            errorCount++;
          }
        } catch (error) {
          console.error(`Errore riga ${i + 1}:`, error);
          errorCount++;
        }
      }

      if (dataRows.length === 0) {
        toast.error('Nessuna riga valida trovata nel CSV');
        return;
      }

      // Inserimento nel database
      const { error: insertError } = await supabase
        .from('poi_submissions')
        .insert(dataRows);

      if (insertError) {
        throw insertError;
      }

      const message = errorCount > 0 
        ? `${successCount} POI inseriti con successo! ${errorCount} righe ignorate.`
        : `${successCount} POI inseriti con successo!`;
      
      toast.success(message);
      setCsvFile(null);
      setPreviewData([]);
      setIsValidated(false);
      onSuccess();

    } catch (error) {
      console.error('Errore nell\'importazione:', error);
      toast.error(`Errore nell'importazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 animate-spin" />
          <span>Caricamento schema database...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Errore nel caricamento dello schema: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sezione Istruzioni */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Formato CSV Richiesto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Il tuo file CSV deve contenere esattamente le seguenti colonne, nello stesso ordine. 
              La prima riga del file deve essere l'intestazione.
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="font-medium mb-2">Colonne Obbligatorie:</h4>
            <code className="text-sm bg-muted p-2 rounded block">
              {requiredColumns.map(col => col.column_name).join(', ')}
            </code>
          </div>

          <div>
            <h4 className="font-medium mb-2">Colonne Opzionali:</h4>
            <code className="text-sm bg-muted p-2 rounded block">
              {optionalColumns.map(col => col.column_name).join(', ')}
            </code>
          </div>

          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Scarica Template CSV Aggiornato
          </Button>
        </CardContent>
      </Card>

      {/* Sezione Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Carica File CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Seleziona File CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={validateAndPreviewCsv}
              disabled={!csvFile || isProcessing}
              variant="outline"
              className="flex-1"
            >
              {isProcessing ? 'Validazione...' : 'Carica e Analizza CSV'}
            </Button>

            {isValidated && (
              <Button 
                onClick={processCsvUpload}
                disabled={isProcessing}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Importazione...' : 'Conferma Importazione'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sezione Preview */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Anteprima Dati (Prime 5 righe)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2">Riga</th>
                    {columns.slice(0, 5).map(col => (
                      <th key={col.column_name} className="border border-border p-2">
                        {col.column_name}
                      </th>
                    ))}
                    <th className="border border-border p-2">...</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border border-border p-2 font-mono">
                        {row._rowNumber}
                      </td>
                      {columns.slice(0, 5).map(col => (
                        <td key={col.column_name} className="border border-border p-2">
                          {row[col.column_name] || '—'}
                        </td>
                      ))}
                      <td className="border border-border p-2 text-muted-foreground">
                        ...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicCsvUploader;