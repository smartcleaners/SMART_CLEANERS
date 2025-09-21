import React, { useEffect, useState } from 'react';
import { Combo, firebaseService } from '@/lib/firebase';
import { ComboCard } from '@/components/combos/ComboCard';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, TrendingUp } from 'lucide-react';

export const Combos: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCombos = async () => {
      try {
        const combosData = await firebaseService.getCombos();
        setCombos(combosData);
      } catch (error) {
        console.error('Error loading combos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCombos();
  }, []);

  const featuredCombos = combos.filter(combo => combo.isFeatured);
  const regularCombos = combos.filter(combo => !combo.isFeatured);

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
      <div className="text-center space-y-4">
        <Package className="h-8 w-8 text-primary mx-auto" />
        <div className="space-y-2">
          <h1 className="text-section">Combo Deals & Bundles</h1>
          <p className="text-muted-foreground">
            Save more with our carefully curated product bundles designed for hotels and restaurants
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 bg-muted p-4 -mx-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{combos.length}</div>
            <div className="text-xs text-muted-foreground">Total Combos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">Up to 35%</div>
            <div className="text-xs text-muted-foreground">Max Savings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cta">{featuredCombos.length}</div>
            <div className="text-xs text-muted-foreground">Featured Deals</div>
          </div>
        </div>
      </div>

      {/* Featured Combos */}
      {featuredCombos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cta" />
            <h2 className="text-xl font-semibold">Featured Deals</h2>
            <Badge className="bg-cta text-cta-foreground">Hot</Badge>
          </div>
          
          <div className="space-y-4">
            {featuredCombos.map((combo) => (
              <ComboCard 
                key={combo.id} 
                combo={combo}
                className="animate-scale-in border-2 border-cta/20"
              />
            ))}
          </div>
        </section>
      )}

      {/* All Combos */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">All Combo Deals</h2>
        </div>
        
        {regularCombos.length > 0 ? (
          <div className="space-y-4">
            {regularCombos.map((combo) => (
              <ComboCard 
                key={combo.id} 
                combo={combo}
                className="animate-slide-up"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <div>
              <p className="text-muted-foreground">No regular combo deals available at the moment</p>
              <p className="text-sm text-muted-foreground">Check our featured deals above!</p>
            </div>
          </div>
        )}
      </section>

      {combos.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <div>
            <p className="text-muted-foreground">No combo deals available</p>
            <p className="text-sm text-muted-foreground">We're working on exciting bundle offers. Check back soon!</p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 -mx-4 space-y-4">
        <h3 className="font-semibold text-primary">Why Choose Our Combos?</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>Curated Selection:</strong> Each combo is carefully designed based on real-world usage patterns from hotels and restaurants.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>Bulk Savings:</strong> Get better pricing than buying individual products, perfect for business needs.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cta rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>Complete Solutions:</strong> Each combo provides everything needed for specific cleaning tasks or areas.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};