import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MiaRomagnaLogo from './MiaRomagnaLogo';

interface HeroCategory {
  id: string;
  title: string;
  subtitle: string;
  backgroundSrc: string;
  route: string;
  isVideo?: boolean;
}

const heroCategories: HeroCategory[] = [
  {
    id: 'gusto-sapori',
    title: 'GUSTO & SAPORI',
    subtitle: 'ristoranti, cantine, prodotti tipici',
    backgroundSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop',
    route: '/gusto-sapori'
  },
  {
    id: 'cultura-territorio',
    title: 'CULTURA & TERRITORIO',
    subtitle: 'borghi, musei, tradizioni locali',
    backgroundSrc: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?q=80&w=2000&auto=format&fit=crop',
    route: '/cultura-territorio'
  },
  {
    id: 'eventi-spettacoli',
    title: 'EVENTI & SPETTACOLI',
    subtitle: 'concerti, festival, vita notturna',
    backgroundSrc: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop',
    route: '/eventi-spettacoli'
  },
  {
    id: 'divertimento-famiglia',
    title: 'DIVERTIMENTO & FAMIGLIA',
    subtitle: 'parchi, spiagge, attività family',
    backgroundSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop',
    route: '/divertimento-famiglia'
  }
];

const InteractiveHeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBackground, setActiveBackground] = useState('gusto-sapori');
  
  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Benvenuto ${user.user_metadata.first_name}!`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Benvenuto ${emailName}!`;
    }
    return 'Benvenuto in Romagna!';
  };

  const handleCategoryHover = (categoryId: string) => {
    setActiveBackground(categoryId);
  };

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0">
        {heroCategories.map((category) => (
          <div
            key={category.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              activeBackground === category.id ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${category.backgroundSrc})`
              }}
            />
          </div>
        ))}
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Content */}
        <div className="flex-1 flex items-center justify-center text-white text-center px-4">
          <div className="max-w-5xl mx-auto">
            {/* Brand Section */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <MiaRomagnaLogo width={160} height={53} className="drop-shadow-lg" />
              <div>
                <p className="typography-subtitle text-brand-yellow-400 drop-shadow-lg">
                  "Il territorio è tra le Tue mani"
                </p>
              </div>
            </div>
            
            <div className="space-y-8 mb-12">
              <h1 className="typography-hero text-white drop-shadow-2xl">
                {getUserGreeting()}
              </h1>
              <p className="typography-body-large text-slate-100 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
              </p>
              <p className="typography-story-intro text-slate-50 max-w-3xl mx-auto drop-shadow-lg">
                Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
                Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-12">
              <Button 
                variant="outline" 
                onClick={() => navigate('/experiences')} 
                className="border-2 border-brand-blue-400/60 bg-brand-blue-600/20 text-white hover:bg-brand-blue-600/30 hover:border-brand-blue-400/80 px-12 py-7 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 backdrop-blur-md drop-shadow-lg"
              >
                <Heart className="h-6 w-6 mr-3 text-brand-blue-300" />
                Scopri le Esperienze
              </Button>
            </div>

            {/* Key features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
              <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
                <div className="w-3 h-3 bg-brand-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="typography-body-small font-medium drop-shadow-lg text-white">Supporto 6 lingue complete</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
                <div className="w-3 h-3 bg-brand-blue-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="typography-body-small font-medium drop-shadow-lg text-white">GPS integrato e mappe offline</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
                <div className="w-3 h-3 bg-brand-yellow-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="typography-body-small font-medium drop-shadow-lg text-white">Guide locali certificate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Navigation Bar - Bottom Center */}
        <div className="pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center space-x-8 lg:space-x-12">
              {heroCategories.map((category) => (
                <div
                  key={category.id}
                  className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    activeBackground === category.id ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onClick={() => handleCategoryClick(category.route)}
                >
                  <div className="text-center">
                    <div className={`mb-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeBackground === category.id 
                        ? 'bg-brand-yellow-400/30 border-2 border-brand-yellow-400/60' 
                        : 'bg-white/10 border-2 border-white/20 group-hover:bg-white/20 group-hover:border-white/40'
                    }`}>
                      <h2 className="typography-h4 text-white font-bold mb-1 drop-shadow-lg">
                        {category.title}
                      </h2>
                      <p className="typography-body-small text-slate-200 font-medium drop-shadow-lg">
                        {category.subtitle}
                      </p>
                    </div>
                    
                    {/* Active Indicator */}
                    <div className={`mx-auto w-2 h-2 rounded-full transition-all duration-300 ${
                      activeBackground === category.id 
                        ? 'bg-brand-yellow-400 shadow-lg shadow-brand-yellow-400/50' 
                        : 'bg-white/40 group-hover:bg-white/60'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
