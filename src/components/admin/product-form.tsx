'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { productAdminSchema, type ProductAdminInput } from '@/lib/validations';
import { createProduct, updateProduct } from '@/services/admin-product.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

type Option = { id: string; name: string };

const selectClass =
  'flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const textareaClass =
  'flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]';

export function ProductForm({
  categories,
  brands,
  productId,
  defaultValues,
}: {
  categories: Option[];
  brands: Option[];
  productId?: string;
  defaultValues?: Partial<ProductAdminInput>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductAdminInput>({
    resolver: zodResolver(productAdminSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: ProductAdminInput) => {
    setLoading(true);
    try {
      if (productId) {
        await updateProduct(productId, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Product Name</Label>
            <Input {...register('name')} placeholder="e.g. Wireless Earbuds Pro" />
            {errors.name && <p className="text-xs text-accent">{errors.name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="e.g. ZKR-EARBUDS-01" />
              {errors.sku && <p className="text-xs text-accent">{errors.sku.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input {...register('imageUrl')} placeholder="/products/airpods.jpg" />
              {errors.imageUrl && <p className="text-xs text-accent">{errors.imageUrl.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Short Description</Label>
            <Input {...register('shortDescription')} placeholder="One-line summary shown on product cards" />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea {...register('description')} className={textareaClass} placeholder="Full product description" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-xs text-accent">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Compare-at Price ($)</Label>
              <Input type="number" step="0.01" {...register('compareAtPrice')} placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input type="number" {...register('stock')} />
              {errors.stock && <p className="text-xs text-accent">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select {...register('categoryId')} className={selectClass}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-accent">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <select {...register('brandId')} className={selectClass}>
                <option value="">No brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              ['isActive', 'Active'],
              ['isFeatured', 'Featured'],
              ['isNew', 'New'],
              ['isBestSeller', 'Best Seller'],
            ] as const).map(([field, label]) => (
              <Controller
                key={field}
                name={field}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={value} onCheckedChange={onChange} />
                    {label}
                  </label>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {productId ? 'Save Changes' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
