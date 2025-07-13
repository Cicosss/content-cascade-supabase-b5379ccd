import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(logo.url);
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link 
            to={logo.url} 
            className="mr-6 flex items-center space-x-2"
            onClick={handleLogoClick}
          >
            {logo.src && (
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="h-8 w-8"
              />
            )}
            <span className="hidden font-bold sm:inline-block text-foreground">
              {logo.title}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {menu.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="h-9 px-4 py-2">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items.map((subItem, subIndex) => (
                              <NavigationMenuLink
                                key={subIndex}
                                asChild
                              >
                                <button
                                  onClick={() => handleNavigation(subItem.url)}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                                  )}
                                >
                                  <div className="flex items-center space-x-2">
                                    {subItem.icon}
                                    <div className="text-sm font-medium leading-none">
                                      {subItem.title}
                                    </div>
                                  </div>
                                  {subItem.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center space-x-2 pb-4">
                {logo.src && (
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-6 w-6"
                  />
                )}
                <span className="font-bold">{logo.title}</span>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {menu.map((item, index) => (
                  <div key={index}>
                    {item.items ? (
                      <AccordionItem value={`item-${index}`} className="border-b">
                        <AccordionTrigger className="text-sm font-medium">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-2">
                            {item.items.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => handleNavigation(subItem.url)}
                                className="flex items-start space-x-2 rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                              >
                                {subItem.icon}
                                <div>
                                  <div className="font-medium">{subItem.title}</div>
                                  {subItem.description && (
                                    <div className="text-xs text-muted-foreground">
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
                      <div className="border-b py-3">
                        <button
                          onClick={() => handleNavigation(item.url)}
                          className="text-sm font-medium hover:text-foreground/80 text-left w-full"
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