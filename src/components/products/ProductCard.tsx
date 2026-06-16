import React from 'react';
import { Product } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Package, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  onClick
}) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  // Stock status logic
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const stockCount = product.stock;

  return (
    <div
      className={`card-product p-4 space-y-3 cursor-pointer hover:shadow-lg transition-shadow relative ${isOutOfStock ? 'opacity-75' : ''
        } ${className}`}
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

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Only {stockCount} left
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

        {/* Price and Stock Status */}
        <div className="space-y-2">
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
    </div>
  );
};