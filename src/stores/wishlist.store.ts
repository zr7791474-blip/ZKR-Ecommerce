'use client';

import { create } from 'zustand';
import { toast } from 'sonner';
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from '@/services/wishlist.service';

export type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
};

type WishlistState = {
  items: WishlistItem[];

  // Renamed conceptually from "zustand hydrated" to "synced with server" —
  // the wishlist is no longer persisted to localStorage at all (a guest's
  // wishlist must never be faked/stored locally), so this now reflects
  // whether the initial server fetch has completed.
  hasHydrated: boolean;

  syncFromServer: () => Promise<void>;
  clearLocal: () => void;

  addItem: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  hasHydrated: false,

  // Called on login (and on mount for an already-authenticated session) to
  // pull the real, server-authoritative wishlist for the current user.
  syncFromServer: async () => {
    try {
      const items = await getWishlistItems();
      set({ items, hasHydrated: true });
    } catch {
      set({ items: [], hasHydrated: true });
    }
  },

  // Called on logout — the in-memory cache is cleared, nothing was ever
  // written to localStorage so there's nothing else to clean up.
  clearLocal: () => set({ items: [], hasHydrated: true }),

  addItem: async (item) => {
    const exists = get().items.some((i) => i.productId === item.productId);
    if (exists) return;

    // Optimistic update
    const optimisticItem = { ...item, id: `optimistic-${item.productId}` };
    set({ items: [...get().items, optimisticItem] });

    try {
      await addToWishlist(item.productId);
    } catch (error) {
      // Roll back on failure
      set({
        items: get().items.filter((i) => i.productId !== item.productId),
      });
      toast.error('Could not add to wishlist. Please try again.');
    }
  },

  removeItem: async (productId) => {
    const previous = get().items;

    // Optimistic update
    set({ items: previous.filter((i) => i.productId !== productId) });

    try {
      await removeFromWishlist(productId);
    } catch (error) {
      // Roll back on failure
      set({ items: previous });
      toast.error('Could not remove from wishlist. Please try again.');
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));

// selectors
export const useWishlistCount = () =>
  useWishlistStore((state) => state.items.length);
