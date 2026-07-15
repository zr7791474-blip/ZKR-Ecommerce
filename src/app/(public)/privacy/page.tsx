import { LegalLayout } from '@/components/legal/legal-layout';

export const metadata = {
  title: 'Privacy Policy — ZKR E-Commerce',
  description: 'How ZKR E-Commerce collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="July 2026"
      intro="This Privacy Policy explains how ZKR E-Commerce ('we', 'us', 'our') collects, uses, and protects your personal information when you use our website and services."
      sections={[
        {
          heading: '1. Information We Collect',
          body: (
            <>
              <p>We collect information you provide directly, such as your name, email address, shipping and billing address, and payment details when you create an account, place an order, or contact support.</p>
              <p>We also automatically collect certain technical information, including your IP address, browser type, device information, and browsing behavior on our site, to help us improve the shopping experience.</p>
            </>
          ),
        },
        {
          heading: '2. How We Use Your Information',
          body: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To process and fulfill your orders, including payment and delivery</li>
              <li>To communicate with you about your account, orders, and support requests</li>
              <li>To send marketing communications, only if you have opted in</li>
              <li>To improve our products, services, and website performance</li>
              <li>To detect and prevent fraud or unauthorized activity</li>
            </ul>
          ),
        },
        {
          heading: '3. Payment Information',
          body: (
            <p>Payments are processed securely through Stripe. We do not store your full card details on our servers — all sensitive payment data is handled directly by our PCI-compliant payment processor.</p>
          ),
        },
        {
          heading: '4. Sharing Your Information',
          body: (
            <p>We do not sell your personal information. We share data only with trusted service providers who help us operate our business (payment processing, shipping carriers, email delivery), and only to the extent necessary for them to perform those services.</p>
          ),
        },
        {
          heading: '5. Cookies',
          body: (
            <p>We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how our site is used. See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for details.</p>
          ),
        },
        {
          heading: '6. Your Rights',
          body: (
            <p>You may access, update, or delete your personal information at any time from your account settings, or by contacting our support team. You may also opt out of marketing emails at any time using the unsubscribe link in any email.</p>
          ),
        },
        {
          heading: '7. Data Security',
          body: (
            <p>We use industry-standard security measures, including encrypted connections (HTTPS), hashed passwords, and access controls, to protect your information from unauthorized access, disclosure, or misuse.</p>
          ),
        },
        {
          heading: '8. Contact Us',
          body: (
            <p>If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact our support team</a>.</p>
          ),
        },
      ]}
    />
  );
}
