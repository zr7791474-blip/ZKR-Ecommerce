'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Gate for actions that require an authenticated user (add to cart, buy now,
 * checkout, wishlist, orders, account pages). Visitors can still browse,
 * search, filter, and view product details without hitting this at all.
 *
 * Usage:
 *   const requireAuth = useRequireAuth();
 *   const handleClick = () => {
 *     if (!requireAuth('add items to your cart')) return;
 *     addItem(...);
 *   };
 */
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Returns true if the user is authenticated and the caller should proceed.
   * Returns false and redirects to /login (preserving the current path so
   * the user lands back where they were) if not.
   */
  function requireAuth(actionLabel = 'continue') {
    if (status === 'loading') return false;

    if (!session?.user) {
      toast.error(`Sign in to ${actionLabel}`, {
        description: 'Create a free account or log in to continue.',
      });
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
      return false;
    }

    return true;
  }

  return requireAuth;
}
