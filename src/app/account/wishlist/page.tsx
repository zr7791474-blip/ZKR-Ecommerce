'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/wishlist.store';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);

  // ⏳ wait for zustand hydration
  if (!hasHydrated) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <h1 className="text-3xl font-bold">Your Wishlist</h1>

          <p className="text-muted-foreground">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  // ❌ empty state
  if (items.length === 0) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold">Your Wishlist</h1>

          <p className="text-muted-foreground">
            Save your favorite products and find them here later.
          </p>

          <Button asChild>
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // ✅ filled wishlist
  return (
    <main className="min-h-screen container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border rounded-lg p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-muted-foreground">
                ${item.price}
              </p>

              <Link
                href={`/products/${item.slug}`}
                className="text-blue-500 text-sm"
              >
                View Product
              </Link>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}