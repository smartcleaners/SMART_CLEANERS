import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, Package, Warehouse ,InfoIcon} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Categories', href: '/categories', icon: Grid3X3 },
  {name : "About Us", href: '/about', icon: InfoIcon},
  { name: 'Combos', href: '/combos', icon: Package },
  { name: 'Bulk Orders', href: '/bulk-orders', icon: Warehouse },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="nav-bottom">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={cn('nav-item', isActive && 'active')}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};