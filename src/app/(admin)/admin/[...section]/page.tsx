import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Coming Soon — Admin — ZKR E-Commerce',
};

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Honest placeholder for admin sections that are wired into the sidebar
 * navigation but not built yet, so clicking them lands on a clear "not
 * built yet" state instead of a 404 or — worse — a page that pretends to
 * manage real data it doesn't actually touch.
 */
export default function AdminSectionComingSoon({
  params,
}: {
  params: { section: string[] };
}) {
  const label = titleFromSlug(params.section?.[0] || 'Section');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Construction className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1.5">{label} — Coming Soon</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This section of the admin panel hasn't been built yet. It's linked here as a placeholder so nothing 404s while it's in progress.
          </p>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
