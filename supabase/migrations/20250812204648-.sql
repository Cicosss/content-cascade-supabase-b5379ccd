-- Finalize security hardening: storage read policies, safe avatar writes, cleanup leftover permissive policies

-- 1) Storage: Public read for avatars and assets
DROP POLICY IF EXISTS "Public read access to avatars" ON storage.objects;
CREATE POLICY "Public read access to avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public read access to assets" ON storage.objects;
CREATE POLICY "Public read access to assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'assets');

-- 2) Storage: Safe per-user avatar writes using folder prefix (uid/filename)
DROP POLICY IF EXISTS "Users can upload their avatar" ON storage.objects;
CREATE POLICY "Users can upload their avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their avatar" ON storage.objects;
CREATE POLICY "Users can update their avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their avatar" ON storage.objects;
CREATE POLICY "Users can delete their avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3) Storage: Admins manage assets writes (keep public read)
DROP POLICY IF EXISTS "Admins can manage assets" ON storage.objects;
CREATE POLICY "Admins can manage assets"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'assets' AND public.is_admin());

-- 4) Clean up user_profiles permissive signup policy (keep self-service policies)
DROP POLICY IF EXISTS "Users can create profile on signup" ON public.user_profiles;

-- 5) Ensure analytics inserts are authenticated-only
-- AB test variants
DROP POLICY IF EXISTS "Allow public insert for AB test variants" ON public.ab_test_variants;
DROP POLICY IF EXISTS "Authenticated can insert AB test variants" ON public.ab_test_variants;
CREATE POLICY "Authenticated can insert AB test variants"
  ON public.ab_test_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Carousel metrics
DROP POLICY IF EXISTS "Allow public insert for carousel metrics" ON public.carousel_metrics;
DROP POLICY IF EXISTS "Authenticated can insert carousel metrics" ON public.carousel_metrics;
CREATE POLICY "Authenticated can insert carousel metrics"
  ON public.carousel_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6) Align eventi_passati policies fully with is_admin (cleanup legacy policy)
DROP POLICY IF EXISTS "Allow admin write access to past events" ON public.eventi_passati;
DROP POLICY IF EXISTS "Admins can insert past events" ON public.eventi_passati;
DROP POLICY IF EXISTS "Admins can modify past events" ON public.eventi_passati;
DROP POLICY IF EXISTS "Admins can delete past events" ON public.eventi_passati;
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