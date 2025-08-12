
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Mail, Waves } from 'lucide-react';

const DonationLevelsSection = () => {
  const donationLevels = [
    {
      icon: <Waves className="h-12 w-12 mx-auto mb-6 text-blue-400" />,
      title: "Amico della Costa",
      amount: "15€",
      description: "Finanzi simbolicamente 1 ora di pulizia e la raccolta di un sacco di rifiuti.",
      buttonText: "Dona Ora",
      buttonVariant: "yellow" as const
    },
    {
      icon: <Heart className="h-12 w-12 mx-auto mb-6 text-red-400" />,
      title: "Protettore della Spiaggia",
      amount: "50€",
      description: "\"Adotti\" 10 metri di spiaggia per una settimana, garantendone la pulizia. Riceverai l'attestato digitale di adozione.",
      buttonText: "Dona Ora",
      buttonVariant: "yellow" as const
    },
    {
      icon: (
        <div className="h-12 w-12 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">⭐</span>
        </div>
      ),
      title: "Sentinella Onoraria",
      amount: "120€",
      description: "Finanzi 2 intere giornate di lavoro per una Sentinella della Spiaggia, creando un impatto sociale diretto. Il tuo nome verrà inserito nel registro digitale dei sostenitori.",
      buttonText: "Dona Ora",
      buttonVariant: "yellow" as const
    },
    {
      icon: (
        <div className="h-12 w-12 mx-auto mb-6 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">👑</span>
        </div>
      ),
      title: "Custode della Costa",
      amount: "250€+",
      description: "Oltre a tutti i benefici precedenti, il tuo nome o quello della tua azienda apparirà sulla targa fisica di un \"Punto Respiro\", installata all'inizio di un tratto di spiaggia per un mese.",
      buttonText: "Contattaci",
      buttonVariant: "blue" as const,
      hasIcon: true
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          C'è bisogno di te: sostieni Respiro del Mare
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {donationLevels.map((level, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-white h-full">
              <CardContent className="p-8 text-center flex flex-col justify-between h-full">
                {level.icon}
                <h3 className="text-2xl font-bold mb-4">{level.title}</h3>
                <div className="text-4xl font-bold text-yellow-400 mb-4">{level.amount}</div>
                <p className="text-slate-300 mb-6">
                  {level.description}
                </p>
                <Button 
                  className={`w-full font-bold mt-auto ${
                    level.buttonVariant === 'yellow'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {level.hasIcon && <Mail className="h-4 w-4 mr-2" />}
                  {level.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationLevelsSection;
