-- Prima verifichiamo le policy attuali per points_of_interest e events
-- Dalle network requests vediamo errori 401 "permission denied for table points_of_interest"

-- Creiamo policy pubbliche per l'accesso ai dati approvati per points_of_interest
CREATE POLICY "Public can read approved POIs" 
ON public.points_of_interest 
FOR SELECT 
USING (status = 'approved');

-- Creiamo policy pubbliche per l'accesso agli eventi
CREATE POLICY "Public can read all events" 
ON public.events 
FOR SELECT 
USING (true);

-- Verifichiamo che RLS sia abilitato (dovrebbe già esserlo)
ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;