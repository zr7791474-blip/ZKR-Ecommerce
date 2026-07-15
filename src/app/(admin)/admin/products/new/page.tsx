import { adminGetCategoriesAndBrands } from '@/services/admin-product.service';
import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'New Product — Admin — ZKR E-Commerce',
};

export default async function NewProductPage() {
  const { categories, brands } = await adminGetCategoriesAndBrands();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">Create a new product listing.</p>
      </div>

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
