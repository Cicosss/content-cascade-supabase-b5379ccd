
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Gift, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeaserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeaserAuthModal: React.FC<TeaserAuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth?mode=login');
    onClose();
  };

  const handleSignup = () => {
    navigate('/auth?mode=signup');
    onClose();
  };

  const benefits = [
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
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Zap className="h-16 w-16 text-yellow-400 animate-pulse" />
            </div>
            <DialogTitle className="text-3xl font-bold">
              Sblocca le Offerte di Oggi!
            </DialogTitle>
            <p className="text-lg text-white/90 max-w-md mx-auto">
              Accedi o registrati gratuitamente per sbloccare le offerte esclusive di oggi e molto altro!
            </p>
          </DialogHeader>
        </div>

        <div className="p-8">
          {/* Benefici della Registrazione */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
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
              className="w-full auth-button-secondary text-lg py-6 font-semibold"
            >
              <Gift className="h-5 w-5 mr-2" />
              Registrati Gratis e Sblocca Tutto
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
              🚀 Unisciti a migliaia di utenti che scoprono ogni giorno il meglio della Romagna
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeaserAuthModal;
