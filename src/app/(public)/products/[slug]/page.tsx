import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
} from 'lucide-react';

import { getProductBySlug } from '@/services/product.service';
import { ProductCard } from '@/components/ecommerce/product-card';
import { AddToCartButton } from '@/components/ecommerce/add-to-cart-button';
import { WishlistButton } from '@/components/ecommerce/wishlist-button';
import { ReviewsSection } from '@/components/ecommerce/reviews-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, calculateDiscount } from '@/lib/utils';

type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
};

type ProductVariant = {
  id: string;
  name: string;
};

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
};

type ProductWithTypes = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock: number;

  shortDescription?: string | null;
  description?: string | null;

  images: ProductImage[];
  variants: ProductVariant[];
  related: RelatedProduct[];

  category: {
    name: string;
    slug: string;
  };

  brand?: {
    name: string;
  } | null;

  avgRating: number;
  ratings: { id?: string }[];
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: `${product.name} — ZKR Store`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = (await getProductBySlug(
    params.slug
  )) as ProductWithTypes | null;

  if (!product) notFound();

  const discount = calculateDiscount(
    Number(product.price),
    product.compareAtPrice ? Number(product.compareAtPrice) : null
  );

  const mainImage = product.images?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {discount > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-4 left-4 text-base px-3 py-1"
              >
                -{discount}%
              </Badge>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img: ProductImage, i: number) => (
                <div
                  key={img.id ?? i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 ring-primary"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-sm text-muted-foreground">
                By {product.brand.name}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i: number) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              {product.avgRating.toFixed(1)} ({product.ratings.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">
              {formatPrice(Number(product.price))}
            </span>

            {product.compareAtPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.compareAtPrice))}
                </span>

                <Badge variant="destructive">
                  Save{' '}
                  {formatPrice(
                    Number(product.compareAtPrice) - Number(product.price)
                  )}
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground">
            {product.shortDescription || product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <span className="text-destructive font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: ProductVariant) => (
                  <Button key={variant.id} variant="outline" size="sm">
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              productImage={mainImage}
              productPrice={Number(product.price)}
              disabled={product.stock === 0}
            />

            <WishlistButton
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              productImage={mainImage}
              productPrice={Number(product.price)}
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            {[
              {
                icon: Truck,
                label: 'Free shipping',
                desc: 'On orders $100+',
              },
              {
                icon: Shield,
                label: 'Secure payment',
                desc: 'SSL encrypted',
              },
              {
                icon: RefreshCw,
                label: 'Easy returns',
                desc: '30-day policy',
              },
            ].map((feature, i: number) => (
              <div key={i} className="text-center space-y-1">
                <feature.icon className="w-6 h-6 mx-auto text-primary" />
                <p className="text-xs font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsSection
        productId={product.id}
        reviews={product.ratings}
        avgRating={product.avgRating}
        totalRatings={product.ratings.length}
      />

      {/* Related Products */}
      {product.related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.related.map((p: RelatedProduct) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}