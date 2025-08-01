import React from 'react';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';

/**
 * Presentational Component - Vista della sezione contenuti
 * Responsabilità: Layout dei contenuti personalizzati
 */
export const DashboardContentView: React.FC = () => {
  return (
    <div className="bg-slate-50">
      <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <APIErrorBoundary>
          <PersonalizedContent />
        </APIErrorBoundary>
      </div>
    </div>
  );
};