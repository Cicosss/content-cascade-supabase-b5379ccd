
export interface HeroCategory {
  id: string;
  title: string;
  subtitle: string;
  backgroundSrc: string;
  route: string;
  isVideo?: boolean;
}

export const heroCategories: HeroCategory[] = [
  {
    id: 'gusto-sapori',
    title: 'GUSTO & SAPORI',
    subtitle: 'ristoranti, cantine, prodotti tipici',
    backgroundSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop',
    route: '/gusto-sapori'
  },
  {
    id: 'cultura-territorio',
    title: 'CULTURA & TERRITORIO',
    subtitle: 'borghi, musei, tradizioni locali',
    backgroundSrc: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?q=80&w=2000&auto=format&fit=crop',
    route: '/cultura-territorio'
  },
  {
    id: 'eventi-spettacoli',
    title: 'EVENTI & SPETTACOLI',
    subtitle: 'concerti, festival, vita notturna',
    backgroundSrc: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop',
    route: '/eventi-spettacoli'
  },
  {
    id: 'divertimento-famiglia',
    title: 'FAMIGLIA',
    subtitle: 'parchi, spiagge, attività family',
    backgroundSrc: '/lovable-uploads/d2ce14d5-6566-4315-89b8-f8e1b0f47d89.png',
    route: '/divertimento-famiglia'
  }
];
