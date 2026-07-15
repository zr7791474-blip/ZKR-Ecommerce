'use client';

import { useEffect, useState, useCallback } from 'react';

export type RecentlyViewedItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  category?: { name: string; slug: string } | null;
};

const STORAGE_KEY = 'zkr:recently-viewed';
const MAX_ITEMS = 8;

function readStorage(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: RecentlyViewedItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently,
    // recently-viewed is a nice-to-have, not critical functionality.
  }
}

/**
 * Tracks recently viewed products in localStorage (client-only, no backend
 * changes). `trackView` should be called once per product-page visit;
 * `items` is the current list for display, most recent first.
 */
export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
  }, []);

  const trackView = useCallback((item: RecentlyViewedItem) => {
    setItems((prev) => {
      const next = [item, ...prev.filter((p) => p.id !== item.id)].slice(0, MAX_ITEMS);
      writeStorage(next);
      return next;
    });
  }, []);

  return { items, trackView };
}
