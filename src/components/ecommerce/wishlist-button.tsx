'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/wishlist.store';
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
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(productId);
      toast.success('Removed from wishlist');
    } else {
      addItem({
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
    <Button size="lg" variant="outline" onClick={handleClick}>
      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>
  );
}