import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { firebaseService } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  Phone, 
  CreditCard,
  Package,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Banknote
} from 'lucide-react';

export const CheckOut: React.FC = () => {
  const { items, total, itemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBulkDiscount = (quantity: number, price: number) => {
    if (quantity >= 50) return price * quantity * 0.25;
    if (quantity >= 10) return price * quantity * 0.15;
    return 0;
  };

  const totalBulkSavings = items.reduce((savings, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return savings + calculateBulkDiscount(item.quantity, itemPrice);
  }, 0);

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const currentOrderId = `ORD_${Date.now()}`;
      
      const orderData = {
        orderId: currentOrderId,
        status: 'pending',
        paymentMethod: paymentMethod === 'cash' ? 'cash_on_delivery' : 'online_payment',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'awaiting_payment',
        createdAt: new Date(),
        
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: {
            street: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
            fullAddress: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`
          }
        },
        
        items: items.map(item => {
          const itemPrice = item.product.salePrice || item.product.price;
          const bulkDiscount = calculateBulkDiscount(item.quantity, itemPrice);
          const bulkDiscountPerItem = bulkDiscount / item.quantity;
          
          return {
            productId: item.product.id,
            productDetails: {
              name: item.product.name,
              sku: item.product.sku,
              categoryId: item.product.categoryId,
              originalPrice: item.product.price,
              salePrice: item.product.salePrice,
              weight: item.product.weight,
              dimensions: item.product.dimensions,
              description: item.product.description,
              ingredients: item.product.ingredients,
              instructions: item.product.instructions,
              images: item.product.images || []
            },
            quantity: item.quantity,
            unitPrice: itemPrice,
            bulkDiscountPerUnit: bulkDiscountPerItem,
            finalUnitPrice: itemPrice - bulkDiscountPerItem,
            lineTotal: (itemPrice - bulkDiscountPerItem) * item.quantity,
            bulkDiscountApplied: bulkDiscount > 0 ? (item.quantity >= 50 ? '25%' : '15%') : null
          };
        }),
        
        pricing: {
          subtotal: total + totalBulkSavings,
          bulkDiscountTotal: totalBulkSavings,
          shippingCost: 0,
          finalTotal: total,
          itemCount: itemCount
        },
        
        flags: {
          isNewCustomer: true,
          requiresVerification: total > 10000,
          priority: total > 25000 ? 'high' : total > 10000 ? 'medium' : 'normal'
        }
      };
      
      await firebaseService.createOrder(orderData);
      
      setOrderId(currentOrderId);
      setOrderPlaced(true);
      clearCart();
      
      if (paymentMethod === 'online') {
        const upiLink = `upi://pay?pa=9014632639@ybl&pn=SUDIGOLLU%20HARI%20BABU&mc=0000&mode=02&purpose=00&am=${total.toFixed(2)}`;
        window.location.href = upiLink;
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-6">
          <div className="text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-lg mb-6">Add some products before proceeding to checkout</p>
          </div>
          <Button className="btn-primary">
            <Package className="h-4 w-4 mr-2" />
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-6">
          <div className="text-green-600">
            <CheckCircle className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-lg mb-4">Thank you for your order</p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="font-medium">Order ID: {orderId}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {paymentMethod === 'online' 
                  ? 'Complete your payment to confirm the order'
                  : 'You will receive a confirmation call shortly'}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button className="btn-primary w-full">
              Continue Shopping
            </Button>
            <p className="text-sm text-muted-foreground">
              Expected delivery: 2-3 business days
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Checkout
          </h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} • Total: ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-product p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="card-product p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Delivery Address</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="card-product p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <div 
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-accent bg-accent/10' 
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <Banknote className={`h-6 w-6 ${paymentMethod === 'cash' ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                </div>
                {paymentMethod === 'cash' && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Selected
                  </Badge>
                )}
              </div>

              <div 
                onClick={() => setPaymentMethod('online')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'online' 
                    ? 'border-accent bg-accent/10' 
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <Phone className={`h-6 w-6 ${paymentMethod === 'online' ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="font-medium">Pay Online (UPI)</p>
                  <p className="text-sm text-muted-foreground">Pay via Google Pay, PhonePe, Paytm</p>
                </div>
                {paymentMethod === 'online' && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Selected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-product p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{(total + totalBulkSavings).toFixed(2)}</span>
              </div>
              
              {totalBulkSavings > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Bulk Discount Savings</span>
                  <span>-₹{totalBulkSavings.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};