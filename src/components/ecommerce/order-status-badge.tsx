import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';

// Maps the Prisma OrderStatus enum to a customer-friendly label and color.
// CONFIRMED is the status the Stripe webhook sets once payment succeeds,
// so it's shown to customers as "Paid".
const STATUS_MAP: Record<
  string,
  { label: string; variant: BadgeProps['variant'] }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Paid', variant: 'success' },
  PROCESSING: { label: 'Processing', variant: 'secondary' },
  SHIPPED: { label: 'Shipped', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'accent' },
  REFUNDED: { label: 'Refunded', variant: 'outline' },
  FAILED: { label: 'Failed', variant: 'destructive' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] || { label: status, variant: 'outline' as const };

  return (
    <Badge variant={entry.variant} size="sm">
      {entry.label}
    </Badge>
  );
}
