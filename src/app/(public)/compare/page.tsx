'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, Star, Trash2, X } from 'lucide-react';

import { useCompareStore } from '@/stores/compare.store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ComparePage() {
  const items = useCompareStore((state) => state.items);
  const removeItem = useCompareStore((state) => state.removeItem);
  const clear = useCompareStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Nothing to compare yet</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            Add products to compare using the scale icon on any product card.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const rows: Array<{ label: string; render: (item: (typeof items)[number]) => React.ReactNode }> = [
    { label: 'Price', render: (item) => <span className="font-semibold text-warm">{formatPrice(item.price)}</span> },
    { label: 'Category', render: (item) => item.category || '—' },
    { label: 'Brand', render: (item) => item.brand || '—' },
    {
      label: 'Rating',
      render: (item) =>
        item.averageRating ? (
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warm text-warm" /> {item.averageRating.toFixed(1)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      label: 'Stock',
      render: (item) =>
        typeof item.stock === 'number' ? (
          <span className={item.stock > 0 ? 'text-success' : 'text-accent'}>
            {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compare Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} of 4 products
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          <Trash2 className="w-4 h-4" /> Clear all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-4 min-w-[640px]" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
          {/* Product cards row */}
          <div />
          {items.map((item) => (
            <Card key={item.productId} className="border-border/60 relative">
              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.name} from compare`}
                className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.12] flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <CardContent className="pt-6 text-center">
                <div className="relative h-28 w-28 mx-auto rounded-xl overflow-hidden bg-muted mb-3">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 text-sm"
                >
                  {item.name}
                </Link>
              </CardContent>
            </Card>
          ))}

          {/* Attribute rows */}
          {rows.map((row) => (
            <Fragment key={row.label}>
              <div className="flex items-center px-2 text-sm font-medium text-muted-foreground">
                {row.label}
              </div>
              {items.map((item) => (
                <div
                  key={`${row.label}-${item.productId}`}
                  className="flex items-center justify-center px-3 py-4 rounded-xl border border-border/60 bg-card text-sm text-foreground"
                >
                  {row.render(item)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
