
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const PartnerContact = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    captcha: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast({
        title: "Errore CAPTCHA",
        description: "Risposta CAPTCHA non corretta. Riprova.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Compila tutti i campi obbligatori per continuare.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Sending partner request:', formData);
      
      const { data, error } = await supabase.functions.invoke('send-partner-request', {
        body: {
          businessName: formData.businessName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website || null
        }
      });

      if (error) {
        console.error('❌ Error calling edge function:', error);
        throw error;
      }

      console.log('✅ Partner request sent successfully:', data);
      
      toast({
        title: "Richiesta inviata con successo!",
        description: "Ti ricontatteremo presto per discutere la partnership.",
      });
      
      // Reset form
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        captcha: ''
      });

    } catch (error) {
      console.error('💥 Error sending partner request:', error);
      toast({
        title: "Errore nell'invio",
        description: "Si è verificato un errore. Riprova più tardi o contattaci direttamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 text-lg py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                >
                  {isSubmitting ? 'Invio in corso...' : 'Invia la Richiesta'}
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
