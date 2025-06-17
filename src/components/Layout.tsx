
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
  
  // Mostra la sidebar se showSidebar è true, indipendentemente dal login
  if (showSidebar) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full flex-col">
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </SidebarInset>
          </div>
          <Footer />
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
