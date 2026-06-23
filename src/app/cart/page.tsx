'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = items.length > 0 ? 10 : 0; // simple flat rate (safe placeholder)
  const tax = subtotal * 0.15; // 15% simulated tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground mt-2">
          Your shopping cart is empty.
        </p>

        <Link
          href="/products"
          className="mt-6 px-6 py-2 bg-black text-white rounded-md"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border p-4 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="font-medium">{item.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-2 border rounded"
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY (PROFESSIONAL PAYMENT SECTION) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                🔒 Secure checkout (payment integration coming soon)
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Link
                href="/checkout"
                className="w-full bg-black text-white text-center py-2 rounded-md hover:bg-black/90 transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full text-center text-sm text-muted-foreground hover:underline"
              >
                Continue Shopping
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}