import React from 'react';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Return & Refund Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Returns</h2>
          <p>
            We have a 7-day return policy, which means you have 7 days after receiving your item to request a return.
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How to Start a Return</h2>
          <p>
            To start a return, you can contact us at returns@smartcleaners.com. If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Damages and Issues</h2>
          <p>
            Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Exceptions / Non-returnable Items</h2>
          <p>
            Certain types of items cannot be returned, like perishable goods, custom products, and personal care goods (including some specialized cleaning solutions). We also do not accept returns for hazardous materials, flammable liquids, or gases.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Refunds</h2>
          <p>
            We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method via Cashfree within 5-7 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
          </p>
        </section>
      </div>
    </div>
  );
};
