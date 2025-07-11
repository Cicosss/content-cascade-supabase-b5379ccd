-- Refactoring Architettura Informativa: Passaggio da 3 livelli a 2 livelli
-- Rimozione macro_area e aggiornamento categorie alle 17 ufficiali

-- 1. Rimuovi la colonna macro_area da tutte le tabelle
ALTER TABLE public.points_of_interest 
DROP COLUMN IF EXISTS macro_area;

ALTER TABLE public.poi_submissions 
DROP COLUMN IF EXISTS macro_area;

ALTER TABLE public.events 
DROP COLUMN IF EXISTS macro_area;

-- 2. Aggiorna i constraint per le 17 nuove categorie ufficiali
ALTER TABLE public.points_of_interest 
DROP CONSTRAINT IF EXISTS points_of_interest_macro_area_check;

ALTER TABLE public.poi_submissions 
DROP CONSTRAINT IF EXISTS poi_submissions_macro_area_check;

ALTER TABLE public.events 
DROP CONSTRAINT IF EXISTS events_macro_area_check;

-- 3. Aggiungi constraint per le 17 categorie ufficiali
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

-- 4. Script di migrazione dati: mappa vecchie categorie alle nuove
-- Aggiorna categorie esistenti per allinearle alla nuova tassonomia
UPDATE public.points_of_interest 
SET category = CASE 
  WHEN category IN ('Rocche e Castelli', 'Borghi') THEN 'Storia e Borghi'
  WHEN category = 'Arte' THEN 'Musei'
  WHEN category = 'Artigianato' THEN 'Artigianato Locale'
  WHEN category = 'Cantine' THEN 'Cantine e Vigne'
  WHEN category = 'Mercati' THEN 'Mercati Locali'
  WHEN category = 'Parchi' THEN 'Parchi Naturali e Riserve'
  WHEN category IN ('Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre') THEN 'Eventi'
  WHEN category = 'Attività per Bambini' THEN 'Attività per Bambini'
  WHEN category = 'Natura' THEN 'Parchi Naturali e Riserve'
  ELSE category
END;

UPDATE public.poi_submissions 
SET category = CASE 
  WHEN category IN ('Rocche e Castelli', 'Borghi') THEN 'Storia e Borghi'
  WHEN category = 'Arte' THEN 'Musei'
  WHEN category = 'Artigianato' THEN 'Artigianato Locale'
  WHEN category = 'Cantine' THEN 'Cantine e Vigne'
  WHEN category = 'Mercati' THEN 'Mercati Locali'
  WHEN category = 'Parchi' THEN 'Parchi Naturali e Riserve'
  WHEN category IN ('Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre') THEN 'Eventi'
  WHEN category = 'Attività per Bambini' THEN 'Attività per Bambini'
  WHEN category = 'Natura' THEN 'Parchi Naturali e Riserve'
  ELSE category
END;

UPDATE public.events 
SET category = 'Eventi';