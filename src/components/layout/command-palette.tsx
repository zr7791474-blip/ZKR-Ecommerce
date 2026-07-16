'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Package, User, Settings, Moon, Sun, Home, ShoppingBag, Loader2, Clock, TrendingUp, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images?: Array<{ url: string }>;
  category?: { name: string } | null;
};

const HISTORY_KEY = 'zkr:search-history';
const MAX_HISTORY = 5;

const trendingSearches = ['Wireless Earbuds', 'Sneakers', 'Smartwatch', 'Backpack', 'Headphones'];

function readHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: string[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    // best-effort only
  }
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-warm/30 text-foreground rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) setHistory(readHistory());
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Debounced live product search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = search.trim();
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const recordSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    const next = [term, ...readHistory().filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, MAX_HISTORY);
    writeHistory(next);
  }, []);

  const clearHistory = () => {
    writeHistory([]);
    setHistory([]);
  };

  const runCommand = (action: () => void) => {
    action();
    onClose();
  };

  const goToProduct = (product: SearchProduct) => {
    recordSearch(search.trim() || product.name);
    runCommand(() => router.push(`/products/${product.slug}`));
  };

  const goToSearch = (term: string) => {
    recordSearch(term);
    runCommand(() => router.push(`/products?search=${encodeURIComponent(term)}`));
  };

  const query = search.trim();
  const showBrowseState = query.length < 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[16vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              className="rounded-3xl border border-foreground/[0.1] bg-popover/95 backdrop-blur-2xl shadow-premium overflow-hidden"
              shouldFilter={false}
            >
              <div className="flex items-center border-b border-foreground/[0.08] px-5">
                {loading ? (
                  <Loader2 className="mr-3 h-5 w-5 shrink-0 text-primary animate-spin" />
                ) : (
                  <Search className="mr-3 h-5 w-5 shrink-0 text-primary" />
                )}
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search products, pages, commands..."
                  className="flex h-16 w-full rounded-md bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
                <kbd className="hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/[0.08] text-muted-foreground">
                  esc
                </kbd>
              </div>
              <Command.List className="max-h-[420px] overflow-y-auto p-2.5">
                {!showBrowseState && !loading && results.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No products found for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>.
                    <div className="mt-3">
                      <button
                        onClick={() => goToSearch(query)}
                        className="text-primary hover:underline text-sm"
                      >
                        Search all products anyway
                      </button>
                    </div>
                  </div>
                )}

                {!showBrowseState && results.length > 0 && (
                  <Command.Group heading="Products" className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [&_[cmdk-group-heading]]:px-2">
                    {results.map((product) => (
                      <Command.Item
                        key={product.id}
                        onSelect={() => goToProduct(product)}
                        className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/90 outline-none aria-selected:bg-primary/15 aria-selected:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)] hover:bg-foreground/[0.05] transition-colors duration-150"
                      >
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {product.images?.[0]?.url && (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            <HighlightMatch text={product.name} query={query} />
                          </p>
                          {product.category?.name && (
                            <p className="text-xs text-muted-foreground">{product.category.name}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-warm shrink-0">{formatPrice(product.price)}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {showBrowseState && (
                  <>
                    {history.length > 0 && (
                      <Command.Group
                        heading="Recent Searches"
                        className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [&_[cmdk-group-heading]]:px-2"
                      >
                        <div className="flex items-center justify-between px-2 -mt-1 mb-1">
                          <span />
                          <button
                            onClick={clearHistory}
                            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Clear
                          </button>
                        </div>
                        {history.map((term) => (
                          <CommandItem key={term} icon={<Clock className="w-4 h-4" />} onSelect={() => goToSearch(term)}>
                            {term}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    )}

                    <Command.Group heading="Trending Searches" className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [&_[cmdk-group-heading]]:px-2">
                      {trendingSearches.map((term) => (
                        <CommandItem key={term} icon={<TrendingUp className="w-4 h-4" />} onSelect={() => goToSearch(term)}>
                          {term}
                        </CommandItem>
                      ))}
                    </Command.Group>

                    <Command.Group heading="Navigation" className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [&_[cmdk-group-heading]]:px-2">
                      <CommandItem icon={<Home className="w-4 h-4" />} onSelect={() => runCommand(() => router.push('/'))}>
                        Home
                      </CommandItem>
                      <CommandItem icon={<ShoppingBag className="w-4 h-4" />} onSelect={() => runCommand(() => router.push('/products'))}>
                        Products
                      </CommandItem>
                      <CommandItem icon={<Package className="w-4 h-4" />} onSelect={() => runCommand(() => router.push('/categories'))}>
                        Categories
                      </CommandItem>
                      <CommandItem icon={<User className="w-4 h-4" />} onSelect={() => runCommand(() => router.push('/account'))}>
                        My Account
                      </CommandItem>
                    </Command.Group>

                    <Command.Group heading="Commands" className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [&_[cmdk-group-heading]]:px-2">
                      <CommandItem
                        icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                      >
                        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                      </CommandItem>
                      <CommandItem icon={<Settings className="w-4 h-4" />} onSelect={() => runCommand(() => router.push('/account/settings'))}>
                        Settings
                      </CommandItem>
                    </Command.Group>
                  </>
                )}
              </Command.List>
              <div className="border-t border-foreground/[0.08] p-3.5 text-xs text-muted-foreground flex justify-between bg-foreground/[0.02]">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/[0.08] text-[10px]">↑↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/[0.08] text-[10px]">↵</kbd> to select</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/[0.08] text-[10px]">esc</kbd> to close</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({
  icon,
  children,
  onSelect,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-pointer select-none items-center rounded-xl px-3.5 py-2.5 text-sm text-foreground/90 outline-none aria-selected:bg-primary/15 aria-selected:text-foreground aria-selected:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)] hover:bg-foreground/[0.05] transition-colors duration-150"
    >
      <span className="mr-3 text-primary">{icon}</span>
      <span className="font-medium">{children}</span>
    </Command.Item>
  );
}