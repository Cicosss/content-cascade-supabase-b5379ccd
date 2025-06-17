
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
      <div className="min-h-screen bg-slate-50">
        {/* Header con z-index 999 */}
        <div className="relative" style={{ zIndex: 999 }}>
          <Header />
        </div>
        
        {/* Contenuto principale con sidebar */}
        <SidebarProvider defaultOpen={false}>
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar con position fixed e z-index 1000 */}
            <div style={{ zIndex: 1000 }}>
              <AppSidebar />
            </div>
            <SidebarInset className="flex-1" style={{ paddingLeft: '100px', zIndex: 1 }}>
              <main className="flex-1 p-0 overflow-auto">
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
