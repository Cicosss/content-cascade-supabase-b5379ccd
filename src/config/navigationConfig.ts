import React from 'react';
import { 
  UtensilsCrossed, 
  Landmark, 
  CalendarHeart, 
  Users, 
  MountainSnow 
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: NavigationItem[];
}

export const createMenuItems = (): NavigationItem[] => [
  {
    title: "Scopri",
    url: "#",
    items: [
      {
        title: "Gusto & Sapori",
        description: "Ristoranti, cantine e prodotti tipici.",
        icon: React.createElement(UtensilsCrossed, { className: "size-5 shrink-0" }),
        url: "/dashboard?categories=Ristoranti,Agriturismi,Aziende Agricole,Street Food,Mercati Locali"
      },
      {
        title: "Cultura & Territorio",
        description: "Musei, borghi e tesori storici.",
        icon: React.createElement(Landmark, { className: "size-5 shrink-0" }),
        url: "/dashboard?categories=Musei,Artigianato Locale,Storia e Borghi"
      },
      {
        title: "Eventi & Spettacoli",
        description: "Feste, concerti e mostre da non perdere.",
        icon: React.createElement(CalendarHeart, { className: "size-5 shrink-0" }),
        url: "/dashboard?categories=Eventi"
      },
      {
        title: "Divertimento & Famiglia",
        description: "Parchi, attività e relax per tutti.",
        icon: React.createElement(Users, { className: "size-5 shrink-0" }),
        url: "/dashboard?categories=Parchi a Tema e Acquatici,Attività per Bambini,Fattorie Didattiche e Animali,Esperienze Educative,Vita Notturna"
      },
      {
        title: "Natura & Avventura",
        description: "Spiagge, parchi e sport all'aria aperta.",
        icon: React.createElement(MountainSnow, { className: "size-5 shrink-0" }),
        url: "/dashboard?categories=Spiagge,Parchi Naturali e Riserve,Sport"
      }
    ]
  },
  { title: "Il Mio Passaporto", url: "/my-passport" },
  { title: "Respiro del Mare", url: "/respiro-del-mare" },
  { title: "Oggi in Romagna", url: "/oggi" }
];

export const LOGO_CONFIG = {
  src: "/lovable-uploads/673fa174-b69d-4246-a652-97158e041630.png",
  alt: "Logo Mia Romagna"
};

export const Z_INDEX = {
  HEADER: 5000,
  DROPDOWN: 5001
} as const;