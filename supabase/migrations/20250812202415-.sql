-- 1) Roles system: enum, table, helper functions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'promoter', 'user');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper: has_role(user, role)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.user_id = _user_id AND r.role = _role
  );
$$;

-- Helper: is_admin() using roles OR fallback to specific email in JWT claims
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
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
$$;

-- Policies for user_roles: users read own roles; admins manage
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2) Secure poi_submissions: add submitter_id, tighten RLS
ALTER TABLE public.poi_submissions
  ADD COLUMN IF NOT EXISTS submitter_id uuid;

-- Auto-assign submitter_id on insert
CREATE OR REPLACE FUNCTION public.set_submitter_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  IF NEW.submitter_id IS NULL THEN
    NEW.submitter_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_submitter_id ON public.poi_submissions;
CREATE TRIGGER trg_set_submitter_id
BEFORE INSERT ON public.poi_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submitter_id();

ALTER TABLE public.poi_submissions ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow insert for all users" ON public.poi_submissions;
DROP POLICY IF EXISTS "Allow public insert" ON public.poi_submissions;
DROP POLICY IF EXISTS "Allow public select" ON public.poi_submissions;
DROP POLICY IF EXISTS "Allow public update" ON public.poi_submissions;
DROP POLICY IF EXISTS "Allow select for submitter" ON public.poi_submissions;

-- New strict policies
CREATE POLICY "Submitter can view own submissions"
  ON public.poi_submissions
  FOR SELECT
  USING (submitter_id IS NOT NULL AND submitter_id = auth.uid());

CREATE POLICY "Admins can view all submissions"
  ON public.poi_submissions
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Authenticated users can create submissions"
  ON public.poi_submissions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update submissions"
  ON public.poi_submissions
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete submissions"
  ON public.poi_submissions
  FOR DELETE
  USING (public.is_admin());