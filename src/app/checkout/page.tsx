'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = items.length > 0 ? 10 : 0;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          email: data.email,
        }),
      });

      const result = await res.json();

      if (result?.url) {
        clearCart(); // clear BEFORE redirect (safe UX)
        window.location.href = result.url; // Stripe hosted checkout
      } else {
        throw new Error('Stripe session failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Your cart is empty.
        </p>

        <button
          onClick={() => router.push('/products')}
          className="mt-6 px-6 py-2 bg-black text-white rounded-md"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: FORM */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <input
                {...register('fullName')}
                placeholder="Full Name"
                className="w-full border rounded-md p-2"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">
                  {errors.fullName.message}
                </p>
              )}

              <input
                {...register('email')}
                placeholder="Email"
                className="w-full border rounded-md p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}

              <input
                {...register('phone')}
                placeholder="Phone"
                className="w-full border rounded-md p-2"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">
                  {errors.phone.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <input
                {...register('address')}
                placeholder="Address"
                className="w-full border rounded-md p-2"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">
                  {errors.address.message}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    {...register('city')}
                    placeholder="City"
                    className="w-full border rounded-md p-2"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register('postalCode')}
                    placeholder="Postal Code"
                    className="w-full border rounded-md p-2"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-black/90 disabled:opacity-50"
          >
            {loading ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
          </button>
        </form>
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-xs"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="border-t pt-3 flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              🔒 Secure Stripe Checkout
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}