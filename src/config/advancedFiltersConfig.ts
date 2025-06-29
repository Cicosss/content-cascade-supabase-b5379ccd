
import { Euro, Clock, Wand } from 'lucide-react';

export interface AdvancedFilterOption {
  value: string;
  label: string;
  icon: any;
}

export interface AdvancedFilterGroup {
  id: string;
  title: string;
  description: string;
  icon: any;
  options: AdvancedFilterOption[];
}

export const ADVANCED_FILTERS_CONFIG: AdvancedFilterGroup[] = [
  {
    id: 'budgets',
    title: 'Budget',
    description: 'Fascia di prezzo per persona',
    icon: Euro,
    options: [
      { value: 'gratuito', label: 'Gratuito', icon: Euro },
      { value: 'economico', label: 'Fino a €25', icon: Euro },
      { value: 'medio', label: '€25 - €50', icon: Euro },
      { value: 'costoso', label: 'Oltre €50', icon: Euro }
    ]
  },
  {
    id: 'timeSlots',
    title: 'Fasce Orarie',
    description: 'Quando preferisci le attività',
    icon: Clock,
    options: [
      { value: 'mattina', label: 'Mattina (6-12)', icon: Clock },
      { value: 'pomeriggio', label: 'Pomeriggio (12-18)', icon: Clock },
      { value: 'sera', label: 'Sera (18-24)', icon: Clock },
      { value: 'notte', label: 'Notte (24-6)', icon: Clock }
    ]
  },
  {
    id: 'specialPreferences',
    title: 'Preferenze Speciali',
    description: 'Caratteristiche specifiche',
    icon: Wand,
    options: [
      { value: 'famiglia', label: 'Adatto ai bambini', icon: Wand },
      { value: 'pet-friendly', label: 'Pet-Friendly', icon: Wand },
      { value: 'accessibile', label: 'Accessibile', icon: Wand },
      { value: 'romantico', label: 'Romantico', icon: Wand },
      { value: 'vegetariano', label: 'Opzioni Vegetariane', icon: Wand },
      { value: 'allaperto', label: "All'aperto", icon: Wand },
      { value: 'alcoperto', label: 'Al coperto', icon: Wand },
      { value: 'prenotazione', label: 'Prenotazione richiesta', icon: Wand },
      { value: 'parcheggio', label: 'Parcheggio disponibile', icon: Wand }
    ]
  }
];
