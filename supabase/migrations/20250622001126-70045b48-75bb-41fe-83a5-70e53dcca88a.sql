
-- Correggere il nome del POI specifico da "Cattolica" a "Trattoria Gina"
-- e impostare Cattolica come location_name
UPDATE points_of_interest 
SET 
  name = 'Trattoria Gina',
  location_name = 'Cattolica'
WHERE id = 'f1ade38a-31eb-4586-ab71-589213826edb';

-- Verificare se ci sono altri POI che hanno nomi di città nel campo name
-- Questa query ci aiuterà a identificare altri casi simili
SELECT id, name, location_name, address, category
FROM points_of_interest 
WHERE name IN ('Cattolica', 'Rimini', 'Riccione', 'Cesenatico', 'Bellaria', 'Igea Marina', 'Misano Adriatico', 'San Mauro Pascoli', 'Gatteo', 'Santarcangelo')
AND status = 'approved';
