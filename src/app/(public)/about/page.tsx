import { Shield, Truck, Award, Leaf } from 'lucide-react';

const stats = [
  { label: 'Happy Customers', value: '50K+' },
  { label: 'Products Sold', value: '1M+' },
  { label: 'Countries Shipped', value: '120+' },
  { label: 'Years of Excellence', value: '10+' },
];

const values = [
  { icon: Shield, title: 'Uncompromising Quality', description: 'Every product is rigorously tested to meet our premium standards.' },
  { icon: Truck, title: 'Fast & Reliable Shipping', description: 'We partner with the best logistics providers to ensure your order arrives on time.' },
  { icon: Award, title: 'Customer First', description: 'Our dedicated support team is available 24/7 to assist you with any needs.' },
  { icon: Leaf, title: 'Sustainable Practices', description: 'We are committed to eco-friendly packaging and sustainable sourcing.' },
];

export const metadata = {
  title: 'About Us — ZKR',
  description: 'Learn about ZKR, our mission, and our commitment to premium e-commerce.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Redefining the Way You <span className="gradient-text">Shop Online</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Founded in 2016, ZKR started with a simple mission: to provide a curated selection of premium products with an unparalleled shopping experience. We believe that quality, convenience, and trust should be the foundation of every transaction.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-6 rounded-xl bg-muted/50 border border-border">
            <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="p-6 rounded-xl border border-border bg-card hover:shadow-soft transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}