'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/wishlist.store';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { toast } from 'sonner';

type Props = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
};

export function WishlistButton({
  productId,
  productName,
  productSlug,
  productImage,
  productPrice,
}: Props) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const requireAuth = useRequireAuth();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!requireAuth('save items to your wishlist')) return;

    if (inWishlist) {
      void removeItem(productId);
      toast.success('Removed from wishlist');
    } else {
      void addItem({
        productId,
        name: productName,
        slug: productSlug,
        image: productImage,
        price: productPrice,
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <Button size="lg" variant="outline" onClick={handleClick} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
    </Button>
  );
}