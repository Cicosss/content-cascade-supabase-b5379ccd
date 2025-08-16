import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Calendar, Settings } from 'lucide-react';
import { Z_INDEX } from '@/config/zIndex';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navigationItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'dashboard', label: 'Mappa', icon: MapPin, path: '/dashboard' },
  { id: 'oggi', label: 'Oggi', icon: Calendar, path: '/oggi' },
  { id: 'settings', label: 'Menu', icon: Settings, path: '/profile' }
];

interface MobileTouchNavProps {
  className?: string;
  onMenuOpen?: () => void;
  isVisible?: boolean;
}

const MobileTouchNav: React.FC<MobileTouchNavProps> = ({ 
  className, 
  onMenuOpen, 
  isVisible = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState('home');
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  // Update selected item based on current path
  useEffect(() => {
    const currentItem = navigationItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
    if (currentItem) {
      setSelectedItem(currentItem.id);
    }
  }, [location.pathname]);

  const handleItemPress = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId);
    if (item) {
      setPressedItem(itemId);
      setSelectedItem(itemId);
      navigate(item.path);
      
      setTimeout(() => {
        setPressedItem(null);
      }, 200);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[53] flex justify-center pb-4 px-2 md:hidden">
      <div 
        className="relative bg-[#020817] rounded-3xl px-4 py-3 shadow-2xl overflow-hidden"
        style={{
          width: '95%',
          maxWidth: '400px',
          boxShadow: '0 0 20px rgba(110, 231, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Animated Active Indicator */}
        <motion.div
          className="absolute top-2 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full -translate-x-1/2"
          style={{
            width: 56
          }}
          animate={{
            left: `${((navigationItems.findIndex(item => item.id === selectedItem) + 0.5) * 100) / navigationItems.length}%`
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 28
          }}
        />

        {/* Navigation Items */}
        <div className="flex justify-between items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedItem === item.id;
            const isPressed = pressedItem === item.id;

            return (
              <motion.button
                key={item.id}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
                onClick={() => handleItemPress(item.id)}
                animate={{
                  scale: isPressed ? 0.9 : isActive ? 1.05 : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="mb-1"
                  animate={{
                    y: isActive ? -2 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-yellow-400' 
                        : 'text-slate-300'
                    }`}
                  />
                </motion.div>
                
                <motion.span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-yellow-400' 
                      : 'text-slate-300'
                  }`}
                  animate={{
                    scale: isActive ? 1.05 : 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Glow Effect */}
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded-full blur-sm"
        />
      </div>
    </div>
  );
};

export { MobileTouchNav };