import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
import respiroImage from '@/assets/respiro-del-mare-hero.jpg';
import { motion, useInView, animate } from 'framer-motion';

const RespiroDelMareTeaser: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Animation controls per le statistiche
  const [transparency, setTransparency] = useState(0);
  const [impact, setImpact] = useState(0);

  const handleDiscoverProject = () => {
    navigate('/respiro-del-mare');
  };

  // Counter animation per le statistiche
  useEffect(() => {
    if (isInView) {
      // Animazione per 100%
      const transparencyAnimation = animate(0, 100, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (value) => setTransparency(Math.round(value))
      });

      // Animazione per 2x con leggero delay
      const impactAnimation = animate(0, 2, {
        duration: 1.2,
        delay: 0.2,
        ease: "easeOut", 
        onUpdate: (value) => setImpact(Math.round(value * 10) / 10)
      });

      return () => {
        transparencyAnimation.stop();
        impactAnimation.stop();
      };
    }
  }, [isInView]);

  // Varianti di animazione
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 md:py-16 lg:py-20"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Colonna Sinistra - Immagine */}
          <motion.div 
            className="order-1 lg:order-1"
            variants={itemVariants}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={respiroImage}
                alt="Volontari che puliscono la spiaggia della Romagna"
                className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent shadow-2xl" />
            </div>
          </motion.div>

          {/* Colonna Destra - Contenuto */}
          <motion.div 
            className="order-2 lg:order-2 space-y-6 lg:space-y-8"
            variants={itemVariants}
          >
            
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-500/40 to-cyan-500/40 text-white px-8 py-4 rounded-full backdrop-blur-md border-2 border-teal-300/50 shadow-2xl shadow-teal-500/25"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Heart className="w-6 h-6 text-teal-200" />
              <span className="typography-small font-bold tracking-widest uppercase text-teal-100">Impatto Sociale</span>
            </motion.div>

            {/* Titolo Principale */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-light text-white leading-none tracking-tight">
                Più di una vacanza.
              </h2>
              <div className="relative">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-black leading-none tracking-tighter bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Un'impronta positiva.
                </h2>
                <div className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-black leading-none tracking-tighter text-teal-300/20 blur-sm transform translate-x-1 translate-y-1">
                  Un'impronta positiva.
                </div>
              </div>
            </motion.div>

            {/* Descrizione */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <p className="text-lg md:text-xl lg:text-2xl text-slate-100 leading-relaxed font-light">
                Con <span className="font-bold text-teal-200 bg-teal-900/30 px-2 py-1 rounded">"Respiro del Mare"</span> trasformiamo la pulizia delle nostre spiagge in un'opportunità 
                di lavoro concreta per le persone più fragili del nostro territorio.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed">
                Ogni donazione ha un doppio valore: <strong className="text-white font-black text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">ambientale e sociale</strong>.
              </p>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={handleDiscoverProject}
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-bold group shadow-2xl shadow-teal-500/25 border border-teal-400/30"
                >
                  Scopri il progetto
                  <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                </Button>
              </motion.div>

            </motion.div>

            {/* Statistiche rapide - Counter Animation */}
            <motion.div 
              className="grid grid-cols-2 gap-8 pt-6 border-t border-teal-400/30"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-teal-900/40 to-cyan-900/40 rounded-xl border border-teal-400/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                  {transparency}%
                </div>
                <div className="typography-small text-teal-100 font-semibold uppercase tracking-wider">Trasparenza</div>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-400/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 2.0 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2">
                  {impact}x
                </div>
                <div className="typography-small text-cyan-100 font-semibold uppercase tracking-wider">Impatto positivo</div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default RespiroDelMareTeaser;