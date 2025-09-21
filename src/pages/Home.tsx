import React, { useEffect, useState } from 'react';
import { Category, Product, Combo, firebaseService } from '@/lib/firebase';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import { ComboCard } from '@/components/combos/ComboCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Star, 
  Award, 
  Truck, 
  Shield, 
  Clock,
  ChevronRight 
} from 'lucide-react';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredCombos, setFeaturedCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData, combosData] = await Promise.all([
          firebaseService.getCategories(),
          firebaseService.getProducts(),
          firebaseService.getFeaturedCombos()
        ]);
        
        setCategories(categoriesData.slice(0, 4)); // Show first 4 categories
        setProducts(productsData.slice(0, 6)); // Show first 6 products
        setFeaturedCombos(combosData.slice(0, 3)); // Show first 3 combos
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="gradient-hero text-white px-4 py-12">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-white/30">
              Professional Grade Solutions
            </Badge>
            <h1 className="text-hero">
              Premium Cleaning Solutions for Hotels & Restaurants
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Professional-grade cleaning chemicals trusted by top hotels and restaurants. 
              Bulk pricing, fast delivery, guaranteed quality.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="btn-cta"
              onClick={() => navigate('/bulk-orders')}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Bulk Orders
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4">
            <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Certified Quality</p>
          </div>
          <div className="text-center p-4">
            <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Fast Delivery</p>
          </div>
          <div className="text-center p-4">
            <Award className="h-8 w-8 text-cta mx-auto mb-2" />
            <p className="text-sm font-medium">B2B Pricing</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-section">Shop by Category</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/categories')}
            className="text-primary"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={() => navigate(`/categories?category=${category.id}`)}
              className="animate-scale-in"
            />
          ))}
        </div>
      </section>

      {/* Featured Combos */}
      {featuredCombos.length > 0 && (
        <section className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section">Featured Combo Deals</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/combos')}
              className="text-primary"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {featuredCombos.map((combo) => (
              <ComboCard 
                key={combo.id} 
                combo={combo}
                className="animate-slide-up"
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="px-4 space-y-4">
        <h2 className="text-section">Popular Products</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="animate-scale-in"
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 space-y-4 bg-muted py-8 -mx-4">
        <h2 className="text-section text-center">Trusted by Industry Leaders</h2>
        
        <div className="space-y-4">
          {[
            {
              name: "Grand Hotel Mumbai",
              rating: 5,
              text: "Excellent quality products with consistent results. Fast delivery and great bulk pricing.",
              role: "Housekeeping Manager"
            },
            {
              name: "Spice Route Restaurant",
              rating: 5,
              text: "Professional grade cleaners that keep our kitchen spotless. Highly recommended for restaurants.",
              role: "Operations Manager"
            }
          ].map((testimonial, index) => (
            <div key={index} className="card-elevated p-4 mx-4 space-y-3">
              <div className="flex items-center gap-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-cta text-cta" />
                ))}
              </div>
              <p className="text-sm">{testimonial.text}</p>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8 text-center space-y-4">
        <h2 className="text-section">Ready to Order in Bulk?</h2>
        <p className="text-muted-foreground">
          Get special pricing for orders of 50+ units. Contact us for custom quotes.
        </p>
        <Button 
          className="btn-cta"
          onClick={() => navigate('/bulk-orders')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Get Bulk Quote Now
        </Button>
      </section>
    </div>
  );
};