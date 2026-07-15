import { notFound } from 'next/navigation';
import { adminGetProduct, adminGetCategoriesAndBrands } from '@/services/admin-product.service';
import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'Edit Product — Admin — ZKR E-Commerce',
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [{ categories, brands }, product] = await Promise.all([
    adminGetCategoriesAndBrands(),
    adminGetProduct(params.id).catch(() => null),
  ]);

  if (!product) notFound();

  const p = product as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">{p.name}</p>
      </div>

      <ProductForm
        categories={categories}
        brands={brands}
        productId={p.id}
        defaultValues={{
          name: p.name,
          sku: p.sku,
          description: p.description || '',
          shortDescription: p.shortDescription || '',
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : '',
          stock: p.stock,
          categoryId: p.categoryId,
          brandId: p.brandId || '',
          imageUrl: p.images?.[0]?.url || '',
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          isBestSeller: p.isBestSeller,
        }}
      />
    </div>
  );
}
