
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
import EnvironmentDebugPanel from './EnvironmentDebugPanel';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { user, loading } = useAuth();
  
  // Forza showSidebar solo se l'utente è autenticato
  const shouldShowSidebar = showSidebar && !loading && user;
  
  if (shouldShowSidebar) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <div className="sticky top-0 z-[999]">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] border-b border-slate-700">
                <div className="flex-1">
                  <Header />
                </div>
              </div>
            </div>
            <main className="flex-1 p-4 pl-6 z-[1] relative">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </div>
        <EnvironmentDebugPanel />
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="sticky top-0 z-[999]">
        <Header />
      </div>
      <main className="flex-1 relative z-[1]">
        {children}
      </main>
      <Footer />
      <EnvironmentDebugPanel />
    </div>
  );
};

export default Layout;
