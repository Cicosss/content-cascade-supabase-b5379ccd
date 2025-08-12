-- 1) Create roles enum and user_roles table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2) Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 3) Harden poi_submissions RLS: drop overly permissive policies and add strict ones
-- Drop existing dangerous policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'poi_submissions' AND policyname = 'Allow public select'
  ) THEN
    DROP POLICY "Allow public select" ON public.poi_submissions;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'poi_submissions' AND policyname = 'Allow public update'
  ) THEN
    DROP POLICY "Allow public update" ON public.poi_submissions;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'poi_submissions' AND policyname = 'Allow insert for all users'
  ) THEN
    -- Keep public insert for submissions; do not drop unless duplicated
    NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'poi_submissions' AND policyname = 'Allow public insert'
  ) THEN
    -- Remove duplicate insert policy if both exist; keep only one permissive insert
    DROP POLICY "Allow public insert" ON public.poi_submissions;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'poi_submissions' AND policyname = 'Allow select for submitter'
  ) THEN
    DROP POLICY "Allow select for submitter" ON public.poi_submissions;
  END IF;
END$$;

-- Ensure RLS is enabled
ALTER TABLE public.poi_submissions ENABLE ROW LEVEL SECURITY;

-- 4) New secure policies for poi_submissions
-- Allow anyone (even unauthenticated) to INSERT a submission
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='poi_submissions' AND policyname='Allow public insert of submissions'
  ) THEN
    CREATE POLICY "Allow public insert of submissions"
    ON public.poi_submissions
    FOR INSERT
    WITH CHECK (true);
  END IF;
END$$;

-- Submitter can read their own submissions (must be authenticated, matches email claim)
CREATE POLICY IF NOT EXISTS "Submitter can read own submissions"
ON public.poi_submissions
FOR SELECT
TO authenticated
USING (
  submitter_email IS NOT NULL AND
  submitter_email = (current_setting('request.jwt.claims', true))::json ->> 'email'
);

-- Admins can read all submissions
CREATE POLICY IF NOT EXISTS "Admins can read all submissions"
ON public.poi_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can UPDATE submissions (moderation, edits)
CREATE POLICY IF NOT EXISTS "Admins can update submissions"
ON public.poi_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can DELETE submissions
CREATE POLICY IF NOT EXISTS "Admins can delete submissions"
ON public.poi_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5) Optionally, allow submitter to update their own submission while pending (commented out for safety)
-- CREATE POLICY IF NOT EXISTS "Submitter can update own pending submission" 
-- ON public.poi_submissions FOR UPDATE TO authenticated 
-- USING (status = 'pending' AND submitter_email = (current_setting('request.jwt.claims', true))::json ->> 'email')
-- WITH CHECK (status = 'pending' AND submitter_email = (current_setting('request.jwt.claims', true))::json ->> 'email');
