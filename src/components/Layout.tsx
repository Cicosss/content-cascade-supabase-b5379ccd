
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import AppSidebar from './AppSidebar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const shouldShowSidebar = !loading && user && !isMobile;
  
  // Listen for mobile menu changes to hide MobileTouchNav
  React.useEffect(() => {
    const handleMobileMenuChange = (event: CustomEvent) => {
      setIsMobileMenuOpen(event.detail.open);
    };
    
    window.addEventListener('mobileMenuChange', handleMobileMenuChange as EventListener);
    return () => {
      window.removeEventListener('mobileMenuChange', handleMobileMenuChange as EventListener);
    };
  }, []);
  
  if (shouldShowSidebar) {
    return (
      <LocationProvider>
        <MenuStateProvider>
          <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen flex flex-col w-full max-w-[100vw]">
                {/* Layout principale con sidebar */}
                <div className="flex flex-1 w-full max-w-[100vw]">
            <AppSidebar />
                  <SidebarInset className="flex-1 flex flex-col w-full max-w-[100vw] md:max-w-none">
                    <main className="flex-1 relative pb-20 md:pb-0 overflow-x-hidden w-full">
                      {children}
                    </main>
                    <Footer />
                  </SidebarInset>
                </div>
                <MobileTouchNav isVisible={!isMobileMenuOpen} />
              </div>
          </SidebarProvider>
        </MenuStateProvider>
      </LocationProvider>
    );
  }

  return (
    <LocationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Main content */}
        <main className="flex-1 relative pb-20 md:pb-0 overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <MobileTouchNav isVisible={!isMobileMenuOpen} />
      </div>
    </LocationProvider>
  );
};

export default Layout;
