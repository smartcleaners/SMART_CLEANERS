import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Category, Product, firebaseService } from '@/lib/firebase';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid3X3 } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await firebaseService.getCategories();
        setCategories(categoriesData);
        
        // If there's a category ID in URL, load that category and its products
        if (selectedCategoryId) {
          const category = categoriesData.find(c => c.id === selectedCategoryId);
          if (category) {
            setSelectedCategory(category);
            loadProductsForCategory(selectedCategoryId);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [selectedCategoryId]);

  const loadProductsForCategory = async (categoryId: string) => {
    setProductsLoading(true);
    try {
      const productsData = await firebaseService.getProductsByCategory(categoryId);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setSearchParams({ category: categoryId });
      loadProductsForCategory(categoryId);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setProducts([]);
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-4">
        {selectedCategory ? (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToCategories}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-section">{selectedCategory.name}</h1>
              <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Grid3X3 className="h-8 w-8 text-primary mx-auto" />
            <h1 className="text-section">Product Categories</h1>
            <p className="text-muted-foreground">
              Choose a category to explore our professional cleaning solutions
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {selectedCategory ? (
        /* Products Grid */
        <div className="space-y-4">
          {productsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {products.length} products found
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className="animate-scale-in"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="text-muted-foreground">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products found in this category</p>
                <p className="text-sm">Check back soon for new arrivals!</p>
              </div>
              <Button 
                variant="outline"
                onClick={handleBackToCategories}
              >
                Browse Other Categories
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={handleCategoryClick}
              className="animate-scale-in"
            />
          ))}
        </div>
      )}

      {!selectedCategory && categories.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="text-muted-foreground">
            <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No categories available</p>
            <p className="text-sm">We're updating our product catalog.</p>
          </div>
        </div>
      )}
    </div>
  );
};