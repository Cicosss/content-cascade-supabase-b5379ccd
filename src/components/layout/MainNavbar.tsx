import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

interface Logo {
  url: string;
  src?: string;
  alt: string;
  title: string;
}

interface MainNavbarProps {
  logo: Logo;
  menu: NavItem[];
  children?: React.ReactNode;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ logo, menu, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Controlla se siamo dentro un SidebarProvider
  let sidebarState = null;
  try {
    sidebarState = useSidebar();
  } catch {
    // Non siamo dentro un SidebarProvider
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(logo.url);
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#020817]">
      <div className={cn(
        "flex h-20 items-center px-8 lg:px-12 max-w-screen-2xl mx-auto transition-all duration-200",
        sidebarState && "lg:pl-20" // Aggiungi padding-left quando la sidebar è presente
      )}>
        {/* Logo */}
        <div className="mr-8 flex">
          <Link 
            to={logo.url} 
            className="flex items-center"
            onClick={handleLogoClick}
          >
            {logo.src ? (
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="h-18 w-auto object-contain"
              />
            ) : (
              <div className="h-18 w-18 rounded bg-white flex items-center justify-center">
                <span className="text-[#020817] font-bold text-xl">M</span>
              </div>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between gap-8 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-8">
                {menu.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="h-9 px-4 py-2 text-[#E2E8F0] hover:text-white bg-transparent border-none">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#020817] border border-[#1E293B]">
                            {item.items.map((subItem, subIndex) => (
                              <NavigationMenuLink
                                key={subIndex}
                                asChild
                              >
                                <button
                                  onClick={() => handleNavigation(subItem.url)}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1E293B] text-[#E2E8F0] hover:text-white focus:bg-[#1E293B] focus:text-white text-left w-full"
                                  )}
                                >
                                  <div className="flex items-center space-x-2">
                                    {subItem.icon}
                                    <div className="text-sm font-medium leading-none">
                                      {subItem.title}
                                    </div>
                                  </div>
                                   {subItem.description && (
                                     <p className="line-clamp-2 text-sm leading-snug text-[#94A3B8]">
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
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors text-[#E2E8F0] hover:text-white focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
          </div>

          {/* Right side content (auth buttons, language selector, etc.) */}
          <div className="flex items-center space-x-2">
            {children}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-[#E2E8F0] hover:text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-[#020817] border-[#1E293B]">
              <div className="flex items-center space-x-2 pb-4">
                {logo.src ? (
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-white flex items-center justify-center">
                    <span className="text-[#020817] font-bold text-lg">M</span>
                  </div>
                )}
                <span className="font-bold text-white">{logo.title}</span>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {menu.map((item, index) => (
                  <div key={index}>
                    {item.items ? (
                      <AccordionItem value={`item-${index}`} className="border-b border-[#1E293B]">
                        <AccordionTrigger className="text-sm font-medium text-[#E2E8F0] hover:text-white">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-2">
                            {item.items.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => handleNavigation(subItem.url)}
                                className="flex items-start space-x-2 rounded-md p-2 text-sm hover:bg-[#1E293B] text-[#E2E8F0] hover:text-white text-left"
                              >
                                {subItem.icon}
                                <div>
                                  <div className="font-medium">{subItem.title}</div>
                                  {subItem.description && (
                                    <div className="text-xs text-[#94A3B8]">
                                      {subItem.description}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <div className="border-b border-[#1E293B] py-3">
                        <button
                          onClick={() => handleNavigation(item.url)}
                          className="text-sm font-medium text-[#E2E8F0] hover:text-white text-left w-full"
                        >
                          {item.title}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;