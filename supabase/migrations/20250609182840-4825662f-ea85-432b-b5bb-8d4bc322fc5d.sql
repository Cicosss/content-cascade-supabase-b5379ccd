
-- Aggiorna la colonna status per renderla editabile con dropdown
ALTER TABLE public.poi_submissions 
DROP CONSTRAINT IF EXISTS poi_submissions_status_check;

-- Ricrea il constraint con i valori enum
ALTER TABLE public.poi_submissions 
ADD CONSTRAINT poi_submissions_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'edited'));

-- Aggiungi un commento per migliorare l'interfaccia dell'editor
COMMENT ON COLUMN public.poi_submissions.status IS 'Status options: pending, approved, rejected, edited';
