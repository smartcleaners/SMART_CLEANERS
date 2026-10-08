import React from 'react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shipping & Delivery Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Order Processing Time</h2>
          <p>
            All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Domestic Shipping Rates and Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur due to unforeseen circumstances. Standard delivery usually takes 3 to 5 business days within the country.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. In-store Pickup</h2>
          <p>
            You can skip the shipping fees with free local pickup at our main warehouse. After placing your order and selecting local pickup at checkout, your order will be prepared and ready for pick up within 1 business day. We will send you an email when your order is ready along with instructions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. How do I check the status of my order?</h2>
          <p>
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Shipping to P.O. boxes</h2>
          <p>
            Some carriers have limitations around shipping to P.O. Boxes. If one of your items requires an physical address, we will contact you for an updated shipping address.
          </p>
        </section>
      </div>
    </div>
  );
};
