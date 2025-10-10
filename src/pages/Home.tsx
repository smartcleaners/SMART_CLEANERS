import React, { useEffect, useState } from 'react';
import { Category, Product, Combo, firebaseService } from '@/lib/firebase';
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
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const Home: React.FC = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCombos, setFeaturedCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [productPage, setProductPage] = useState(0);
  const navigate = useNavigate();
  
  const ITEMS_PER_PAGE = 4;

  // Helper function to sort products by serialNo
  const sortBySerialNo = (products: Product[]): Product[] => {
    return products.sort((a, b) => {
      if (a.serialNo === undefined && b.serialNo === undefined) return 0;
      if (a.serialNo === undefined) return 1;
      if (b.serialNo === undefined) return -1;
      return a.serialNo - b.serialNo;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData, combosData] = await Promise.all([
          firebaseService.getCategories(),
          firebaseService.getProducts(),
          firebaseService.getFeaturedCombos()
        ]);
        
        setAllCategories(categoriesData);
        setAllProducts(productsData);
        
        const fiveLiterProducts = productsData
          .filter(p => 
            p.weight?.includes('5') && 
            (p.weight?.toLowerCase().includes('liter') || p.weight?.toLowerCase().includes('l')) &&
            p.salePrice && 
            p.salePrice > 0
          );
        
        setFeaturedProducts(fiveLiterProducts.slice(0, 4));
        setFeaturedCombos(combosData.slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const paginatedProducts = allProducts.slice(
    productPage * ITEMS_PER_PAGE,
    (productPage + 1) * ITEMS_PER_PAGE
  );

  const totalProductPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
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

    

      {/* All Products Section with Pagination - SORTED BY SERIALNO */}
      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-section">Our Products</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/categories')}
            className="text-primary"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {/* Responsive grid: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sortBySerialNo(paginatedProducts).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="animate-scale-in"
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalProductPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProductPage(prev => Math.max(0, prev - 1))}
              disabled={productPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {productPage + 1} of {totalProductPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProductPage(prev => Math.min(totalProductPages - 1, prev + 1))}
              disabled={productPage === totalProductPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
        {featuredProducts.length > 0 && (
        <section className="px-4 space-y-4">
          <h2 className="text-section">Featured Products</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className="animate-scale-in"
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))
            }
          </div>
        </section>
      )
      }

      {/* Testimonials */}
      <section className="px-4 space-y-4 bg-muted py-8 -mx-4">
        <h2 className="text-section text-center">Trusted by Industry Leaders</h2>
        
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
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