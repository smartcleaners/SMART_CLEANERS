import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  MessageCircle,
  ArrowLeft,
  Package,
  CheckCircle,
  Phone,
  Shield,
  Truck,
  Award,
  Star,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const buildWhatsappUrl = (productName: string) => {
  const msg = `Hi, I'm interested in bulk pricing for *${productName}*. Please share your best price and availability details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const BulkOrderProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<BulkProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const q = query(collection(db, 'bulkProducts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProduct({ id: snap.docs[0].id, ...snap.docs[0].data() } as BulkProduct);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 card-elevated p-8 max-w-md w-full">
          <Package className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Product not found</h2>
          <p className="text-muted-foreground text-sm">This product may have been removed or the URL is incorrect.</p>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => navigate('/bulk-orders')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
            </Button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <Button className="btn-primary w-full">
                Ask on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="px-4 py-4 border-b border-border bg-card">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="h-4 w-4" /> Home
            </button>
          </li>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <li>
            <button onClick={() => navigate('/bulk-orders')} className="hover:text-primary transition-colors">
              Bulk Orders
            </button>
          </li>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <li className="text-foreground font-semibold truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="px-4 grid md:grid-cols-2 gap-8 items-start">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="card-elevated aspect-square p-8 flex items-center justify-center bg-card">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain animate-scale-in"
              />
            ) : (
              <Package className="h-24 w-24 text-muted-foreground/30" />
            )}
          </div>
          
          <div className="card-elevated p-4 flex items-center justify-center gap-2">
             <Shield className="h-5 w-5 text-accent" />
             <span className="text-sm font-semibold text-foreground">Commercial Grade & ISO Certified</span>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
                {product.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-cta">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Trusted by 500+ businesses</span>
            </div>
            
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Wholesale Price</p>
              <p className="text-2xl font-bold text-primary">{product.priceRange || 'Contact for Price'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Minimum Order</p>
              <p className="text-xl font-bold text-foreground">{product.moq} <span className="text-sm font-normal text-muted-foreground">{product.unit}</span></p>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <a
              href={buildWhatsappUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="btn-cta w-full h-14 text-base">
                <MessageCircle className="h-5 w-5 mr-2" />
                Get Best Price on WhatsApp
              </Button>
            </a>

            <a
              href="tel:+919014632639"
              className="block"
            >
              <Button variant="outline" className="w-full h-14 text-base font-semibold border-2">
                <Phone className="h-5 w-5 mr-2" />
                Call +91 9014632639
              </Button>
            </a>
          </div>

          <div className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" /> Key Features
            </h3>
            <ul className="space-y-2">
              {product.features?.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Special bulk pricing available
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Pan India delivery network
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Additional Info ──────────────────────────────────────────────── */}
      <div className="px-4">
        <div className="card-elevated p-8">
          <h2 className="text-xl font-bold mb-6">Why Choose Smart Cleaners?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Award className="h-8 w-8 text-cta" />
              <h3 className="font-semibold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Commercial grade formulas trusted by top hotels and hospitals across India.</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-accent" />
              <h3 className="font-semibold">ISO Certified</h3>
              <p className="text-sm text-muted-foreground">All products are professionally tested to ensure safety and effectiveness.</p>
            </div>
            <div className="space-y-2">
              <Truck className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Reliable supply chain network ensures your bulk orders arrive on time, every time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
