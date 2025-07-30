import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, Home, Search, Heart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
  { icon: <Search className="h-5 w-5" />, label: 'Scopri', path: '/dashboard' },
  { icon: <Heart className="h-5 w-5" />, label: 'Preferiti', path: '/favorites' },
  { icon: <User className="h-5 w-5" />, label: 'Profilo', path: '/profile' },
];

interface MobileTouchNavProps {
  className?: string;
  onMenuOpen?: () => void;
}

export const MobileTouchNav: React.FC<MobileTouchNavProps> = ({ 
  className,
  onMenuOpen 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on current path
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => 
      location.pathname === item.path || 
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  // Add swipe gestures for navigation
  const { swipeHandlers } = useSwipeGestures({
    onSwipeLeft: () => {
      if (activeIndex < navItems.length - 1) {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        navigate(navItems[nextIndex].path);
      }
    },
    onSwipeRight: () => {
      if (activeIndex > 0) {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex);
        navigate(navItems[prevIndex].path);
      }
    },
    threshold: 50
  });

  const handleNavClick = (index: number, path: string) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <div 
      ref={navRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[5000]",
        "bg-slate-900/95 backdrop-blur-lg border-t border-slate-700",
        "safe-area-inset-bottom md:hidden",
        className
      )}
      {...swipeHandlers}
    >
      {/* Swipe indicator */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-slate-600 rounded-full" />
      
      <div className="flex items-center justify-around px-2 py-3">
        {/* Menu button */}
        <Button
          variant="ghost"
          size="touch"
          onClick={onMenuOpen}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white active:text-white min-w-[60px] h-auto py-2"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-medium">Menu</span>
        </Button>

        {/* Navigation items */}
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="touch"
              onClick={() => handleNavClick(index, item.path)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[60px] h-auto py-2 relative",
                "transition-all duration-200 ease-out",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-slate-400 hover:text-white active:text-white"
              )}
              aria-label={item.label}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTouchNav;