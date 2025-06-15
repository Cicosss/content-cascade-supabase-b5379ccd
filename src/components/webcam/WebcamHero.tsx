
import React from 'react';

const WebcamHero = () => {
  return (
    <div 
      className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80"
      style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(30, 58, 138, 0.6)), url("https://i.ibb.co/LDWz8f4y/Progetto-senza-titolo-7.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-6 text-center text-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-shadow-lg drop-shadow-2xl">
            Webcam Live della Romagna
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed opacity-90 text-shadow-md drop-shadow-lg">
            Esplora la bellezza della Romagna in tempo reale attraverso le nostre webcam live. 
            Dalle spiagge alle città d'arte, scopri cosa succede ora nei luoghi più belli della regione.
          </p>
          
          {/* Powered By Section nella Hero - Aligned Right */}
          <div className="flex justify-end">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-2xl">
              <img 
                src="https://i.ibb.co/t6p6c0F/Powered-by.png" 
                alt="Powered-by" 
                className="h-14 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamHero;
