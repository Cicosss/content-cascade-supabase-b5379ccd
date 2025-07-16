
export interface HeroCategory {
  id: string;
  title: string;
  subtitle: string;
  backgroundSrc: string;
  route: string;
  isVideo?: boolean;
}

// URL del video YouTube e immagine mobile per la nuova implementazione
export const HERO_VIDEO_URL = 'https://www.youtube.com/watch?v=55S4I2gqIw0';
export const HERO_MOBILE_IMAGE = 'https://i.ibb.co/1JRNxJpY/Progetto-senza-titolo-6.png';
export const HERO_POSTER_IMAGE = '/lovable-uploads/673fa174-b69d-4246-a652-97158e041630.png';

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
    backgroundSrc: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop',
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
    backgroundSrc: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=2000&auto=format&fit=crop',
    route: '/divertimento-famiglia'
  }
];
