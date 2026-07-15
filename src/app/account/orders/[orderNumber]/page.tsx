import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Package } from 'lucide-react';

import { getOrder } from '@/services/order.service';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/ecommerce/order-status-badge';

export const metadata = {
  title: 'Order Details | ZKR E-Commerce',
};

export default async function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  let order;

  try {
    order = await getOrder(params.orderNumber);
  } catch {
    notFound();
  }

  const shippingAddress = order.shippingAddress as Record<string, any> | null;

  return (
    <div className="relative max-w-4xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <Link
        href="/account/orders"
        className="relative inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to orders
      </Link>

      <div className="relative flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
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

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-secondary/60 border border-border/60 shrink-0">
                    {item.product?.images?.[0]?.url && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground shrink-0">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-0.5">
                {shippingAddress.fullName && <p className="text-foreground font-medium">{shippingAddress.fullName}</p>}
                {shippingAddress.address && <p>{shippingAddress.address}</p>}
                {(shippingAddress.city || shippingAddress.postalCode) && (
                  <p>{[shippingAddress.city, shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
                )}
                {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">{formatPrice(Number(order.shipping))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="text-foreground">{formatPrice(Number(order.tax))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-warm">{formatPrice(Number(order.total))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
