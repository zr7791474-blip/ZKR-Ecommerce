import { RotateCcw, PackageCheck, Banknote } from 'lucide-react';

export const metadata = {
  title: 'Returns — ZKR E-Commerce',
  description: 'How to return or exchange an item purchased from ZKR E-Commerce.',
};

const steps = [
  { icon: PackageCheck, title: 'Start your return', desc: 'Go to My Orders and select the item you\'d like to return, within 30 days of delivery.' },
  { icon: RotateCcw, title: 'Pack it up', desc: 'Repack the item in its original packaging with all tags and accessories included.' },
  { icon: Banknote, title: 'Get refunded', desc: 'Once we receive and inspect your return, your refund is issued to the original payment method within 5-7 business days.' },
];

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Returns & Exchanges</h1>
        <p className="text-muted-foreground leading-relaxed">
          Not quite right? Most items can be returned within 30 days of delivery for a full refund.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-sm font-bold text-primary">
              {i + 1}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            To be eligible for a return, items must be unused, in their original condition, and returned within 30 days of the delivery date. Some items, like final-sale or personal care products, are not eligible for return.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once your return is received and inspected, we&apos;ll notify you by email and process your refund to the original payment method. Refunds typically appear within 5-7 business days, depending on your bank.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Exchanges</h2>
          <p className="text-muted-foreground leading-relaxed">
            We currently process exchanges as a return followed by a new order, so you get the right item as quickly as possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Need Help?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Start a return from <a href="/account/orders" className="text-primary hover:underline">My Orders</a>, or <a href="/contact" className="text-primary hover:underline">contact our support team</a> if you need assistance.
          </p>
        </section>
      </div>
    </div>
  );
}
