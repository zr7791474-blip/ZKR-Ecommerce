'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteProduct } from '@/services/admin-product.service';
import { Button } from '@/components/ui/button';

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${productName}"? This can't be undone from the UI.`)) return;

    setLoading(true);
    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Could not delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Delete ${productName}`}
      className="text-accent hover:bg-accent/10 hover:text-accent"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
