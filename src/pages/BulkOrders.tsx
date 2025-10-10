import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Warehouse, 
  Calculator, 
  Phone, 
  Mail, 
  Clock, 
  TrendingDown,
  Building2,
  Users,
  Package,
  CheckCircle 
} from 'lucide-react';

const bulkTiers = [
  {
    name: 'Starter Bulk',
    minQuantity: 10,
    maxQuantity: 49,
    discount: '15%',
    description: 'Perfect for small hotels and cafes',
    features: ['15% discount on all products', 'Free local delivery', 'Email support'],
    color: 'bg-secondary'
  },
  {
    name: 'Business Bulk',
    minQuantity: 50,
    maxQuantity: 199,
    discount: '25%',
    description: 'Ideal for restaurants and mid-size hotels',
    features: ['25% discount on all products', 'Priority delivery', 'Phone & email support', 'Dedicated account manager'],
    color: 'bg-primary',
    popular: true
  },
  {
    name: 'Enterprise Bulk',
    minQuantity: 200,
    maxQuantity: null,
    discount: '35%',
    description: 'Best for hotel chains and large establishments',
    features: ['Up to 35% discount', 'Same-day delivery available', '24/7 support', 'Custom packaging', 'Flexible payment terms'],
    color: 'bg-cta'
  }
];

const industries = [
  { name: 'Hotels & Resorts', icon: Building2, description: 'Housekeeping & maintenance' },
  { name: 'Restaurants', icon: Users, description: 'Kitchen & dining area cleaning' },
  { name: 'Cafes & QSRs', icon: Package, description: 'Daily cleaning essentials' },
];

export const BulkOrders: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  return (
    <div className="space-y-8 px-4 py-6">
      {/* Header */}
      <section className="text-center space-y-4">
        <Warehouse className="h-10 w-10 text-primary mx-auto" />
        <div className="space-y-2">
          <h1 className="text-section">Bulk Orders & B2B Pricing</h1>
          <p className="text-muted-foreground">
            Special pricing for hotels, restaurants, and commercial establishments
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-4 bg-muted p-4 -mx-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">500+</div>
          <div className="text-xs text-muted-foreground">B2B Clients</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">24hr</div>
          <div className="text-xs text-muted-foreground">Delivery</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-cta">35%</div>
          <div className="text-xs text-muted-foreground">Max Savings</div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Industries We Serve</h2>
        <div className="space-y-3">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <Card key={index} className="p-4 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Bulk Pricing Tiers */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <TrendingDown className="h-5 w-5 text-accent" />
            Bulk Pricing Tiers
          </h2>
          <p className="text-sm text-muted-foreground">
            The more you order, the more you save
          </p>
        </div>

        <div className="space-y-4">
          {bulkTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`p-4 space-y-4 cursor-pointer transition-all ${
                selectedTier === index ? 'ring-2 ring-primary shadow-lg' : ''
              } ${tier.popular ? 'border-primary' : ''}`}
              onClick={() => setSelectedTier(selectedTier === index ? null : index)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tier.name}</h3>
                    {tier.popular && (
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {tier.minQuantity}+ units
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-bold text-accent">{tier.discount} off</span>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${tier.color} bg-opacity-20`}>
                  <Calculator className="h-4 w-4" />
                </div>
              </div>

              {selectedTier === index && (
                <div className="space-y-3 pt-4 border-t animate-fade-in">
                  <div className="space-y-2">
                    {tier.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="btn-primary w-full">
                    Request {tier.name} Quote
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Get Your Custom Quote</h2>
        
        <div className="space-y-3">
          <Card className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Call Us</h3>
              <p className="text-sm text-muted-foreground">+91 9014632639/+91 8801800362</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium">Email Us</h3>
              <p className="text-sm text-muted-foreground">smartcleaners.shop@gmail.com</p>
            </div>
          </Card>
        </div>

        <Button className="btn-cta w-full">
          <Clock className="h-4 w-4 mr-2" />
          Request Bulk Quote Now
        </Button>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 -mx-4 space-y-4">
        <h3 className="font-semibold text-primary">Why Choose Smart Cleaners for Bulk Orders?</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <strong>Competitive Pricing:</strong> Best wholesale rates in the market with transparent pricing structure.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <strong>Reliable Supply Chain:</strong> Consistent stock availability and on-time delivery guaranteed.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <strong>Quality Assurance:</strong> All products are professionally tested and certified for commercial use.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <strong>Dedicated Support:</strong> Personal account managers and 24/7 customer support for enterprise clients.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};