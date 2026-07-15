import { FaqAccordion } from '@/components/legal/faq-accordion';

export const metadata = {
  title: 'FAQ — ZKR E-Commerce',
  description: 'Answers to frequently asked questions about orders, shipping, returns, and your account.',
};

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you can track it from the Track Order page using your order number and the email used at checkout, or from My Orders in your account if you\'re signed in.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard), plus PayPal, Apple Pay, and Google Pay through our secure Stripe checkout.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days. See our Shipping Info page for full details on delivery estimates and costs.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Most items can be returned within 30 days of delivery for a full refund, provided they are unused and in their original packaging. Visit our Returns page for step-by-step instructions.',
  },
  {
    question: 'Do I need an account to place an order?',
    answer: 'Yes — creating a free account lets us securely process your order, keep your order history in one place, and make returns and support easier.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot password?" to receive a secure reset link by email. The link expires after 1 hour for your security.',
  },
  {
    question: 'Can I change or cancel my order after placing it?',
    answer: 'If your order hasn\'t shipped yet, contact our support team as soon as possible and we\'ll do our best to accommodate changes or cancellation.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes. All payments are processed through Stripe, a PCI-compliant payment processor. We never store your full card details on our servers.',
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Can't find what you're looking for?{' '}
          <a href="/contact" className="text-primary hover:underline">Contact our support team</a>.
        </p>
      </div>

      <FaqAccordion items={faqs} />
    </div>
  );
}
