
-- Sposta il POI della 50° Fiera del Formaggio di Fossa dalla categoria Eventi a Mercati Locali
UPDATE public.points_of_interest 
SET 
  category = 'Mercati Locali',
  poi_type = 'place',
  updated_at = now()
WHERE name ILIKE '%50° Fiera del Formaggio di Fossa%' 
  OR name ILIKE '%fiera%formaggio%fossa%'
  OR (name ILIKE '%fiera%' AND description ILIKE '%formaggio%fossa%');
