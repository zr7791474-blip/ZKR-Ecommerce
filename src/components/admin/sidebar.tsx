'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Percent,
  Star,
  BarChart3,
  Settings,
  FileText,
  Image as ImageIcon,
  Bell,
  Mail,
  Database,
  Shield,
  Layers,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/categories', label: 'Categories', icon: Layers },
      { href: '/admin/brands', label: 'Brands', icon: Boxes },
      { href: '/admin/inventory', label: 'Inventory', icon: Database },
      { href: '/admin/media', label: 'Media', icon: ImageIcon },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/coupons', label: 'Coupons', icon: Percent },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/blog', label: 'Blog', icon: FileText },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
      { href: '/admin/messages', label: 'Messages', icon: Mail },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/employees', label: 'Employees', icon: Users },
      { href: '/admin/roles', label: 'Roles', icon: Shield },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/logs', label: 'Logs', icon: FileText },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-background border-r border-border hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg">
              Z
            </div>
            <div>
              <p className="font-bold">ZKR Admin</p>
              <p className="text-xs text-muted-foreground">Management Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {menuItems.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>View Store</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}