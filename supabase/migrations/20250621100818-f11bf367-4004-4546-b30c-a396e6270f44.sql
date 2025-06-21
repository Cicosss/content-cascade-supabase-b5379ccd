
-- Create user_visits table to track when users visit POIs
CREATE TABLE public.user_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  poi_id UUID NOT NULL REFERENCES public.points_of_interest(id) ON DELETE CASCADE,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate visits by the same user to the same POI
ALTER TABLE public.user_visits 
ADD CONSTRAINT unique_user_poi_visit UNIQUE (user_id, poi_id);

-- Enable Row Level Security
ALTER TABLE public.user_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_visits table
CREATE POLICY "Users can view their own visits" 
  ON public.user_visits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visits" 
  ON public.user_visits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" 
  ON public.user_visits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visits" 
  ON public.user_visits 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance on user queries
CREATE INDEX idx_user_visits_user_id ON public.user_visits(user_id);
CREATE INDEX idx_user_visits_timestamp ON public.user_visits(visit_timestamp DESC);
