
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  UtensilsCrossed, 
  Landmark, 
  CalendarHeart, 
  Users, 
  MountainSnow 
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useHeader } from '@/contexts/HeaderContext';

const menuItems = [
  {
    title: "Scopri",
    url: "#",
    items: [
      {
        title: "Gusto & Sapori",
        description: "Ristoranti, cantine e prodotti tipici.",
        icon: <UtensilsCrossed className="size-5 shrink-0" />,
        url: "/dashboard?categories=Ristoranti,Agriturismi,Aziende Agricole,Street Food,Mercati Locali"
      },
      {
        title: "Cultura & Territorio",
        description: "Musei, borghi e tesori storici.",
        icon: <Landmark className="size-5 shrink-0" />,
        url: "/dashboard?categories=Musei,Artigianato Locale,Storia e Borghi"
      },
      {
        title: "Eventi & Spettacoli",
        description: "Feste, concerti e mostre da non perdere.",
        icon: <CalendarHeart className="size-5 shrink-0" />,
        url: "/dashboard?categories=Eventi"
      },
      {
        title: "Divertimento & Famiglia",
        description: "Parchi, attività e relax per tutti.",
        icon: <Users className="size-5 shrink-0" />,
        url: "/dashboard?categories=Parchi a Tema e Acquatici,Attività per Bambini,Fattorie Didattiche e Animali,Esperienze Educative,Vita Notturna"
      },
      {
        title: "Natura & Avventura",
        description: "Spiagge, parchi e sport all'aria aperta.",
        icon: <MountainSnow className="size-5 shrink-0" />,
        url: "/dashboard?categories=Spiagge,Parchi Naturali e Riserve,Sport"
      }
    ]
  },
  { title: "Il Mio Passaporto", url: "/my-passport" },
  { title: "Respiro del Mare", url: "/respiro-del-mare" },
  { title: "Oggi in Romagna", url: "/oggi" }
];

export const Navigation: React.FC = () => {
  const { handleNavigation } = useHeader();

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
                <NavigationMenuContent className="z-[5001] navigation-menu-content">
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-[5001]">
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
