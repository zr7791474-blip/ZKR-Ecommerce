'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;

  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  batchUpdate: (updates: Array<{ id: string; quantity: number }>) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      addItem: (item) => {
        const items = get().items;

        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId
        );

        if (existingIndex >= 0) {
          const newItems = [...items];

          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity:
              newItems[existingIndex].quantity + item.quantity,
          };

          set({ items: newItems });
        } else {
          set({
            items: [
              ...items,
              { ...item, id: crypto.randomUUID() },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      batchUpdate: (updates) => {
        const items = get()
          .items.map((item) => {
            const update = updates.find((u) => u.id === item.id);

            if (update) {
              return { ...item, quantity: update.quantity };
            }

            return item;
          })
          .filter((item) => item.quantity > 0);

        set({ items });
      },
    }),
    {
      name: 'zkr-cart',
      storage: createJSONStorage(() => localStorage),

      // 🔥 FIX hydration issue
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);

// 🔥 SAFE SELECTORS (IMPORTANT FIX)
export const useCartItemsCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  );