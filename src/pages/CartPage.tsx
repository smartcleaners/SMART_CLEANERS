import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowLeft,
  CreditCard,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
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

  const subtotal = total + totalBulkSavings;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-6">
          <div className="text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-lg mb-6">
              Add some products to get started with your order
            </p>
          </div>
          <div className="space-x-4">
            <Button className="btn-primary">
              <Package className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-product p-0 divide-y">
            {items.map((item) => {
              const hasDiscount =
                item.product.salePrice &&
                item.product.salePrice < item.product.price;
              const itemPrice = item.product.salePrice || item.product.price;
              const bulkDiscount = calculateBulkDiscount(
                item.quantity,
                itemPrice
              );
              const bulkDiscountPerItem = bulkDiscount / item.quantity;

              return (
                <div key={item.product.id} className="p-4 space-y-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.product.sku}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span>{item.product.weight}</span>
                        <span>•</span>
                        <span>{item.product.dimensions}</span>
                      </div>

                      {/* Stock indicator */}
                      {item.product.stock < 10 && item.product.stock > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Only {item.product.stock} left
                        </Badge>
                      )}
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-destructive hover:text-destructive p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quantity and Price Controls */}
                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-price">
                          ₹
                          {(
                            (itemPrice - bulkDiscountPerItem) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-price-original text-xs">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Bulk discount indicator */}
                      {bulkDiscount > 0 && (
                        <div className="text-xs text-accent font-medium">
                          Bulk discount: -₹{bulkDiscount.toFixed(2)}
                          {item.quantity >= 50 && " (25% off)"}
                          {item.quantity >= 10 &&
                            item.quantity < 50 &&
                            " (15% off)"}
                        </div>
                      )}

                      {/* Next bulk tier hint */}
                      {item.quantity >= 5 && item.quantity < 10 && (
                        <div className="text-xs text-muted-foreground">
                          Add {10 - item.quantity} more for 15% off
                        </div>
                      )}
                      {item.quantity >= 10 && item.quantity < 50 && (
                        <div className="text-xs text-muted-foreground">
                          Add {50 - item.quantity} more for 25% off
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card-product p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
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

            <div className="space-y-3">
              <Button
                className="btn-primary w-full"
                onClick={() => navigate("/checkout")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4 text-primary" />
                Free Shipping
              </div>
              <p className="text-muted-foreground text-xs">
                Delivery in 2-3 business days for orders above ₹500
              </p>
            </div>
          </div>

          {/* Bulk Discount Info */}
          <div className="card-product p-4 space-y-3">
            <h3 className="font-medium text-sm">💡 Bulk Discount Tiers</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>10-49 units</span>
                <span className="text-accent font-medium">15% off</span>
              </div>
              <div className="flex justify-between">
                <span>50+ units</span>
                <span className="text-accent font-medium">25% off</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Discounts applied per product automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
