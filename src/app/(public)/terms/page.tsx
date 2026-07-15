import { LegalLayout } from '@/components/legal/legal-layout';

export const metadata = {
  title: 'Terms of Service — ZKR E-Commerce',
  description: 'The terms and conditions governing your use of ZKR E-Commerce.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="July 2026"
      intro="These Terms of Service ('Terms') govern your access to and use of the ZKR E-Commerce website and services. By creating an account or placing an order, you agree to these Terms."
      sections={[
        {
          heading: '1. Using Our Service',
          body: (
            <p>You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account and place orders. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
          ),
        },
        {
          heading: '2. Orders & Pricing',
          body: (
            <>
              <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order, including in cases of suspected fraud, pricing errors, or stock unavailability.</p>
              <p>Prices are listed in USD and may change at any time, but changes will not affect orders already confirmed.</p>
            </>
          ),
        },
        {
          heading: '3. Payment',
          body: (
            <p>Payment is processed securely at checkout through Stripe. By placing an order, you authorize us to charge your selected payment method for the total order amount, including applicable taxes and shipping.</p>
          ),
        },
        {
          heading: '4. Shipping & Delivery',
          body: (
            <p>Estimated delivery times are provided at checkout and are not guaranteed. Risk of loss and title for items pass to you upon delivery to the shipping carrier. See our <a href="/shipping" className="text-primary hover:underline">Shipping Info</a> page for details.</p>
          ),
        },
        {
          heading: '5. Returns & Refunds',
          body: (
            <p>Eligible items may be returned in accordance with our <a href="/returns" className="text-primary hover:underline">Returns Policy</a>. Refunds are issued to the original payment method once a return is received and inspected.</p>
          ),
        },
        {
          heading: '6. Intellectual Property',
          body: (
            <p>All content on this site — including product images, text, logos, and design — is owned by or licensed to ZKR E-Commerce and may not be reproduced without permission.</p>
          ),
        },
        {
          heading: '7. Limitation of Liability',
          body: (
            <p>To the fullest extent permitted by law, ZKR E-Commerce is not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          ),
        },
        {
          heading: '8. Changes to These Terms',
          body: (
            <p>We may update these Terms from time to time. Continued use of our services after changes take effect constitutes acceptance of the revised Terms.</p>
          ),
        },
        {
          heading: '9. Contact Us',
          body: (
            <p>Questions about these Terms can be directed to our <a href="/contact" className="text-primary hover:underline">support team</a>.</p>
          ),
        },
      ]}
    />
  );
}
