import Link from 'next/link';
import Image from 'next/image';
import { Plus, Package, Search } from 'lucide-react';

import { adminListProducts } from '@/services/admin-product.service';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteProductButton } from '@/components/admin/delete-product-button';

export const metadata = {
  title: 'Products — Admin — ZKR E-Commerce',
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { products, total } = await adminListProducts({ search: searchParams.q, page });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">{total} total products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </Button>
      </div>

      <form className="relative max-w-sm">
        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search by name or SKU..."
          className="w-full h-10 pl-10 pr-3 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No products found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {(products as any[]).map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-4">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0">
                  {product.images?.[0]?.url && (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                    {!product.isActive && <Badge variant="outline" size="sm">Inactive</Badge>}
                    {product.isFeatured && <Badge size="sm">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.sku} · {product.category?.name} · Stock: {product.stock}
                  </p>
                </div>

                <p className="font-semibold text-foreground shrink-0">{formatPrice(Number(product.price))}</p>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
