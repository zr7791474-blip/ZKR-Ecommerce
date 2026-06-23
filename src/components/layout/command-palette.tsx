'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Package, User, Settings, LogOut, Moon, Sun, Home, ShoppingBag } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');

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

  const runCommand = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/20 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
              shouldFilter={false}
            >
              <div className="flex items-center border-b border-border px-4">
                <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search products, pages, commands..."
                  className="flex h-14 w-full rounded-md bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="p-2 text-xs font-semibold text-muted-foreground">
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

                <Command.Group heading="Commands" className="p-2 text-xs font-semibold text-muted-foreground">
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
              </Command.List>
              <div className="border-t border-border p-3 text-xs text-muted-foreground flex justify-between bg-muted/30">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">↑↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">↵</kbd> to select</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">esc</kbd> to close</span>
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
      className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted/50 transition-colors"
    >
      <span className="mr-3 text-muted-foreground">{icon}</span>
      <span className="font-medium">{children}</span>
    </Command.Item>
  );
}