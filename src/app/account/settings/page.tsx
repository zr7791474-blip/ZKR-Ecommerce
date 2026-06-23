import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Account Settings | ZKR Store",
};

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Settings className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold">
          Account Settings
        </h1>

        <p className="text-muted-foreground">
          Manage your account preferences and settings.
        </p>

        <Button asChild>
          <Link href="/account">
            Back to Account
          </Link>
        </Button>
      </div>
    </main>
  );
}