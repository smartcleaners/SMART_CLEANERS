import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X, AlarmClockOff, User2Icon, Menu } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
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
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 hover:bg-muted transition-colors rounded"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
                <img src="/logo.png" alt="Smart Cleaners" className="h-20 w-20 object-contain" />
              </Link>
            </div>
          </div>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Home</Link>
            <Link to="/categories" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Categories</Link>
            <Link to="/about" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">About Us</Link>
            <Link to="/combos" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Combos</Link>
            <Link to="/bulk-orders" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Bulk Orders</Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <div ref={searchRef} className="relative">
              <button
                title='Search products'
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-muted transition-colors rounded"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute top-16 right-0 w-[calc(100vw-2rem)] sm:w-80 bg-card border border-border rounded-lg shadow-lg z-50">
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
            
            <Link
              to="/account"
              className="relative p-2 hover:bg-muted transition-colors rounded"
            >
              <User2Icon className="h-5 w-5" />
            </Link>

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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card border-r border-border shadow-lg p-6 flex flex-col gap-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 hover:bg-muted rounded transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Categories</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">About Us</Link>
              <Link to="/combos" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Combos</Link>
              <Link to="/bulk-orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Bulk Orders</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};