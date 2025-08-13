/**
 * DEBUG COMPONENT: SidebarDebugger
 * 
 * Responsabilità:
 * - Visualizzazione info debug in development
 * - Monitoraggio stato sidebar in tempo reale
 * - Toggle visibilità debug info
 */

import React, { useState } from 'react';
import { useSidebarDebug } from '../hooks/useSidebarDebug';

interface SidebarDebuggerProps {
  enabled?: boolean;
}

const SidebarDebugger: React.FC<SidebarDebuggerProps> = ({ enabled = false }) => {
  const { debugInfo } = useSidebarDebug('SidebarDebugger');
  const [isVisible, setIsVisible] = useState(false);

  // Solo in development e se enabled
  if (process.env.NODE_ENV !== 'development' || !enabled) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-2 py-1 bg-gray-800 text-white text-xs rounded mb-2 hover:bg-gray-700"
      >
        {isVisible ? 'Hide' : 'Show'} Debug
      </button>
      
      {isVisible && (
        <div className="bg-black/80 text-white p-3 rounded-lg text-xs max-w-sm backdrop-blur">
          <h3 className="font-bold mb-2">🧩 Sidebar Debug</h3>
          <div className="space-y-1">
            <div><strong>Component:</strong> {debugInfo.component}</div>
            <div><strong>Renders:</strong> {debugInfo.renderCount}</div>
            <div><strong>State:</strong> {debugInfo.state}</div>
            <div><strong>Open:</strong> {debugInfo.open ? 'Yes' : 'No'}</div>
            <div><strong>Mobile Open:</strong> {debugInfo.openMobile ? 'Yes' : 'No'}</div>
            <div><strong>Collapsed:</strong> {debugInfo.isCollapsed ? 'Yes' : 'No'}</div>
            <div><strong>Time:</strong> {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SidebarDebugger };