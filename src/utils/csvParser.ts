
export const parseCSVLine = (line: string): string[] => {
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

export const parseCSV = (text: string) => {
  console.log('📝 Contenuto CSV letto:', { size: text.length, preview: text.substring(0, 200) });
  
  // Normalizza le interruzioni di riga e rimuovi righe vuote
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').filter(line => line.trim().length > 0);
  
  console.log('📊 Righe trovate:', lines.length);
  
  if (lines.length < 2) {
    throw new Error('Il file CSV deve contenere almeno una riga di header e una di dati');
  }

  // Parser più robusto per l'header
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  console.log('🏷️ Headers trovati:', headers);
  
  return { headers, lines: lines.slice(1) };
};
