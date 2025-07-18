
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';

interface OggiCardProps {
  badge?: number;
}

const OggiCard = React.memo<OggiCardProps>(({ badge }) => {
  if (!badge) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 py-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <Link 
            to="/oggi" 
            className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
            aria-label={`Oggi in Romagna - ${badge} aggiornamenti disponibili`}
          >
            <div className="relative p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md bg-gradient-to-b from-blue-50 to-white group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:bg-blue-50 group-data-[collapsible=icon]:border-blue-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto">
              
              <div 
                className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 animate-pulse group-data-[collapsible=icon]:-top-0.5 group-data-[collapsible=icon]:-right-0.5 group-data-[collapsible=icon]:w-3.5 group-data-[collapsible=icon]:h-3.5 group-data-[collapsible=icon]:text-[9px]" 
                aria-label={`${badge} aggiornamenti`}
              >
                {badge}
              </div>
              
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                <Zap className="h-5 w-5 text-blue-800 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" strokeWidth={1.5} />
                <span className="font-bold text-blue-800 group-data-[collapsible=icon]:hidden">
                  Oggi in Romagna
                </span>
              </div>
            </div>
          </Link>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

OggiCard.displayName = 'OggiCard';

export { OggiCard };
