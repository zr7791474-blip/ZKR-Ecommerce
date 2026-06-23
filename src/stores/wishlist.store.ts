'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

  // hydration state (REAL source of truth)
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  addItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  batchAdd: (items: Omit<WishlistItem, 'id'>[]) => void;
  batchRemove: (productIds: string[]) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (item) => {
        const exists = get().items.some(
          (i) => i.productId === item.productId
        );

        if (!exists) {
          set({
            items: [
              ...get().items,
              { ...item, id: crypto.randomUUID() },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(
            (item) => item.productId !== productId
          ),
        });
      },

      isInWishlist: (productId) => {
        return get().items.some(
          (item) => item.productId === productId
        );
      },

      clearWishlist: () => set({ items: [] }),

      batchAdd: (items) => {
        const currentItems = get().items;

        const newItems = items.filter(
          (item) =>
            !currentItems.some(
              (i) => i.productId === item.productId
            )
        );

        set({
          items: [
            ...currentItems,
            ...newItems.map((item) => ({
              ...item,
              id: crypto.randomUUID(),
            })),
          ],
        });
      },

      batchRemove: (productIds) => {
        set({
          items: get().items.filter(
            (item) =>
              !productIds.includes(item.productId)
          ),
        });
      },
    }),
    {
      name: 'zkr-wishlist',
      storage: createJSONStorage(() => localStorage),

      // ✅ proper hydration hook
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// selectors
export const useWishlistCount = () =>
  useWishlistStore((state) => state.items.length);