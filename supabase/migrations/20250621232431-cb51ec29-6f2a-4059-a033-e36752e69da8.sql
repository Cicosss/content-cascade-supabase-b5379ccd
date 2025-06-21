
-- Remove the existing check constraint that doesn't include 'poi'
ALTER TABLE public.user_favorites DROP CONSTRAINT IF EXISTS user_favorites_item_type_check;

-- Add a new check constraint that includes 'poi' as a valid item_type
ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_item_type_check 
CHECK (item_type IN ('restaurant', 'experience', 'event', 'poi'));
