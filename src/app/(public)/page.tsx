import type { Metadata } from "next";
import Link from 'next/link';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ecommerce/product-card';
import { HeroShowcase } from '@/components/ecommerce/hero-showcase';
import { getFeaturedProducts, getNewArrivals, getBestSellers } from '@/services/product.service';
import { getDemoProducts, pickDemoProducts } from '@/lib/demo-products';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export const metadata: Metadata = {
  title: "ZKR E-Commerce — Premium E-Commerce",

  description:
    "Shop the latest products with fast shipping and secure payments.",

  openGraph: {
    title: "ZKR E-Commerce — Premium E-Commerce",
    description:
      "Shop the latest products with fast shipping and secure payments.",
    images: ["/og-image.jpg"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZKR E-Commerce — Premium E-Commerce",
    description:
      "Shop the latest products with fast shipping and secure payments.",
    images: ["/og-image.jpg"],
  },
};

export default async function HomePage() {
  const [featured, newArrivals, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
  ]);

  // Hero showcase: real featured products first, then the full demo catalog
  // (generated from every image in public/products/) so the rotation always
  // has every available product image, even before the catalog is fully
  // populated in the database.
  const showcaseProducts = [...(featured as any[]), ...getDemoProducts()];

  // Trending/Best Sellers row: real best-selling products first, padded
  // with the shared demo catalog (excluding anything already shown above)
  // so the section is never sparse on a freshly-seeded database.
  const shownIds = new Set([...featured, ...newArrivals].map((p: any) => p.id));
  const trendingProducts = [
    ...(bestSellers as any[]),
    ...pickDemoProducts(Math.max(0, 8 - bestSellers.length), {
      excludeIds: Array.from(shownIds),
    }),
  ].slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/[0.07] dark:bg-primary/[0.12] blur-[140px]" />
        <div className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-warm/[0.12] dark:bg-warm/[0.1] blur-[120px] animate-float" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-accent/[0.05] dark:bg-primary/[0.18] blur-[120px]" />

        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-36 relative">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] backdrop-blur-md px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              New Collection 2026
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Shop the Future,
              <br />
              <span className="gradient-text">Today</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover premium products curated for modern living. Fast shipping, secure payments, and exceptional quality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button size="xl" asChild>
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              {[
                { icon: Truck, label: 'Free shipping $100+' },
                { icon: Shield, label: 'Secure payments' },
                { icon: Star, label: 'Trusted by 10k+ customers' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-3.5 py-2 text-xs text-muted-foreground"
                >
                  <badge.icon className="w-3.5 h-3.5 text-primary" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic rotating product showcase */}
          <div className="relative mt-16 max-w-4xl mx-auto">
            <HeroShowcase products={showcaseProducts} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-foreground/[0.06]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: Shield, title: 'Secure Payments', desc: '256-bit SSL encryption' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group text-center space-y-3 rounded-2xl border border-transparent hover:border-foreground/[0.08] hover:bg-foreground/[0.02] p-5 transition-all duration-300"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
                <p className="text-muted-foreground mt-1.5">Hand-picked just for you</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?featured=true">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {featured.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[28px] overflow-hidden border border-foreground/[0.08] bg-gradient-to-br from-primary via-primary to-[#0F172A] p-12 md:p-16 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(252,179,79,0.2),transparent_55%)]" />
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="relative max-w-2xl space-y-5">
              <Badge variant="glass" size="lg" className="border-white/20 bg-white/10 text-white">Limited Time</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">Summer Sale</h2>
              <p className="text-lg md:text-xl text-white/80">
                Up to 50% off on selected items. Don't miss out!
              </p>
              <Button size="lg" className="bg-white text-[#0F172A] hover:bg-white/90" asChild>
                <Link href="/products?sale=true">
                  Shop the Sale <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">New Arrivals</h2>
                <p className="text-muted-foreground mt-1.5">Fresh picks this week</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?new=true">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {newArrivals.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending / Best Sellers -- real best-selling products first,
          padded with the shared demo catalog so the row is never sparse */}
      {trendingProducts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
                <p className="text-muted-foreground mt-1.5">What everyone's buying this week</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?sort=bestselling">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {trendingProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 border-y border-foreground/[0.06]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-2">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Verified Buyer', rating: 5, text: 'Amazing quality and fast shipping! Will definitely shop here again.' },
              { name: 'Michael Chen', role: 'Verified Buyer', rating: 5, text: 'The customer service is outstanding. They went above and beyond.' },
              { name: 'Emily Davis', role: 'Verified Buyer', rating: 5, text: 'Best online shopping experience I have had. Highly recommend!' },
            ].map((testimonial, i) => (
              <Card key={i} hover className="bg-foreground/[0.03] backdrop-blur-sm p-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warm text-warm" />
                    ))}
                  </div>
                  <p className="text-foreground/90">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="container mx-auto px-4 text-center space-y-6 relative">
          <h2 className="text-4xl font-bold text-foreground">Ready to Start Shopping?</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover products you'll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button size="xl" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}