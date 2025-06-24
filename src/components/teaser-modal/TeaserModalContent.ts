
import { LucideIcon, Zap, Gift, Clock, Star, Trophy, MapPin, Target, CloudSun, Navigation, Crosshair } from 'lucide-react';

export interface TeaserBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface TeaserContent {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  benefits: TeaserBenefit[];
  ctaText: string;
  footerText: string;
  gradient: string;
}

export const getTeaserContent = (variant: 'offers' | 'passport' | 'weather'): TeaserContent => {
  switch (variant) {
    case 'weather':
      return {
        icon: CloudSun,
        title: 'Meteo Personalizzato GPS',
        subtitle: 'Registrati per sbloccare previsioni meteo precise basate sulla tua posizione esatta!',
        benefits: [
          {
            icon: Crosshair,
            title: 'Posizione Precisa',
            description: 'Meteo basato esattamente sulla tua ubicazione GPS in tempo reale'
          },
          {
            icon: Navigation,
            title: 'Aggiornamenti Live',
            description: 'Previsioni che si aggiornano automaticamente quando ti sposti'
          },
          {
            icon: CloudSun,
            title: 'Dettagli Completi',
            description: 'Umidità, vento, visibilità e previsioni orarie dettagliate'
          }
        ],
        ctaText: '🌤️ Attiva il Meteo GPS',
        footerText: '📍 Ottieni previsioni precise ovunque ti trovi in Romagna',
        gradient: 'from-blue-600 via-sky-600 to-cyan-600'
      };
    
    case 'passport':
      return {
        icon: Trophy,
        title: 'Inizia la Tua Avventura!',
        subtitle: 'Registrati per iniziare a collezionare le tue esperienze e sbloccare badge esclusivi!',
        benefits: [
          {
            icon: Trophy,
            title: 'Badge Esclusivi',
            description: 'Colleziona badge unici visitando luoghi e provando esperienze'
          },
          {
            icon: MapPin,
            title: 'Passaporto Digitale',
            description: 'Tieni traccia di tutti i luoghi che hai visitato in Romagna'
          },
          {
            icon: Target,
            title: 'Sfide Personalizzate',
            description: 'Obiettivi su misura per diventare un vero esperto del territorio'
          }
        ],
        ctaText: 'Crea il Mio Passaporto',
        footerText: '🏆 Unisciti ai collezionisti di esperienze della Romagna',
        gradient: 'from-amber-600 via-orange-600 to-red-600'
      };
    
    default: // 'offers'
      return {
        icon: Zap,
        title: 'Sblocca le Offerte di Oggi!',
        subtitle: 'Accedi o registrati gratuitamente per sbloccare le offerte esclusive di oggi e molto altro!',
        benefits: [
          {
            icon: Gift,
            title: 'Offerte Esclusive',
            description: 'Accesso a sconti e promozioni riservate solo agli utenti registrati'
          },
          {
            icon: Clock,
            title: 'Aggiornamenti in Tempo Reale',
            description: 'Notifiche immediate su eventi e offerte last-minute'
          },
          {
            icon: Star,
            title: 'Contenuti Personalizzati',
            description: 'Suggerimenti su misura per i tuoi gusti e interessi'
          }
        ],
        ctaText: 'Registrati Gratis e Sblocca Tutto',
        footerText: '🚀 Unisciti a migliaia di utenti che scoprono ogni giorno il meglio della Romagna',
        gradient: 'from-slate-900 via-blue-900 to-indigo-900'
      };
  }
};
