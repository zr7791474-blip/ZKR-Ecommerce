import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/ecommerce/order-status-badge';

export const metadata = {
  title: 'Orders — Admin — ZKR E-Commerce',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">All customer orders, most recent first.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {(orders as any[]).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderNumber}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">#{order.orderNumber}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {order.user?.name || order.user?.email} · {order._count.items} items ·{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="font-semibold text-foreground shrink-0">
                  {formatPrice(Number(order.total))}
                </p>

                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
