
import { 
  Utensils, 
  Compass, 
  Calendar, 
  Camera,
  TreePine,
  Users,
  Palette,
  Music,
  Car,
  ShoppingBag,
  Moon,
  Wheat,
  Truck,
  Store,
  Building2,
  Hammer,
  LandPlot,
  Mountain,
  Waves,
  Dumbbell,
  Ferris,
  Baby,
  GraduationCap
} from 'lucide-react';

export const CATEGORY_ICONS = {
  // Gusto & Sapori
  'Ristoranti': Utensils,
  'Agriturismi': Wheat,
  'Aziende Agricole': Wheat,
  'Street Food': Truck,
  'Mercati Locali': Store,
  
  // Cultura & Territorio
  'Musei': Building2,
  'Artigianato Locale': Hammer,
  'Storia e Borghi': LandPlot,
  
  // Eventi
  'Eventi': Calendar,
  
  // Natura & Avventura
  'Spiagge': Waves,
  'Parchi Naturali e Riserve': Mountain,
  'Sport': Dumbbell,
  
  // Divertimento & Famiglia
  'Parchi a Tema e Acquatici': Ferris,
  'Attività per Bambini': Baby,
  'Fattorie Didattiche e Animali': Wheat,
  'Esperienze Educative': GraduationCap,
  'Vita Notturna': Moon,
  
  // Default
  'default': Compass
} as const;

export const getCategoryIcon = (category: string) => {
  return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.default;
};
