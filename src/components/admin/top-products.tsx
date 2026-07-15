import { Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export type TopProductRow = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
};

export function TopProducts({ products }: { products: TopProductRow[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No sales data yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sales} sold</p>
          </div>
          <p className="text-sm font-semibold shrink-0">{formatPrice(product.revenue)}</p>
        </div>
      ))}
    </div>
  );
}
