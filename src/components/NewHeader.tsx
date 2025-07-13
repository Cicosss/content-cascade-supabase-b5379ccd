import React from 'react';
import { 
  UtensilsCrossed, 
  Landmark, 
  CalendarHeart, 
  Users, 
  MountainSnow 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import MainNavbar from './layout/MainNavbar';
import LanguageSelector from './header/LanguageSelector';
import ProfileMenu from './ProfileMenu';

const NewHeader = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();

  const miaRomagnaNavData = {
    logo: {
      url: "/",
      alt: "Logo Mia Romagna",
      title: "Mia Romagna"
    },
    menu: [
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
    ]
  };

  return (
    <MainNavbar 
      logo={miaRomagnaNavData.logo}
      menu={miaRomagnaNavData.menu}
    >
      <div className="flex items-center gap-4">
        <LanguageSelector />
        
        {user ? (
          <ProfileMenu />
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="/auth">Accedi</a>
            </Button>
            <Button asChild size="sm">
              <a href="/auth">Registrati</a>
            </Button>
          </div>
        )}
      </div>
    </MainNavbar>
  );
};

export default NewHeader;