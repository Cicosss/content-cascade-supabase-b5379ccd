
-- 1) Harden points_of_interest write access (admins only)
DROP POLICY IF EXISTS "Allow authenticated users to delete POI" ON public.points_of_interest;
DROP POLICY IF EXISTS "Allow authenticated users to insert POI" ON public.points_of_interest;
DROP POLICY IF EXISTS "Allow authenticated users to update POI" ON public.points_of_interest;

CREATE POLICY "Only admins can insert POIs"
  ON public.points_of_interest
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update POIs"
  ON public.points_of_interest
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete POIs"
  ON public.points_of_interest
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 2) Fix user_profiles permissive insert
DROP POLICY IF EXISTS "Users can create profile on signup" ON public.user_profiles;

-- 3) Auto-fill submitter_id on poi_submissions
DROP TRIGGER IF EXISTS set_submitter_on_insert ON public.poi_submissions;
CREATE TRIGGER set_submitter_on_insert
BEFORE INSERT ON public.poi_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submitter_id();

-- 4) Ensure at least one admin role exists (uses auth.users to map the known owner email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'luca.litti@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 5) Remove fallback email from is_admin and rely solely on roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN public.has_role(auth.uid(), 'admin');
END;
$function$;

-- 6) Align eventi_passati write policy with is_admin
DROP POLICY IF EXISTS "Allow admin write access to past events" ON public.eventi_passati;

CREATE POLICY "Admins can insert past events"
  ON public.eventi_passati
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can modify past events"
  ON public.eventi_passati
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete past events"
  ON public.eventi_passati
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7) Storage RLS: restrict writes on avatars and assets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any prior policies we are superseding
DROP POLICY IF EXISTS "Users can upload their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage assets" ON storage.objects;

-- Avatars: user can write only under their own prefix and only update/delete own objects
CREATE POLICY "Users can upload their avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND position(auth.uid()::text || '/' in name) = 1
  );

CREATE POLICY "Users can update their avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND owner = auth.uid()
  )
  WITH CHECK (
    bucket_id = 'avatars' AND owner = auth.uid()
  );

CREATE POLICY "Users can delete their avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Assets: only admins can write (reads via public bucket)
CREATE POLICY "Admins can manage assets"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'assets' AND public.is_admin());

-- 8) Reduce analytics spam: require authenticated inserts
DROP POLICY IF EXISTS "Allow public insert for AB test variants" ON public.ab_test_variants;
CREATE POLICY "Authenticated can insert AB test variants"
  ON public.ab_test_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert for carousel metrics" ON public.carousel_metrics;
CREATE POLICY "Authenticated can insert carousel metrics"
  ON public.carousel_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9) Add search_path to SECURITY DEFINER functions (linter)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.user_id = _user_id AND r.role = _role
  );
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
