import React, { useEffect, useState, useCallback, useRef } from 'react';
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

const BANNER_IMAGES = [
  '/image copy 0.jpeg',
  '/image copy 1.png',
  '/image copy 2.png',
  '/image copy 3.png',
  '/image copy 4.png',
  '/image copy 5.png',
  '/image copy 6.png',
  '/image copy 7.png',
];

const MID_BANNER_IMAGES = [
  '/image copy 8.png',
  '/image copy 9.png',
];

export const Home: React.FC = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCombos, setFeaturedCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [productPage, setProductPage] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentMidBanner, setCurrentMidBanner] = useState(0);
  const bannerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const midBannerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const midTouchStartX = useRef<number>(0);
  const midTouchEndX = useRef<number>(0);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 4;

  // Banner carousel auto-slide
  const startBannerAutoSlide = useCallback(() => {
    if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
  }, []);

  // Mid banner carousel auto-slide
  const startMidBannerAutoSlide = useCallback(() => {
    if (midBannerIntervalRef.current) clearInterval(midBannerIntervalRef.current);
    midBannerIntervalRef.current = setInterval(() => {
      setCurrentMidBanner(prev => (prev + 1) % MID_BANNER_IMAGES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startBannerAutoSlide();
    startMidBannerAutoSlide();
    return () => {
      if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
      if (midBannerIntervalRef.current) clearInterval(midBannerIntervalRef.current);
    };
  }, [startBannerAutoSlide, startMidBannerAutoSlide]);

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
    startBannerAutoSlide();
  };

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
    startBannerAutoSlide();
  };

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % BANNER_IMAGES.length);
    startBannerAutoSlide();
  };

  const goToMidBanner = (index: number) => {
    setCurrentMidBanner(index);
    startMidBannerAutoSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextBanner();
      else prevBanner();
    }
  };

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
      {/* Banner Carousel */}
      <section
        className="relative w-full overflow-hidden rounded-xl lg:max-w-6xl lg:mx-auto lg:max-h-[550px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {BANNER_IMAGES.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={src}
                alt={`Smart Cleaners Banner ${index + 1}`}
                className="w-full h-auto object-cover rounded-xl"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>



        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBanner(index)}
              className={`rounded-full transition-all duration-300 ${currentBanner === index
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
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

      {/* Mid-Page Promotional Banners */}
      <section
        className="relative w-full overflow-hidden rounded-xl lg:max-w-6xl lg:mx-auto lg:max-h-[550px]"
        onTouchStart={(e) => { midTouchStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => { midTouchEndX.current = e.touches[0].clientX; }}
        onTouchEnd={() => {
          const diff = midTouchStartX.current - midTouchEndX.current;
          if (Math.abs(diff) > 50) {
            if (diff > 0) setCurrentMidBanner(prev => (prev + 1) % MID_BANNER_IMAGES.length);
            else setCurrentMidBanner(prev => (prev - 1 + MID_BANNER_IMAGES.length) % MID_BANNER_IMAGES.length);
            startMidBannerAutoSlide();
          }
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentMidBanner * 100}%)` }}
        >
          {MID_BANNER_IMAGES.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={src}
                alt={`Promotional Banner ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {MID_BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMidBanner(index)}
              className={`rounded-full transition-all duration-300 ${currentMidBanner === index
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to promo banner ${index + 1}`}
            />
          ))}
        </div>
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

      {/* Customer Reviews */}
      <section className="px-4 space-y-4 bg-muted py-8 -mx-4">
        <h2 className="text-section text-center">What Our Customers Say</h2>

        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            {
              name: "Priya Sharma",
              date: "01/04/26",
              rating: 5,
              text: "I recently purchased from Smart Cleaners and had a wonderful experience. The cleaner quality feels effective and reliable overall. Delivery arrived on time.",
              photo: "/image copy 10.png"
            },
            {
              name: "Aarti Joshi",
              date: "20/04/26",
              rating: 5,
              text: "Shopping from Smart Cleaners was a wonderful experience overall. The quality exceeded my expectations honestly. Everything arrived safely with proper packaging.",
              photo: "/image copy 11.png"
            },
            {
              name: "Ritu Malhotra",
              date: "17/04/26",
              rating: 5,
              text: "I am really happy with my order from Smart Cleaners. The cleaner quality feels excellent and long lasting. Delivery service was fast and hassle free.",
              photo: "/image copy 12.png"
            },
            {
              name: "Shalini Gupta",
              date: "15/04/26",
              rating: 5,
              text: "Smart Cleaners provided an excellent shopping experience for me. The product quality feels reliable and effective overall. Everything arrived safely.",
              photo: "/image copy 13.png"
            },
            {
              name: "Neha Kapoor",
              date: "13/04/26",
              rating: 5,
              text: "I had a smooth shopping experience with Smart Cleaners recently. The quality feels dependable and premium overall. Delivery arrived quickly without any issues.",
              photo: "/image copy 14.png"
            },
            {
              name: "Meera Iyer",
              date: "11/04/26",
              rating: 5,
              text: "Shopping from Smart Cleaners was a really good experience overall. The cleaner quality feels premium and worth the money. Everything matched perfectly.",
              photo: "/image copy 15.png"
            }
          ].map((review, index) => (
            <div key={index} className="card-elevated space-y-0 min-w-[280px] max-w-[320px] flex-shrink-0 snap-start overflow-hidden">
              {/* Product usage photo */}
              {review.photo && (
                <img
                  src={review.photo}
                  alt={`Product review by ${review.name}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                    style={{ backgroundColor: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'][index] }}
                  >
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-cta text-cta" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
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