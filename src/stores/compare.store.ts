'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CompareItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category?: string | null;
  brand?: string | null;
  averageRating?: number;
  stock?: number;
};

type CompareState = {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isComparing: (productId: string) => boolean;
};

const MAX_COMPARE = 4;

// Compare lists are a lightweight browsing convenience, not account data —
// unlike wishlist, nothing here requires a login or server persistence, so
// a local-only store is the right call.
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.productId === item.productId)) return;

        if (items.length >= MAX_COMPARE) {
          set({ items: [...items.slice(1), item] });
          return;
        }

        set({ items: [...items, item] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear: () => set({ items: [] }),

      isComparing: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: 'zkr-compare' }
  )
);

export const useCompareCount = () => useCompareStore((state) => state.items.length);
