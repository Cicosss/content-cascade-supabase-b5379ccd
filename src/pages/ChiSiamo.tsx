
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ChiSiamo = () => {
  return (
    <Layout>
      <div className="bg-white text-slate-800">
        {/* Sezione 1: La Nostra Missione (Hero Section) */}
        <section className="py-24 md:py-32 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              La nostra missione: svelare l'anima della Romagna.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600">
              Mia Romagna nasce da una convinzione profonda: ogni angolo del nostro territorio ha una storia da raccontare, un sapore da scoprire, un'emozione da vivere. Siamo andati oltre le solite mete per creare una guida che parla al cuore, dedicata a chi, come noi, cerca l'autenticità.
            </p>
          </div>
        </section>

        {/* Sezione 2: Il Team (I Volti dietro al Progetto) */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="md:w-2/5">
                <img
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1974&auto=format&fit=crop"
                  alt="Il team di Mia Romagna"
                  className="rounded-lg shadow-2xl w-full h-auto object-cover filter grayscale"
                />
              </div>
              <div className="md:w-3/5">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Un Progetto Nato dalla Passione
                </h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed text-left">
                  Siamo un gruppo di giovani romagnoli, amanti della nostra terra, con un background che spazia dalla tecnologia al marketing, dalla fotografia alla narrazione. Abbiamo unito le nostre competenze per un unico scopo: offrire al mondo una visione della Romagna che sia allo stesso tempo intima e sorprendente, moderna nella forma e profondamente radicata nella tradizione.
                </p>
                <p className="mt-6 text-slate-500 italic text-lg">
                  – Luca, Maria, e tutto il team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione 3: I Nostri Valori (I Principi Guida) */}
        <section className="py-24 md:py-32 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">
              I Nostri Valori
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-slate-900 mb-3">Autenticità</h4>
                <p className="text-slate-600">
                  Selezioniamo solo esperienze vere, che raccontano l'identità del nostro territorio. Nessun compromesso.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-slate-900 mb-3">Innovazione</h4>
                <p className="text-slate-600">
                  Usiamo la tecnologia per rendere la scoperta semplice e personalizzata, creando un ponte tra tradizione e futuro.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-slate-900 mb-3">Rispetto</h4>
                <p className="text-slate-600">
                  Promuoviamo un turismo sostenibile, che rispetta le comunità locali, l'ambiente e il patrimonio culturale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione 4: Call to Action (La Chiusura) */}
        <section className="py-24 md:py-32 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto a Esplorare?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10">
              La tua avventura nella Romagna autentica inizia ora.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white text-base px-8 py-3 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                asChild
              >
                <a href="#">Scarica l'App <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-slate-900 text-base px-8 py-3 h-auto rounded-lg transition-colors duration-300"
                asChild
              >
                <Link to="/partner">Collabora con Noi</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ChiSiamo;
