/**
 * DEBUG HOOK: useSidebarDebug
 * 
 * Responsabilità:
 * - Centralizzare informazioni di debug per la sidebar
 * - Monitorare stato e props in tempo reale
 * - Facilitare troubleshooting
 */

import { useSidebar } from '@/components/ui/sidebar';
import { useCallback, useEffect, useRef } from 'react';

export const useSidebarDebug = (componentName: string) => {
  const { state, open, openMobile } = useSidebar();
  const renderCount = useRef(0);
  
  // Incrementa contatore render
  renderCount.current += 1;
  
  const debugInfo = {
    component: componentName,
    renderCount: renderCount.current,
    state,
    open,
    openMobile,
    isCollapsed: state === 'collapsed',
    timestamp: new Date().toISOString()
  };

  // Log debug info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧩 [${componentName}] Debug:`, debugInfo);
    }
  }, [componentName, JSON.stringify(debugInfo)]);

  const logAction = useCallback((action: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 [${componentName}] Action: ${action}`, data || '');
    }
  }, [componentName]);

  const logError = useCallback((error: string, data?: any) => {
    console.error(`❌ [${componentName}] Error: ${error}`, data || '');
  }, [componentName]);

  return {
    debugInfo,
    logAction,
    logError,
    isCollapsed: state === 'collapsed'
  };
};