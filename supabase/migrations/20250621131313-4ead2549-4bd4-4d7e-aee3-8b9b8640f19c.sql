
-- Rimuovi la colonna video_url dalla tabella points_of_interest
-- per completare la migrazione verso website_url
ALTER TABLE public.points_of_interest DROP COLUMN IF EXISTS video_url;

-- Verifica che la colonna website_url sia presente (dovrebbe già esserci)
-- Se per qualche motivo non c'è, la aggiungiamo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'points_of_interest' 
        AND column_name = 'website_url'
    ) THEN
        ALTER TABLE public.points_of_interest ADD COLUMN website_url text;
    END IF;
END $$;
