-- Remove public read access from eventi_passati to protect organizer contacts
DROP POLICY IF EXISTS "Allow public read access to past events" ON public.eventi_passati;

-- Ensure admins can still read (redundant if ALL exists, but explicit for clarity)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'eventi_passati' AND policyname = 'Admins can read past events'
  ) THEN
    CREATE POLICY "Admins can read past events"
      ON public.eventi_passati
      FOR SELECT
      USING (public.is_admin());
  END IF;
END$$;