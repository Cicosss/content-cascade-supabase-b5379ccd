
-- Fix Function Search Path Mutable issues
-- Recreate trigger_set_timestamp function with security definer and explicit search_path
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Recreate update_updated_at_column function with security definer and explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Enable leaked password protection
-- This needs to be done through Supabase dashboard Auth settings, but we can prepare the configuration
COMMENT ON SCHEMA public IS 'Security improvements: Functions now use explicit search_path for security. Enable leaked password protection in Auth settings.';
