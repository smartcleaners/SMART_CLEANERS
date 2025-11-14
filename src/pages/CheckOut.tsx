import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseService } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, User, MapPin, Phone, CreditCard, Package, ArrowLeft,
  CheckCircle, Loader2, Banknote, Download, Navigation, Home, Save, ExternalLink
} from 'lucide-react';

// API Keys Configuration
const MAPS_API_KEY = 'AIzaSyCpXI-nSkwRiKs7AtTjA1DLa-0r4Ri8ipU';
const GEOCODING_API_KEY = 'AIzaSyBdFiwMiYNphva_FumsGzox7Etryg2SNDc';
const PLACES_API_KEY = 'AIzaSyA1qLmOb0k_j1JLu0h7VLCRlwZ-eHcQNq8';

export const CheckOut: React.FC = () => {
  const { items, total, itemCount, clearCart } = useCart();
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showQrPage, setShowQrPage] = useState(false);
  const [addressMode, setAddressMode] = useState<'saved' | 'new' | 'location'>('saved');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', pincode: '', city: '', state: '',
    latitude: null as number | null, longitude: null as number | null, mapsLink: '' as string
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const hasSavedAddress = user?.address?.street;

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${PLACES_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && formData.latitude && formData.longitude && !googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: formData.latitude, lng: formData.longitude },
        zoom: 16,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      markerRef.current = new google.maps.Marker({
        position: { lat: formData.latitude, lng: formData.longitude },
        map: googleMapRef.current,
        title: 'Your Location',
        animation: google.maps.Animation.DROP,
        draggable: true,
      });

      markerRef.current.addListener('dragend', async (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        await reverseGeocode(newLat, newLng);
      });

      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      placesServiceRef.current = new google.maps.places.PlacesService(googleMapRef.current);
    }
  }, [mapLoaded, formData.latitude, formData.longitude]);

  useEffect(() => {
    if (googleMapRef.current && markerRef.current && formData.latitude && formData.longitude) {
      const position = { lat: formData.latitude, lng: formData.longitude };
      googleMapRef.current.setCenter(position);
      markerRef.current.setPosition(position);
    }
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', phone: user.phone || '', address: user.address?.street || '',
        pincode: user.address?.pincode || '', city: user.address?.city || '', state: user.address?.state || '',
        latitude: null, longitude: null, mapsLink: ''
      });
      setAddressMode(user.address?.street ? 'saved' : 'new');
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOCODING_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results[0]) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        let city = '', state = '', pincode = '', locality = '';
        
        addressComponents.forEach((component: any) => {
          if (component.types.includes('locality')) city = component.long_name;
          else if (component.types.includes('sublocality_level_1')) locality = component.long_name;
          else if (component.types.includes('administrative_area_level_1')) state = component.long_name;
          else if (component.types.includes('postal_code')) pincode = component.long_name;
        });
        
        setFormData(prev => ({
          ...prev, address: result.formatted_address, city: city || locality,
          state, pincode, latitude, longitude, mapsLink
        }));
        setAddressMode('location');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setFormData(prev => ({
        ...prev, address: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        latitude, longitude, mapsLink
      }));
      setAddressMode('location');
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enable location permissions and try again.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAddressSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }
    if (!autocompleteServiceRef.current) return;

    try {
      const request = {
        input: query,
        componentRestrictions: { country: 'in' },
        types: ['address', 'establishment'],
      };
      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      });
    } catch (error) {
      console.error('Error searching addresses:', error);
    }
  };

  const handleSelectPrediction = async (placeId: string) => {
    if (!placesServiceRef.current) return;
    setShowPredictions(false);
    setSearchQuery('');

    try {
      placesServiceRef.current.getDetails(
        { placeId, fields: ['geometry', 'formatted_address', 'address_components'] },
        async (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();
            if (lat && lng) {
              await reverseGeocode(lat, lng);
              if (googleMapRef.current && markerRef.current) {
                googleMapRef.current.panTo({ lat, lng });
                googleMapRef.current.setZoom(16);
                markerRef.current.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => markerRef.current?.setAnimation(null), 2000);
              }
            }
          }
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
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
    if (!formData.city.trim() && addressMode !== 'location') newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;
    setSavingAddress(true);
    try {
      await updateUserProfile({
        name: formData.name.trim(), phone: formData.phone.trim(),
        address: {
          street: formData.address.trim(), city: formData.city.trim(),
          state: formData.state.trim(), pincode: formData.pincode.trim()
        }
      });
      alert('Address saved successfully! You can use this address for future orders.');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
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
        orderId: currentOrderId, status: 'pending',
        paymentMethod: paymentMethod === 'cash' ? 'cash_on_delivery' : 'online_payment',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'awaiting_payment',
        createdAt: new Date(),
        customer: {
          name: formData.name.trim(), phone: formData.phone.trim(),
          address: {
            street: formData.address.trim(), city: formData.city.trim(),
            state: formData.state.trim(), pincode: formData.pincode.trim(),
            fullAddress: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
            ...(formData.latitude && formData.longitude && {
              coordinates: { latitude: formData.latitude, longitude: formData.longitude }
            }),
            ...(formData.mapsLink && { mapsLink: formData.mapsLink })
          }
        },
        items: items.map(item => {
          const itemPrice = item.product.salePrice || item.product.price;
          const bulkDiscount = calculateBulkDiscount(item.quantity, itemPrice);
          const bulkDiscountPerItem = bulkDiscount / item.quantity;
          return {
            productId: item.product.id,
            productDetails: { name: item.product.name, sku: item.product.sku, images: item.product.images || [] },
            quantity: item.quantity, unitPrice: itemPrice,
            finalUnitPrice: itemPrice - bulkDiscountPerItem,
            lineTotal: (itemPrice - bulkDiscountPerItem) * item.quantity,
          };
        }),
        pricing: {
          subtotal: total + totalBulkSavings, bulkDiscountTotal: totalBulkSavings,
          shippingCost: 0, finalTotal: total, itemCount: itemCount
        },
      };
      await firebaseService.createOrder(orderData);
      setOrderId(currentOrderId);
      setOrderPlaced(true);
      clearCart();
      setShowQrPage(false);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (!validateForm()) return;
    if (paymentMethod === 'online') {
      setShowQrPage(true);
    } else {
      handlePlaceOrder();
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-6">
          <div className="text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          </div>
          <Link to="/"><Button className="btn-primary"><Package className="h-4 w-4 mr-2" />Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  if (showQrPage) {
    const upiId = 'babuhari118@ybl';
    const merchantName = 'SUDIGOLLU HARI BABU';
    const amount = total.toFixed(2);
    const transactionNote = `Payment for your order`;
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold">1. Complete Your Payment</h2>
            <p className="text-muted-foreground">Scan QR code to pay ₹{amount}.</p>
          </div>
          <div className='p-4 border rounded-lg space-y-3'>
            <h3 className='font-semibold'>Scan for Exact Amount (₹{total.toFixed(2)})</h3>
            <div className="bg-white p-4 inline-block rounded-md"><QRCode value={upiLink} size={200} /></div>
            <a href="/payment.jpg" download="payment-qr.jpg" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full">
              <Download className="h-4 w-4 mr-2" />Download QR Code
            </a>
          </div>
          <div className="pt-6 border-t">
            <h2 className="text-2xl font-bold">2. Confirm Your Order</h2>
            <p className="text-muted-foreground mt-2">After paying, click the button below to submit your order details.</p>
            <Button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full mt-4 text-lg py-6">
              {loading ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Submitting Order...</>) : 'I Have Paid, Place My Order'}
            </Button>
          </div>
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
                {paymentMethod === 'online' ? 'Your order will be confirmed after payment is verified.' : 'You will receive a confirmation call shortly.'}
              </p>
            </div>
          </div>
          <Link to="/"><Button className="btn-primary w-full">Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-2"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />Checkout
          </h1>
          <p className="text-muted-foreground">{itemCount} {itemCount === 1 ? 'item' : 'items'} • Total: ₹{total.toFixed(2)}</p>
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
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your full name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter 10-digit phone number" maxLength={10} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="card-product p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Delivery Address</h2>
            </div>

            {user && user.address?.street && (
              <div className="flex gap-3 mb-4">
                <Button type="button" variant={addressMode === 'saved' ? 'default' : 'outline'} size="sm"
                  onClick={() => {
                    setAddressMode('saved');
                    setFormData(prev => ({
                      ...prev, address: user.address?.street || '', city: user.address?.city || '',
                      state: user.address?.state || '', pincode: user.address?.pincode || '',
                      latitude: null, longitude: null, mapsLink: ''
                    }));
                  }} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />Saved Address
                </Button>
                <Button type="button" variant={addressMode === 'new' ? 'default' : 'outline'} size="sm"
                  onClick={() => {
                    setAddressMode('new');
                    setFormData(prev => ({
                      ...prev, address: '', city: '', state: '', pincode: '',
                      latitude: null, longitude: null, mapsLink: ''
                    }));
                  }} className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />New Address
                </Button>
              </div>
            )}

            <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={gettingLocation} className="w-full mb-4">
              {gettingLocation ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Getting Location...</>) : (<><Navigation className="h-4 w-4 mr-2" />Use Current Location</>)}
            </Button>

            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Search for your address</label>
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => handleAddressSearch(e.target.value)}
                  placeholder="Search for area, street name, landmark..."
                  className="w-full p-3 pr-10 border rounded-lg border-gray-300 focus:border-accent focus:outline-none"
                  disabled={addressMode === 'saved'} />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              {showPredictions && predictions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {predictions.map((prediction) => (
                    <button key={prediction.place_id} onClick={() => handleSelectPrediction(prediction.place_id)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{prediction.structured_formatting.main_text}</p>
                          <p className="text-xs text-muted-foreground">{prediction.structured_formatting.secondary_text}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {addressMode === 'location' && formData.latitude && formData.longitude && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-green-800 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />Location Captured
                      </p>
                      <p className="text-xs text-green-700 mt-1">{formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                    </div>
                    {formData.mapsLink && (
                      <a href={formData.mapsLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                        Open in Maps<ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div ref={mapRef} className="w-full h-64 rounded-lg border-2 border-gray-200" style={{ minHeight: '256px' }} />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3}
                  className={`w-full p-3 border rounded-lg resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your complete address" disabled={addressMode === 'saved'} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="City" disabled={addressMode === 'saved'} />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg border-gray-300" placeholder="State" disabled={addressMode === 'saved'} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg border-gray-300" placeholder="000000" maxLength={6} disabled={addressMode === 'saved'} />
                </div>
              </div>
            </div>

            {!hasSavedAddress && addressMode === 'new' && formData.address && (
              <Button type="button" variant="outline" onClick={handleSaveAddress} disabled={savingAddress}
                className="w-full border-dashed border-2 border-accent text-accent hover:bg-accent/10">
                {savingAddress ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving Address...</>) : (<><Save className="h-4 w-4 mr-2" />Save This Address for Future Orders</>)}
              </Button>
            )}
          </div>

          <div className="card-product p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <div onClick={() => setPaymentMethod('cash')} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer ${paymentMethod === 'cash' ? 'border-accent bg-accent/10' : 'border-gray-200 hover:border-accent/50'}`}>
                <Banknote className={`h-6 w-6 ${paymentMethod === 'cash' ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                </div>
                {paymentMethod === 'cash' && (<Badge variant="secondary" className="bg-accent/20 text-accent">Selected</Badge>)}
              </div>
              <div onClick={() => setPaymentMethod('online')} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer ${paymentMethod === 'online' ? 'border-accent bg-accent/10' : 'border-gray-200 hover:border-accent/50'}`}>
                <Phone className={`h-6 w-6 ${paymentMethod === 'online' ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="font-medium">Pay Online (UPI)</p>
                  <p className="text-sm text-muted-foreground">Pay via Google Pay, PhonePe, Paytm</p>
                </div>
                {paymentMethod === 'online' && (<Badge variant="secondary" className="bg-accent/20 text-accent">Selected</Badge>)}
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
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded" />
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
            <Button onClick={handleSubmitClick} disabled={loading} className="btn-primary w-full">
              {loading && paymentMethod === 'cash' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Placing Order...</>
              ) : (
                <><ShoppingCart className="h-4 w-4 mr-2" />Place Order</>
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