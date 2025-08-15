
import React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useNavigation } from '@/hooks/useNavigation';
import { createMenuItems, Z_INDEX } from '@/config/navigationConfig';

export const Navigation: React.FC = () => {
  const { handleNavigation } = useNavigation();
  const menuItems = createMenuItems();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-8">
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.items ? (
              <>
                <NavigationMenuTrigger className="typography-small h-9 px-4 py-2 text-slate-200 hover:text-orange-400 bg-transparent border-none transition-all duration-300 font-medium tracking-wide relative group">
                  {item.title}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="navigation-menu-content">
                  <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50 rounded-xl shadow-2xl backdrop-blur-sm">
                    {item.items.map((subItem, subIndex) => (
                      <NavigationMenuLink key={subIndex} asChild>
                        <button
                          onClick={() => handleNavigation(subItem.url)}
                          className={cn(
                            "block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-slate-700/50 text-slate-200 hover:text-white focus:bg-slate-700/50 focus:text-white text-left w-full group/item border border-transparent hover:border-slate-600/30"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-slate-400 group-hover/item:text-orange-400 transition-colors duration-300">
                              {subItem.icon}
                            </div>
                            <div className="typography-small font-semibold leading-none tracking-wide">
                              {subItem.title}
                            </div>
                          </div>
                          {subItem.description && (
                            <p className="typography-small line-clamp-2 leading-relaxed text-slate-400 group-hover/item:text-slate-300 transition-colors duration-300">
                              {subItem.description}
                            </p>
                          )}
                        </button>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <button
                  onClick={() => handleNavigation(item.url)}
                  className={cn(
                    "typography-small group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 font-medium transition-all duration-300 text-slate-200 hover:text-orange-400 focus:text-orange-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-800/30 relative"
                  )}
                >
                  {item.title}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </button>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
