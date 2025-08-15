-- Allow public read access to approved points of interest
DROP POLICY IF EXISTS "Allow public read access to approved POIs" ON public.points_of_interest;
CREATE POLICY "Allow public read access to approved POIs" 
ON public.points_of_interest 
FOR SELECT 
USING (status = 'approved');

-- Allow public read access to events
DROP POLICY IF EXISTS "Allow public read access to events" ON public.events;
CREATE POLICY "Allow public read access to events" 
ON public.events 
FOR SELECT 
USING (true);