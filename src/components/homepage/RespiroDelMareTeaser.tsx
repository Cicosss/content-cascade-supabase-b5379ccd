import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
import respiroImage from '@/assets/respiro-del-mare-hero.jpg';

const RespiroDelMareTeaser: React.FC = () => {
  const navigate = useNavigate();

  const handleDiscoverProject = () => {
    navigate('/respiro-del-mare');
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-teal-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Colonna Sinistra - Immagine */}
          <div className="order-1 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={respiroImage}
                alt="Volontari che puliscono la spiaggia della Romagna"
                className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Colonna Destra - Contenuto */}
          <div className="order-2 lg:order-2 space-y-6 lg:space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4" />
              <span className="typography-caption font-medium">Impatto Sociale</span>
            </div>

            {/* Titolo Principale */}
            <h2 className="typography-h2 text-slate-900 leading-tight">
              Più di una vacanza.
              <br />
              <span className="text-teal-700">Un'impronta positiva.</span>
            </h2>

            {/* Descrizione */}
            <p className="typography-body text-slate-700 leading-relaxed">
              Con "Respiro del Mare" trasformiamo la pulizia delle nostre spiagge in un'opportunità 
              di lavoro concreta per le persone più fragili del nostro territorio. Ogni donazione ha 
              un doppio valore: <strong>ambientale e sociale</strong>.
            </p>

            {/* Call-to-Action */}
            <div className="space-y-4">
              <Button 
                onClick={handleDiscoverProject}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base font-medium group"
              >
                Scopri il progetto
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Link secondario */}
              <div>
                <button 
                  onClick={handleDiscoverProject}
                  className="typography-small text-teal-700 hover:text-teal-800 font-medium underline-offset-4 hover:underline transition-colors"
                >
                  Fai una donazione →
                </button>
              </div>
            </div>

            {/* Statistiche rapide */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div>
                <div className="typography-h4 text-teal-700 font-bold">100%</div>
                <div className="typography-caption text-slate-600">Trasparenza</div>
              </div>
              <div>
                <div className="typography-h4 text-teal-700 font-bold">2x</div>
                <div className="typography-caption text-slate-600">Impatto positivo</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RespiroDelMareTeaser;