
import React from 'react';
import MobileDashboardContainer from '@/components/dashboard/mobile/MobileDashboardContainer';

/**
 * Main Dashboard Page - Refactored for Mobile-First Architecture
 * 
 * Architettura dei Componenti:
 * 
 * Dashboard (Page)
 * └── MobileDashboardContainer (Smart Container)
 *     ├── MobileDashboardView (Mobile Presentation)
 *     │   ├── MobileHeader (Mobile Header)
 *     │   ├── MobileMapSection (Mobile Map)
 *     │   ├── MobileWidgetsSection (Mobile Widgets)
 *     │   └── MobileContentSection (Mobile Content)
 *     └── DesktopDashboardView (Desktop Presentation)
 *         ├── DesktopHeader (Desktop Header)
 *         ├── DesktopMainSection (Desktop Main)
 *         ├── DesktopContentSection (Desktop Content)
 *         └── DesktopDebugSection (Desktop Debug)
 * 
 * Principi Applicati:
 * ✅ Gerarchia componenti chiara (albero genealogico)
 * ✅ Container (Smart) vs Presentational (Dumb) separation
 * ✅ Context usage per ridurre prop drilling
 * ✅ Single responsibility per ogni componente
 * ✅ Mobile-first responsive design
 * ✅ Performance optimizations (memo, lazy loading)
 * ✅ Clear component interfaces e TypeScript types
 * ✅ Error boundaries strategicamente posizionati
 */

const Dashboard: React.FC = () => {
  return <MobileDashboardContainer />;
};

export default Dashboard;
