import React from 'react';
import { Product } from '@/lib/firebase';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();
  
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className={`card-product p-4 space-y-3 ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
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
        
        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-background">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-card-title line-clamp-2">{product.name}</h3>
        
        {/* SKU */}
        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        
        {/* Weight/Dimensions */}
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>{product.weight}</span>
          <span>•</span>
          <span>{product.dimensions}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-price">
            ₹{product.salePrice || product.price}
          </span>
          {hasDiscount && (
            <span className="text-price-original">
              ₹{product.price}
            </span>
          )}
        </div>
        
        {/* Bulk Pricing Hint */}
        <p className="text-xs text-accent font-medium">
          Save 15% on 10+ units • Save 25% on 50+ units
        </p>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          className="btn-primary w-full"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};