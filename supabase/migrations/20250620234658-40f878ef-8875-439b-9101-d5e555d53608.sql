
-- Aggiungi una colonna per distinguere tra luoghi ed eventi
ALTER TABLE public.poi_submissions 
ADD COLUMN poi_type text DEFAULT 'place' CHECK (poi_type IN ('place', 'event'));

-- Aggiungi il campo orari di apertura per i luoghi
ALTER TABLE public.poi_submissions 
ADD COLUMN opening_hours text;

-- Aggiorna anche la tabella points_of_interest
ALTER TABLE public.points_of_interest 
ADD COLUMN poi_type text DEFAULT 'place' CHECK (poi_type IN ('place', 'event'));

ALTER TABLE public.points_of_interest 
ADD COLUMN opening_hours text;

-- Aggiungi commenti per chiarezza
COMMENT ON COLUMN public.poi_submissions.poi_type IS 'Tipo di POI: place per luoghi permanenti, event per eventi temporanei';
COMMENT ON COLUMN public.poi_submissions.opening_hours IS 'Orari di apertura per i luoghi (es. Lun-Ven: 9:00-18:00)';
COMMENT ON COLUMN public.points_of_interest.poi_type IS 'Tipo di POI: place per luoghi permanenti, event per eventi temporanei';
COMMENT ON COLUMN public.points_of_interest.opening_hours IS 'Orari di apertura per i luoghi (es. Lun-Ven: 9:00-18:00)';
