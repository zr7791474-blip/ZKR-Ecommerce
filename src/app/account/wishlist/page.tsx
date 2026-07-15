'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlistStore } from '@/stores/wishlist.store';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="relative max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-primary animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Wishlist</h1>
        <p className="text-muted-foreground mt-1">Loading your saved items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Wishlist</h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Save your favorite products and find them here later.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Wishlist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="relative space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="border-border/60">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-secondary/60 border border-border/60 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-warm font-semibold mt-0.5">
                  {formatPrice(item.price)}
                </p>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${item.slug}`}>
                  View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.name} from wishlist`}
                className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
