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
              className="inline-flex items-center gap-2 bg-teal-100/20 text-teal-200 px-4 py-2 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Heart className="w-4 h-4" />
              <span className="typography-caption font-medium">Impatto Sociale</span>
            </motion.div>

            {/* Titolo Principale */}
            <motion.h2 
              className="typography-h2 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              Più di una vacanza.
              <br />
              <span className="text-teal-300">Un'impronta positiva.</span>
            </motion.h2>

            {/* Descrizione */}
            <motion.p 
              className="typography-body text-slate-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              Con "Respiro del Mare" trasformiamo la pulizia delle nostre spiagge in un'opportunità 
              di lavoro concreta per le persone più fragili del nostro territorio. Ogni donazione ha 
              un doppio valore: <strong>ambientale e sociale</strong>.
            </motion.p>

            {/* Call-to-Action */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={handleDiscoverProject}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base font-medium group"
                >
                  Scopri il progetto
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              {/* Link secondario */}
              <div>
                <motion.button 
                  onClick={handleDiscoverProject}
                  className="typography-small text-teal-300 hover:text-teal-200 font-medium underline-offset-4 hover:underline transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Fai una donazione →
                </motion.button>
              </div>
            </motion.div>

            {/* Statistiche rapide - Counter Animation */}
            <motion.div 
              className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-600/50"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className="typography-h4 text-teal-300 font-bold">
                  {transparency}%
                </div>
                <div className="typography-caption text-slate-300">Trasparenza</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <div className="typography-h4 text-teal-300 font-bold">
                  {impact}x
                </div>
                <div className="typography-caption text-slate-300">Impatto positivo</div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default RespiroDelMareTeaser;