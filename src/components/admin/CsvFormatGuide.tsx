
import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

const CsvFormatGuide: React.FC = () => {
  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Formato CSV Richiesto
        </h4>
        <p className="text-sm text-blue-700 mb-2">
          Il file CSV deve contenere le seguenti colonne (nomi alternativi in italiano supportati):
        </p>
        <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
          name (nome), description (descrizione), category (categoria), address (indirizzo), latitude (latitudine), longitude (longitudine), price_info (prezzo), duration_info (durata), target_audience (pubblico), website_url (sito_web), phone (telefono), email, start_datetime (data_inizio), end_datetime (data_fine), location_name (nome_location), organizer_info (organizzatore), cover_image (immagine_copertina), images (immagini), video_url (video)
        </code>
        <div className="mt-3 space-y-1 text-xs text-blue-600">
          <p><strong>• Campo obbligatorio:</strong> name/nome</p>
          <p><strong>• Encoding:</strong> UTF-8 (salva il CSV con encoding UTF-8)</p>
          <p><strong>• Separatore:</strong> virgola (,)</p>
          <p><strong>• Date:</strong> formato ISO 8601 (es: 2024-12-25T15:30:00) o formati standard</p>
          <p><strong>• Cover Image:</strong> singolo URL per immagine copertina (es: https://example.com/cover.jpg)</p>
          <p><strong>• Immagini multiple:</strong> URL separati da | (es: https://example.com/img1.jpg|https://example.com/img2.jpg)</p>
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
    </>
  );
};

export default CsvFormatGuide;
