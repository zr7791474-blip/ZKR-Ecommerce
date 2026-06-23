import Link from 'next/link';
import { Shirt, Laptop, Home, Dumbbell, BookOpen, Baby, Watch, Sparkles } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Shop by Category</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover exactly what you need across our carefully curated collections.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 hover:shadow-soft"
          >
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{cat.count} products</span>
                <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}