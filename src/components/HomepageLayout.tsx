import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { HomepageNavProvider } from '@/contexts/HomepageNavContext';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import { HomepageHeader } from './header/HomepageHeader';
import Footer from './Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  return (
    <LocationProvider>
      <HomepageNavProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Fixed header positioned outside of any overflow containers */}
          <HomepageHeader className="fixed top-0 left-0 right-0 z-header w-full bg-transparent pointer-events-auto" />
          
          {/* Main content without padding for header */}
          <main className="flex-1 relative pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileTouchNav />
        </div>
      </HomepageNavProvider>
    </LocationProvider>
  );
};

export default HomepageLayout;