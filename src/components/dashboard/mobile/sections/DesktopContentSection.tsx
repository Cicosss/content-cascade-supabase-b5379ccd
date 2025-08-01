import React, { memo } from 'react';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';

/**
 * Presentational Component - Desktop Content Section
 * 
 * Responsabilità:
 * - Rendering contenuti personalizzati per desktop
 * - Layout expanded per schermi grandi
 * - Gestione spazio orizzontale maggiore
 */

const DesktopContentSection: React.FC = memo(() => {
  return (
    <div className="space-y-8">
      <APIErrorBoundary>
        <PersonalizedContent />
      </APIErrorBoundary>
    </div>
  );
});

DesktopContentSection.displayName = 'DesktopContentSection';

export default DesktopContentSection;