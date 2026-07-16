'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    const shareData = { title, url };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        // AbortError just means the user cancelled the native share sheet —
        // not an error worth surfacing.
        if (err?.name !== 'AbortError') {
          toast.error('Could not share this product');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <Button size="lg" variant="outline" onClick={handleShare} aria-label="Share this product">
      <Share2 className="w-4 h-4" />
    </Button>
  );
}
