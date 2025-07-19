
-- Aggiorna i constraint per sostituire "Cantine e Vigne" con "Aziende Agricole"

-- 1. Rimuovi i vecchi constraint
ALTER TABLE public.points_of_interest 
DROP CONSTRAINT IF EXISTS points_of_interest_category_check;

ALTER TABLE public.poi_submissions 
DROP CONSTRAINT IF EXISTS poi_submissions_category_check;

ALTER TABLE public.events 
DROP CONSTRAINT IF EXISTS events_category_check;

-- 2. Aggiungi i nuovi constraint con "Aziende Agricole" al posto di "Cantine e Vigne"
ALTER TABLE public.points_of_interest 
ADD CONSTRAINT points_of_interest_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));

ALTER TABLE public.poi_submissions 
ADD CONSTRAINT poi_submissions_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));

ALTER TABLE public.events 
ADD CONSTRAINT events_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));
