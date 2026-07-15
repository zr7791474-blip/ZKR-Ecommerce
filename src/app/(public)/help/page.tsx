import Link from 'next/link';
import { HelpCircle, Truck, RotateCcw, Package, Mail, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Help Center — ZKR E-Commerce',
  description: 'Find answers about orders, shipping, returns, and how to contact support.',
};

const topics = [
  { href: '/faq', title: 'FAQ', desc: 'Answers to common questions', icon: HelpCircle },
  { href: '/shipping', title: 'Shipping Info', desc: 'Delivery times and costs', icon: Truck },
  { href: '/returns', title: 'Returns & Exchanges', desc: 'How to return an item', icon: RotateCcw },
  { href: '/track-order', title: 'Track Order', desc: 'Check your order status', icon: Package },
  { href: '/contact', title: 'Contact Support', desc: 'Get in touch with our team', icon: Mail },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground">How can we help you today?</p>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href}>
            <Card className="border-border/60 hover:border-primary/30 transition-colors duration-300" hover>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="h-11 w-11 rounded-xl bg-secondary/60 border border-border/60 flex items-center justify-center shrink-0">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{topic.title}</p>
                  <p className="text-sm text-muted-foreground">{topic.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
