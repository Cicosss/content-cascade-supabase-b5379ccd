-- Fix critical security issues: Restrict business contact information and analytics data access

-- 1. Update points_of_interest RLS policies to protect contact information
DROP POLICY IF EXISTS "Allow public read access to approved POIs" ON public.points_of_interest;
DROP POLICY IF EXISTS "Anyone can read POIs" ON public.points_of_interest;

-- Create new policy that excludes sensitive contact information for public access
CREATE POLICY "Public can read basic POI info" 
ON public.points_of_interest 
FOR SELECT 
USING (
  status = 'approved' AND 
  -- Only allow access to non-sensitive fields for unauthenticated users
  (auth.uid() IS NOT NULL OR (email IS NULL AND phone IS NULL))
);

-- Authenticated users can access full POI data including contact info
CREATE POLICY "Authenticated users can read full POI data" 
ON public.points_of_interest 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND status = 'approved'
);

-- 2. Fix ab_test_variants table - remove public access
DROP POLICY IF EXISTS "Allow public select for AB test variants" ON public.ab_test_variants;

-- Only authenticated users can read AB test variants
CREATE POLICY "Authenticated users can read AB test variants" 
ON public.ab_test_variants 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Fix carousel_metrics table - restrict to user's own data and admins
DROP POLICY IF EXISTS "Users can read own metrics" ON public.carousel_metrics;

-- Users can only read their own metrics, admins can read all
CREATE POLICY "Users can read own metrics only" 
ON public.carousel_metrics 
FOR SELECT 
USING (
  auth.uid() = user_id OR is_admin()
);

-- 4. Harden database functions with secure search path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.user_id = _user_id AND r.role = _role
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  email text;
BEGIN
  BEGIN
    email := COALESCE(current_setting('request.jwt.claims', true)::json->>'email', NULL);
  EXCEPTION WHEN OTHERS THEN
    email := NULL;
  END;

  RETURN public.has_role(auth.uid(), 'admin')
         OR email = 'luca.litti@gmail.com';
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_priority_score(avg_rating numeric, created_at timestamp with time zone, reviews_count integer DEFAULT 0)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    days_since_created NUMERIC;
    score NUMERIC;
BEGIN
    -- Calcola i giorni dalla creazione (più recente = punteggio migliore)
    days_since_created := EXTRACT(DAY FROM (NOW() - created_at));
    
    -- Formula priority_score: (rating * 20) + bonus recency + (reviews * 2)
    score := COALESCE(avg_rating * 20, 0) + 
             GREATEST(0, 30 - (days_since_created * 0.1)) + 
             (COALESCE(reviews_count, 0) * 2);
    
    RETURN ROUND(score, 2);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_priority_score_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.priority_score := calculate_priority_score(NEW.avg_rating, NEW.created_at, NEW.reviews_count);
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_submitter_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.submitter_id IS NULL THEN
    NEW.submitter_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_expired_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
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

CREATE OR REPLACE FUNCTION public.check_and_move_expired_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Esegui la funzione di spostamento solo se è un evento con data di fine
  IF NEW.poi_type = 'experience' AND NEW.end_datetime IS NOT NULL AND NEW.end_datetime < now() THEN
    PERFORM public.move_expired_events();
  END IF;
  
  RETURN NEW;
END;
$function$;