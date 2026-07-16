'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Menu, Heart, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useCartItemsCount } from '@/stores/cart.store';
import { useWishlistCount } from '@/stores/wishlist.store';

import { ProfileDropdown } from './profile-dropdown';
import { CommandPalette } from './command-palette';
import { MobileMenu } from './mobile-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const cartItemsCount = useCartItemsCount();
  const wishlistCount = useWishlistCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-premium'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[68px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative h-10 w-10 rounded-2xl bg-foreground/[0.04] border border-foreground/[0.08] p-1.5 shadow-premium transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-glow">
                <Image
                  src="/logo.png"
                  alt="ZKR E-Commerce"
                  width={28}
                  height={28}
                  priority
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <span className="font-bold text-lg hidden sm:block tracking-tight leading-none">
                ZKR <span className="text-primary">E-Commerce</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-foreground/[0.02] px-1.5 py-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-foreground bg-foreground/[0.08] shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.08)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.07] hover:border-foreground/[0.14] transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs">Search</span>
                <kbd className="ml-1 hidden md:inline text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/[0.08]">
                  ⌘K
                </kbd>
              </button>

              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden rounded-full bg-foreground/[0.03] border border-foreground/[0.08] hover:bg-foreground/[0.08]"
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="w-[18px] h-[18px]" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex rounded-full bg-foreground/[0.03] border border-foreground/[0.08] hover:bg-foreground/[0.08]"
                  onClick={() =>
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  }
                >
                  {theme === 'dark' ? (
                    <Sun className="w-[18px] h-[18px]" />
                  ) : (
                    <Moon className="w-[18px] h-[18px]" />
                  )}
                </Button>
              )}

              <Link href="/account/wishlist" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full bg-foreground/[0.03] border border-foreground/[0.08] hover:bg-foreground/[0.08]"
                >
                  <Heart className="w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        key={wishlistCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-glow"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full bg-foreground/[0.03] border border-foreground/[0.08] hover:bg-foreground/[0.08]"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {cartItemsCount > 0 && (
                      <motion.span
                        key={cartItemsCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-glow"
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              <div className="w-px h-6 bg-foreground/[0.08] mx-0.5 hidden sm:block" />

              {status !== 'authenticated' && (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              <div className="hidden sm:block">
                <ProfileDropdown />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full bg-foreground/[0.03] border border-foreground/[0.08] hover:bg-foreground/[0.08]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-[18px] h-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}