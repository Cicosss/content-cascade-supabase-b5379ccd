
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
  
  // Layout con sidebar
  if (showSidebar) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header sempre fisso in cima */}
        <Header />
        
        {/* Contenuto principale con sidebar */}
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <main className="flex-1 p-0">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        
        <Footer />
      </div>
    );
  }

  // Layout senza sidebar (standard)
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
