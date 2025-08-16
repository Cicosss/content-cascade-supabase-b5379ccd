import React from 'react';

export interface NavigationItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: NavigationItem[];
}

export const createMenuItems = (): NavigationItem[] => [
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