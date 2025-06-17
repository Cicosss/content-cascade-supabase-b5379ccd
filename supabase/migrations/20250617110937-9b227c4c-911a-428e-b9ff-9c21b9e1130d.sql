
-- Fix Function Search Path Mutable issues
-- Recreate check_and_move_expired_events function with security definer and explicit search_path
CREATE OR REPLACE FUNCTION public.check_and_move_expired_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Esegui la funzione di spostamento solo se è un evento con data di fine
  IF NEW.poi_type = 'experience' AND NEW.end_datetime IS NOT NULL AND NEW.end_datetime < now() THEN
    PERFORM public.move_expired_events();
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate move_expired_events function with security definer and explicit search_path
CREATE OR REPLACE FUNCTION public.move_expired_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- Comment to document the security improvements
COMMENT ON SCHEMA public IS 'Security improvements: Functions now use explicit search_path for security. Configure Auth settings manually in Supabase dashboard.';
