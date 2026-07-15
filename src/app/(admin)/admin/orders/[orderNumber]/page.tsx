import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, MapPin, Package } from 'lucide-react';

import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/ecommerce/order-status-badge';

export const metadata = {
  title: 'Order Details — Admin — ZKR E-Commerce',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
    },
  });

  if (!order) notFound();

  const shippingAddress = order.shippingAddress as Record<string, any> | null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(order.items as any[]).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                    {item.product?.images?.[0]?.url && (
                      <Image src={item.product.images[0].url} alt={item.name} fill className="object-cover" />
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="text-foreground font-medium">{order.user?.name || 'Guest'}</p>
              <p>{order.user?.email}</p>
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-0.5">
                {shippingAddress.fullName && <p className="text-foreground font-medium">{shippingAddress.fullName}</p>}
                {shippingAddress.address && <p>{shippingAddress.address}</p>}
                {(shippingAddress.city || shippingAddress.postalCode) && (
                  <p>{[shippingAddress.city, shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
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
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-warm">{formatPrice(Number(order.total))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
