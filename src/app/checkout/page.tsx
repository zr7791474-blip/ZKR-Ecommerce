'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Loader2,
  ShieldCheck,
  Lock,
  Truck,
  BadgeCheck,
  HeadphonesIcon,
  ArrowRight,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';
import { toast } from 'sonner';

import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';
import { pickDemoProducts } from '@/lib/demo-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProductRecommendations } from '@/components/ecommerce/product-recommendations';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const steps = [
  { label: 'Cart', done: true },
  { label: 'Details', done: false, current: true },
  { label: 'Payment', done: false },
  { label: 'Confirmation', done: false },
];

const paymentIcons = [
  { Icon: SiVisa, label: 'Visa' },
  { Icon: SiMastercard, label: 'Mastercard' },
  { Icon: SiPaypal, label: 'PayPal' },
  { Icon: SiApplepay, label: 'Apple Pay' },
  { Icon: SiGooglepay, label: 'Google Pay' },
];

const trustItems = [
  { icon: Lock, label: '256-bit SSL Secure' },
  { icon: ShieldCheck, label: 'Money Back Guarantee' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: HeadphonesIcon, label: '24/7 Support' },
];

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = items.length === 0 ? 0 : subtotal >= 100 ? 0 : 10;
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

      if (res.ok && result?.url) {
        clearCart(); // clear BEFORE redirect (safe UX)
        window.location.href = result.url; // Stripe hosted checkout
      } else {
        toast.error(result?.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Add a few things you love and come back to check out.
          </p>
          <Button size="lg" className="mt-6" onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative mb-8 md:mb-10">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Almost there — review your details before secure payment.
        </p>
      </div>

      {/* PROGRESS INDICATOR */}
      <div className="relative flex items-center mb-10 md:mb-12 max-w-2xl">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors duration-300 ${
                  step.done
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step.current
                    ? 'border-warm text-warm bg-warm/10'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {step.done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  step.current ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 mb-5 rounded-full transition-colors duration-300 ${
                  step.done ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input
                    icon={<User className="w-4 h-4" />}
                    {...register('fullName')}
                    placeholder="Jane Doe"
                    error={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-accent">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      icon={<Mail className="w-4 h-4" />}
                      type="email"
                      {...register('email')}
                      placeholder="you@example.com"
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-xs text-accent">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input
                      icon={<Phone className="w-4 h-4" />}
                      {...register('phone')}
                      placeholder="+1 (555) 000-0000"
                      error={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-accent">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Street address</Label>
                  <Input
                    icon={<MapPin className="w-4 h-4" />}
                    {...register('address')}
                    placeholder="123 Market Street, Apt 4B"
                    error={!!errors.address}
                  />
                  {errors.address && (
                    <p className="text-xs text-accent">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input
                      icon={<Building2 className="w-4 h-4" />}
                      {...register('city')}
                      placeholder="San Francisco"
                      error={!!errors.city}
                    />
                    {errors.city && (
                      <p className="text-xs text-accent">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Postal code</Label>
                    <Input
                      icon={<Hash className="w-4 h-4" />}
                      {...register('postalCode')}
                      placeholder="94103"
                      error={!!errors.postalCode}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-accent">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TRUST STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustItems.map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center text-center gap-2 rounded-2xl border border-border/60 bg-secondary/40 p-4"
                >
                  <t.icon className="w-4 h-4 text-primary" />
                  <span className="text-[11px] text-muted-foreground leading-tight">{t.label}</span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? (
                'Redirecting to secure payment...'
              ) : (
                <>
                  Continue to Secure Payment
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              Payment is completed on Stripe&apos;s secure, PCI-compliant checkout page.
            </p>
          </form>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border/60 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground/90 line-clamp-1">
                      {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2.5 text-sm">
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
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-secondary/50 border border-border/60 px-3 py-2.5">
                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Estimated delivery in <span className="text-foreground font-medium">3–5 business days</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {paymentIcons.map(({ Icon, label }) => (
                  <div
                    key={label}
                    title={label}
                    className="h-8 w-12 rounded-lg bg-secondary/60 border border-border/60 flex items-center justify-center text-muted-foreground"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Lock className="w-3 h-3" />
                Secure Stripe Checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-14">
        <ProductRecommendations
          title="Complete your order"
          subtitle="A few things that pair well with your cart"
          products={pickDemoProducts(4, {
            excludeIds: items.map((i) => i.productId),
          })}
          compact
        />
      </div>
    </div>
  );
}
