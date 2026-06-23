'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';


const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/categories', label: 'Categories', icon: Tag },
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
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />


          {/* SIDEBAR */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="
              fixed left-0 top-0 bottom-0 z-50 w-80
              bg-background border-r border-border
              shadow-2xl flex flex-col
            "
          >


            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-border">

              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <Image
                  src="/zkr.png"
                  alt="ZKR"
                  width={32}
                  height={32}
                />

                <span className="font-bold text-xl tracking-tight">
                  ZKR
                </span>
              </button>


              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </Button>

            </div>


            {/* NAVIGATION (FIXED PART) */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="
                    w-full flex items-center space-x-3
                    px-3 py-2.5 rounded-lg
                    text-muted-foreground
                    hover:text-foreground hover:bg-muted
                    transition-all duration-200
                    text-left
                  "
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">
                    {link.label}
                  </span>
                </button>
              ))}

            </nav>


            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-border space-y-2 bg-muted/30">


              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/account')}
              >
                <User className="w-4 h-4 mr-2" />
                My Account
              </Button>



              <Button
                variant="ghost"
                className="
                  w-full justify-start
                  text-destructive
                  hover:text-destructive
                  hover:bg-destructive/10
                "
                onClick={() =>
                  signOut({
                    callbackUrl: '/',
                  })
                }
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>

            </div>

          </motion.aside>

        </>
      )}

    </AnimatePresence>
  );
}