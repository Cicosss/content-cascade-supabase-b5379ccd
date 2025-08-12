-- Security hardening: limit contact data exposure for public (anon)
-- Strategy: keep public read access to non-sensitive columns; hide phone and email from anon
-- while preserving full access for authenticated users. No app code changes required.

-- 1) Revoke any broad privileges from anon and PUBLIC, then grant back column-scoped privileges
DO $$ BEGIN
  -- Revoke all privileges from anon and public to avoid accidental exposure
  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'anon'
  ) THEN
    REVOKE ALL ON TABLE public.points_of_interest FROM anon;
  END IF;
  REVOKE ALL ON TABLE public.points_of_interest FROM PUBLIC;
EXCEPTION WHEN undefined_table THEN
  -- Table does not exist in this environment; ignore
  RAISE NOTICE 'Table public.points_of_interest not found during privilege revoke';
END $$;

-- 2) Ensure authenticated role can read all columns
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'authenticated'
  ) THEN
    GRANT SELECT ON TABLE public.points_of_interest TO authenticated;
  END IF;
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'Table public.points_of_interest not found during grant to authenticated';
END $$;

-- 3) Grant anon only the non-sensitive columns (exclude email, phone)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'anon'
  ) THEN
    GRANT SELECT (
      id,
      name,
      description,
      poi_type,
      category,
      address,
      latitude,
      longitude,
      price_info,
      duration_info,
      target_audience,
      images,
      start_datetime,
      end_datetime,
      location_name,
      organizer_info,
      status,
      created_at,
      updated_at,
      avg_rating,
      priority_score,
      reviews_count,
      tags,
      opening_hours,
      website_url
    ) ON public.points_of_interest TO anon;
  END IF;
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'Table public.points_of_interest not found during column-scoped grant to anon';
END $$;

-- Notes:
-- - RLS policy "Anyone can read POIs" remains unchanged, but column privileges now prevent
--   anon from fetching email and phone values, mitigating contact harvesting.
-- - Authenticated users continue to have full access, preserving partner workflows.
-- - If you also want to restrict website_url, remove it from the GRANT above.
