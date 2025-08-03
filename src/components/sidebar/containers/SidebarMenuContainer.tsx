/**
 * SMART CONTAINER: SidebarMenuContainer
 * 
 * Responsabilità:
 * - Gestione stato menu e navigazione
 * - Calcolo dello stato attivo
 * - Coordinamento tra sezioni normali e speciali
 * - Performance optimization con useMemo
 * 
 * Props: Nessuna (self-contained)
 * Children: MenuSection componenti presentazionali
 */

import React, { useMemo } from 'react';
import { useMenuState } from '@/contexts/MenuStateContext';
import { MenuSection } from '../views/MenuSection';
import { SpecialMenuItem } from '../views/SpecialMenuItem';

interface SidebarMenuContainerProps {
  // Questo container non accetta props - è completamente self-contained
}

const SidebarMenuContainer = React.memo<SidebarMenuContainerProps>(() => {
  const { menuSections, isActive, specialItems } = useMenuState();

  // Performance optimization: pre-calcola sezioni filtrate
  const { normalSections, specialSection } = useMemo(() => {
    const special = menuSections.find(section => section.id === 'special');
    const normal = menuSections.filter(section => section.id !== 'special');
    
    return {
      normalSections: normal,
      specialSection: special
    };
  }, [menuSections]);

  return (
    <>
      {/* Special Menu Item - Renderizzato per primo se ha badge */}
      {specialSection && specialItems.oggi?.badge && (
        <SpecialMenuItem
          badge={specialItems.oggi.badge}
          title="Oggi in Romagna"
          url="/oggi"
          isActive={isActive('/oggi')}
        />
      )}

      {/* Standard Menu Sections */}
      {normalSections.map((section) => (
        <MenuSection
          key={section.id}
          section={section}
          isActive={isActive}
          showAtBottom={section.id === 'bottom'}
        />
      ))}
    </>
  );
});

SidebarMenuContainer.displayName = 'SidebarMenuContainer';

export { SidebarMenuContainer };