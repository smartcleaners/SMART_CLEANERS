import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import {
  MessageCircle,
  Search,
  Filter,
  Package,
  CheckCircle,
  Star,
  Truck,
  Shield,
  Phone,
  ChevronRight,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WHATSAPP_NUMBER = '919014632639';

interface BulkProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  priceRange: string;
  moq: number;
  unit: string;
  features: string[];
  isActive: boolean;
  createdAt: any;
}

const WHATSAPP_CTA = (productName?: string) => {
  const msg = productName
    ? `Hi, I'm interested in bulk pricing for *${productName}*. Please share details.`
    : `Hi, I'm interested in bulk orders from Smart Cleaners. Please share your catalog & pricing.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const BulkOrders: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<BulkProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const q = query(
      collection(db, 'bulkProducts'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BulkProduct[];
      setProducts(data.filter(p => p.isActive));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bulk products:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Header Section ─────────────────────────────────────────────────── */}
      <section className="px-4 pt-8 text-center space-y-4">
        <h1 className="text-section">B2B Wholesale Catalog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Premium cleaning products for hotels, restaurants, hospitals & commercial establishments.
          Get competitive wholesale pricing and reliable supply chain solutions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a href={WHATSAPP_CTA()} target="_blank" rel="noopener noreferrer">
            <Button className="btn-cta">
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Bulk Quote
            </Button>
          </a>
          <a href="tel:+919014632639">
            <Button variant="outline" className="px-8 py-4 h-auto font-semibold">
              <Phone className="h-4 w-4 mr-2" />
              Call +91 9014632639
            </Button>
          </a>
        </div>
      </section>

      {/* ── Trust Indicators ─────────────────────────────────────────────── */}
      <section className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 card-elevated">
            <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-semibold">ISO Certified</p>
          </div>
          <div className="text-center p-4 card-elevated">
            <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold">Pan India Delivery</p>
          </div>
          <div className="text-center p-4 card-elevated">
            <Award className="h-8 w-8 text-cta mx-auto mb-2" />
            <p className="text-sm font-semibold">B2B Pricing</p>
          </div>
          <div className="text-center p-4 card-elevated">
            <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold">500+ Clients</p>
          </div>
        </div>
      </section>

      {/* ── Search & Filters ─────────────────────────────────────────────── */}
      <section className="px-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bulk products..."
              className="pl-9 h-12"
            />
          </div>
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Product Catalog Grid ─────────────────────────────────────────── */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Available Products</h2>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-4 w-4" /> {filtered.length} products
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 card-elevated max-w-2xl mx-auto">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'Our catalog is being updated. Check back soon!'}
            </p>
            <a href={WHATSAPP_CTA()} target="_blank" rel="noopener noreferrer">
              <Button className="btn-primary">
                Ask on WhatsApp
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={(slug) => navigate(`/bulk-orders/${slug}`)} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────── */}
      <section className="px-4 py-8 text-center space-y-4">
        <h2 className="text-section">Ready to Order in Bulk?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Get special pricing for commercial orders. Talk to our B2B team on WhatsApp for custom quotes, samples & fast delivery.
        </p>
        <a href={WHATSAPP_CTA()} target="_blank" rel="noopener noreferrer">
          <Button className="btn-cta mt-2">
            <Clock className="h-4 w-4 mr-2" />
            Get Bulk Pricing Now
          </Button>
        </a>
      </section>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: BulkProduct;
  onNavigate: (slug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  return (
    <article 
      className="card-elevated flex flex-col cursor-pointer overflow-hidden animate-scale-in"
      onClick={() => onNavigate(product.slug)}
    >
      <div className="relative aspect-[4/3] bg-muted/30 p-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {product.category && (
          <div className="absolute top-2 left-2">
            <span className="bg-background/90 text-primary text-[10px] font-semibold px-2 py-0.5 rounded border border-border">
              {product.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-3 border-t border-border/50">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            MOQ: {product.moq} {product.unit}
          </p>
        </div>

        <div className="mt-auto pt-2">
          <div className="text-primary font-bold text-sm mb-3">
            {product.priceRange || 'Contact for Price'}
          </div>
          
          <Button 
            className="w-full btn-primary h-9 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(product.slug);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
};