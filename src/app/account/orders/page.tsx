import Link from 'next/link';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

import { getOrders } from '@/services/order.service';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/ecommerce/order-status-badge';

export const metadata = {
  title: 'My Orders | ZKR E-Commerce',
};

export default async function OrdersPage() {
  // Real data only — middleware already guarantees a session exists here,
  // and getOrders() itself re-checks and scopes strictly to the current user.
  const { orders } = await getOrders(1, 20);

  return (
    <div className="relative max-w-4xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and review your order history.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">No orders yet</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              When you place an order, it will show up here.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link key={order.id} href={`/account/orders/${order.orderNumber}`}>
              <Card className="border-border/60 hover:border-primary/30 transition-colors duration-300" hover>
                <CardContent className="flex items-center gap-4 py-5">
                  <div className="h-11 w-11 rounded-xl bg-secondary/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">
                        #{order.orderNumber}
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {order._count.items} {order._count.items === 1 ? 'item' : 'items'} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-warm">
                      {formatPrice(Number(order.total))}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
