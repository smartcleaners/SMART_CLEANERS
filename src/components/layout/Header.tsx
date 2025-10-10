import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import {  Product, firebaseService } from '@/lib/firebase';

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await firebaseService.getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const query = searchQuery.toLowerCase();
    
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );

    setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
    setLoading(false);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold text-primary">Smart Cleaners</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-md mx-auto hidden sm:block">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="w-full px-4 py-2 pl-10 pr-10 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              
              {searchQuery && (
                <button
                title='Clear search'
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}

              {/* Dropdown */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {loading && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading...
                      </div>
                    )}

                    {!loading && searchQuery && searchResults.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No products found
                      </div>
                    )}

                    {!loading && searchResults.length > 0 && (
                      <div className="divide-y divide-border">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full p-3 text-left hover:bg-muted transition-colors flex items-center gap-3 focus:outline-none focus:bg-muted"
                          >
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {product.description}
                              </p>
                              <p className="text-sm font-semibold text-primary mt-1">
                                ₹{product.salePrice ? product.salePrice : product.price}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!loading && searchQuery && searchResults.length > 0 && (
                      <div className="p-3 border-t border-border text-center">
                        <Link
                          to={`/search?q=${encodeURIComponent(searchQuery)}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          View all results
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile Search */}
            <div ref={searchRef} className="sm:hidden">
              <button
              title='Search products'
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-muted transition-colors rounded"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute top-16 right-0 left-0 m-4 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                      {searchQuery && (
                        <button
                        title='Clear search'
                          onClick={() => setSearchQuery('')}
                          className="p-1 hover:bg-muted transition-colors rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {loading && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading...
                      </div>
                    )}

                    {!loading && searchQuery && searchResults.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No products found
                      </div>
                    )}

                    {!loading && searchResults.length > 0 && (
                      <div className="divide-y divide-border">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full p-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
                          >
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-10 w-10 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {product.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-muted transition-colors rounded"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};