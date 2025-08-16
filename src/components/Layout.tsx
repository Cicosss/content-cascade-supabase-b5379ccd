
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import AppSidebar from './AppSidebar';
import Footer from './Footer';
import MainNavbar from './navigation/MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  const shouldShowSidebar = !loading && user;
  const isHomepage = location.pathname === '/';
  
  if (shouldShowSidebar) {
    return (
      <LocationProvider>
        <MenuStateProvider>
          <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen flex flex-col w-full">
                {/* Show navbar only on homepage when user is logged in */}
                {isHomepage && <MainNavbar />}
                {/* Layout principale con sidebar */}
                <div className="flex flex-1 w-full">
            <AppSidebar />
                  <SidebarInset className="flex-1 flex flex-col">
                    <main className={`flex-1 relative pb-20 md:pb-0 ${isHomepage ? 'pt-0' : ''}`}>
                      {children}
                    </main>
                    <Footer />
                  </SidebarInset>
                </div>
                <MobileTouchNav />
              </div>
          </SidebarProvider>
        </MenuStateProvider>
      </LocationProvider>
    );
  }

  return (
    <LocationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Show navbar always for guests */}
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

export default Layout;
