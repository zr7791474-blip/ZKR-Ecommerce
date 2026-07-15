'use client';

import Link from 'next/link';
import Image from 'next/image';

import {
  Mail,
  Lock,
  Truck,
  RotateCcw,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

import {
  SiX,
  SiWhatsapp,
  SiGithub,
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiApplepay,
} from 'react-icons/si';

import { Button } from '@/components/ui/button';

const footerLinks = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/products?featured=true', label: 'Featured' },
    { href: '/products?new=true', label: 'New Arrivals' },
    { href: '/products?sale=true', label: 'Sale' },
  ],

  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],

  support: [
    { href: '/help', label: 'Help Center' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping Info' },
    { href: '/returns', label: 'Returns' },
    { href: '/track-order', label: 'Track Order' },
  ],

  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

const socialLinks = [
  { label: 'X', href: 'https://x.com/zkr_ad', icon: SiX },
  { label: 'WhatsApp', href: 'https://wa.me/212657516301', icon: SiWhatsapp },
  { label: 'GitHub', href: 'https://github.com/zr7791474-blip', icon: SiGithub },
  {
    label: 'Email',
    href: 'mailto:zr7791474@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria',
    icon: Mail,
  },
];

const paymentIcons = [SiVisa, SiMastercard, SiPaypal, SiApplepay];

const trustBadges = [
  { icon: Lock, label: 'Secure payments' },
  { icon: Truck, label: 'Fast shipping' },
  { icon: RotateCcw, label: 'Easy returns' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/[0.08] bg-background overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/[0.06] blur-[120px]" />

      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-1.5 group w-fit">
              <div className="relative h-9 w-9 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] p-1 transition-all duration-300 group-hover:border-primary/40">
                <Image
                  src="/logo.png"
                  alt="ZKR E-Commerce"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain rounded-md"
                />
              </div>
              <span className="font-bold text-xl tracking-tight leading-none">
                ZKR <span className="text-primary">E-Commerce</span>
              </span>
            </Link>

            <p className="text-xs font-medium text-warm mb-4 tracking-wide">
              Premium Shopping Experience
            </p>

            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Premium e-commerce platform for modern shoppers.
            </p>

            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary hover:border-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-5 text-sm capitalize text-foreground tracking-wide">
                {title}
              </h3>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl border border-foreground/[0.08] bg-foreground/[0.03] backdrop-blur-sm p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-lg mb-1 text-foreground">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-muted-foreground">
                Get updates on new products and exclusive offers.
              </p>
            </div>

            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 h-11 rounded-full bg-foreground/[0.05] border border-foreground/[0.1] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
              />
              <Button type="submit" size="lg" className="shrink-0 px-6">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-foreground/[0.08] flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>© 2026 ZKR E-Commerce. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {trustBadges.map((badge) => (
              <span key={badge.label} className="flex items-center gap-1.5">
                <badge.icon className="w-4 h-4 text-primary" />
                {badge.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {paymentIcons.map((Icon, i) => (
              <div
                key={i}
                className="h-7 w-11 rounded-md bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center text-muted-foreground"
              >
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
