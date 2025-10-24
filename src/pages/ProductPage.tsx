import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, firebaseService } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Package, 
  Ruler, 
  ListChecks,
  FileText,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Shield,
  Truck
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        const products = await firebaseService.getProducts();
        const foundProduct = products.find(p => p.id === productId);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    // Optional: Show success message and reset quantity
    // You could add a toast notification here
    setQuantity(1);
  };

  const calculateDiscount = () => {
    if (!product?.salePrice) return 0;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="card-elevated overflow-hidden aspect-square">
            <img 
              src={product.images[selectedImage] || '/placeholder-product.png'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                disabled={selectedImage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2 flex-1 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImage(prev => Math.min(product.images.length - 1, prev + 1))}
                disabled={selectedImage === product.images.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.stock > 0 ? (
                <Badge className="bg-green-500">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                SKU: {product.sku}
              </Badge>
              {discount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ₹{product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Price inclusive of all taxes
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y">
            <div className="text-center">
              <Shield className="h-5 w-5 text-accent mx-auto mb-1" />
              <p className="text-xs font-medium">Certified</p>
            </div>
            <div className="text-center">
              <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs font-medium">Fast Delivery</p>
            </div>
            <div className="text-center">
              <Star className="h-5 w-5 text-cta mx-auto mb-1" />
              <p className="text-xs font-medium">Top Rated</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="font-semibold">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-16 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                ({product.stock} available)
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="btn-cta w-full text-lg py-6"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - ₹{((product.salePrice || product.price) * quantity).toFixed(2)}
          </Button>

          {/* Bulk Order CTA */}
          <div className="card-elevated p-4 bg-muted">
            <p className="text-sm font-medium mb-2">Need bulk quantities?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Get special pricing for orders of 50+ units
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/bulk-orders')}
              className="w-full"
            >
              Request Bulk Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Specifications */}
        <div className="card-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Specifications</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-medium">{product.weight}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Dimensions</span>
              <span className="font-medium">{product.dimensions}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-medium">{product.sku}</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="card-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Ingredients</h3>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.ingredients}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="card-elevated p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Usage Instructions</h3>
        </div>
        
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {product.instructions}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="gradient-hero text-white p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Safety Information</h3>
        <p className="text-sm opacity-90">
          Professional grade cleaning chemical. Keep out of reach of children. 
          Use protective equipment when handling. Follow all safety instructions on the label.
        </p>
      </div>
    </div>
  );
};