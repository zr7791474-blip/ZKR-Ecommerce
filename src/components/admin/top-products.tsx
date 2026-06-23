import { Package } from 'lucide-react';

const topProducts = [
  { name: 'iPhone 15 Pro Max', sales: 142, revenue: '$170,258' },
  { name: 'MacBook Pro 16"', sales: 89, revenue: '$222,411' },
  { name: 'AirPods Pro 2', sales: 234, revenue: '$58,266' },
  { name: 'Nike Air Max 270', sales: 178, revenue: '$26,700' },
  { name: 'Sony WH-1000XM5', sales: 95, revenue: '$37,905' },
];

export function TopProducts() {
  return (
    <div className="space-y-4">
      {topProducts.map((product, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sales} sales</p>
          </div>
          <p className="text-sm font-semibold">{product.revenue}</p>
        </div>
      ))}
    </div>
  );
}