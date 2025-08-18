
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import AppSidebar from './AppSidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  const shouldShowSidebar = !loading && user;
  
  if (shouldShowSidebar) {
    return (
      <LocationProvider>
        <MenuStateProvider>
          <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen flex flex-col w-full">
                {/* Layout principale con sidebar */}
                <div className="flex flex-1 w-full">
            <AppSidebar />
                  <SidebarInset className="flex-1 flex flex-col w-full">
                    <main className="flex-1 relative pb-20 md:pb-0">
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
        {/* Main content */}
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
