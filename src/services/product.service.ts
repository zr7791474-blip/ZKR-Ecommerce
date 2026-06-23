'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { cacheGet, cacheSet, cacheDel } from '@/lib/redis';
import { productSchema, ProductInput } from '@/lib/validations';
import { slugify } from '@/lib/utils';

type ProductFilters = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
  page?: number;
  limit?: number;
};

type ProductResult = {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getProducts(filters: ProductFilters = {}): Promise<ProductResult> {
  try {
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cached = await cacheGet<ProductResult>(cacheKey);
    if (cached) return cached;

    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      isFeatured,
      isNew,
      isBestSeller,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = filters;

    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isNew !== undefined) where.isNew = isNew;
    if (isBestSeller !== undefined) where.isBestSeller = isBestSeller;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {
      newest: { createdAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      popular: { createdAt: 'desc' },
      rating: { createdAt: 'desc' },
    }[sortBy];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
          _count: {
            select: { reviews: true, ratings: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const result: ProductResult = {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await cacheSet(cacheKey, result, 300);
    return result;
  } catch (error) {
    console.error('getProducts error:', error);
    return {
      products: [],
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 12,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const cacheKey = `product:slug:${slug}`;
    const cached = await cacheGet<any>(cacheKey);
    if (cached) return cached;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
        ratings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return null;

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
        deletedAt: null,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          orderBy: { position: 'asc' },
          take: 1,
          select: { url: true },
        },
      },
    });

    const ratings = product.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce(
            (sum: number, r: any) =>
              sum + Number(r.value ?? r.rating ?? 0),
            0
          ) / ratings.length
        : 0;

    const result = {
      ...product,
      avgRating,
      related,
    };

    await cacheSet(cacheKey, result, 300);
    return result;
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const cacheKey = 'products:featured';
    const cached = await cacheGet<any[]>(cacheKey);
    if (cached) return cached;

    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await cacheSet(cacheKey, products, 300);
    return products;
  } catch (error) {
    console.error('getFeaturedProducts error:', error);
    return [];
  }
}

export async function getNewArrivals() {
  try {
    const cacheKey = 'products:new';
    const cached = await cacheGet<any[]>(cacheKey);
    if (cached) return cached;

    const products = await prisma.product.findMany({
      where: { isNew: true, isActive: true },
      take: 8,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await cacheSet(cacheKey, products, 300);
    return products;
  } catch (error) {
    console.error('getNewArrivals error:', error);
    return [];
  }
}

export async function getBestSellers() {
  try {
    const cacheKey = 'products:bestsellers';
    const cached = await cacheGet<any[]>(cacheKey);
    if (cached) return cached;

    const products = await prisma.product.findMany({
      where: { isBestSeller: true, isActive: true },
      take: 8,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await cacheSet(cacheKey, products, 300);
    return products;
  } catch (error) {
    console.error('getBestSellers error:', error);
    return [];
  }
}