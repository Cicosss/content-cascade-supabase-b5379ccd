
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Gift, Clock, Star, Trophy, MapPin, Target, CloudSun, Navigation, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeaserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'offers' | 'passport' | 'weather';
}

const TeaserAuthModal: React.FC<TeaserAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  variant = 'offers' 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth?mode=login');
    onClose();
  };

  const handleSignup = () => {
    navigate('/auth?mode=signup');
    onClose();
  };

  // Contenuti diversi basati sulla variante
  const getContent = () => {
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

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className={`bg-gradient-to-r ${content.gradient} p-8 text-white`}>
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <IconComponent className={`h-16 w-16 ${
                variant === 'weather' ? 'text-cyan-300' : 
                variant === 'passport' ? 'text-amber-300' : 'text-yellow-400'
              } animate-pulse`} />
            </div>
            <DialogTitle className="text-3xl font-bold">
              {content.title}
            </DialogTitle>
            <p className="text-lg text-white/90 max-w-md mx-auto">
              {content.subtitle}
            </p>
          </DialogHeader>
        </div>

        <div className="p-8">
          {/* Benefici della Registrazione */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-3">
                <div className={`${
                  variant === 'weather'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                    : variant === 'passport'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                } w-12 h-12 rounded-full flex items-center justify-center mx-auto`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{benefit.title}</h3>
                <p className="text-xs text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Pulsanti di Azione */}
          <div className="space-y-4">
            <Button 
              onClick={handleSignup}
              className={`w-full text-lg py-6 font-semibold ${
                variant === 'weather'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : variant === 'passport' 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                  : 'auth-button-secondary'
              }`}
            >
              <IconComponent className="h-5 w-5 mr-2" />
              {content.ctaText}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-slate-600">Hai già un account? </span>
              <Button 
                variant="link" 
                onClick={handleLogin}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm font-semibold"
              >
                Accedi qui
              </Button>
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              {content.footerText}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeaserAuthModal;
