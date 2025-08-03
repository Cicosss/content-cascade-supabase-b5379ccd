/**
 * PRESENTATIONAL COMPONENT: SpecialMenuItem
 * 
 * Responsabilità:
 * - Renderizzazione item speciale "Oggi in Romagna"
 * - Styling distintivo con gradienti
 * - Badge prominente
 * - Responsive design collassato/espanso
 * 
 * Props:
 * - badge: Numero notifiche
 * - title: Titolo dell'item
 * - url: URL di destinazione
 * - isActive: Stato attivo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '../shared/Badge';

interface SpecialMenuItemProps {
  badge: number;
  title: string;
  url: string;
  isActive: boolean;
}

const SpecialMenuItem = React.memo<SpecialMenuItemProps>(({ 
  badge, 
  title, 
  url, 
  isActive 
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 py-2">
          <Link 
            to={url}
            className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
            aria-label={`${title} - ${badge} aggiornamenti disponibili`}
          >
            <div className={`
              relative p-3 rounded-xl border border-gray-200 hover:border-blue-300 
              transition-all duration-200 hover:shadow-md bg-gradient-to-b from-blue-50 to-white
              ${isCollapsed ? 'p-2 rounded-lg bg-blue-50 border-blue-200 flex items-center justify-center' : ''}
              ${isActive ? 'border-blue-500 bg-blue-100' : ''}
            `}>
              
              {/* Badge */}
              {badge && (
                <Badge 
                  count={badge}
                  size={isCollapsed ? "small" : "medium"}
                  label={`${badge} aggiornamenti`}
                />
              )}
              
              {/* Content */}
              <div className={`flex items-center ${isCollapsed ? 'gap-0 justify-center' : 'gap-3'}`}>
                <Zap 
                  className={`text-blue-800 transition-all duration-200 hover:animate-pulse flex-shrink-0 ${
                    isCollapsed ? 'h-4 w-4' : 'h-5 w-5'
                  }`} 
                  strokeWidth={1.5} 
                />
                {!isCollapsed && (
                  <span className="font-bold text-blue-800 truncate">
                    {title}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

SpecialMenuItem.displayName = 'SpecialMenuItem';

export { SpecialMenuItem };