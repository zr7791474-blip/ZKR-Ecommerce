import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  PROCESSING: 'warning',
  SHIPPED: 'default',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

export function RecentOrders({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/orders/${order.orderNumber}`}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {order.user.name?.[0] || order.user.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">{order.user.name || order.user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">{formatPrice(Number(order.total))}</p>
            <Badge variant={statusColors[order.status] as any} className="text-xs">
              {order.status}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}