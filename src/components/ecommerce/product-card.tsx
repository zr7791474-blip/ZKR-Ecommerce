'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistStore } from '@/stores/wishlist.store';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  slug: string;

  price: number | string | { toNumber: () => number };

  compareAtPrice?: number | string | { toNumber: () => number } | null;

  images?: Array<{ url: string }> | string[];

  category?: {
    name: string;
    slug: string;
  } | null;

  isFeatured?: boolean;
  isNew?: boolean;
  stock?: number;

  _count?: {
    ratings?: number;
  };

  averageRating?: number;
};

type ProductCardProps = {
  product: Product;
};

function ProductCardInner({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const requireAuth = useRequireAuth();

  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } =
    useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const priceNum =
    typeof product.price === 'number'
      ? product.price
      : typeof product.price === 'string'
      ? Number(product.price)
      : product.price.toNumber();

  const compareAtPriceNum = product.compareAtPrice
    ? typeof product.compareAtPrice === 'number'
      ? product.compareAtPrice
      : typeof product.compareAtPrice === 'string'
      ? Number(product.compareAtPrice)
      : product.compareAtPrice.toNumber()
    : null;

  const discount = calculateDiscount(priceNum, compareAtPriceNum);

  // ✅ FIXED IMAGE LOGIC
  const getImage = (): string => {
    const first = product.images?.[0];

    if (!first) return '/products/iphone15.jpg';

    const url = typeof first === 'string' ? first : first.url;

    // Return the actual URL if it exists
    if (url) return url;

    return '/products/iphone15.jpg';
  };

  const image = getImage();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth('add items to your cart')) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: priceNum,
      quantity: 1,
    });

    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth('save items to your wishlist')) return;

    if (inWishlist) {
      void removeWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      void addWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image,
        price: priceNum,
      });

      toast.success('Added to wishlist');
    }
  };

  const rating = product.averageRating || 4.5;
  const reviewCount = product._count?.ratings || 0;

  const lowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5;
  const outOfStock = typeof product.stock === 'number' && product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl border border-foreground/[0.08] bg-foreground/[0.02] p-3 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-foreground/[0.14] hover:shadow-glow"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw,25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="accent" size="sm">
              -{discount}%
            </Badge>
          )}

          {product.isNew && (
            <Badge size="sm" className="bg-emerald-500 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.6)]">
              New
            </Badge>
          )}

          {product.isFeatured && <Badge size="sm">Featured</Badge>}

          {lowStock && (
            <Badge variant="warning" size="sm">
              Only {product.stock} left
            </Badge>
          )}

          {outOfStock && (
            <Badge variant="outline" size="sm">
              Out of stock
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-0 opacity-100 md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            variant="glass"
            className="h-9 w-9 rounded-full"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                inWishlist ? 'fill-accent text-accent' : ''
              }`}
            />
          </Button>

          <Link href={`/products/${product.slug}`}>
            <Button
              size="icon"
              variant="glass"
              className="h-9 w-9 rounded-full"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {outOfStock ? 'Unavailable' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <Link href={`/products/${product.slug}`}>
        <div className="space-y-1.5 px-1">
          {product.category?.name && (
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </p>
          )}

          <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-warm">{formatPrice(priceNum)}</span>

            {compareAtPriceNum && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPriceNum)}
              </span>
            )}
          </div>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-warm text-warm" />
              <span className="text-foreground/90">{rating.toFixed(1)}</span>
              <span>({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardInner);