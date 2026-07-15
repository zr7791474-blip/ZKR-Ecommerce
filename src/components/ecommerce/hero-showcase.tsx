'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ArrowRight,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistStore } from '@/stores/wishlist.store';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { toast } from 'sonner';

export type ShowcaseProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: Array<{ url: string }>;
  category?: { name: string; slug: string } | null;
  description?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  stock?: number;
  averageRating?: number;
  _count?: { ratings?: number };
};

const ROTATE_MS = 4500;

export function HeroShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const requireAuth = useRequireAuth();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = products.length;
  const product = products[index];
  const inWishlist = product ? isInWishlist(product.id) : false;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setDirection(next > index || (index === count - 1 && next === 0) ? 1 : -1);
      setIndex(((next % count) + count) % count);
    },
    [count, index]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  // Preload the next image so rotation never shows a blank frame
  useEffect(() => {
    if (count <= 1) return;
    const nextProduct = products[(index + 1) % count];
    const src = nextProduct?.images?.[0]?.url;
    if (!src) return;
    const img = new window.Image();
    img.src = src;
  }, [index, count, products]);

  if (!product) return null;

  const image = product.images?.[0]?.url || '/placeholder.png';
  const discount = calculateDiscount(product.price, product.compareAtPrice ?? null);
  const isDemo = product.id.startsWith('demo-');
  const rating = product.averageRating ?? 0;
  const reviewCount = product._count?.ratings ?? 0;
  const inStock = (product.stock ?? 1) > 0;

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) goNext();
    else if (info.offset.x > 80) goPrev();
  };

  const handleShopNow = () => {
    if (!requireAuth('add items to your cart')) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      quantity: 1,
    });
    toast.success('Added to cart');
  };

  const handleWishlist = () => {
    if (!requireAuth('save items to your wishlist')) return;
    if (inWishlist) {
      removeWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image,
        price: product.price,
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative rounded-[28px] border border-foreground/[0.08] bg-foreground/[0.02] backdrop-blur-xl p-3 shadow-premium"
    >
      <div className="relative rounded-3xl overflow-hidden bg-muted aspect-[16/9] md:aspect-[16/7.5]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={product.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 cursor-grab active:cursor-grabbing"
          >
            {/* Image */}
            <div className="relative h-full min-h-[220px] order-1 md:order-2">
              <Image
                src={image}
                alt={product.name}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 md:from-transparent md:bg-gradient-to-l md:via-transparent md:to-transparent" />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discount > 0 && (
                  <Badge variant="accent" size="sm">-{discount}%</Badge>
                )}
                {product.isNew && <Badge variant="success" size="sm">New</Badge>}
                {product.isFeatured && <Badge size="sm">Featured</Badge>}
              </div>

              <button
                onClick={handleWishlist}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-foreground/[0.08] backdrop-blur-md border border-foreground/[0.1] flex items-center justify-center text-white hover:bg-foreground/[0.14] transition-colors"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
              </button>
            </div>

            {/* Content */}
            <div className="relative order-2 md:order-1 p-6 md:p-10 flex flex-col justify-center gap-3 bg-card">
              {product.category?.name && (
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  {product.category.name}
                </p>
              )}

              <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight line-clamp-2">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(rating) ? 'fill-warm text-warm' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                {reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                )}
                <span className={`text-xs font-medium ${inStock ? 'text-success' : 'text-accent'}`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-bold text-warm">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button onClick={handleShopNow} disabled={!inStock}>
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>

                {isDemo ? (
                  <Button variant="outline" asChild>
                    <Link href={`/products?category=${product.category?.slug ?? ''}`}>
                      Browse Similar
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href={`/products/${product.slug}`}>View Details</Link>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Truck className="w-3.5 h-3.5 text-primary" />
                Free shipping on orders over $100
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        {count > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous product"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-foreground/[0.08] backdrop-blur-md border border-foreground/[0.1] flex items-center justify-center text-white hover:bg-foreground/[0.16] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next product"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-foreground/[0.08] backdrop-blur-md border border-foreground/[0.1] flex items-center justify-center text-white hover:bg-foreground/[0.16] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4 pb-1 overflow-x-auto">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 shrink-0 ${
                i === index ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/20 hover:bg-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
