-- Refactoring Architettura Informativa: Migrazione sicura a 17 categorie
-- Prima mappatura dati, poi rimozione macro_area e constraint

-- 1. Prima mappa i dati esistenti alle nuove 17 categorie
UPDATE public.points_of_interest 
SET category = CASE 
  WHEN category = 'Festival' THEN 'Eventi'
  WHEN category = 'Mercati' THEN 'Mercati Locali'
  WHEN category = 'Parchi' THEN 'Parchi Naturali e Riserve'
  WHEN category = 'Ristoranti' THEN 'Ristoranti'
  WHEN category = 'Agriturismi' THEN 'Agriturismi'
  ELSE category
END;

UPDATE public.poi_submissions 
SET category = CASE 
  WHEN category = 'Festival' THEN 'Eventi'
  WHEN category = 'Mercati' THEN 'Mercati Locali'
  WHEN category = 'Parchi' THEN 'Parchi Naturali e Riserve'
  WHEN category = 'Ristoranti' THEN 'Ristoranti'
  WHEN category = 'Agriturismi' THEN 'Agriturismi'
  ELSE category
END;

-- 2. Aggiorna anche la tabella events
UPDATE public.events 
SET category = 'Eventi';

-- 3. Rimuovi la colonna macro_area da tutte le tabelle
ALTER TABLE public.points_of_interest 
DROP COLUMN IF EXISTS macro_area;

ALTER TABLE public.poi_submissions 
DROP COLUMN IF EXISTS macro_area;

ALTER TABLE public.events 
DROP COLUMN IF EXISTS macro_area;

-- 4. Rimuovi i vecchi constraint macro_area
ALTER TABLE public.points_of_interest 
DROP CONSTRAINT IF EXISTS points_of_interest_macro_area_check;

ALTER TABLE public.poi_submissions 
DROP CONSTRAINT IF EXISTS poi_submissions_macro_area_check;

ALTER TABLE public.events 
DROP CONSTRAINT IF EXISTS events_macro_area_check;

-- 5. Aggiungi constraint per le 17 categorie ufficiali
ALTER TABLE public.points_of_interest 
ADD CONSTRAINT points_of_interest_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Cantine e Vigne', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));

ALTER TABLE public.poi_submissions 
ADD CONSTRAINT poi_submissions_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Cantine e Vigne', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));

ALTER TABLE public.events 
ADD CONSTRAINT events_category_check 
CHECK (category IN (
  'Ristoranti', 'Agriturismi', 'Cantine e Vigne', 'Street Food', 'Mercati Locali',
  'Musei', 'Artigianato Locale', 'Storia e Borghi',
  'Eventi',
  'Spiagge', 'Parchi Naturali e Riserve', 'Sport',
  'Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 
  'Esperienze Educative', 'Vita Notturna'
));