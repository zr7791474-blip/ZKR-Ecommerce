import Link from "next/link";
import { User, Heart, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Account | ZKR Store",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-6 mb-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold">
            My Account
          </h1>

          <p className="text-muted-foreground">
            Manage your account, wishlist, and settings.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            asChild
            variant="outline"
            className="h-16 justify-start"
          >
            <Link href="/account/wishlist">
              <Heart className="mr-2 h-5 w-5" />
              Wishlist
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-16 justify-start"
          >
            <Link href="/account/settings">
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
} 