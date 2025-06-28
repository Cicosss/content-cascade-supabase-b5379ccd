
export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

export interface FilterConfig {
  id: string;
  title: string;
  type: 'single' | 'multiple' | 'date-range' | 'toggle';
  options?: FilterOption[];
  defaultValue?: any;
  icon?: string;
  description?: string;
}

export const ZONES_CONFIG: FilterOption[] = [
  { value: 'tuttalromagna', label: 'Tutta la Romagna' },
  { value: 'centro', label: 'Centro' },
  { value: 'nord', label: 'Nord' },
  { value: 'sud', label: 'Sud' },
  { value: 'ovest', label: 'Ovest' },
  { value: 'est', label: 'Est' }
];

export const BUDGET_OPTIONS: FilterOption[] = [
  { value: 'gratuito', label: 'Gratuito', icon: '🆓' },
  { value: 'economico', label: '€', icon: '💰' },
  { value: 'medio', label: '€€', icon: '💰' },
  { value: 'costoso', label: '€€€', icon: '💰' }
];

export const SPECIAL_PREFERENCES: FilterOption[] = [
  { value: 'famiglia', label: 'Adatto ai bambini', icon: '👨‍👩‍👧‍👦' },
  { value: 'pet-friendly', label: 'Pet-Friendly', icon: '🐕' },
  { value: 'accessibile', label: 'Accessibile', icon: '♿' },
  { value: 'romantico', label: 'Romantico', icon: '💕' },
  { value: 'vegetariano', label: 'Opzioni Vegetariane', icon: '🥗' },
  { value: 'allaperto', label: "All'aperto", icon: '🌳' },
  { value: 'alcoperto', label: 'Al coperto', icon: '🏢' },
  { value: 'prenotazione', label: 'Prenotazione richiesta', icon: '📅' },
  { value: 'parcheggio', label: 'Parcheggio disponibile', icon: '🅿️' }
];

export const TIME_SLOTS: FilterOption[] = [
  { value: 'mattina', label: 'Mattina (6-12)', icon: '🌅' },
  { value: 'pomeriggio', label: 'Pomeriggio (12-18)', icon: '☀️' },
  { value: 'sera', label: 'Sera (18-24)', icon: '🌆' },
  { value: 'notte', label: 'Notte (24-6)', icon: '🌙' }
];

export const FILTERS_CONFIG: FilterConfig[] = [
  {
    id: 'categories',
    title: 'Categorie',
    type: 'multiple',
    defaultValue: ['tutte'],
    description: 'Seleziona le categorie di interesse'
  },
  {
    id: 'zone',
    title: 'Zona',
    type: 'single',
    options: ZONES_CONFIG,
    defaultValue: 'tuttalromagna',
    icon: '📍'
  },
  {
    id: 'period',
    title: 'Periodo Vacanza',
    type: 'date-range',
    icon: '📅',
    description: 'Seleziona le date del tuo soggiorno'
  },
  {
    id: 'budgets',
    title: 'Budget',
    type: 'multiple',
    options: BUDGET_OPTIONS,
    defaultValue: [],
    icon: '💰'
  },
  {
    id: 'timeSlots',
    title: 'Fasce Orarie',
    type: 'multiple',
    options: TIME_SLOTS,
    defaultValue: [],
    icon: '🕐'
  },
  {
    id: 'specialPreferences',
    title: 'Preferenze Speciali',
    type: 'multiple',
    options: SPECIAL_PREFERENCES,
    defaultValue: [],
    icon: '✨'
  }
];

export const getFilterConfig = (filterId: string): FilterConfig | undefined => {
  return FILTERS_CONFIG.find(config => config.id === filterId);
};

export const getFilterOptions = (filterId: string): FilterOption[] => {
  const config = getFilterConfig(filterId);
  return config?.options || [];
};
