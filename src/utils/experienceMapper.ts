
import { parseCSVLine } from './csvParser';

export const mapCsvRowToExperience = (values: string[], headers: string[], rowIndex: number) => {
  console.log(`📝 Riga ${rowIndex + 1}:`, { values: values.slice(0, 5) });
  
  if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
    console.log(`⏭️ Riga ${rowIndex + 1} vuota, saltata`);
    return null;
  }

  // Inizializza submission per poi_submissions table
  const submission: any = {
    submitter_email: 'admin@miaromagna.it',
    poi_type: 'place',
    macro_area: 'Gusto & Sapori',
    category: 'Ristoranti',
    target_audience: 'everyone',
    status: 'pending'
  };

  let hasRequiredFields = false;

  headers.forEach((header, index) => {
    const value = values[index] ? values[index].trim() : '';
    const lowerHeader = header.toLowerCase();
    
    // Mapping per tutti i campi del schema poi_submissions
    if (lowerHeader.includes('submitter_email') || lowerHeader.includes('email_submitter')) {
      submission.submitter_email = value || 'admin@miaromagna.it';
    } else if (lowerHeader.includes('name') || lowerHeader.includes('nome')) {
      if (value) {
        submission.name = value;
        hasRequiredFields = true;
      }
    } else if (lowerHeader.includes('description') || lowerHeader.includes('descrizione')) {
      submission.description = value || null;
    } else if (lowerHeader.includes('poi_type') || lowerHeader.includes('tipo')) {
      submission.poi_type = value || 'place';
    } else if (lowerHeader.includes('macro_area') || lowerHeader.includes('area')) {
      submission.macro_area = value || 'Gusto & Sapori';
    } else if (lowerHeader.includes('category') || lowerHeader.includes('categoria')) {
      submission.category = value || 'Ristoranti';
    } else if (lowerHeader.includes('address') || lowerHeader.includes('indirizzo')) {
      submission.address = value || null;
    } else if (lowerHeader.includes('latitude') || lowerHeader.includes('latitudine')) {
      if (value && !isNaN(parseFloat(value))) {
        submission.latitude = parseFloat(value);
      }
    } else if (lowerHeader.includes('longitude') || lowerHeader.includes('longitudine')) {
      if (value && !isNaN(parseFloat(value))) {
        submission.longitude = parseFloat(value);
      }
    } else if (lowerHeader.includes('location_name') || lowerHeader.includes('nome_localita')) {
      submission.location_name = value || null;
    } else if (lowerHeader.includes('organizer_info') || lowerHeader.includes('organizzatore')) {
      submission.organizer_info = value || null;
    } else if (lowerHeader.includes('price_info') || lowerHeader.includes('prezzo')) {
      submission.price_info = value || null;
    } else if (lowerHeader.includes('duration_info') || lowerHeader.includes('durata')) {
      submission.duration_info = value || null;
    } else if (lowerHeader.includes('target_audience') || lowerHeader.includes('pubblico')) {
      submission.target_audience = value || 'everyone';
    } else if (lowerHeader.includes('phone') || lowerHeader.includes('telefono')) {
      submission.phone = value || null;
    } else if (lowerHeader.includes('email') && !lowerHeader.includes('submitter')) {
      submission.email = value || null;
    } else if (lowerHeader.includes('website_url') || lowerHeader.includes('sito')) {
      submission.website_url = value || null;
    } else if (lowerHeader.includes('start_datetime') || lowerHeader.includes('data_inizio')) {
      if (value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            submission.start_datetime = date.toISOString();
          }
        } catch (e) {
          console.warn(`Formato data non valido per start_datetime: ${value}`);
        }
      }
    } else if (lowerHeader.includes('end_datetime') || lowerHeader.includes('data_fine')) {
      if (value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            submission.end_datetime = date.toISOString();
          }
        } catch (e) {
          console.warn(`Formato data non valido per end_datetime: ${value}`);
        }
      }
    } else if (lowerHeader.includes('opening_hours') || lowerHeader.includes('orari')) {
      submission.opening_hours = value || null;
    } else if (lowerHeader.includes('tags') || lowerHeader.includes('tag')) {
      if (value) {
        submission.tags = value.split(',').map(t => t.trim()).filter(t => t);
      }
    } else if (lowerHeader.includes('images') || lowerHeader.includes('immagini')) {
      if (value) {
        submission.images = value.split(',').map(img => img.trim()).filter(img => img);
      }
    } else if (lowerHeader.includes('video_url') || lowerHeader.includes('video')) {
      submission.video_url = value || null;
    }
  });

  if (hasRequiredFields && submission.name) {
    console.log(`✅ Submission mappata: ${submission.name}`);
    return submission;
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
