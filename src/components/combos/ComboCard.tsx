import React from 'react';
import { Combo } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Package, ShoppingCart } from 'lucide-react';

interface ComboCardProps {
  combo: Combo;
  className?: string;
}

export const ComboCard: React.FC<ComboCardProps> = ({ combo, className = '' }) => {
  const isValidNow = () => {
    const now = new Date();
    const validFrom = combo.validFrom.toDate();
    const validUntil = combo.validUntil.toDate();
    return now >= validFrom && now <= validUntil;
  };

  const formatDate = (timestamp: any) => {
    return timestamp.toDate().toLocaleDateString();
  };

  const discountPercentage = Math.round((combo.savings / combo.originalPrice) * 100);

  return (
    <div className={`card-product p-4 space-y-3 ${className}`}>
      {/* Combo Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={combo.imageUrl} 
          alt={combo.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Featured Badge */}
        {combo.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-cta text-cta-foreground">
            Featured
          </Badge>
        )}
        
        {/* Savings Badge */}
        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
          Save ₹{combo.savings}
        </Badge>
      </div>

      {/* Combo Info */}
      <div className="space-y-3">
        <h3 className="text-card-title">{combo.name}</h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {combo.description}
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-price">₹{combo.comboPrice}</span>
            <span className="text-price-original">₹{combo.originalPrice}</span>
          </div>
          <p className="text-sm text-accent font-medium">
            You save ₹{combo.savings} ({discountPercentage}% off)
          </p>
        </div>

        {/* Validity */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Valid till {formatDate(combo.validUntil)}</span>
        </div>

        {/* Products in combo */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span>{combo.products.length} products included</span>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="btn-cta w-full"
          disabled={!isValidNow()}
        >
          {isValidNow() ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add Combo to Cart
            </>
          ) : (
            'Combo Expired'
          )}
        </Button>
      </div>
    </div>
  );
};