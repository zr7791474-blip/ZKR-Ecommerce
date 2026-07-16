import { LegalLayout } from '@/components/legal/legal-layout';

export const metadata = {
  title: 'Refund Policy — ZKR E-Commerce',
  description: 'How and when refunds are issued for ZKR E-Commerce orders.',
};

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="July 2026"
      intro="This page explains how refunds work once a return is approved. For eligibility and how to start a return, see our Returns & Exchanges page."
      sections={[
        {
          heading: '1. When Refunds Are Issued',
          body: (
            <p>Refunds are issued once your returned item has been received and inspected by our warehouse. You'll receive an email confirming your refund has been processed.</p>
          ),
        },
        {
          heading: '2. Refund Method',
          body: (
            <p>Refunds are always returned to the original payment method used at checkout. We're unable to issue refunds to a different card, account, or as store credit unless required by local law.</p>
          ),
        },
        {
          heading: '3. Refund Timing',
          body: (
            <p>Once processed, refunds typically appear on your statement within 5-7 business days, though the exact timing depends on your bank or card issuer.</p>
          ),
        },
        {
          heading: '4. Shipping Costs',
          body: (
            <p>Original shipping charges are non-refundable unless the return is due to our error (wrong or defective item). Return shipping costs are the customer's responsibility unless otherwise stated.</p>
          ),
        },
        {
          heading: '5. Partial Refunds',
          body: (
            <p>Items returned outside the standard return window, or showing signs of use beyond inspection, may be eligible for a partial refund at our discretion.</p>
          ),
        },
        {
          heading: '6. Questions',
          body: (
            <p>If your refund hasn't appeared within the expected timeframe, please <a href="/contact" className="text-primary hover:underline">contact our support team</a> with your order number.</p>
          ),
        },
      ]}
    />
  );
}
