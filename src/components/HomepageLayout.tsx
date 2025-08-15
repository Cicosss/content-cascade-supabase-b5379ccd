import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { Header } from './header/Header';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import Footer from './Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Ora anche la homepage ha l'header fisso uniformato
  return (
    <LocationProvider>
      <HeaderProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Header fisso con stile automatico (trasparente per homepage) */}
          <Header />
          
          {/* Main content con padding per header fisso responsive */}
          <main className="flex-1 relative pb-20 md:pb-0 pt-16 md:pt-20 lg:pt-24">
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