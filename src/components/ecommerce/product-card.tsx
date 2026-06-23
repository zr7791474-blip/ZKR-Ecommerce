'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistStore } from '@/stores/wishlist.store';
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

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

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

    if (inWishlist) {
      removeWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addWishlist({
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw,25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="destructive" size="sm">
              -{discount}%
            </Badge>
          )}

          {product.isNew && (
            <Badge className="bg-green-500" size="sm">
              New
            </Badge>
          )}

          {product.isFeatured && <Badge size="sm">Featured</Badge>}
        </div>

        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-background/90 backdrop-blur-sm shadow-lg"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`w-4 h-4 ${
                inWishlist ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
        </div>

        <div className="absolute bottom-2 left-2 right-2">
          <Button
            size="sm"
            className="w-full bg-background/90 text-foreground shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <Link href={`/products/${product.slug}`}>
        <div className="space-y-1">
          {product.category?.name && (
            <p className="text-xs text-muted-foreground">
              {product.category.name}
            </p>
          )}

          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(priceNum)}</span>

            {compareAtPriceNum && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPriceNum)}
              </span>
            )}
          </div>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span>({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}