import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Tipi per A/B testing
export type ABVariant = 'control' | 'variant_a' | 'variant_b';

export interface ABTestConfig {
  carouselType: string;
  variants: {
    [key: string]: {
      weight: number;
      config: any;
    };
  };
}

// Configurazioni per diversi test A/B
const AB_TEST_CONFIGS: Record<string, ABTestConfig> = {
  'homepage-restaurants': {
    carouselType: 'homepage-restaurants',
    variants: {
      control: {
        weight: 0.5,
        config: {
          orderBy: 'priority_score',
          limit: 6,
          title: 'Tradizione Culinaria Autentica'
        }
      },
      variant_a: {
        weight: 0.5,
        config: {
          orderBy: 'avg_rating',
          limit: 8,
          title: 'I Migliori Ristoranti per Te'
        }
      }
    }
  },
  'homepage-experiences': {
    carouselType: 'homepage-experiences',
    variants: {
      control: {
        weight: 0.5,
        config: {
          orderBy: 'priority_score',
          limit: 6,
          title: 'Esperienze del Territorio'
        }
      },
      variant_a: {
        weight: 0.5,
        config: {
          orderBy: 'distance',
          limit: 8,
          title: 'Esperienze Vicino a Te'
        }
      }
    }
  }
};

export const useABTesting = (carouselType: string) => {
  const [variant, setVariant] = useState<string>('control');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeABTest = async () => {
      try {
        // Ottieni o genera session ID
        let sessionId = sessionStorage.getItem('carousel_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          sessionStorage.setItem('carousel_session_id', sessionId);
        }

        // Controlla se esiste già una variante per questa sessione e carosello
        const { data: existingVariant } = await supabase
          .from('ab_test_variants')
          .select('variant_name')
          .eq('user_session_id', sessionId)
          .eq('carousel_type', carouselType)
          .maybeSingle();

        if (existingVariant) {
          setVariant(existingVariant.variant_name);
        } else {
          // Assegna una nuova variante basata sui pesi
          const config = AB_TEST_CONFIGS[carouselType];
          if (config) {
            const selectedVariant = selectVariantByWeight(config.variants);
            setVariant(selectedVariant);

            // Salva la variante nel database
            await supabase
              .from('ab_test_variants')
              .insert({
                user_session_id: sessionId,
                carousel_type: carouselType,
                variant_name: selectedVariant
              });
          }
        }
      } catch (error) {
        console.error('Errore inizializzazione A/B test:', error);
        setVariant('control'); // Fallback a control
      } finally {
        setIsLoading(false);
      }
    };

    initializeABTest();
  }, [carouselType]);

  // Funzione per selezionare una variante basata sui pesi
  const selectVariantByWeight = (variants: Record<string, { weight: number; config: any }>) => {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [variantName, variantConfig] of Object.entries(variants)) {
      cumulativeWeight += variantConfig.weight;
      if (random <= cumulativeWeight) {
        return variantName;
      }
    }
    
    return 'control'; // Fallback
  };

  // Ottieni la configurazione per la variante corrente
  const getVariantConfig = () => {
    const config = AB_TEST_CONFIGS[carouselType];
    if (!config || !config.variants[variant]) {
      return AB_TEST_CONFIGS[carouselType]?.variants.control?.config || {};
    }
    return config.variants[variant].config;
  };

  return {
    variant,
    variantConfig: getVariantConfig(),
    isLoading
  };
};

// Hook per tracciare le metriche dei caroselli
export const useCarouselMetrics = () => {
  const trackMetric = async (
    carouselType: string,
    actionType: 'view' | 'click' | 'conversion',
    poiId?: string,
    position?: number
  ) => {
    try {
      const sessionId = sessionStorage.getItem('carousel_session_id') || 'anonymous';
      
      // Ottieni la variante corrente per questo carosello
      const { data: variantData } = await supabase
        .from('ab_test_variants')
        .select('variant_name')
        .eq('user_session_id', sessionId)
        .eq('carousel_type', carouselType)
        .maybeSingle();

      await supabase
        .from('carousel_metrics')
        .insert({
          session_id: sessionId,
          carousel_type: carouselType,
          variant_name: variantData?.variant_name || 'control',
          poi_id: poiId,
          action_type: actionType,
          position: position
        });
    } catch (error) {
      console.error('Errore tracking metrica:', error);
    }
  };

  return { trackMetric };
};