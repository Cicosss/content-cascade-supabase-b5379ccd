
import { parseCSVLine } from './csvParser';

export const mapCsvRowToExperience = (values: string[], headers: string[], rowIndex: number) => {
  console.log(`📝 Riga ${rowIndex + 1}:`, { values: values.slice(0, 5) }); // Log primi 5 valori
  
  if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
    console.log(`⏭️ Riga ${rowIndex + 1} vuota, saltata`);
    return null;
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
    return experience;
  } else {
    console.warn(`❌ Riga ${rowIndex + 1} ignorata: mancano campi obbligatori (name)`);
    return null;
  }
};

export const processCsvData = (headers: string[], lines: string[]) => {
  const experiences = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      const experience = mapCsvRowToExperience(values, headers, i);
      
      if (experience) {
        experiences.push(experience);
        successCount++;
        console.log(`✅ Esperienza ${successCount} aggiunta:`, experience.name);
      } else {
        errorCount++;
      }
    } catch (rowError) {
      errorCount++;
      console.error(`❌ Errore nella riga ${i + 1}:`, rowError);
    }
  }

  console.log(`📊 Risultati parsing: ${successCount} successi, ${errorCount} errori`);
  
  return { experiences, successCount, errorCount };
};
