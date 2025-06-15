import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Mail, Waves } from 'lucide-react';
const RespiroDelMare = () => {
  return <Layout>
      <div className="bg-white text-slate-800">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-900/20 to-blue-600/30 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3)'
        }} />
          <div className="absolute inset-0 bg-blue-900/40" />
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
              Respiro del Mare
            </h1>
            <h2 className="text-2xl md:text-4xl font-light mb-8 drop-shadow-lg">
              Insieme, puliamo le spiagge della Romagna e creiamo opportunità.
            </h2>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-8">
              FAQ - Domande e Risposte
            </h2>
            <p className="text-lg text-slate-600 text-center max-w-4xl mx-auto mb-16">
              Abbiamo raccolto le domande più frequenti sull'iniziativa 'Respiro del Mare'. 
              Il nostro obiettivo è la massima trasparenza, per farvi comprendere come ogni 
              singola donazione contribuisce a un mare più pulito e a una comunità più forte.
            </p>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Cos'è "Respiro del Mare"?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  È un'iniziativa di Mia Romagna per finanziare, attraverso donazioni, la pulizia 
                  delle spiagge e dei fondali marini della costa romagnola. L'aspetto unico del 
                  progetto è che la pulizia viene affidata a persone in difficoltà economica del 
                  nostro territorio, creando un doppio impatto: ambientale e sociale.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Qual è l'obiettivo del progetto?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Valorizzare e proteggere il nostro patrimonio costiero, rendendolo più pulito e 
                  sicuro per tutti, e allo stesso tempo offrire un'opportunità di lavoro e 
                  reinserimento a chi ne ha più bisogno.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Come vengono usati i fondi raccolti?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Il 100% delle donazioni (al netto dei costi di transazione) viene utilizzato per 
                  stipendiare le "Sentinelle della Spiaggia" – le persone incaricate della pulizia – 
                  e per fornire loro l'attrezzatura necessaria (guanti, sacchi, pinze, etc.).
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Facendo la donazione, saprò quale tratto di spiaggia ho aiutato a pulire?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Sì. Ogni donazione viene associata simbolicamente a un'area specifica. Riceverai 
                  via mail un attestato digitale con le coordinate del tratto di spiaggia che hai 
                  "adottato" e aggiornamenti periodici sui risultati delle operazioni di pulizia in 
                  quella zona.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Levels Section */}
        <section className="py-24 md:py-32 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              C'è bisogno di te: sostieni Respiro del Mare
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Card 1 */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="p-8 text-center">
                  <Waves className="h-12 w-12 mx-auto mb-6 text-blue-400" />
                  <h3 className="text-2xl font-bold mb-4">Amico della Costa</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-4">15€</div>
                  <p className="text-slate-300 mb-6">
                    Finanzi simbolicamente 1 ora di pulizia e la raccolta di un sacco di rifiuti.
                  </p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                    Dona Ora
                  </Button>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-6 text-red-400" />
                  <h3 className="text-2xl font-bold mb-4">Protettore della Spiaggia</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-4">50€</div>
                  <p className="text-slate-300 mb-6">
                    "Adotti" 10 metri di spiaggia per una settimana, garantendone la pulizia. 
                    Riceverai l'attestato digitale di adozione.
                  </p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                    Dona Ora
                  </Button>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="p-8 text-center">
                  <div className="h-12 w-12 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sentinella Onoraria</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-4">120€</div>
                  <p className="text-slate-300 mb-6">Finanzi 2 intere giornate di lavoro per una Sentinella della Spiaggia, creando un impatto sociale diretto. Il tuo nome verrà inserito nel registro digitale dei sostenitori.</p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                    Dona Ora
                  </Button>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="p-8 text-center">
                  <div className="h-12 w-12 mx-auto mb-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Custode della Costa</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-4">250€+</div>
                  <p className="text-slate-300 mb-6">Oltre a tutti i benefici precedenti, il tuo nome o quello della tua azienda apparirà sulla targa fisica di un &quot;Punto Respiro&quot;, installata all'inizio di un tratto di spiaggia per un mese.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    <Mail className="h-4 w-4 mr-2" />
                    Contattaci
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              In Collaborazione Con
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-slate-500 text-lg font-semibold px-6 py-3 bg-slate-100 rounded-lg">
                Comune di Rimini
              </div>
              <div className="text-slate-500 text-lg font-semibold px-6 py-3 bg-slate-100 rounded-lg">
                Legambiente Romagna
              </div>
              <div className="text-slate-500 text-lg font-semibold px-6 py-3 bg-slate-100 rounded-lg">
                Cooperative Sociali
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Donation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 px-6 py-4 text-lg font-bold rounded-full">
          <Heart className="h-5 w-5 mr-2" />
          FAI LA TUA DONAZIONE
        </Button>
      </div>
    </Layout>;
};
export default RespiroDelMare;