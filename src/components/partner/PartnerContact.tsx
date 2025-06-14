
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PartnerContact = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    captcha: ''
  });

  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      alert('Risposta CAPTCHA non corretta. Riprova.');
      return;
    }

    console.log('Form submitted:', formData);
    alert('Richiesta inviata con successo! Ti ricontatteremo presto.');
    
    // Reset form
    setFormData({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      captcha: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contatti" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          
          {/* Colonna Sinistra - Testo */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              Iniziamo a Collaborare
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Compila il modulo per essere ricontattato da un nostro agente del territorio. 
              Insieme, valuteremo come promuovere al meglio la tua esperienza unica.
            </p>
          </div>

          {/* Colonna Destra - Modulo */}
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <Label htmlFor="businessName" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Nome dell'Attività *
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className="h-12 text-base"
                    placeholder="Es. Osteria del Borgo"
                  />
                </div>

                <div>
                  <Label htmlFor="contactName" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Nome del Referente *
                  </Label>
                  <Input
                    id="contactName"
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className="h-12 text-base"
                    placeholder="Mario Rossi"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-12 text-base"
                    placeholder="mario@osteriadelbombo.it"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Telefono *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-12 text-base"
                    placeholder="+39 333 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Sito Web
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="h-12 text-base"
                    placeholder="https://www.tuosito.it"
                  />
                </div>

                <div>
                  <Label htmlFor="captcha" className="text-sm font-semibold text-slate-700 mb-2 block">
                    Quanto fa {captchaQuestion.num1} + {captchaQuestion.num2}? *
                  </Label>
                  <Input
                    id="captcha"
                    type="number"
                    required
                    value={formData.captcha}
                    onChange={(e) => handleChange('captcha', e.target.value)}
                    className="h-12 text-base"
                    placeholder="Inserisci il risultato"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 text-lg py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                >
                  Invia la Richiesta
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnerContact;
