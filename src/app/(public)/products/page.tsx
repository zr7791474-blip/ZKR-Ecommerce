// src/app/(public)/products/page.tsx

import { Suspense } from 'react';
import { ProductCard } from '@/components/ecommerce/product-card';
import { ProductFilters } from '@/components/ecommerce/product-filters';
import { ProductGridSkeleton } from '@/components/ecommerce/product-skeleton';
import { getProducts } from '@/services/product.service';
import { Pagination } from '@/components/ui/pagination';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: any[];
  category?: {
    name: string;
    slug: string;
  } | null;
  brand?: {
    name: string;
    slug: string;
  } | null;
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
};

type Props = {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    featured?: string;
    new?: string;
    sale?: string;
  };
};

export const metadata = {
  title: 'Products — ZKR',
  description: 'Browse our complete collection of premium products.',
};

export default async function ProductsPage({ searchParams }: Props) {

  const page = Number(searchParams.page) || 1;

  const { products, pagination } = await getProducts({
    search: searchParams.search,

    categoryId: searchParams.category,

    brandId: searchParams.brand,

    minPrice: searchParams.minPrice
      ? Number(searchParams.minPrice)
      : undefined,

    maxPrice: searchParams.maxPrice
      ? Number(searchParams.maxPrice)
      : undefined,


    // IMPORTANT FIX
    // only filter when URL contains true
    isFeatured:
      searchParams.featured === 'true'
        ? true
        : undefined,


    isNew:
      searchParams.new === 'true'
        ? true
        : undefined,


    sortBy:
      (searchParams.sort as any) || 'newest',


    page,

    limit: 12,
  });


  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold mb-2">
          Products
        </h1>


        <p className="text-muted-foreground">
          {pagination.total} products found
        </p>

      </div>



      <div className="grid lg:grid-cols-[280px_1fr] gap-8">


        <aside className="lg:sticky lg:top-20 lg:self-start">

          <ProductFilters />

        </aside>



        <div>

          <Suspense fallback={<ProductGridSkeleton />}>


            {
              products.length === 0 ? (

                <div className="text-center py-20">

                  <p className="text-muted-foreground">
                    No products found
                  </p>

                </div>


              ) : (


                <>


                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">


                    {(products as Product[]).map((product) => (

                      <ProductCard
                        key={product.id}
                        product={product}
                      />

                    ))}


                  </div>



                  {
                    pagination.totalPages > 1 && (

                      <div className="mt-8">

                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                        />

                      </div>

                    )
                  }



                </>


              )
            }


          </Suspense>


        </div>


      </div>


    </div>
  );
}