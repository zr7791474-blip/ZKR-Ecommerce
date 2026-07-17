import { Truck, Clock, Globe, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping Info — ZKR E-Commerce',
  description: 'Shipping methods, delivery times, and costs for ZKR E-Commerce orders.',
};

const methods = [
  { name: 'Standard Shipping', time: '3-5 business days', cost: '$10, free over $100', icon: Truck },
  { name: 'Express Shipping', time: '1-2 business days', cost: '$25', icon: Clock },
  { name: 'International Shipping', time: '7-14 business days', cost: 'Calculated at checkout', icon: Globe },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Shipping Info</h1>
        <p className="text-muted-foreground leading-relaxed">
          Everything you need to know about how and when your order will arrive.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {methods.map((method) => (
          <div key={method.name} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <method.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{method.name}</h3>
            <p className="text-sm text-muted-foreground">{method.time}</p>
            <p className="text-sm text-warm font-medium mt-1">{method.cost}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Order Processing</h2>
          <p className="text-muted-foreground leading-relaxed">
            Orders are processed within 1 business day of payment confirmation. You&apos;ll receive an email confirmation as soon as your order ships, along with tracking information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Tracking Your Order</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once your order ships, you can follow its progress from the <a href="/track-order" className="text-primary hover:underline">Track Order</a> page, or from My Orders if you&apos;re signed in.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Delivery Issues</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your order is delayed, arrives damaged, or appears lost in transit, please <a href="/contact" className="text-primary hover:underline">contact our support team</a> and we&apos;ll make it right.
          </p>
        </section>

        <div className="flex items-center gap-2 rounded-xl bg-secondary/50 border border-border/60 px-4 py-3 text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          All shipments are insured against loss or damage in transit.
        </div>
      </div>
    </div>
  );
}
