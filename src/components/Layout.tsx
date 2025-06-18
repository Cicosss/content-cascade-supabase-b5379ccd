
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { user } = useAuth();
  
  // Mostra la sidebar solo se l'utente è autenticato E showSidebar è true
  const shouldShowSidebar = showSidebar && user;
  
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
            <main className="flex-1 p-4 pl-6 z-[1]">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
