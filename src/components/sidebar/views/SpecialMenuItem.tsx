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
            className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
            aria-label={`${title} - ${badge} aggiornamenti disponibili`}
          >
            <div className={`
              relative p-3 rounded-xl border border-border hover:border-primary/50 
              transition-all duration-200 hover:shadow-md bg-gradient-to-b from-muted/50 to-background
              ${isCollapsed ? 'p-2 rounded-lg bg-muted border-muted-foreground flex items-center justify-center' : ''}
              ${isActive ? 'border-primary bg-muted' : ''}
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
                  className={`text-primary transition-all duration-200 hover:animate-pulse flex-shrink-0 ${
                    isCollapsed ? 'h-4 w-4' : 'h-5 w-5'
                  }`} 
                  strokeWidth={1.5} 
                />
                {!isCollapsed && (
                  <span className="font-bold text-primary truncate">
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