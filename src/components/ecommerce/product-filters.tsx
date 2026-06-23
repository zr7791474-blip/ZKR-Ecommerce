'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Search</Label>
          <Input
            placeholder="Search products..."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <div>
          <Label>Sort by</Label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={searchParams.get('sort') || 'newest'}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/products')}
        >
          Clear all filters
        </Button>
      </CardContent>
    </Card>
  );
}