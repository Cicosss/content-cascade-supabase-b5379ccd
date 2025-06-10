
-- Crea la tabella per gli eventi passati con la stessa struttura di points_of_interest
CREATE TABLE IF NOT EXISTS public.eventi_passati (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text,
  poi_type text NOT NULL,
  category text NOT NULL,
  address text,
  latitude numeric,
  longitude numeric,
  price_info text,
  duration_info text,
  target_audience text DEFAULT 'everyone',
  images text[],
  video_url text,
  website_url text,
  phone text,
  email text,
  avg_rating numeric DEFAULT 0,
  start_datetime timestamptz,
  end_datetime timestamptz,
  location_name text,
  organizer_info text,
  status text DEFAULT 'approved',
  moved_at timestamptz DEFAULT now(),
  original_created_at timestamptz,
  original_updated_at timestamptz
);

-- Abilita RLS sulla nuova tabella
ALTER TABLE public.eventi_passati ENABLE ROW LEVEL SECURITY;

-- Policy per permettere la lettura degli eventi passati a tutti
CREATE POLICY "Allow public read access to past events"
  ON public.eventi_passati
  FOR SELECT
  TO public
  USING (true);

-- Policy per permettere agli admin di modificare/eliminare eventi passati
CREATE POLICY "Allow admin write access to past events"
  ON public.eventi_passati
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Funzione per spostare eventi scaduti
CREATE OR REPLACE FUNCTION public.move_expired_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sposta gli eventi scaduti dalla tabella principale a eventi_passati
  INSERT INTO public.eventi_passati (
    id, name, description, poi_type, category, address, latitude, longitude,
    price_info, duration_info, target_audience, images, video_url, website_url,
    phone, email, avg_rating, start_datetime, end_datetime, location_name,
    organizer_info, status, original_created_at, original_updated_at
  )
  SELECT 
    id, name, description, poi_type, category, address, latitude, longitude,
    price_info, duration_info, target_audience, images, video_url, website_url,
    phone, email, avg_rating, start_datetime, end_datetime, location_name,
    organizer_info, status, created_at, updated_at
  FROM public.points_of_interest
  WHERE poi_type = 'experience'
    AND end_datetime IS NOT NULL 
    AND end_datetime < now()
    AND id NOT IN (SELECT id FROM public.eventi_passati);

  -- Elimina gli eventi scaduti dalla tabella principale
  DELETE FROM public.points_of_interest
  WHERE poi_type = 'experience'
    AND end_datetime IS NOT NULL 
    AND end_datetime < now();
    
  RAISE NOTICE 'Eventi scaduti spostati in eventi_passati';
END;
$$;

-- Crea un trigger che esegue la funzione ogni volta che viene aggiornata la tabella points_of_interest
CREATE OR REPLACE FUNCTION public.check_and_move_expired_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esegui la funzione di spostamento solo se è un evento con data di fine
  IF NEW.poi_type = 'experience' AND NEW.end_datetime IS NOT NULL AND NEW.end_datetime < now() THEN
    PERFORM public.move_expired_events();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Applica il trigger alla tabella points_of_interest
CREATE TRIGGER move_expired_events_trigger
  AFTER INSERT OR UPDATE ON public.points_of_interest
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_move_expired_events();

-- Aggiungi campi per date di inizio e fine alla tabella points_of_interest se non esistono già
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'start_datetime') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN start_datetime timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'end_datetime') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN end_datetime timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'location_name') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN location_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'organizer_info') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN organizer_info text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'video_url') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN video_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'phone') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'email') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN email text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_of_interest' AND column_name = 'status') THEN
    ALTER TABLE public.points_of_interest ADD COLUMN status text DEFAULT 'approved';
  END IF;
END $$;
