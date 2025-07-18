
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  UtensilsCrossed, 
  Landmark, 
  CalendarHeart, 
  Users, 
  MountainSnow 
} from 'lucide-react';
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
        url: "/dashboard?categories=Ristoranti,Agriturismi,Cantine e Vigne,Street Food,Mercati Locali"
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

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setMobileMenuOpen, handleNavigation } = useHeader();

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-slate-200 hover:text-white transition-colors duration-200"
          aria-label="Apri menu di navigazione"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-slate-900 border-slate-700 w-80 z-[5001]">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-700">
          <img 
            src="/lovable-uploads/673fa174-b69d-4246-a652-97158e041630.png" 
            alt="Logo Mia Romagna" 
            className="h-12 w-auto object-contain"
          />
          <span className="font-bold text-white text-lg">Mia Romagna</span>
        </div>
        
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items ? (
                  <AccordionItem value={`item-${index}`} className="border-b border-slate-700">
                    <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white py-3 hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="flex flex-col space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.url)}
                            className="flex items-start space-x-3 rounded-md p-3 text-sm hover:bg-slate-800 text-slate-200 hover:text-white text-left transition-colors duration-200 group"
                          >
                            <div className="text-slate-400 group-hover:text-slate-300 mt-0.5 flex-shrink-0">
                              {subItem.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">{subItem.title}</div>
                              {subItem.description && (
                                <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1 leading-relaxed">
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
                  <div className="border-b border-slate-700 py-3">
                    <button
                      onClick={() => handleNavigation(item.url)}
                      className="text-sm font-medium text-slate-200 hover:text-white text-left w-full transition-colors duration-200 hover:bg-slate-800/50 p-2 rounded-md"
                    >
                      {item.title}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};
