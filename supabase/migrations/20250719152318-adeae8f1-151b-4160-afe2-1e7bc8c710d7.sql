
-- Aggiunge colonna priority_score alla tabella points_of_interest
ALTER TABLE public.points_of_interest 
ADD COLUMN IF NOT EXISTS priority_score NUMERIC DEFAULT 0;

-- Aggiunge colonna reviews_count per il calcolo del priority_score
ALTER TABLE public.points_of_interest 
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Funzione per calcolare il priority_score
CREATE OR REPLACE FUNCTION calculate_priority_score(
    avg_rating NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE,
    reviews_count INTEGER DEFAULT 0
) RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql;

-- Aggiorna tutti i POI esistenti con il priority_score calcolato
UPDATE public.points_of_interest 
SET priority_score = calculate_priority_score(avg_rating, created_at, reviews_count);

-- Trigger per aggiornare automaticamente il priority_score
CREATE OR REPLACE FUNCTION update_priority_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.priority_score := calculate_priority_score(NEW.avg_rating, NEW.created_at, NEW.reviews_count);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica il trigger
DROP TRIGGER IF EXISTS poi_priority_score_update ON public.points_of_interest;
CREATE TRIGGER poi_priority_score_update
    BEFORE INSERT OR UPDATE ON public.points_of_interest
    FOR EACH ROW
    EXECUTE FUNCTION update_priority_score_trigger();

-- Aggiorna il reviews_count basandosi sulle recensioni esistenti
UPDATE public.points_of_interest 
SET reviews_count = (
    SELECT COUNT(*) 
    FROM public.reviews 
    WHERE reviews.poi_id = points_of_interest.id
);

-- Aggiunge tabella per A/B testing
CREATE TABLE IF NOT EXISTS public.ab_test_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_session_id TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    carousel_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_session_id, carousel_type)
);

-- Abilita RLS per ab_test_variants
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti e letture pubbliche (per utenti anonimi)
CREATE POLICY "Allow public insert for AB test variants" 
ON public.ab_test_variants FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select for AB test variants" 
ON public.ab_test_variants FOR SELECT 
USING (true);

-- Aggiunge tabella per tracking metriche
CREATE TABLE IF NOT EXISTS public.carousel_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    carousel_type TEXT NOT NULL,
    variant_name TEXT,
    poi_id UUID,
    action_type TEXT NOT NULL, -- 'view', 'click', 'conversion'
    position INTEGER, -- posizione della card nel carosello
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita RLS per carousel_metrics
ALTER TABLE public.carousel_metrics ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti pubblici e letture per i propri dati
CREATE POLICY "Allow public insert for carousel metrics" 
ON public.carousel_metrics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can read own metrics" 
ON public.carousel_metrics FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);
