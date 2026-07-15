'use client';

import { useState } from 'react';
import { Package, Search, Loader2, Check, Truck, Home, XCircle } from 'lucide-react';

import { trackOrderPublic } from '@/services/order.service';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/ecommerce/order-status-badge';

type TrackedOrder = Awaited<ReturnType<typeof trackOrderPublic>>;

const TIMELINE_STAGES = [
  { key: 'PENDING', label: 'Order Placed', icon: Package },
  { key: 'CONFIRMED', label: 'Payment Confirmed', icon: Check },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

function OrderTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED' || status === 'REFUNDED' || status === 'FAILED') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
        <XCircle className="w-5 h-5 text-accent shrink-0" />
        <p className="text-sm text-foreground">
          This order was {status.toLowerCase()} and is not progressing through fulfillment.
        </p>
      </div>
    );
  }

  const currentIndex = TIMELINE_STAGES.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start justify-between">
      {TIMELINE_STAGES.map((stage, i) => {
        const done = currentIndex >= 0 && i <= currentIndex;
        const isLast = i === TIMELINE_STAGES.length - 1;

        return (
          <div key={stage.key} className="flex-1 flex flex-col items-center text-center relative">
            {!isLast && (
              <div
                className={`absolute top-4 left-1/2 w-full h-[2px] ${done && i < currentIndex ? 'bg-primary' : 'bg-border'}`}
              />
            )}
            <div
              className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                done ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'
              }`}
            >
              <stage.icon className="w-3.5 h-3.5" />
            </div>
            <span className={`mt-2 text-[11px] font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await trackOrderPublic(orderNumber.trim(), email.trim());
      setOrder(result);
    } catch (err: any) {
      setError(err?.message || 'No matching order found for that order number and email.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedDelivery = order
    ? new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Track Your Order</h1>
        <p className="text-muted-foreground">
          Enter your order number and the email used at checkout.
        </p>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Order Number</Label>
              <Input
                placeholder="e.g. ORD-1234567890"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track Order
                </>
              )}
            </Button>
          </form>

          {error && (
            <p className="text-sm text-accent text-center mt-4">{error}</p>
          )}
        </CardContent>
      </Card>

      {order && (
        <Card className="border-border/60 mt-6">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-foreground">Order #{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Placed on{' '}
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <OrderTimeline status={order.status} />

            <div className="grid sm:grid-cols-2 gap-3">
              {order.trackingNumber && (
                <div className="rounded-xl bg-secondary/50 border border-border/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Tracking Number</p>
                  <p className="text-sm font-medium text-foreground">{order.trackingNumber}</p>
                </div>
              )}
              {estimatedDelivery && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <div className="rounded-xl bg-secondary/50 border border-border/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                  <p className="text-sm font-medium text-foreground">
                    {estimatedDelivery.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/90">
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPrice(Number(item.total))}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-warm">{formatPrice(Number(order.total))}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

