import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to Smart Cleaners. These Terms and Conditions govern your use of our website and services.
            By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Products and Services</h2>
          <p>
            Smart Cleaners provides cleaning products and related services. All products are subject to availability, and we reserve the right to limit the quantities of any products or services that we offer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Payments and Pricing</h2>
          <p>
            All prices are subject to change without notice. We reserve the right to modify or discontinue any product or service at any time. We use Cashfree as our secure payment gateway. By proceeding with a purchase, you agree to their payment processing terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p>
            Smart Cleaners shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our products or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  );
};
