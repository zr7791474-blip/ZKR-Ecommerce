'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart.store';
import { useRequireAuth } from '@/hooks/use-require-auth';

type Props = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  disabled?: boolean;
};

/**
 * Adds the product to the cart and takes the user straight to checkout —
 * reuses the same cart store and auth gate as AddToCartButton rather than
 * introducing a separate purchase path.
 */
export function BuyNowButton({
  productId,
  productName,
  productSlug,
  productImage,
  productPrice,
  disabled = false,
}: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (loading) return;
    if (!requireAuth('buy this now')) return;

    setLoading(true);

    addItem({
      productId,
      name: productName,
      slug: productSlug,
      image: productImage,
      price: productPrice,
      quantity: 1,
    });

    router.push('/checkout');
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
      Buy Now
    </Button>
  );
}
