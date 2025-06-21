
import { POI } from '@/types/poi';

export const FALLBACK_POI_DATA: POI[] = [
  {
    id: '1',
    name: 'Osteria del Borgo Antico',
    description: 'Tradizione Culinaria Romagnola nel cuore del centro storico',
    macro_area: 'Gusto & Sapori',
    category: 'Ristoranti',
    latitude: 44.0646,
    longitude: 12.5736,
    address: 'Centro Storico di Rimini',
    target_audience: 'everyone',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'],
    price_info: '€€',
    avg_rating: 4.5
  },
  {
    id: '2',
    name: 'Tempio Malatestiano',
    description: 'Capolavoro Rinascimentale progettato da Leon Battista Alberti',
    macro_area: 'Cultura & Territorio',
    category: 'Arte',
    latitude: 44.0587,
    longitude: 12.5684,
    address: 'Via IV Novembre, Rimini',
    target_audience: 'everyone',
    images: ['https://images.unsplash.com/photo-1549813069-f95e44d7f498?w=400&h=200&fit=crop'],
    avg_rating: 4.8
  },
  {
    id: '3',
    name: 'Spiaggia di Riccione',
    description: 'Relax sul mare adriatico con stabilimenti balneari attrezzati',
    macro_area: 'Divertimento & Famiglia',
    category: 'Spiagge',
    latitude: 44.0139,
    longitude: 12.6578,
    address: 'Lungomare di Riccione',
    target_audience: 'everyone',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop'],
    avg_rating: 4.3
  }
];
