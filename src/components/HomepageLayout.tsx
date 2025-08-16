import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';

import { MobileTouchNav } from './navigation/MobileTouchNav';
import MainNavbar from './navigation/MainNavbar';

import Footer from './Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  return (
    <LocationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MainNavbar />
        {/* Main content starts from top of screen */}
        <main className="flex-1 relative pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileTouchNav />
      </div>
    </LocationProvider>
  );
};

export default HomepageLayout;