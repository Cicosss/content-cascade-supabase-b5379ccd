
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
import { createMenuItems } from '@/config/navigationConfig';

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
                <NavigationMenuTrigger className="typography-small h-9 px-4 py-2 text-muted-foreground hover:text-primary bg-transparent border-none transition-all duration-300 font-medium tracking-wide relative group">
                  {item.title}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="navigation-menu-content">
                  <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-gradient-to-br from-background via-card to-background border border-border rounded-xl shadow-2xl backdrop-blur-sm">
                    {item.items.map((subItem, subIndex) => (
                      <NavigationMenuLink key={subIndex} asChild>
                        <button
                          onClick={() => handleNavigation(subItem.url)}
                           className={cn(
                             "block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-muted/50 text-foreground hover:text-foreground focus:bg-muted/50 focus:text-foreground text-left w-full group/item border border-transparent hover:border-border"
                           )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-muted-foreground group-hover/item:text-primary transition-colors duration-300">
                              {subItem.icon}
                            </div>
                            <div className="typography-small font-semibold leading-none tracking-wide">
                              {subItem.title}
                            </div>
                          </div>
                          {subItem.description && (
                            <p className="typography-small line-clamp-2 leading-relaxed text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
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
                     "typography-small group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 font-medium transition-all duration-300 text-muted-foreground hover:text-primary focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/30 relative"
                   )}
                >
                  {item.title}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </button>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
