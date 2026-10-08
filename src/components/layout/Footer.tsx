import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-8 mt-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Smart Cleaners</h3>
            <p className="text-muted-foreground text-sm">
              Providing premium cleaning products for all your needs. Quality guaranteed.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal & Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-muted-foreground hover:text-primary transition-colors">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Delivery Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Smart Cleaners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
