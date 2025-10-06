import React from 'react';
import { Product } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// yoo

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '',
  onClick 
}) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div 
      className={`card-product p-4 space-y-3 cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-card-title line-clamp-2 font-semibold">{product.name}</h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-price font-bold">
            ₹{product.salePrice || product.price}
          </span>
          {hasDiscount && (
            <span className="text-price-original">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};