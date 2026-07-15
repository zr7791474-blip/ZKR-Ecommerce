'use client';

import { ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart.store';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { toast } from 'sonner';

type Props = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  productName,
  productSlug,
  productImage,
  productPrice,
  disabled = false,
}: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const requireAuth = useRequireAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!requireAuth('add items to your cart')) return;

    // 🔥 HARD GUARD (prevents 404 forever)
    if (!productSlug) {
      toast.error('Product link missing (slug)');
      return;
    }

    setLoading(true);

    try {
      addItem({
        productId,
        name: productName,
        slug: productSlug, // ✅ now guaranteed
        image: productImage,
        price: productPrice,
        quantity: 1,
      });

      toast.success('Added to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="flex-1"
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}

      {disabled ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}