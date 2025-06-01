
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Zap, ParkingCircle, AlertTriangle, MessageCircle } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { icon: Car, label: 'Taxi', desc: 'Chiama un taxi' },
    { icon: Zap, label: 'Ricarica EV', desc: 'Stazioni di ricarica' },
    { icon: ParkingCircle, label: 'Parcheggi', desc: 'Trova parcheggio' },
  ];

  return (
    <div className="space-y-6">
      {/* Services */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Servizi Vicini</h2>
        <div className="grid grid-cols-3 gap-4">
          {services.map((service, index) => (
            <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <service.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-medium text-sm">{service.label}</div>
              <div className="text-xs text-gray-500">{service.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety Alert */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">Prudenza in Mare</h3>
            <p className="text-sm text-amber-800">
              Controlla le condizioni meteo marine prima di entrare in acqua. Rispetta le bandiere di sicurezza.
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="p-6 romagna-gradient text-white text-center">
        <MessageCircle className="h-8 w-8 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">Hai bisogno di aiuto?</h3>
        <p className="text-white/90 mb-4 text-sm">
          I nostri esperti locali sono qui per aiutarti
        </p>
        <Button variant="secondary" className="w-full">
          Contattaci
        </Button>
      </Card>
    </div>
  );
};

export default ServicesSection;
