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
      className={`card-elevated p-4 cursor-pointer space-y-3 ${className}`}
    >
      {/* Category Image */}
      <div className="aspect-square overflow-hidden bg-muted">
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
      <div className="space-y-2">
        <h3 className="text-card-title text-center">{category.name}</h3>
        <p className="text-sm text-muted-foreground text-center line-clamp-2">
          {category.description}
        </p>
      </div>
    </div>
  );
};