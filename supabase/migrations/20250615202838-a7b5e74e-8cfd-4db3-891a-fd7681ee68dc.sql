
-- Aggiorna la tabella points_of_interest per la nuova struttura
ALTER TABLE public.points_of_interest 
DROP COLUMN IF EXISTS poi_type,
DROP COLUMN IF EXISTS category;

-- Aggiungi i nuovi campi per la struttura gerarchica
ALTER TABLE public.points_of_interest 
ADD COLUMN macro_area TEXT NOT NULL DEFAULT 'Gusto & Sapori',
ADD COLUMN category TEXT NOT NULL DEFAULT 'Ristoranti',
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Aggiorna anche la tabella poi_submissions
ALTER TABLE public.poi_submissions 
DROP COLUMN IF EXISTS poi_type,
DROP COLUMN IF EXISTS category;

ALTER TABLE public.poi_submissions 
ADD COLUMN macro_area TEXT NOT NULL DEFAULT 'Gusto & Sapori',
ADD COLUMN category TEXT NOT NULL DEFAULT 'Ristoranti',
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Aggiorna la tabella events se esiste
ALTER TABLE public.events 
DROP COLUMN IF EXISTS category;

ALTER TABLE public.events 
ADD COLUMN macro_area TEXT NOT NULL DEFAULT 'Eventi & Spettacoli',
ADD COLUMN category TEXT NOT NULL DEFAULT 'Concerti',
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Aggiorna eventuali constraints esistenti
ALTER TABLE public.poi_submissions 
DROP CONSTRAINT IF EXISTS poi_submissions_status_check;

ALTER TABLE public.poi_submissions 
ADD CONSTRAINT poi_submissions_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'edited'));

-- Aggiungi constraint per le macro-aree
ALTER TABLE public.points_of_interest 
ADD CONSTRAINT points_of_interest_macro_area_check 
CHECK (macro_area IN ('Gusto & Sapori', 'Cultura & Territorio', 'Eventi & Spettacoli', 'Divertimento & Famiglia'));

ALTER TABLE public.poi_submissions 
ADD CONSTRAINT poi_submissions_macro_area_check 
CHECK (macro_area IN ('Gusto & Sapori', 'Cultura & Territorio', 'Eventi & Spettacoli', 'Divertimento & Famiglia'));

ALTER TABLE public.events 
ADD CONSTRAINT events_macro_area_check 
CHECK (macro_area IN ('Gusto & Sapori', 'Cultura & Territorio', 'Eventi & Spettacoli', 'Divertimento & Famiglia'));
