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
                <Search className="mr-3 h-5 w-5 shrink-0 text-primary" />
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
              <Command.List className="max-h-[400px] overflow-y-auto p-2.5">
                <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

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