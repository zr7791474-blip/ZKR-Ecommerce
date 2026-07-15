'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  ShoppingBag,
  Tag,
  BookOpen,
  Info,
  Mail,
  User,
  LogOut,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';


const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];


type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};


export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {

  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };


  return (
    <AnimatePresence>

      {isOpen && (
        <>

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />


          {/* SIDEBAR */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="
              fixed left-0 top-0 bottom-0 z-50 w-80
              glass-dark border-r border-foreground/[0.08]
              shadow-premium flex flex-col
            "
          >


            {/* HEADER */}
            <div className="flex flex-col gap-1 p-4 border-b border-foreground/[0.08]">

              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="relative h-9 w-9 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] p-1 transition-all duration-300 group-hover:border-primary/40">
                    <Image
                      src="/logo.png"
                      alt="ZKR E-Commerce"
                      width={24}
                      height={24}
                      className="h-full w-full object-contain rounded-md"
                    />
                  </div>

                  <span className="font-bold text-lg tracking-tight text-foreground leading-none">
                    ZKR <span className="text-primary">E-Commerce</span>
                  </span>
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-foreground/[0.08]"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-[11px] font-medium text-warm tracking-wide pl-[46px]">
                Premium Shopping Experience
              </p>

            </div>


            {/* NAVIGATION (FIXED PART) */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className={`
                      w-full flex items-center gap-3
                      px-3.5 py-2.5 rounded-xl
                      transition-all duration-200
                      text-left group
                      ${
                        isActive
                          ? 'bg-primary/15 text-foreground border border-primary/30 shadow-glow'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] border border-transparent'
                      }
                    `}
                  >
                    <link.icon
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-primary' : ''
                      }`}
                    />
                    <span className="font-medium">
                      {link.label}
                    </span>
                  </button>
                );
              })}

            </nav>


            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-foreground/[0.08] space-y-2">

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/account')}
              >
                <User className="w-4 h-4" />
                My Account
              </Button>



              <Button
                variant="ghost"
                className="
                  w-full justify-start
                  text-accent
                  hover:text-accent
                  hover:bg-accent/10
                "
                onClick={() =>
                  signOut({
                    callbackUrl: '/',
                  })
                }
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>

            </div>

          </motion.aside>

        </>
      )}

    </AnimatePresence>
  );
}