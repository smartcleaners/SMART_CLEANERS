import React from 'react';
import { Category } from '@/lib/firebase';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, className = '' }) => {
  return (
    <div 
      onClick={() => onClick(category.id)}
      className={`card-elevated p-3 cursor-pointer space-y-3 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Category Image with fixed aspect ratio */}
      <div className="aspect-square overflow-hidden bg-muted rounded-lg">
        <img 
          src={category.imageUrl} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>

      {/* Category Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-center line-clamp-1">{category.name}</h3>
        <p className="text-xs text-muted-foreground text-center line-clamp-2">
          {category.description}
        </p>
      </div>
    </div>
  );
};