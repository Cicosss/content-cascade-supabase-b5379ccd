
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarStateProvider } from '@/contexts/SidebarContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { Header } from '@/components/header/Header';
import { MobileTouchNav } from './navigation/MobileTouchNav';
import AppSidebar from './AppSidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  const shouldShowSidebar = !loading && user;
  
  if (shouldShowSidebar) {
    return (
      <LocationProvider>
        <SidebarProvider defaultOpen={false}>
          <SidebarStateProvider>
            <HeaderProvider>
              <div className="min-h-screen flex flex-col w-full">
                {/* Header fisso con z-index garantito */}
                <Header />
                
                {/* Layout principale con sidebar - con padding per header responsive */}
                <div className="flex flex-1 w-full pt-16 md:pt-20 lg:pt-24">
                  <AppSidebar />
                  <SidebarInset className="flex-1 flex flex-col">
                    <main className="flex-1 py-3 md:py-4 lg:py-6 relative pb-20 md:pb-0">
                      {children}
                    </main>
                    <Footer />
                  </SidebarInset>
                </div>
                <MobileTouchNav />
              </div>
            </HeaderProvider>
          </SidebarStateProvider>
        </SidebarProvider>
      </LocationProvider>
    );
  }

  return (
    <LocationProvider>
      <HeaderProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Header fisso con z-index garantito */}
          <Header />
          
          {/* Main content con padding per header fisso responsive */}
          <main className="flex-1 pt-16 md:pt-20 lg:pt-24 relative pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileTouchNav />
        </div>
      </HeaderProvider>
    </LocationProvider>
  );
};

export default Layout;
