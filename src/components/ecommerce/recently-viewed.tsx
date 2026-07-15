'use client';

import { useEffect } from 'react';
import { useRecentlyViewed, type RecentlyViewedItem } from '@/hooks/use-recently-viewed';
import { ProductRecommendations } from '@/components/ecommerce/product-recommendations';

/**
 * Invisible — drop this on a product detail page to record the view.
 * Split from <RecentlyViewed> so the tracker can sit next to the product
 * data without every page that wants to *display* the row needing to also
 * track a view.
 */
export function RecentlyViewedTracker({ item }: { item: RecentlyViewedItem }) {
  const { trackView } = useRecentlyViewed();

  useEffect(() => {
    trackView(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  return null;
}

/**
 * Displays the visitor's recently viewed products (client-only, from
 * localStorage). Optionally excludes the current product so a product page
 * doesn't show itself in its own "recently viewed" row.
 */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const filtered = excludeId ? items.filter((i) => i.id !== excludeId) : items;

  if (filtered.length === 0) return null;

  const products = filtered.map((i) => ({
    id: i.id,
    name: i.name,
    slug: i.slug,
    price: i.price,
    compareAtPrice: i.compareAtPrice ?? null,
    images: [{ url: i.image }],
    category: i.category ?? null,
  }));

  return (
    <ProductRecommendations
      title="Recently Viewed"
      subtitle="Pick up where you left off"
      products={products}
      compact
    />
  );
}
