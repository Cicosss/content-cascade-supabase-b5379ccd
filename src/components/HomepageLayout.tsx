import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';

import { MobileTouchNav } from './navigation/MobileTouchNav';

import Footer from './Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  return (
    <LocationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Main content - navbar is now global */}
        <main className="flex-1 relative md:pb-0">
          {children}
        </main>
        <Footer />
        {/* Hide MobileTouchNav when MainNavbar mobile menu is open */}
        <MobileTouchNav isVisible={!isMobileNavOpen} />
      </div>
    </LocationProvider>
  );
};

export default HomepageLayout;