import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import Footer from './Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Per la homepage, non mostriamo mai l'header fisso - è integrato nella hero
  return (
    <LocationProvider>
      <HeaderProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Nessun header fisso - navigazione integrata nella hero */}
          
          {/* Main content senza padding per header */}
          <main className="flex-1 relative pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileTouchNav />
        </div>
      </HeaderProvider>
    </LocationProvider>
  );
};

export default HomepageLayout;