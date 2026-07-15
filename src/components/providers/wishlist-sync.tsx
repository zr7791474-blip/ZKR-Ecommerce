'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useWishlistStore } from '@/stores/wishlist.store';

/**
 * Invisible — keeps the in-memory wishlist store in sync with the
 * server-authoritative wishlist. Fetches on login, clears on logout.
 * Nothing is ever written to localStorage here.
 */
export function WishlistSync() {
  const { status } = useSession();
  const syncFromServer = useWishlistStore((s) => s.syncFromServer);
  const clearLocal = useWishlistStore((s) => s.clearLocal);
  const lastStatus = useRef<string | null>(null);

  useEffect(() => {
    if (status === lastStatus.current) return;
    lastStatus.current = status;

    if (status === 'authenticated') {
      syncFromServer();
    } else if (status === 'unauthenticated') {
      clearLocal();
    }
  }, [status, syncFromServer, clearLocal]);

  return null;
}
