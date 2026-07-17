'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock } from 'lucide-react';

import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';
import { pickDemoProducts } from '@/lib/demo-products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductRecommendations } from '@/components/ecommerce/product-recommendations';

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

  const shipping = items.length === 0 ? 0 : subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.15; // 15% simulated tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[400px] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-md"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">
            Your shopping cart is waiting to be filled with things you love.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm hover:shadow-premium hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/60 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-foreground line-clamp-1">{item.name}</h2>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="text-sm text-warm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ({formatPrice(item.price)} each)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-2.5 w-fit rounded-full border border-border/60 bg-secondary/40 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="min-w-[24px] text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2.5 text-sm">
              {subtotal < 100 && (
                <div className="mb-1 space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Add <span className="text-warm font-medium">{formatPrice(100 - subtotal)}</span> more for free shipping
                  </p>
                  <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-warm transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">{formatPrice(shipping)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated tax</span>
                <span className="text-foreground">{formatPrice(tax)}</span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-warm">{formatPrice(total)}</span>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
                <Lock className="w-3 h-3" />
                Secure checkout via Stripe
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <ProductRecommendations
          title="You might also like"
          products={pickDemoProducts(4, {
            excludeIds: items.map((i) => i.productId),
          })}
          compact
        />
      </div>
    </div>
  );
}
