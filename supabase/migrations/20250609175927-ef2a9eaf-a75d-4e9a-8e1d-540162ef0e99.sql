
-- Crea la tabella poi_submissions per memorizzare le proposte POI
CREATE TABLE IF NOT EXISTS public.poi_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitter_email text NOT NULL,
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
  website_url text,
  phone text,
  email text,
  start_datetime timestamp with time zone,
  end_datetime timestamp with time zone,
  location_name text,
  organizer_info text,
  video_url text,
  images text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'edited')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  moderated_at timestamp with time zone,
  moderated_by text
);

-- Abilita Row Level Security (opzionale se vuoi controllo accessi)
ALTER TABLE public.poi_submissions ENABLE ROW LEVEL SECURITY;

-- Policy per permettere a tutti di inserire (per ora)
CREATE POLICY "Allow public insert" ON public.poi_submissions
  FOR INSERT TO public
  WITH CHECK (true);

-- Policy per permettere la lettura (per ora)
CREATE POLICY "Allow public select" ON public.poi_submissions
  FOR SELECT TO public
  USING (true);

-- Policy per permettere l'aggiornamento (per moderazione)
CREATE POLICY "Allow public update" ON public.poi_submissions
  FOR UPDATE TO public
  USING (true);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_poi_submissions_updated_at 
    BEFORE UPDATE ON public.poi_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
