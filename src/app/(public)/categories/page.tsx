import Link from 'next/link';
import { ArrowUpRight, Shirt, Laptop, Home, Dumbbell, BookOpen, Baby, Watch, Sparkles } from 'lucide-react';

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: Laptop, count: 124, description: 'Latest gadgets and tech' },
  { name: 'Fashion', slug: 'fashion', icon: Shirt, count: 312, description: 'Trendy clothing and accessories' },
  { name: 'Home & Garden', slug: 'home-garden', icon: Home, count: 89, description: 'Decor and essentials' },
  { name: 'Sports', slug: 'sports', icon: Dumbbell, count: 156, description: 'Gear for every athlete' },
  { name: 'Books', slug: 'books', icon: BookOpen, count: 420, description: 'Bestsellers and classics' },
  { name: 'Baby & Kids', slug: 'baby-kids', icon: Baby, count: 78, description: 'Safe and fun for little ones' },
  { name: 'Watches', slug: 'watches', icon: Watch, count: 45, description: 'Premium timepieces' },
  { name: 'Beauty', slug: 'beauty', icon: Sparkles, count: 210, description: 'Skincare and cosmetics' },
];

export const metadata = {
  title: 'Categories — ZKR',
  description: 'Explore our wide range of product categories.',
};

export default function CategoriesPage() {
  return (
    <div className="relative container mx-auto px-4 py-16 md:py-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-primary/[0.08] blur-[120px] pointer-events-none" />

      <div className="relative mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">
          Shop by Category
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover exactly what you need across our carefully curated collections.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-foreground/[0.14] via-foreground/[0.04] to-transparent hover:from-primary/50 hover:via-primary/10 transition-all duration-300"
          >
            <div className="relative h-full rounded-[23px] p-6 bg-muted/80 backdrop-blur-xl border border-foreground/[0.04] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow">
              {/* preview glow / mini image */}
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/[0.15] blur-2xl group-hover:bg-primary/[0.3] transition-colors duration-300" />

              <div className="relative flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
                  <cat.icon className="w-6 h-6" />
                </div>

                <h3 className="font-semibold text-lg mb-1.5 text-foreground">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{cat.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-foreground/[0.06] border border-foreground/[0.08] text-muted-foreground">
                    {cat.count} products
                  </span>
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
