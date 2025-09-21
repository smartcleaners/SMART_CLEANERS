import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { itemCount } = useCart();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Smart Cleaners</h1>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-3">
          {/* Search icon */}
          <button className="p-2 hover:bg-muted transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          {/* Cart icon with badge */}
          <button className="relative p-2 hover:bg-muted transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};