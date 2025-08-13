
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
                <NavigationMenuTrigger className="h-9 px-4 py-2 text-slate-200 hover:text-white bg-transparent border-none transition-colors duration-200">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className={`z-[${Z_INDEX.DROPDOWN}] navigation-menu-content`}>
                  <div className={`grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-[${Z_INDEX.DROPDOWN}]`}>
                    {item.items.map((subItem, subIndex) => (
                      <NavigationMenuLink key={subIndex} asChild>
                        <button
                          onClick={() => handleNavigation(subItem.url)}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800 text-slate-200 hover:text-white focus:bg-slate-800 focus:text-white text-left w-full group"
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
                              {subItem.icon}
                            </div>
                            <div className="text-sm font-medium leading-none">
                              {subItem.title}
                            </div>
                          </div>
                          {subItem.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors">
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
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors text-slate-200 hover:text-white focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-800/50"
                  )}
                >
                  {item.title}
                </button>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
