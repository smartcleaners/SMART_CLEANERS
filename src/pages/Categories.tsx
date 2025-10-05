import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category, Product, firebaseService } from '@/lib/firebase';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid3X3, Package } from 'lucide-react';


export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryId = searchParams.get('category');
    const navigate = useNavigate();


  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, allProductsData] = await Promise.all([
          firebaseService.getCategories(),
          firebaseService.getProducts()
        ]);
        
        setCategories(categoriesData);
        setAllProducts(allProductsData);
        
        // If there's a category ID in URL, load that category and its products
        if (selectedCategoryId) {
          const category = categoriesData.find(c => c.id === selectedCategoryId);
          if (category) {
            setSelectedCategory(category);
            loadProductsForCategory(selectedCategoryId);
          }
        } else {
          // By default, show all products
          setProducts(allProductsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const handleShowAllProducts = () => {
    setSelectedCategory(null);
    setProducts(allProducts);
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
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShowAllProducts}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {selectedCategory ? (
                <Package className="h-6 w-6 text-primary" />
              ) : (
                <Grid3X3 className="h-6 w-6 text-primary" />
              )}
              <h1 className="text-2xl font-bold">
                {selectedCategory ? selectedCategory.name : 'All Products'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? selectedCategory.description 
                : 'Browse all our professional cleaning solutions'
              }
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={handleShowAllProducts}
            className="text-sm"
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory?.id === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="text-sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
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
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className="animate-scale-in"
                onClick={() => navigate(`/products/${product.id}`)}

                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {selectedCategory ? 'No products found in this category' : 'No products available'}
              </p>
              <p className="text-sm">
                {selectedCategory ? 'Check back soon for new arrivals!' : 'We\'re updating our product catalog.'}
              </p>
            </div>
            {selectedCategory && (
              <Button 
                variant="outline"
                onClick={handleShowAllProducts}
              >
                View All Products
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Categories Overview Section (only show when viewing all products and no products) */}
      {!selectedCategory && products.length === 0 && categories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Browse by Category</h2>
          {/* Responsive grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                onClick={handleCategoryClick}
                className="animate-scale-in"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};