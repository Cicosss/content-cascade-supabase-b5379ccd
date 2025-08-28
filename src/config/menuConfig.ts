
import { 
  MessageSquare, 
  Camera,
  Grid3X3,
  Droplets,
  CloudSun,
  Settings,
  Zap,
  LayoutDashboard,
  Trophy,
  LucideIcon
} from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
  isSpecial?: boolean;
}

export interface MenuSection {
  id: string;
  title?: string;
  items: MenuItem[];
  showHeader?: boolean;
}

export const MENU_CONFIG: MenuSection[] = [
  // Main section removed to eliminate duplicate /dashboard route
  {
    id: 'special',
    items: [
      {
        id: 'oggi',
        title: "Oggi in Romagna",
        url: "/oggi",
        icon: Zap,
        badge: 7,
        isSpecial: true
      }
    ]
  },
  {
    id: 'personal',
    title: "Area Personale",
    showHeader: true,
    items: [
      {
        id: 'dashboard',
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: 'passport',
        title: "Il Mio Passaporto",
        url: "/my-passport",
        icon: Trophy,
      },
      {
        id: 'categories',
        title: "Esplora Categorie",
        url: "/categories",
        icon: Grid3X3,
      },
      {
        id: 'water',
        title: "Qualità del Mare",
        url: "/water-quality",
        icon: Droplets,
      },
      {
        id: 'weather',
        title: "Meteo",
        url: "/weather",
        icon: CloudSun,
      },
      {
        id: 'webcams',
        title: "Webcam",
        url: "/webcams",
        icon: Camera,
      }
    ]
  },
  {
    id: 'bottom',
    items: [
      {
        id: 'settings',
        title: "Impostazioni",
        url: "/settings",
        icon: Settings,
      }
    ]
  }
];
