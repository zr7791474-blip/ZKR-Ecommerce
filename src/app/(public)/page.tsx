import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ecommerce/product-card';
import { getFeaturedProducts, getNewArrivals, getBestSellers } from '@/services/product.service';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export const metadata: Metadata = {
  title: "ZKR Store — Premium E-Commerce",

  description:
    "Shop the latest products with fast shipping and secure payments.",

  openGraph: {
    title: "ZKR Store — Premium E-Commerce",
    description:
      "Shop the latest products with fast shipping and secure payments.",
    images: ["/og-image.jpg"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZKR Store — Premium E-Commerce",
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-1.5">
               New Collection 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Shop the Future,
              <br />
              <span className="gradient-text">
                Today
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium products curated for modern living. Fast shipping, secure payments, and exceptional quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="xl" asChild>
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping $100+</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: Shield, title: 'Secure Payments', desc: '256-bit SSL encryption' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-muted-foreground mt-1">Hand-picked just for you</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?featured=true">
                  View all <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-purple-600 p-12 md:p-16 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative max-w-2xl space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Limited Time
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">Summer Sale</h2>
              <p className="text-xl text-white/90">
                Up to 50% off on selected items. Don't miss out!
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products?sale=true">
                  Shop the Sale <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">Fresh picks this week</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?new=true">
                  View all <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-2">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Verified Buyer', rating: 5, text: 'Amazing quality and fast shipping! Will definitely shop here again.' },
              { name: 'Michael Chen', role: 'Verified Buyer', rating: 5, text: 'The customer service is outstanding. They went above and beyond.' },
              { name: 'Emily Davis', role: 'Verified Buyer', rating: 5, text: 'Best online shopping experience I have had. Highly recommend!' },
            ].map((testimonial, i) => (
              <Card key={i} className="backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Start Shopping?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover products you'll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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