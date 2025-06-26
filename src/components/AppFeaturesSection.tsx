
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, MessageCircle, Globe, Smartphone, Star, Shield, Heart, Zap } from 'lucide-react';

const AppFeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Mappa Interattiva con GPS",
      description: "Sistema GPS avanzato che ti segnala attrazioni nascoste, percorsi ottimali e luoghi di interesse nelle immediate vicinanze con precisione centimetrica",
      color: "from-brand-blue-600 to-brand-blue-800",
      accent: "bg-brand-blue-50"
    },
    {
      icon: Users,
      title: "Guide Locali Certificate",
      description: "Accesso esclusivo a oltre 50 guide locali certificate che condividono segreti del territorio tramandati di generazione in generazione",
      color: "from-brand-yellow-400 to-brand-yellow-600",
      accent: "bg-brand-yellow-50"
    },
    {
      icon: Calendar,
      title: "Eventi in Tempo Reale",
      description: "Aggiornamenti istantanei su eventi culturali, sportivi, gastronomici e spettacoli con notifiche personalizzate e calendario integrato",
      color: "from-brand-blue-500 to-brand-blue-700",  
      accent: "bg-brand-blue-50"
    },
    {
      icon: MessageCircle,
      title: "Itinerari Personalizzati",
      description: "Algoritmo intelligente che crea percorsi su misura basati sui tuoi interessi, tempo disponibile e preferenze di viaggio",
      color: "from-brand-yellow-500 to-brand-yellow-700",
      accent: "bg-brand-yellow-50"
    },
    {
      icon: Globe,
      title: "Supporto Multilingua Completo",
      description: "Disponibile in 6 lingue complete: Italiano, Inglese, Tedesco, Francese, Spagnolo e Russo con traduzione automatica dei contenuti",
      color: "from-brand-blue-700 to-brand-blue-900",
      accent: "bg-brand-blue-50"
    },
    {
      icon: Smartphone,
      title: "Esperienza Interattiva",
      description: "Sistema di feedback e recensioni della community, condivisione social integrata e possibilità di contribuire con le tue scoperte",
      color: "from-brand-yellow-600 to-brand-yellow-800",
      accent: "bg-brand-yellow-50"
    }
  ];

  const additionalFeatures = [
    {
      icon: Star,
      title: "Luoghi Esclusivi",
      description: "Accesso a location non turistiche e esperienze autentiche"
    },
    {
      icon: Shield,
      title: "Sicurezza Garantita",
      description: "Tutte le attività sono verificate e rispettano standard di sicurezza"
    },
    {
      icon: Heart,
      title: "Preferiti e Wishlist",
      description: "Salva i tuoi luoghi preferiti e crea liste personalizzate"
    },
    {
      icon: Zap,
      title: "Modalità Offline",
      description: "Funziona anche senza connessione internet"
    }
  ];

  return (
    <section className="py-20 bg-brand-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header Section con Typography Sofisticata */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-blue-900 text-white px-6 py-3 rounded-full typography-body-small font-semibold mb-8 shadow-lg">
            <Smartphone className="h-4 w-4" />
            <span>Tecnologia All'Avanguardia</span>
          </div>
          <h2 className="typography-h1 typography-brand-primary mb-8">I Punti di Forza dell'App</h2>
          <p className="typography-story-intro max-w-4xl mx-auto">
            Un compagno di viaggio intelligente che ti offre accesso privilegiato alle autentiche meraviglie della Romagna, 
            con tecnologie avanzate e il supporto di esperti locali per un'esperienza indimenticabile
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:scale-105 transform">
              <div className="space-y-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="typography-h4 typography-brand-primary group-hover:text-brand-blue-700 transition-colors">{feature.title}</h3>
                  <p className="typography-body leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white border-brand-blue-100">
              <feature.icon className="h-10 w-10 mx-auto mb-4 text-brand-blue-600" />
              <h4 className="typography-h5 typography-brand-primary mb-3">{feature.title}</h4>
              <p className="typography-body-small">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <Card className="p-12 bg-brand-gradient text-white border-0 shadow-2xl rounded-3xl">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-2 bg-brand-yellow-400 text-brand-blue-900 px-8 py-4 rounded-full font-bold shadow-lg">
                  <span className="text-xl">✅</span>
                  <span className="typography-body-small font-bold">100% Gratuita per Tutti</span>
                </div>
              </div>
              <h3 className="typography-h2 mb-6">Disponibile su Android & iOS</h3>
              <p className="typography-body-large text-slate-200 mb-10">
                Unisciti a migliaia di esploratori che hanno già scoperto i segreti della Romagna
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button className="bg-white text-brand-blue-900 hover:bg-slate-100 px-10 py-5 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Scarica per Android
                </Button>
                <Button className="bg-white text-brand-blue-900 hover:bg-slate-100 px-10 py-5 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Scarica per iOS
                </Button>
              </div>
              <p className="typography-body-small text-slate-300 mt-6">
                * Nessuna registrazione richiesta • Aggiornamenti gratuiti a vita • Supporto clienti 24/7
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppFeaturesSection;
