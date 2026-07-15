import Link from 'next/link';
import { User, Heart, Settings, Package, ChevronRight } from 'lucide-react';

import { auth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'My Account | ZKR E-Commerce',
};

const links = [
  { href: '/account/orders', label: 'My Orders', desc: 'Track and review your order history', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', desc: 'Products you have saved for later', icon: Heart },
  { href: '/account/settings', label: 'Settings', desc: 'Update your profile and preferences', icon: Settings },
];

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="relative max-w-2xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative text-center space-y-4 mb-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {user?.name ? `Welcome back, ${user.name}` : 'My Account'}
          </h1>
          {user?.email && (
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          )}
        </div>
      </div>

      <div className="relative space-y-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="border-border/60 hover:border-primary/30 transition-colors duration-300" hover>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="h-11 w-11 rounded-xl bg-secondary/60 border border-border/60 flex items-center justify-center shrink-0">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
