
import { useState, useEffect, useMemo } from 'react';

interface UseSeaSafetyBannerProps {
  activeFilters: {
    categories: string[];
    zone: string;
    period: any;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
}

const MARINE_CATEGORIES = [
  'Spiagge',
  'Sport',
  'Natura'
];

const MARINE_KEYWORDS = [
  'spiaggia',
  'mare',
  'bagni',
  'lido',
  'costa',
  'marina',
  'porto'
];

export const useSeaSafetyBanner = ({ activeFilters }: UseSeaSafetyBannerProps) => {
  const [userDismissed, setUserDismissed] = useState(false);
  const [hasMarineInterest, setHasMarineInterest] = useState(false);

  // Controlla se siamo nella stagione balneare (1 Maggio - 30 Settembre)
  const isSwimmingSeason = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const seasonStart = new Date(currentYear, 4, 1); // 1 Maggio (mese 4 = Maggio)
    const seasonEnd = new Date(currentYear, 8, 30); // 30 Settembre (mese 8 = Settembre)
    
    return today >= seasonStart && today <= seasonEnd;
  }, []);

  // Controlla se l'utente ha interesse per attività marine
  useEffect(() => {
    const hasMarineCategory = activeFilters.categories.some(category => 
      MARINE_CATEGORIES.includes(category)
    );

    const hasMarineKeyword = activeFilters.categories.some(category =>
      MARINE_KEYWORDS.some(keyword => 
        category.toLowerCase().includes(keyword)
      )
    );

    // Controlla anche se la zona selezionata è costiera
    const isCoastalZone = activeFilters.zone === 'est' || activeFilters.zone === 'nord';

    if (hasMarineCategory || hasMarineKeyword || isCoastalZone) {
      setHasMarineInterest(true);
    }
  }, [activeFilters]);

  // Determina se il banner deve essere mostrato
  const shouldShowBanner = useMemo(() => {
    return isSwimmingSeason && hasMarineInterest && !userDismissed;
  }, [isSwimmingSeason, hasMarineInterest, userDismissed]);

  const dismissBanner = () => {
    setUserDismissed(true);
  };

  return {
    shouldShowBanner,
    dismissBanner,
    isSwimmingSeason,
    hasMarineInterest
  };
};
