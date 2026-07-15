import { ProductCard } from '@/components/ecommerce/product-card';

type RecommendationsProps = {
  title: string;
  subtitle?: string;
  products: any[];
  compact?: boolean;
};

/**
 * Shared horizontal recommendations row — used for "Related Products",
 * "You might also like" (cart), and "Complete your order" (checkout).
 * Always fed from the same product source (real DB products merged with
 * the shared demo catalog) rather than a new hardcoded list per page.
 */
export function ProductRecommendations({
  title,
  subtitle,
  products,
  compact = false,
}: RecommendationsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="mb-4">
        <h2 className={compact ? 'text-lg font-bold text-foreground' : 'text-2xl font-bold text-foreground'}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div
        className={
          compact
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
            : 'grid grid-cols-2 md:grid-cols-4 gap-6'
        }
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
