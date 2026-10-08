import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p>
            When you visit Smart Cleaners or make a purchase, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Personal Information:</strong> Name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</li>
            <li><strong>Device Information:</strong> Web browser version, IP address, time zone, cookie information, and how you interact with the Site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>
            We use the personal information we collect to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide products or services to you to fulfill our contract.</li>
            <li>Process your payment information (via Cashfree payment gateway).</li>
            <li>Arrange for shipping and provide you with invoices and/or order confirmations.</li>
            <li>Communicate with you and screen our orders for potential risk or fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Sharing Personal Information</h2>
          <p>
            We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example, we use Cashfree for securely processing your payments. We may also share your Personal Information to comply with applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
          <p>
            If you are a resident of certain regions, you have the right to access the Personal Information we hold about you, to port it to a new service, and to ask that your Personal Information be corrected, updated, or erased.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@smartcleaners.com.
          </p>
        </section>
      </div>
    </div>
  );
};
